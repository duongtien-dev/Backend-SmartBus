const { body } = require('express-validator');

const summaryBodyRules = [
    body('from')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('from phải là chuỗi ngày ISO 8601'),
    body('to')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('to phải là chuỗi ngày ISO 8601'),
    body('granularity')
        .optional()
        .isIn(['day', 'week', 'month'])
        .withMessage('granularity phải là day, week hoặc month'),
    body('topRoutesLimit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('topRoutesLimit từ 1 đến 50'),
    body().custom((_value, { req }) => {
        const fromRaw = req.body.from;
        const toRaw = req.body.to;
        const hasFrom = fromRaw !== undefined && fromRaw !== null && String(fromRaw).trim() !== '';
        const hasTo = toRaw !== undefined && toRaw !== null && String(toRaw).trim() !== '';
        if (hasFrom !== hasTo) {
            throw new Error('from và to phải gửi cùng lúc hoặc đều bỏ trống');
        }
        if (hasFrom && hasTo) {
            const from = new Date(fromRaw);
            const to = new Date(toRaw);
            if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
                throw new Error('from/to không hợp lệ');
            }
            if (from.getTime() > to.getTime()) {
                throw new Error('from phải nhỏ hơn hoặc bằng to');
            }
        }
        return true;
    }),
];

module.exports = {
    summaryBodyRules,
};
