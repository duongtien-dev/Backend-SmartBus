const stopService = require('../services/stopService');

async function createStop(req, res) {
    try {
        const stop = await stopService.createStop(req.user._id, req.body);
        res.status(201).json({ success: true, data: stop });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateStop(req, res) {
    try {
        const { id, ...data } = req.body;
        const stop = await stopService.updateStop(id, req.user._id, data);
        res.json({ success: true, data: stop });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteStop(req, res) {
    try {
        await stopService.deleteStop(req.body.id, req.user._id);
        res.json({ success: true, message: 'Đã xóa điểm dừng', data: null });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function listStopsByRoute(req, res) {
    try {
        const { routeId, page, limit } = req.body;
        const result = await stopService.listStopsByRoute({
            routeId,
            page: Number(page) || 1,
            limit: Number(limit) || 100,
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getStopDetail(req, res) {
    try {
        const stop = await stopService.getStopById(req.body.id);
        res.json({ success: true, data: stop });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

module.exports = {
    createStop,
    updateStop,
    deleteStop,
    listStopsByRoute,
    getStopDetail,
};
