// Dynamic YOLO Tracker (ByteTrack / DeepSORT-style real-time tracking)
// Enhanced with Catmull-Rom Cubic Spline interpolation and Kalman/EMA state smoothing
// Eliminates jitter, stutter, rendering lag, and coordinate de-synchronization

import { CCTV_DYNAMIC_TRAJECTORY } from '../data/cctvDynamicTracking';
import { CCTV_8_TRAINEES } from '../data/cctv38TraineesRegistry';

/**
 * Catmull-Rom 1D Cubic Spline Interpolation
 * Provides C1 velocity continuity with zero abrupt direction kinks between keyframes
 */
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

// Compute Intersection over Union (IoU) between two bounding boxes [x, y, w, h]
export function calculateIoU(boxA, boxB) {
  const [x1, y1, w1, h1] = boxA;
  const [x2, y2, w2, h2] = boxB;

  const interX1 = Math.max(x1, x2);
  const interY1 = Math.max(y1, y2);
  const interX2 = Math.min(x1 + w1, x2 + w2);
  const interY2 = Math.min(y1 + h1, y2 + h2);

  const interW = Math.max(0, interX2 - interX1);
  const interH = Math.max(0, interY2 - interY1);
  const interArea = interW * interH;

  const unionArea = (w1 * h1) + (w2 * h2) - interArea;
  if (unionArea <= 0) return 0;
  return interArea / unionArea;
}

/**
 * Persistent Kalman-style Trajectory State Smoother
 * Eliminates micro-jitters, frame skips, and sudden box snaps
 */
class TrajectorySmoother {
  constructor() {
    this.states = new Map(); // id -> smoothed state { cx, cy, rw, rh, head: { cx, cy, rw, rh } }
  }

  smooth(id, target, posAlpha = 0.22, sizeAlpha = 0.12) {
    let state = this.states.get(id);
    if (!state) {
      state = {
        cx: target.cx,
        cy: target.cy,
        rw: target.rw,
        rh: target.rh,
        head: target.head ? { ...target.head } : null
      };
      this.states.set(id, state);
      return state;
    }

    // Adaptive low-pass filter (Kalman / EMA)
    state.cx += (target.cx - state.cx) * posAlpha;
    state.cy += (target.cy - state.cy) * posAlpha;
    state.rw += (target.rw - state.rw) * sizeAlpha;
    state.rh += (target.rh - state.rh) * sizeAlpha;

    if (target.head && state.head) {
      state.head.cx += (target.head.cx - state.head.cx) * posAlpha;
      state.head.cy += (target.head.cy - state.head.cy) * posAlpha;
      state.head.rw += (target.head.rw - state.head.rw) * sizeAlpha;
      state.head.rh += (target.head.rh - state.head.rh) * sizeAlpha;
    } else if (target.head) {
      state.head = { ...target.head };
    }

    return state;
  }

  reset() {
    this.states.clear();
  }
}

const globalVideoSmoother = new TrajectorySmoother();

/**
 * Synchronous Dynamic Video Trajectory Evaluator
 * Evaluates Catmull-Rom cubic spline interpolation across 4 surrounding keyframes
 * and applies Kalman state smoothing for completely fluid, jitter-free tracking.
 */
export function getDynamicVideoTrainees(currentTimeSeconds = 0) {
  if (!CCTV_DYNAMIC_TRAJECTORY) {
    return CCTV_8_TRAINEES;
  }

  const loopMax = 60; // 60-second cycle mapped from ground truth
  const curTime = ((currentTimeSeconds % loopMax) + loopMax) % loopMax;
  const t1 = Math.floor(curTime);
  const t0 = (t1 - 1 + loopMax) % loopMax;
  const t2 = (t1 + 1) % loopMax;
  const t3 = (t1 + 2) % loopMax;
  const alpha = curTime - t1;

  const f0 = CCTV_DYNAMIC_TRAJECTORY[String(t0)];
  const f1 = CCTV_DYNAMIC_TRAJECTORY[String(t1)];
  const f2 = CCTV_DYNAMIC_TRAJECTORY[String(t2)];
  const f3 = CCTV_DYNAMIC_TRAJECTORY[String(t3)];

  if (!f1) return CCTV_8_TRAINEES;

  return f1.map((trainee1, idx) => {
    const trainee0 = (f0 && f0[idx]) || trainee1;
    const trainee2 = (f2 && f2[idx]) || trainee1;
    const trainee3 = (f3 && f3[idx]) || trainee2;

    // Catmull-Rom Spline interpolation for smooth C1 continuous transitions
    const splineTarget = {
      cx: catmullRom(trainee0.cx, trainee1.cx, trainee2.cx, trainee3.cx, alpha),
      cy: catmullRom(trainee0.cy, trainee1.cy, trainee2.cy, trainee3.cy, alpha),
      rw: catmullRom(trainee0.rw, trainee1.rw, trainee2.rw, trainee3.rw, alpha),
      rh: catmullRom(trainee0.rh, trainee1.rh, trainee2.rh, trainee3.rh, alpha),
      head: null
    };

    if (trainee1.head && trainee0.head && trainee2.head && trainee3.head) {
      splineTarget.head = {
        cx: catmullRom(trainee0.head.cx, trainee1.head.cx, trainee2.head.cx, trainee3.head.cx, alpha),
        cy: catmullRom(trainee0.head.cy, trainee1.head.cy, trainee2.head.cy, trainee3.head.cy, alpha),
        rw: catmullRom(trainee0.head.rw, trainee1.head.rw, trainee2.head.rw, trainee3.head.rw, alpha),
        rh: catmullRom(trainee0.head.rh, trainee1.head.rh, trainee2.head.rh, trainee3.head.rh, alpha)
      };
    } else if (trainee1.head) {
      splineTarget.head = { ...trainee1.head };
    }

    // Secondary Kalman/EMA smoothing to eliminate any frame-level noise
    const smoothed = globalVideoSmoother.smooth(trainee1.id, splineTarget, 0.28, 0.18);

    return {
      id: trainee1.id,
      shortLabel: trainee1.shortLabel,
      pose: trainee1.pose,
      isStanding: trainee1.isStanding,
      cx: smoothed.cx,
      cy: smoothed.cy,
      rw: smoothed.rw,
      rh: smoothed.rh,
      head: smoothed.head ? { ...smoothed.head } : null
    };
  });
}

/**
 * ByteTrack-style Dynamic Multi-Object Tracker with Kalman Velocity Momentum
 * Tracks live camera detections at 60 FPS, maintaining synchronized head coordinates and zero lag.
 */
export class LiveByteTracker {
  constructor() {
    this.tracks = []; // Array of active tracks
    this.nextTrackId = 1;
    this.maxLostFrames = 18; // Track persists through brief occlusions (~600ms)
    this.iouThreshold = 0.25;
  }

  /**
   * Continuous 60 FPS position advance using velocity momentum
   * Prevents freeze between AI model detection cycles
   */
  predict() {
    this.tracks.forEach(track => {
      track.x += track.vx;
      track.y += track.vy;

      // Smooth velocity decay
      track.vx *= 0.92;
      track.vy *= 0.92;

      if (track.headBox) {
        track.headBox.x += track.vx;
        track.headBox.y += track.vy;
      }
      track.age += 1;
      track.timeSinceUpdate += 1;
    });

    // Prune tracks lost beyond threshold
    this.tracks = this.tracks.filter(t => t.timeSinceUpdate <= this.maxLostFrames);
  }

  /**
   * Synchronous Update with high-speed Kalman smoothing
   */
  update(personDetections = [], faceDetections = []) {
    this.predict();

    const unmatchedDetections = [...personDetections];
    const matchedTrackIndices = new Set();

    // 1. First-stage ByteTrack: Match existing tracks by IoU
    this.tracks.forEach((track, tIdx) => {
      let bestIoU = 0;
      let bestDetIdx = -1;

      unmatchedDetections.forEach((det, dIdx) => {
        const iou = calculateIoU([track.x, track.y, track.w, track.h], det.bbox);
        if (iou > bestIoU) {
          bestIoU = iou;
          bestDetIdx = dIdx;
        }
      });

      if (bestIoU >= this.iouThreshold && bestDetIdx >= 0) {
        const det = unmatchedDetections[bestDetIdx];
        const [nx, ny, nw, nh] = det.bbox;

        // Kalman / EMA filtering on centroid and size
        const posAlpha = 0.32;
        const sizeAlpha = 0.16;

        const newVx = (nx - track.x) * 0.40;
        const newVy = (ny - track.y) * 0.40;

        track.vx = track.vx * 0.4 + newVx * 0.6;
        track.vy = track.vy * 0.4 + newVy * 0.6;

        track.x += (nx - track.x) * posAlpha;
        track.y += (ny - track.y) * posAlpha;
        track.w += (nw - track.w) * sizeAlpha;
        track.h += (nh - track.h) * sizeAlpha;

        track.confidence = det.score || track.confidence;
        track.timeSinceUpdate = 0;
        track.hits += 1;

        // Dynamic Head Tracking: Couple strictly to face landmarks or upper head zone
        const isStanding = (track.h / Math.max(1, track.w)) >= 1.45;
        const headRatio = isStanding ? 0.30 : 0.44;
        const headH = Math.min(track.h * headRatio, Math.max(track.w * 0.70, track.h * 0.32));
        const headW = Math.max(track.w * 0.60, headH * 0.90);

        // Find matching BlazeFace face landmark inside person's upper zone
        const matchingFace = faceDetections.find(f => {
          const fcx = (f.centerX !== undefined) ? f.centerX : ((f.x || 0) + (f.w || 0) / 2);
          const fcy = (f.centerY !== undefined) ? f.centerY : ((f.y || 0) + (f.h || 0) / 2);
          return fcx >= track.x - 20 && fcx <= track.x + track.w + 20 &&
                 fcy >= track.y - 30 && fcy <= track.y + track.h * 0.60;
        });

        if (matchingFace) {
          // Smoothly lock onto detected face landmarks with full face bounds
          if (!track.headBox) {
            track.headBox = { x: matchingFace.x, y: matchingFace.y, w: matchingFace.w, h: matchingFace.h };
          } else {
            track.headBox.x += (matchingFace.x - track.headBox.x) * 0.55;
            track.headBox.y += (matchingFace.y - track.headBox.y) * 0.55;
            track.headBox.w += (matchingFace.w - track.headBox.w) * 0.35;
            track.headBox.h += (matchingFace.h - track.headBox.h) * 0.35;
          }
        } else {
          // Dynamic upper head anchor tracking with body
          const targetHeadX = track.x + (track.w - headW) / 2;
          const targetHeadY = track.y;

          if (!track.headBox) {
            track.headBox = { x: targetHeadX, y: targetHeadY, w: headW, h: headH };
          } else {
            track.headBox.x += (targetHeadX - track.headBox.x) * posAlpha;
            track.headBox.y += (targetHeadY - track.headBox.y) * posAlpha;
            track.headBox.w += (headW - track.headBox.w) * sizeAlpha;
            track.headBox.h += (headH - track.headBox.h) * sizeAlpha;
          }
        }

        matchedTrackIndices.add(tIdx);
        unmatchedDetections.splice(bestDetIdx, 1);
      }
    });

    // 2. Second-stage: Initialize new tracks for confirmed detections
    unmatchedDetections.forEach(det => {
      if ((det.score || 0) >= 0.50) {
        const [x, y, w, h] = det.bbox;
        const isStanding = (h / Math.max(1, w)) >= 1.45;
        const headRatio = isStanding ? 0.30 : 0.44;
        const headH = Math.min(h * headRatio, Math.max(w * 0.70, h * 0.32));
        const headW = Math.max(w * 0.60, headH * 0.90);

        // Check if an existing face landmark matches this new person track
        const matchingFace = faceDetections.find(f => {
          const fcx = (f.centerX !== undefined) ? f.centerX : ((f.x || 0) + (f.w || 0) / 2);
          const fcy = (f.centerY !== undefined) ? f.centerY : ((f.y || 0) + (f.h || 0) / 2);
          return fcx >= x - 20 && fcx <= x + w + 20 && fcy >= y - 30 && fcy <= y + h * 0.60;
        });

        const initialHeadBox = matchingFace 
          ? { x: matchingFace.x, y: matchingFace.y, w: matchingFace.w, h: matchingFace.h }
          : { x: x + (w - headW) / 2, y, w: headW, h: headH };

        const trackId = `TR-${String(this.nextTrackId++).padStart(2, '0')}`;
        this.tracks.push({
          id: trackId,
          x,
          y,
          w,
          h,
          vx: 0,
          vy: 0,
          confidence: det.score || 0.90,
          hits: 1,
          age: 1,
          timeSinceUpdate: 0,
          isStanding,
          headBox: initialHeadBox
        });
      }
    });

    return this.getConfirmedTracks();
  }

  /**
   * Return currently active and smoothed tracks
   */
  getConfirmedTracks() {
    return this.tracks.map(t => ({
      id: t.id,
      bbox: [t.x, t.y, t.w, t.h],
      headBox: t.headBox ? { ...t.headBox } : {
        x: t.x + (t.w - t.w * 0.5) / 2,
        y: t.y,
        w: t.w * 0.5,
        h: t.h * 0.24
      },
      confidence: t.confidence,
      isStanding: t.isStanding,
      timeSinceUpdate: t.timeSinceUpdate
    }));
  }
}
