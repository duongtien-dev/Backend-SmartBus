const mongoose = require('mongoose');
const Review = require('../models/Review');

async function createReview(userId, data) {
    const existing = await Review.findOne({ userId, routeId: data.routeId });
    if (existing) {
        throw new Error('Bạn đã đánh giá tuyến này');
    }

    const review = await Review.create({ ...data, userId });
    return review;
}

async function updateReview(reviewId, userId, data) {
    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) throw new Error('Đánh giá không tồn tại hoặc không có quyền sửa');
    const { userId: _uid, routeId: _rid, ...allowed } = data;
    Object.assign(review, allowed);
    await review.save();
    return review;
}

async function deleteReview(reviewId, userId) {
    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) throw new Error('Đánh giá không tồn tại hoặc không có quyền xóa');
    return true;
}

async function listReviews({ page = 1, limit = 10, rating, sort = 'newest', routeId, userId }) {
    const query = {};
    if (routeId) query.routeId = routeId;
    if (userId) query.userId = userId;
    if (rating != null && rating !== '') {
        const r = Number(rating);
        if (r >= 1 && r <= 5) query.rating = r;
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [reviews] = await Promise.all([
        Review.find(query)
            .sort(sortOpt)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'full_name email')
            .populate('routeId', 'code name'),
    ]);

    return reviews;
}

async function getReviewById(reviewId) {
    const review = await Review.findById(reviewId)
        .populate('userId', 'full_name email')
        .populate('routeId', 'code name');
    if (!review) throw new Error('Đánh giá không tồn tại');
    return review;
}

async function getReviewSummary(routeId) {
    const match = { routeId: new mongoose.Types.ObjectId(routeId) };

    const [stats, distributionRows] = await Promise.all([
        Review.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    average: { $avg: '$rating' },
                },
            },
        ]),
        Review.aggregate([
            { $match: match },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
        ]),
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distributionRows.forEach((row) => {
        const rating = Number(row._id);
        if (rating >= 1 && rating <= 5) {
            distribution[rating] = row.count;
        }
    });

    const total = stats[0]?.total ?? 0;
    const average =
        total > 0 ? Math.round((stats[0].average + Number.EPSILON) * 10) / 10 : 0;

    return { average, total, distribution };
}

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    listReviews,
    getReviewById,
    getReviewSummary,
};
