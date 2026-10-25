// Ground-truth attendee registry for Training Centre 2 (040.avi room: 8 people in total)
export const CCTV_8_TRAINEES = [
  {
    id: "TR-01",
    shortLabel: "TR-01 [INST 99%]",
    pose: "Standing Center Aisle (Instructor)",
    cx: 0.5208,
    cy: 0.5741,
    rw: 0.0938,
    rh: 0.4815,
    isStanding: true,
    head: { cx: 0.526, cy: 0.3866, rw: 0.0521, rh: 0.1065 }
  },
  {
    id: "TR-02",
    shortLabel: "TR-02 [SIT 98%]",
    pose: "Desk Station #2 (Sitting)",
    cx: 0.5938,
    cy: 0.3935,
    rw: 0.0833,
    rh: 0.1389,
    isStanding: false,
    head: { cx: 0.6029, cy: 0.3681, rw: 0.0443, rh: 0.088 }
  },
  {
    id: "TR-03",
    shortLabel: "TR-03 [SIT 98%]",
    pose: "Desk Station #3 (Sitting)",
    cx: 0.6458,
    cy: 0.3102,
    rw: 0.0677,
    rh: 0.0833,
    isStanding: false,
    head: { cx: 0.6536, cy: 0.3079, rw: 0.0417, rh: 0.0787 }
  },
  {
    id: "TR-04",
    shortLabel: "TR-04 [SIT 97%]",
    pose: "Desk Station #4 (Sitting)",
    cx: 0.638,
    cy: 0.2338,
    rw: 0.0573,
    rh: 0.0694,
    isStanding: false,
    head: { cx: 0.6406, cy: 0.2338, rw: 0.0365, rh: 0.0694 }
  },
  {
    id: "TR-05",
    shortLabel: "TR-05 [SIT 99%]",
    pose: "Desk Station #5 (Sitting)",
    cx: 0.556,
    cy: 0.2361,
    rw: 0.0495,
    rh: 0.0648,
    isStanding: false,
    head: { cx: 0.556, cy: 0.2384, rw: 0.0391, rh: 0.0694 }
  },
  {
    id: "TR-06",
    shortLabel: "TR-06 [SIT 98%]",
    pose: "Desk Station #6 (Sitting)",
    cx: 0.3724,
    cy: 0.2176,
    rw: 0.0469,
    rh: 0.0741,
    isStanding: false,
    head: { cx: 0.3737, cy: 0.213, rw: 0.0339, rh: 0.0648 }
  },
  {
    id: "TR-07",
    shortLabel: "TR-07 [SIT 97%]",
    pose: "Desk Station #7 (Sitting)",
    cx: 0.3789,
    cy: 0.1597,
    rw: 0.0391,
    rh: 0.0602,
    isStanding: false,
    head: { cx: 0.3789, cy: 0.1574, rw: 0.0286, rh: 0.0556 }
  },
  {
    id: "TR-08",
    shortLabel: "TR-08 [SIT 99%]",
    pose: "Desk Station #8 (Sitting)",
    cx: 0.5755,
    cy: 0.1528,
    rw: 0.0365,
    rh: 0.0556,
    isStanding: false,
    head: { cx: 0.5755, cy: 0.1505, rw: 0.026, rh: 0.0509 }
  },
];

export const CCTV_38_TRAINEES = CCTV_8_TRAINEES;

// Normalized spatial anchors calibrated against 1920x1080 040 CCTV footage
// Restricted strictly to: Computers (33) & Fans (5)
export const CCTV_ROOM_FIXTURES = [
  // 5 Physical Wall Fans (Left and Right Walls)
  { id: "EQ-FAN", name: "Fans (Wall Fan #1 Front-L)", shortLabel: "FAN-01 98%", category: "Fans", cx: 0.1367, cy: 0.1898, rw: 0.0964, rh: 0.1389, color: "#0ea5e9", tagBg: "#0369a1" },
  { id: "EQ-FAN", name: "Fans (Wall Fan #2 Mid-L)", shortLabel: "FAN-02 99%", category: "Fans", cx: 0.3242, cy: 0.0556, rw: 0.0599, rh: 0.0741, color: "#0ea5e9", tagBg: "#0369a1" },
  { id: "EQ-FAN", name: "Fans (Wall Fan #3 Rear-L)", shortLabel: "FAN-03 97%", category: "Fans", cx: 0.3997, cy: 0.0208, rw: 0.0443, rh: 0.0417, color: "#0ea5e9", tagBg: "#0369a1" },
  { id: "EQ-FAN", name: "Fans (Wall Fan #4 Rear-R)", shortLabel: "FAN-04 98%", category: "Fans", cx: 0.6159, cy: 0.0255, rw: 0.0443, rh: 0.0509, color: "#0ea5e9", tagBg: "#0369a1" },
  { id: "EQ-FAN", name: "Fans (Wall Fan #5 Front-R)", shortLabel: "FAN-05 99%", category: "Fans", cx: 0.9219, cy: 0.2361, rw: 0.0833, rh: 0.1759, color: "#0ea5e9", tagBg: "#0369a1" },

  // 33 Physical Computer Workstations across Left & Right Banks and Rear Stations
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 1-L)", shortLabel: "PC-01 98%", category: "Computers", cx: 0.6198, cy: 0.7731, rw: 0.1458, rh: 0.1574, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 1-R)", shortLabel: "PC-02 98%", category: "Computers", cx: 0.7643, cy: 0.7477, rw: 0.1328, rh: 0.1435, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 2-L)", shortLabel: "PC-03 98%", category: "Computers", cx: 0.6029, cy: 0.5139, rw: 0.0859, rh: 0.1111, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 2-R)", shortLabel: "PC-04 98%", category: "Computers", cx: 0.7096, cy: 0.5162, rw: 0.1016, rh: 0.1157, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 3-L)", shortLabel: "PC-05 98%", category: "Computers", cx: 0.5651, cy: 0.3796, rw: 0.0625, rh: 0.0833, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 3-R)", shortLabel: "PC-06 98%", category: "Computers", cx: 0.6602, cy: 0.3843, rw: 0.0807, rh: 0.0926, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 4-L)", shortLabel: "PC-07 98%", category: "Computers", cx: 0.5599, cy: 0.2917, rw: 0.0625, rh: 0.0741, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 4-R)", shortLabel: "PC-08 98%", category: "Computers", cx: 0.6211, cy: 0.2917, rw: 0.0599, rh: 0.0741, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 5-L)", shortLabel: "PC-09 98%", category: "Computers", cx: 0.5495, cy: 0.2245, rw: 0.0469, rh: 0.0602, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 5-R)", shortLabel: "PC-10 98%", category: "Computers", cx: 0.6016, cy: 0.2245, rw: 0.0469, rh: 0.0602, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 6-L)", shortLabel: "PC-11 98%", category: "Computers", cx: 0.5469, cy: 0.1782, rw: 0.0417, rh: 0.0509, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 6-R)", shortLabel: "PC-12 98%", category: "Computers", cx: 0.5911, cy: 0.1782, rw: 0.0417, rh: 0.0509, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 7-L)", shortLabel: "PC-13 98%", category: "Computers", cx: 0.5417, cy: 0.1458, rw: 0.0365, rh: 0.0417, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 7-R)", shortLabel: "PC-14 98%", category: "Computers", cx: 0.5807, cy: 0.1458, rw: 0.0365, rh: 0.0417, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 8-L)", shortLabel: "PC-15 98%", category: "Computers", cx: 0.5378, cy: 0.1204, rw: 0.0339, rh: 0.037, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Right Bank Row 8-R)", shortLabel: "PC-16 98%", category: "Computers", cx: 0.5742, cy: 0.1204, rw: 0.0339, rh: 0.037, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 1-L)", shortLabel: "PC-17 98%", category: "Computers", cx: 0.2044, cy: 0.5139, rw: 0.0859, rh: 0.1204, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 1-R)", shortLabel: "PC-18 98%", category: "Computers", cx: 0.3073, cy: 0.5185, rw: 0.099, rh: 0.1204, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 2-L)", shortLabel: "PC-19 98%", category: "Computers", cx: 0.2721, cy: 0.3773, rw: 0.0755, rh: 0.0972, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 2-R)", shortLabel: "PC-20 98%", category: "Computers", cx: 0.3555, cy: 0.3819, rw: 0.0807, rh: 0.0972, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 3-L)", shortLabel: "PC-21 98%", category: "Computers", cx: 0.3177, cy: 0.287, rw: 0.0625, rh: 0.0741, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 3-R)", shortLabel: "PC-22 98%", category: "Computers", cx: 0.3841, cy: 0.2824, rw: 0.0651, rh: 0.0741, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 4-L)", shortLabel: "PC-23 98%", category: "Computers", cx: 0.3503, cy: 0.2245, rw: 0.0495, rh: 0.0602, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 4-R)", shortLabel: "PC-24 98%", category: "Computers", cx: 0.4049, cy: 0.2245, rw: 0.0495, rh: 0.0602, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 5-L)", shortLabel: "PC-25 98%", category: "Computers", cx: 0.3724, cy: 0.1782, rw: 0.0417, rh: 0.0509, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 5-R)", shortLabel: "PC-26 98%", category: "Computers", cx: 0.4167, cy: 0.1782, rw: 0.0417, rh: 0.0509, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 6-L)", shortLabel: "PC-27 98%", category: "Computers", cx: 0.3906, cy: 0.1458, rw: 0.0365, rh: 0.0417, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 6-R)", shortLabel: "PC-28 98%", category: "Computers", cx: 0.4271, cy: 0.1458, rw: 0.0365, rh: 0.0417, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 7-L)", shortLabel: "PC-29 98%", category: "Computers", cx: 0.4049, cy: 0.1204, rw: 0.0339, rh: 0.037, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Left Bank Row 7-R)", shortLabel: "PC-30 98%", category: "Computers", cx: 0.4388, cy: 0.1204, rw: 0.0339, rh: 0.037, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Rear Station 1)", shortLabel: "PC-31 98%", category: "Computers", cx: 0.4688, cy: 0.1194, rw: 0.0312, rh: 0.0352, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Rear Station 2)", shortLabel: "PC-32 98%", category: "Computers", cx: 0.4128, cy: 0.0995, rw: 0.0286, rh: 0.0324, color: "#0284c7", tagBg: "#075985" },
  { id: "EQ-LAPTOP", name: "Computers (Rear Station 3)", shortLabel: "PC-33 98%", category: "Computers", cx: 0.5352, cy: 0.0995, rw: 0.0286, rh: 0.0324, color: "#0284c7", tagBg: "#075985" },
];
