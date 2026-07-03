const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const routeValidation = require('../validations/routeValidation');
const auth = require('../middlewares/auth');

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
    routeValidation.listRouteRules,
    routeController.listRoutes
);

router.post(
    '/detail',
    ...routeValidation.idBodyRule,
    routeController.getRouteDetail
);

module.exports = router;
