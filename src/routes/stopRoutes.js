const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const stopValidation = require('../validations/stopValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    stopValidation.createStopRules,
    stopValidation.validate,
    stopController.createStop
);

router.post(
    '/update',
    auth,
    ...stopValidation.idBodyRule,
    stopValidation.updateStopRules,
    stopValidation.validate,
    stopController.updateStop
);

router.post(
    '/delete',
    auth,
    ...stopValidation.idBodyRule,
    stopValidation.validate,
    stopController.deleteStop
);

router.post(
    '/listByRoute',
    stopValidation.listStopsByRouteRules,
    stopValidation.validate,
    stopController.listStopsByRoute
);

router.post(
    '/detail',
    ...stopValidation.idBodyRule,
    stopValidation.validate,
    stopController.getStopDetail
);

module.exports = router;
