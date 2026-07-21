const { body } = require('express-validator');

const createRouteRules = [
    body('code').trim().notEmpty().withMessage('MÃ£ tuyáº¿n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('name').trim().notEmpty().withMessage('TÃªn tuyáº¿n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('description').optional().trim(),
    body('isHot').optional().isBoolean(),
    body('turnOnDay').optional().isInt({ min: 0, max: 7 }),
    body('startName').optional().trim(),
    body('endName').optional().trim(),
    body('stopsCount').optional().isInt({ min: 0 }),
    body('stops').optional().isArray().withMessage('stops pháº£i lÃ  máº£ng'),
    body('stops.*').optional().isMongoId().withMessage('Má»—i pháº§n tá»­ stops pháº£i lÃ  ObjectId'),
    body('staffId').optional().isMongoId().withMessage('staffId khÃ´ng há»£p lá»‡'),
];

const updateRouteRules = [
    body('code').optional().trim().notEmpty().withMessage('MÃ£ tuyáº¿n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('name').optional().trim().notEmpty().withMessage('TÃªn tuyáº¿n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('description').optional().trim(),
    body('isHot').optional().isBoolean(),
    body('turnOnDay').optional().isInt({ min: 0, max: 7 }),
    body('startName').optional().trim(),
    body('endName').optional().trim(),
    body('stops').optional().isArray().withMessage('stops pháº£i lÃ  máº£ng'),
    body('stops.*').optional().isMongoId().withMessage('Má»—i pháº§n tá»­ stops pháº£i lÃ  ObjectId'),
    body('staffId').optional().isMongoId().withMessage('staffId khÃ´ng há»£p lá»‡'),
];

const listRouteRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit tá»« 1-100'),
    body('search').optional().trim(),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort pháº£i lÃ  newest hoáº·c oldest'),
    body('userId').optional().isMongoId().withMessage('userId khÃ´ng há»£p lá»‡'),
    body('unreviewedOnly').optional().isBoolean().withMessage('unreviewedOnly pháº£i lÃ  boolean'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    createRouteRules,
    updateRouteRules,
    listRouteRules,
    idBodyRule,
};
