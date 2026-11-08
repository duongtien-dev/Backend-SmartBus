const PaymentMethod = require('../models/paymentMethod');
const Ticket = require('../models/Ticket');

// Only the explicitly selected test users may receive opening demo credit.
async function initializeWalletBalances(userIds, amount = 80000) {
    if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid opening balance');
    const eligible = {
        user: { $in: userIds },
        balanceInitializedAt: null,
        $or: [{ balance: { $exists: false } }, { balance: null }, { balance: 0 }],
    };
    const methods = await PaymentMethod.find(eligible).select('_id user').lean();
    let modified = 0;
    for (const method of methods) {
        // A zero remaining after a wallet purchase must never be refilled by seed.
        const charged = await Ticket.exists({
            paymentMethodId: method._id,
            balanceAfter: { $exists: true },
        });
        if (charged) continue;
        const result = await PaymentMethod.updateOne(
            { ...eligible, _id: method._id },
            { $set: { balance: amount, balanceInitializedAt: new Date() } }
        );
        modified += result.modifiedCount;
    }
    return modified;
}

module.exports = { initializeWalletBalances };
