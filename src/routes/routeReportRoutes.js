const express = require('express');
const router = express.Router();
const routeReportController = require('../controllers/routeReportController');
const routeReportValidation = require('../validations/routeReportValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    routeReportValidation.createRouteReportRules,
    routeReportController.createRouteReport
);

router.post(
    '/update',
    auth,
    ...routeReportValidation.idBodyRule,
    routeReportValidation.updateRouteReportRules,
    routeReportController.updateRouteReport
);

router.post(
    '/delete',
    auth,
    ...routeReportValidation.idBodyRule,
    routeReportController.deleteRouteReport
);

router.post(
    '/listRouteReports',
    routeReportValidation.listRouteReportRules,
    routeReportController.listRouteReports
);

router.post(
    '/detail',
    auth,
    ...routeReportValidation.idBodyRule,
    routeReportController.getRouteReportDetail
);

module.exports = router;
