const axios = require('axios');
const Stop = require('../models/Stop');
const bundledStops = require('../../json/stops.json');

const LIMIT = 8;
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd').toLowerCase().trim();
}

function uniqueLocations(items) {
    const seen = new Set();
    return items.filter((item) => {
        if (!item.display_name || !Number.isFinite(item.lat) || !Number.isFinite(item.lng)
            || Math.abs(item.lat) > 90 || Math.abs(item.lng) > 180) return false;
        const key = `${normalize(item.display_name)}:${item.lat}:${item.lng}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, LIMIT);
}

async function searchStops(keyword) {
    let stops = bundledStops;
    // Do not buffer a Mongo query when the database is disconnected.
    if (Stop.db.readyState === 1) {
        try {
            stops = await Stop.find({}).select('name stopCode location').maxTimeMS(1500).lean();
        } catch {
            // The bundled route data also works while MongoDB is unavailable.
        }
    }
    const words = normalize(keyword).split(/\s+/);
    return uniqueLocations(stops.filter((stop) => {
        const name = normalize(`${stop.name} ${stop.stopCode || ''}`);
        return words.every((word) => name.includes(word));
    }).map((stop) => ({
        display_name: stop.name,
        lat: stop.location?.coordinates?.[1],
        lng: stop.location?.coordinates?.[0],
    })));
}

async function searchPlaces(keyword) {
    const query = keyword.trim();
    if (!query) return [];
    const local = await searchStops(query);
    if (local.length === LIMIT) return local;

    const key = normalize(query);
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
        return uniqueLocations([...local, ...cached.data]);
    }

    try {
        // Photon supports search-as-you-type; public Nominatim does not.
        const response = await axios.get(
            process.env.PHOTON_API_URL || 'https://photon.komoot.io/api/',
            {
                params: { q: query, lat: 16.0544, lon: 108.2022, countrycode: 'VN', limit: LIMIT },
                headers: { 'User-Agent': 'SmartBus/1.0', Accept: 'application/json' },
                timeout: 4000,
            }
        );
        if (!Array.isArray(response.data?.features)) {
            throw new Error('Invalid geocoder response');
        }
        const places = uniqueLocations(response.data.features.map((feature) => {
            const p = feature.properties || {};
            return {
                display_name: [...new Set([
                    p.name, [p.housenumber, p.street].filter(Boolean).join(' '),
                    p.district, p.city, p.state, p.country,
                ].filter(Boolean))].join(', '),
                lat: feature.geometry?.coordinates?.[1],
                lng: feature.geometry?.coordinates?.[0],
            };
        }));
        if (cache.size >= 100) cache.delete(cache.keys().next().value);
        cache.set(key, { data: places, expiresAt: Date.now() + CACHE_TTL_MS });
        return uniqueLocations([...local, ...places]);
    } catch (cause) {
        console.warn('[suggest-locations] Geocoder unavailable:', cause.code || cause.message);
        if (local.length) return local;
        const error = new Error('Dịch vụ tìm địa điểm tạm thời không khả dụng. Vui lòng thử lại.');
        error.status = 503;
        throw error;
    }
}

module.exports = { searchPlaces };
