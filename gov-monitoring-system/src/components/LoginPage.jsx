import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle,
  KeyRound,
  X,
  ArrowLeft,
  Send,
  HelpCircle
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  // Trainee Login Form State
  const [traineeEmail, setTraineeEmail] = useState('m.verma@vocational.gov.in');
  const [traineePassword, setTraineePassword] = useState('Trainee@2026#secure');
  const [traineeCentreId, setTraineeCentreId] = useState('CNT-8472');
  const [showTraineePassword, setShowTraineePassword] = useState(false);
  const [traineeError, setTraineeError] = useState('');

  // Government Official Login Form State
  const [govEmail, setGovEmail] = useState('r.sharma.director@nic.in');
  const [govPassword, setGovPassword] = useState('GovQA@Audit2026!');
  const [showGovPassword, setShowGovPassword] = useState(false);
  const [govError, setGovError] = useState('');

  // Forgot Password Modal State
  // modalRole: null | 'trainee' | 'gov'
  const [forgotModalRole, setForgotModalRole] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // Open Forgot Password Modal
  const openForgotPassword = (role) => {
    setForgotModalRole(role);
    setResetEmail(role === 'trainee' ? traineeEmail : govEmail);
    setResetSubmitted(false);
    setResetError('');
  };

  // Close Forgot Password Modal
  const closeForgotPassword = () => {
    setForgotModalRole(null);
    setResetSubmitted(false);
    setResetError('');
  };

  // Handle Forgot Password Form Submission
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setResetError('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your official registered email address.');
      return;
    }
    if (!resetEmail.includes('@') || !resetEmail.includes('.')) {
      setResetError('Please enter a valid official institutional email.');
      return;
    }

    setIsSubmittingReset(true);
    setTimeout(() => {
      setIsSubmittingReset(false);
      setResetSubmitted(true);
    }, 700);
  };

  // Trainee Submission Handler
  const handleTraineeSubmit = (e) => {
    e.preventDefault();
    setTraineeError('');

    if (!traineeEmail.trim()) {
      setTraineeError('Official email address is required.');
      return;
    }
    if (!traineeEmail.includes('@') || !traineeEmail.includes('.')) {
      setTraineeError('Please enter a valid official email address.');
      return;
    }
    if (!traineePassword || traineePassword.length < 6) {
      setTraineeError('Password must be at least 6 characters.');
      return;
    }

    onLogin('trainee', { email: traineeEmail.trim(), centreId: traineeCentreId });
  };

  // Government Submission Handler
  const handleGovSubmit = (e) => {
    e.preventDefault();
    setGovError('');

    if (!govEmail.trim()) {
      setGovError('Government email address is required.');
      return;
    }
    if (!govEmail.includes('@') || !govEmail.includes('.')) {
      setGovError('Please enter a valid institutional government email address.');
      return;
    }
    if (!govPassword || govPassword.length < 6) {
      setGovError('Password must be at least 6 characters.');
      return;
    }

    onLogin('gov', { email: govEmail.trim() });
  };

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
                <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold block">
                  Ministry of Skill Development & Entrepreneurship • TEAM Garud
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2.5">
                  <span>DRISHTI</span>
                  <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    TEAM Garud
                  </span>
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  Government Training Centre Monitoring System — Automated Computer Vision & Audit Framework
                </p>
            </div>
            <div className="hidden lg:block text-right">
              <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700 font-mono">
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
              All logins require individual authenticated mail credentials under statutory oversight guidelines.
            </span>
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-blue-700">SECURE LOGIN ENCLAVE</span>
        </div>

        {/* Login Role Selection & Credential Grid */}
        <div className="p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl font-bold text-slate-900">Sign In to Authorized Portal</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter the individual official email and password associated with your authorized administrative tier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Trainee Official Login Card */}
            <form 
              onSubmit={handleTraineeSubmit}
              className="border-2 border-slate-200 hover:border-blue-700 rounded-xl p-6 transition-all bg-white hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors border border-blue-100">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-mono border border-slate-200">
                    Field Instructor
                  </span>
                </div>

                <div className="mb-1">
                  <h3 className="font-bold text-lg text-slate-900">Trainee Official Portal</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  For Centre Heads, Vocational Instructors, and designated lab in-charges.
                </p>

                {traineeError && (
                  <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>{traineeError}</span>
                  </div>
                )}

                {/* Trainee Assigned Centre Input with Tenant Isolation Notice */}
                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Assigned Training Centre (Tenant Enclave)
                  </label>
                  <div className="relative">
                    <select
                      value={traineeCentreId}
                      onChange={(e) => setTraineeCentreId(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-colors cursor-pointer"
                    >
                      <option value="CNT-8472">Training Centre 2 (Center 8472 / National Directorate #42 - New Delhi)</option>
                      <option value="CNT-3109">Training Centre 1 (Regional Advanced Vocational Institute #18 - Bengaluru)</option>
                    </select>
                  </div>
                  <div className="mt-1.5 p-2 bg-blue-50/90 rounded border border-blue-200 text-[11px] text-blue-900 flex items-start space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Multi-Tenant Active:</strong> Select your designated training centre to record daily roll-call attendance and machinery status.
                    </span>
                  </div>
                </div>

                {/* Trainee Email Input */}
                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Official Individual Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="instructor@vocational.gov.in"
                      value={traineeEmail}
                      onChange={(e) => setTraineeEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Trainee Password Input */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => openForgotPassword('trainee')}
                      className="text-[11px] text-blue-700 hover:text-blue-900 hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showTraineePassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={traineePassword}
                      onChange={(e) => setTraineePassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTraineePassword(!showTraineePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showTraineePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-5 py-3 px-4 bg-slate-900 hover:bg-blue-900 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 group-hover:translate-y-[-1px] cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-blue-300" />
                <span>Login to Trainee Portal</span>
              </button>
            </form>

            {/* Government Official Login Card */}
            <form 
              onSubmit={handleGovSubmit}
              className="border-2 border-slate-200 hover:border-blue-900 rounded-xl p-6 transition-all bg-white hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-blue-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">
                AUDITOR VIEW
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center group-hover:bg-blue-950 group-hover:text-blue-100 transition-colors border border-blue-200">
                    <ShieldCheck className="w-6 h-6 text-blue-800 group-hover:text-white" />
                  </div>
                  <span className="text-[11px] bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded font-mono border border-blue-200 font-semibold mr-20">
                    Supervisory Tier
                  </span>
                </div>

                <div className="mb-1">
                  <h3 className="font-bold text-lg text-slate-900">Government Official Portal</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  For District Officers, State Quality Auditors, and Central Observers.
                </p>

                {govError && (
                  <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>{govError}</span>
                  </div>
                )}

                {/* Government Email Input */}
                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Official Individual Email (NIC / Gov)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="officer@nic.in"
                      value={govEmail}
                      onChange={(e) => setGovEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Government Password Input */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => openForgotPassword('gov')}
                      className="text-[11px] text-blue-700 hover:text-blue-900 hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showGovPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={govPassword}
                      onChange={(e) => setGovPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGovPassword(!showGovPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showGovPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-5 py-3 px-4 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 group-hover:translate-y-[-1px] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Login to Government Portal</span>
              </button>
            </form>
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
              <button 
                type="button"
                onClick={() => openForgotPassword('trainee')}
                className="hover:text-blue-900 underline text-slate-600 cursor-pointer"
              >
                Reset Trainee Password
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => openForgotPassword('gov')}
                className="hover:text-blue-900 underline text-slate-600 cursor-pointer"
              >
                Reset Government Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {forgotModalRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-900/80 border border-blue-700 flex items-center justify-center text-blue-300">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {forgotModalRole === 'gov' ? 'Government Official Password Recovery' : 'Trainee Instructor Password Recovery'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {forgotModalRole === 'gov' ? 'NIC / Central Oversight Identity Enclave' : 'Field Vocational Institute Portal'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeForgotPassword}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!resetSubmitted ? (
                <form onSubmit={handleResetSubmit}>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Please provide the individual registered official email address associated with your {forgotModalRole === 'gov' ? 'Government Auditor' : 'Trainee/Instructor'} account. A time-limited cryptographically signed recovery token will be dispatched.
                  </p>

                  {resetError && (
                    <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      {forgotModalRole === 'gov' ? 'Official Government Email (NIC)' : 'Registered Instructor Email'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder={forgotModalRole === 'gov' ? 'officer@nic.in' : 'instructor@vocational.gov.in'}
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 mb-5 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Recovery links are valid for 15 minutes. For security compliance, password changes require multi-factor verification upon submission.
                    </span>
                  </div>

                  <div className="flex items-center justify-end space-x-2.5">
                    <button
                      type="button"
                      onClick={closeForgotPassword}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReset}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReset ? 'Dispatching Link...' : 'Send Recovery Link'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Recovery Instructions Dispatched</h4>
                  <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
                    A password recovery link has been dispatched to:
                    <br />
                    <strong className="text-slate-900 font-mono text-xs">{resetEmail}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded p-2.5 mb-5">
                    Check your official government inbox or spam folder. Click the link to define a new password.
                  </p>
                  <button
                    type="button"
                    onClick={closeForgotPassword}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
