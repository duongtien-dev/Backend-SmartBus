const dashboardService = require('../services/dashboardService');

async function postSummary(req, res) {
    try {
        const { from, to, granularity, topRoutesLimit } = req.body;
        const data = await dashboardService.getDashboardSummary({
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
            granularity,
            topRoutesLimit: topRoutesLimit != null ? Number(topRoutesLimit) : undefined,
        });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    postSummary,
};
