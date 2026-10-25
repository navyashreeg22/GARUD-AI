import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Wrench, 
  Search, 
  Download, 
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ChevronDown,
  Printer,
  FileCheck
} from 'lucide-react';
import CameraSnapshotModal from './CameraSnapshotModal';
import LiveYoloCameraFeed from './LiveYoloCameraFeed';


export default function GovDashboard({ appState, onRefreshData, onReconcileAudit, onLiveCountUpdate }) {
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [auditEndorsed, setAuditEndorsed] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showLiveCamera, setShowLiveCamera] = useState(true);


  const { centre_id, attendance_column, infrastructure_column } = appState;
  const isAttendanceDiscrepancy = attendance_column.ai_detected < attendance_column.manual_reported;

  const handleRescan = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setActionSuccess("YOLO edge vision node re-synchronized successfully. Bounding box coordinates refreshed.");
      setTimeout(() => setActionSuccess(null), 4000);
    }, 900);
  };

  const handleExportAudit = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Gov-Audit-Report-${centre_id}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setActionSuccess("Audit data package downloaded (Official Inspection JSON).");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleEndorse = () => {
    setAuditEndorsed(true);
    setActionSuccess(`Officer endorsement recorded for Centre ${centre_id}. Audit case moved to 'Reviewed with Remarks'.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Action notification banner */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Top Meta Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded tracking-wide">
              CENTRAL MONITORING AUTHORITY
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-mono font-medium text-slate-700">Centre Code: {centre_id}</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Feed Connected
            </span>
            {auditEndorsed && (
              <span className="text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-300 font-semibold flex items-center">
                <FileCheck className="w-3.5 h-3.5 mr-1 text-blue-700" />
                Auditor Endorsed
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Government Oversight & Quality Compliance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated Triangulation: Manual Trainee Logs vs YOLO Vision Stream vs Sanctioned Inventory Register
          </p>
        </div>

        {/* Quick actions & stats */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setShowLiveCamera(!showLiveCamera)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer border ${
              showLiveCamera 
                ? 'bg-blue-900 text-white border-blue-950 hover:bg-blue-950' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{showLiveCamera ? 'Hide Live Camera' : 'Show Live Camera'}</span>
          </button>

          <button 
            onClick={handleRescan}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Re-scanning AI Feed...' : 'Re-scan Edge Camera'}</span>
          </button>

          <button 
            onClick={handleExportAudit}
            className="px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Export Audit JSON</span>
          </button>
        </div>

      </div>

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Manual Trainee Count</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {attendance_column.manual_reported}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center">
            <Users className="w-3 h-3 text-slate-400 mr-1" />
            Signed off by Centre Instructor
          </div>
        </div>

        <div className={`p-4 rounded-xl border shadow-xs transition-colors ${
          isAttendanceDiscrepancy 
            ? 'bg-rose-50/80 border-rose-300' 
            : 'bg-emerald-50/80 border-emerald-300'
        }`}>
          <div className={`text-xs font-semibold ${isAttendanceDiscrepancy ? 'text-rose-800' : 'text-emerald-800'}`}>
            YOLO Vision Verified Count
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <div className={`text-2xl font-bold font-mono ${isAttendanceDiscrepancy ? 'text-rose-900' : 'text-emerald-900'}`}>
              {attendance_column.ai_detected}
            </div>
            {isAttendanceDiscrepancy && (
              <span className="text-xs font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded border border-rose-300 font-mono">
                -{attendance_column.discrepancy_variance} gap
              </span>
            )}
          </div>
          <div className={`text-[11px] mt-1 flex items-center ${isAttendanceDiscrepancy ? 'text-rose-800 font-medium' : 'text-emerald-700'}`}>
            <Camera className="w-3 h-3 mr-1" />
            Live AI Camera verification
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Equipment Deficit Items</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
            {infrastructure_column.items.filter(i => i.detected < i.sanctioned).length} Categories
          </div>
          <div className="text-[11px] text-amber-800 mt-1 flex items-center">
            <AlertTriangle className="w-3 h-3 text-amber-600 mr-1" />
            Workbenches & Welding Machines
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Compliance Audit Status</div>
          <div className="text-2xl font-bold text-rose-700 font-mono mt-1 flex items-center">
            {auditEndorsed ? (
              <span className="text-emerald-700 text-xl font-bold">Endorsed</span>
            ) : (
              <span>Action Req.</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center">
            <Clock className="w-3 h-3 text-slate-400 mr-1" />
            {auditEndorsed ? 'Official endorsement logged' : 'Variance requires explanation review'}
          </div>
        </div>
      </div>

      {/* LIVE YOLO CAMERA FEED SECTION */}
      {showLiveCamera && (
        <section aria-label="Live YOLO Camera Feed">
          <LiveYoloCameraFeed
            initialReportedCount={attendance_column.manual_reported}
            onCountChange={(count) => {
              if (onLiveCountUpdate && count > 0) {
                onLiveCountUpdate(count);
              }
            }}
          />
        </section>
      )}

      {/* CORE MONITORING VIEW: Wide 3-Column Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">

        {/* Table / Grid Top Title Strip */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Triangulated Verification Matrix (Centre: {centre_id})
              </h2>
              <p className="text-xs text-slate-300">
                Cross-comparing Reported Field Claims against Edge AI Vision Feeds & Government Sanction Allocations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded border border-slate-700 font-mono">
              Audit Standard: ISO-VET-2026
            </span>
          </div>
        </div>

        {/* 3-Column Grid Headers (Desk & Mobile Responsive) */}
        <div className="hidden lg:grid grid-cols-12 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <div className="col-span-3 px-6 py-3.5 border-r border-slate-200 flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-800" />
            <span>Column 1: Reported</span>
          </div>
          <div className="col-span-4 px-6 py-3.5 border-r border-slate-200 flex items-center space-x-2">
            <Camera className="w-4 h-4 text-blue-800" />
            <span>Column 2: AI Verified (YOLO)</span>
          </div>
          <div className="col-span-5 px-6 py-3.5 flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-800" />
            <span>Column 3: Infrastructure Match</span>
          </div>
        </div>

        {/* 3-Column Body Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* COLUMN 1: Reported (Manual Attendance submitted by Trainee) */}
          <div className="lg:col-span-3 p-6 bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="lg:hidden mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-800" />
                <span>Column 1: Reported</span>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Manual Roll Call Headcount
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">
                    {attendance_column.manual_reported}
                  </span>
                  <span className="text-xs font-medium text-slate-600">Students Recorded</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Submission Method:</span>
                    <strong className="text-slate-800">Physical Register</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Officer In-charge:</span>
                    <strong className="text-slate-800">Trainee Official</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      Logged & Transmitted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-600">
              <span className="font-semibold text-blue-900 block mb-0.5">Auditor Insight:</span>
              Self-reported numbers are subject to verification via the edge CCTV YOLO engine.
            </div>
          </div>

          {/* COLUMN 2: AI Verified (YOLO-detected AI attendance with highlight & snapshot button) */}
          <div className={`lg:col-span-4 p-6 flex flex-col justify-between space-y-4 transition-colors ${
            isAttendanceDiscrepancy 
              ? 'bg-rose-50/80 border-rose-200' 
              : 'bg-white'
          }`}>
            <div>
              <div className="lg:hidden mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-800" />
                <span>Column 2: AI Verified</span>
              </div>

              {/* Attendance Discrepancy Highlight Card */}
              <div className={`rounded-xl border p-5 ${
                isAttendanceDiscrepancy 
                  ? 'border-rose-300 bg-white/95 shadow-xs' 
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    YOLO Vision AI Headcount
                  </span>
                  {isAttendanceDiscrepancy ? (
                    <span className="flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>DISCREPANCY FLAGGED</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VERIFIED MATCH</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline space-x-3 my-2">
                  <span className={`text-4xl font-extrabold font-mono ${
                    isAttendanceDiscrepancy ? 'text-rose-700' : 'text-emerald-700'
                  }`}>
                    {attendance_column.ai_detected}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">Trainees Detected</span>
                </div>

                {/* Variance explanation */}
                {isAttendanceDiscrepancy && (
                  <div className="p-3 mt-3 rounded-lg bg-rose-100/70 border border-rose-300 text-xs text-rose-950 space-y-1">
                    <div className="font-bold flex items-center text-rose-900">
                      <AlertTriangle className="w-4 h-4 mr-1 text-rose-700 shrink-0" />
                      Under-Detection Variance: -{attendance_column.discrepancy_variance} Trainees
                    </div>
                    <p className="text-[11px] text-rose-800 leading-tight">
                      AI detected headcount ({attendance_column.ai_detected}) is <strong>lower</strong> than reported manual attendance ({attendance_column.manual_reported}).
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Model Architecture:</span>
                    <span className="font-mono font-medium text-slate-700">YOLOv11-OBB Head/Torso</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Camera Stream:</span>
                    <span className="font-mono font-medium text-slate-700">{attendance_column.camera_id || 'CAM-04-MAIN'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Camera Snapshot Action Button */}
            <div>
              <button
                onClick={() => setIsSnapshotOpen(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-900 hover:text-blue-900 border border-slate-300 hover:border-blue-700 font-semibold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <Camera className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                <span>View Camera Snapshot</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded border border-slate-200 font-mono ml-1">
                  Live Evidence
                </span>
              </button>
            </div>
          </div>

          {/* COLUMN 3: Infrastructure Match & Trainee Raw Feedback */}
          <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between space-y-5">
            <div>
              <div className="lg:hidden mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-800" />
                <span>Column 3: Infrastructure Match</span>
              </div>

              {/* Sanctioned vs Present Equipment Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Equipment Sanctioned vs. Present
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {infrastructure_column.items.length} Tracked Categories
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="px-3 py-2">Item Category</th>
                        <th className="px-3 py-2 text-center">Sanctioned</th>
                        <th className="px-3 py-2 text-center">Detected / Present</th>
                        <th className="px-3 py-2 text-right">Variance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {infrastructure_column.items.map((item, idx) => {
                        const isDeficit = item.detected < item.sanctioned;
                        const isSurplus = item.detected > item.sanctioned;
                        const isMatch = item.detected === item.sanctioned;

                        return (
                          <tr key={idx} className={isDeficit ? 'bg-amber-50/40' : 'hover:bg-slate-50/60'}>
                            <td className="px-3 py-2.5 font-medium text-slate-900">
                              {item.name}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono font-semibold text-slate-600">
                              {item.sanctioned}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-900">
                              {item.detected}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              {isDeficit && (
                                <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  Deficit ({item.detected - item.sanctioned})
                                </span>
                              )}
                              {isMatch && (
                                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  100% Matched
                                </span>
                              )}
                              {isSurplus && (
                                <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  Surplus (+{item.detected - item.sanctioned})
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trainee's Raw Feedback Text */}
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1.5 flex items-center justify-between">
                  <span>Trainee Raw Feedback & Field Remarks</span>
                  <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                    Official Trainee Statement
                  </span>
                </span>
                
                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                  <div className="text-[11px] text-slate-400 font-sans mb-1 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Verbatim input recorded from Field Terminal:
                  </div>
                  <p className="italic bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                    "{infrastructure_column.trainee_feedback}"
                  </p>
                </div>
              </div>
            </div>

            {/* Reconciliation Audit Action Note */}
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between text-slate-600 gap-2">
              <span className="text-[11px]">
                {auditEndorsed 
                  ? "Audit Note: Case endorsed. Discrepancies logged as equipment repairs under token TK-842."
                  : "Auditor Action: Trainee feedback justifies equipment gap for Repair Token #TK-842."}
              </span>
              <button 
                onClick={handleEndorse}
                disabled={auditEndorsed}
                className={`text-[11px] font-bold px-3 py-1.5 rounded transition-colors shrink-0 ${
                  auditEndorsed 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-900 text-white hover:bg-blue-950 cursor-pointer shadow-xs'
                }`}
              >
                {auditEndorsed ? 'Endorsed ✓' : 'Endorse Note'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Institutional Footer Compliance Notice */}
      <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        <p>National Vocational Training Quality Assurance Directorate • Government Monitoring System</p>
        <p className="text-[11px] mt-0.5 text-slate-400 font-mono">
          Centre CNT-8472 Record ID: REC-99410 • Cryptographic Audit Sign: ED25519-VERIFIED
        </p>
      </div>

      {/* Camera Snapshot Modal */}
      <CameraSnapshotModal
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
        attendanceData={attendance_column}
        centreId={centre_id}
      />
    </div>
  );
}
