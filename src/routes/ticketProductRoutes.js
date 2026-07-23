const express = require('express');
const router = express.Router();
const ticketProductController = require('../controllers/ticketProductController');

router.post('/list', ticketProductController.listActive);

module.exports = router;
