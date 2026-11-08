const { searchPlaces } = require('../services/suggestLocation');

async function suggestLocations(req, res) {
    try {
        const input = req.body?.keyword ?? req.query?.keyword;
        const keyword = typeof input === 'string' ? input.trim() : '';
        if (!keyword) {
            return res.status(400).json({ success: false, message: 'keyword is required' });
        }
        if (keyword.length > 200) {
            return res.status(400).json({ success: false, message: 'keyword must not exceed 200 characters' });
        }

        const data = await searchPlaces(keyword);
        return res.json({
            success: true,
            message: 'Lấy gợi ý địa điểm thành công',
            data,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: 'Không thể lấy gợi ý địa điểm',
            error: error.message,
        });
    }
}

module.exports = { suggestLocations };
