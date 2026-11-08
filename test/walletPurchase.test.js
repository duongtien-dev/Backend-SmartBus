const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Ticket = require('../src/models/Ticket');
const PaymentMethod = require('../src/models/paymentMethod');
const { resolvePurchaseKey, createWalletPurchase, purchaseHash } = require('../src/services/walletPurchase');
const paymentService = require('../src/services/paymentMethodService');

test('atomic internal wallet purchases', async (t) => {
    let balance = 80000;
    let tickets = [];
    let failInsert = false;
    let queue = Promise.resolve();
    const session = {};
    t.mock.method(Ticket, 'init', async () => {});
    t.mock.method(Ticket, 'findOne', (filter) => ({
        select: () => ({ session: async () => tickets.find((item) =>
            item.user === filter.user && item.purchaseKey === filter.purchaseKey) || null }),
    }));
    t.mock.method(PaymentMethod, 'findOneAndUpdate', async (filter, update, options) => {
        assert.equal(options.session, session);
        if (filter.user !== 'owner' || filter._id !== 'momo' || balance < filter.balance.$gte) return null;
        balance += update.$inc.balance;
        return { balance };
    });
    t.mock.method(Ticket, 'create', async ([data], options) => {
        assert.equal(options.session, session);
        if (failInsert) throw new Error('Insert failed');
        const ticket = { ...data, _id: `ticket-${tickets.length}` };
        tickets.push(ticket);
        return [ticket];
    });
    // Replace DB I/O with a serialized, rollback-capable transaction boundary.
    // Actual MongoDB transaction behavior must also be verified on Atlas/replica set.
    t.mock.method(mongoose.connection, 'transaction', (callback) => {
        const task = queue.then(async () => {
            const beforeBalance = balance;
            const beforeTickets = [...tickets];
            try { return await callback(session); }
            catch (error) { balance = beforeBalance; tickets = beforeTickets; throw error; }
        });
        queue = task.catch(() => {});
        return task;
    });
    const data = (key, price = 8000) => ({ paymentMethodId: 'momo', purchaseKey: key, price });

    await t.test('80,000 minus 8,000 leaves 72,000 and a paid ticket', async () => {
        const ticket = await createWalletPurchase('owner', data('purchase-one'), 'hash-one');
        assert.equal(balance, 72000);
        assert.equal(ticket.balanceAfter, 72000);
        assert.equal(ticket.status, 'paid');
    });
    await t.test('retries return the same ticket without charging again', async () => {
        const first = tickets[0];
        const retry = await createWalletPurchase('owner', data('purchase-one'), 'hash-one');
        assert.equal(retry._id, first._id);
        assert.equal(balance, 72000);
        assert.equal(tickets.length, 1);
        await assert.rejects(createWalletPurchase('owner', data('purchase-one'), 'changed-hash'));
        assert.equal(balance, 72000);
    });
    await t.test('insufficient balance or wrong owner cannot create a ticket', async () => {
        await assert.rejects(createWalletPurchase('owner', data('too-expensive', 80000), 'hash'));
        await assert.rejects(createWalletPurchase('other-user', data('wrong-owner'), 'hash'));
        assert.equal(balance, 72000);
        assert.equal(tickets.length, 1);
    });
    await t.test('failed insert rolls back the debit', async () => {
        failInsert = true;
        await assert.rejects(createWalletPurchase('owner', data('failed-insert'), 'hash'), /Insert failed/);
        failInsert = false;
        assert.equal(balance, 72000);
        assert.equal(tickets.length, 1);
    });
    await t.test('two simultaneous 8,000 purchases cannot overdraw 8,000', async () => {
        balance = 8000;
        const results = await Promise.allSettled([
            createWalletPurchase('owner', data('concurrent-one'), 'one'),
            createWalletPurchase('owner', data('concurrent-two'), 'two'),
        ]);
        assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
        assert.equal(balance, 0);
    });
    await t.test('simultaneous retries charge once', async () => {
        balance = 80000;
        const [a, b] = await Promise.all([
            createWalletPurchase('owner', data('same-checkout'), 'same'),
            createWalletPurchase('owner', data('same-checkout'), 'same'),
        ]);
        assert.equal(a._id, b._id);
        assert.equal(balance, 72000);
    });
    await t.test('invalid prices cannot alter a balance', async () => {
        for (const price of [-1, NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
            await assert.rejects(createWalletPurchase('owner', data('invalid', price), 'hash'));
        }
        assert.equal(balance, 72000);
    });
    await t.test('hash ignores client prices and balances but detects changed purchase', () => {
        const request = { ...data('hash-key'), routeId: 'route', seatQuantity: 1 };
        assert.equal(purchaseHash(request), purchaseHash({ ...request, price: 1, balance: 999999 }));
        assert.notEqual(purchaseHash(request), purchaseHash({ ...request, paymentMethodId: 'other' }));
    });
    await t.test('ticket API uses server fare and retries do not requote or recharge', async () => {
        const Route = require('../src/models/Route');
        const User = require('../src/models/User');
        const products = require('../src/services/ticketProductService');
        const qr = require('qrcode');
        const service = require('../src/services/ticketService');
        t.mock.method(Route, 'findById', () => ({ select: async () => ({ name: 'Tuyến 03' }) }));
        t.mock.method(User, 'findById', () => ({ select: async () => ({ full_name: 'Test', phone: '0900000000' }) }));
        t.mock.method(PaymentMethod, 'findOne', () => ({ select: async () => ({ _id: 'momo' }) }));
        const productMock = t.mock.method(products, 'getActiveProductByCode', async () => ({ code: 'single', unitPrice: 8000 }));
        t.mock.method(qr, 'toDataURL', async () => 'data:image/png;base64,test');
        balance = 80000;
        const request = {
            purchaseKey: 'server-fare-checkout', routeId: 'route', paymentMethodId: 'momo',
            startStopName: 'A', endStopName: 'B', ticketType: 'single',
            departureDate: '2030-01-01', seatQuantity: 1,
            price: 1, balance: 999999,
        };
        const ticket = await service.createTicket('owner', request);
        assert.equal(ticket.price, 8000);
        assert.equal(ticket.balanceAfter, 72000);
        assert.equal(balance, 72000);
        assert.equal((await service.createTicket('owner', request))._id, ticket._id);
        assert.equal(productMock.mock.callCount(), 1);
        assert.equal(balance, 72000);
        const legacyRequest = { ...request };
        delete legacyRequest.purchaseKey;
        const legacyTicket = await service.createTicket('owner', legacyRequest);
        assert.match(legacyTicket.purchaseKey, /^[a-zA-Z0-9_-]{16,128}$/);
        assert.equal(legacyTicket.price, 8000);
        assert.equal(balance, 64000);
    });
});

test('legacy purchase key compatibility does not accept malformed explicit keys', async () => {
    const a = resolvePurchaseKey();
    assert.match(a, /^[a-zA-Z0-9_-]{16,128}$/);
    assert.notEqual(a, resolvePurchaseKey());
    const key = 'purchase-stable-retry-key';
    assert.equal(resolvePurchaseKey(key), key);
    for (const value of [null, '', 'short', {}, [], 123, 'x'.repeat(129)]) {
        assert.throws(() => resolvePurchaseKey(value));
    }
    const { createTicketRules } = require('../src/validations/ticketValidation');
    const { validationResult } = require('express-validator');
    const missing = { body: {} };
    await createTicketRules[0].run(missing);
    assert.equal(validationResult(missing).isEmpty(), true);
    const invalid = { body: { purchaseKey: 'short' } };
    await createTicketRules[0].run(invalid);
    assert.equal(validationResult(invalid).isEmpty(), false);
});

test('ordinary payment API cannot credit a wallet', async (t) => {
    t.mock.method(PaymentMethod, 'create', async (data) => data);
    const created = await paymentService.createPaymentMethod('owner', { provider: 'momo', balance: 1000000 });
    assert.equal(created.balance, 0);
    const method = { balance: 72000, save: async () => {} };
    t.mock.method(PaymentMethod, 'findOne', async () => method);
    const updated = await paymentService.updatePaymentMethod('momo', 'owner', { balance: 1000000, phoneNumber: '0900000000' });
    assert.equal(updated.balance, 72000);
    assert.equal(updated.phoneNumber, '0900000000');
});
