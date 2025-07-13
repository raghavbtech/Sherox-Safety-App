import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const NumberPlateScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");

  const captureAndRead = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = new Image();
    image.src = imageSrc;
    image.onload = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 640;
      canvas.height = 480;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Crop only the center bounding box
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

      const { data: { text } } = await Tesseract.recognize(croppedDataUrl, "eng");
      const cleanText = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();
      setResult(cleanText);
      console.log("Cleaned Plate:", cleanText);
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Vehicle Number Plate Scanner</h2>

      <div style={{ position: "relative", width: 640, height: 480 }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          style={{ borderRadius: "8px" }}
        />
        {/* Red Bounding Box */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "300px",
            height: "100px",
            transform: "translate(-50%, -50%)",
            border: "2px dashed red",
            boxSizing: "border-box",
            pointerEvents: "none"
          }}
        />
      </div>

      <button onClick={captureAndRead} style={{ marginTop: "16px" }}>
        Scan Plate
      </button>
      <p>Detected Plate: {result}</p>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default NumberPlateScanner;
