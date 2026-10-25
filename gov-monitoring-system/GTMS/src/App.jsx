import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import TraineeDashboard from './components/TraineeDashboard';
import GovDashboard from './components/GovDashboard';
import { initialGovData } from './data/mockData';

export default function App() {
  // Navigation route: '/' | '/trainee' | '/gov'
  const [currentRoute, setCurrentRoute] = useState('/');
  
  // Current logged in role: null | 'trainee' | 'gov'
  const [userRole, setUserRole] = useState(null);

  // Global monitoring system state pre-populated with required JSON
  const [appState, setAppState] = useState(initialGovData);

  // Authentication routing handler
  const handleLogin = (role) => {
    setUserRole(role);
    if (role === 'trainee') {
      setCurrentRoute('/trainee');
    } else if (role === 'gov') {
      setCurrentRoute('/gov');
    }
  };

  // Trainee report update handler to reflect in Gov Dashboard
  const handleUpdateReport = ({ manualAttendance, workbenches, weldingMachines, computers, feedback }) => {
    setAppState((prevState) => {
      const aiDetected = prevState.attendance_column.ai_detected;
      const discrepancyFlag = manualAttendance !== aiDetected;
      const variance = Math.abs(manualAttendance - aiDetected);

      return {
        ...prevState,
        attendance_column: {
          ...prevState.attendance_column,
          manual_reported: manualAttendance,
          discrepancy_flag: discrepancyFlag,
          discrepancy_variance: variance
        },
        infrastructure_column: {
          items: [
            { name: "Workbenches", sanctioned: 12, detected: workbenches, unit: "units", status: workbenches < 12 ? `Deficit (${workbenches - 12})` : "Matched" },
            { name: "Welding Machines", sanctioned: 5, detected: weldingMachines, unit: "units", status: weldingMachines < 5 ? `Deficit (${weldingMachines - 5})` : "Matched" },
            { name: "Computers", sanctioned: 25, detected: computers, unit: "terminals", status: computers < 25 ? `Deficit (${computers - 25})` : "Matched" }
          ],
          trainee_feedback: feedback
        }
      };
    });
  };

  // Real-time camera count synchronization handler
  const handleLiveCountUpdate = (liveCount) => {
    setAppState((prevState) => {
      const manual = prevState.attendance_column.manual_reported;
      const discrepancyFlag = liveCount !== manual;
      const variance = Math.abs(manual - liveCount);

      return {
        ...prevState,
        attendance_column: {
          ...prevState.attendance_column,
          ai_detected: liveCount,
          discrepancy_flag: discrepancyFlag,
          discrepancy_variance: variance,
          timestamp: new Date().toLocaleTimeString()
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-900 selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <LoginPage onLogin={handleLogin} />
        )}

        {currentRoute === '/trainee' && (
          <TraineeDashboard
            appState={appState}
            onUpdateReport={handleUpdateReport}
          />
        )}

        {currentRoute === '/gov' && (
          <GovDashboard
            appState={appState}
            onRefreshData={() => setAppState({ ...initialGovData })}
            onLiveCountUpdate={handleLiveCountUpdate}
          />
        )}
      </main>
    </div>
  );
}
