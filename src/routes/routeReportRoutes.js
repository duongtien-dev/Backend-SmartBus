const express = require('express');
const router = express.Router();
const routeReportController = require('../controllers/routeReportController');
const routeReportValidation = require('../validations/routeReportValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    routeReportValidation.createRouteReportRules,
    routeReportValidation.validate,
    routeReportController.createRouteReport
);

router.post(
    '/update',
    auth,
    ...routeReportValidation.idBodyRule,
    routeReportValidation.updateRouteReportRules,
    routeReportValidation.validate,
    routeReportController.updateRouteReport
);

router.post(
    '/delete',
    auth,
    ...routeReportValidation.idBodyRule,
    routeReportValidation.validate,
    routeReportController.deleteRouteReport
);

router.post(
    '/listRouteReports',
    routeReportValidation.listRouteReportRules,
    routeReportValidation.validate,
    routeReportController.listRouteReports
);

router.post(
    '/detail',
    auth,
    ...routeReportValidation.idBodyRule,
    routeReportValidation.validate,
    routeReportController.getRouteReportDetail
);

module.exports = router;
