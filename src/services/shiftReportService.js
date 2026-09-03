const ShiftReport = require('../models/ShiftReport');
const ScanLog = require('../models/ScanLog');
const Ticket = require('../models/Ticket');

const ADMIN_REVIEW_STATUSES = new Set(['approved', 'rejected']);
const MAX_SHIFT_DURATION_MS = 24 * 60 * 60 * 1000;

function assertValidShiftRange(shiftStartAt, shiftEndAt) {
    const start = new Date(shiftStartAt);
    const end = new Date(shiftEndAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('Thời gian ca không hợp lệ');
    }

    if (start.getTime() >= end.getTime()) {
        throw new Error('shiftStartAt phải nhỏ hơn shiftEndAt');
    }

    if (end.getTime() - start.getTime() > MAX_SHIFT_DURATION_MS) {
        throw new Error('Thời gian ca không được vượt quá 24 giờ');
    }

    return { start, end };
}

async function buildShiftStats(staffId, shiftStartAt, shiftEndAt) {
    const ticketCollectionName = Ticket.collection.name;

    const matchByTime = {
        scannedBy: staffId,
        createdAt: {
            $gte: shiftStartAt,
            $lt: shiftEndAt
        }
    };

    const [totalScans, successfulScans, failedScans, revenueAgg] = await Promise.all([
        ScanLog.countDocuments(matchByTime),
        ScanLog.countDocuments({ ...matchByTime, isValid: true }),
        ScanLog.countDocuments({ ...matchByTime, isValid: false }),
        ScanLog.aggregate([
            {
                $match: {
                    ...matchByTime,
                    isValid: true,
                    ticket: { $ne: null }
                }
            },
            {
                $lookup: {
                    from: ticketCollectionName,
                    localField: 'ticket',
                    foreignField: '_id',
                    as: 'ticketDoc'
                }
            },
            {
                $unwind: '$ticketDoc'
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $convert: {
                                input: '$ticketDoc.price',
                                to: 'double',
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                }
            }
        ])
    ]);

    return {
        totalScans,
        successfulScans,
        failedScans,
        totalRevenue: revenueAgg[0]?.totalRevenue || 0
    };
}

async function previewShiftStats(staffId, payload) {
    const { start, end } = assertValidShiftRange(payload.shiftStartAt, payload.shiftEndAt);
    const stats = await buildShiftStats(staffId, start, end);

    return {
        shiftStartAt: start,
        shiftEndAt: end,
        ...stats
    };
}

async function submitShiftReport(staffId, payload) {
    const { start, end } = assertValidShiftRange(payload.shiftStartAt, payload.shiftEndAt);

    const exists = await ShiftReport.findOne({
        staffId,
        shiftStartAt: start,
        shiftEndAt: end
    }).select('_id');

    if (exists) {
        throw new Error('Ca này đã gửi báo cáo trước đó');
    }

    const stats = await buildShiftStats(staffId, start, end);

    const report = await ShiftReport.create({
        staffId,
        shiftStartAt: start,
        shiftEndAt: end,
        totalScans: stats.totalScans,
        successfulScans: stats.successfulScans,
        failedScans: stats.failedScans,
        totalRevenue: stats.totalRevenue,
        note: String(payload.note || '').trim(),
        status: 'submitted'
    });

    return report;
}

async function getMyShiftReports(staffId, payload = {}) {
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = { staffId };
    if (payload.status && ['submitted', 'approved', 'rejected'].includes(payload.status)) {
        filter.status = payload.status;
    }

    const [items, total] = await Promise.all([
        ShiftReport.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        ShiftReport.countDocuments(filter)
    ]);

    return { items, page, limit, total };
}

async function getAdminShiftReports(payload = {}) {
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (payload.status && ['submitted', 'approved', 'rejected'].includes(payload.status)) {
        filter.status = payload.status;
    }
    if (payload.staffId) {
        filter.staffId = payload.staffId;
    }

    const [items, total] = await Promise.all([
        ShiftReport.find(filter)
            .populate('staffId', 'full_name email phone')
            .populate('reviewedBy', 'full_name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        ShiftReport.countDocuments(filter)
    ]);

    return { items, page, limit, total };
}

async function getAdminShiftReportById(id) {
    const report = await ShiftReport.findById(id)
        .populate('staffId', 'full_name email phone')
        .populate('reviewedBy', 'full_name email');
    if (!report) throw new Error('Báo cáo ca không tồn tại');
    return report;
}

async function reviewShiftReport(reportId, adminId, payload) {
    const nextStatus = payload.status;
    if (!ADMIN_REVIEW_STATUSES.has(nextStatus)) {
        throw new Error('Trạng thái review không hợp lệ');
    }

    const report = await ShiftReport.findById(reportId);
    if (!report) {
        throw new Error('Báo cáo ca không tồn tại');
    }

    report.status = nextStatus;
    report.reviewNote = String(payload.reviewNote || '').trim();
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();

    await report.save();
    return report;
}

module.exports = {
    previewShiftStats,
    submitShiftReport,
    getMyShiftReports,
    getAdminShiftReports,
    getAdminShiftReportById,
    reviewShiftReport
};
