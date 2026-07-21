const routeService = require('../services/routeService');

async function createRoute(req, res) {
    try {
        const route = await routeService.createRoute(req.user._id, req.body);
        res.status(201).json({ success: true, data: route });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateRoute(req, res) {
    try {
        const { id, ...data } = req.body;
        const route = await routeService.updateRoute(id, req.user._id, data);
        res.json({ success: true, data: route });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteRoute(req, res) {
    try {
        await routeService.deleteRoute(req.body.id, req.user._id);
        res.json({ success: true, message: 'Đã xóa tuyến', data: null });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function listRoutes(req, res) {
    try {
        const { page, limit, search, sort, userId, unreviewedOnly } = req.body;

        if (unreviewedOnly && !req.user) {
            return res.status(401).json({
                success: false,
                message: 'Cần đăng nhập để xem tuyến chưa đánh giá',
            });
        }

        const result = await routeService.listRoutes({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search,
            sort: sort || 'newest',
            userId: userId || undefined,
            viewerId: req.user?._id,
            unreviewedOnly: Boolean(unreviewedOnly),
            travelerUserId: unreviewedOnly ? req.user._id : undefined,
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getRouteDetail(req, res) {
    try {
        const route = await routeService.getRouteById(
            req.body.id,
            req.user?._id
        );
        res.json({ success: true, data: route });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

module.exports = {
    createRoute,
    updateRoute,
    deleteRoute,
    listRoutes,
    getRouteDetail,
};
