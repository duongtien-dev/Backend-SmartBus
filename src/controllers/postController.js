const postService = require('../services/postService');

async function createPost(req, res) {
    try {
        const post = await postService.createPost(req.user._id, req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updatePost(req, res) {
    try {
        const { id, ...data } = req.body;
        const post = await postService.updatePost(id, req.user._id, data);
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deletePost(req, res) {
    try {
        await postService.deletePost(req.body.id, req.user._id);
        res.json({ success: true, message: 'Đã xóa bài viết', data: null });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function listPosts(req, res) {
    try {
        const { page, limit, search, sort } = req.body;
        const result = await postService.listPosts({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search,
            sort: sort || 'newest',
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getPostDetail(req, res) {
    try {
        const post = await postService.getPostById(req.body.id);
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    listPosts,
    getPostDetail,
};
