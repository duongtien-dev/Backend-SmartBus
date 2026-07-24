const LeaveRequest = require('../models/LeaveRequest');

const LEAVE_STATUSES = new Set(['submitted', 'approved', 'rejected']);

/**
 * Nhận ISO8601 hoặc DD/MM/YYYY → Date (UTC midnight).
 */
function parseLeaveDate(raw) {
    if (raw == null) return null;
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
        const d = new Date(raw);
        d.setUTCHours(0, 0, 0, 0);
        return d;
    }

    const value = String(raw).trim();
    if (!value) return null;

    const ddMmYyyy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddMmYyyy) {
        const [, dd, mm, yyyy] = ddMmYyyy;
        const date = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const iso = new Date(value);
    if (Number.isNaN(iso.getTime())) return null;
    iso.setUTCHours(0, 0, 0, 0);
    return iso;
}

function assertValidLeaveRange(startDate, endDate) {
    const start = parseLeaveDate(startDate);
    const end = parseLeaveDate(endDate);

    if (!start || !end) {
        throw new Error('Ngày nghỉ không hợp lệ (dùng DD/MM/YYYY hoặc ISO)');
    }

    if (start.getTime() > end.getTime()) {
        throw new Error('Từ ngày phải nhỏ hơn hoặc bằng đến ngày');
    }

    return { start, end };
}

async function submitLeaveRequest(staffId, payload) {
    const { start, end } = assertValidLeaveRange(payload.startDate, payload.endDate);
    const reason = String(payload.reason || '').trim();

    if (!reason) {
        throw new Error('Lý do xin nghỉ là bắt buộc');
    }

    if (reason.length > 500) {
        throw new Error('Lý do không được vượt quá 500 ký tự');
    }

    const overlap = await LeaveRequest.findOne({
        staffId,
        status: { $in: ['submitted', 'approved'] },
        startDate: { $lte: end },
        endDate: { $gte: start }
    }).select('_id');

    if (overlap) {
        throw new Error('Khoảng ngày này đã có đơn nghỉ trùng');
    }

    return LeaveRequest.create({
        staffId,
        startDate: start,
        endDate: end,
        reason,
        status: 'submitted'
    });
}

async function getMyLeaveRequests(staffId, payload = {}) {
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = { staffId };
    if (payload.status && LEAVE_STATUSES.has(payload.status)) {
        filter.status = payload.status;
    }

    const [items, total] = await Promise.all([
        LeaveRequest.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        LeaveRequest.countDocuments(filter)
    ]);

    return { items, page, limit, total };
}

module.exports = {
    submitLeaveRequest,
    getMyLeaveRequests,
    parseLeaveDate
};
