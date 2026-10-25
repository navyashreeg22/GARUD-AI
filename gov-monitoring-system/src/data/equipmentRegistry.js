// Dedicated Institutional Equipment Registry for YOLO Detection
// Calibrated with strict confidence thresholds, spatial ROI constraints, and NMS rules
// Restricted strictly to:
// 1. Computers (Student IT Terminals / Laptops)
// 2. Fans (Ceiling Fans / Wall Circulation Fans)

export const INSTITUTIONAL_EQUIPMENT_REGISTRY = [
  // 1. Computers (Desktop IT Workstations / Laptops)
  {
    id: "EQ-LAPTOP",
    name: "Computers",
    shortPrefix: "PC",
    detail: "Student IT Terminals / Desktop Monitors / Laptops",
    category: "Computers & IT",
    color: "#0284c7", // Sky Blue
    tagBg: "#075985",
    sanctioned: 33,
    unit: "terminals",
    cocoClasses: ["laptop", "tv", "keyboard", "mouse"],
    // Post-processing ROI and confidence validation:
    detectionRules: (pred, frameHeight = 480, frameWidth = 640) => {
      const [x, y, w, h] = pred.bbox;
      const centerY = y + h / 2;

      // Spatial ROI constraint: Computers must be on desk/workstation level (below ceiling)
      if (centerY < frameHeight * 0.22) return false;

      // Aspect ratio check: monitors/keyboards are horizontal rectangles or square
      const aspect = w / Math.max(1, h);
      if (aspect < 0.60 || aspect > 2.8) return false;

      // Strict confidence thresholds: eliminates false positives on furniture/shadows
      if (pred.class === "laptop" && pred.score >= 0.45) return true;
      if (pred.class === "tv" && pred.score >= 0.50 && w >= 45 && h >= 35) return true;
      if (pred.class === "keyboard" && pred.score >= 0.45 && w >= 35) return true;
      if (pred.class === "mouse" && pred.score >= 0.50) return true;

      return false;
    }
  },

  // 2. Fans (Ceiling Fans / Wall Circulation Fans)
  {
    id: "EQ-FAN",
    name: "Fans",
    shortPrefix: "FAN",
    detail: "Ceiling fans / Wall air circulators",
    category: "Electrical & Environment",
    color: "#0ea5e9", // Blue
    tagBg: "#0369a1",
    sanctioned: 5,
    unit: "fans",
    cocoClasses: ["fan", "clock", "umbrella"],
    // Strict Spatial ROI & Confidence Constraints:
    // Eliminates false positives on plain walls, doors, shadows, or background noise
    detectionRules: (pred, frameHeight = 480, frameWidth = 640) => {
      const [x, y, w, h] = pred.bbox;
      const centerY = y + h / 2;

      // 1. Strict Ceiling ROI constraint: fans must reside in upper ceiling/wall zone (top 28%)
      const isCeilingZone = centerY <= frameHeight * 0.28;
      if (!isCeilingZone) return false;

      // 2. Aspect Ratio constraint: fans/rotors are symmetrical/circular (0.75 <= w/h <= 1.35)
      const aspect = w / Math.max(1, h);
      if (aspect < 0.72 || aspect > 1.38) return false;

      // 3. Size constraint: must be reasonably sized (not tiny speck or whole room)
      if (w < 35 || h < 30 || w > frameWidth * 0.40) return false;

      // 4. Strict confidence thresholds
      if (pred.class === "fan" && pred.score >= 0.55) return true;
      if ((pred.class === "clock" || pred.class === "umbrella") && pred.score >= 0.65) return true;

      return false;
    }
  }
];
