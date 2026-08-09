const express = require('express');
const liveController = require('../controllers/liveController');
const liveValidation = require('../validations/liveValidation');

const router = express.Router();

router.post(
    '/route-vehicles',
    liveValidation.routeVehiclesRules,
    liveController.listRouteVehicles
);

router.post('/eta', liveValidation.etaRules, liveController.getEta);

router.post(
    '/crowding',
    liveValidation.crowdingRules,
    liveController.getCrowding
);

/** A1-Full: GPS cố định trên xe — header x-vehicle-gps-key hoặc body.deviceKey */
router.post(
    '/vehicle-gps',
    liveValidation.vehicleGpsRules,
    liveController.ingestVehicleGps
);

module.exports = router;
