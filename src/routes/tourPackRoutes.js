const express = require('express');
const tourPackController = require('../controllers/tourPackController');

const router = express.Router();

router.post('/list', tourPackController.listTourPacks);
router.post('/detail', tourPackController.getTourPackDetail);

module.exports = router;
