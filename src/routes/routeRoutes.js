const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const routeValidation = require('../validations/routeValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    routeValidation.createRouteRules,
    routeValidation.validate,
    routeController.createRoute
);

router.post(
    '/update',
    auth,
    ...routeValidation.idBodyRule,
    routeValidation.updateRouteRules,
    routeValidation.validate,
    routeController.updateRoute
);

router.post(
    '/delete',
    auth,
    ...routeValidation.idBodyRule,
    routeValidation.validate,
    routeController.deleteRoute
);

router.post(
    '/listRoutes',
    routeValidation.listRouteRules,
    routeValidation.validate,
    routeController.listRoutes
);

router.post(
    '/detail',
    ...routeValidation.idBodyRule,
    routeValidation.validate,
    routeController.getRouteDetail
);

module.exports = router;
