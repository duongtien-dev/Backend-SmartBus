const DevicePushToken = require('../models/DevicePushToken');
const TripSubscription = require('../models/TripSubscription');

async function registerDevice(userId, { token, platform } = {}) {
    const normalized = String(token || '').trim();
    if (!normalized) {
        throw new Error('token là bắt buộc');
    }

    const doc = await DevicePushToken.findOneAndUpdate(
        { userId, token: normalized },
        {
            $set: {
                platform: platform || 'expo',
                active: true,
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return doc;
}

async function upsertSubscription(userId, payload = {}) {
    const { routeId, stopId, notifyBeforeMinutes = 5, active = true } = payload;
    if (!routeId || !stopId) {
        throw new Error('routeId và stopId là bắt buộc');
    }

    return TripSubscription.findOneAndUpdate(
        { userId, routeId, stopId },
        {
            $set: {
                notifyBeforeMinutes: Math.min(
                    Math.max(Number(notifyBeforeMinutes) || 5, 1),
                    60
                ),
                active: Boolean(active),
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
}

async function listSubscriptions(userId) {
    return TripSubscription.find({ userId, active: true })
        .populate('routeId', 'code name')
        .populate('stopId', 'name order')
        .sort({ updatedAt: -1 });
}

async function deleteSubscription(userId, { id, routeId, stopId } = {}) {
    if (id) {
        const deleted = await TripSubscription.findOneAndDelete({
            _id: id,
            userId,
        });
        if (!deleted) throw new Error('Subscription không tồn tại');
        return deleted;
    }
    if (routeId && stopId) {
        const deleted = await TripSubscription.findOneAndDelete({
            userId,
            routeId,
            stopId,
        });
        if (!deleted) throw new Error('Subscription không tồn tại');
        return deleted;
    }
    throw new Error('Cần id hoặc routeId+stopId');
}

module.exports = {
    registerDevice,
    upsertSubscription,
    listSubscriptions,
    deleteSubscription,
};
