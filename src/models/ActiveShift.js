const mongoose = require('mongoose');

/**
 * Phiên ca đang chạy của staff (check-in → end).
 * Một staff chỉ có tối đa 1 ca active.
 */
const activeShiftSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StaffSchedule',
            default: null
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            default: null
        },
        routeName: {
            type: String,
            default: '',
            trim: true
        },
        routeCode: {
            type: String,
            default: '',
            trim: true
        },
        shiftStartAt: {
            type: Date,
            required: true
        },
        shiftEndAt: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            enum: ['active', 'ended'],
            default: 'active',
            index: true
        }
    },
    { timestamps: true }
);

activeShiftSchema.index(
    { staffId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' }
    }
);

module.exports = mongoose.model('ActiveShift', activeShiftSchema);
