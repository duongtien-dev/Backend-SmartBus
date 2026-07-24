const StaffSchedule = require('../models/StaffSchedule');
const User = require('../models/User');
const Route = require('../models/Route');

const PLATES = ['43H57896', '43H11223', '43H44556', '43H77889', '43H33445'];

const PERIODS = [
    { period: 'afternoon', startTime: '12:30', endTime: '19:30' },
];

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

/** Tuần hiện tại Mon→Sun (UTC), khớp staffScheduleService.defaultWeekRange */
function currentWeekDays() {
    const today = startOfUtcDay(new Date());
    const day = today.getUTCDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = addUtcDays(today, mondayOffset);
    return Array.from({ length: 7 }, (_, i) => addUtcDays(monday, i));
}

/**
 * Seed lịch ca tuần hiện tại cho mọi staff (hoặc staffEmail).
 * Idempotent: upsert theo staffId + workDate + period.
 */
async function seedStaffSchedules(options = {}) {
    const { staffEmail = null, clearWeek = false } = options;

    const staffFilter = { role: 'staff', active: true };
    if (staffEmail) {
        staffFilter.email = staffEmail;
    }

    const staffList = await User.find(staffFilter).select('_id email full_name').lean();
    if (!staffList.length) {
        throw new Error(
            staffEmail
                ? `Không tìm thấy staff email=${staffEmail}`
                : 'Không có user role=staff để seed lịch ca'
        );
    }

    let routes = await Route.find().select('_id code name staffId').sort({ code: 1 }).lean();
    if (!routes.length) {
        throw new Error('Không có tuyến nào trong DB — cần seed routes trước');
    }

    const weekDays = currentWeekDays();
    const weekFrom = weekDays[0];
    const weekTo = addUtcDays(weekDays[6], 1);

    let created = 0;
    let updated = 0;

    for (const staff of staffList) {
        // Gán một số tuyến cho staff nếu chưa có — để app hiện "Tuyến được giao"
        const assigned = routes.filter(
            (r) => r.staffId && String(r.staffId) === String(staff._id)
        );
        if (!assigned.length) {
            const toAssign = routes.slice(0, Math.min(3, routes.length));
            await Route.updateMany(
                { _id: { $in: toAssign.map((r) => r._id) } },
                { $set: { staffId: staff._id } }
            );
            routes = await Route.find().select('_id code name staffId').sort({ code: 1 }).lean();
        }

        const staffRoutes = routes.filter(
            (r) => r.staffId && String(r.staffId) === String(staff._id)
        );
        const pool = staffRoutes.length ? staffRoutes : routes;

        if (clearWeek) {
            await StaffSchedule.deleteMany({
                staffId: staff._id,
                workDate: { $gte: weekFrom, $lt: weekTo }
            });
        }

        for (let i = 0; i < weekDays.length; i++) {
            const workDate = weekDays[i];
            const route = pool[i % pool.length];
            const periodCfg = PERIODS[0];
            const plateNumber = PLATES[i % PLATES.length];
            const routeName = `${route.code} - ${route.name}`;

            const result = await StaffSchedule.updateOne(
                {
                    staffId: staff._id,
                    workDate,
                    period: periodCfg.period
                },
                {
                    $set: {
                        startTime: periodCfg.startTime,
                        endTime: periodCfg.endTime,
                        routeId: route._id,
                        routeName,
                        routeCode: route.code,
                        plateNumber,
                        status: 'scheduled'
                    },
                    $setOnInsert: {
                        staffId: staff._id,
                        workDate,
                        period: periodCfg.period
                    }
                },
                { upsert: true }
            );

            if (result.upsertedCount) created += 1;
            else if (result.modifiedCount) updated += 1;
        }
    }

    return {
        staffCount: staffList.length,
        staff: staffList.map((s) => ({ id: s._id, email: s.email, name: s.full_name })),
        weekFrom: weekFrom.toISOString(),
        weekTo: weekTo.toISOString(),
        created,
        updated,
        days: weekDays.length
    };
}

module.exports = { seedStaffSchedules, currentWeekDays };
