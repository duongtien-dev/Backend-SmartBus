const TicketProduct = require('../models/TicketProduct');

const DEFAULT_PRODUCTS = [
    {
        code: 'single',
        title: 'Vé lượt',
        validity: 'Có giá trị sử dụng 1 lần',
        unitPrice: 8000,
        active: true,
        sortOrder: 1,
    },
    {
        code: 'monthlySingleRoute',
        title: 'Vé tháng đơn tuyến',
        validity: 'Có giá trị trong 1 tháng',
        unitPrice: 800000,
        active: true,
        sortOrder: 2,
    },
    {
        code: 'monthlyInterRoute',
        title: 'Vé tháng liên tuyến',
        validity: 'Có giá trị trong 1 tháng',
        unitPrice: 800000,
        active: true,
        sortOrder: 3,
    },
];

async function seedTicketProducts() {
    for (const product of DEFAULT_PRODUCTS) {
        await TicketProduct.updateOne(
            { code: product.code },
            { $setOnInsert: product },
            { upsert: true }
        );
    }
}

module.exports = { seedTicketProducts, DEFAULT_PRODUCTS };
