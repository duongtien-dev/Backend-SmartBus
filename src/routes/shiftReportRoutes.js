const express = require('express');
const auth = require('../middlewares/auth');
const shiftReportController = require('../controllers/shiftReportController');
const shiftReportValidation = require('../validations/shiftReportValidation');
const requireStaff = require('../middlewares/requireStaff');

const router = express.Router();
router.use(auth);
router.use(requireStaff);

router.post(
    '/preview',
    shiftReportValidation.previewAndSubmitRules,
    shiftReportController.previewShiftStats
);

router.post(
    '/submit',
    shiftReportValidation.previewAndSubmitRules,
    shiftReportController.submitShiftReport
);

router.post(
    '/my',
    shiftReportValidation.myReportBodyRules,
    shiftReportController.getMyShiftReports
);

module.exports = router;
