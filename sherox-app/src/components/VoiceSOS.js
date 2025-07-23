import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Volume2, AlertTriangle, Shield, Activity, Info, MapPin, Clock } from 'lucide-react';
import API_BASE_URL from "../apiConfig";

const VoiceSOS = () => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Web Speech API not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      const confidenceLevel = event.results[event.results.length - 1][0].confidence;
      
      setLastCommand(transcript);
      setConfidence(Math.round(confidenceLevel * 100));
      
      console.log("🎤 Voice Input:", transcript);
      const customKeyword = localStorage.getItem("sos_keyword")?.toLowerCase();
      const defaultKeyword = "help me sherox";
      const transcriptMatch = transcript.includes(defaultKeyword) || (customKeyword && transcript.includes(customKeyword));
      
      if (transcriptMatch) {
        recognition.stop();
        setIsListening(false);

        const userEmail = localStorage.getItem("user_email");
        if (!userEmail) {
          alert("User not logged in. SOS aborted.");
          return;
        }

        let location = { lat: null, lng: null, address: "Unknown" };
        try {
          const pos = await new Promise((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej, {
              enableHighAccuracy: true,
              timeout: 5000,
            })
          );
          location.lat = pos.coords.latitude.toFixed(6);
          location.lng = pos.coords.longitude.toFixed(6);

          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          );
          const geoData = await geoRes.json();
          location.address = geoData.display_name || "Unknown location";

        } catch (err) {
          console.warn("📍 Location access or geocoding failed:", err);
        }

        try {
          const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
          const message = `🚨 SOS Alert from SheRox!\nLocation: ${location.address}\n📍Track: ${mapsLink}`;
          const res = await fetch(`${API_BASE_URL}/api/contacts/send-sos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_email: userEmail,
              message: message,
              plate_number: localStorage.getItem("last_plate") || "Unknown"
            }),
          });

          const data = await res.json();

          if (data.return === false || data.status_code === 412) {
            console.error("❌ SMS failed:", data.message);
            alert(`SMS failed: ${data.message}`);
          } else {
            console.log("✅ SOS sent to contacts:", data);
            alert("🚨 SOS alert sent to your trusted contacts.");
          }
        } catch (error) {
          console.error("❌ Failed to send SOS:", error);
          alert("Failed to send SOS. Try again.");
        }
      }
    };    

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!isListening) {
      recognition.start();
      setLastCommand("");
      setConfidence(0);
    } else {
      recognition.stop();
    }

    setIsListening((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      {/* Main SOS Button */}
      <div className="text-center">
        <button
          onClick={toggleListening}
          className={`w-32 h-32 rounded-full font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto ${
            isListening 
              ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse shadow-red-500/50' 
              : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-red-500 hover:to-red-600'
          }`}
        >
          {isListening ? (
            <Mic className="h-12 w-12" />
          ) : (
            <MicOff className="h-12 w-12" />
          )}
        </button>
        
        <div className="mt-4">
          <div className={`text-lg font-semibold mb-2 ${
            isListening ? 'text-red-400' : 'text-gray-400'
          }`}>
            {isListening ? "🔴 Listening for emergency command..." : "⚪ Voice SOS Ready"}
          </div>
          
          <div className="text-white">
            Say <span className="font-bold text-red-400">"Help Me SheRox"</span> to trigger emergency
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
            isListening 
              ? 'bg-gradient-to-br from-red-400 to-red-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }`}>
            <Volume2 className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Voice Recognition Status</h4>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 mb-4">
          <div className="text-sm text-gray-600 mb-2">Last Voice Input:</div>
          <div className="text-lg font-mono font-semibold text-green-600 min-h-[24px]">
            {lastCommand || "No voice input detected"}
          </div>
        </div>
        
        {isListening && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Recognition Confidence:</span>
              <span className="font-mono">{confidence}%</span>
            </div>
            
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  confidence > 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  confidence > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2 mt-4">
          <div className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-red-400 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-600 font-medium">
            {isListening ? "Actively listening" : "Standby mode"}
          </span>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-gradient-to-br from-red-50/90 to-rose-50/90 border border-red-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-red-900 mb-2">Emergency Activation</h4>
            <p className="text-red-800 leading-relaxed">
              When the trigger phrase is detected, your location will be automatically shared 
              with all trusted contacts via SMS. The system uses advanced speech recognition 
              to ensure reliable emergency response activation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the triggerSOS function for use by other components
export const triggerSOS = async (customMessage = "🚨 Emergency Alert!") => {
  const userEmail = localStorage.getItem("user_email");
  if (!userEmail) {
    alert("User not logged in. SOS aborted.");
    return;
  }

  let location = { lat: "Unknown", lng: "Unknown", place: "Unknown" };

  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej)
    );
    location.lat = pos.coords.latitude;
    location.lng = pos.coords.longitude;

    const geocodeRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyDqq5Z8m3RQ12kAD_nOdzNSR7C32Nklr20`
    );
    const geocodeData = await geocodeRes.json();
    if (
      geocodeData.results &&
      geocodeData.results[0] &&
      geocodeData.results[0].formatted_address
    ) {
      location.place = geocodeData.results[0].formatted_address;
    }
  } catch (err) {
    console.warn("Location access or reverse geocoding failed:", err);
  }

  const finalMessage = `${customMessage}
📍 Location: ${location.place} (${location.lat}, ${location.lng})
📌 Track: https://maps.google.com/?q=${location.lat},${location.lng}`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/contacts/send-sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmail,
        message: finalMessage,
      }),
    });

    const data = await res.json();
    console.log("✅ SOS sent:", data);
    alert("🚨 Emergency SOS sent to your trusted contacts.");
  } catch (error) {
    console.error("❌ Failed to send SOS:", error);
    alert("Failed to send SOS. Try again.");
  }
};

export default VoiceSOS;