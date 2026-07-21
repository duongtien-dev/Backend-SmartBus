const mongoose = require('mongoose');

const favoriteRouteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true,
        },
    },
    { timestamps: true }
);

favoriteRouteSchema.index({ userId: 1, routeId: 1 }, { unique: true });
favoriteRouteSchema.index({ userId: 1, createdAt: -1 });
favoriteRouteSchema.index({ routeId: 1 });

module.exports = mongoose.model('FavoriteRoute', favoriteRouteSchema);
