const RouteReport = require('../models/RouteReport');

async function createRouteReport(userId, data) {
    const report = await RouteReport.create({ ...data, userId });
    return report;
}

async function updateRouteReport(reportId, userId, data) {
    const report = await RouteReport.findOne({ _id: reportId, userId });
    if (!report) throw new Error('Báo cáo không tồn tại hoặc không có quyền sửa');
    const { userId: _uid, ...allowed } = data;
    Object.assign(report, allowed);
    await report.save();
    return report;
}

async function deleteRouteReport(reportId, userId) {
    const report = await RouteReport.findOneAndDelete({ _id: reportId, userId });
    if (!report) throw new Error('Báo cáo không tồn tại hoặc không có quyền xóa');
    return report;
}

async function listRouteReports({
    page = 1,
    limit = 10,
    search,
    sort = 'newest',
    userId,
    status,
    type,
}) {
    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (type) query.type = type;
    if (search && search.trim()) {
        const s = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(s, 'i');
        query.$or = [{ content: re }, { phone: re }];
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [reports] = await Promise.all([
        RouteReport.find(query)
            .sort(sortOpt)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'full_name email')
            .populate('routeId', 'code name startName endName'),
    ]);

    return reports;
}

async function getRouteReportById(reportId) {
    const report = await RouteReport.findById(reportId)
        .populate('userId', 'full_name email')
        .populate('routeId', 'code name startName endName')
        .populate('reviewedBy', 'full_name email');
    if (!report) throw new Error('Báo cáo không tồn tại');
    return report;
}

const ADMIN_REPORT_STATUSES = new Set(['new', 'in_progress', 'resolved', 'rejected']);

async function reviewRouteReport(reportId, adminId, payload = {}) {
    const nextStatus = payload.status;
    if (!ADMIN_REPORT_STATUSES.has(nextStatus)) {
        throw new Error('Trạng thái không hợp lệ');
    }

    const report = await RouteReport.findById(reportId);
    if (!report) throw new Error('Báo cáo không tồn tại');

    report.status = nextStatus;
    report.reviewNote = String(payload.reviewNote || '').trim();
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();
    await report.save();

    return getRouteReportById(report._id);
}

module.exports = {
    createRouteReport,
    updateRouteReport,
    deleteRouteReport,
    listRouteReports,
    getRouteReportById,
    reviewRouteReport,
};
