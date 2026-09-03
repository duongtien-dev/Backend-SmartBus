const express = require('express');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const routeReportController = require('../controllers/routeReportController');
const routeReportValidation = require('../validations/routeReportValidation');

const router = express.Router();
router.use(auth);
router.use(requireAdmin);

router.post(
    '/review',
    routeReportValidation.adminReviewRules,
    routeReportController.reviewRouteReport
);

module.exports = router;
