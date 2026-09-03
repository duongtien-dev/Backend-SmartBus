const mongoose = require('mongoose');

const routeReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            required: true,
        },
        type: {
            type: String,
            enum: ['issue', 'suggestion', 'complaint', 'other'],
            default: 'issue',
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            default: 'N/A',
        },
        status: {
            type: String,
            enum: ['new', 'in_progress', 'resolved', 'rejected'],
            default: 'new',
        },
        reviewNote: {
            type: String,
            default: '',
            trim: true,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

routeReportSchema.index({ userId: 1 });
routeReportSchema.index({ routeId: 1 });
routeReportSchema.index({ status: 1 });
routeReportSchema.index({ type: 1 });

module.exports = mongoose.model('RouteReport', routeReportSchema);
