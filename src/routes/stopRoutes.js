const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const stopValidation = require('../validations/stopValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    stopValidation.createStopRules,
    stopController.createStop
);

router.post(
    '/update',
    auth,
    ...stopValidation.idBodyRule,
    stopValidation.updateStopRules,
    stopController.updateStop
);

router.post(
    '/delete',
    auth,
    ...stopValidation.idBodyRule,
    stopController.deleteStop
);

router.post(
    '/listByRoute',
    stopValidation.listStopsByRouteRules,
    stopController.listStopsByRoute
);

router.post(
    '/detail',
    ...stopValidation.idBodyRule,
    stopController.getStopDetail
);

module.exports = router;
