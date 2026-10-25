import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  LogOut, 
  UserCheck, 
  FileSpreadsheet, 
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute, userRole, setUserRole }) {
  const handleLogout = () => {
    setUserRole(null);
    setCurrentRoute('/');
  };

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
                <span className="font-bold text-lg text-slate-900 tracking-tight">GTMS</span>
                <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                  Verified Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none">Government Training Centre Monitoring System</p>
            </div>
          </div>

          {/* Navigation & Active Role Info */}
          <div className="flex items-center space-x-3">
            {userRole ? (
              <>
                <nav className="flex space-x-1 mr-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
                  <button
                    onClick={() => setCurrentRoute('/trainee')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                      currentRoute === '/trainee'
                        ? 'bg-white text-blue-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Trainee Portal</span>
                  </button>
                  <button
                    onClick={() => setCurrentRoute('/gov')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                      currentRoute === '/gov'
                        ? 'bg-white text-blue-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Gov Dashboard</span>
                  </button>
                </nav>

                <div className="hidden md:flex items-center pl-3 border-l border-slate-200 text-xs">
                  <div className="text-right mr-3">
                    <p className="font-semibold text-slate-800">
                      {userRole === 'gov' ? 'Shri R. Sharma (Director, QA)' : 'M. Verma (Centre Instructor)'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {userRole === 'gov' ? 'Authorised Inspector' : 'Centre ID: CNT-8472'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-md transition-colors"
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
