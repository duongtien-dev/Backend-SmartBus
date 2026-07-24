const express = require('express');
const auth = require('../middlewares/auth');
const requireStaff = require('../middlewares/requireStaff');
const leaveRequestController = require('../controllers/leaveRequestController');
const leaveRequestValidation = require('../validations/leaveRequestValidation');

const router = express.Router();
router.use(auth);
router.use(requireStaff);

router.post(
    '/submit',
    leaveRequestValidation.submitLeaveRules,
    leaveRequestController.submitLeaveRequest
);

router.post(
    '/my',
    leaveRequestValidation.myLeaveBodyRules,
    leaveRequestController.getMyLeaveRequests
);

module.exports = router;
