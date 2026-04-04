import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Bell, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { UserRole } from '../types';

interface TopNavProps {
  role: UserRole;
  userName?: string;
  alertCount?: number;
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
  onLogout: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  doctor: 'Doctor',
  nurse: 'Nurse',
  patient: 'Patient',
};

const OPS_ITEMS = [
  { id: 'triage', label: 'Triage Dashboard', desc: 'Real-time patient status' },
  { id: 'doctor-discovery', label: 'Doctor Discovery', desc: 'Browse specialists' },
  { id: 'careplans', label: 'Care Plans', desc: 'Active plans by status' },
  { id: 'appointments', label: 'Appointments', desc: 'Schedule and calendar' },
  { id: 'alerts', label: 'Alert History', desc: 'Past and active alerts' },
  { id: 'shiftnotes', label: 'Shift Notes', desc: 'Handoff management' },
];

export const TopNav = ({ role, userName = 'Dr. Amit Shah', alertCount = 3, activeScreen, onNavigate, onLogout }: TopNavProps) => {
  const [isOpsOpen, setIsOpsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const initials = userName.split(' ').filter(w => w !== 'Dr.' && w !== 'Nurse').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const handleNav = (screen: string) => {
    onNavigate?.(screen);
    setIsOpsOpen(false);
    setIsMobileOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-border sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <button onClick={() => handleNav(role === 'admin' ? 'admin-home' : role === 'nurse' ? 'nurse-dashboard' : 'triage')}
          className="flex items-center gap-2 group">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-serif text-xl font-bold text-primary tracking-[-0.01em]">SYNCRO</span>
        </button>

        {/* Center: Nav — provider only */}
        {(role === 'doctor' || role === 'nurse') && (
          <nav className="hidden md:flex items-center gap-1">
            {/* Operations Mega Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOpsOpen(v => !v)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isOpsOpen ? 'text-primary bg-primary-light' : 'text-navy hover:text-primary hover:bg-gray-bg'}`}
              >
                Operations <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-border rounded-xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                      <div className="px-3 py-2 text-[10px] font-bold text-gray-secondary uppercase tracking-widest">Clinical Views</div>
                      {OPS_ITEMS.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleNav(item.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group flex items-start gap-3 ${activeScreen === item.id ? 'bg-primary-light text-primary' : 'hover:bg-gray-bg'}`}
                        >
                          <div>
                            <div className={`text-sm font-semibold ${activeScreen === item.id ? 'text-primary' : 'text-navy'}`}>{item.label}</div>
                            <div className="text-[11px] text-gray-secondary">{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => handleNav('appointments')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeScreen === 'appointments' ? 'text-primary bg-primary-light' : 'text-navy hover:text-primary hover:bg-gray-bg'}`}>
              Appointments
            </button>
            <button onClick={() => handleNav('alerts')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeScreen === 'alerts' ? 'text-primary bg-primary-light' : 'text-navy hover:text-primary hover:bg-gray-bg'}`}>
              Alerts
            </button>
            <button onClick={() => handleNav('profile')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeScreen === 'profile' ? 'text-primary bg-primary-light' : 'text-navy hover:text-primary hover:bg-gray-bg'}`}>
              My Profile
            </button>
          </nav>
        )}

        {/* Admin nav */}
        {role === 'admin' && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'admin-home', label: 'Dashboard' },
              { id: 'patients', label: 'Patients' },
              { id: 'staff', label: 'Staff Management' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'profile', label: 'My Profile' },
            ].map(item => (
              <button key={item.id} onClick={() => handleNav(item.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeScreen === item.id ? 'text-primary bg-primary-light' : 'text-navy hover:text-primary hover:bg-gray-bg'}`}>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Right: User controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-navy-surface rounded-full">
          <span className="text-[10px] font-bold text-navy uppercase tracking-wider">{ROLE_LABELS[role]}</span>
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">{initials}</div>
        </div>

        {alertCount > 0 && (
          <button onClick={() => handleNav('alerts')} className="relative p-2 text-navy hover:bg-gray-bg rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-critical text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          </button>
        )}

        <button onClick={onLogout} className="p-2 text-gray-secondary hover:text-critical transition-colors" title="Sign out">
          <LogOut className="w-5 h-5" />
        </button>

        {/* Mobile hamburger */}
        {(role === 'doctor' || role === 'nurse') && (
          <button onClick={() => setIsMobileOpen(v => !v)} className="md:hidden p-2 text-navy">
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-border p-4 space-y-1 md:hidden shadow-lg z-50"
          >
            {OPS_ITEMS.map(item => (
              <button key={item.id} onClick={() => handleNav(item.id)}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-navy hover:bg-gray-bg rounded-lg transition-colors">
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
