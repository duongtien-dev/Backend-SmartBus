const express = require('express');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const leaveRequestController = require('../controllers/leaveRequestController');
const leaveRequestValidation = require('../validations/leaveRequestValidation');

const router = express.Router();
router.use(auth);
router.use(requireAdmin);

router.post(
    '/list',
    leaveRequestValidation.adminListLeaveRules,
    leaveRequestController.getAdminLeaveRequests
);

router.post(
    '/detail',
    ...leaveRequestValidation.idBodyRule,
    leaveRequestController.getLeaveRequestDetail
);

router.post(
    '/review',
    leaveRequestValidation.adminReviewLeaveRules,
    leaveRequestController.reviewLeaveRequest
);

module.exports = router;
