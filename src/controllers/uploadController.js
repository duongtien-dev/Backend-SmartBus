const { uploadFromBuffer } = require('../utils/cloudinary');
const config = require('../config');

async function uploadImages(req, res) {
    if (!req.files?.length) {
        return res.status(400).json({ success: false, message: 'Chưa chọn ảnh' });
    }
    if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
        return res.status(503).json({ success: false, message: 'Chưa cấu hình Cloudinary' });
    }
    try {
        const urls = [];
        for (const file of req.files) {
            const result = await uploadFromBuffer(file.buffer);
            urls.push(result.secure_url);
        }
        res.json({ success: true, message: 'Upload ảnh thành công', data: urls });
    } catch (err) {
        console.error('[Upload]', err);
        res.status(500).json({ success: false, message: err.message || 'Lỗi upload ảnh' });
    }
}

module.exports = { uploadImages };
