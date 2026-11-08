const { test } = require('node:test');
const assert = require('node:assert/strict');
const PaymentMethod = require('../src/models/paymentMethod');
const Ticket = require('../src/models/Ticket');
const { initializeWalletBalances } = require('../src/seeds/initializeWalletBalances');

test('opening test credit is applied once and never refills spent wallets', async (t) => {
    const rows = [
        { _id: 'missing', user: 'test-user' },
        { _id: 'zero-unfunded', user: 'test-user', balance: 0 },
        { _id: 'null-unfunded', user: 'test-user', balance: null },
        { _id: 'positive', user: 'test-user', balance: 72000 },
        { _id: 'spent', user: 'test-user', balance: 0 },
        { _id: 'initialized-zero', user: 'test-user', balance: 0, balanceInitializedAt: new Date() },
        { _id: 'other-user', user: 'real-user', balance: 0 },
    ];
    const matches = (row, filter) => filter.user.$in.includes(row.user)
        && row.balanceInitializedAt == null
        && (row.balance == null || row.balance === 0)
        && (!filter._id || filter._id === row._id);
    t.mock.method(PaymentMethod, 'find', (filter) => {
        assert.equal(filter.balanceInitializedAt, null);
        assert.ok(filter.$or.some((entry) => entry.balance?.$exists === false));
        assert.ok(filter.$or.some((entry) => entry.balance === 0));
        return { select: () => ({ lean: async () => rows.filter((row) => matches(row, filter)) }) };
    });
    t.mock.method(Ticket, 'exists', async (filter) => {
        assert.deepEqual(filter.balanceAfter, { $exists: true });
        return filter.paymentMethodId === 'spent' ? { _id: 'paid-ticket' } : null;
    });
    t.mock.method(PaymentMethod, 'updateOne', async (filter, update) => {
        const row = rows.find((row) => matches(row, filter));
        if (!row) return { modifiedCount: 0 };
        Object.assign(row, update.$set);
        return { modifiedCount: 1 };
    });
    assert.equal(await initializeWalletBalances(['test-user']), 3);
    for (const id of ['missing', 'zero-unfunded', 'null-unfunded']) {
        const row = rows.find((row) => row._id === id);
        assert.equal(row.balance, 80000);
        assert.ok(row.balanceInitializedAt instanceof Date);
    }
    assert.equal(rows.find((row) => row._id === 'positive').balance, 72000);
    assert.equal(rows.find((row) => row._id === 'spent').balance, 0);
    assert.equal(rows.find((row) => row._id === 'other-user').balance, 0);
    // Spending all opening credit does not make an account eligible again.
    rows[0].balance = 0;
    assert.equal(await initializeWalletBalances(['test-user']), 0);
    assert.equal(rows[0].balance, 0);
});

test('payment balance is a numeric, nonnegative integer field', async () => {
    assert.equal(PaymentMethod.schema.path('balance').instance, 'Number');
    for (const balance of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
        const method = new PaymentMethod({ user: '507f1f77bcf86cd799439011', provider: 'momo', balance });
        await assert.rejects(method.validate());
    }
    const valid = new PaymentMethod({ user: '507f1f77bcf86cd799439011', provider: 'momo', balance: 80000 });
    await valid.validate();
});
