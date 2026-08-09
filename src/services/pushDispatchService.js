const TripSubscription = require('../models/TripSubscription');
const liveService = require('./liveService');
const pushService = require('./pushService');

/** Không spam cùng subscription trong khoảng này */
const NOTIFY_COOLDOWN_MS = 20 * 60 * 1000;

/**
 * Quét TripSubscription active → nếu ETA ≤ ngưỡng thì gửi Expo push.
 * Gọi từ cron (`npm run worker:push`) hoặc sau khi cập nhật GPS.
 */
async function dispatchDueNotifications({ limit = 200 } = {}) {
    const subscriptions = await TripSubscription.find({ active: true })
        .sort({ updatedAt: 1 })
        .limit(Math.min(Math.max(Number(limit) || 200, 1), 500))
        .populate('stopId', 'name')
        .lean();

    const summary = {
        checked: subscriptions.length,
        notified: 0,
        skipped: 0,
        errors: 0,
    };

    const now = Date.now();

    for (const sub of subscriptions) {
        try {
            if (
                sub.lastNotifiedAt &&
                now - new Date(sub.lastNotifiedAt).getTime() < NOTIFY_COOLDOWN_MS
            ) {
                summary.skipped += 1;
                continue;
            }

            const eta = await liveService.getEta({
                routeId: sub.routeId,
                stopId: sub.stopId?._id || sub.stopId,
            });

            const nearest = eta.nearestEtaMinutes;
            const threshold = Math.min(
                Math.max(Number(sub.notifyBeforeMinutes) || 5, 1),
                60
            );

            if (nearest == null || nearest > threshold) {
                summary.skipped += 1;
                continue;
            }

            const stopName = sub.stopId?.name || 'trạm đã chọn';
            const plate =
                eta.vehicles?.[0]?.plateNumber ||
                eta.vehicles?.[0]?.routeCode ||
                'xe buýt';

            await pushService.sendToUser(sub.userId, {
                title: 'Xe sắp tới trạm',
                body: `${plate} ~${nearest} phút nữa tới ${stopName}`,
                data: {
                    type: 'trip_eta',
                    routeId: String(sub.routeId),
                    stopId: String(sub.stopId?._id || sub.stopId),
                    etaMinutes: nearest,
                },
            });

            await TripSubscription.updateOne(
                { _id: sub._id },
                { $set: { lastNotifiedAt: new Date() } }
            );
            summary.notified += 1;
        } catch {
            summary.errors += 1;
        }
    }

    return summary;
}

/** Fire-and-forget — không chặn response GPS */
function triggerDispatchInBackground() {
    setImmediate(() => {
        dispatchDueNotifications().catch(() => {});
    });
}

module.exports = {
    dispatchDueNotifications,
    triggerDispatchInBackground,
    NOTIFY_COOLDOWN_MS,
};
