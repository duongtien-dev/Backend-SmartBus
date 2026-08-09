const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        plateNumber: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            default: 40,
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
            default: null,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
