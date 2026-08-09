const ActiveShift = require('../models/ActiveShift');
const ScanLog = require('../models/ScanLog');
const Stop = require('../models/Stop');
const Vehicle = require('../models/Vehicle');
const {
    etaMinutesFromLocation,
    etaMinutesByStopGap,
    crowdingLevel,
} = require('../utils/liveTransit');

const CROWDING_WINDOW_MS = 45 * 60 * 1000;
const DEFAULT_CAPACITY = 40;

async function getStopsForRoute(routeId) {
    return Stop.find({ routeId }).sort({ order: 1, createdAt: 1 }).lean();
}

async function getCapacity(shift) {
    if (shift.vehicleId) {
        const vehicle = await Vehicle.findById(shift.vehicleId).select('capacity').lean();
        if (vehicle?.capacity) return vehicle.capacity;
    }
    return DEFAULT_CAPACITY;
}

async function buildVehicleCard(shift, stops, targetStopId) {
    const stopIndex = Math.min(
        Math.max(Number(shift.currentStopOrder) || 0, 0),
        Math.max(stops.length - 1, 0)
    );
    const currentStop = stops[stopIndex] || null;

    let targetStop = null;
    let targetIndex = null;
    if (targetStopId) {
        targetIndex = stops.findIndex((s) => String(s._id) === String(targetStopId));
        if (targetIndex >= 0) targetStop = stops[targetIndex];
    }

    let etaMinutes = null;
    if (targetStop) {
        etaMinutes = etaMinutesFromLocation(
            shift.lastLat,
            shift.lastLng,
            targetStop
        );
        if (etaMinutes == null) {
            etaMinutes = etaMinutesByStopGap(stopIndex, targetIndex);
        }
    }

    const since = new Date(Date.now() - CROWDING_WINDOW_MS);
    const validScans = await ScanLog.countDocuments({
        shiftId: shift._id,
        isValid: true,
        createdAt: { $gte: since },
    });

    const capacity = await getCapacity(shift);
    const loadRatio = Math.min(validScans / capacity, 1.5);
    const level = crowdingLevel(loadRatio);

    return {
        shiftId: shift._id,
        routeId: shift.routeId,
        routeCode: shift.routeCode,
        routeName: shift.routeName,
        plateNumber: shift.plateNumber || '',
        staffId: shift.staffId,
        status: shift.status,
        currentStopOrder: stopIndex,
        currentStop: currentStop
            ? {
                  _id: currentStop._id,
                  name: currentStop.name,
                  order: currentStop.order,
                  location: currentStop.location,
              }
            : null,
        location:
            shift.lastLat != null && shift.lastLng != null
                ? {
                      lat: shift.lastLat,
                      lng: shift.lastLng,
                      updatedAt: shift.lastLocationAt,
                      heading: shift.heading,
                      source: shift.locationSource || 'staff',
                  }
                : currentStop?.location?.coordinates?.length >= 2
                  ? {
                        lat: currentStop.location.coordinates[1],
                        lng: currentStop.location.coordinates[0],
                        updatedAt: shift.lastLocationAt || shift.updatedAt,
                        heading: shift.heading,
                        fromStop: true,
                        source: 'stop',
                    }
                  : null,
        etaMinutes,
        crowding: {
            level,
            validScans,
            capacity,
            loadRatio: Math.round(loadRatio * 100) / 100,
        },
        shiftStartAt: shift.shiftStartAt,
    };
}

async function listRouteVehicles({ routeId, stopId } = {}) {
    if (!routeId) {
        throw new Error('routeId là bắt buộc');
    }

    const [shifts, stops] = await Promise.all([
        ActiveShift.find({ routeId, status: 'active' })
            .select(
                'staffId routeId routeCode routeName plateNumber vehicleId currentStopOrder lastLat lastLng lastLocationAt heading locationSource shiftStartAt status updatedAt'
            )
            .lean(),
        getStopsForRoute(routeId),
    ]);

    const items = [];
    for (const shift of shifts) {
        items.push(await buildVehicleCard(shift, stops, stopId));
    }

    return {
        routeId,
        count: items.length,
        items,
    };
}

async function getEta({ routeId, stopId } = {}) {
    if (!routeId || !stopId) {
        throw new Error('routeId và stopId là bắt buộc');
    }

    const data = await listRouteVehicles({ routeId, stopId });
    const withEta = data.items
        .filter((item) => item.etaMinutes != null)
        .sort((a, b) => a.etaMinutes - b.etaMinutes);

    return {
        routeId,
        stopId,
        nearestEtaMinutes: withEta[0]?.etaMinutes ?? null,
        vehicles: withEta,
    };
}

async function getCrowding({ routeId } = {}) {
    if (!routeId) {
        throw new Error('routeId là bắt buộc');
    }

    const data = await listRouteVehicles({ routeId });
    const levels = data.items.map((item) => item.crowding);

    return {
        routeId,
        vehicles: data.items.map((item) => ({
            shiftId: item.shiftId,
            crowding: item.crowding,
            currentStop: item.currentStop,
        })),
        summary: levels.length
            ? levels.sort(
                  (a, b) => (b.loadRatio || 0) - (a.loadRatio || 0)
              )[0]
            : { level: 'unknown', validScans: 0, capacity: DEFAULT_CAPACITY, loadRatio: 0 },
    };
}

module.exports = {
    listRouteVehicles,
    getEta,
    getCrowding,
};
