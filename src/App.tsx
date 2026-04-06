import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Calendar, Bell, ClipboardList, BookOpen, Users } from 'lucide-react';
import { UserRole, Patient, Organization, Profile } from './types';
import { MOCK_PROFILES } from './data';
import { Toast } from './components/UI';
import { subscribeToPatients } from './services/dataService';
import { TopNav } from './components/TopNav';
import { TriageDashboard } from './views/TriageDashboard';
import { PatientProfile } from './views/PatientProfile';
import { CarePlanEditor } from './views/CarePlanEditor';
import { ShiftNoteEditor } from './views/ShiftNoteEditor';
import { NurseDashboard } from './views/NurseDashboard';
import { SMSTrigger } from './views/SMSTrigger';
import { AdminView } from './views/AdminView';
import { PatientApp } from './views/PatientApp';

import { ProfileView } from './views/ProfileView';
import { OrgOnboarding } from './views/OrgOnboarding';
import { DoctorDirectory } from './views/DoctorDirectory';

// ─── Login Screen ─────────────────────────────────────────────────────────────
const AuthView = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState<'login' | 'mfa'>('login');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const HINTS = [
    { email: 'doctor@syncro.care', role: 'doctor' as const },
    { email: 'nurse@syncro.care', role: 'nurse' as const },
    { email: 'admin@syncro.care', role: 'admin' as const },
    { email: 'patient@syncro.care', role: 'patient' as const },
  ];

  const deriveRole = (e: string): UserRole => {
    if (e.includes('admin')) return 'admin';
    if (e.includes('doctor')) return 'doctor';
    if (e.includes('nurse')) return 'nurse';
    return 'patient';
  };

  const handleLogin = (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const role = deriveRole(email);
      if (role === 'admin' || role === 'doctor') { setStep('mfa'); }
      else { onLogin(role); }
    }, 800);
  };

  const handleMFA = (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(deriveRole(email)); }, 600);
  };

  return (
    <div className="min-h-screen flex bg-navy relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full opacity-10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-mid rounded-full opacity-10 blur-[120px] pointer-events-none" />

      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative z-10">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary-mid" />
          <span className="font-serif text-3xl font-bold text-white tracking-[-0.01em]">SYNCRO</span>
        </div>
        <div>
          <h1 className="text-5xl font-serif font-bold text-white leading-tight mb-6">
            Close the Gap Between<br />
            <span className="text-primary-mid">Care and Compliance.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            A unified coordination engine for providers to monitor, manage, and engage patients in real-time.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {['HIPAA Compliant', 'Real-time Sync', 'Offline Ready'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white/70 uppercase tracking-widest">{tag}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md bg-white rounded-[28px] p-10 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-serif text-2xl font-bold text-primary">SYNCRO</span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-navy mb-1">
            {step === 'login' ? 'Sign in to SYNCRO' : 'Two-Factor Auth'}
          </h2>
          <p className="text-sm text-gray-secondary mb-8">
            {step === 'login' ? 'Enter your clinic credentials to continue.' : 'Check your authenticator app for a 6-digit code.'}
          </p>

          <AnimatePresence mode="wait">
            {step === 'login' ? (
              <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value.toLowerCase())}
                    placeholder="dr.shah@syncro.care" className="form-input" autoFocus required />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" className="form-input pr-12" required />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-secondary hover:text-navy transition-colors text-sm">
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                {error && <p className="text-[12px] text-critical font-medium">{error}</p>}
                <button type="submit" disabled={loading || !email || !password}
                  className="w-full btn-primary h-14 text-base shadow-xl shadow-primary/20 disabled:opacity-60">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
                </button>
              </motion.form>
            ) : (
              <motion.form key="mfa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleMFA} className="space-y-5">
                <div className="flex items-center gap-3 p-4 bg-primary-light rounded-xl border border-primary/20">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-primary">Multi-Factor Authentication Required</span>
                </div>
                <div>
                  <label className="form-label">6-Digit Code</label>
                  <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="000 000" className="form-input text-center text-2xl tracking-widest font-mono" autoFocus required />
                </div>
                <button type="submit" disabled={loading || otp.length < 6}
                  className="w-full btn-primary h-14 text-base shadow-xl shadow-primary/20 disabled:opacity-60">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button type="button" onClick={() => setStep('login')} className="w-full text-sm text-gray-secondary hover:text-navy text-center font-bold">
                  ← Back to login
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-5 border-t border-gray-border">
            <p className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-3 text-center">Demo — sign in as</p>
            <div className="grid grid-cols-2 gap-2">
              {HINTS.map(h => (
                <button key={h.role} onClick={() => { setEmail(h.email); setPassword('demo1234'); onLogin(h.role); }}
                  className="px-3 py-2 bg-gray-bg border border-gray-border rounded-xl text-xs font-bold text-navy hover:border-primary hover:bg-primary-light hover:text-primary transition-colors capitalize text-center">
                  {h.role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-[10px] uppercase font-bold tracking-widest text-gray-disabled mt-6">
            Secure • HIPAA Compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<UserRole | 'AUTH'>('AUTH');
  const [activeScreen, setActiveScreen] = useState('triage');
  const [patients, setPatients] = useState<Patient[]>([]);
  
  React.useEffect(() => {
    if (role !== 'AUTH') {
      const unsubscribe = subscribeToPatients((data) => {
        setPatients(data);
      });
      return () => unsubscribe();
    }
  }, [role]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Doctor states
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<boolean>(false);

  // Panel state
  const [isCarePlanOpen, setIsCarePlanOpen] = useState(false);
  const [isShiftNoteOpen, setIsShiftNoteOpen] = useState(false);
  const [isSMSOpen, setIsSMSOpen] = useState(false);
  const [smsPatient, setSmsPatient] = useState<Patient | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'info' | 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'info' | 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  const handleLogin = (r: UserRole) => {
    setRole(r);
    if (r === 'doctor' && !currentOrg) {
      setOnboardingStep(true);
    } else {
      setActiveScreen(r === 'admin' ? 'admin-home' : r === 'nurse' ? 'nurse' : 'triage');
    }
  };

  const handleLogout = () => {
    setRole('AUTH');
    setSelectedPatient(null);
    setCurrentOrg(null);
    setOnboardingStep(false);
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
    setSelectedPatient(null);
    setIsCarePlanOpen(false);
    setIsShiftNoteOpen(false);
  };

  const alertCount = patients.filter(p => p.triage_status === 'critical').length;

  // Root wrapper
  return (
    <div className="font-sans selection:bg-primary/20">
      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}

      <AnimatePresence mode="wait">
        {/* Auth Screen */}
        {role === 'AUTH' && (
          <motion.div key="auth" exit={{ opacity: 0 }}>
            <AuthView onLogin={handleLogin} />
          </motion.div>
        )}

        {/* Doctor Onboarding */}
        {role === 'doctor' && onboardingStep && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <OrgOnboarding onComplete={(org) => {
              setCurrentOrg(org);
              setOnboardingStep(false);
              setActiveScreen('triage');
              showToast(`Connected to ${org.name}`, 'success');
            }} />
          </motion.div>
        )}

        {/* Main Application Area */}
        {role !== 'AUTH' && (!onboardingStep) && (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-bg">
            {role !== 'patient' && (
              <TopNav
                role={role as any}
                userName={role === 'doctor' ? 'Dr. Amit Shah' : role === 'nurse' ? 'Nurse Sarah' : 'Admin User'}
                alertCount={alertCount}
                activeScreen={activeScreen}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            )}

            <main className="flex-1">
              {/* Patient App */}
              {role === 'patient' && (
                <PatientApp patientName="Priya Mehta" onLogout={handleLogout} />
              )}

              {/* Shared Screens */}
              {activeScreen === 'profile' && (
                <ProfileView 
                  profile={MOCK_PROFILES[0]} 
                  isOwnProfile={true}
                  onBack={() => handleNavigate(role === 'admin' ? 'admin-home' : role === 'nurse' ? 'nurse' : 'triage')}
                />
              )}

              {/* Doctor Screens */}
              {role === 'doctor' && (
                <>
                  {activeScreen === 'triage' && !selectedPatient && (
                    <TriageDashboard
                      patients={patients}
                      onSelectPatient={p => setSelectedPatient(p)}
                      onRegisterNew={() => handleNavigate('staff')}
                    />
                  )}
                  {activeScreen === 'doctor-discovery' && (
                    <DoctorDirectory role="doctor" />
                  )}
                </>
              )}

              {/* Nurse Screens */}
              {role === 'nurse' && (
                <>
                  {(activeScreen === 'nurse' || activeScreen === 'triage') && !selectedPatient && (
                    <NurseDashboard
                      patients={patients}
                      onSelectPatient={p => setSelectedPatient(p)}
                      onTriggerSMS={p => { setSmsPatient(p); setIsSMSOpen(true); }}
                    />
                  )}
                </>
              )}

              {/* Admin Screens */}
              {role === 'admin' && (
                <>
                  {activeScreen === 'admin-home' && !selectedPatient && (
                    <AdminView
                      patients={patients}
                      onSelectPatient={p => setSelectedPatient(p)}
                      onLogout={handleLogout}
                    />
                  )}
                  {activeScreen === 'staff' && (
                    <DoctorDirectory role="admin" />
                  )}
                </>
              )}

              {/* Static Placeholders */}
              {['appointments', 'alerts', 'careplans', 'shiftnotes'].includes(activeScreen) && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <div className="p-4 bg-gray-bg border border-gray-border rounded-full text-gray-disabled">
                    {activeScreen === 'appointments' ? <Calendar className="w-12 h-12" /> : 
                     activeScreen === 'alerts' ? <Bell className="w-12 h-12" /> : 
                     activeScreen === 'careplans' ? <ClipboardList className="w-12 h-12" /> : <BookOpen className="w-12 h-12" />}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-navy capitalize">{activeScreen}</h2>
                  <p className="text-gray-secondary max-w-sm">This module is under construction for the Supabase backend migration.</p>
                  <button className="btn-secondary mt-4" onClick={() => handleNavigate(role === 'admin' ? 'admin-home' : role === 'nurse' ? 'nurse' : 'triage')}>
                    Back to Dashboard
                  </button>
                </div>
              )}

              {/* Overlays */}
              <AnimatePresence>
                {selectedPatient && (
                  <PatientProfile
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    onEditCarePlan={() => setIsCarePlanOpen(true)}
                    onWriteShiftNote={() => setIsShiftNoteOpen(true)}
                  />
                )}
              </AnimatePresence>

              {selectedPatient && (
                <CarePlanEditor
                  patient={selectedPatient}
                  isOpen={isCarePlanOpen}
                  onClose={() => setIsCarePlanOpen(false)}
                  onSaved={() => { showToast('Care plan saved.'); setIsCarePlanOpen(false); }}
                />
              )}

              {selectedPatient && (
                <ShiftNoteEditor
                  patient={selectedPatient}
                  isOpen={isShiftNoteOpen}
                  onClose={() => setIsShiftNoteOpen(false)}
                />
              )}

              {smsPatient && (
                <SMSTrigger
                  patient={smsPatient}
                  isOpen={isSMSOpen}
                  onClose={() => { setIsSMSOpen(false); setSmsPatient(null); showToast('Reminder sent.'); }}
                />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
