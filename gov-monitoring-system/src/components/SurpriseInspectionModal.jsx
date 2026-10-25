import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Camera, 
  FileText, 
  Send, 
  Mail, 
  MessageSquare, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Users, 
  Activity, 
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  SlidersHorizontal,
  Building2
} from 'lucide-react';
import { complianceAlertService } from '../services/complianceAlertService';

export default function SurpriseInspectionModal({ 
  isOpen, 
  onClose, 
  complianceReport, 
  onNavigateToCamera, 
  onNavigateToAudit,
  onThresholdUpdate
}) {
  if (!isOpen || !complianceReport) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'trends' | 'repairs' | 'dispatch'
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState(null);
  const [orderIssued, setOrderIssued] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(['dashboard', 'email', 'webhook', 'sms']);

  const { findings, centre_id, centre_label, centre_name, district, directActionLinks } = complianceReport;
  const { attendance, trainingQuality, equipmentRepairs } = findings;

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const handleTriggerDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      const receipt = complianceAlertService.dispatchAlertNotification(complianceReport, selectedChannels);
      setDispatchReceipt(receipt);
      setIsDispatching(false);
    }, 800);
  };

  const handleIssueOrder = () => {
    setOrderIssued(true);
    if (!dispatchReceipt) {
      const receipt = complianceAlertService.dispatchAlertNotification(complianceReport, selectedChannels);
      setDispatchReceipt(receipt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Strip */}
        <div className="bg-rose-950 text-white px-6 py-4.5 flex items-center justify-between border-b border-rose-900 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-rose-900/80 text-rose-200 border border-rose-700 shadow-sm animate-pulse">
              <ShieldAlert className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-rose-900 text-rose-200 border border-rose-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  STATUTORY COMPLIANCE DIRECTIVE
                </span>
                <span className="text-xs text-rose-400 font-mono">
                  Event: {complianceReport.eventId}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Surprise Inspection Recommendation: {centre_label}
              </h2>
              <p className="text-xs text-rose-200/80 mt-0.5">
                {centre_name} • <span className="font-mono text-rose-300">{centre_id}</span> ({district})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-rose-300 hover:text-white p-2 rounded-lg hover:bg-rose-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex space-x-4 shrink-0 text-xs font-semibold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-rose-700 text-rose-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Violations Diagnostic (3 Conditions)</span>
          </button>

          <button
            onClick={() => setActiveTab('repairs')}
            className={`py-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
              activeTab === 'repairs'
                ? 'border-rose-700 text-rose-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Overdue Equipment Logs (30+ Days)</span>
            <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {equipmentRepairs.overdueCount} Overdue
            </span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`py-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
              activeTab === 'trends'
                ? 'border-rose-700 text-rose-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-blue-600" />
            <span>30-Day Historical Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`py-3 border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
              activeTab === 'dispatch'
                ? 'border-rose-700 text-rose-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Multi-Channel Dispatch (Email / SMS / Webhook)</span>
            {dispatchReceipt && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                Sent
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Order Issued Banner */}
          {orderIssued && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start space-x-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-900 block text-sm">
                  Official Surprise Inspection Order Legally Issued (Order #{complianceReport.eventId})
                </strong>
                <p className="mt-1 text-emerald-800">
                  Notification payloads dispatched to the Central Directorate and Regional Inspection Wing. An unannounced audit team has been authorized for deployment.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW & 3 CONDITIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Directive Alert Callout */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start space-x-3.5">
                <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-rose-950 text-sm">
                    All 3 Statutory Compliance Thresholds Breached Concurrently
                  </h4>
                  <p className="text-rose-800 mt-1 leading-relaxed">
                    Under Central Directorate Rule 14-B and Quality Inspection Norms, when a training centre persistently fails <strong>(1) Minimum Attendance</strong>, <strong>(2) Active Instructional Quality</strong>, and <strong>(3) Timely Equipment Repairs (&gt;30 Days)</strong>, an immediate unannounced Surprise Inspection is legally recommended.
                  </p>
                </div>
              </div>

              {/* 3 Conditions Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Condition 1: Low Attendance */}
                <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/70 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded font-mono uppercase">
                        Condition 1
                      </span>
                      <span className="text-xs font-bold text-rose-700">FAILED</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">Low Attendance</h4>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-2xl font-mono font-bold text-rose-900">
                        {attendance.thirtyDayAvgPct}%
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Statutory Threshold: <strong className="text-slate-900">&ge; {attendance.thresholdPct}%</strong>
                      </div>
                    </div>

                    <p className="text-xs text-rose-900/90 mt-2.5 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-200">
                      {attendance.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-800">
                    <span>Consecutive Low Days:</span>
                    <strong className="font-mono">{attendance.consecutiveLowDays} of 30 days</strong>
                  </div>
                </div>

                {/* Condition 2: Inactive / Poor Training Quality */}
                <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/70 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded font-mono uppercase">
                        Condition 2
                      </span>
                      <span className="text-xs font-bold text-rose-700">FAILED</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">Inactive / Poor Quality</h4>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-2xl font-mono font-bold text-rose-900">
                        {trainingQuality.thirtyDayAvgEngagementIndex}%
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Quality Threshold: <strong className="text-slate-900">&ge; {trainingQuality.thresholdEngagementIndex}%</strong>
                      </div>
                    </div>

                    <p className="text-xs text-rose-900/90 mt-2.5 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-200">
                      {trainingQuality.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-800">
                    <span>Trainer Presence:</span>
                    <strong className="font-mono">{trainingQuality.trainerPresencePct}% of hours</strong>
                  </div>
                </div>

                {/* Condition 3: Unresolved Equipment Damage (>30 Days) */}
                <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/70 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded font-mono uppercase">
                        Condition 3
                      </span>
                      <span className="text-xs font-bold text-rose-700">FAILED</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">Delayed Repairs (&gt;30d)</h4>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-2xl font-mono font-bold text-rose-900">
                        {equipmentRepairs.overdueCount} Assets
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Resolution Limit: <strong className="text-slate-900">&le; 30 Days</strong>
                      </div>
                    </div>

                    <p className="text-xs text-rose-900/90 mt-2.5 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-200">
                      {equipmentRepairs.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-800">
                    <span>Longest Delay:</span>
                    <strong className="font-mono text-rose-950 font-bold">{equipmentRepairs.maxDaysOverdue} days overdue</strong>
                  </div>
                </div>

              </div>

              {/* Direct Deep Link Action Bar */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Direct Deep-Link Inspector Controls
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Navigate directly to {centre_label} live monitoring stream and equipment audit logs.
                  </p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onNavigateToCamera && onNavigateToCamera(centre_id);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>View Live Stream</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateToAudit && onNavigateToAudit(centre_id);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Audit Logs</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERDUE REPAIR LOGS */}
          {activeTab === 'repairs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Damaged Equipment Logs Overdue by &gt; 30 Days (Statutory Breach)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assets reported damaged in {centre_label} that have exceeded the 1-month statutory repair resolution window.
                  </p>
                </div>
                <span className="text-xs bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md font-bold">
                  Rule 14-B Enforced
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Ticket ID & Asset</th>
                      <th className="py-2.5 px-3">Reported Issue</th>
                      <th className="py-2.5 px-3">Date Reported</th>
                      <th className="py-2.5 px-3">Days Overdue</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(equipmentRepairs.overdueTickets || []).map((ticket) => (
                      <tr key={ticket.ticketId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-blue-900 block">{ticket.ticketId}</span>
                          <span className="font-semibold text-slate-900 block mt-0.5">{ticket.assetName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {ticket.assetId}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-800 block">{ticket.damageType}</span>
                          <span className="text-[10px] text-rose-700 font-medium mt-0.5 block">Priority: {ticket.priority}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {ticket.reportDate}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-rose-700">
                          <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded text-xs">
                            {ticket.daysOverdue} days
                          </span>
                          <span className="text-[10px] text-rose-600 block mt-0.5 font-sans">
                            +{ticket.daysOverdue - 30} days overdue
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-semibold text-[11px] inline-block">
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 30-DAY HISTORICAL TRENDS */}
          {activeTab === 'trends' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  30-Day Historical Compliance Analytics ({centre_label})
                </h3>
                <p className="text-xs text-slate-500">
                  Demonstrates the persistent degradation of attendance and educational engagement over the last 30 daily sessions.
                </p>
              </div>

              {/* Visual Analytics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Attendance Trend (30 Days)
                  </h4>
                  <div className="h-32 flex items-end space-x-2 pt-4">
                    {[48, 42, 38, 34, 32, 30, 31, 29, 28, 27, 28].map((pct, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <div 
                          style={{ height: `${pct * 2.2}px` }}
                          className={`w-full rounded-t transition-all ${
                            pct < 60 ? 'bg-rose-500 group-hover:bg-rose-600' : 'bg-emerald-500'
                          }`}
                        ></div>
                        <span className="text-[9px] text-slate-400 mt-1">D{idx * 3 + 1}</span>
                        {/* Tooltip */}
                        <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded font-mono shadow-xs">
                          {pct}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                    <span>Mandatory Quota: <strong>60%</strong></span>
                    <span className="text-rose-700 font-bold">30d Avg: 32.8%</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Classroom Activity & Movement Score (30 Days)
                  </h4>
                  <div className="h-32 flex items-end space-x-2 pt-4">
                    {[44, 40, 35, 30, 28, 25, 24, 22, 25, 20, 21].map((pct, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                        <div 
                          style={{ height: `${pct * 2.2}px` }}
                          className={`w-full rounded-t transition-all ${
                            pct < 50 ? 'bg-amber-500 group-hover:bg-amber-600' : 'bg-blue-500'
                          }`}
                        ></div>
                        <span className="text-[9px] text-slate-400 mt-1">D{idx * 3 + 1}</span>
                        {/* Tooltip */}
                        <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded font-mono shadow-xs">
                          {pct}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                    <span>Quality Index Req: <strong>50%</strong></span>
                    <span className="text-amber-700 font-bold">30d Avg: 26.2%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MULTI-CHANNEL DISPATCH PREVIEW */}
          {activeTab === 'dispatch' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Automated Multi-Channel Alert Dispatcher
                </h3>
                <p className="text-xs text-slate-500">
                  Generates and transmits real-time inspection recommendations to designated government inspectors and vigilance cells.
                </p>
              </div>

              {/* Channel Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'dashboard', label: 'Dashboard Alert', icon: AlertTriangle, desc: 'Auditor Screen' },
                  { id: 'email', label: 'Official Email', icon: Mail, desc: 'DGT & State QA' },
                  { id: 'webhook', label: 'Webhook REST', icon: Radio, desc: 'Gov NIC Portal' },
                  { id: 'sms', label: 'Urgent SMS', icon: MessageSquare, desc: 'Inspector Cell' }
                ].map(ch => {
                  const Icon = ch.icon;
                  const isChecked = selectedChannels.includes(ch.id);
                  return (
                    <div 
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-blue-900 bg-blue-50/70 shadow-xs ring-1 ring-blue-900/20' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-4 h-4 text-blue-900" />
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => {}} 
                          className="accent-blue-900 cursor-pointer"
                        />
                      </div>
                      <div className="font-bold text-slate-900 mt-2">{ch.label}</div>
                      <div className="text-[10px] text-slate-500">{ch.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Notification Message Preview */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800 flex justify-between">
                  <span>OUTGOING NOTICE PAYLOAD</span>
                  <span className="text-emerald-400">READY TO TRANSMIT</span>
                </div>
                <div><span className="text-slate-400">SUBJECT: </span><strong className="text-white">{complianceReport.notificationTemplate.subject}</strong></div>
                <div><span className="text-slate-400">SUMMARY: </span><span className="text-slate-300">{complianceReport.notificationTemplate.summary}</span></div>
                <div><span className="text-slate-400">DIRECT LIVE STREAM URL: </span><span className="text-blue-400 underline">{window.location.origin}{directActionLinks.liveCameraStreamUrl}</span></div>
                <div><span className="text-slate-400">DIRECT AUDIT LOGS URL: </span><span className="text-blue-400 underline">{window.location.origin}{directActionLinks.auditLogsUrl}</span></div>
              </div>

              {/* Dispatch Action */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleTriggerDispatch}
                  disabled={isDispatching}
                  className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-bounce' : ''}`} />
                  <span>{isDispatching ? 'Transmitting Notifications...' : 'Dispatch Alert to Auditors Now'}</span>
                </button>

                {dispatchReceipt && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Delivered via {dispatchReceipt.channelsDispatched.join(', ')}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Evaluation Timestamp: {complianceReport.evaluationTimestamp}</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Diagnostic
            </button>
            <button
              onClick={handleIssueOrder}
              disabled={orderIssued}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                orderIssued
                  ? 'bg-emerald-700 text-white cursor-default'
                  : 'bg-rose-900 hover:bg-rose-950 text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{orderIssued ? 'Order Formally Issued' : 'Issue Surprise Inspection Order'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
