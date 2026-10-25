/**
 * Compliance Analytics & Condition Monitoring Registry
 * Tracks 30-day historical analytics, real-time sensor metrics,
 * and asset repair tracking logs for Government Training Centres.
 */

export const DEFAULT_COMPLIANCE_THRESHOLDS = {
  minAttendanceRatePct: 60,         // Minimum attendance percentage required (60%)
  minDailyAttendees: 25,            // Minimum attendee count
  minActivityEngagementIndex: 50,  // Minimum movement & educational engagement score (50%)
  maxAllowedRepairDelayDays: 30,    // Statutory resolution limit for damaged assets (30 days)
  monitoringWindowDays: 30          // Historical evaluation window (30 days)
};

export const CENTRE_COMPLIANCE_DATA = {
  // Training Centre 1 (CNT-3109) - Compliant
  "CNT-3109": {
    centre_id: "CNT-3109",
    centre_label: "Training Centre 1",
    centre_name: "Training Centre 1 - Regional Advanced Vocational Institute #18",
    sanctionedCapacity: 20,
    currentAttendance: 1,
    currentAttendancePct: 95.0,
    thirtyDayAverageAttendancePct: 91.5,
    consecutiveLowDays: 0,
    attendanceTrend: "Normal / Compliant",
    currentEngagementIndex: 88,
    thirtyDayAvgEngagementIndex: 86.4,
    activeMovementScore: 89,
    trainerPresencePct: 96.0,
    educationalQualityRating: "High Engagement (Optimal Instructional Density)",
    assetRepairLogs: [
      {
        ticketId: "REP-3109-01",
        assetId: "PC-EDGE-01",
        assetName: "Edge Computing Gateway Terminal #01",
        damageType: "LAN port loose connection",
        reportDate: "2026-10-10",
        daysOverdue: 9,
        status: "Resolved",
        resolvedDate: "2026-10-12",
        priority: "Low"
      }
    ]
  },

  // Training Centre 2 (CNT-8472) - Compliant
  "CNT-8472": {
    centre_id: "CNT-8472",
    centre_label: "Training Centre 2 (Center 8472)",
    centre_name: "Training Centre 2 - National Directorate Skill Centre #42 (Center 8472)",
    sanctionedCapacity: 10,
    currentAttendance: 8,
    currentAttendancePct: 80.0,
    thirtyDayAverageAttendancePct: 84.2,
    consecutiveLowDays: 1,
    attendanceTrend: "Stable (+2.4% vs baseline)",
    currentEngagementIndex: 82,
    thirtyDayAvgEngagementIndex: 81.0,
    activeMovementScore: 85,
    trainerPresencePct: 94.0,
    educationalQualityRating: "Good Engagement (Consistent Practical Activity)",
    assetRepairLogs: [
      {
        ticketId: "REP-8472-01",
        assetId: "EQ-PC-28",
        assetName: "CAD/CAM Workstation Terminal #28",
        damageType: "Keyboard replacement required",
        reportDate: "2026-10-02",
        daysOverdue: 17,
        status: "In Progress (Vendor Dispatched)",
        priority: "Medium"
      }
    ]
  },

  // Training Centre 3 (CNT-9903) - Critical Non-Compliance Triggering Surprise Inspection
  "CNT-9903": {
    centre_id: "CNT-9903",
    centre_label: "Training Centre 3",
    centre_name: "Training Centre 3 - Eastern Industrial Skills Polytechnic #07",
    district: "Bidhannagar Tech Zone, Kolkata",
    sanctionedCapacity: 50,
    currentAttendance: 4,
    currentAttendancePct: 8.0,
    thirtyDayAverageAttendancePct: 24.5,
    consecutiveLowDays: 22,
    attendanceTrend: "Critical Decline (-41.2% over 30d window)",
    currentEngagementIndex: 16,
    thirtyDayAvgEngagementIndex: 18.5,
    activeMovementScore: 14,
    trainerPresencePct: 28.0,
    educationalQualityRating: "Substandard Quality (Classroom Inactivity & Missing Instructor)",
    assetRepairLogs: [
      {
        ticketId: "REP-9903-01",
        assetId: "PC-LAB-09",
        assetName: "Student CAD Terminal #09 (Workstation)",
        damageType: "Motherboard failure / Unbootable OS",
        reportDate: "2026-09-05",
        daysOverdue: 44,
        status: "Open (Vendor Overdue)",
        priority: "High"
      },
      {
        ticketId: "REP-9903-02",
        assetId: "PC-LAB-14",
        assetName: "Student IT Station #14 (Desktop)",
        damageType: "Cracked display & shorted power supply",
        reportDate: "2026-09-11",
        daysOverdue: 38,
        status: "Open (Unrepaired)",
        priority: "High"
      },
      {
        ticketId: "REP-9903-03",
        assetId: "FAN-CEIL-03",
        assetName: "High-Capacity Ceiling Fan #03 (Lab A)",
        damageType: "Motor winding burnt / non-functional",
        reportDate: "2026-09-14",
        daysOverdue: 35,
        status: "Open (Pending Parts)",
        priority: "Medium"
      }
    ]
  }
};

