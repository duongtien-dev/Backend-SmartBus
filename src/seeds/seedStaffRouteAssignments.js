const User = require('../models/User');
const Route = require('../models/Route');

const DEFAULT_ASSIGN_COUNT = 3;

/**
 * Admin gán tuyến cho staff (`Route.staffId`).
 * Idempotent theo staff — gán `limit` tuyến đầu (theo code) nếu chưa đủ.
 */
async function seedStaffRouteAssignments(options = {}) {
    const {
        staffEmail = null,
        limit = DEFAULT_ASSIGN_COUNT,
        clearOthers = false,
    } = options;

    const staffFilter = { role: 'staff', active: true };
    if (staffEmail) {
        staffFilter.email = staffEmail;
    }

    const staffList = await User.find(staffFilter)
        .select('_id email full_name')
        .lean();

    if (!staffList.length) {
        throw new Error(
            staffEmail
                ? `Không tìm thấy staff email=${staffEmail}`
                : 'Không có user role=staff để gán tuyến'
        );
    }

    const routes = await Route.find()
        .select('_id code name staffId')
        .sort({ code: 1 })
        .lean();

    if (!routes.length) {
        throw new Error('Không có tuyến nào trong DB — cần có routes trước');
    }

    const assignCount = Math.min(Math.max(Number(limit) || DEFAULT_ASSIGN_COUNT, 1), routes.length);
    const results = [];

    for (let i = 0; i < staffList.length; i++) {
        const staff = staffList[i];
        // Chia tuyến theo vòng nếu nhiều staff — tránh đụng nhau khi đủ tuyến
        const start = (i * assignCount) % routes.length;
        const picked = [];
        for (let j = 0; j < assignCount; j++) {
            picked.push(routes[(start + j) % routes.length]);
        }
        const pickedIds = picked.map((r) => r._id);

        if (clearOthers) {
            await Route.updateMany(
                { staffId: staff._id, _id: { $nin: pickedIds } },
                { $unset: { staffId: 1 } }
            );
        }

        const updateResult = await Route.updateMany(
            { _id: { $in: pickedIds } },
            { $set: { staffId: staff._id } }
        );

        results.push({
            staffId: staff._id,
            email: staff.email,
            name: staff.full_name,
            assignedRouteCodes: picked.map((r) => r.code),
            matched: updateResult.matchedCount,
            modified: updateResult.modifiedCount,
        });
    }

    return {
        staffCount: staffList.length,
        assignCount,
        results,
    };
}

module.exports = { seedStaffRouteAssignments, DEFAULT_ASSIGN_COUNT };
