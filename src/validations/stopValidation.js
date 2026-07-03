const { body } = require('express-validator');

const createStopRules = [
    body('routeId').isMongoId().withMessage('routeId khÃ´ng há»£p lá»‡'),
    body('stopId').trim().notEmpty().withMessage('stopId khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('name').trim().notEmpty().withMessage('TÃªn Ä‘iá»ƒm dá»«ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('location').optional(),
    body('location.type').optional().isIn(['Point']),
    body('location.coordinates').optional().isArray(),
    body('times').optional().isArray(),
    body('order').optional().isInt({ min: 0 }),
];

const updateStopRules = [
    body('stopId').optional().trim().notEmpty().withMessage('stopId khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('name').optional().trim().notEmpty().withMessage('TÃªn Ä‘iá»ƒm dá»«ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('location').optional(),
    body('location.type').optional().isIn(['Point']),
    body('location.coordinates').optional().isArray(),
    body('times').optional().isArray(),
    body('order').optional().isInt({ min: 0 }),
];

const listStopsByRouteRules = [
    body('routeId').isMongoId().withMessage('routeId khÃ´ng há»£p lá»‡'),
    body('page').optional().toInt().isInt({ min: 1 }),
    body('limit').optional().toInt().isInt({ min: 1, max: 200 }),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    createStopRules,
    updateStopRules,
    listStopsByRouteRules,
    idBodyRule,
};
