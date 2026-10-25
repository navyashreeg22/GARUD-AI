import React, { useRef, useState, useEffect } from 'react';
import { Camera, VideoOff, Users, AlertCircle, Scan, Armchair } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as blazeface from '@tensorflow-models/blazeface';

export default function LiveYoloCameraFeed({ onCountChange, initialReportedCount = 45 }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const streamRef = useRef(null);

  const cocoModelRef = useRef(null);
  const blazefaceModelRef = useRef(null);
  const isDetectingRef = useRef(false);
  const detectionsRef = useRef({ faces: [], persons: [], chairs: [], benches: [] });

  // FPS tracking
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);


  const [isStreaming, setIsStreaming] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Real detection states
  const [personCount, setPersonCount] = useState(0);
  const [chairCount, setChairCount] = useState(0);
  const [benchCount, setBenchCount] = useState(0);
  const [liveFps, setLiveFps] = useState(0);

  // Load TensorFlow.js models on mount
  useEffect(() => {
    let isMounted = true;
    async function loadModels() {
      try {
        setModelLoading(true);
        await tf.ready();
        const [loadedCoco, loadedBlaze] = await Promise.all([
          cocoSsd.load({ base: 'lite_mobilenet_v2' }),
          blazeface.load()
        ]);
        if (isMounted) {
          cocoModelRef.current = loadedCoco;
          blazefaceModelRef.current = loadedBlaze;
          setModelLoading(false);
        }
      } catch (err) {
        console.error("TF model loading error:", err);
        if (isMounted) {
          setModelLoading(false);
          setErrorMessage("Failed to initialize AI detection models. Please check your network or browser WebGL support.");
        }
      }
    }
    loadModels();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // Blur specific face rectangle (true Gaussian-style blur)
  const blurFaceRect = (ctx, x, y, w, h) => {
    const sx = Math.max(0, Math.floor(x));
    const sy = Math.max(0, Math.floor(y));
    const sw = Math.max(1, Math.floor(w));
    const sh = Math.max(1, Math.floor(h));

    ctx.save();
    try {
      // Create temporary offscreen canvas for applying CSS blur
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = sw;
      tempCanvas.height = sh;
      const tempCtx = tempCanvas.getContext('2d');

      // Draw original face region to temp canvas
      tempCtx.drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, sw, sh);

      // Draw blurred version back onto main canvas
      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, sy, sw, sh);
      ctx.clip();
      ctx.filter = 'blur(12px)';
      ctx.drawImage(tempCanvas, 0, 0, sw, sh, sx - 4, sy - 4, sw + 8, sh + 8);
      ctx.restore();
    } catch {
      // Fallback heavy mosaic blur
      const blockSize = Math.max(8, Math.floor(sw / 8));
      const imgData = ctx.getImageData(sx, sy, sw, sh);
      const data = imgData.data;

      for (let py = 0; py < sh; py += blockSize) {
        for (let px = 0; px < sw; px += blockSize) {
          const redIdx = (py * sw + px) * 4;
          const r = data[redIdx] || 120;
          const g = data[redIdx + 1] || 120;
          const b = data[redIdx + 2] || 120;

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(sx + px, sy + py, blockSize, blockSize);
        }
      }
    }
    ctx.restore();
  };


  // Draw YOLO-style corner brackets & label
  const drawBoundingBox = (ctx, x, y, w, h, label, color = "#10b981", tagBg = "#064e3b") => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const cornerLen = Math.min(14, w / 4);
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 3;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x, y + cornerLen);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerLen, y);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x + w - cornerLen, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + cornerLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x, y + h - cornerLen);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + cornerLen, y + h);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x + w - cornerLen, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - cornerLen);
    ctx.stroke();

    // Header Tag
    ctx.font = "bold 11px monospace";
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = tagBg;
    ctx.fillRect(x, Math.max(0, y - 22), tw + 12, 22);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, Math.max(0, y - 22), tw + 12, 22);

    ctx.fillStyle = "#6ee7b7";
    ctx.fillText(label, x + 6, Math.max(14, y - 6));
    ctx.restore();
  };

  // Start real webcam
  const startCamera = async () => {
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Camera access is not supported by this browser environment.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();

        setIsStreaming(true);
        lastTimeRef.current = performance.now();
        frameCountRef.current = 0;
        runDetectionLoop();
      }
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage("Camera permission denied. Please allow camera permissions in your browser settings.");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage("Camera is currently in use by another application or device error occurred.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage("No physical camera device was detected on your system.");
      } else {
        setErrorMessage(`Camera access error: ${err.message || 'Unknown error'}`);
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setIsStreaming(false);
    setPersonCount(0);
    setChairCount(0);
    setBenchCount(0);
    setLiveFps(0);
    if (onCountChange) onCountChange(0);
  };

  // Main Detection and Pixelation Loop
  const runDetectionLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const detectFrame = async () => {
      if (!video || video.paused || video.ended || !streamRef.current) return;

      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      // Calculate real FPS
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      if (elapsed >= 1000) {
        const measuredFps = Math.round((frameCountRef.current * 1000) / elapsed);
        fpsRef.current = measuredFps;
        setLiveFps(measuredFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // 1. Draw raw video onto canvas to allow blur sampling
      ctx.drawImage(video, 0, 0, w, h);

      // 2. Trigger asynchronous AI inference in background without stalling animation loop
      if (cocoModelRef.current && blazefaceModelRef.current && !isDetectingRef.current) {
        isDetectingRef.current = true;
        Promise.all([
          cocoModelRef.current.detect(video),
          blazefaceModelRef.current.estimateFaces(video, false)
        ]).then(([predictions, faces]) => {
          const persons = predictions.filter(p => p.class === 'person');
          const chairs = predictions.filter(p => p.class === 'chair');
          const benches = predictions.filter(p => p.class === 'bench');

          detectionsRef.current = { faces, persons, chairs, benches };

          setPersonCount(persons.length);
          setChairCount(chairs.length);
          setBenchCount(benches.length);
          if (onCountChange) onCountChange(persons.length);
        }).catch((err) => {
          console.error("Frame detection error:", err);
        }).finally(() => {
          isDetectingRef.current = false;
        });
      }

      // 3. Render latest cached face blurs and YOLO bounding boxes on every frame
      const { faces, persons, chairs, benches } = detectionsRef.current;
      const personHasFace = new Array(persons.length).fill(false);

      // Blur detected faces and draw ID tags
      faces.forEach((face, idx) => {
        const startX = face.topLeft[0];
        const startY = face.topLeft[1];
        const endX = face.bottomRight[0];
        const endY = face.bottomRight[1];
        const fw = endX - startX;
        const fh = endY - startY;

        blurFaceRect(ctx, startX, startY, fw, fh);
        const traineeId = `TR-${String(idx + 1).padStart(2, '0')}`;
        drawBoundingBox(ctx, startX, startY, fw, fh, `ID: ${traineeId}`, "#10b981", "#064e3b");

        persons.forEach((person, pIdx) => {
          const [px, py, pw, ph] = person.bbox;
          if (startX >= px && endX <= px + pw && startY >= py && endY <= py + ph) {
            personHasFace[pIdx] = true;
          }
        });
      });

      // For persons without detected faces, blur upper 25% of box
      persons.forEach((person, pIdx) => {
        const [px, py, pw, ph] = person.bbox;
        if (!personHasFace[pIdx]) {
          const headH = ph * 0.25;
          blurFaceRect(ctx, px, py, pw, headH);
          const traineeId = `TR-${String(pIdx + 1).padStart(2, '0')}`;
          drawBoundingBox(ctx, px, py, pw, headH, `ID: ${traineeId}`, "#10b981", "#064e3b");
        }
      });

      // Draw equipment boxes
      chairs.forEach(c => {
        const [cx, cy, cw, ch] = c.bbox;
        drawBoundingBox(ctx, cx, cy, cw, ch, "CHAIR", "#f59e0b", "#78350f");
      });
      benches.forEach(b => {
        const [bx, by, bw, bh] = b.bbox;
        drawBoundingBox(ctx, bx, by, bw, bh, "BENCH", "#8b5cf6", "#4c1d95");
      });

      animFrameIdRef.current = requestAnimationFrame(detectFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(detectFrame);
  };


  // Real delta: AI count minus manual reported count
  const comparisonDelta = personCount - initialReportedCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-white">
      {/* Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center text-blue-300">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white tracking-wide">Live Edge Camera Feed</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${
                isStreaming ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isStreaming ? 'STREAM ONLINE' : 'STANDBY'}
              </span>
              {modelLoading && (
                <span className="text-[10px] text-amber-400 font-mono">Loading TF.js models...</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              In-browser COCO-SSD & BlazeFace detection with privacy mosaic pixelation.
            </p>
          </div>
        </div>

        {/* Buttons: Only Start Webcam and Stop */}
        <div className="flex items-center space-x-2">
          {!isStreaming ? (
            <button
              onClick={startCamera}
              disabled={modelLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Start Webcam</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <VideoOff className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* Camera Video / Canvas Area */}
      <div className="relative w-full aspect-video sm:h-96 bg-black flex items-center justify-center overflow-hidden">
        {/* Real hidden video element receiving getUserMedia */}
        <video ref={videoRef} playsInline muted autoPlay className="hidden" />

        {/* Live processed Canvas: contains clear video frame with pixelated faces & bounding boxes */}
        <canvas ref={canvasRef} className={`w-full h-full object-contain ${!isStreaming ? 'hidden' : 'block'}`} />

        {/* Standby UI */}
        {!isStreaming && (
          <div className="text-center p-8 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Scan className="w-7 h-7 text-blue-400" />
            </div>
            <h4 className="font-bold text-sm text-slate-200">Camera Feed Offline</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Click Start Webcam to activate live in-browser AI head count and selective face pixelation.
            </p>
            <button
              onClick={startCamera}
              disabled={modelLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm inline-flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>Start Webcam</span>
            </button>
          </div>
        )}
      </div>

      {/* Clear Error Notifications */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/70 border-t border-rose-900 text-xs text-rose-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real Live Telemetry (No Hardcoded Values) */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block flex items-center">
            <Users className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            Live Head Count
          </span>
          <span className="text-lg font-bold font-mono text-white">{personCount} Persons</span>
          <span className="text-[10px] text-slate-500 block">AI-detected in frame</span>
        </div>

        <div>
          <span className="text-slate-400 block flex items-center">
            <Armchair className="w-3.5 h-3.5 text-amber-400 mr-1" />
            Equipment Count
          </span>
          <span className="text-sm font-bold font-mono text-slate-200">
            {chairCount} Chairs • {benchCount} Benches
          </span>
          <span className="text-[10px] text-slate-500 block">COCO-SSD furniture</span>
        </div>

        <div>
          <span className="text-slate-400 block">Real Processing Rate</span>
          <span className="text-sm font-bold font-mono text-slate-200">{liveFps} FPS</span>
          <span className="text-[10px] text-slate-500 block">Active browser rendering</span>
        </div>

        <div>
          <span className="text-slate-400 block">Comparison Delta</span>
          <span className={`text-sm font-bold font-mono ${comparisonDelta < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {comparisonDelta > 0 ? `+${comparisonDelta}` : comparisonDelta} Trainees
          </span>
          <span className="text-[10px] text-slate-500 block">
            {personCount} (AI) - {initialReportedCount} (Reported)
          </span>
        </div>
      </div>
    </div>
  );
}
