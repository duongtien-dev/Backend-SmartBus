const mongoose = require('mongoose');

/**
 * Lịch ca được giao cho staff (theo ngày).
 * Admin tạo lịch; staff xem `/my` và check-in theo lịch hôm nay.
 */
const staffScheduleSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        workDate: {
            type: Date,
            required: true,
            index: true
        },
        period: {
            type: String,
            enum: ['morning', 'afternoon', 'evening'],
            default: 'afternoon'
        },
        startTime: {
            type: String,
            default: '12:30',
            trim: true
        },
        endTime: {
            type: String,
            default: '19:30',
            trim: true
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
        plateNumber: {
            type: String,
            default: '',
            trim: true
        },
        status: {
            type: String,
            enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
            default: 'scheduled',
            index: true
        }
    },
    { timestamps: true }
);

staffScheduleSchema.index({ staffId: 1, workDate: 1 });
staffScheduleSchema.index({ staffId: 1, workDate: 1, period: 1 });

module.exports = mongoose.model('StaffSchedule', staffScheduleSchema);
