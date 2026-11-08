const { test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const { seedUsers } = require('../src/seeds/seedUsers');

// Keep the real Mongoose validation and password save hook; replace only DB I/O.
test('seeded accounts can authenticate and existing accounts can be repaired', async (t) => {
    const records = new Map();
    let writes = 0;
    t.mock.method(User, 'findOne', ({ email }) => ({
        select: async () => records.has(email) ? User.hydrate(records.get(email)) : null,
    }));
    t.mock.method(User.collection, 'insertOne', async (doc) => {
        writes++;
        records.set(doc.email, { ...doc });
        return { acknowledged: true, insertedId: doc._id };
    });
    t.mock.method(User.collection, 'updateOne', async (filter, update) => {
        writes++;
        const doc = [...records.values()].find((row) => row._id.equals(filter._id));
        Object.assign(doc, update.$set);
        return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
    });
    const fixture = { email: 'user.an@gmail.com', password: 'User@123', role: 'user', full_name: 'Test account' };

    await t.test('new seed hashes once and supports all three role passwords', async () => {
        for (const [role, password] of [['user', 'User@123'], ['staff', 'Staff@123'], ['admin', 'Admin@123']]) {
            const email = `${role}@test.invalid`;
            await seedUsers(User, [{ ...fixture, email, role, password }]);
            assert.ok(await bcrypt.compare(password, records.get(email).password));
            assert.notEqual(records.get(email).password, password);
        }
    });

    await t.test('normal reseed preserves an existing password', async () => {
        await seedUsers(User, [fixture]);
        const doc = records.get(fixture.email);
        doc.password = await bcrypt.hash('Changed@123', 10);
        const previousHash = doc.password;
        await seedUsers(User, [fixture]);
        assert.equal(records.get(fixture.email).password, previousHash);
    });

    await t.test('repair fixes double hashing without changing IDs or profile data', async () => {
        const doc = records.get(fixture.email);
        doc.password = await bcrypt.hash(await bcrypt.hash(fixture.password, 10), 10);
        doc.full_name = 'Preserved name';
        const id = doc._id.toString();
        assert.equal(await bcrypt.compare(fixture.password, doc.password), false);
        await seedUsers(User, [fixture], { repairPasswords: true });
        assert.ok(await bcrypt.compare(fixture.password, records.get(fixture.email).password));
        assert.equal(records.get(fixture.email)._id.toString(), id);
        assert.equal(records.get(fixture.email).full_name, 'Preserved name');
    });

    await t.test('repair is idempotent and does not create missing accounts', async () => {
        const beforeWrites = writes;
        await seedUsers(User, [fixture, { ...fixture, email: 'missing@test.invalid' }], { repairPasswords: true });
        assert.equal(writes, beforeWrites);
        assert.equal(records.has('missing@test.invalid'), false);
    });
});
