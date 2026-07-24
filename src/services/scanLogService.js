const ScanLog = require('../models/ScanLog');

async function getMyScanLogs(staffId, payload = {}) {
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const from = payload.from ? new Date(payload.from) : null;
    const to = payload.to ? new Date(payload.to) : null;

    if (!from || Number.isNaN(from.getTime())) {
        throw new Error('from (ISO8601) là bắt buộc');
    }
    if (to && Number.isNaN(to.getTime())) {
        throw new Error('to không hợp lệ');
    }
    if (to && from.getTime() >= to.getTime()) {
        throw new Error('from phải nhỏ hơn to');
    }

    const filter = {
        scannedBy: staffId,
        createdAt: {
            $gte: from,
            ...(to ? { $lt: to } : {})
        }
    };

    const [items, total] = await Promise.all([
        ScanLog.find(filter)
            .populate('ticket', 'customerName routeName qrCode status')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ScanLog.countDocuments(filter)
    ]);

    const mapped = items.map((item) => ({
        _id: item._id,
        qrCode: item.qrCode,
        isValid: item.isValid,
        reason: item.reason || '',
        scannedAt: item.createdAt,
        scanLogId: item._id,
        customerName: item.ticket?.customerName || '',
        routeName: item.ticket?.routeName || '',
        ticketId: item.ticket?._id || null
    }));

    return { items: mapped, page, limit, total };
}

module.exports = {
    getMyScanLogs
};
