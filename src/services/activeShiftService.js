const ActiveShift = require('../models/ActiveShift');
const Route = require('../models/Route');
const Stop = require('../models/Stop');
const config = require('../config');
const staffScheduleService = require('./staffScheduleService');
const {
    triggerDispatchInBackground,
} = require('./pushDispatchService');

function assertLatLng(lat, lng) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error('lat/lng không hợp lệ');
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('lat/lng ngoài phạm vi');
    }
}

function normalizePlate(value) {
    return String(value || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '');
}

async function checkIn(staffId, payload = {}) {
    const existing = await ActiveShift.findOne({ staffId, status: 'active' }).populate(
        'routeId',
        'code name startName endName'
    );
    if (existing) {
        return existing;
    }

    let schedule = null;
    if (payload.scheduleId) {
        schedule = await staffScheduleService.getScheduleForCheckIn(
            payload.scheduleId,
            staffId
        );
    }

    let routeName = '';
    let routeCode = '';
    let routeId = payload.routeId || schedule?.routeId?._id || schedule?.routeId || null;
    let scheduleId = schedule?._id || null;

    if (routeId) {
        const route =
            schedule?.routeId && typeof schedule.routeId === 'object'
                ? schedule.routeId
                : await Route.findById(routeId).select('code name');
        if (!route) {
            throw new Error('Tuyến không tồn tại');
        }
        routeName = String(
            payload.routeName ||
                schedule?.routeName ||
                `${route.code} - ${route.name}`
        ).trim();
        routeCode = String(
            payload.routeCode || schedule?.routeCode || route.code || ''
        ).trim();
    } else {
        routeName = String(payload.routeName || schedule?.routeName || '').trim();
        routeCode = String(payload.routeCode || schedule?.routeCode || '').trim();
    }

    const plateNumber = String(
        payload.plateNumber || schedule?.plateNumber || ''
    ).trim();

    const created = await ActiveShift.create({
        staffId,
        scheduleId,
        routeId,
        routeName,
        routeCode,
        plateNumber,
        vehicleId: payload.vehicleId || null,
        currentStopOrder: 0,
        shiftStartAt: new Date(),
        status: 'active',
    });

    if (scheduleId) {
        await staffScheduleService.markScheduleInProgress(scheduleId, staffId);
    }

    return ActiveShift.findById(created._id).populate(
        'routeId',
        'code name startName endName'
    );
}

async function getActiveShift(staffId) {
    return ActiveShift.findOne({ staffId, status: 'active' }).populate(
        'routeId',
        'code name startName endName'
    );
}

async function endActiveShift(staffId) {
    const shift = await ActiveShift.findOne({ staffId, status: 'active' });
    if (!shift) {
        return null;
    }

    shift.status = 'ended';
    shift.shiftEndAt = new Date();
    await shift.save();

    if (shift.scheduleId) {
        await staffScheduleService.markScheduleCompleted(shift.scheduleId, staffId);
    }

    return shift;
}

async function updateLocation(staffId, payload = {}) {
    const shift = await ActiveShift.findOne({ staffId, status: 'active' });
    if (!shift) {
        throw new Error('Không có ca đang chạy');
    }

    const lat = Number(payload.lat);
    const lng = Number(payload.lng);
    assertLatLng(lat, lng);

    // GPS cố định trên xe ưu tiên hơn phone staff nếu vừa cập nhật gần đây
    if (
        shift.locationSource === 'vehicle' &&
        shift.lastLocationAt &&
        Date.now() - new Date(shift.lastLocationAt).getTime() < 90 * 1000
    ) {
        return shift;
    }

    shift.lastLat = lat;
    shift.lastLng = lng;
    shift.lastLocationAt = new Date();
    shift.locationSource = 'staff';
    if (payload.heading != null && Number.isFinite(Number(payload.heading))) {
        shift.heading = Number(payload.heading);
    }
    if (
        payload.currentStopOrder != null &&
        Number.isFinite(Number(payload.currentStopOrder))
    ) {
        shift.currentStopOrder = Math.max(0, Math.floor(Number(payload.currentStopOrder)));
    }

    await shift.save();
    triggerDispatchInBackground();
    return shift;
}

/**
 * A1-Full: thiết bị GPS/tablet trên xe đẩy vị trí theo biển số.
 * Yêu cầu ca active đã gắn plateNumber khớp.
 */
async function updateLocationByVehicleDevice(payload = {}, deviceKey) {
    const expected = config.vehicleGpsSecret;
    if (!expected || deviceKey !== expected) {
        throw new Error('deviceKey không hợp lệ');
    }

    const plate = normalizePlate(payload.plateNumber);
    if (!plate) {
        throw new Error('plateNumber là bắt buộc');
    }

    const lat = Number(payload.lat);
    const lng = Number(payload.lng);
    assertLatLng(lat, lng);

    const shifts = await ActiveShift.find({ status: 'active' });
    const shift = shifts.find(
        (item) => normalizePlate(item.plateNumber) === plate
    );
    if (!shift) {
        throw new Error('Không có ca active với biển số này');
    }

    shift.lastLat = lat;
    shift.lastLng = lng;
    shift.lastLocationAt = new Date();
    shift.locationSource = 'vehicle';
    if (payload.heading != null && Number.isFinite(Number(payload.heading))) {
        shift.heading = Number(payload.heading);
    }
    if (
        payload.currentStopOrder != null &&
        Number.isFinite(Number(payload.currentStopOrder))
    ) {
        shift.currentStopOrder = Math.max(
            0,
            Math.floor(Number(payload.currentStopOrder))
        );
    }

    await shift.save();
    triggerDispatchInBackground();
    return shift;
}

async function advanceStop(staffId, payload = {}) {
    const shift = await ActiveShift.findOne({ staffId, status: 'active' });
    if (!shift) {
        throw new Error('Không có ca đang chạy');
    }
    if (!shift.routeId) {
        throw new Error('Ca chưa gắn tuyến');
    }

    const stops = await Stop.find({ routeId: shift.routeId })
        .sort({ order: 1, createdAt: 1 })
        .select('_id name order location');

    if (!stops.length) {
        throw new Error('Tuyến chưa có điểm dừng');
    }

    const maxIndex = stops.length - 1;
    let nextIndex =
        payload.stopIndex != null
            ? Math.floor(Number(payload.stopIndex))
            : shift.currentStopOrder + 1;

    if (!Number.isFinite(nextIndex)) {
        nextIndex = shift.currentStopOrder + 1;
    }
    nextIndex = Math.min(Math.max(nextIndex, 0), maxIndex);

    shift.currentStopOrder = nextIndex;

    const stop = stops[nextIndex];
    if (stop?.location?.coordinates?.length >= 2) {
        const [lng, lat] = stop.location.coordinates;
        shift.lastLat = lat;
        shift.lastLng = lng;
        shift.lastLocationAt = new Date();
        shift.locationSource = 'stop';
    }

    await shift.save();
    triggerDispatchInBackground();

    return {
        shift,
        currentStop: stop,
        stopIndex: nextIndex,
        isLastStop: nextIndex >= maxIndex,
        totalStops: stops.length,
    };
}

module.exports = {
    checkIn,
    getActiveShift,
    endActiveShift,
    updateLocation,
    updateLocationByVehicleDevice,
    advanceStop,
};
