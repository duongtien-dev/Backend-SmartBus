const mongoose = require('mongoose');
const crypto = require('crypto');
const Ticket = require('../models/Ticket');
const PaymentMethod = require('../models/paymentMethod');

function resolvePurchaseKey(key) {
    // Older clients have no key. Give each of those requests a fresh checkout ID.
    // Updated clients send a stable key so network retries remain idempotent.
    if (key === undefined) return crypto.randomUUID();
    if (typeof key !== 'string' || !/^[a-zA-Z0-9_-]{16,128}$/.test(key)) {
        throw new Error('purchaseKey không hợp lệ');
    }
    return key;
}

function purchaseHash(data) {
    // Only fields defining a purchase participate; client price/balance are ignored.
    return crypto.createHash('sha256').update(JSON.stringify([
        String(data.routeId), String(data.paymentMethodId), data.ticketType,
        data.startStopName, data.endStopName, data.departureDate,
        data.departureTime || '', Number(data.seatQuantity),
        data.customerName || '', data.customerPhone || '',
    ])).digest('hex');
}

async function findPurchase(userId, purchaseKey, hash, session = null) {
    const existing = await Ticket.findOne({ user: userId, purchaseKey })
        .select('+purchaseRequestHash').session(session);
    if (existing && existing.purchaseRequestHash !== hash) {
        throw new Error('Mã thanh toán đã được dùng cho một giao dịch khác');
    }
    return existing;
}

async function createWalletPurchase(userId, data, hash) {
    if (!Number.isSafeInteger(data.price) || data.price < 0) {
        throw new Error('Giá vé không hợp lệ');
    }
    // Ensure the idempotency index exists before accepting simultaneous purchases.
    await Ticket.init();
    try {
        return await mongoose.connection.transaction(async (session) => {
            const existing = await findPurchase(userId, data.purchaseKey, hash, session);
            if (existing) return existing;
            const method = await PaymentMethod.findOneAndUpdate(
                { _id: data.paymentMethodId, user: userId, balance: { $gte: data.price } },
                { $inc: { balance: -data.price } },
                { new: true, session }
            );
            if (!method) throw new Error('Số dư không đủ để thanh toán vé');
            const [ticket] = await Ticket.create([{
                ...data, user: userId, status: 'paid',
                purchaseRequestHash: hash, balanceAfter: method.balance,
            }], { session });
            return ticket;
        });
    } catch (error) {
        // A simultaneous retry may commit first; return that same ticket.
        if (error.code === 11000 && error.keyPattern?.purchaseKey) {
            const existing = await findPurchase(userId, data.purchaseKey, hash);
            if (existing) return existing;
        }
        if (error.code === 20) {
            throw new Error('Thanh toán cần MongoDB replica set hoặc Atlas để bảo đảm giao dịch an toàn');
        }
        throw error;
    }
}

module.exports = { resolvePurchaseKey, purchaseHash, findPurchase, createWalletPurchase };
