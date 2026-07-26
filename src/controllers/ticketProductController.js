const ticketProductService = require('../services/ticketProductService');

async function listActive(req, res) {
    try {
        const data = await ticketProductService.listActiveProducts();
        res.json({ success: true, message: 'Lấy danh sách loại vé đang bán thành công', data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function listAll(req, res) {
    try {
        const data = await ticketProductService.listAllProducts();
        res.json({ success: true, message: 'Lấy danh sách loại vé thành công', data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getDetail(req, res) {
    try {
        const data = await ticketProductService.getProductById(req.body.id);
        res.json({ success: true, message: 'Lấy chi tiết loại vé thành công', data });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
    try {
        const data = await ticketProductService.createProduct(req.body);
        res.status(201).json({ success: true, message: 'Tạo loại vé thành công', data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function update(req, res) {
    try {
        const { id, ...payload } = req.body;
        const data = await ticketProductService.updateProduct(id, payload);
        res.json({ success: true, message: 'Cập nhật loại vé thành công', data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function softDelete(req, res) {
    try {
        const data = await ticketProductService.softDeleteProduct(req.body.id);
        res.json({ success: true, message: 'Đã ngưng bán loại vé', data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    listActive,
    listAll,
    getDetail,
    create,
    update,
    softDelete,
};
