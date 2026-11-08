const { test } = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const Stop = require('../src/models/Stop');
const { searchPlaces } = require('../src/services/suggestLocation');
const { suggestLocations } = require('../src/controllers/suggestLocationController');

test('location suggestions regressions', async (t) => {
    const originalGet = axios.get;
    const originalFind = Stop.find;
    const originalReadyState = Stop.db.readyState;
    t.after(() => {
        axios.get = originalGet;
        Stop.find = originalFind;
        Stop.db.readyState = originalReadyState;
    });
    Stop.db.readyState = 0;

    await t.test('upstream failure still returns accent-insensitive stop matches', async () => {
        axios.get = async () => { throw Object.assign(new Error('Forbidden'), { code: 'ERR_BAD_REQUEST' }); };
        const data = await searchPlaces('san bay');
        assert.ok(data.length > 0 && data.length <= 8);
        assert.ok(data.some((item) => item.display_name.includes('sân bay')));
        assert.ok(data.every((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng)));
        assert.equal(new Set(data.map((item) => JSON.stringify(item))).size, data.length);
    });

    await t.test('live stops are used when MongoDB is connected', async () => {
        Stop.db.readyState = 1;
        Stop.find = () => ({ select: () => ({ maxTimeMS: () => ({ lean: async () => [
            { name: 'Trạm mới', location: { coordinates: [108.2, 16.05] } },
        ] }) }) });
        const data = await searchPlaces('tram moi');
        assert.deepEqual(data, [{ display_name: 'Trạm mới', lat: 16.05, lng: 108.2 }]);
        Stop.db.readyState = 0;
    });

    await t.test('Photon coordinates, filtering, cache and query are correct', async () => {
        let calls = 0;
        axios.get = async (url, config) => {
            calls++;
            assert.ok(url.endsWith('/api/'));
            assert.equal(config.params.q, 'unique-place');
            assert.equal(config.params.countrycode, 'VN');
            return { data: { features: [
                { properties: { name: 'A', city: 'Đà Nẵng' }, geometry: { coordinates: [108.2, 16.05] } },
                { properties: { name: 'A', city: 'Đà Nẵng' }, geometry: { coordinates: [108.2, 16.05] } },
                { properties: { name: 'Bad' }, geometry: { coordinates: [null, null] } },
            ] } };
        };
        const expected = [{ display_name: 'A, Đà Nẵng', lat: 16.05, lng: 108.2 }];
        assert.deepEqual(await searchPlaces('unique-place'), expected);
        assert.deepEqual(await searchPlaces('unique-place'), expected);
        assert.equal(calls, 1);
    });

    await t.test('malformed provider response produces a controlled 503', async () => {
        axios.get = async () => ({ data: '<html>Error</html>' });
        await assert.rejects(searchPlaces('no-local-match'), { status: 503 });
    });

    function response() {
        return { statusCode: 200, status(code) { this.statusCode = code; return this; },
            json(body) { this.body = body; return this; } };
    }

    await t.test('missing body and invalid keywords return 400 instead of 500', async () => {
        for (const keyword of [undefined, {}, ['san bay'], '   ', 'x'.repeat(201)]) {
            const res = response();
            await suggestLocations({ query: { keyword } }, res);
            assert.equal(res.statusCode, 400);
        }
    });

    await t.test('query keyword works without a JSON body', async () => {
        const res = response();
        await suggestLocations({ query: { keyword: 'san bay' } }, res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.success, true);
        assert.ok(res.body.data.length);
    });

    await t.test('provider outage without local matches returns 503 to mobile', async () => {
        axios.get = async () => { throw new Error('Timeout'); };
        const res = response();
        await suggestLocations({ body: { keyword: 'nonexistent-address' } }, res);
        assert.equal(res.statusCode, 503);
        assert.equal(res.body.success, false);
    });
});
