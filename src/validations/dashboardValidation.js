const { body } = require('express-validator');

const summaryBodyRules = [
    body('from')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('from pháº£i lÃ  chuá»—i ngÃ y ISO 8601'),
    body('to')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('to pháº£i lÃ  chuá»—i ngÃ y ISO 8601'),
    body('granularity')
        .optional()
        .isIn(['day', 'week', 'month'])
        .withMessage('granularity pháº£i lÃ  day, week hoáº·c month'),
    body('topRoutesLimit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('topRoutesLimit tá»« 1 Ä‘áº¿n 50'),
    body().custom((_value, { req }) => {
        const fromRaw = req.body.from;
        const toRaw = req.body.to;
        const hasFrom = fromRaw !== undefined && fromRaw !== null && String(fromRaw).trim() !== '';
        const hasTo = toRaw !== undefined && toRaw !== null && String(toRaw).trim() !== '';
        if (hasFrom !== hasTo) {
            throw new Error('from vÃ  to pháº£i gá»­i cÃ¹ng lÃºc hoáº·c Ä‘á»u bá» trá»‘ng');
        }
        if (hasFrom && hasTo) {
            const from = new Date(fromRaw);
            const to = new Date(toRaw);
            if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
                throw new Error('from/to khÃ´ng há»£p lá»‡');
            }
            if (from.getTime() > to.getTime()) {
                throw new Error('from pháº£i nhá» hÆ¡n hoáº·c báº±ng to');
            }
        }
        return true;
    }),
];

module.exports = {
    summaryBodyRules,
};
