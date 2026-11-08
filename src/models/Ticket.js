const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        purchaseKey: { type: String, trim: true },
        purchaseRequestHash: { type: String, select: false },
        balanceAfter: { type: Number, min: 0 },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true
        },
        routeName: {
            type: String,
            required: true,
            trim: true
        },
        startStopName: {
            type: String,
            required: true,
            trim: true
        },
        endStopName: {
            type: String,
            required: true,
            trim: true
        },
        ticketType: {
            type: String,
            enum: ['single', 'monthlySingleRoute', 'monthlyInterRoute'],
            required: true
        },
        departureDate: {
            type: Date,
            required: true
        },
        departureTime: {
            type: String,
            required: true,
            trim: true
        },
        seatQuantity: {
            type: Number,
            required: true,
            min: 1
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        customerPhone: {
            type: String,
            required: true,
            trim: true
        },
        paymentMethodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentMethod',
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },

        qrCode: {
            type: String,
            default: null,
            unique: true,
            sparse: true,
            trim: true
        },

        qrCodeImage: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: ['pending', 'paid', 'active', 'used', 'expired', 'cancelled'],
            default: 'pending'
        },

        purchaseDate: {
            type: Date,
            default: null
        },
        issueDate: {
            type: Date,
            default: null
        },
        expiryDate: {
            type: Date,
            default: null
        },

        usedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

ticketSchema.index({ user: 1, purchaseKey: 1 }, {
    unique: true,
    partialFilterExpression: { purchaseKey: { $type: 'string' } },
});

module.exports = mongoose.model('Ticket', ticketSchema);
