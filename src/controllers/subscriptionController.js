const config = require('../config');
const subscriptionService = require('../services/subscriptionService');
const {
    dispatchDueNotifications,
} = require('../services/pushDispatchService');

async function registerDevice(req, res) {
    try {
        const data = await subscriptionService.registerDevice(req.user._id, req.body);
        return res.json({
            success: true,
            message: 'Đăng ký thiết bị nhận thông báo thành công',
            data,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

async function upsertSubscription(req, res) {
    try {
        const data = await subscriptionService.upsertSubscription(
            req.user._id,
            req.body
        );
        return res.json({
            success: true,
            message: 'Đăng ký theo dõi trạm thành công',
            data,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

async function listSubscriptions(req, res) {
    try {
        const data = await subscriptionService.listSubscriptions(req.user._id);
        return res.json({
            success: true,
            message: 'Lấy danh sách theo dõi thành công',
            data,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

async function deleteSubscription(req, res) {
    try {
        const data = await subscriptionService.deleteSubscription(
            req.user._id,
            req.body
        );
        return res.json({
            success: true,
            message: 'Đã hủy theo dõi trạm',
            data,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

async function dispatchPush(req, res) {
    try {
        const secret =
            req.headers['x-worker-secret'] ||
            req.body.secret ||
            req.body.workerSecret;
        if (!config.workerSecret || secret !== config.workerSecret) {
            return res.status(401).json({
                success: false,
                message: 'worker secret không hợp lệ',
            });
        }

        const data = await dispatchDueNotifications({
            limit: req.body.limit,
        });
        return res.json({
            success: true,
            message: 'Đã chạy worker gửi push',
            data,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    registerDevice,
    upsertSubscription,
    listSubscriptions,
    deleteSubscription,
    dispatchPush,
};
