const express = require('express');
const auth = require('../middlewares/auth');
const requireStaff = require('../middlewares/requireStaff');
const staffScheduleController = require('../controllers/staffScheduleController');
const staffScheduleValidation = require('../validations/staffScheduleValidation');

const router = express.Router();
router.use(auth);
router.use(requireStaff);

router.post(
    '/my',
    staffScheduleValidation.myScheduleRules,
    staffScheduleController.getMySchedule
);

module.exports = router;
