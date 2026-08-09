const activeShiftService = require('../services/activeShiftService');

async function checkIn(req, res) {
    try {
        const shift = await activeShiftService.checkIn(req.user._id, req.body);
        return res.status(201).json({
            success: true,
            message: 'Check-in nhận ca thành công',
            data: shift,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function getActive(req, res) {
    try {
        const shift = await activeShiftService.getActiveShift(req.user._id);
        return res.json({
            success: true,
            message: 'Lấy ca đang chạy thành công',
            data: shift,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function endShift(req, res) {
    try {
        const shift = await activeShiftService.endActiveShift(req.user._id);
        return res.json({
            success: true,
            message: shift ? 'Đã kết thúc ca' : 'Không có ca đang chạy',
            data: shift,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateLocation(req, res) {
    try {
        const shift = await activeShiftService.updateLocation(req.user._id, req.body);
        return res.json({
            success: true,
            message: 'Cập nhật vị trí ca thành công',
            data: shift,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function advanceStop(req, res) {
    try {
        const result = await activeShiftService.advanceStop(req.user._id, req.body);
        return res.json({
            success: true,
            message: result.isLastStop
                ? 'Đã tới điểm dừng cuối'
                : 'Đã chuyển sang điểm dừng tiếp theo',
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    checkIn,
    getActive,
    endShift,
    updateLocation,
    advanceStop,
};
