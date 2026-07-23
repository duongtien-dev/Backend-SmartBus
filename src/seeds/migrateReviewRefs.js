/**
 * Đổi field cũ routeId/userId → route/user trên collection reviews.
 * Chạy một lần khi start server (idempotent).
 */
async function migrateReviewRefs() {
    const Review = require('../models/Review');
    const collection = Review.collection;

    const legacyCount = await collection.countDocuments({
        $or: [{ routeId: { $exists: true } }, { userId: { $exists: true } }],
    });
    if (!legacyCount) return;

    await collection.updateMany(
        { routeId: { $exists: true }, route: { $exists: false } },
        [{ $set: { route: '$routeId' } }]
    );
    await collection.updateMany(
        { userId: { $exists: true }, user: { $exists: false } },
        [{ $set: { user: '$userId' } }]
    );
    await collection.updateMany(
        {},
        { $unset: { routeId: '', userId: '' } }
    );

    console.log(`[migrate] Renamed review refs for ${legacyCount} document(s)`);
}

module.exports = { migrateReviewRefs };
