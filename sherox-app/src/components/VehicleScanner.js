import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { Camera, Scan, CheckCircle, AlertCircle, Loader, Target } from 'lucide-react';

import { logVehicleScan, calculateSafeScore } from "../utils/api";

const VehicleScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const captureAndRead = async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    const image = new Image();
    image.src = imageSrc;

    image.onload = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 640;
      canvas.height = 480;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const cropWidth = 300;
      const cropHeight = 100;
      const startX = (canvas.width - cropWidth) / 2;
      const startY = (canvas.height - cropHeight) / 2;

      const cropped = ctx.getImageData(startX, startY, cropWidth, cropHeight);
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.putImageData(cropped, 0, 0);
      const croppedDataUrl = tempCanvas.toDataURL("image/jpeg");

      const {
        data: { text },
      } = await Tesseract.recognize(croppedDataUrl, "eng");

      const cleanText = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();
      setResult(cleanText);
      localStorage.setItem("last_plate", text); 
      setTimeout(() => {
      const current = localStorage.getItem("last_plate");
        if (current === text) {
          localStorage.removeItem("last_plate");
        }
      }, 10 * 60 * 1000); // 10 minutes

      console.log("Cleaned Plate:", cleanText);

      let location = { lat: null, lng: null };
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      } catch {
        console.warn("Location access denied or unavailable");
      }

      let safescore = null;
      try {
        const resp = await calculateSafeScore({ lighting: 3, crimes: 2 });
        safescore = resp.safescore;
      } catch {
        safescore = null;
      }

      await logVehicleScan({
        plate_number: cleanText,
        location_lat: location.lat,
        location_lng: location.lng,
        safescore,
      });

      setLoading(false);
    };
  };

  return (
    <div className="space-y-6">
      {/* Camera Section */}
      <div className="relative">
        <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Live Camera Feed</h4>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden border-2 border-green-200/50 shadow-lg">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
              className="w-full h-auto"
            />
            
            {/* Scanning Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-24 border-3 border-dashed border-green-400 rounded-xl bg-green-400/10 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-green-600 font-semibold text-sm">Position license plate here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <div className="text-center">
        <button
          onClick={captureAndRead}
          disabled={loading}
          className={`py-4 px-8 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto space-x-3 text-lg ${
            loading 
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          }`}
        >
          {loading ? (
            <>
              <Loader className="h-6 w-6 animate-spin" />
              <span>Scanning License Plate...</span>
            </>
          ) : (
            <>
              <Scan className="h-6 w-6" />
              <span>Scan License Plate</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            result 
              ? 'bg-gradient-to-br from-green-400 to-green-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            {result ? (
              <CheckCircle className="h-5 w-5 text-white" />
            ) : (
              <AlertCircle className="h-5 w-5 text-white" />
            )}
          </div>
          <h4 className="text-lg font-bold text-gray-900">Detection Results</h4>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Detected License Plate:</div>
            <div className={`text-2xl font-bold font-mono tracking-wider mb-4 ${
              result ? 'text-green-600' : 'text-gray-400'
            }`}>
              {result || "No plate detected"}
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                loading 
                  ? 'bg-yellow-400 animate-pulse' 
                  : result 
                  ? 'bg-green-400' 
                  : 'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-600 font-medium">
                {loading ? "Processing image..." : result ? "Plate detected successfully" : "Ready to scan"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VehicleScanner;