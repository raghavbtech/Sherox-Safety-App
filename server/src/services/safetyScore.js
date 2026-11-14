const SafeRouteData = require('../models/SafeRouteData');
const config = require('../config');

function computeSafeScoreFromTraffic(level) {
  if (level === 'HIGH') return 9;
  if (level === 'MODERATE') return 6;
  if (level === 'LOW') return 2;
  return 'N/A';
}

async function getTrafficLevel(origin, destination) {
  try {
    const originLat = Number(origin.lat);
    const originLng = Number(origin.lng);
    const destLat = Number(destination.lat);
    const destLng = Number(destination.lng);

    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
      return 'MODERATE';
    }

    // Free OpenStreetMap / OSRM public routing API (no API key required)
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;
    const res = await fetch(osrmUrl, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const { duration, distance } = data.routes[0]; // duration in seconds, distance in meters
        if (duration > 0 && distance > 0) {
          const speedKmH = (distance / 1000) / (duration / 3600);
          if (speedKmH < 25) return 'MODERATE';
          if (speedKmH < 50) return 'LOW';
          return 'HIGH';
        }
      }
    }
  } catch (err) {
    // Graceful fallback for offline, network timeout, or test environment
  }

  return 'MODERATE';
}

async function computeRouteSafety(origin, destination) {
  const trafficLevel = await getTrafficLevel(origin, destination);
  let baseScore = computeSafeScoreFromTraffic(trafficLevel);

  // If origin has valid coordinates, check for nearby SafeRouteData using $near geospatial query
  try {
    const originLng = Number(origin.lng);
    const originLat = Number(origin.lat);

    if (!isNaN(originLng) && !isNaN(originLat)) {
      const nearbyPoints = await SafeRouteData.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [originLng, originLat],
            },
            $maxDistance: 5000, // 5km
          },
        },
      }).limit(5);

      if (nearbyPoints && nearbyPoints.length > 0 && typeof baseScore === 'number') {
        const avgCrime = nearbyPoints.reduce((sum, p) => sum + (p.crimeScore || 0), 0) / nearbyPoints.length;
        const avgLighting = nearbyPoints.reduce((sum, p) => sum + (p.lightingScore || 0), 0) / nearbyPoints.length;
        baseScore = Math.max(1, Math.min(10, Math.round(baseScore - avgCrime + avgLighting)));
      }
    }
  } catch (err) {
    console.warn('Geospatial safety query skipped:', err.message);
  }

  return {
    safety_score: baseScore,
    traffic_level: trafficLevel,
  };
}

module.exports = {
  computeSafeScoreFromTraffic,
  getTrafficLevel,
  computeRouteSafety,
};
