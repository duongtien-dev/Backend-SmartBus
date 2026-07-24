const express = require('express');
const auth = require('../middlewares/auth');
const requireStaff = require('../middlewares/requireStaff');
const activeShiftController = require('../controllers/activeShiftController');
const activeShiftValidation = require('../validations/activeShiftValidation');

const router = express.Router();
router.use(auth);
router.use(requireStaff);

router.post(
    '/check-in',
    activeShiftValidation.checkInRules,
    activeShiftController.checkIn
);

router.post('/active', activeShiftController.getActive);

router.post('/end', activeShiftController.endShift);

module.exports = router;
