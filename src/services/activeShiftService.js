const ActiveShift = require('../models/ActiveShift');
const Route = require('../models/Route');
const staffScheduleService = require('./staffScheduleService');

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

    const created = await ActiveShift.create({
        staffId,
        scheduleId,
        routeId,
        routeName,
        routeCode,
        shiftStartAt: new Date(),
        status: 'active'
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

module.exports = {
    checkIn,
    getActiveShift,
    endActiveShift
};
