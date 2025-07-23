import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapPin, Navigation, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import API_BASE_URL from "../apiConfig";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
};

const center = {
  lat: 28.6139,
  lng: 77.209,
};

const RoutePlanner = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState(null);
  const [safeScore, setSafeScore] = useState(null);
  const [requestRoute, setRequestRoute] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    setLoading(true);
    setRequestRoute(true);
    setDirections(null);
    setSafeScore(null);
  };

  const handleDirectionsCallback = async (response) => {
    if (response && response.status === "OK") {
      setDirections(response);
      setRequestRoute(false);

      const startLoc = response.routes[0].legs[0].start_location;
      const endLoc = response.routes[0].legs[0].end_location;

      try {
        const resp = await fetch(`${API_BASE_URL}/api/route/safest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: {
              lat: startLoc.lat(),
              lng: startLoc.lng(),
            },
            destination: {
              lat: endLoc.lat(),
              lng: endLoc.lng(),
            },
          }),
        });

        const data = await resp.json();
        console.log("🚦 SafeScore from API:", data);
        setSafeScore(data.safety_score || "N/A");
      } catch (error) {
        console.error("Error fetching SafeScore:", error);
        setSafeScore("N/A");
      }
    } else {
      console.error("Directions request failed", response);
    }
    setLoading(false);
  };

  const getSafetyColor = (score) => {
    if (score === "N/A") return "#6b7280";
    if (score > 7) return "#10b981";
    if (score > 4) return "#f59e0b";
    return "#ef4444";
  };

  const getSafetyLabel = (score) => {
    if (score === "N/A") return "Unknown";
    if (score > 7) return "Very Safe";
    if (score > 4) return "Moderately Safe";
    return "Use Caution";
  };

  const getSafetyIcon = (score) => {
    if (score === "N/A") return <Shield className="h-5 w-5" />;
    if (score > 7) return <CheckCircle className="h-5 w-5" />;
    if (score > 4) return <AlertTriangle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Route Planning Form */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Plan Your Route</h4>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Enter Origin"
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
                placeholder="Enter Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 ${
              loading 
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            }`}
          >
            {loading ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                <span>Planning Route...</span>
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

      {/* Safety Score Display */}
      {safeScore && (
        <div className={`rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 ${
          safeScore > 7 
            ? 'bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-200/50' 
            : safeScore > 4 
            ? 'bg-gradient-to-br from-yellow-50/90 to-orange-50/90 border-yellow-200/50'
            : 'bg-gradient-to-br from-red-50/90 to-rose-50/90 border-red-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                safeScore > 7 
                  ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : safeScore > 4 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                  : 'bg-gradient-to-br from-red-400 to-red-600'
              }`} style={{ color: getSafetyColor(safeScore) }}>
                <div className="text-white">
                  {getSafetyIcon(safeScore)}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Route Safety Score</h4>
                <p className={`text-sm font-medium ${
                  safeScore > 7 ? 'text-green-700' : safeScore > 4 ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {safeScore} / 10 - {getSafetyLabel(safeScore)}
                </p>
              </div>
            </div>
            
            <div className={`w-4 h-4 rounded-full shadow-lg`} 
                 style={{ 
                   backgroundColor: getSafetyColor(safeScore),
                   boxShadow: `0 0 15px ${getSafetyColor(safeScore)}40`
                 }}>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="rounded-2xl overflow-hidden border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            {requestRoute && origin && destination && (
              <DirectionsService
                options={{
                  destination,
                  origin,
                  travelMode: "DRIVING",
                }}
                callback={handleDirectionsCallback}
              />
            )}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: false,
                  polylineOptions: {
                    strokeColor: getSafetyColor(safeScore),
                    strokeWeight: 6,
                    strokeOpacity: 0.8
                  },
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default RoutePlanner;