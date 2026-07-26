const leaveRequestService = require('../services/leaveRequestService');

async function submitLeaveRequest(req, res) {
    try {
        const report = await leaveRequestService.submitLeaveRequest(req.user._id, req.body);
        return res.status(201).json({
            success: true,
            message: 'Gửi đơn xin nghỉ thành công',
            data: report
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getMyLeaveRequests(req, res) {
    try {
        const result = await leaveRequestService.getMyLeaveRequests(req.user._id, req.body);
        return res.json({
            success: true,
            message: 'Lấy danh sách đơn xin nghỉ thành công',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    submitLeaveRequest,
    getMyLeaveRequests
};
