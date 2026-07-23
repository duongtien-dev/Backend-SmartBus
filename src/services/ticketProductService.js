const TicketProduct = require('../models/TicketProduct');

async function listActiveProducts() {
    return TicketProduct.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
}

async function listAllProducts() {
    return TicketProduct.find().sort({ sortOrder: 1, createdAt: 1 });
}

async function getProductById(id) {
    const product = await TicketProduct.findById(id);
    if (!product) throw new Error('Loại vé không tồn tại');
    return product;
}

async function getActiveProductByCode(code) {
    const product = await TicketProduct.findOne({ code, active: true });
    if (!product) throw new Error('Loại vé không tồn tại hoặc đã ngưng bán');
    return product;
}

async function createProduct(data) {
    const exists = await TicketProduct.findOne({ code: data.code });
    if (exists) throw new Error('Mã loại vé đã tồn tại');
    return TicketProduct.create(data);
}

async function updateProduct(id, data) {
    const product = await TicketProduct.findById(id);
    if (!product) throw new Error('Loại vé không tồn tại');

    const { code, ...allowed } = data;
    Object.assign(product, allowed);
    await product.save();
    return product;
}

async function softDeleteProduct(id) {
    const product = await TicketProduct.findById(id);
    if (!product) throw new Error('Loại vé không tồn tại');
    product.active = false;
    await product.save();
    return product;
}

module.exports = {
    listActiveProducts,
    listAllProducts,
    getProductById,
    getActiveProductByCode,
    createProduct,
    updateProduct,
    softDeleteProduct,
};
