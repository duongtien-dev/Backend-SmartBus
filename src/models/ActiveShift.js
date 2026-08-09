const mongoose = require('mongoose');

/**
 * Phiên ca đang chạy của staff (check-in → end).
 * Một staff chỉ có tối đa 1 ca active.
 * Trục A: gắn vị trí realtime + trạm hiện tại.
 */
const activeShiftSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StaffSchedule',
            default: null,
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            default: null,
            index: true,
        },
        routeName: {
            type: String,
            default: '',
            trim: true,
        },
        routeCode: {
            type: String,
            default: '',
            trim: true,
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            default: null,
        },
        plateNumber: {
            type: String,
            default: '',
            trim: true,
        },
        /** Index trong danh sách stop đã sort theo order (0-based) */
        currentStopOrder: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastLat: {
            type: Number,
            default: null,
        },
        lastLng: {
            type: Number,
            default: null,
        },
        lastLocationAt: {
            type: Date,
            default: null,
        },
        heading: {
            type: Number,
            default: null,
        },
        /** staff = điện thoại NV; vehicle = GPS cố định trên xe; stop = suy từ trạm */
        locationSource: {
            type: String,
            enum: ['staff', 'vehicle', 'stop'],
            default: null,
        },
        shiftStartAt: {
            type: Date,
            required: true,
        },
        shiftEndAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'ended'],
            default: 'active',
            index: true,
        },
    },
    { timestamps: true }
);

activeShiftSchema.index(
    { staffId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'active' },
    }
);

activeShiftSchema.index({ routeId: 1, status: 1 });

module.exports = mongoose.model('ActiveShift', activeShiftSchema);
