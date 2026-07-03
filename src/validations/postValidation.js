const { body } = require('express-validator');

const createPostRules = [
    body('title').trim().notEmpty().withMessage('TiÃªu Ä‘á» khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('summary').optional().trim(),
    body('content').optional().trim(),
    body('thumbnail').optional().trim(),
    body('images').optional().isArray().withMessage('images pháº£i lÃ  máº£ng'),
    body('category').optional().trim(),
    body('related_routes').optional().isArray(),
    body('related_stops').optional().isArray(),
];

const updatePostRules = [
    body('title').optional().trim().notEmpty().withMessage('TiÃªu Ä‘á» khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng'),
    body('summary').optional().trim(),
    body('content').optional().trim(),
    body('thumbnail').optional().trim(),
    body('images').optional().isArray(),
    body('category').optional().trim(),
    body('related_routes').optional().isArray(),
    body('related_stops').optional().isArray(),
];

const listPostRules = [
    body('page').optional().toInt().isInt({ min: 1 }).withMessage('page pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng'),
    body('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit tá»« 1-100'),
    body('search').optional().trim(),
    body('sort').optional().isIn(['newest', 'oldest']).withMessage('sort pháº£i lÃ  newest hoáº·c oldest'),
];

const idBodyRule = [body('id').isMongoId().withMessage('ID khÃ´ng há»£p lá»‡')];

module.exports = {
    createPostRules,
    updatePostRules,
    listPostRules,
    idBodyRule,
};
