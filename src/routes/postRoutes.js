const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postValidation = require('../validations/postValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    postValidation.createPostRules,
    postValidation.validate,
    postController.createPost
);

router.post(
    '/update',
    auth,
    ...postValidation.idBodyRule,
    postValidation.updatePostRules,
    postValidation.validate,
    postController.updatePost
);

router.post(
    '/delete',
    auth,
    ...postValidation.idBodyRule,
    postValidation.validate,
    postController.deletePost
);

router.post(
    '/listPosts',
    postValidation.listPostRules,
    postValidation.validate,
    postController.listPosts
);

router.post(
    '/detail',
    ...postValidation.idBodyRule,
    postValidation.validate,
    postController.getPostDetail
);

module.exports = router;
