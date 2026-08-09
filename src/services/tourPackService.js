/**
 * Tour packs tĩnh — Trục A5 (có thể chuyển CMS/admin sau).
 */
const TOUR_PACKS = [
    {
        id: 'danang-beach',
        locales: ['vi', 'en', 'ja'],
        title: {
            vi: 'Biển & trung tâm Đà Nẵng',
            en: 'Da Nang beach & downtown',
            ja: 'ダナンのビーチと市街',
        },
        description: {
            vi: 'Gợi ý tuyến gần Mỹ Khê, cầu Rồng, chợ Cồn — phù hợp khách lưu trú ngắn ngày.',
            en: 'Suggested routes near My Khe beach, Dragon Bridge, and Con Market.',
            ja: 'ミーケビーチ、ドラゴンブリッジ、コン市場周辺のおすすめ路線。',
        },
        howToBuy: {
            vi: 'Mở app → tìm điểm đi/đến → chọn vé lượt → thanh toán → dùng QR khi lên xe.',
            en: 'Open the app → search A→B → buy a single ticket → show QR when boarding.',
            ja: 'アプリで出発地・目的地を検索→1回乗車券を購入→乗車時にQRを提示。',
        },
        pois: [
            {
                name: { vi: 'Biển Mỹ Khê', en: 'My Khe Beach', ja: 'ミーケビーチ' },
                lat: 16.0706,
                lng: 108.2451,
            },
            {
                name: { vi: 'Cầu Rồng', en: 'Dragon Bridge', ja: 'ドラゴンブリッジ' },
                lat: 16.0614,
                lng: 108.2275,
            },
        ],
        suggestedRouteCodes: [],
        faqKeys: ['faq.1', 'faq.2'],
    },
    {
        id: 'airport-transfer',
        locales: ['vi', 'en', 'ja'],
        title: {
            vi: 'Sân bay ↔ trung tâm',
            en: 'Airport ↔ downtown',
            ja: '空港↔市街',
        },
        description: {
            vi: 'Gợi ý di chuyển bằng xe buýt từ khu vực sân bay Đà Nẵng vào trung tâm.',
            en: 'Bus tips from Da Nang Airport area into the city center.',
            ja: 'ダナン空港周辺から市街へのバス移動のヒント。',
        },
        howToBuy: {
            vi: 'Dùng tìm chuyến với điểm đến trung tâm; mua vé lượt trước khi lên xe.',
            en: 'Use trip search with a downtown destination; buy a single ticket before boarding.',
            ja: '市街を目的地にして経路検索し、乗車前に1回券を購入してください。',
        },
        pois: [
            {
                name: {
                    vi: 'Sân bay Đà Nẵng',
                    en: 'Da Nang Airport',
                    ja: 'ダナン空港',
                },
                lat: 16.0439,
                lng: 108.199,
            },
        ],
        suggestedRouteCodes: [],
        faqKeys: ['faq.3'],
    },
];

function listTourPacks(locale = 'vi') {
    const lang = ['vi', 'en', 'ja'].includes(locale) ? locale : 'vi';
    return TOUR_PACKS.filter((pack) => pack.locales.includes(lang)).map((pack) => ({
        id: pack.id,
        title: pack.title[lang] || pack.title.vi,
        description: pack.description[lang] || pack.description.vi,
        howToBuy: pack.howToBuy[lang] || pack.howToBuy.vi,
        pois: pack.pois.map((poi) => ({
            name: poi.name[lang] || poi.name.vi,
            lat: poi.lat,
            lng: poi.lng,
        })),
        suggestedRouteCodes: pack.suggestedRouteCodes,
        faqKeys: pack.faqKeys,
    }));
}

function getTourPackById(id, locale = 'vi') {
    const packs = listTourPacks(locale);
    return packs.find((p) => p.id === id) || null;
}

module.exports = {
    TOUR_PACKS,
    listTourPacks,
    getTourPackById,
};
