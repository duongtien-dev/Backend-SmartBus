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

router.post(
    '/list',
    staffScheduleValidation.listScheduleRules,
    staffScheduleController.listSchedules
);

router.post(
    '/detail',
    ...staffScheduleValidation.idBodyRule,
    staffScheduleController.getScheduleDetail
);

router.post(
    '/update',
    staffScheduleValidation.updateScheduleRules,
    staffScheduleController.updateSchedule
);

router.post(
    '/cancel',
    ...staffScheduleValidation.idBodyRule,
    staffScheduleController.cancelSchedule
);

module.exports = router;
