const PaymentMethod = require('../models/PaymentMethod');

async function createPaymentMethod(userId, data) {
    const paymentMethod = await PaymentMethod.create({
        ...data,
        user: userId,
    });
    return paymentMethod;
}

async function updatePaymentMethod(paymentMethodId, userId, data) {
    const paymentMethod = await PaymentMethod.findOne({
        _id: paymentMethodId,
        user: userId,
    });

    if (!paymentMethod) {
        throw new Error('Phương thức thanh toán không tồn tại hoặc không có quyền sửa');
    }

    const { user: _user, ...allowed } = data;
    Object.assign(paymentMethod, allowed);
    await paymentMethod.save();
    return paymentMethod;
}

async function getMyPaymentMethods(userId) {
    const paymentMethods = await PaymentMethod.find({ user: userId })
        .sort({ createdAt: -1 });
    return paymentMethods;
}

async function getPaymentMethodById(paymentMethodId, userId) {
    const paymentMethod = await PaymentMethod.findOne({
        _id: paymentMethodId,
        user: userId,
    });

    if (!paymentMethod) {
        throw new Error('Phương thức thanh toán không tồn tại hoặc không có quyền xem');
    }

    return paymentMethod;
}

module.exports = {
    createPaymentMethod,
    updatePaymentMethod,
    getMyPaymentMethods,
    getPaymentMethodById,
};
