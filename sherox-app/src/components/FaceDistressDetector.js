import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceDistressDetector = () => {
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading models...");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "https://cdn.jsdelivr.net/npm/face-api.js/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera error: ", err);
          setStatus("Camera access denied.");
        });
    };

    loadModels();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !faceapi.nets.tinyFaceDetector.params) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const { expressions } = detections;
        const fear = expressions.fearful || 0;
        if (fear > 0.6) {
          setStatus("⚠️ Fear detected! Triggering alert...");
          // Here you can call your SOS trigger
        } else {
          setStatus("🙂 No distress detected.");
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        className="rounded border"
      />
      <p className="mt-2 text-sm font-medium">{status}</p>
    </div>
  );
};

export default FaceDistressDetector;
