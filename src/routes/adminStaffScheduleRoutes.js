const express = require('express');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const staffScheduleController = require('../controllers/staffScheduleController');
const staffScheduleValidation = require('../validations/staffScheduleValidation');

const router = express.Router();
router.use(auth);
router.use(requireAdmin);

router.post(
    '/',
    staffScheduleValidation.createScheduleRules,
    staffScheduleController.createSchedule
);

module.exports = router;
