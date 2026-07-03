const { body } = require('express-validator');

const createRouteReportRules = [
    body('routeId').isMongoId().withMessage('routeId khÃ´ng há»£p lá»‡'),
    body('type')
        .optional()
        .isIn(['issue', 'suggestion', 'complaint', 'other'])
        .withMessage('type pháº£i lÃ  issue, suggestion, complaint hoáº·c other'),
    body('content').trim().notEmpty().withMessage('Ná»™i dung khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('phone').optional().trim(),
];

const updateRouteReportRules = [
    body('type')
        .optional()
        .isIn(['issue', 'suggestion', 'complaint', 'other'])
        .withMessage('type pháº£i lÃ  issue, suggestion, complaint hoáº·c other'),
    body('content').optional().trim().notEmpty().withMessage('Ná»™i dung khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('phone').optional().trim(),
    body('status')
        .optional()
        .isIn(['new', 'in_progress', 'resolved', 'rejected'])
        .withMessage('status pháº£i lÃ  new, in_progress, resolved hoáº·c rejected'),
];

const listRouteReportRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit tá»« 1-100'),
    body('search').optional().trim(),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort pháº£i lÃ  newest hoáº·c oldest'),
    body('userId').optional().isMongoId().withMessage('userId khÃ´ng há»£p lá»‡'),
    body('status')
        .optional()
        .isIn(['new', 'in_progress', 'resolved', 'rejected'])
        .withMessage('status khÃ´ng há»£p lá»‡'),
    body('type')
        .optional()
        .isIn(['issue', 'suggestion', 'complaint', 'other'])
        .withMessage('type khÃ´ng há»£p lá»‡'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    createRouteReportRules,
    updateRouteReportRules,
    listRouteReportRules,
    idBodyRule,
};
