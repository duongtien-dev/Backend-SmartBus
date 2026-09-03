const { body } = require('express-validator');

const sendMessageRules = [
    body('messages')
        .isArray({ min: 1, max: 20 })
        .withMessage('messages phải là mảng 1–20 tin'),
    body('messages.*.role')
        .isIn(['user', 'model'])
        .withMessage('role phải là user hoặc model'),
    body('messages.*.text')
        .isString()
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Mỗi tin tối đa 2000 ký tự'),
    body('messages').custom((messages) => {
        if (!Array.isArray(messages) || !messages.length) return true;
        const last = messages[messages.length - 1];
        if (!last || last.role !== 'user') {
            throw new Error('Tin cuối phải là tin của người dùng');
        }
        return true;
    }),
    body('locale').optional().isIn(['vi', 'en', 'ja']).withMessage('locale không hợp lệ'),
    body('conversationId')
        .optional({ nullable: true })
        .isString()
        .trim()
        .isLength({ min: 4, max: 80 })
        .withMessage('conversationId không hợp lệ'),
];

module.exports = { sendMessageRules };
