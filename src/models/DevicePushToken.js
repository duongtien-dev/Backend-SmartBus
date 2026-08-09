const mongoose = require('mongoose');

/** Token FCM/APNs / Expo push — Trục A2 */
const devicePushTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            trim: true,
        },
        platform: {
            type: String,
            enum: ['ios', 'android', 'web', 'expo'],
            default: 'expo',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

devicePushTokenSchema.index({ userId: 1, token: 1 }, { unique: true });

module.exports = mongoose.model('DevicePushToken', devicePushTokenSchema);
