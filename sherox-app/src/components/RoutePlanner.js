import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import API_BASE_URL from "../apiConfig";
import { getAuthHeaders, handleAuthResponse } from "../utils/api";

// Fix Leaflet's default icon path issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const defaultCenter = [28.6139, 77.209]; // New Delhi

const RoutePlanner = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [safeScore, setSafeScore] = useState(null);
  const [trafficLevel, setTrafficLevel] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerGroupRef = useRef(null);

  // Initialize Leaflet map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(defaultCenter, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      routeLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const geocodeAddress = async (query) => {
    // Check if query is already "lat, lng" coordinates
    const coordParts = query.split(",").map((p) => parseFloat(p.trim()));
    if (coordParts.length === 2 && !isNaN(coordParts[0]) && !isNaN(coordParts[1])) {
      return { lat: coordParts[0], lng: coordParts[1], displayName: query };
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });
    const data = await res.json();
    if (!data || data.length === 0) {
      throw new Error(`Location not found: "${query}"`);
    }
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  };

  const getSafetyColor = (score) => {
    if (score === "N/A" || score == null) return "#6b7280";
    if (score > 7) return "#10b981";
    if (score > 4) return "#f59e0b";
    return "#ef4444";
  };

  const getSafetyLabel = (score) => {
    if (score === "N/A" || score == null) return "Unknown";
    if (score > 7) return "Very Safe";
    if (score > 4) return "Moderately Safe";
    return "Use Caution";
  };

  const getSafetyIcon = (score) => {
    if (score === "N/A" || score == null) return <Shield className="h-5 w-5" />;
    if (score > 7) return <CheckCircle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setSafeScore(null);
    setRouteInfo(null);

    try {
      // 1. Geocode both origin and destination using free OpenStreetMap Nominatim
      const [startLoc, endLoc] = await Promise.all([
        geocodeAddress(origin),
        geocodeAddress(destination),
      ]);

      // 2. Fetch driving route from free Open Source Routing Machine (OSRM)
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLoc.lng},${startLoc.lat};${endLoc.lng},${endLoc.lat}?overview=full&geometries=geojson`;
      const osrmRes = await fetch(osrmUrl);
      const osrmData = await osrmRes.json();

      let coordinates = [
        [startLoc.lat, startLoc.lng],
        [endLoc.lat, endLoc.lng],
      ];

      if (osrmData.routes && osrmData.routes[0]) {
        const route = osrmData.routes[0];
        // OSRM coordinates are [lng, lat], Leaflet expects [lat, lng]
        coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteInfo({
          distanceKm: (route.distance / 1000).toFixed(1),
          durationMin: Math.round(route.duration / 60),
        });
      }

      // 3. Request backend safest route calculation with Bearer JWT
      const backendRes = await fetch(`${API_BASE_URL}/api/route/safest`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          origin: { lat: startLoc.lat, lng: startLoc.lng },
          destination: { lat: endLoc.lat, lng: endLoc.lng },
        }),
      });

      await handleAuthResponse(backendRes);
      const backendData = await backendRes.json();
      const score = backendData.safety_score ?? "N/A";
      setSafeScore(score);
      setTrafficLevel(backendData.traffic_level || "NORMAL");

      // 4. Update Leaflet map display
      if (mapInstanceRef.current && routeLayerGroupRef.current) {
        routeLayerGroupRef.current.clearLayers();

        const color = getSafetyColor(score);

        // Draw route polyline
        const polyline = L.polyline(coordinates, {
          color: color,
          weight: 6,
          opacity: 0.85,
        }).addTo(routeLayerGroupRef.current);

        // Origin marker
        L.marker([startLoc.lat, startLoc.lng])
          .bindPopup(`<b>Start:</b> ${startLoc.displayName}`)
          .addTo(routeLayerGroupRef.current);

        // Destination marker
        L.marker([endLoc.lat, endLoc.lng])
          .bindPopup(`<b>Destination:</b> ${endLoc.displayName}`)
          .addTo(routeLayerGroupRef.current);

        // Fit map view to route bounds
        mapInstanceRef.current.fitBounds(polyline.getBounds(), {
          padding: [40, 40],
        });
      }
    } catch (err) {
      console.error("Route planning error:", err);
      setErrorMsg(err.message || "Failed to calculate route. Please try different locations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Route Planning Form */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Plan Safe Route</h4>
            <p className="text-xs text-gray-500">Powered by OpenStreetMap & SheRox Safety Engine</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Enter Origin (e.g. Connaught Place, Delhi)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-purple-500" />
              </div>
              <input
                type="text"
                placeholder="Enter Destination (e.g. India Gate, Delhi)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading
                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
          >
            {loading ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                <span>Finding Safest Route...</span>
              </>
            ) : (
              <>
                <Navigation className="h-5 w-5" />
                <span>Get Safe Route</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Safety Score & Route Details Display */}
      {safeScore !== null && (
        <div
          className={`rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 ${
            safeScore > 7
              ? "bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-200/50"
              : safeScore > 4
              ? "bg-gradient-to-br from-yellow-50/90 to-orange-50/90 border-yellow-200/50"
              : "bg-gradient-to-br from-red-50/90 to-rose-50/90 border-red-200/50"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                  safeScore > 7
                    ? "bg-gradient-to-br from-green-400 to-green-600"
                    : safeScore > 4
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : "bg-gradient-to-br from-red-400 to-red-600"
                }`}
              >
                {getSafetyIcon(safeScore)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Route Safety Score</h4>
                <p
                  className={`text-sm font-semibold ${
                    safeScore > 7
                      ? "text-green-700"
                      : safeScore > 4
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {safeScore} / 10 - {getSafetyLabel(safeScore)}
                </p>
                {trafficLevel && (
                  <p className="text-xs text-gray-600">
                    Traffic Activity: <span className="font-semibold">{trafficLevel}</span>
                  </p>
                )}
              </div>
            </div>

            {routeInfo && (
              <div className="flex items-center space-x-4 bg-white/70 px-4 py-2 rounded-xl border border-gray-200">
                <div className="text-center">
                  <span className="text-xs text-gray-500">Distance</span>
                  <p className="text-sm font-bold text-gray-900">{routeInfo.distanceKm} km</p>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-center">
                  <span className="text-xs text-gray-500">Est. Time</span>
                  <p className="text-sm font-bold text-gray-900">{routeInfo.durationMin} mins</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OpenStreetMap Container */}
      <div className="rounded-2xl overflow-hidden border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "420px" }}
          className="z-0"
        />
      </div>
    </div>
  );
};

export default RoutePlanner;