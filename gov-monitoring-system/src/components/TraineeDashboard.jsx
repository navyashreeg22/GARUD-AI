import React, { useState, useMemo, useEffect } from 'react';
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
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileWarning
} from 'lucide-react';
import { tc1TraineesList, tc2TraineesList } from '../data/traineesRoster';
import { INSTITUTIONAL_EQUIPMENT_REGISTRY } from '../data/equipmentRegistry';

export default function TraineeDashboard({ 
  appState, 
  sourceCentreId = 'CNT-8472', 
  boundCentreId = 'CNT-8472', 
  trainingCentres = [],
  onUpdateReport 
}) {
  // Active centre code for reporting (defaults to logged-in centre, selectable across all centres)
  const [selectedCentreCode, setSelectedCentreCode] = useState(sourceCentreId || appState?.centre_id || 'CNT-8472');
  const activeCentre = (trainingCentres && trainingCentres.find(c => c.centre_id === selectedCentreCode)) || appState || {};

  // Dynamic roster selection: Training Centre 1 has 1 enrolled student, TC 2 has 50 enrolled students
  const currentRoster = useMemo(() => {
    return selectedCentreCode === 'CNT-3109' ? tc1TraineesList : tc2TraineesList;
  }, [selectedCentreCode]);

  const totalEnrolled = currentRoster.length;

  // Initialize attendance map: { [id]: boolean }
  const [attendanceRoster, setAttendanceRoster] = useState(() => {
    const initialMap = {};
    const roster = selectedCentreCode === 'CNT-3109' ? tc1TraineesList : tc2TraineesList;
    roster.forEach(t => {
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

  // Group 2: Infrastructure Status
  const [workbenches, setWorkbenches] = useState('10');
  const [weldingMachines, setWeldingMachines] = useState('4');
  const [computers, setComputers] = useState(() => selectedCentreCode === 'CNT-3109' ? '1' : '33');
  const [fans, setFans] = useState(() => selectedCentreCode === 'CNT-3109' ? '0' : '5');

  // Manual Damaged Equipment Map: { [equipmentId]: number }
  const [damagedEquipments, setDamagedEquipments] = useState(() => {
    const initialDamaged = {};
    INSTITUTIONAL_EQUIPMENT_REGISTRY.forEach(eq => {
      initialDamaged[eq.id] = 0;
    });
    return initialDamaged;
  });

  // Synchronize state when selected centre changes
  useEffect(() => {
    const initialMap = {};
    const roster = selectedCentreCode === 'CNT-3109' ? tc1TraineesList : tc2TraineesList;
    roster.forEach(t => {
      initialMap[t.id] = t.defaultPresent;
    });
    setAttendanceRoster(initialMap);

    if (selectedCentreCode === 'CNT-3109') {
      setComputers('1');
      setFans('0');
    } else {
      setComputers('33');
      setFans('5');
    }

    if (activeCentre?.infrastructure_column?.items) {
      const initialDamaged = {};
      INSTITUTIONAL_EQUIPMENT_REGISTRY.forEach(eq => {
        const found = activeCentre.infrastructure_column.items.find(i => i.id === eq.id || i.name === eq.name);
        initialDamaged[eq.id] = (found && found.damaged !== undefined) ? found.damaged : 0;
      });
      setDamagedEquipments(initialDamaged);
    }
  }, [selectedCentreCode]);

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
      currentRoster.forEach(t => {
        updated[t.id] = status;
      });
      return updated;
    });
  };

  const handleDamagedChange = (eqId, value) => {
    const parsed = Math.max(0, parseInt(value, 10) || 0);
    setDamagedEquipments(prev => ({
      ...prev,
      [eqId]: parsed
    }));
  };

  // Input 3: Discrepancy / Feedback
  const [feedback, setFeedback] = useState(
    appState.infrastructure_column.trainee_feedback || ''
  );

  // Toast / notification state
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered roster for search & filters
  const filteredTrainees = useMemo(() => {
    return currentRoster.filter(trainee => {
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
  }, [currentRoster, attendanceRoster, searchTerm, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedWorkbenches = parseInt(workbenches, 10) || 0;
    const parsedWelding = parseInt(weldingMachines, 10) || 0;
    const parsedComputers = parseInt(computers, 10) || (selectedCentreCode === 'CNT-3109' ? 1 : 0);
    const parsedFans = parseInt(fans, 10) || (selectedCentreCode === 'CNT-3109' ? 0 : 0);

    const totalDamagedCount = Object.values(damagedEquipments).reduce((sum, count) => sum + (count || 0), 0);

    setTimeout(() => {
      onUpdateReport({
        sourceCentreId: selectedCentreCode,
        targetCentreId: selectedCentreCode,
        centreId: selectedCentreCode,
        manualAttendance: selectedCentreCode === 'CNT-3109' ? 1 : presentCount,
        workbenches: parsedWorkbenches,
        weldingMachines: parsedWelding,
        computers: parsedComputers,
        fans: parsedFans,
        damagedEquipments,
        feedback: feedback
      });

      setIsSubmitting(false);
      setToast({
        type: 'success',
        title: `Daily Report Synchronized for ${activeCentre.centre_label || selectedCentreCode}`,
        message: selectedCentreCode === 'CNT-3109'
          ? `Registered ${presentCount} present trainee out of 1 enrolled (100% Turnout), ${parsedComputers} computer terminal. ${totalDamagedCount > 0 ? `${totalDamagedCount} Damaged/Defective items reported.` : 'Equipment fully operational.'} Data updated in Government Compliance Matrix.`
          : `Registered ${presentCount} present trainees out of ${totalEnrolled} enrolled (${Math.round((presentCount / totalEnrolled) * 100)}% Turnout), ${parsedComputers} computers, and ${parsedFans} fans. ${totalDamagedCount > 0 ? `${totalDamagedCount} Damaged/Defective items reported.` : 'Equipment fully operational.'} Data updated in Government Compliance Matrix.`,
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
    currentRoster.forEach(t => {
      resetMap[t.id] = t.defaultPresent;
    });
    setAttendanceRoster(resetMap);
    if (selectedCentreCode === 'CNT-3109') {
      setComputers('1');
      setFans('0');
      setFeedback('Training Centre 1 live webcam edge sensor online. Laptops and trainee headcount monitored.');
    } else {
      setComputers('33');
      setFans('5');
      setFeedback('All 33 computer lab workstations and all 5 ceiling fans inspected and fully operational.');
    }
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
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-900 border border-blue-200">
              Form 7-A (Roll Call & Infrastructure Audit)
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Active Centre: {selectedCentreCode}
            </span>
            <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-mono font-semibold">
              Live Sync Active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-300">
              <span className="text-[11px] font-bold text-slate-700 px-2 uppercase tracking-wider flex items-center">
                Reporting Centre:
              </span>
              <select
                value={selectedCentreCode}
                onChange={(e) => setSelectedCentreCode(e.target.value)}
                className="text-xs font-bold bg-white text-slate-900 py-1.5 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-700 cursor-pointer shadow-xs"
              >
                <option value="CNT-8472">Training Centre 2 (CNT-8472 - New Delhi)</option>
                <option value="CNT-3109">Training Centre 1 (CNT-3109 - Bengaluru)</option>
              </select>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-2">Trainee Official Daily Report Entry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record manual candidate attendance and laboratory machinery status for <strong className="text-slate-800">{activeCentre.centre_name || selectedCentreCode}</strong>.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Computers */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-sm">
                <Monitor className="w-4 h-4 text-blue-700" />
                <span>Computers</span>
              </div>
              <label htmlFor="computers" className="block text-[11px] text-slate-500 mb-1">
                Active Lab Workstations / Laptops
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
                <span className="font-semibold text-slate-700 font-mono">
                  {selectedCentreCode === 'CNT-3109' ? '1 terminal' : '33 terminals'}
                </span>
              </div>
            </div>

            {/* Fans */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
              <div className="flex items-center space-x-2 mb-2 text-slate-800 font-semibold text-sm">
                <Wrench className="w-4 h-4 text-cyan-700" />
                <span>Fans</span>
              </div>
              <label htmlFor="fans" className="block text-[11px] text-slate-500 mb-1">
                Active Ceiling & Wall Fans
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="fans"
                  min="0"
                  required
                  disabled={selectedCentreCode === 'CNT-3109'}
                  value={fans}
                  onChange={(e) => setFans(e.target.value)}
                  className={`block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 font-mono text-slate-900 ${
                    selectedCentreCode === 'CNT-3109' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Sanctioned Quota:</span>
                <span className="font-semibold text-slate-700 font-mono">
                  {selectedCentreCode === 'CNT-3109' ? 'N/A (Laptops & Headcount only)' : '5 fans'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Manual Damaged & Defective Equipment Entry */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center">
                  <span>Damaged & Non-Functional Equipment Entry</span>
                  <span className="ml-2 text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-semibold">
                    MANUAL LOG
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manually report broken, defective, or under-repair items to explain camera vision discrepancy to government auditors
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
                Total Damaged: {Object.values(damagedEquipments).reduce((sum, n) => sum + (n || 0), 0)} Items
              </span>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mb-5 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Regulatory Notice:</strong> Entering damaged counts here automatically links to the Government Auditor's Compliance Grid, justifying why the edge camera detects fewer active units than sanctioned.
            </span>
          </div>

          {/* Grid of Equipment Items for Damaged Count Entry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INSTITUTIONAL_EQUIPMENT_REGISTRY
              .filter(eq => selectedCentreCode !== 'CNT-3109' || eq.id === 'EQ-LAPTOP')
              .map((eq) => {
              const currentDamaged = damagedEquipments[eq.id] || 0;
              const hasDamage = currentDamaged > 0;
              const eqSanction = eq.id === 'EQ-LAPTOP' 
                ? (selectedCentreCode === 'CNT-3109' ? 1 : 33) 
                : 5;

              return (
                <div 
                  key={eq.id} 
                  className={`p-3.5 rounded-lg border transition-all ${
                    hasDamage 
                      ? 'border-rose-300 bg-rose-50/50 shadow-2xs' 
                      : 'border-slate-200 bg-slate-50/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center">
                        <span 
                          className="w-2 h-2 rounded-full mr-1.5 shrink-0" 
                          style={{ backgroundColor: eq.color }}
                        ></span>
                        {eq.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[170px]">
                        {eq.detail}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded shrink-0">
                      Sanction: {eqSanction}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    <label 
                      htmlFor={`damaged-${eq.id}`} 
                      className={`text-[11px] font-medium ${hasDamage ? 'text-rose-800 font-semibold' : 'text-slate-600'}`}
                    >
                      Damaged Count:
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleDamagedChange(eq.id, Math.max(0, currentDamaged - 1))}
                        className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id={`damaged-${eq.id}`}
                        min="0"
                        max={eq.sanctioned}
                        value={currentDamaged}
                        onChange={(e) => handleDamagedChange(eq.id, e.target.value)}
                        className={`w-14 text-center py-1 text-xs font-mono font-bold border rounded ${
                          hasDamage 
                            ? 'bg-white border-rose-400 text-rose-700 ring-1 ring-rose-300' 
                            : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleDamagedChange(eq.id, currentDamaged + 1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: Discrepancy / Feedback */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                4
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
