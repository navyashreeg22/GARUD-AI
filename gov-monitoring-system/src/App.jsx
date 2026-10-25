import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import TraineeDashboard from './components/TraineeDashboard';
import GovDashboard from './components/GovDashboard';
import SurpriseInspectionModal from './components/SurpriseInspectionModal';
import { trainingCentres, initialGovData, resolveTargetCenterId } from './data/mockData';
import { monitoringApiService } from './services/api';
import { complianceAlertService } from './services/complianceAlertService';
import { DEFAULT_COMPLIANCE_THRESHOLDS } from './data/complianceAnalytics';

export default function App() {
  // Navigation route: '/' | '/trainee' | '/gov'
  const [currentRoute, setCurrentRoute] = useState('/');
  
  // Current logged in role: null | 'trainee' | 'gov'
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [traineeSourceCentreId, setTraineeSourceCentreId] = useState('CNT-3109');

  // All 3 training centres state with strict tenant isolation
  const [centresList, setCentresList] = useState(trainingCentres);

  // Selected training centre ID for Government auditor view
  const [selectedCentreId, setSelectedCentreId] = useState(trainingCentres[0].centre_id);

  // Automated Condition Monitoring Thresholds & Surprise Inspection Modal State
  const [complianceThresholds, setComplianceThresholds] = useState(DEFAULT_COMPLIANCE_THRESHOLDS);
  const [isSurpriseInspectionModalOpen, setIsSurpriseInspectionModalOpen] = useState(false);
  const [modalTargetCentreId, setModalTargetCentreId] = useState(null);

  // Evaluate compliance dynamically for selected training centre
  const activeCentreComplianceReport = complianceAlertService.evaluateCenterCompliance(selectedCentreId, complianceThresholds);

  // Evaluate all centres to ensure critical breaches (e.g. Training Center 3) trigger alerts across portals
  const allCentresReports = complianceAlertService.evaluateAllCentres(complianceThresholds);
  const globalCriticalReport = allCentresReports.find(r => r.triggerSurpriseInspection) || activeCentreComplianceReport;

  // Resolved report for the Surprise Inspection Modal
  const modalComplianceReport = modalTargetCentreId
    ? complianceAlertService.evaluateCenterCompliance(modalTargetCentreId, complianceThresholds)
    : (activeCentreComplianceReport.triggerSurpriseInspection ? activeCentreComplianceReport : globalCriticalReport);

  // Current active centre data in Government audit view
  const currentCentre = centresList.find(c => c.centre_id === selectedCentreId) || centresList[0];

  // Target centre for Trainee Portal: Center 3109 trainee logs are bound specifically to Center 8472
  const traineeBoundCentre = centresList.find(c => c.centre_id === 'CNT-8472') || centresList[1] || centresList[0];

  // Authentication routing handler with strict role assignment, email capture, and tenant center binding
  const handleLogin = (role, credentials = {}) => {
    setUserRole(role);
    setUserEmail(credentials.email || null);
    if (credentials.centreId) {
      setTraineeSourceCentreId(credentials.centreId);
    }
    if (role === 'trainee') {
      setCurrentRoute('/trainee');
    } else if (role === 'gov') {
      setCurrentRoute('/gov');
    }
  };

  // Switch active training centre in Government portal
  const handleSelectCentre = (centreId) => {
    setSelectedCentreId(centreId);
  };

  // Direct deep navigation to Live Camera Stream
  const handleNavigateToCamera = (centreId = selectedCentreId) => {
    setSelectedCentreId(centreId);
    if (currentRoute !== '/gov') {
      setCurrentRoute('/gov');
    }
    setTimeout(() => {
      const cameraEl = document.getElementById('live-camera-feed-section');
      if (cameraEl) {
        cameraEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // Direct deep navigation to Audit Logs & Inventory Matrix
  const handleNavigateToAudit = (centreId = selectedCentreId) => {
    setSelectedCentreId(centreId);
    if (currentRoute !== '/gov') {
      setCurrentRoute('/gov');
    }
    setTimeout(() => {
      const matrixEl = document.getElementById('triangulated-matrix-section');
      if (matrixEl) {
        matrixEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // Threshold updating handler for real-time compliance recalculation
  const handleThresholdUpdate = (newThresholds) => {
    setComplianceThresholds(prev => ({
      ...prev,
      ...newThresholds
    }));
  };

  const handleUpdateReport = (reportData) => {
    const { 
      sourceCentreId = traineeSourceCentreId,
      targetCentreId,
      centreId,
      manualAttendance, 
      computers, 
      fans, 
      feedback, 
      damagedEquipments = {} 
    } = reportData;

    // Resolve target centre directly from submission (supports Center 1 and Center 2)
    const resolvedCentreId = targetCentreId || centreId || sourceCentreId || 'CNT-8472';

    setCentresList((prevCentres) => {
      return prevCentres.map(c => {
        if (c.centre_id !== resolvedCentreId) return c;

        let manual = manualAttendance;
        let aiDetected = c.attendance_column.ai_detected;
        let discrepancyFlag = false;
        let variance = 0;
        let enrolled = c.attendance_column.enrolled;

        if (c.centre_id === 'CNT-3109') {
          // Training Centre 1: strictly 1 OUT OF 1, no discrepancy unless YOLO shows more count (> 1)
          manual = 1;
          enrolled = 1;
          if (aiDetected > 1) {
            discrepancyFlag = true;
            variance = aiDetected - 1;
          } else {
            aiDetected = 1;
            discrepancyFlag = false;
            variance = 0;
          }
        } else {
          discrepancyFlag = manual !== aiDetected;
          variance = Math.abs(manual - aiDetected);
        }

        const updatedItems = c.infrastructure_column.items.map(item => {
          const damagedCount = damagedEquipments[item.id] !== undefined ? damagedEquipments[item.id] : (item.damaged || 0);

          let rep = item.trainee_reported !== undefined ? item.trainee_reported : item.detected;
          if (item.name === "Computers" && computers !== undefined) rep = computers;
          if (item.name === "Fans" && fans !== undefined) rep = fans;

          const isDeficit = item.detected < item.sanctioned;
          let status = "Matched";
          if (damagedCount > 0 && isDeficit) {
            status = `Deficit (${item.detected - item.sanctioned}) & ${damagedCount} Defective`;
          } else if (damagedCount > 0) {
            status = `${damagedCount} Defective`;
          } else if (isDeficit) {
            status = `Deficit (${item.detected - item.sanctioned})`;
          } else if (item.detected > item.sanctioned) {
            status = `Surplus (+${item.detected - item.sanctioned})`;
          }

          return { 
            ...item, 
            trainee_reported: rep, 
            damaged: damagedCount,
            status 
          };
        });

        const totalDamaged = updatedItems.reduce((acc, it) => acc + (it.damaged || 0), 0);

        return {
          ...c,
          attendance_column: {
            ...c.attendance_column,
            manual_reported: manual,
            ai_detected: aiDetected,
            enrolled: enrolled,
            discrepancy_flag: discrepancyFlag,
            discrepancy_variance: variance,
            last_sync: `${new Date().toLocaleTimeString()} (Trainee Reported: ${manual}/${enrolled})`,
            submission_source: `Trainee Portal (${resolvedCentreId})`
          },
          infrastructure_column: {
            ...c.infrastructure_column,
            items: updatedItems,
            damaged_summary: damagedEquipments,
            total_damaged_count: totalDamaged,
            trainee_feedback: feedback
          }
        };
      });
    });

    // Notify API service with tenant isolation headers
    monitoringApiService.submitDailyReport(resolvedCentreId, reportData);
  };

  // Reconcile / align manual reported attendance with AI verified count for selected centre
  const handleReconcileAudit = (targetCount) => {
    setCentresList((prevCentres) => {
      return prevCentres.map(c => {
        if (c.centre_id !== selectedCentreId) return c;
        const count = targetCount !== undefined ? targetCount : c.attendance_column.ai_detected;
        return {
          ...c,
          attendance_column: {
            ...c.attendance_column,
            manual_reported: count,
            discrepancy_flag: false,
            discrepancy_variance: 0,
            last_sync: `${new Date().toLocaleTimeString()} (Reconciled to ${count})`
          }
        };
      });
    });
  };

  // Real-time camera count synchronization handler for active Centre in GovDashboard
  const handleLiveCountUpdate = (liveCount) => {
    setCentresList((prevCentres) => {
      return prevCentres.map(c => {
        if (c.centre_id !== selectedCentreId) return c;
        const manual = c.attendance_column.manual_reported;

        let discrepancyFlag = false;
        let variance = 0;
        let effectiveAiDetected = liveCount;

        if (c.centre_id === 'CNT-3109') {
          // "training 1 it shld be 1 OUT OF 1 only no disperency until yolo shows more count"
          if (liveCount > 1) {
            discrepancyFlag = true;
            variance = liveCount - 1;
            effectiveAiDetected = liveCount;
          } else {
            discrepancyFlag = false;
            variance = 0;
            effectiveAiDetected = 1; // Keep 1 OUT OF 1 when <= 1
          }
        } else {
          discrepancyFlag = liveCount !== manual;
          variance = Math.abs(manual - liveCount);
        }

        return {
          ...c,
          attendance_column: {
            ...c.attendance_column,
            ai_detected: effectiveAiDetected,
            discrepancy_flag: discrepancyFlag,
            discrepancy_variance: variance,
            timestamp: new Date().toLocaleTimeString()
          }
        };
      });
    });
  };

  // Real-time camera equipment count synchronization handler for active Centre in GovDashboard
  const handleLiveEquipmentUpdate = (itemCountsMap = {}) => {
    setCentresList((prevCentres) => {
      return prevCentres.map(c => {
        if (c.centre_id !== selectedCentreId) return c;
        const currentItems = c.infrastructure_column.items;
        const updatedItems = currentItems.map(item => {
          if (item.id && itemCountsMap[item.id] !== undefined) {
            const detected = itemCountsMap[item.id];
            const diff = detected - item.sanctioned;
            const damagedCount = item.damaged || 0;
            let status = "Matched";
            if (damagedCount > 0 && diff < 0) {
              status = `Deficit (${diff}) & ${damagedCount} Defective`;
            } else if (damagedCount > 0) {
              status = `${damagedCount} Defective`;
            } else if (diff < 0) {
              status = `Deficit (${diff})`;
            } else if (diff > 0) {
              status = `Surplus (+${diff})`;
            }
            return {
              ...item,
              detected,
              status
            };
          }
          return item;
        });

        return {
          ...c,
          infrastructure_column: {
            ...c.infrastructure_column,
            items: updatedItems
          }
        };
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-900 selection:text-white">
      {/* Top Universal Gov Navigation Bar */}
      <Navbar 
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        userRole={userRole}
        setUserRole={setUserRole}
        userEmail={userEmail}
        complianceAlertReport={globalCriticalReport}
        onOpenSurpriseInspectionModal={(targetId) => {
          setModalTargetCentreId(targetId || globalCriticalReport.centre_id);
          setIsSurpriseInspectionModalOpen(true);
        }}
        onNavigateToCamera={handleNavigateToCamera}
        onNavigateToAudit={handleNavigateToAudit}
      />

      {/* Main View Router with strict Role-Based Access Control & Tenant Isolation */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <LoginPage onLogin={handleLogin} />
        )}

        {/* Trainee Portal: Only accessible if authenticated as 'trainee', strictly bound to Training Center 2 (Center 8472) */}
        {currentRoute === '/trainee' && (
          userRole === 'trainee' ? (
            <TraineeDashboard
              appState={centresList.find(c => c.centre_id === traineeSourceCentreId) || traineeBoundCentre}
              sourceCentreId={traineeSourceCentreId || 'CNT-8472'}
              boundCentreId={traineeSourceCentreId || 'CNT-8472'}
              trainingCentres={centresList}
              onUpdateReport={handleUpdateReport}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-200 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ✕
              </div>
              <h2 className="text-lg font-bold text-slate-900">Access Denied: Instructor Enclave</h2>
              <p className="text-xs text-slate-600 mt-2">
                This portal is restricted to authorized Training Centre Instructors. You are logged in as {userRole || 'an unauthenticated user'}.
              </p>
              <button
                onClick={() => setCurrentRoute(userRole === 'gov' ? '/gov' : '/')}
                className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors cursor-pointer"
              >
                Return to {userRole === 'gov' ? 'Government Dashboard' : 'Login'}
              </button>
            </div>
          )
        )}

        {/* Government Dashboard: Only accessible if authenticated as 'gov' */}
        {currentRoute === '/gov' && (
          userRole === 'gov' ? (
            <GovDashboard
              appState={currentCentre}
              trainingCentres={centresList}
              onSelectCentre={handleSelectCentre}
              onRefreshData={() => setCentresList([...trainingCentres])}
              onReconcileAudit={handleReconcileAudit}
              onLiveCountUpdate={handleLiveCountUpdate}
              onEquipmentCountUpdate={handleLiveEquipmentUpdate}
              complianceReport={activeCentreComplianceReport.triggerSurpriseInspection ? activeCentreComplianceReport : globalCriticalReport}
              onOpenSurpriseInspectionModal={(targetId) => {
                setModalTargetCentreId(targetId || selectedCentreId);
                setIsSurpriseInspectionModalOpen(true);
              }}
              complianceThresholds={complianceThresholds}
              onThresholdUpdate={handleThresholdUpdate}
              onNavigateToCamera={handleNavigateToCamera}
              onNavigateToAudit={handleNavigateToAudit}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-200 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ✕
              </div>
              <h2 className="text-lg font-bold text-slate-900">Access Denied: Government Oversight Tier</h2>
              <p className="text-xs text-slate-600 mt-2">
                This supervisory dashboard is restricted to Central/State Government Quality Inspectors. Trainee users cannot access this audit console.
              </p>
              <button
                onClick={() => setCurrentRoute(userRole === 'trainee' ? '/trainee' : '/')}
                className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors cursor-pointer"
              >
                Return to {userRole === 'trainee' ? 'Trainee Portal' : 'Login'}
              </button>
            </div>
          )
        )}
      </main>

      {/* Statutory Surprise Inspection Modal */}
      <SurpriseInspectionModal
        isOpen={isSurpriseInspectionModalOpen}
        onClose={() => {
          setIsSurpriseInspectionModalOpen(false);
          setModalTargetCentreId(null);
        }}
        complianceReport={modalComplianceReport}
        onNavigateToCamera={handleNavigateToCamera}
        onNavigateToAudit={handleNavigateToAudit}
        onThresholdUpdate={handleThresholdUpdate}
      />
    </div>
  );
}
