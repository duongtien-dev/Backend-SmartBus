const tourPackService = require('../services/tourPackService');

async function listTourPacks(req, res) {
    try {
        const locale = req.body?.locale || req.query?.locale || 'vi';
        const data = tourPackService.listTourPacks(locale);
        return res.json({
            success: true,
            message: 'Lấy gói du lịch thành công',
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getTourPackDetail(req, res) {
    try {
        const locale = req.body?.locale || 'vi';
        const id = req.body?.id;
        const data = tourPackService.getTourPackById(id, locale);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy gói du lịch',
            });
        }
        return res.json({
            success: true,
            message: 'Lấy chi tiết gói du lịch thành công',
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    listTourPacks,
    getTourPackDetail,
};
