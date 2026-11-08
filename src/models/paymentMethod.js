const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        provider: {
            type: String,
            enum: ['momo', 'zalopay', 'shopeepay', 'visa', 'napas'],
            required: true
        },
        // Internal app credit in integer VND, not a provider's live balance.
        balance: {
            type: Number,
            default: 0,
            min: 0,
            validate: Number.isSafeInteger,
        },
        balanceInitializedAt: { type: Date, default: null },

        // Thẻ tín dụng/ ghi nợ
        cardNumber: {
            type: String,
            default: null
        },
        expiryDate: {
            type: String,
            default: null
        },
        csc: {
            type: String,
            default: null
        },
        // Tên chủ thẻ chung cả thẻ tín dụng và thẻ ngân hàng
        cardHolderName: {
            type: String,
            default: null
        },

        // Tài khoản/ Thẻ ngân hàng
        bankName: {
            type: String,
            default: null
        },
        cccd: {
            type: String,
            default: null
        },
        accountNumber: {
            type: String,
            default: null
        },
        // Chung cho cả 2 loại
        phoneNumber: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
