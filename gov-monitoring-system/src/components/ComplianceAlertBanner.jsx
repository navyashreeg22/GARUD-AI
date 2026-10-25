import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, Camera, FileText, Send, X, ExternalLink } from 'lucide-react';

export default function ComplianceAlertBanner({
  complianceReport,
  onOpenModal,
  onNavigateToCamera,
  onNavigateToAudit
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!complianceReport || !complianceReport.triggerSurpriseInspection || isDismissed) {
    if (isDismissed && complianceReport?.triggerSurpriseInspection) {
      return (
        <div className="flex items-center justify-between bg-rose-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <span>Critical Compliance Alert Active for {complianceReport.centre_label}</span>
          </div>
          <button 
            onClick={() => setIsDismissed(false)}
            className="text-xs bg-rose-800 hover:bg-rose-700 px-2.5 py-1 rounded cursor-pointer transition-colors"
          >
            Show Alert Details
          </button>
        </div>
      );
    }
    return null;
  }

  const { centre_id, centre_label, findings } = complianceReport;
  const { attendance, trainingQuality, equipmentRepairs } = findings;

  return (
    <div className="bg-rose-950/95 border-2 border-rose-500 rounded-xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden animate-fade-in">
      {/* Background visual motif */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-rose-800/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left column: Warning identity and description */}
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shrink-0 mt-0.5 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider shadow-xs">
                🚨 SURPRISE INSPECTION RECOMMENDED
              </span>
              <span className="text-xs font-mono font-bold text-rose-300">
                {centre_label} ({centre_id})
              </span>
              <span className="text-[11px] text-rose-300/80">
                • 30-Day Automated Condition Monitor
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-rose-100 mt-1.5 leading-snug">
              Persistent triple-breach detected: <span className="text-white underline decoration-rose-400">Attendance dropped to {attendance.thirtyDayAvgPct}%</span> (vs {attendance.thresholdPct}% quota), <span className="text-white underline decoration-rose-400">Classroom Inactivity index at {trainingQuality.thirtyDayAvgEngagementIndex}%</span> (dormant motion during training hours), and <span className="text-white underline decoration-rose-400">{equipmentRepairs.overdueCount} broken assets unaddressed for &gt; 30 days</span> (up to {equipmentRepairs.maxDaysOverdue}d overdue).
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-rose-200">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
                Attendance: <strong>{attendance.thirtyDayAvgPct}%</strong> (Failed)
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
                Engagement: <strong>{trainingQuality.thirtyDayAvgEngagementIndex}%</strong> (Failed)
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
                Overdue Repairs: <strong>{equipmentRepairs.overdueCount} Items &gt; 30d</strong> (Failed)
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Action Links and Modal trigger */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-rose-900/60">
          <button
            onClick={() => onNavigateToCamera && onNavigateToCamera(centre_id)}
            className="px-3 py-2 bg-rose-900/80 hover:bg-rose-800 text-rose-100 hover:text-white border border-rose-700 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Direct Link: View Live Edge Monitoring Stream"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Direct Link: Live Stream</span>
          </button>

          <button
            onClick={() => onNavigateToAudit && onNavigateToAudit(centre_id)}
            className="px-3 py-2 bg-rose-900/80 hover:bg-rose-800 text-rose-100 hover:text-white border border-rose-700 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Direct Link: View Audit Logs & Equipment Register"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Direct Link: Audit Logs</span>
          </button>

          <button
            onClick={onOpenModal}
            className="px-4 py-2 bg-white text-rose-950 hover:bg-rose-100 rounded-lg text-xs font-black shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>Review Recommendation</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-rose-400 hover:text-white hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
            title="Dismiss notification banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
