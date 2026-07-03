const express = require('express');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const dashboardController = require('../controllers/dashboardController');
const dashboardValidation = require('../validations/dashboardValidation');

const router = express.Router();
router.use(auth);
router.use(requireAdmin);

router.post(
    '/summary',
    dashboardValidation.summaryBodyRules,
    dashboardController.postSummary
);

module.exports = router;
