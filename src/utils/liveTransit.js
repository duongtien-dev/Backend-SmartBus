/**
 * Haversine distance in meters.
 */
function distanceMeters(lat1, lng1, lat2, lng2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

/** Avg urban bus speed ~18 km/h → m/s */
const AVG_BUS_SPEED_MPS = 5;

/**
 * ETA minutes from current lat/lng to stop Point coordinates [lng, lat].
 */
function etaMinutesFromLocation(lat, lng, stop) {
    if (
        lat == null ||
        lng == null ||
        !stop?.location?.coordinates ||
        stop.location.coordinates.length < 2
    ) {
        return null;
    }
    const [stopLng, stopLat] = stop.location.coordinates;
    const meters = distanceMeters(lat, lng, stopLat, stopLng);
    const minutes = Math.max(1, Math.round(meters / AVG_BUS_SPEED_MPS / 60));
    return minutes;
}

/**
 * Fallback ETA by stop index gap (approx 3 min/stop).
 */
function etaMinutesByStopGap(currentIndex, targetIndex) {
    if (currentIndex == null || targetIndex == null) return null;
    const gap = targetIndex - currentIndex;
    if (gap < 0) return null;
    if (gap === 0) return 1;
    return gap * 3;
}

function crowdingLevel(loadRatio) {
    if (loadRatio == null || Number.isNaN(loadRatio)) return 'unknown';
    if (loadRatio < 0.4) return 'low';
    if (loadRatio < 0.7) return 'medium';
    if (loadRatio < 0.9) return 'high';
    return 'full';
}

module.exports = {
    distanceMeters,
    etaMinutesFromLocation,
    etaMinutesByStopGap,
    crowdingLevel,
    AVG_BUS_SPEED_MPS,
};
