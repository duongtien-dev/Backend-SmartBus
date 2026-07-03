const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const reviewValidation = require('../validations/reviewValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    reviewValidation.createReviewRules,
    reviewController.createReview
);

router.post(
    '/update',
    auth,
    ...reviewValidation.idBodyRule,
    reviewValidation.updateReviewRules,
    reviewController.updateReview
);

router.post(
    '/delete',
    auth,
    ...reviewValidation.idBodyRule,
    reviewController.deleteReview
);

router.post(
    '/listReviews',
    reviewValidation.listReviewRules,
    reviewController.listReviews
);

router.post(
    '/detail',
    ...reviewValidation.idBodyRule,
    reviewController.getReviewDetail
);

module.exports = router;
