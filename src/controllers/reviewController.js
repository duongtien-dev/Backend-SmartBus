const reviewService = require('../services/reviewService');

async function createReview(req, res) {
    try {
        const review = await reviewService.createReview(req.user._id, req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateReview(req, res) {
    try {
        const { id, ...data } = req.body;
        const review = await reviewService.updateReview(id, req.user._id, data);
        res.json({ success: true, data: review });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteReview(req, res) {
    try {
        await reviewService.deleteReview(req.body.id, req.user._id);
        res.json({ success: true, message: 'Đã xóa đánh giá', data: null });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function listReviews(req, res) {
    try {
        const { page, limit, rating, sort, routeId, userId } = req.body;

        if (userId && req.user && String(req.user._id) !== String(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền xem đánh giá của người khác',
            });
        }

        const result = await reviewService.listReviews({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            rating: rating != null ? rating : undefined,
            sort: sort || 'newest',
            route: routeId || undefined,
            user: userId || undefined,
        });
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getReviewDetail(req, res) {
    try {
        const review = await reviewService.getReviewById(req.body.id);
        res.json({ success: true, data: review });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

async function getReviewSummary(req, res) {
    try {
        const { routeId } = req.body;
        const summary = await reviewService.getReviewSummary(routeId);
        res.json({ success: true, data: summary });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    listReviews,
    getReviewDetail,
    getReviewSummary,
};
