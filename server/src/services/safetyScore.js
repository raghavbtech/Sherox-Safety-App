const SafeRouteData = require('../models/SafeRouteData');
const config = require('../config');

function computeSafeScoreFromTraffic(level) {
  if (level === 'HIGH') return 9;
  if (level === 'MODERATE') return 6;
  if (level === 'LOW') return 2;
  return 'N/A';
}

async function getTrafficLevel(origin, destination) {
  if (!config.googleMapsApiKey) {
    // Fallback heuristic if no Google Maps API Key is provided
    return 'MODERATE';
  }

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.append('origin', `${origin.lat},${origin.lng}`);
  url.searchParams.append('destination', `${destination.lat},${destination.lng}`);
  url.searchParams.append('departure_time', 'now');
  url.searchParams.append('traffic_model', 'best_guess');
  url.searchParams.append('key', config.googleMapsApiKey);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (
      data.routes &&
      data.routes[0] &&
      data.routes[0].legs &&
      data.routes[0].legs[0] &&
      data.routes[0].legs[0].duration_in_traffic
    ) {
      const durationInTraffic = data.routes[0].legs[0].duration_in_traffic.value;
      const normalDuration = data.routes[0].legs[0].duration.value;
      const ratio = durationInTraffic / normalDuration;

      if (ratio > 1.4) {
        return 'MODERATE';
      } else if (ratio > 1.1) {
        return 'LOW';
      } else {
        return 'HIGH';
      }
    }
    return 'MODERATE';
  } catch (error) {
    console.error('Traffic API error:', error);
    return 'UNKNOWN';
  }
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
        // Crime lowers score, lighting improves score
        baseScore = Math.max(1, Math.min(10, Math.round(baseScore - avgCrime + avgLighting)));
      }
    }
  } catch (err) {
    // Geospatial query error fallback to baseScore
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
