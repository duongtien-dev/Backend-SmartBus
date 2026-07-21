const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const routeValidation = require('../validations/routeValidation');
const auth = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');

router.post(
    '/create',
    auth,
    routeValidation.createRouteRules,
    routeController.createRoute
);

router.post(
    '/update',
    auth,
    ...routeValidation.idBodyRule,
    routeValidation.updateRouteRules,
    routeController.updateRoute
);

router.post(
    '/delete',
    auth,
    ...routeValidation.idBodyRule,
    routeController.deleteRoute
);

router.post(
    '/listRoutes',
    optionalAuth,
    routeValidation.listRouteRules,
    routeController.listRoutes
);

router.post(
    '/detail',
    optionalAuth,
    ...routeValidation.idBodyRule,
    routeController.getRouteDetail
);

module.exports = router;
