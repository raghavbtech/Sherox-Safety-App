import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, AlertTriangle, Shield, Activity, Info } from 'lucide-react';
import { triggerSOS } from "./VoiceSOS";

const VoiceDistressDetector = () => {
  const [status, setStatus] = useState("Initializing voice monitoring...");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const screamStartTimeRef = useRef(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        setStatus("Voice monitoring active");
        setIsActive(true);
        monitorVolume();
      } catch (err) {
        console.error("Mic access denied", err);
        setStatus("Microphone access denied");
        setIsActive(false);
      }
    };

    initAudio();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const monitorVolume = () => {
    const checkVolume = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
      setVolumeLevel(average);

      if (average > 90) {
        setStatus("⚠️ High distress level detected");
        if (!screamStartTimeRef.current) {
          screamStartTimeRef.current = Date.now();
        }

        if (
          Date.now() - screamStartTimeRef.current > 5000 &&
          !triggeredRef.current
        ) {
          triggeredRef.current = true;
          setStatus("🚨 Emergency SOS triggered!");
          triggerSOS("🚨 Distress Detected via Voice Screaming!");
        }
      } else if (average > 60) {
        setStatus("⚡ Elevated voice detected");
        screamStartTimeRef.current = null;
        triggeredRef.current = false;
      } else {
        setStatus("✅ Voice monitoring - All clear");
        screamStartTimeRef.current = null;
        triggeredRef.current = false;
      }

      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };

  const getStatusColor = () => {
    if (status.includes('⚠️')) return 'text-yellow-600';
    if (status.includes('🚨')) return 'text-red-600';
    if (status.includes('✅')) return 'text-green-600';
    return 'text-white';
  };

  const getStatusIcon = () => {
    if (status.includes('⚠️')) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (status.includes('🚨')) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (status.includes('✅')) return <Shield className="h-5 w-5 text-green-500" />;
    return <Activity className="h-5 w-5 text-blue-500" />;
  };

  const getVolumeBarColor = () => {
    if (volumeLevel > 90) return 'from-red-500 to-red-600';
    if (volumeLevel > 60) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <div className="bg-white/80 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
            isActive 
              ? 'bg-gradient-to-br from-purple-400 to-purple-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }`}>
            {isActive ? (
              <Mic className="h-6 w-6 text-white" />
            ) : (
              <MicOff className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Voice Distress Monitor</h3>
            <p className="text-gray-600">Real-time audio analysis for emergency detection</p>
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-lg font-semibold ${getStatusColor()}`}>
                {status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-gray-600 font-medium">
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Volume Level Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Volume2 className="h-4 w-4" />
                <span>Audio Level</span>
              </span>
              <span className="font-mono">{Math.round(volumeLevel)}/255</span>
            </div>
            
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getVolumeBarColor()} transition-all duration-150 ease-out rounded-full`}
                style={{ width: `${Math.min(volumeLevel * 0.4, 100)}%` }}
              ></div>
            </div>
            
            {/* Threshold Indicators */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Silent</span>
              <span>Normal</span>
              <span>Alert</span>
              <span>Emergency</span>
            </div>
          </div>
        </div>

        {/* Monitoring Status */}
        <div className={`rounded-xl p-4 border ${
          isActive 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActive 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}>
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className={`font-semibold ${
                isActive ? 'text-green-800' : 'text-red-800'
              }`}>
                {isActive ? "Monitoring Active" : "Monitoring Inactive"}
              </div>
              <div className={`text-sm ${
                isActive ? 'text-green-700' : 'text-red-700'
              }`}>
                {isActive 
                  ? "Listening for distress signals in real-time"
                  : "Microphone access required for monitoring"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-blue-900 mb-2">How Voice Detection Works</h4>
            <p className="text-blue-800 leading-relaxed">
              The system continuously monitors audio levels in real-time. When sustained high-volume distress 
              is detected for 5+ seconds, an automatic SOS alert will be sent to your safety contacts. 
              Your privacy is protected - only audio levels are analyzed, not actual voice content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceDistressDetector;