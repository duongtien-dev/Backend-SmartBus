const User = require('../models/User');

//  chỉ lấy tài khoản nhân viên và khách hàng
async function listUsers({ page = 1, limit = 10, search, role, is_priority_user, active }) {
    const query = {};
    if (search && String(search).trim()) {
        const s = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.full_name = new RegExp(s, 'i');
    }
    if (role !== undefined && role !== null && role !== '') {
        query.role = role;
    }
    if (is_priority_user !== undefined && is_priority_user !== null) {
        query.is_priority_user = !!is_priority_user;
    }
    if (active !== undefined && active !== null) {
        query.active = !!active;
    }

    const skip = (page - 1) * limit;
    const sort = { createdAt: -1 };

    const [items, total] = await Promise.all([
        User.find(query).sort(sort).skip(skip).limit(limit).select('-password'),
        User.countDocuments(query),
    ]);

    return { items, page, limit, total };
}

async function createStaffUser({ full_name, email, password, phone }) {
    const exists = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (exists) throw new Error('Email đã được sử dụng');

    const user = await User.create({
        full_name: String(full_name || '').trim(),
        email: String(email).trim().toLowerCase(),
        password,
        phone: String(phone || '').trim(),
        role: 'staff',
        active: true,
    });

    const safe = user.toObject();
    delete safe.password;
    return safe;
}

async function updateUserActive(userId, active) {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');
    if (user.role === 'admin') throw new Error('Không thể đổi trạng thái active của tài khoản admin');
    user.active = !!active;
    await user.save();
    const safe = user.toObject();
    delete safe.password;
    return safe;
}

async function getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('Người dùng không tồn tại');
    return user;
}

async function deleteUserById(userId, adminId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');
    if (user.role === 'admin') throw new Error('Không thể xóa tài khoản admin');
    if (user._id.toString() === adminId.toString()) throw new Error('Không thể xóa chính tài khoản của bạn');
    await User.findByIdAndDelete(userId);
    return user;
}

module.exports = {
    listUsers,
    getUserById,
    createStaffUser,
    updateUserActive,
    deleteUserById,
};
