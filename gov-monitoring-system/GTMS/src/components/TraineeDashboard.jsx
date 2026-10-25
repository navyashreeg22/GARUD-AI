import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Users, 
  Wrench, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  RotateCcw, 
  Info, 
  Calendar,
  Monitor,
  Flame,
  Clock,
  Search,
  CheckCheck,
  XCircle,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { mockTraineesList } from '../data/traineesRoster';

export default function TraineeDashboard({ appState, onUpdateReport }) {
  // Initialize attendance map: { [id]: boolean }
  const [attendanceRoster, setAttendanceRoster] = useState(() => {
    const initialMap = {};
    mockTraineesList.forEach(t => {
      initialMap[t.id] = t.defaultPresent;
    });
    return initialMap;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'present' | 'absent'

  // Dynamic calculation: Total Trainees Physically Present Today
  const presentCount = useMemo(() => {
    return Object.values(attendanceRoster).filter(Boolean).length;
  }, [attendanceRoster]);

  const totalEnrolled = mockTraineesList.length;

  // Toggle individual trainee attendance
  const handleToggleAttendance = (id) => {
    setAttendanceRoster(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Bulk actions: Mark All Present / Mark All Absent
  const handleMarkAll = (status) => {
    setAttendanceRoster(prev => {
      const updated = {};
      mockTraineesList.forEach(t => {
        updated[t.id] = status;
      });
      return updated;
    });
  };

  // Group 2: Infrastructure Status
  const [workbenches, setWorkbenches] = useState('10');
  const [weldingMachines, setWeldingMachines] = useState('4');
  const [computers, setComputers] = useState('25');

  // Input 3: Discrepancy / Feedback
  const [feedback, setFeedback] = useState(
    appState.infrastructure_column.trainee_feedback || ''
  );

  // Toast / notification state
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered roster for search & filters
  const filteredTrainees = useMemo(() => {
    return mockTraineesList.filter(trainee => {
      const isPresent = !!attendanceRoster[trainee.id];
      const matchesSearch = 
        trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.trade.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filterStatus === 'present') return isPresent;
      if (filterStatus === 'absent') return !isPresent;
      return true;
    });
  }, [attendanceRoster, searchTerm, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedWorkbenches = parseInt(workbenches, 10) || 0;
    const parsedWelding = parseInt(weldingMachines, 10) || 0;
    const parsedComputers = parseInt(computers, 10) || 0;

    // Simulate network submission and update global state with the calculated presentCount
    setTimeout(() => {
      onUpdateReport({
        manualAttendance: presentCount,
        workbenches: parsedWorkbenches,
        weldingMachines: parsedWelding,
        computers: parsedComputers,
        feedback: feedback
      });

      setIsSubmitting(false);
      setToast({
        type: 'success',
        title: 'Daily Report & Individual Roll Call Submitted',
        message: `Registered ${presentCount} present trainees out of ${totalEnrolled} enrolled for Centre ${appState.centre_id}. Data synchronized with Government Oversight Matrix.`,
        timestamp: new Date().toLocaleTimeString()
      });

      // Clear toast after 6 seconds
      setTimeout(() => {
        setToast(null);
      }, 6000);
    }, 700);
  };

  const handleReset = () => {
    const resetMap = {};
    mockTraineesList.forEach(t => {
      resetMap[t.id] = t.defaultPresent;
    });
    setAttendanceRoster(resetMap);
    setWorkbenches('10');
    setWeldingMachines('4');
    setComputers('25');
    setFeedback('One welding machine sent for repair yesterday. Two workbenches broken.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Toast Alert */}
      {toast && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-300 shadow-sm flex items-start justify-between animate-fade-in">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900">{toast.title}</h4>
              <p className="text-xs text-emerald-800 mt-0.5">{toast.message}</p>
              <span className="text-[11px] text-emerald-600 mt-1 inline-block font-mono">
                Recorded at {toast.timestamp} • Ack Token: ACK-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-900 border border-blue-200">
              Form 7-A (Individual Roll Call & Lab Audit)
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-600">Centre Code: {appState.centre_id}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Trainee Official Daily Report Entry</h1>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory daily submission by 10:00 AM. Mark individual roll call for enrolled trainees.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 shadow-xs flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            <span>Inspection Date: <strong className="text-slate-900">{appState.inspection_date || '2026-10-10'}</strong></span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700 shadow-xs flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-700" />
            <span>Shift: <strong className="text-slate-900">Morning (08:30 - 16:30)</strong></span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: INTERACTIVE INDIVIDUAL STUDENT ROSTER */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Manual Attendance (Individual Student Roster)</h2>
                <p className="text-xs text-slate-500">Mark daily attendance for enrolled candidates (Centre Code: {appState.centre_id})</p>
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
              Mandatory Roster
            </span>
          </div>

          {/* DYNAMIC SUMMARY METRIC CARD */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Total Trainees Physically Present Today
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono text-slate-900">
                    {presentCount}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 font-mono">
                    / {totalEnrolled} Enrolled
                  </span>
                  <span className="ml-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    {((presentCount / totalEnrolled) * 100).toFixed(0)}% Turnout
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex sm:justify-end items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <button
                type="button"
                onClick={() => handleMarkAll(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                title="Mark all 50 trainees as Present"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll(false)}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                title="Reset all trainees to Absent"
              >
                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID, Name or Trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'all' 
                    ? 'bg-blue-900 text-white font-semibold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({totalEnrolled})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('present')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'present' 
                    ? 'bg-emerald-700 text-white font-semibold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Present ({presentCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('absent')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterStatus === 'absent' 
                    ? 'bg-rose-700 text-white font-semibold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Absent ({totalEnrolled - presentCount})
              </button>
            </div>
          </div>

          {/* Scrollable Trainees Table / List Layout */}
          <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 sticky top-0 z-10 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Trainee ID</th>
                    <th className="px-4 py-2.5">Candidate Name</th>
                    <th className="px-4 py-2.5 hidden sm:table-cell">Vocational Trade</th>
                    <th className="px-4 py-2.5 text-center">Attendance Toggle</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredTrainees.length > 0 ? (
                    filteredTrainees.map((trainee) => {
                      const isPresent = !!attendanceRoster[trainee.id];

                      return (
                        <tr 
                          key={trainee.id} 
                          onClick={() => handleToggleAttendance(trainee.id)}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                            isPresent ? 'bg-white' : 'bg-rose-50/20'
                          }`}
                        >
                          {/* Trainee ID */}
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                              {trainee.id}
                            </span>
                          </td>

                          {/* Candidate Name */}
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{trainee.name}</div>
                            <div className="text-[11px] text-slate-400 sm:hidden">{trainee.trade}</div>
                          </td>

                          {/* Vocational Trade */}
                          <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                            {trainee.trade}
                          </td>

                          {/* Clear, easy-to-click Toggle Switch */}
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isPresent}
                                onChange={() => handleToggleAttendance(trainee.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </td>

                          {/* Status Badge */}
                          <td className="px-4 py-3 text-right">
                            {isPresent ? (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Present</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                <XCircle className="w-3 h-3 text-rose-500" />
                                <span>Absent</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No trainees found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Roster Summary Bar */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-medium">
                Showing {filteredTrainees.length} of {totalEnrolled} trainees
              </span>
              <span className="font-semibold text-slate-800">
                Active Roll Call Total: <strong className="text-blue-900 font-mono text-sm">{presentCount}</strong> Candidates Physically Marked
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Infrastructure Status Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Infrastructure Status Audit</h2>
                <p className="text-xs text-slate-500">Provide operational count of machinery and lab infrastructure</p>
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              Machine Audit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Workbenches */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-sm">
                <Wrench className="w-4 h-4 text-blue-700" />
                <span>Workbenches</span>
              </div>
              <label htmlFor="workbenches" className="block text-[11px] text-slate-500 mb-1">
                Functional Units Present
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="workbenches"
                  min="0"
                  required
                  value={workbenches}
                  onChange={(e) => setWorkbenches(e.target.value)}
                  className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 font-mono text-slate-900"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Sanctioned Quota:</span>
                <span className="font-semibold text-slate-700 font-mono">12 units</span>
              </div>
            </div>

            {/* Welding Machines */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-sm">
                <Flame className="w-4 h-4 text-amber-700" />
                <span>Welding Machines</span>
              </div>
              <label htmlFor="weldingMachines" className="block text-[11px] text-slate-500 mb-1">
                Operational In Workshop
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="weldingMachines"
                  min="0"
                  required
                  value={weldingMachines}
                  onChange={(e) => setWeldingMachines(e.target.value)}
                  className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 font-mono text-slate-900"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Sanctioned Quota:</span>
                <span className="font-semibold text-slate-700 font-mono">5 units</span>
              </div>
            </div>

            {/* Computers */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-sm">
                <Monitor className="w-4 h-4 text-blue-700" />
                <span>Computers</span>
              </div>
              <label htmlFor="computers" className="block text-[11px] text-slate-500 mb-1">
                Active Lab Workstations
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="computers"
                  min="0"
                  required
                  value={computers}
                  onChange={(e) => setComputers(e.target.value)}
                  className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 font-mono text-slate-900"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Sanctioned Quota:</span>
                <span className="font-semibold text-slate-700 font-mono">25 units</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Discrepancy / Feedback */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Discrepancy / Feedback</h2>
                <p className="text-xs text-slate-500">Explain variance between sanctioned infrastructure and ground equipment</p>
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              Remarks
            </span>
          </div>

          <div>
            <label htmlFor="feedback" className="block text-xs font-semibold text-slate-700 mb-1">
              Official Justification / Equipment Maintenance Remarks
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="State reasons for missing equipment, ongoing servicing, breakdown tokens, or biometric anomalies..."
              className="block w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 text-slate-900 leading-relaxed font-sans"
            ></textarea>
            <p className="text-[11px] text-slate-500 mt-2">
              Note: Government auditors cross-examine this statement verbatim when reviewing camera discrepancies.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Pre-filled Defaults</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Transmitting To Server...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Daily Report ({presentCount} Present)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
