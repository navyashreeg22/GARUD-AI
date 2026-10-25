export const initialGovData = {
  centre_id: "CNT-8472",
  centre_name: "Skill Training & Incubation Centre #42, Industrial Zone B",
  district: "Central Administrative District",
  inspection_date: "2026-10-10",
  last_sync: "10:45 AM IST (YOLO Batch v4.2)",
  attendance_column: {
    manual_reported: 45,
    ai_detected: 42,
    discrepancy_flag: true,
    discrepancy_variance: 3,
    confidence_score: 98.4,
    camera_id: "CAM-ENTRANCE-04",
    timestamp: "09:30:14 AM"
  },
  infrastructure_column: {
    items: [
      { name: "Workbenches", sanctioned: 12, detected: 10, unit: "units", status: "Deficit (-2)" },
      { name: "Welding Machines", sanctioned: 5, detected: 4, unit: "units", status: "Deficit (-1)" },
      { name: "Computers", sanctioned: 25, detected: 25, unit: "terminals", status: "Matched" }
    ],
    trainee_feedback: "One welding machine sent for repair yesterday. Two workbenches broken."
  }
};
