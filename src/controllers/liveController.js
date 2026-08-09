const liveService = require('../services/liveService');
const activeShiftService = require('../services/activeShiftService');

async function listRouteVehicles(req, res) {
    try {
        const data = await liveService.listRouteVehicles(req.body);
        return res.json({
            success: true,
            message: 'Lấy danh sách xe đang chạy thành công',
            data,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function getEta(req, res) {
    try {
        const data = await liveService.getEta(req.body);
        return res.json({
            success: true,
            message: 'Lấy ETA thành công',
            data,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function getCrowding(req, res) {
    try {
        const data = await liveService.getCrowding(req.body);
        return res.json({
            success: true,
            message: 'Lấy mức đông thành công',
            data,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function ingestVehicleGps(req, res) {
    try {
        const deviceKey =
            req.headers['x-vehicle-gps-key'] ||
            req.body.deviceKey ||
            req.body.secret;
        const shift = await activeShiftService.updateLocationByVehicleDevice(
            req.body,
            deviceKey
        );
        return res.json({
            success: true,
            message: 'Cập nhật GPS xe thành công',
            data: {
                shiftId: shift._id,
                plateNumber: shift.plateNumber,
                lastLat: shift.lastLat,
                lastLng: shift.lastLng,
                lastLocationAt: shift.lastLocationAt,
                locationSource: shift.locationSource,
            },
        });
    } catch (error) {
        const status =
            error.message === 'deviceKey không hợp lệ' ? 401 : 400;
        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    listRouteVehicles,
    getEta,
    getCrowding,
    ingestVehicleGps,
};
