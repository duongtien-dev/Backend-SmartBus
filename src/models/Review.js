const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, default: '' },
    },
    { timestamps: true }
);

reviewSchema.index({ route: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ user: 1, route: 1 }, { unique: true });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model('Review', reviewSchema);
