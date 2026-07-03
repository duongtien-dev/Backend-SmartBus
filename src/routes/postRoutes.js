const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postValidation = require('../validations/postValidation');
const auth = require('../middlewares/auth');

router.post(
    '/create',
    auth,
    postValidation.createPostRules,
    postController.createPost
);

router.post(
    '/update',
    auth,
    ...postValidation.idBodyRule,
    postValidation.updatePostRules,
    postController.updatePost
);

router.post(
    '/delete',
    auth,
    ...postValidation.idBodyRule,
    postController.deletePost
);

router.post(
    '/listPosts',
    postValidation.listPostRules,
    postController.listPosts
);

router.post(
    '/detail',
    ...postValidation.idBodyRule,
    postController.getPostDetail
);

module.exports = router;
