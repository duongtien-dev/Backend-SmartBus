const mongoose = require('mongoose');
const Review = require('../models/Review');

const POPULATE = [
    { path: 'user', select: 'full_name email' },
    { path: 'route', select: 'code name' },
];

async function createReview(userId, data) {
    const routeId = data.routeId;
    const existing = await Review.findOne({ user: userId, route: routeId });
    if (existing) {
        throw new Error('Bạn đã đánh giá tuyến này');
    }

    const created = await Review.create({
        route: routeId,
        user: userId,
        rating: data.rating,
        content: data.content || '',
    });

    return Review.findById(created._id).populate(POPULATE).lean();
}

async function updateReview(reviewId, userId, data) {
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) throw new Error('Đánh giá không tồn tại hoặc không có quyền sửa');
    const { user: _user, route: _route, ...allowed } = data;
    Object.assign(review, allowed);
    await review.save();
    return Review.findById(review._id).populate(POPULATE).lean();
}

async function deleteReview(reviewId, userId) {
    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
    if (!review) throw new Error('Đánh giá không tồn tại hoặc không có quyền xóa');
    return true;
}

async function listReviews({ page = 1, limit = 10, rating, sort = 'newest', route, user }) {
    const query = {};
    if (route) query.route = route;
    if (user) query.user = user;
    if (rating != null && rating !== '') {
        const r = Number(rating);
        if (r >= 1 && r <= 5) query.rating = r;
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    return Review.find(query)
        .sort(sortOpt)
        .skip(skip)
        .limit(limit)
        .populate(POPULATE)
        .lean();
}

async function getReviewById(reviewId) {
    const review = await Review.findById(reviewId).populate(POPULATE).lean();
    if (!review) throw new Error('Đánh giá không tồn tại');
    return review;
}

async function getReviewSummary(routeId) {
    const match = { route: new mongoose.Types.ObjectId(routeId) };

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
