const express = require('express');
const controller = require('../controllers/suggestLocationController');

const router = express.Router();
router.post('/', controller.suggestLocations);

module.exports = router;
