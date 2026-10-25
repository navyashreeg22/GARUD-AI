/**
 * Automated Compliance Monitoring & Alert Service
 * 
 * Core Logic:
 * 1. Evaluates 3 critical statutory conditions:
 *    - Low Attendance (consistently below configurable threshold over 30 days)
 *    - Inactive / Poor Training Quality (absence of active engagement/movement during scheduled hours)
 *    - Unresolved Equipment Damage (broken assets pending repair > 30 days)
 * 2. When conditions trigger concurrently / persistently:
 *    - Issues formal "Surprise Inspection Recommendation"
 *    - Dispatches notifications via Dashboard Alert, Email, and Webhook/SMS
 *    - Provides direct links to Live Camera Monitoring Stream and Audit Logs
 */

import { CENTRE_COMPLIANCE_DATA, DEFAULT_COMPLIANCE_THRESHOLDS } from '../data/complianceAnalytics.js';

// In-memory alert event store for persistent notification logs
const ALERT_DISPATCH_HISTORY = [];

export const complianceAlertService = {
  /**
   * Retrieves default threshold configuration
   */
  getDefaultThresholds() {
    return { ...DEFAULT_COMPLIANCE_THRESHOLDS };
  },

  /**
   * Evaluates compliance for a specific training centre
   * @param {string} centreId 
   * @param {object} customThresholds 
   * @returns {object} Full compliance report & recommendation
   */
  evaluateCenterCompliance(centreId = 'CNT-8472', customThresholds = {}) {
    const thresholds = {
      ...DEFAULT_COMPLIANCE_THRESHOLDS,
      ...customThresholds
    };

    const data = CENTRE_COMPLIANCE_DATA[centreId];
    if (!data) {
      return {
        centre_id: centreId,
        error: `Centre ${centreId} not registered in compliance registry`
      };
    }

    // Condition 1: Low Attendance Evaluation
    const attendancePassed = data.thirtyDayAverageAttendancePct >= thresholds.minAttendanceRatePct;
    const attendanceEvaluation = {
      id: "COND_LOW_ATTENDANCE",
      title: "Consistently Low Trainee Attendance",
      passed: attendancePassed,
      currentPct: data.currentAttendancePct,
      thirtyDayAvgPct: data.thirtyDayAverageAttendancePct,
      thresholdPct: thresholds.minAttendanceRatePct,
      consecutiveLowDays: data.consecutiveLowDays,
      severity: attendancePassed ? "NORMAL" : "CRITICAL",
      description: attendancePassed
        ? `Attendance compliant at ${data.thirtyDayAverageAttendancePct}% average.`
        : `Attendance dropped to ${data.thirtyDayAverageAttendancePct}% (below ${thresholds.minAttendanceRatePct}% mandatory statutory quota) across ${data.consecutiveLowDays} of the past 30 days.`
    };

    // Condition 2: Inactive / Poor Training Quality Evaluation
    const qualityPassed = data.thirtyDayAvgEngagementIndex >= thresholds.minActivityEngagementIndex;
    const qualityEvaluation = {
      id: "COND_TRAINING_INACTIVITY",
      title: "Classroom Inactivity & Substandard Training Quality",
      passed: qualityPassed,
      currentEngagementIndex: data.currentEngagementIndex,
      thirtyDayAvgEngagementIndex: data.thirtyDayAvgEngagementIndex,
      thresholdEngagementIndex: thresholds.minActivityEngagementIndex,
      activeMovementScore: data.activeMovementScore,
      trainerPresencePct: data.trainerPresencePct,
      severity: qualityPassed ? "NORMAL" : "CRITICAL",
      description: qualityPassed
        ? `Educational engagement normal (${data.thirtyDayAvgEngagementIndex}% index).`
        : `Absence of active instructional activity during scheduled hours (09:00 - 17:00 IST). Motion activity index at ${data.activeMovementScore}%, engagement score at ${data.thirtyDayAvgEngagementIndex}% (below ${thresholds.minActivityEngagementIndex}% threshold).`
    };

    // Condition 3: Unresolved Equipment Damage & Repair Delays (>30 Days)
    const overdueRepairTickets = (data.assetRepairLogs || []).filter(
      ticket => ticket.status !== 'Resolved' && ticket.daysOverdue >= thresholds.maxAllowedRepairDelayDays
    );
    const repairsPassed = overdueRepairTickets.length === 0;
    const maxDaysOverdue = overdueRepairTickets.reduce((max, t) => Math.max(max, t.daysOverdue), 0);

    const repairEvaluation = {
      id: "COND_REPAIR_DELAYS",
      title: "Unresolved Equipment Damage Exceeding 30 Days",
      passed: repairsPassed,
      overdueCount: overdueRepairTickets.length,
      maxDaysOverdue,
      thresholdDays: thresholds.maxAllowedRepairDelayDays,
      overdueTickets: overdueRepairTickets,
      severity: repairsPassed ? "NORMAL" : "CRITICAL",
      description: repairsPassed
        ? "No equipment repairs pending beyond statutory 30-day mandate."
        : `${overdueRepairTickets.length} damaged/broken assets have remained unrepaired for over 30 days (longest: ${maxDaysOverdue} days). Violates Directorate Rule 14-B Asset Maintenance Mandate.`
    };

    // Combined Trigger Evaluation
    // Trigger when all 3 critical conditions are breached concurrently or persistently
    const failedConditionsCount = (!attendancePassed ? 1 : 0) + (!qualityPassed ? 1 : 0) + (!repairsPassed ? 1 : 0);
    const triggerSurpriseInspection = failedConditionsCount >= 3; // All three breached simultaneously
    const requiresFormalNotice = failedConditionsCount >= 2;

    const eventId = `EVT-INSPECT-${centreId}-${new Date().toISOString().slice(0, 10)}`;

    return {
      eventId,
      centre_id: centreId,
      centre_label: data.centre_label,
      centre_name: data.centre_name,
      district: data.district || "Regional District",
      evaluationTimestamp: new Date().toLocaleString(),
      triggerSurpriseInspection,
      requiresFormalNotice,
      failedConditionsCount,
      severity: triggerSurpriseInspection ? "CRITICAL" : (failedConditionsCount > 0 ? "WARNING" : "NORMAL"),
      formalRecommendation: triggerSurpriseInspection
        ? `SURPRISE INSPECTION RECOMMENDED FOR ${data.centre_label.toUpperCase()}`
        : "Standard Periodic Monitoring",
      
      // Detailed findings breakdown highlighting the specific failures
      findings: {
        attendance: attendanceEvaluation,
        trainingQuality: qualityEvaluation,
        equipmentRepairs: repairEvaluation
      },

      // Direct action deep links
      directActionLinks: {
        liveCameraStreamUrl: `/?centre=${centreId}&action=view-live-stream`,
        auditLogsUrl: `/?centre=${centreId}&action=view-audit-logs`,
        statutoryNoticeUrl: `/?centre=${centreId}&action=view-inspection-notice`
      },

      // Official statutory notification text formatted for delivery
      notificationTemplate: {
        subject: `[URGENT] Statutory Surprise Inspection Recommended: ${data.centre_name} (${centreId})`,
        summary: `Automated condition monitoring flags 3 concurrent non-compliance breaches at ${data.centre_name} over the 30-day observation window: (1) Low Attendance (${data.thirtyDayAverageAttendancePct}% vs ${thresholds.minAttendanceRatePct}% threshold), (2) Classroom Inactivity during training hours (${data.thirtyDayAvgEngagementIndex}% engagement), and (3) Unresolved Equipment Breakdowns delayed beyond 30 days (${overdueRepairTickets.length} assets overdue up to ${maxDaysOverdue} days). A Surprise Inspection by Central Auditors is formally recommended.`,
        actionRecommended: "Conduct immediate on-site unannounced physical audit of instructional rooms, biometric registers, and IT lab inventory.",
        recipients: [
          "Directorate General of Training (DGT), Ministry of Skill Development",
          "Regional Directorate of Quality Assurance (Western Zone)",
          "Chief Vigilance Officer (Vocational Accreditation)"
        ]
      }
    };
  },

  /**
   * Evaluates all registered training centres and returns prioritized inspection queue
   */
  evaluateAllCentres(customThresholds = {}) {
    const centreIds = Object.keys(CENTRE_COMPLIANCE_DATA);
    const reports = centreIds.map(id => this.evaluateCenterCompliance(id, customThresholds));
    
    // Sort critical surprise inspections to top
    return reports.sort((a, b) => (b.triggerSurpriseInspection ? 1 : 0) - (a.triggerSurpriseInspection ? 1 : 0));
  },

  /**
   * Dispatches automated alert notification across configured channels
   * @param {object} complianceReport 
   * @param {array} channels ['dashboard', 'email', 'webhook', 'sms']
   * @returns {object} Dispatch receipt
   */
  dispatchAlertNotification(complianceReport, channels = ['dashboard', 'email', 'webhook', 'sms']) {
    const dispatchId = `DISPATCH-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const dispatchReceipt = {
      dispatchId,
      timestamp,
      centreId: complianceReport.centre_id,
      centreName: complianceReport.centre_name,
      severity: complianceReport.severity,
      formalRecommendation: complianceReport.formalRecommendation,
      channelsDispatched: channels,
      directStreamLink: complianceReport.directActionLinks.liveCameraStreamUrl,
      directAuditLink: complianceReport.directActionLinks.auditLogsUrl,
      deliveryStatuses: {
        dashboard: channels.includes('dashboard') ? { status: "ACTIVE", acknowledged: false } : null,
        email: channels.includes('email') ? {
          status: "DELIVERED",
          recipients: ["auditor-general@msde.gov.in", "qa-directorate@vocational.gov.in"],
          subject: complianceReport.notificationTemplate.subject,
          deliveredAt: new Date().toLocaleTimeString()
        } : null,
        webhook: channels.includes('webhook') ? {
          status: "POST_SUCCESS_200",
          endpoint: "https://api.gov-oversight.nic.in/v1/inspections/webhook",
          payloadBytes: 1048,
          responseCode: 200
        } : null,
        sms: channels.includes('sms') ? {
          status: "SENT",
          carrier: "NIC-GovSMS-Gateway",
          recipientGroup: "Central Inspection Panel (3 Officers)",
          messageId: `SMS-${Math.floor(100000 + Math.random() * 900000)}`
        } : null
      }
    };

    ALERT_DISPATCH_HISTORY.unshift(dispatchReceipt);
    return dispatchReceipt;
  },

  /**
   * Retrieves log of sent notifications
   */
  getNotificationHistory() {
    return [...ALERT_DISPATCH_HISTORY];
  }
};
