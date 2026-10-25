import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [centreCode, setCentreCode] = useState('CNT-8472');
  const [govEmpId, setGovEmpId] = useState('GOV-IND-0918');

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* National / Government Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 border-b-4 border-blue-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-blue-800/80 border border-blue-600/50 flex items-center justify-center text-white shadow-inner">
                <Building2 className="w-8 h-8 text-blue-200" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold block">
                  Ministry of Skill Development & Entrepreneurship
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Government Training Centre Monitoring System
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  Unified Automated Compliance & Real-Time Computer Vision Audit Framework
                </p>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700">
                Portal Build: v2.8-gov-prod
              </span>
            </div>
          </div>
        </div>

        {/* Notice alert */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-3 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              All activities, biometric reconciliations, and camera logs are cryptographically timestamped and audited under statutory guidelines.
            </span>
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-blue-700">SECURE LOGIN ENCLAVE</span>
        </div>

        {/* Login Role Selection Grid */}
        <div className="p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl font-bold text-slate-900">Select Access Authority</h2>
            <p className="text-sm text-slate-500 mt-1">
              Please choose your authorized administrative tier to proceed to your dedicated portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Trainee Official Card */}
            <div className="border-2 border-slate-200 hover:border-blue-700 rounded-xl p-6 transition-all bg-white hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors border border-blue-100">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-slate-900">Trainee Official</h3>
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200">
                    Field Level
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  For Centre Heads, Vocational Instructors, and designated lab in-charges.
                </p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-600 mb-6">
                  <div className="flex items-center text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                    Submit daily manual roll calls
                  </div>
                  <div className="flex items-center text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                    Audit machine and lab workbench status
                  </div>
                  <div className="flex items-center text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                    Report maintenance & ground discrepancies
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Default Centre Assigned
                  </label>
                  <input
                    type="text"
                    value={centreCode}
                    onChange={(e) => setCentreCode(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              <button
                onClick={() => onLogin('trainee')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-900 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 group-hover:translate-y-[-1px]"
              >
                <UserCheck className="w-4 h-4 text-blue-300" />
                <span>Login as Trainee Official</span>
              </button>
            </div>

            {/* Government Official Card */}
            <div className="border-2 border-slate-200 hover:border-blue-900 rounded-xl p-6 transition-all bg-white hover:shadow-md flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">
                AUDITOR VIEW
              </div>

              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-950 group-hover:text-blue-100 transition-colors border border-blue-200">
                  <ShieldCheck className="w-6 h-6 text-blue-800 group-hover:text-white" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-slate-900">Government Official</h3>
                  <span className="text-[11px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono border border-blue-200 font-semibold">
                    Supervisory Tier
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  For District Officers, State Quality Auditors, and Central Observers.
                </p>

                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 space-y-2 text-xs text-slate-600 mb-6">
                  <div className="flex items-center text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mr-1.5" />
                    Cross-compare Manual vs YOLO AI Vision counts
                  </div>
                  <div className="flex items-center text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mr-1.5" />
                    Real-time CCTV discrepancy flagging
                  </div>
                  <div className="flex items-center text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mr-1.5" />
                    Review sanctioned equipment reconciliation
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Auditor Credential Identifier
                  </label>
                  <input
                    type="text"
                    value={govEmpId}
                    onChange={(e) => setGovEmpId(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              <button
                onClick={() => onLogin('gov')}
                className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 group-hover:translate-y-[-1px]"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Login as Government Official</span>
              </button>
            </div>
          </div>

          {/* Institutional Help & Compliance Footer inside Card */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-slate-600">
                <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" /> 256-bit SSL Protected
              </span>
              <span>ISO 27001 Certified System</span>
            </div>
            <div className="flex items-center space-x-3">
              <a href="#help" className="hover:text-blue-900 underline text-slate-600">Helpdesk Guidelines</a>
              <span>•</span>
              <a href="#privacy" className="hover:text-blue-900 underline text-slate-600">Standard Operating Procedures (SOP)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
