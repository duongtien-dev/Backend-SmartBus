const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        reason: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        status: {
            type: String,
            enum: ['submitted', 'approved', 'rejected'],
            default: 'submitted',
            index: true
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        reviewNote: {
            type: String,
            default: '',
            trim: true
        },
        reviewedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

leaveRequestSchema.index({ staffId: 1, createdAt: -1 });
leaveRequestSchema.index({ staffId: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
