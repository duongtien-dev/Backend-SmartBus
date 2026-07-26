#!/usr/bin/env node
/**
 * Seed gán tuyến (Route.staffId) cho staff — mô phỏng admin assign.
 *
 * Usage:
 *   node src/seeds/runSeedStaffRouteAssignments.js
 *   node src/seeds/runSeedStaffRouteAssignments.js --email=qini@gmail.com
 *   node src/seeds/runSeedStaffRouteAssignments.js --limit=3 --clear
 */
require('dotenv').config();

const mongoose = require('mongoose');
const { seedStaffRouteAssignments } = require('./seedStaffRouteAssignments');

function parseArgs(argv) {
    const opts = { staffEmail: null, limit: 3, clearOthers: false };
    for (const arg of argv) {
        if (arg === '--clear') opts.clearOthers = true;
        if (arg.startsWith('--email=')) {
            opts.staffEmail = arg.slice('--email='.length).trim() || null;
        }
        if (arg.startsWith('--limit=')) {
            const n = Number(arg.slice('--limit='.length));
            if (!Number.isNaN(n) && n > 0) opts.limit = n;
        }
    }
    return opts;
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-bus';

    await mongoose.connect(uri);
    console.log('MongoDB connected');

    const result = await seedStaffRouteAssignments(opts);
    console.log('Seed staff route assignments OK:');
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
