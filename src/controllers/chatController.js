const chatService = require('../services/chatService');

async function sendMessage(req, res) {
    try {
        const locale = req.body.locale || 'vi';
        const data = await chatService.chat({
            messages: req.body.messages,
            locale,
        });
        return res.json({
            success: true,
            message: 'OK',
            data,
        });
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: error.message || 'Không thể trả lời lúc này',
        });
    }
}

module.exports = { sendMessage };
