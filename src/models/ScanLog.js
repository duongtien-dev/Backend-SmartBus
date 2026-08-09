const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            default: null,
        },
        qrCode: {
            type: String,
            required: true,
            trim: true,
        },
        isValid: {
            type: Boolean,
            required: true,
        },
        reason: {
            type: String,
            default: '',
        },
        scannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        shiftId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ActiveShift',
            default: null,
            index: true,
        },
        stopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stop',
            default: null,
        },
        lat: {
            type: Number,
            default: null,
        },
        lng: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

scanLogSchema.index({ qrCode: 1 });
scanLogSchema.index({ ticket: 1 });
scanLogSchema.index({ scannedBy: 1 });
scanLogSchema.index({ createdAt: -1 });
scanLogSchema.index({ shiftId: 1, isValid: 1, createdAt: -1 });

module.exports = mongoose.model('ScanLog', scanLogSchema);
