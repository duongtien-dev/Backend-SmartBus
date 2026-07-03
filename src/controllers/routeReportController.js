const routeReportService = require('../services/routeReportService');

async function createRouteReport(req, res) {
    try {
        const report = await routeReportService.createRouteReport(req.user._id, req.body);
        res.status(201).json({ success: true, data: report });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateRouteReport(req, res) {
    try {
        const { id, ...data } = req.body;
        const report = await routeReportService.updateRouteReport(
            id,
            req.user._id,
            data
        );
        res.json({ success: true, data: report });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteRouteReport(req, res) {
    try {
        await routeReportService.deleteRouteReport(req.body.id, req.user._id);
        res.json({ success: true, message: 'Đã xóa báo cáo', data: null });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function listRouteReports(req, res) {
    try {
        const { page, limit, search, sort, userId, status, type } = req.body;
        const result = await routeReportService.listRouteReports({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search,
            sort: sort || 'newest',
            userId: userId || req.user?._id,
            status,
            type,
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getRouteReportDetail(req, res) {
    try {
        const report = await routeReportService.getRouteReportById(req.body.id);
        res.json({ success: true, data: report });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

module.exports = {
    createRouteReport,
    updateRouteReport,
    deleteRouteReport,
    listRouteReports,
    getRouteReportDetail,
};
