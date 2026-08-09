const TicketProduct = require('../models/TicketProduct');

/**
 * 3 loại vé mặc định theo enum TicketProduct.code
 * - single: vé lượt
 * - monthlySingleRoute: vé tháng đơn tuyến
 * - monthlyInterRoute: vé tháng liên tuyến
 */
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
        validity: 'Có giá trị trong 1 tháng (áp dụng 1 tuyến)',
        unitPrice: 80000,
        active: true,
        sortOrder: 2,
    },
    {
        code: 'monthlyInterRoute',
        title: 'Vé tháng liên tuyến',
        validity: 'Có giá trị trong 1 tháng (áp dụng mọi tuyến)',
        unitPrice: 120000,
        active: true,
        sortOrder: 3,
    },
];

/**
 * @param {{ force?: boolean }} [opts]
 * - force=false (default): chỉ insert nếu chưa có code (không ghi đè)
 * - force=true: upsert và cập nhật toàn bộ field seed
 */
async function seedTicketProducts({ force = false } = {}) {
    const results = [];

    for (const product of DEFAULT_PRODUCTS) {
        if (force) {
            const doc = await TicketProduct.findOneAndUpdate(
                { code: product.code },
                { $set: product },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            results.push({
                code: product.code,
                action: 'upserted',
                id: String(doc._id),
                unitPrice: doc.unitPrice,
            });
            continue;
        }

        const existing = await TicketProduct.findOne({ code: product.code }).lean();
        if (existing) {
            results.push({
                code: product.code,
                action: 'skipped',
                id: String(existing._id),
                unitPrice: existing.unitPrice,
            });
            continue;
        }

        const created = await TicketProduct.create(product);
        results.push({
            code: product.code,
            action: 'created',
            id: String(created._id),
            unitPrice: created.unitPrice,
        });
    }

    return {
        force,
        count: results.length,
        items: results,
    };
}

module.exports = { seedTicketProducts, DEFAULT_PRODUCTS };
