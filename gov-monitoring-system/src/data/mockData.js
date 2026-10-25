import { INSTITUTIONAL_EQUIPMENT_REGISTRY } from './equipmentRegistry';

/**
 * Center ID Mapping & Isolation Engine:
 * Any submissions, logs, and attendance records associated with Center 3109 or general trainee actions
 * must be correctly filtered, bound, and routed specifically to Training Center 2 (Center 8472)
 * rather than bleeding into Center 1.
 */
export const CENTER_ROUTING_MAP = {
  '3109': 'CNT-8472',
  'CNT-3109': 'CNT-8472',
  '8472': 'CNT-8472',
  'CNT-8472': 'CNT-8472',
  '9903': 'CNT-9903',
  'CNT-9903': 'CNT-9903'
};

/**
 * Strict tenant resolution function ensuring Center 3109 trainee logs are bound to Training Center 2 (Center 8472)
 * and never contaminate Center 1.
 * @param {string} sourceCenterId 
 * @param {string} userRole 
 * @returns {string} Target Center ID (e.g., 'CNT-8472')
 */
export const resolveTargetCenterId = (sourceCenterId, userRole = 'trainee') => {
  const cleanId = String(sourceCenterId || '').trim().toUpperCase();
  if (cleanId === 'CNT-8472' || cleanId === '8472' || cleanId.includes('8472') || cleanId.includes('CENTRE 2') || cleanId.includes('CENTER 2')) {
    return 'CNT-8472';
  }
  if (cleanId === 'CNT-3109' || cleanId === '3109' || cleanId.includes('3109') || cleanId.includes('CENTRE 1') || cleanId.includes('CENTER 1')) {
    return 'CNT-3109';
  }
  if (cleanId === 'CNT-9903' || cleanId === '9903' || cleanId.includes('9903') || cleanId.includes('CENTRE 3') || cleanId.includes('CENTER 3')) {
    return 'CNT-9903';
  }
  return CENTER_ROUTING_MAP[cleanId] || cleanId || 'CNT-8472';
};

// Two Government Accredited Training Centres
// Tracked equipment strictly restricted to: Computers & Fans
export const trainingCentres = [
  {
    centre_id: "CNT-3109",
    centre_label: "Training Centre 1",
    centre_name: "Training Centre 1 - Regional Advanced Vocational Institute #18",
    district: "South Tech Corridor, Bengaluru",
    inspection_date: "2026-10-14",
    last_sync: "11:28 AM IST (YOLO Vision Model v11.4)",
    attendance_column: {
      manual_reported: 1,
      ai_detected: 1,
      enrolled: 1,
      discrepancy_flag: false,
      discrepancy_variance: 0,
      confidence_score: 98.2,
      camera_id: "CAM-01-LIVE-EDGE",
      timestamp: "11:25:10 AM"
    },
    infrastructure_column: {
      items: [
        {
          id: "EQ-LAPTOP",
          name: "Computers",
          detail: "Student IT Terminals / Desktop Monitors / Laptops",
          category: "Computers & IT",
          sanctioned: 1,
          detected: 1,
          trainee_reported: 1,
          damaged: 0,
          unit: "terminals",
          status: "Matched"
        }
      ],
      trainee_feedback: "Training Centre 1 live webcam edge sensor online. Laptops and trainee headcount monitored."
    }
  },
  {
    centre_id: "CNT-8472",
    centre_label: "Training Centre 2 (Center 8472)",
    centre_name: "Training Centre 2 - National Directorate Skill Centre #42 (Center 8472)",
    district: "Central Administrative District, New Delhi",
    inspection_date: "2026-10-14",
    last_sync: "11:20 AM IST (YOLO Vision Model v11.4)",
    attendance_column: {
      manual_reported: 8,
      ai_detected: 8,
      enrolled: 50,
      discrepancy_flag: false,
      discrepancy_variance: 0,
      confidence_score: 99.1,
      camera_id: "CAM-02-CCTV-ARCHIVE (040.avi)",
      timestamp: "11:22:45 AM"
    },
    infrastructure_column: {
      items: [
        {
          id: "EQ-LAPTOP",
          name: "Computers",
          detail: "Student IT Terminals / Desktop Monitors / Laptops",
          category: "Computers & IT",
          sanctioned: 33,
          detected: 33,
          trainee_reported: 33,
          damaged: 0,
          unit: "terminals",
          status: "Matched"
        },
        {
          id: "EQ-FAN",
          name: "Fans",
          detail: "Ceiling fans / Wall air circulators",
          category: "Electrical & Environment",
          sanctioned: 5,
          detected: 5,
          trainee_reported: 5,
          damaged: 0,
          unit: "fans",
          status: "Matched"
        }
      ],
      trainee_feedback: "All 33 computer lab workstations and all 5 ceiling fans inspected and fully operational. Trainee reports routed from Center 3109 login."
    }
  },
  {
    centre_id: "CNT-9903",
    centre_label: "Training Centre 3",
    centre_name: "Training Centre 3 - Eastern Industrial Skills Polytechnic #07",
    district: "Bidhannagar Tech Zone, Kolkata",
    inspection_date: "2026-10-14",
    last_sync: "11:15 AM IST (YOLO Vision Model v11.4)",
    attendance_column: {
      manual_reported: 4,
      ai_detected: 4,
      enrolled: 50,
      discrepancy_flag: false,
      discrepancy_variance: 0,
      confidence_score: 97.4,
      camera_id: "CAM-03-CCTV-EAST (sample_cctv.mp4)",
      timestamp: "11:15:30 AM"
    },
    infrastructure_column: {
      items: [
        {
          id: "EQ-LAPTOP",
          name: "Computers",
          detail: "Student IT Terminals / Desktop Monitors / Laptops",
          category: "Computers & IT",
          sanctioned: 30,
          detected: 25,
          trainee_reported: 30,
          damaged: 5,
          unit: "terminals",
          status: "Deficit (-5) & 5 Defective"
        },
        {
          id: "EQ-FAN",
          name: "Fans",
          detail: "Ceiling fans / Wall air circulators",
          category: "Electrical & Environment",
          sanctioned: 6,
          detected: 4,
          trainee_reported: 6,
          damaged: 2,
          unit: "fans",
          status: "Deficit (-2) & 2 Defective"
        }
      ],
      damaged_summary: {
        "EQ-LAPTOP": 5,
        "EQ-FAN": 2
      },
      total_damaged_count: 7,
      trainee_feedback: "Critical equipment maintenance backlog: 5 student computer terminals broken (44+ days overdue) and 2 ceiling fans burnt out. Batch attendance severely depleted."
    }
  }
];

export const initialGovData = trainingCentres[0];
