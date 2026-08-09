#!/usr/bin/env node
/**
 * Seed các loại vé (TicketProduct).
 *
 * Usage:
 *   node src/seeds/runSeedTicketProducts.js
 *   node src/seeds/runSeedTicketProducts.js --force   # ghi đè title/price/active theo DEFAULT_PRODUCTS
 */
require('dotenv').config();

const mongoose = require('mongoose');
const { seedTicketProducts, DEFAULT_PRODUCTS } = require('./seedTicketProducts');

function parseArgs(argv) {
    return {
        force: argv.includes('--force'),
    };
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/backend-bus';

    await mongoose.connect(uri);
    console.log('MongoDB connected');
    console.log(
        'Default products:',
        DEFAULT_PRODUCTS.map((p) => `${p.code}=${p.unitPrice}`).join(', ')
    );

    const result = await seedTicketProducts(opts);
    console.log('Seed ticket products OK:');
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
