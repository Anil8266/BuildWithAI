import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Camera, Calendar, ClipboardList, Users, Bell, LogOut, ChevronRight, AlertCircle, Phone, Undo2 } from 'lucide-react';
import { PatientTask } from '../types';
import { MOCK_TASKS } from '../data';

interface PatientAppProps {
  patientName: string;
  onLogout: () => void;
}

const TASK_ICONS: Record<string, string> = {
  medication: '💊',
  photo_upload: '📷',
  appointment: '📅',
  general: '✅',
};
const TASK_DONE_LABELS: Record<string, string> = {
  medication: 'Done',
  photo_upload: 'Upload Photo',
  appointment: 'Confirm',
  general: 'Done',
};
const TIME_LABELS: Record<string, { label: string; color: string }> = {
  morning: { label: 'Morning', color: 'bg-amber-100 text-amber-700' },
  afternoon: { label: 'Afternoon', color: 'bg-blue-100 text-blue-700' },
  evening: { label: 'Evening', color: 'bg-indigo-100 text-indigo-700' },
  anytime: { label: 'Anytime', color: 'bg-gray-100 text-gray-600' },
};

const BOTTOM_TABS = [
  { id: 'TASKS', icon: ClipboardList, label: 'Tasks' },
  { id: 'TEAM', icon: Users, label: 'Care Team' },
  { id: 'APPT', icon: Calendar, label: 'Appointments' },
];

export const PatientApp = ({ patientName, onLogout }: PatientAppProps) => {
  const [tasks, setTasks] = useState<PatientTask[]>(MOCK_TASKS.filter(t => t.patient_id === 'p001'));
  const [activeTab, setActiveTab] = useState('TASKS');
  const [undoId, setUndoId] = useState<string | null>(null);
  const [skipModal, setSkipModal] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState('');
  const [notification] = useState(true);
  const [streak] = useState(5);

  const pending = tasks.filter(t => t.status === 'pending');
  const done = tasks.filter(t => t.status === 'done');
  const isAllDone = pending.length === 0 && tasks.length > 0;

  const handleDone = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'done' as const, completed_at: new Date().toISOString() } : t));
    setUndoId(taskId);
    setTimeout(() => setUndoId(null), 5000);
  };

  const handleUndo = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'pending' as const, completed_at: undefined } : t));
    setUndoId(null);
  };

  const handleSkip = () => {
    if (!skipModal) return;
    setTasks(prev => prev.map(t => t.id === skipModal ? { ...t, status: 'skipped' as const } : t));
    setSkipModal(null);
    setSkipReason('');
  };

  const firstName = patientName.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col" style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-border px-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-lg font-serif font-bold text-primary">SYNCRO</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-navy">{firstName}</span>
          <button className="relative p-1.5">
            <Bell className="w-5 h-5 text-gray-secondary" />
            {notification && <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-critical rounded-full border-2 border-white" />}
          </button>
          <button onClick={onLogout} className="p-1.5 text-gray-secondary hover:text-critical transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {activeTab === 'TASKS' && (
          <div className="p-5 space-y-5">
            {/* Doctor update banner */}
            {notification && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-primary-light border border-primary/20 rounded-xl">
                <span className="text-lg">👨‍⚕️</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">Dr. Shah updated your plan</p>
                  <p className="text-xs text-gray-secondary">New task added — check below</p>
                </div>
                <ChevronRight className="w-4 h-4 text-primary" />
              </motion.div>
            )}

            {/* Date + progress */}
            <div>
              <p className="text-[11px] font-bold text-gray-secondary uppercase tracking-widest">Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
              <div className="flex items-center justify-between mt-1 mb-3">
                <h1 className="text-2xl font-serif font-bold text-navy">Your Tasks</h1>
                <span className="text-sm font-bold text-primary">{done.length} of {tasks.length} done</span>
              </div>
              <div className="h-2 bg-gray-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: tasks.length > 0 ? `${(done.length / tasks.length) * 100}%` : '0%' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isAllDone ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center text-center gap-5">
                  <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-navy">All done for today.</h2>
                    <p className="text-sm text-gray-secondary mt-2">
                      🔥 {streak}-day streak! Keep it up.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-stable/10 border border-stable/20 rounded-full">
                    <span className="text-stable font-bold text-sm">Dr. Shah has been notified</span>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {/* Pending */}
                  {pending.map(task => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30, scale: 0.95 }}
                      className={`bg-white border-2 rounded-2xl overflow-hidden ${task.is_urgent ? 'border-critical/30' : 'border-gray-border'}`}>
                      {task.is_urgent && (
                        <div className="bg-critical/10 px-4 py-2 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-critical" />
                          <span className="text-[11px] font-bold text-critical uppercase tracking-widest">Urgent — do this now</span>
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${task.is_urgent ? 'bg-critical/10' : 'bg-primary-light'}`}>
                            {TASK_ICONS[task.task_type]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-base font-bold text-navy leading-tight">{task.instruction}</h4>
                              {task.time_of_day && TIME_LABELS[task.time_of_day] && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${TIME_LABELS[task.time_of_day].color}`}>
                                  {TIME_LABELS[task.time_of_day].label}
                                </span>
                              )}
                            </div>
                            {task.context_note && (
                              <p className="text-xs text-gray-secondary leading-relaxed">{task.context_note}</p>
                            )}
                          </div>
                        </div>

                        <button onClick={() => handleDone(task.id)}
                          className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-transform shadow-md shadow-primary/20">
                          {TASK_DONE_LABELS[task.task_type]}
                        </button>

                        {/* Undo */}
                        {undoId === task.id && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-stable font-semibold">✓ Logged. Dr. Shah has been notified.</span>
                            <button onClick={() => handleUndo(task.id)} className="flex items-center gap-1 text-xs text-gray-secondary hover:text-navy">
                              <Undo2 className="w-3.5 h-3.5" /> Undo
                            </button>
                          </motion.div>
                        )}

                        <button onClick={() => setSkipModal(task.id)} className="w-full text-center mt-2 text-xs text-gray-secondary hover:text-navy transition-colors py-1">
                          I can't do this now
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Done tasks (collapsed) */}
                  {done.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-gray-secondary uppercase tracking-widest">Completed</p>
                      {done.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-4 bg-white border border-gray-border rounded-xl opacity-60">
                          <CheckCircle2 className="w-5 h-5 text-stable shrink-0" />
                          <span className="text-sm font-medium text-gray-secondary line-through">{task.instruction}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* Emergency CTA */}
            <div className="p-5 bg-critical/5 border border-critical/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-critical rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">Need urgent help?</h3>
                  <p className="text-xs text-gray-secondary">Tap below to call your nurse immediately.</p>
                </div>
              </div>
              <button className="w-full bg-critical text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-critical/20">
                <Phone className="w-4 h-4" /> Call Nurse Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'TEAM' && (
          <div className="p-5 space-y-5">
            <h1 className="text-2xl font-serif font-bold text-navy">My Care Team</h1>
            {[
              { name: 'Dr. Amit Shah', role: 'Cardiologist (Lead)', initials: 'AS', online: true },
              { name: 'Nurse Sarah', role: 'Primary Nurse', initials: 'SN', online: false },
            ].map(m => (
              <div key={m.name} className="bg-white border border-gray-border rounded-2xl p-5 flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-lg">{m.initials}</div>
                  {m.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-stable rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-navy">{m.name}</div>
                  <div className="text-xs text-gray-secondary">{m.role}</div>
                </div>
                <button className="btn-secondary text-xs py-2"><Phone className="w-3.5 h-3.5" /> Contact</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'APPT' && (
          <div className="p-5 space-y-5">
            <h1 className="text-2xl font-serif font-bold text-navy">Appointments</h1>
            <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-xl">📅</div>
                <div>
                  <div className="font-bold text-navy">Dr. Amit Shah</div>
                  <div className="text-xs text-gray-secondary">Friday, 10 April • 10:00 AM</div>
                  <div className="text-xs text-gray-secondary">In-Person Visit • St. Jude Medical Center</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-xs py-2">Add to Calendar</button>
                <button className="flex-1 btn-primary text-xs py-2">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-border px-6 py-3 flex justify-around items-center z-50">
        {BOTTOM_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-gray-secondary'}`}>
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Skip reason modal */}
      <AnimatePresence>
        {skipModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSkipModal(null)}
              className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-120" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-130 p-6 space-y-5">
              <div className="w-10 h-1 bg-gray-border rounded-full mx-auto" />
              <h3 className="text-lg font-serif font-bold text-navy">Let Dr. Shah know why</h3>
              <div className="space-y-2">
                {['Felt sick', 'Forgot', 'Couldn\'t access medication', 'Other'].map(r => (
                  <button key={r} onClick={() => setSkipReason(r)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${skipReason === r ? 'border-primary bg-primary-light text-primary' : 'border-gray-border hover:border-primary hover:text-primary'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <button onClick={handleSkip} disabled={!skipReason} className="w-full btn-primary py-3.5 disabled:opacity-50">
                Let Dr. Shah know
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
