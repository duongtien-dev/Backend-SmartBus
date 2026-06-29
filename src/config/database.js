const mongoose = require('mongoose');
const PendingRegistration = require('../models/PendingRegistration');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-bus');
        console.log('MongoDB connected');
        await PendingRegistration.collection.dropIndex('expiresAt_1').catch(() => { });
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
