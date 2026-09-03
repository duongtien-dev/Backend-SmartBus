const express = require('express');
const chatController = require('../controllers/chatController');
const { sendMessageRules } = require('../validations/chatValidation');
const auth = require('../middlewares/auth');
const chatRateLimit = require('../middlewares/chatRateLimit');

const router = express.Router();

router.post('/', auth, chatRateLimit, sendMessageRules, chatController.sendMessage);

module.exports = router;