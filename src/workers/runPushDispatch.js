/**
 * Chạy 1 lần: node src/workers/runPushDispatch.js
 * Gắn cron mỗi 1–2 phút trên server production.
 */
require('dotenv').config();
const connectDB = require('../config/database');
const { dispatchDueNotifications } = require('../services/pushDispatchService');

async function main() {
    await connectDB();
    const summary = await dispatchDueNotifications();
    console.log('[push-dispatch]', JSON.stringify(summary));
    process.exit(0);
}

main().catch((error) => {
    console.error('[push-dispatch] failed', error.message);
    process.exit(1);
});
