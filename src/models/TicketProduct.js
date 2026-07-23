const mongoose = require('mongoose');

const TICKET_PRODUCT_CODES = ['single', 'monthlySingleRoute', 'monthlyInterRoute'];

const ticketProductSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            enum: TICKET_PRODUCT_CODES,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        validity: {
            type: String,
            default: '',
            trim: true,
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

ticketProductSchema.index({ active: 1, sortOrder: 1 });

module.exports = mongoose.model('TicketProduct', ticketProductSchema);
module.exports.TICKET_PRODUCT_CODES = TICKET_PRODUCT_CODES;
