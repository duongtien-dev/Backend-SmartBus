const chatService = require('../services/chatService');
const apiRes = require('../utils/apiResponse');

async function sendMessage(req, res) {
    const { messages, locale = 'vi', conversationId } = req.body || {};
    if (!Array.isArray(messages) || !messages.length || messages.some((message) =>
        !message || !['user', 'model'].includes(message.role) ||
        typeof message.text !== 'string' || !message.text.trim() || message.text.length > 4000
    ) || messages[0].role !== 'user' || messages.at(-1).role !== 'user') {
        return apiRes.error(res, {
            message: 'messages phải bắt đầu và kết thúc bằng tin nhắn user; mỗi tin có role user/model và text từ 1 đến 4000 ký tự.',
        });
    }
    if (!['vi', 'en', 'ja'].includes(locale)) {
        return apiRes.error(res, { message: 'locale phải là vi, en hoặc ja.' });
    }
    if (conversationId != null && (typeof conversationId !== 'string' || conversationId.length > 128)) {
        return apiRes.error(res, { message: 'conversationId phải là chuỗi tối đa 128 ký tự.' });
    }

    try {
        const data = await chatService.reply({ messages, locale });
        if (conversationId) data.conversationId = conversationId;
        return apiRes.success(res, { data });
    } catch (error) {
        return apiRes.error(res, {
            status: error.status || 502,
            message: error.status ? error.message : 'Chatbot tạm thời không khả dụng. Vui lòng thử lại.',
        });
    }
}

module.exports = { sendMessage };
