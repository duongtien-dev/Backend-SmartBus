const { searchPlaces } = require('../services/suggestLocation');

async function suggestLocations(req, res) {
    try {
        const keyword = String(req.body.keyword || req.query.keyword || '').trim();
        if (!keyword) {
            return res.status(400).json({ success: false, message: 'keyword is required' });
        }

        const data = await searchPlaces(keyword);
        return res.json({
            success: true,
            message: 'Lấy gợi ý địa điểm thành công',
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Không thể lấy gợi ý địa điểm',
            error: error.message,
        });
    }
}

module.exports = { suggestLocations };
