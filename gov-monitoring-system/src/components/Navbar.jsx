import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  LogOut, 
  UserCheck, 
  FileSpreadsheet, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Bell,
  ShieldAlert,
  Camera,
  FileText
} from 'lucide-react';

export default function Navbar({ 
  currentRoute, 
  setCurrentRoute, 
  userRole, 
  setUserRole, 
  userEmail,
  complianceAlertReport,
  onOpenSurpriseInspectionModal,
  onNavigateToCamera,
  onNavigateToAudit
}) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    setUserRole(null);
    setCurrentRoute('/');
  };

  const hasCriticalAlert = complianceAlertReport && complianceAlertReport.triggerSurpriseInspection;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top institutional strip */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex justify-between items-center tracking-wide">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-300">GOVERNMENT DIRECT MONITORING PORTAL</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">National Directorate of Vocational Training</span>
        </div>
        <div className="flex items-center space-x-4 text-slate-400">
          <span>Official Session ID: <strong className="text-slate-200 font-mono">SEC-2026-9921</strong></span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">NIC Compliant</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Emblem Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentRoute('/')}>
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-950">
              <Building2 className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">DRISHTI</span>
                <span className="text-xs bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-300 uppercase tracking-wider">
                  TEAM Garud
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none">Government Training Centre Monitoring System</p>
            </div>
          </div>

          {/* Navigation & Active Role Info */}
          <div className="flex items-center space-x-3">
            {userRole ? (
              <>
                <nav className="flex items-center mr-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
                  {userRole === 'trainee' && (
                    <div className="px-3 py-1.5 rounded-md bg-white text-blue-900 shadow-xs font-semibold flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Trainee Portal (Restricted to Instructor)</span>
                    </div>
                  )}
                  {userRole === 'gov' && (
                    <div className="px-3 py-1.5 rounded-md bg-white text-blue-900 shadow-xs font-semibold flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Gov Oversight Dashboard (Restricted to Auditor)</span>
                    </div>
                  )}
                </nav>

                {/* Government Official Alert Notification Bell */}
                {userRole === 'gov' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                        hasCriticalAlert 
                          ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Inspection Alerts & Compliance Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {hasCriticalAlert && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                          1
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown Panel */}
                    {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center space-x-2">
                            <ShieldAlert className="w-4 h-4 text-rose-700" />
                            <strong className="font-bold text-slate-900 text-xs">Compliance Alerts</strong>
                          </div>
                          <span className="bg-rose-100 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            1 Action Required
                          </span>
                        </div>

                        {hasCriticalAlert ? (
                          <div className="mt-3 p-3 bg-rose-50/80 border border-rose-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] bg-rose-700 text-white px-2 py-0.5 rounded font-black uppercase">
                                Surprise Inspection Recommended
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Today</span>
                            </div>
                            <h4 className="font-bold text-slate-900 mt-2">
                              {complianceAlertReport.centre_label} ({complianceAlertReport.centre_id})
                            </h4>
                            <p className="text-[11px] text-slate-700 mt-1 leading-snug">
                              Persistent 3-condition breach over 30-day window: Low Attendance ({complianceAlertReport.findings.attendance.thirtyDayAvgPct}%), Classroom Inactivity ({complianceAlertReport.findings.trainingQuality.thirtyDayAvgEngagementIndex}%), and 3 Damaged Assets Unrepaired &gt;30 Days.
                            </p>

                            <div className="mt-3 pt-2 border-t border-rose-200 flex flex-wrap gap-1.5">
                              <button
                                onClick={() => {
                                  setIsNotificationsOpen(false);
                                  onOpenSurpriseInspectionModal && onOpenSurpriseInspectionModal();
                                }}
                                className="px-2.5 py-1 bg-rose-900 text-white hover:bg-rose-950 rounded text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Review Notice
                              </button>
                              <button
                                onClick={() => {
                                  setIsNotificationsOpen(false);
                                  onNavigateToCamera && onNavigateToCamera(complianceAlertReport.centre_id);
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <Camera className="w-3 h-3 text-blue-700" />
                                <span>Live Stream</span>
                              </button>
                              <button
                                onClick={() => {
                                  setIsNotificationsOpen(false);
                                  onNavigateToAudit && onNavigateToAudit(complianceAlertReport.centre_id);
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <FileText className="w-3 h-3 text-slate-700" />
                                <span>Audit Logs</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 text-center text-slate-500 text-xs">
                            No critical inspection alerts active. All centres compliant.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="hidden md:flex items-center pl-3 border-l border-slate-200 text-xs">
                  <div className="text-right mr-3">
                    <p className="font-semibold text-slate-800">
                      {userEmail || (userRole === 'gov' ? 'Shri R. Sharma (Director, QA)' : 'M. Verma (Centre Instructor)')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {userRole === 'gov' ? 'Authorised Inspector (NIC Verified)' : 'Centre In-Charge - Training Centre 2 (Center 8472)'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md transition-colors cursor-pointer"
                    title="Log out and switch role"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Ready to Authenticate
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
