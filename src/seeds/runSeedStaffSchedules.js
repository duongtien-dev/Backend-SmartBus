#!/usr/bin/env node
/**
 * Seed lịch ca tuần hiện tại cho staff.
 *
 * Usage:
 *   node src/seeds/runSeedStaffSchedules.js
 *   node src/seeds/runSeedStaffSchedules.js --email=qini@gmail.com
 *   node src/seeds/runSeedStaffSchedules.js --clear
 */
require('dotenv').config();

const mongoose = require('mongoose');
const { seedStaffSchedules } = require('./seedStaffSchedules');

function parseArgs(argv) {
    const opts = { staffEmail: null, clearWeek: false };
    for (const arg of argv) {
        if (arg === '--clear') opts.clearWeek = true;
        if (arg.startsWith('--email=')) {
            opts.staffEmail = arg.slice('--email='.length).trim() || null;
        }
    }
    return opts;
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-bus';

    await mongoose.connect(uri);
    console.log('MongoDB connected');

    const result = await seedStaffSchedules(opts);
    console.log('Seed staff schedules OK:');
    console.log(JSON.stringify(result, null, 2));

    await mongoose.disconnect();
}

main().catch(async (err) => {
    console.error('Seed failed:', err.message);
    try {
        await mongoose.disconnect();
    } catch {
        // ignore
    }
    process.exit(1);
});
