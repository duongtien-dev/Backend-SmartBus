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

async function getAdminLeaveRequests(req, res) {
    try {
        const result = await leaveRequestService.getAdminLeaveRequests(req.body);
        return res.json({
            success: true,
            message: 'Lấy danh sách đơn xin nghỉ (admin) thành công',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getLeaveRequestDetail(req, res) {
    try {
        const item = await leaveRequestService.getLeaveRequestById(req.body.id);
        return res.json({
            success: true,
            message: 'Lấy chi tiết đơn xin nghỉ thành công',
            data: item
        });
    } catch (error) {
        const statusCode = error.message === 'Đơn xin nghỉ không tồn tại' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

async function reviewLeaveRequest(req, res) {
    try {
        const { id, ...payload } = req.body;
        const item = await leaveRequestService.reviewLeaveRequest(id, req.user._id, payload);
        return res.json({
            success: true,
            message: 'Cập nhật trạng thái đơn xin nghỉ thành công',
            data: item
        });
    } catch (error) {
        const statusCode = error.message === 'Đơn xin nghỉ không tồn tại' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    submitLeaveRequest,
    getMyLeaveRequests,
    getAdminLeaveRequests,
    getLeaveRequestDetail,
    reviewLeaveRequest
};
