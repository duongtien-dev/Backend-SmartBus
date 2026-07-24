const scanLogService = require('../services/scanLogService');

async function getMyScanLogs(req, res) {
    try {
        const result = await scanLogService.getMyScanLogs(req.user._id, req.body);
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getMyScanLogs
};
