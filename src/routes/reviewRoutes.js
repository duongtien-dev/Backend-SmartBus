const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const reviewValidation = require('../validations/reviewValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    reviewValidation.createReviewRules,
    reviewValidation.validate,
    reviewController.createReview
);

router.post(
    '/update',
    auth,
    ...reviewValidation.idBodyRule,
    reviewValidation.updateReviewRules,
    reviewValidation.validate,
    reviewController.updateReview
);

router.post(
    '/delete',
    auth,
    ...reviewValidation.idBodyRule,
    reviewValidation.validate,
    reviewController.deleteReview
);

router.post(
    '/listReviews',
    reviewValidation.listReviewRules,
    reviewValidation.validate,
    reviewController.listReviews
);

router.post(
    '/detail',
    ...reviewValidation.idBodyRule,
    reviewValidation.validate,
    reviewController.getReviewDetail
);

module.exports = router;
