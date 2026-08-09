const mongoose = require('mongoose');

/** User theo dõi trạm/tuyến để nhận push ETA — Trục A2 */
const tripSubscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true,
            index: true,
        },
        stopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stop',
            required: true,
        },
        notifyBeforeMinutes: {
            type: Number,
            default: 5,
            min: 1,
            max: 60,
        },
        active: {
            type: Boolean,
            default: true,
        },
        lastNotifiedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

tripSubscriptionSchema.index(
    { userId: 1, routeId: 1, stopId: 1 },
    { unique: true }
);

module.exports = mongoose.model('TripSubscription', tripSubscriptionSchema);
