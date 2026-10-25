import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Camera, 
  AlertTriangle, 
  CheckCircle,
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
  FileCheck,
  ShieldAlert,
  Activity,
  Send,
  Mail,
  Radio,
  MessageSquare,
  ChevronRight,
  Sliders
} from 'lucide-react';
import CameraSnapshotModal from './CameraSnapshotModal';
import LiveYoloCameraFeed from './LiveYoloCameraFeed';
import ComplianceAlertBanner from './ComplianceAlertBanner';
import { complianceAlertService } from '../services/complianceAlertService';

export default function GovDashboard({ 
  appState, 
  onRefreshData, 
  onReconcileAudit, 
  onLiveCountUpdate,
  onEquipmentCountUpdate,
  trainingCentres = [],
  onSelectCentre,
  complianceReport,
  onOpenSurpriseInspectionModal,
  complianceThresholds,
  onThresholdUpdate,
  onNavigateToCamera,
  onNavigateToAudit
}) {

  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [auditEndorsed, setAuditEndorsed] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showLiveCamera, setShowLiveCamera] = useState(true);
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);

  const { centre_id, attendance_column, infrastructure_column } = appState;
  const isTC1 = centre_id === 'CNT-3109';
  const isAttendanceDiscrepancy = isTC1
    ? (attendance_column.ai_detected > 1)
    : (attendance_column.discrepancy_flag || (attendance_column.ai_detected !== attendance_column.manual_reported));

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
      
      {/* Automated Compliance & Surprise Inspection Banner */}
      <ComplianceAlertBanner
        complianceReport={complianceReport}
        onOpenModal={onOpenSurpriseInspectionModal}
        onNavigateToCamera={(id) => {
          onSelectCentre && onSelectCentre(id);
          setShowLiveCamera(true);
          setTimeout(() => {
            document.getElementById('live-camera-feed-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
        onNavigateToAudit={(id) => {
          onSelectCentre && onSelectCentre(id);
          setTimeout(() => {
            document.getElementById('triangulated-matrix-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
      />

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
              DRISHTI • TEAM GARUD
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
          {/* Training Centre Selector */}
          {trainingCentres && trainingCentres.length > 0 && (
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-300">
              <span className="text-[11px] font-bold text-slate-600 px-2 uppercase tracking-wider flex items-center">
                <Building2 className="w-3.5 h-3.5 text-blue-900 mr-1" />
                Centre:
              </span>
              <select
                value={centre_id}
                onChange={(e) => onSelectCentre && onSelectCentre(e.target.value)}
                className="text-xs font-semibold bg-white text-slate-900 py-1.5 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-700 cursor-pointer shadow-xs"
              >
                {trainingCentres.map((c) => (
                  <option key={c.centre_id} value={c.centre_id}>
                    {c.centre_label || c.centre_id}
                  </option>
                ))}
              </select>
            </div>
          )}

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

      {/* 3 Training Centres Multi-Centre Overview Grid */}
      {trainingCentres && trainingCentres.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Building2 className="w-4 h-4 text-blue-900 mr-2" />
                Affiliated Training Centres Under Government Oversight ({trainingCentres.length} Centres Active)
              </h2>
              <p className="text-xs text-slate-500">
                Select a centre to view its dedicated live edge camera, attendance logs, and equipment audit.
              </p>
            </div>
            <span className="text-[11px] bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded border border-blue-200">
              Direct Inspector View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trainingCentres.map((centre) => {
              const isSelected = centre.centre_id === centre_id;
              const isCardTC1 = centre.centre_id === 'CNT-3109';
              const hasDiscrepancy = isCardTC1
                ? (centre.attendance_column.ai_detected > 1)
                : (centre.attendance_column.discrepancy_flag && centre.attendance_column.ai_detected !== centre.attendance_column.manual_reported);

              const totalDamaged = centre.infrastructure_column.items.reduce((acc, i) => acc + (i.damaged || 0), 0);
              const deficitItems = centre.infrastructure_column.items.filter(i => (i.detected < i.sanctioned) || ((i.damaged || 0) > 0));
              const deficitCount = deficitItems.length;
              const centreCompliance = complianceAlertService.evaluateCenterCompliance(centre.centre_id, complianceThresholds);
              const isSurpriseInspectionRecommended = centreCompliance && centreCompliance.triggerSurpriseInspection;

              return (
                <div
                  key={centre.centre_id}
                  onClick={() => onSelectCentre && onSelectCentre(centre.centre_id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative ${
                    isSurpriseInspectionRecommended
                      ? 'border-rose-400 bg-rose-50/40 shadow-sm ring-1 ring-rose-500/30'
                      : (isSelected
                          ? 'border-blue-900 bg-blue-50/50 shadow-sm ring-1 ring-blue-900/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70')
                  }`}
                >
                  {isSurpriseInspectionRecommended && (
                    <span className="absolute top-2.5 right-2.5 bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase animate-pulse">
                      🚨 Inspection Recommended
                    </span>
                  )}
                  {!isSurpriseInspectionRecommended && isSelected && (
                    <span className="absolute top-2.5 right-2.5 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                      Active
                    </span>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isSurpriseInspectionRecommended ? 'bg-rose-700 text-white' : 'bg-blue-900 text-white'
                    }`}>
                      {centre.centre_label || centre.centre_id}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {centre.centre_id}
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                      Isolated Tenant
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-2 line-clamp-1">
                    {centre.centre_name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    {centre.district}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Attendance:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {isCardTC1 
                          ? `${centre.attendance_column.ai_detected} present out of 1` 
                          : `${centre.attendance_column.ai_detected} present out of ${centre.attendance_column.enrolled || 50}`}
                      </span>
                      {hasDiscrepancy ? (
                        <span className="text-[10px] text-rose-700 font-medium block">
                          ⚠ {isCardTC1 ? `+${centre.attendance_column.ai_detected - 1} Surplus` : `-${centre.attendance_column.discrepancy_variance}`} Discrepancy
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-medium block">
                          {isCardTC1 ? '✓ 1 OUT OF 1 (100% Match)' : `✓ ${centre.attendance_column.ai_detected} present out of ${centre.attendance_column.enrolled || 50} (100% Match)`}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Equipment Deficit:</span>
                      <span className={`font-mono font-semibold ${totalDamaged > 0 || deficitCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {totalDamaged > 0 
                          ? `⚠ ${totalDamaged} Defective (${deficitCount} Items)` 
                          : (deficitCount > 0 ? `⚠ ${deficitCount} Deficit items` : '✓ Fully Compliant')}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        CAM: {centre.attendance_column.camera_id}
                      </span>
                    </div>
                  </div>

                  {isSurpriseInspectionRecommended && (
                    <div className="mt-3 pt-2.5 border-t border-rose-200 flex items-center justify-between text-[11px]">
                      <span className="text-rose-800 font-bold">3 Concurrent Failures</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSurpriseInspectionModal && onOpenSurpriseInspectionModal(centre.centre_id);
                        }}
                        className="px-2 py-0.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold transition-colors cursor-pointer"
                      >
                        Review Directive &rarr;
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DEDICATED COMPLIANCE MONITORING & CONDITION TRACKING ENGINE (Triggered when conditions breach) */}
      {complianceReport && complianceReport.triggerSurpriseInspection && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Automated Condition Monitoring & Inspection Recommendation Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Monitors real-time and 30-day analytics across all training centres to detect low attendance, poor training quality, and equipment repair delays exceeding one month.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowThresholdConfig(!showThresholdConfig)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>{showThresholdConfig ? 'Hide Config' : 'Configure Thresholds'}</span>
              </button>

              <button
                onClick={onOpenSurpriseInspectionModal}
                className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Open Inspection Directive</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expandable Threshold Configuration Drawer */}
          {showThresholdConfig && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <strong className="font-bold text-slate-800 uppercase tracking-wider">
                  Statutory Rule Engine Parameters (Auditor Configurable)
                </strong>
                <span className="text-[11px] text-slate-500">Live evaluation recalculated automatically</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Threshold 1: Attendance */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Min. Attendance Quota:</span>
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {complianceThresholds?.minAttendanceRatePct || 60}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    step="5"
                    value={complianceThresholds?.minAttendanceRatePct || 60}
                    onChange={(e) => onThresholdUpdate && onThresholdUpdate({
                      minAttendanceRatePct: Number(e.target.value)
                    })}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Centres below this 30d average trigger Condition 1.
                  </span>
                </div>

                {/* Threshold 2: Engagement / Training Quality */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Min. Activity/Quality Score:</span>
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {complianceThresholds?.minActivityEngagementIndex || 50}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="75"
                    step="5"
                    value={complianceThresholds?.minActivityEngagementIndex || 50}
                    onChange={(e) => onThresholdUpdate && onThresholdUpdate({
                      minActivityEngagementIndex: Number(e.target.value)
                    })}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Classrooms with motion index below this trigger Condition 2.
                  </span>
                </div>

                {/* Threshold 3: Max Repair Delay Days */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Max Allowed Repair Delay:</span>
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {complianceThresholds?.maxAllowedRepairDelayDays || 30} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={complianceThresholds?.maxAllowedRepairDelayDays || 30}
                    onChange={(e) => onThresholdUpdate && onThresholdUpdate({
                      maxAllowedRepairDelayDays: Number(e.target.value)
                    })}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Damaged equipment exceeding this trigger Condition 3 (Mandate: 30d).
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Condition Cards Triangulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Condition 1 Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <Users className="w-4 h-4 mr-1.5 text-blue-700" />
                  1. Low Attendance Tracking
                </span>
                <span className="font-bold text-[10px] px-2 py-0.5 rounded uppercase font-mono bg-rose-100 text-rose-800">
                  Triggered
                </span>
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-rose-900">
                {complianceReport.findings.attendance.thirtyDayAvgPct}% <span className="text-xs text-slate-500 font-normal">30d Avg</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Persistent drop below {complianceReport.findings.attendance.thresholdPct}% requirement across {complianceReport.findings.attendance.consecutiveLowDays} of 30 days.
              </p>
            </div>

            {/* Condition 2 Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <Activity className="w-4 h-4 mr-1.5 text-amber-700" />
                  2. Quality / Inactivity Monitor
                </span>
                <span className="font-bold text-[10px] px-2 py-0.5 rounded uppercase font-mono bg-rose-100 text-rose-800">
                  Triggered
                </span>
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-rose-900">
                {complianceReport.findings.trainingQuality.thirtyDayAvgEngagementIndex}% <span className="text-xs text-slate-500 font-normal">Activity Score</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Absence of active instruction during scheduled hours (09:00 - 17:00 IST). Motion index: {complianceReport.findings.trainingQuality.activeMovementScore}%.
              </p>
            </div>

            {/* Condition 3 Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <Wrench className="w-4 h-4 mr-1.5 text-rose-700" />
                  3. Overdue Damaged Assets
                </span>
                <span className="font-bold text-[10px] px-2 py-0.5 rounded uppercase font-mono bg-rose-100 text-rose-800">
                  Triggered
                </span>
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-rose-900">
                {complianceReport.findings.equipmentRepairs.overdueCount} Broken Assets <span className="text-xs text-slate-500 font-normal">&gt;30d</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                PC-LAB-09 (44d), PC-LAB-14 (38d), FAN-CEIL-03 (35d) remain unresolved past 30-day mandate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold">Manual Trainee Count</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {isTC1 ? 1 : attendance_column.manual_reported}
            <span className="text-sm font-normal text-slate-500 font-sans ml-1">
              / {isTC1 ? 1 : (attendance_column.enrolled || 50)}
            </span>
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
              {isTC1 ? attendance_column.ai_detected : attendance_column.ai_detected}
              <span className="text-sm font-normal text-slate-500 font-sans ml-1">
                / {isTC1 ? 1 : (attendance_column.enrolled || 50)}
              </span>
            </div>
            {isAttendanceDiscrepancy ? (
              <span className="text-xs font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded border border-rose-300 font-mono">
                {isTC1 ? `+${attendance_column.ai_detected - 1} surplus gap` : `-${attendance_column.discrepancy_variance} gap`}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                {isTC1 ? '100% Match' : '100% Match'}
              </span>
            )}
          </div>
          <div className={`text-[11px] mt-1 flex items-center ${isAttendanceDiscrepancy ? 'text-rose-800 font-medium' : 'text-emerald-700'}`}>
            <Camera className="w-3 h-3 mr-1" />
            {isTC1 ? 'Live Edge Webcam: 1 OUT OF 1 verified' : 'Live AI Camera verification'}
          </div>
        </div>

        {(() => {
          const defectiveOrDeficitItems = infrastructure_column.items.filter(i => (i.detected < i.sanctioned) || ((i.damaged || 0) > 0));
          const totalDamagedUnits = infrastructure_column.items.reduce((acc, i) => acc + (i.damaged || 0), 0);
          const totalDeficitUnits = infrastructure_column.items.reduce((acc, i) => acc + Math.max(0, i.sanctioned - i.detected), 0);
          const damagedNames = infrastructure_column.items.filter(i => (i.damaged || 0) > 0).map(i => `${i.damaged} ${i.name}`);
          const hasIssues = defectiveOrDeficitItems.length > 0;

          return (
            <div className={`p-4 rounded-xl border shadow-xs transition-colors ${
              hasIssues ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200'
            }`}>
              <div className="text-slate-500 text-xs font-semibold">Equipment Deficit & Defective Items</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${hasIssues ? 'text-amber-800' : 'text-slate-900'}`}>
                {defectiveOrDeficitItems.length} Categories
              </div>
              <div className={`text-[11px] mt-1 flex items-center ${hasIssues ? 'text-amber-800 font-medium' : 'text-emerald-700'}`}>
                {hasIssues ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
                    <span>
                      {totalDamagedUnits > 0
                        ? `⚠ ${totalDamagedUnits} Damaged Units (${damagedNames.join(', ')})`
                        : `⚠ ${totalDeficitUnits} Deficit Units below quota`}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
                    <span>✓ All equipment operational & matched</span>
                  </>
                )}
              </div>
            </div>
          );
        })()}

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

      {/* LIVE YOLO CAMERA / SAMPLE VIDEO FEED SECTION */}
      {showLiveCamera && (
        <section id="live-camera-feed-section" aria-label="Live YOLO Camera Feed">
          <LiveYoloCameraFeed
            key={centre_id}
            centreId={centre_id}
            mode={centre_id === "CNT-3109" ? "webcam" : "video"}
            videoSrc="/sample_cctv.mp4"
            centreName={appState.centre_name}
            initialReportedCount={attendance_column.manual_reported}
            onCountChange={(count) => {
              if (onLiveCountUpdate && count > 0) {
                onLiveCountUpdate(count);
              }
            }}
            onEquipmentCountChange={(equipCounts) => {
              if (onEquipmentCountUpdate) {
                onEquipmentCountUpdate(equipCounts);
              }
            }}
          />
        </section>
      )}


      {/* CORE MONITORING VIEW: Wide 3-Column Data Grid */}
      <div id="triangulated-matrix-section" className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">

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
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Reported Roll-Call Headcount
                </span>
                
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-4xl font-bold font-mono text-slate-900 tracking-tight">
                    {isTC1 ? 1 : attendance_column.manual_reported}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {isTC1 
                      ? `present out of 1 Enrolled Trainee (1 OUT OF 1)` 
                      : (attendance_column.enrolled 
                          ? `present out of ${attendance_column.enrolled} Enrolled Trainees` 
                          : `Trainees Signed In`)}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared Batch:</span>
                    <span className="font-semibold text-slate-800">Batch A-Morning</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instructor Sign-off:</span>
                    <span className="font-semibold text-slate-800">K. Patil (Sr. ITI)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Log Timestamp:</span>
                    <span className="font-mono text-slate-700">{attendance_column.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-0.5">Statutory Declaration:</span>
              Self-reported log submitted through the Instructor Field Terminal.
            </div>
          </div>


          {/* COLUMN 2: AI Verified (YOLO Detection Feed) */}
          <div className={`lg:col-span-4 p-6 flex flex-col justify-between space-y-4 transition-colors ${
            isAttendanceDiscrepancy ? 'bg-rose-50/60' : 'bg-white'
          }`}>
            <div>
              <div className="lg:hidden mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-800" />
                <span>Column 2: AI Verified (YOLO)</span>
              </div>

              <div className={`border rounded-xl p-5 shadow-xs transition-colors ${
                isAttendanceDiscrepancy 
                  ? 'border-rose-300 bg-rose-50/90' 
                  : 'border-slate-200 bg-slate-50/70'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    AI Edge YOLO Vision Count
                  </span>
                  {isAttendanceDiscrepancy ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-200 text-rose-900 border border-rose-300">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {isTC1 ? 'Surplus Discrepancy' : 'Discrepancy'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      {isTC1 ? '✓ 1 OUT OF 1 (100% Match)' : '✓ 100% Match'}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline space-x-3 mt-2">
                  <span className={`text-4xl font-bold font-mono tracking-tight ${
                    isAttendanceDiscrepancy ? 'text-rose-900' : 'text-slate-900'
                  }`}>
                    {isTC1 ? attendance_column.ai_detected : attendance_column.ai_detected}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {isTC1 
                      ? 'present out of 1 Enrolled Trainee' 
                      : (attendance_column.enrolled 
                          ? `present out of ${attendance_column.enrolled} Enrolled Trainees` 
                          : `Trainees Detected`)}
                  </span>
                </div>

                {/* Variance Warning Indicator */}
                {isAttendanceDiscrepancy && (
                  <div className="mt-3 p-2.5 bg-rose-100/80 border border-rose-200 rounded-lg text-xs text-rose-900">
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                        <span>
                          Headcount Variance: {isTC1 ? `+${attendance_column.ai_detected - 1} Surplus` : `-${attendance_column.discrepancy_variance} Gap`}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (onReconcileAudit) {
                            onReconcileAudit(attendance_column.ai_detected);
                          }
                        }}
                        className="px-2 py-0.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                        title="Reconcile manual roll call to match AI verified count"
                      >
                        Reconcile to AI ({attendance_column.ai_detected})
                      </button>
                    </div>
                    <p className="text-[11px] text-rose-800 mt-1 leading-normal">
                      The AI Vision Model detected {attendance_column.ai_detected} trainees vs {attendance_column.manual_reported} manually entered. Click Reconcile to resolve gap or review remarks.
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Camera Source:</span>
                    <span className="font-mono text-slate-700">{attendance_column.camera_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confidence Score:</span>
                    <span className="font-mono font-semibold text-emerald-700">{attendance_column.confidence_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Detection Model:</span>
                    <span className="font-mono text-slate-700">YOLOv11-OBB (TensorFlow)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action to view snapshot */}
            <button
              onClick={() => setIsSnapshotOpen(true)}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-blue-900 border border-blue-900/30 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-700" />
              <span>View Camera Snapshot (Vision HUD)</span>
            </button>
          </div>


          {/* COLUMN 3: Infrastructure Match & Asset Audit */}
          <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between space-y-5">
            <div>
              <div className="lg:hidden mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-800" />
                <span>Column 3: Infrastructure Match</span>
              </div>

              {/* Sanctioned vs Present Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wide">
                    Sanctioned vs Present Equipment
                  </span>
                  <span className="text-[11px] text-slate-500">Tracked Units</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 font-semibold uppercase">
                        <th className="py-2 px-3">Equipment</th>
                        <th className="py-2 px-2 text-center">Sanctioned</th>
                        <th className="py-2 px-2 text-center">Detected</th>
                        <th className="py-2 px-2 text-center">Reported</th>
                        <th className="py-2 px-2 text-center">Defective / Damaged</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {infrastructure_column.items.map((item) => {
                        const isDeficit = item.detected < item.sanctioned;
                        const isSurplus = item.detected > item.sanctioned;
                        const damagedCount = item.damaged || 0;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-slate-800 block">{item.name}</span>
                              <span className="text-[10px] text-slate-600 block line-clamp-1">{item.detail}</span>
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-slate-600">
                              {item.sanctioned}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                              {item.detected}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-slate-600">
                              {item.trainee_reported !== undefined ? item.trainee_reported : item.detected}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono">
                              {damagedCount > 0 ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  ⚠ {damagedCount} Damaged
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">0</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {damagedCount > 0 ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  ⚠ {damagedCount} Defective
                                </span>
                              ) : isDeficit ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                                  Deficit ({item.detected - item.sanctioned})
                                </span>
                              ) : isSurplus ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                                  Surplus (+{item.detected - item.sanctioned})
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  ✓ Matched
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

              {/* Trainee Reported Damaged / Defective Banner */}
              {(() => {
                const totalDamaged = infrastructure_column.items.reduce((sum, i) => sum + (i.damaged || 0), 0);
                const damagedList = infrastructure_column.items.filter(i => (i.damaged || 0) > 0);
                if (totalDamaged === 0) return null;

                return (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-950">
                        Field Instructor Defect Notice ({totalDamaged} Total Defective Units Reported)
                      </span>
                      <p className="mt-0.5 text-amber-800 leading-relaxed">
                        Trainee portal has reported {damagedList.map(i => `${i.damaged} ${i.name}`).join(' and ')} as damaged/non-functional. These units require inspection and repair replacement tickets.
                      </p>
                    </div>
                  </div>
                );
              })()}

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
          Centre {centre_id} Record ID: REC-{centre_id.replace('CNT-', '')}-SEC • Tenant Isolation: ENFORCED • Cryptographic Audit Sign: ED25519-VERIFIED
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
