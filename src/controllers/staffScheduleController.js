const staffScheduleService = require('../services/staffScheduleService');

async function getMySchedule(req, res) {
    try {
        const result = await staffScheduleService.getMySchedule(req.user._id, req.body);
        return res.json({
            success: true,
            message: 'Lấy lịch ca thành công',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function createSchedule(req, res) {
    try {
        const item = await staffScheduleService.createSchedule(req.body);
        return res.status(201).json({
            success: true,
            message: 'Tạo lịch ca thành công',
            data: item
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function listSchedules(req, res) {
    try {
        const result = await staffScheduleService.listSchedules(req.body);
        return res.json({
            success: true,
            message: 'Lấy danh sách lịch ca thành công',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getScheduleDetail(req, res) {
    try {
        const item = await staffScheduleService.getScheduleById(req.body.id);
        return res.json({
            success: true,
            message: 'Lấy chi tiết lịch ca thành công',
            data: item
        });
    } catch (error) {
        const statusCode = error.message === 'Lịch ca không tồn tại' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

async function updateSchedule(req, res) {
    try {
        const { id, ...payload } = req.body;
        const item = await staffScheduleService.updateSchedule(id, payload);
        return res.json({
            success: true,
            message: 'Cập nhật lịch ca thành công',
            data: item
        });
    } catch (error) {
        const statusCode = error.message === 'Lịch ca không tồn tại' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

async function cancelSchedule(req, res) {
    try {
        const item = await staffScheduleService.cancelSchedule(req.body.id);
        return res.json({
            success: true,
            message: 'Đã hủy lịch ca',
            data: item
        });
    } catch (error) {
        const statusCode = error.message === 'Lịch ca không tồn tại' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getMySchedule,
    createSchedule,
    listSchedules,
    getScheduleDetail,
    updateSchedule,
    cancelSchedule
};
