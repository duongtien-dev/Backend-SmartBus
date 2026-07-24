const staffScheduleService = require('../services/staffScheduleService');

async function getMySchedule(req, res) {
    try {
        const result = await staffScheduleService.getMySchedule(req.user._id, req.body);
        return res.json({
            success: true,
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

module.exports = {
    getMySchedule,
    createSchedule
};
