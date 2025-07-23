import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const OfflineSMSHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [lastSent, setLastSent] = useState(null);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude.toFixed(5),
          lng: pos.coords.longitude.toFixed(5),
        });
      },
      (err) => console.warn("Location error", err),
      { enableHighAccuracy: true }
    );

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  const generateSMS = () => {
    const timestamp = new Date().toLocaleString();
    const message = `🚨 EMERGENCY ALERT - SheRox Safety
📍 Location: ${location.lat}, ${location.lng}
🚗 Last Vehicle: ${localStorage.getItem("last_plate") || "Unknown"}
⏰ Time: ${timestamp}
📍 Maps: https://maps.google.com/?q=${location.lat},${location.lng}`;
    
    const smsLink = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsLink;
    setLastSent(timestamp);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <div className={`relative overflow-hidden rounded-2xl p-6  border transition-all duration-300 ${
        isOnline 
          ? 'bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-200/50 shadow-lg shadow-green-100/50' 
          : 'bg-gradient-to-br from-red-50/90 to-rose-50/90 border-red-200/50 shadow-lg shadow-red-100/50'
      }`}>
        {/* Decorative background element */}
        <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 ${
          isOnline ? 'bg-green-200/30' : 'bg-red-200/30'
        }`}></div>
        
        <div className="relative z-10 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isOnline 
              ? 'bg-gradient-to-br from-green-400 to-green-600' 
              : 'bg-gradient-to-br from-red-400 to-red-600'
          }`}>
            {isOnline ? (
              <Wifi className="h-8 w-8 text-white" />
            ) : (
              <WifiOff className="h-8 w-8 text-white" />
            )}
          </div>
          
          <h4 className={`text-xl font-bold mb-2 ${
            isOnline ? 'text-green-800' : 'text-red-800'
          }`}>
            {isOnline ? 'Online Mode' : 'Offline Mode'}
          </h4>
          
          <p className={`text-sm mb-6 ${
            isOnline ? 'text-green-700' : 'text-red-700'
          }`}>
            {isOnline 
              ? 'Internet connection available - SOS will use online alerts'
              : 'No internet connection - SMS fallback is active'
            }
          </p>
          
          {!isOnline && (
            <button
              onClick={generateSMS}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send Emergency SMS</span>
            </button>
          )}
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Current Location</h4>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="text-sm text-gray-600 mb-2">Coordinates:</div>
          <div className="text-lg font-mono font-semibold text-blue-800 mb-3">
            {location.lat && location.lng 
              ? `${location.lat}, ${location.lng}`
              : 'Acquiring location...'
            }
          </div>
          <div className="text-xs text-gray-600 leading-relaxed">
            Location is automatically included in emergency messages for quick response
          </div>
        </div>
      </div>

      {/* Last Sent Confirmation */}
      {lastSent && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Last SMS sent:</span>
              </div>
              <div className="text-green-700 font-medium">{lastSent}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineSMSHandler;