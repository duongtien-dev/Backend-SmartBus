const shiftReportService = require('../services/shiftReportService');

async function previewShiftStats(req, res) {
    try {
        const data = await shiftReportService.previewShiftStats(req.user._id, req.body);
        return res.json({
            success: true,
            data
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function submitShiftReport(req, res) {
    try {
        const report = await shiftReportService.submitShiftReport(req.user._id, req.body);
        return res.status(201).json({
            success: true,
            message: 'Gửi báo cáo ca thành công',
            data: report
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getMyShiftReports(req, res) {
    try {
        const result = await shiftReportService.getMyShiftReports(req.user._id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getAdminShiftReports(req, res) {
    try {
        const result = await shiftReportService.getAdminShiftReports(req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function reviewShiftReport(req, res) {
    try {
        const { reportId, ...payload } = req.body;
        const report = await shiftReportService.reviewShiftReport(reportId, req.user._id, payload);
        return res.json({
            success: true,
            message: 'Cập nhật trạng thái báo cáo ca thành công',
            data: report
        });
    } catch (error) {
        const statusCode = error.message === 'Báo cáo ca không tồn tại' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    previewShiftStats,
    submitShiftReport,
    getMyShiftReports,
    getAdminShiftReports,
    reviewShiftReport
};
