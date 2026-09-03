const StaffSchedule = require('../models/StaffSchedule');
const ActiveShift = require('../models/ActiveShift');
const Route = require('../models/Route');

const PERIOD_LABEL = {
    morning: 'Sáng',
    afternoon: 'Chiều',
    evening: 'Tối'
};

const STATUS_LABEL = {
    scheduled: 'Chưa Check-in',
    in_progress: 'Đang chạy',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy'
};

function startOfUtcDay(date = new Date()) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function addUtcDays(date, days) {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

/** Tuần hiện tại Mon→Sun (UTC date parts — client gửi from/to rõ ràng khi cần). */
function defaultWeekRange() {
    const today = startOfUtcDay(new Date());
    const day = today.getUTCDay(); // 0 Sun … 6 Sat
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const from = addUtcDays(today, mondayOffset);
    const to = addUtcDays(from, 7);
    return { from, to };
}

function parseRange(payload = {}) {
    if (!payload.from && !payload.to) {
        return defaultWeekRange();
    }

    const from = payload.from ? startOfUtcDay(new Date(payload.from)) : null;
    const toExclusive = payload.to ? startOfUtcDay(new Date(payload.to)) : null;

    if (payload.from && Number.isNaN(from.getTime())) {
        throw new Error('from không hợp lệ');
    }
    if (payload.to && Number.isNaN(toExclusive.getTime())) {
        throw new Error('to không hợp lệ');
    }

    if (from && toExclusive && from.getTime() >= toExclusive.getTime()) {
        throw new Error('from phải nhỏ hơn to');
    }

    const range = defaultWeekRange();
    return {
        from: from || range.from,
        to: toExclusive || range.to
    };
}

function isSameUtcDay(a, b) {
    return (
        a.getUTCFullYear() === b.getUTCFullYear() &&
        a.getUTCMonth() === b.getUTCMonth() &&
        a.getUTCDate() === b.getUTCDate()
    );
}

function formatDateLabel(workDate, today) {
    if (isSameUtcDay(workDate, today)) return 'Hôm nay';
    const dd = String(workDate.getUTCDate()).padStart(2, '0');
    const mm = String(workDate.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = workDate.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function mapScheduleItem(doc, { today, activeShift }) {
    const workDate = new Date(doc.workDate);
    const isToday = isSameUtcDay(workDate, today);

    let status = doc.status;
    const scheduleId = String(doc._id);
    const activeScheduleId = activeShift?.scheduleId
        ? String(activeShift.scheduleId)
        : null;
    const activeRouteId = activeShift?.routeId
        ? String(activeShift.routeId._id || activeShift.routeId)
        : null;
    const itemRouteId = doc.routeId ? String(doc.routeId._id || doc.routeId) : null;

    if (activeShift && status === 'scheduled') {
        if (activeScheduleId === scheduleId) {
            status = 'in_progress';
        } else if (isToday && itemRouteId && activeRouteId === itemRouteId) {
            status = 'in_progress';
        }
    }

    const route = doc.routeId && typeof doc.routeId === 'object' ? doc.routeId : null;
    const routeCode = doc.routeCode || route?.code || '';
    const routeName =
        doc.routeName ||
        (route ? `${route.code} - ${route.name}` : '') ||
        '';

    return {
        _id: doc._id,
        staffId: doc.staffId,
        workDate: workDate.toISOString(),
        dateLabel: formatDateLabel(workDate, today),
        isToday,
        period: doc.period,
        periodLabel: PERIOD_LABEL[doc.period] || doc.period,
        startTime: doc.startTime,
        endTime: doc.endTime,
        timeRange: `${doc.startTime} - ${doc.endTime}`,
        routeId: itemRouteId,
        routeCode,
        routeName,
        plateNumber: doc.plateNumber || '',
        status,
        statusLabel:
            status === 'scheduled' && !isToday && workDate > today
                ? 'Chưa tới lịch'
                : STATUS_LABEL[status] || status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
}

async function getMySchedule(staffId, payload = {}) {
    const { from, to } = parseRange(payload);
    const today = startOfUtcDay(new Date());

    const [items, activeShift] = await Promise.all([
        StaffSchedule.find({
            staffId,
            workDate: { $gte: from, $lt: to },
            status: { $ne: 'cancelled' }
        })
            .populate('routeId', 'code name startName endName')
            .sort({ workDate: 1, startTime: 1 })
            .lean(),
        ActiveShift.findOne({ staffId, status: 'active' })
            .select('scheduleId routeId')
            .lean()
    ]);

    return {
        items: items.map((item) => mapScheduleItem(item, { today, activeShift })),
        from: from.toISOString(),
        to: to.toISOString()
    };
}

async function createSchedule(payload = {}) {
    const staffId = payload.staffId;
    if (!staffId) {
        throw new Error('staffId là bắt buộc');
    }

    const workDate = startOfUtcDay(new Date(payload.workDate));
    if (Number.isNaN(workDate.getTime())) {
        throw new Error('workDate không hợp lệ');
    }

    const period = payload.period || 'afternoon';
    if (!PERIOD_LABEL[period]) {
        throw new Error('period không hợp lệ');
    }

    let routeName = String(payload.routeName || '').trim();
    let routeCode = String(payload.routeCode || '').trim();
    let routeId = payload.routeId || null;

    if (routeId) {
        const route = await Route.findById(routeId).select('code name');
        if (!route) {
            throw new Error('Tuyến không tồn tại');
        }
        routeCode = routeCode || route.code;
        routeName = routeName || `${route.code} - ${route.name}`;
    }

    const defaults = {
        morning: { startTime: '06:00', endTime: '12:00' },
        afternoon: { startTime: '12:30', endTime: '19:30' },
        evening: { startTime: '18:00', endTime: '22:00' }
    };
    const periodDefault = defaults[period];

    const created = await StaffSchedule.create({
        staffId,
        workDate,
        period,
        startTime: payload.startTime || periodDefault.startTime,
        endTime: payload.endTime || periodDefault.endTime,
        routeId,
        routeName,
        routeCode,
        plateNumber: String(payload.plateNumber || '').trim(),
        status: 'scheduled'
    });

    return StaffSchedule.findById(created._id)
        .populate('staffId', 'full_name email')
        .populate('routeId', 'code name startName endName')
        .lean()
        .then((doc) =>
            mapScheduleItem(doc, {
                today: startOfUtcDay(new Date()),
                activeShift: null
            })
        );
}

async function listSchedules(payload = {}) {
    const { from, to } = parseRange(payload);
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 200, 1), 500);
    const skip = (page - 1) * limit;

    const filter = {
        workDate: { $gte: from, $lt: to }
    };
    if (payload.staffId) filter.staffId = payload.staffId;
    if (payload.routeId) filter.routeId = payload.routeId;
    if (payload.period && PERIOD_LABEL[payload.period]) filter.period = payload.period;
    if (payload.status && STATUS_LABEL[payload.status]) {
        filter.status = payload.status;
    } else {
        filter.status = { $ne: 'cancelled' };
    }

    const today = startOfUtcDay(new Date());
    const [docs, total] = await Promise.all([
        StaffSchedule.find(filter)
            .populate('staffId', 'full_name email')
            .populate('routeId', 'code name startName endName')
            .sort({ workDate: 1, startTime: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        StaffSchedule.countDocuments(filter)
    ]);

    return {
        items: docs.map((item) => mapScheduleItem(item, { today, activeShift: null })),
        from: from.toISOString(),
        to: to.toISOString(),
        page,
        limit,
        total
    };
}

async function getScheduleById(id) {
    const doc = await StaffSchedule.findById(id)
        .populate('staffId', 'full_name email')
        .populate('routeId', 'code name startName endName')
        .lean();
    if (!doc) throw new Error('Lịch ca không tồn tại');
    return mapScheduleItem(doc, {
        today: startOfUtcDay(new Date()),
        activeShift: null
    });
}

async function updateSchedule(id, payload = {}) {
    const schedule = await StaffSchedule.findById(id);
    if (!schedule) throw new Error('Lịch ca không tồn tại');
    if (schedule.status !== 'scheduled') {
        throw new Error('Chỉ được sửa lịch chưa check-in');
    }

    if (payload.staffId) schedule.staffId = payload.staffId;
    if (payload.workDate) {
        const workDate = startOfUtcDay(new Date(payload.workDate));
        if (Number.isNaN(workDate.getTime())) throw new Error('workDate không hợp lệ');
        schedule.workDate = workDate;
    }
    if (payload.period) {
        if (!PERIOD_LABEL[payload.period]) throw new Error('period không hợp lệ');
        schedule.period = payload.period;
        const defaults = {
            morning: { startTime: '06:00', endTime: '12:00' },
            afternoon: { startTime: '12:30', endTime: '19:30' },
            evening: { startTime: '18:00', endTime: '22:00' }
        };
        if (!payload.startTime) schedule.startTime = defaults[payload.period].startTime;
        if (!payload.endTime) schedule.endTime = defaults[payload.period].endTime;
    }
    if (payload.startTime) schedule.startTime = String(payload.startTime).trim();
    if (payload.endTime) schedule.endTime = String(payload.endTime).trim();
    if (payload.plateNumber !== undefined) {
        schedule.plateNumber = String(payload.plateNumber || '').trim();
    }

    if (payload.routeId !== undefined) {
        if (payload.routeId) {
            const route = await Route.findById(payload.routeId).select('code name');
            if (!route) throw new Error('Tuyến không tồn tại');
            schedule.routeId = payload.routeId;
            schedule.routeCode = route.code;
            schedule.routeName = `${route.code} - ${route.name}`;
        } else {
            schedule.routeId = null;
            schedule.routeCode = String(payload.routeCode || '').trim();
            schedule.routeName = String(payload.routeName || '').trim();
        }
    }

    await schedule.save();
    return getScheduleById(schedule._id);
}

async function cancelSchedule(id) {
    const schedule = await StaffSchedule.findById(id);
    if (!schedule) throw new Error('Lịch ca không tồn tại');
    if (schedule.status === 'in_progress') {
        throw new Error('Không thể hủy ca đang chạy');
    }
    if (schedule.status === 'completed') {
        throw new Error('Không thể hủy ca đã hoàn thành');
    }
    schedule.status = 'cancelled';
    await schedule.save();
    return getScheduleById(schedule._id);
}

async function markScheduleInProgress(scheduleId, staffId) {
    if (!scheduleId) return null;
    return StaffSchedule.findOneAndUpdate(
        { _id: scheduleId, staffId, status: { $in: ['scheduled', 'in_progress'] } },
        { status: 'in_progress' },
        { new: true }
    );
}

async function markScheduleCompleted(scheduleId, staffId) {
    if (!scheduleId) return null;
    return StaffSchedule.findOneAndUpdate(
        { _id: scheduleId, staffId },
        { status: 'completed' },
        { new: true }
    );
}

async function getScheduleForCheckIn(scheduleId, staffId) {
    if (!scheduleId) return null;
    const schedule = await StaffSchedule.findOne({
        _id: scheduleId,
        staffId,
        status: { $in: ['scheduled', 'in_progress'] }
    }).populate('routeId', 'code name');

    if (!schedule) {
        throw new Error('Lịch ca không tồn tại hoặc đã kết thúc');
    }

    return schedule;
}

module.exports = {
    getMySchedule,
    createSchedule,
    listSchedules,
    getScheduleById,
    updateSchedule,
    cancelSchedule,
    markScheduleInProgress,
    markScheduleCompleted,
    getScheduleForCheckIn,
    PERIOD_LABEL,
    STATUS_LABEL
};
