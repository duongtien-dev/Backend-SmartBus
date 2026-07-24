const express = require('express');
const auth = require('../middlewares/auth');
const requireStaff = require('../middlewares/requireStaff');
const scanLogController = require('../controllers/scanLogController');
const scanLogValidation = require('../validations/scanLogValidation');

const router = express.Router();
router.use(auth);
router.use(requireStaff);

router.post(
    '/my',
    scanLogValidation.myScanLogsRules,
    scanLogController.getMyScanLogs
);

module.exports = router;
