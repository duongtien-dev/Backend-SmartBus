const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();
router.post('/search', tripController.searchTrip);
router.post('/detail', tripController.getTripDetail);

module.exports = router;
