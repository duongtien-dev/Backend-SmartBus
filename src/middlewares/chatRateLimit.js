const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 20;
const hitsByKey = new Map();

function chatRateLimit(req, res, next) {
    const key = req.user?._id ? String(req.user._id) : req.ip || 'anon';
    const now = Date.now();
    const recent = (hitsByKey.get(key) || []).filter((ts) => now - ts < WINDOW_MS);

    if (recent.length >= MAX_HITS) {
        return res.status(429).json({
            success: false,
            message: 'Bạn gửi quá nhiều tin. Vui lòng thử lại sau vài phút.',
        });
    }

    recent.push(now);
    hitsByKey.set(key, recent);
    next();
}

module.exports = chatRateLimit;
