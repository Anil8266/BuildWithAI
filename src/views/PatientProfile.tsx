import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit2, Calendar, Flag, Activity, ClipboardList, FileText, Stethoscope, Plus, Phone, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Patient } from '../types';
import { Badge, Avatar, BackButton } from '../components/UI';

const VITALS_DATA = [
  { time: '08:00', systolic: 142, diastolic: 88, hr: 72 },
  { time: '10:00', systolic: 158, diastolic: 92, hr: 84 },
  { time: '12:00', systolic: 162, diastolic: 98, hr: 88 },
  { time: '14:00', systolic: 155, diastolic: 94, hr: 82 },
  { time: '16:00', systolic: 148, diastolic: 90, hr: 78 },
  { time: '18:00', systolic: 165, diastolic: 96, hr: 91 },
];

const TABS = [
  { id: 'care-plan', label: 'Care Plan', icon: Stethoscope },
  { id: 'vitals', label: 'Vitals', icon: Activity },
  { id: 'compliance', label: 'Compliance', icon: ClipboardList },
  { id: 'notes', label: 'Shift Notes', icon: FileText },
];

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
  onEditCarePlan: () => void;
  onWriteShiftNote: () => void;
}

const ShiftNoteBlock = ({ note, onEdit }: { note?: string; onEdit: () => void }) => (
  <div className={`rounded-r-xl border-l-4 p-4 mb-5 ${note ? 'bg-primary-light border-primary' : 'bg-amber-50 border-pending'}`}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Current Shift Note</p>
        {note ? (
          <p className="text-sm text-navy font-medium leading-relaxed">"{note}"</p>
        ) : (
          <p className="text-sm text-pending font-medium italic">No shift note for this patient. Add one before your shift ends.</p>
        )}
      </div>
      <button onClick={onEdit} className="shrink-0 p-1.5 hover:bg-white/50 rounded-lg transition-colors">
        <Edit2 className="w-4 h-4 text-primary" />
      </button>
    </div>
  </div>
);

const VitalsTab = () => (
  <div className="space-y-6">
    <div className="bg-white border border-gray-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif font-bold text-navy">Blood Pressure Trend</h3>
          <p className="text-xs text-gray-secondary mt-1">Last 24 hours • Threshold: 140/90 mmHg</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', 'All'].map(r => (
            <button key={r} className="px-3 py-1 text-xs font-bold rounded-full border border-gray-border hover:border-primary hover:text-primary transition-colors">{r}</button>
          ))}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={VITALS_DATA}>
            <defs>
              <linearGradient id="gradSys" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C0392B" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#C0392B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C757D' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C757D' }} domain={[60, 180]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E9ECEF', fontSize: 12 }} />
            {/* Threshold line at 140 */}
            <Area type="monotone" dataKey="systolic" stroke="#C0392B" fill="url(#gradSys)" strokeWidth={2} dot={{ r: 3, fill: '#C0392B' }} />
            <Area type="monotone" dataKey="diastolic" stroke="#2563EB" fill="transparent" strokeWidth={2} strokeDasharray="4 2" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-6 mt-3">
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-critical inline-block" /><span className="text-[11px] text-gray-secondary">Systolic</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-blue-500 inline-block border-dashed" /><span className="text-[11px] text-gray-secondary">Diastolic</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-px bg-critical/40 inline-block border border-dashed border-critical" /><span className="text-[11px] text-critical">Threshold 140</span></div>
      </div>
    </div>

    {/* Manual entry */}
    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-border rounded-xl text-sm font-semibold text-gray-secondary hover:border-primary hover:text-primary transition-colors">
      <Plus className="w-4 h-4" /> Add Manual Reading
    </button>
  </div>
);

const ComplianceTab = ({ patient }: { patient: Patient }) => {
  const days = Array.from({ length: 28 }, (_, i) => {
    const r = Math.random();
    return r > 0.8 ? 'missed' : r > 0.5 ? 'partial' : 'done';
  });
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif font-bold text-navy">Compliance Heatmap</h3>
            <p className="text-xs text-gray-secondary mt-1">Last 28 days task completion</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-serif font-bold text-primary">{patient.complianceRate}%</div>
            <div className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest">Avg Compliance</div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] font-bold text-gray-secondary text-center">{d}</div>
          ))}
          {days.map((d, i) => (
            <div key={i} title={d === 'done' ? 'All done' : d === 'partial' ? 'Partial' : 'Missed'}
              className={`aspect-square rounded-lg transition-transform hover:scale-110 cursor-pointer ${d === 'done' ? 'bg-stable/30 border border-stable/20' : d === 'partial' ? 'bg-pending/30 border border-pending/20' : 'bg-critical/20 border border-critical/10'}`} />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-stable/30 border border-stable/20 inline-block" /><span className="text-[11px] text-gray-secondary">All done</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-pending/30 border border-pending/20 inline-block" /><span className="text-[11px] text-gray-secondary">Partial</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-critical/20 inline-block" /><span className="text-[11px] text-gray-secondary">Missed</span></div>
        </div>
      </div>
    </div>
  );
};

const NotesTab = ({ note, onEdit }: { note?: string; onEdit: () => void }) => (
  <div className="space-y-4">
    <div className="bg-white border border-gray-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-navy">Shift Notes</h3>
        <button onClick={onEdit} className="btn-secondary py-1.5 text-xs">Write Note</button>
      </div>
      {note ? (
        <div className="space-y-3">
          <div className="shift-note-block">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Current</p>
            <p className="text-sm text-navy leading-relaxed">"{note}"</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-secondary">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No notes yet</p>
          <p className="text-xs mt-1">Write a shift note before logging off</p>
        </div>
      )}
    </div>
  </div>
);

const CarePlanTab = ({ onEdit }: { onEdit: () => void }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-bold text-gray-secondary uppercase tracking-widest">Active Medications</h3>
      <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
        <Edit2 className="w-3.5 h-3.5" /> Modify Plan
      </button>
    </div>
    {[
      { name: 'Lisinopril', dose: '20mg', freq: 'Once Daily (Morning)', note: 'Take with food — blood pressure management', changed: true },
      { name: 'Atorvastatin', dose: '10mg', freq: 'Once Daily (Evening)', note: 'Before bed — cholesterol management', changed: false },
    ].map((med, i) => (
      <div key={i} className="bg-white border border-gray-border rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-navy">{med.name} {med.dose}</span>
            {med.changed && <Badge variant="warning" size="sm">Recently changed</Badge>}
          </div>
          <p className="text-xs text-gray-secondary">{med.freq}</p>
          <p className="text-xs text-gray-secondary mt-1">{med.note}</p>
        </div>
      </div>
    ))}

    <button onClick={onEdit} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-border rounded-xl text-sm font-semibold text-gray-secondary hover:border-primary hover:text-primary transition-colors">
      <Plus className="w-4 h-4" /> Add Care Plan Entry
    </button>
  </div>
);

export const PatientProfile = ({ patient, onClose, onEditCarePlan, onWriteShiftNote }: PatientProfileProps) => {
  const [activeTab, setActiveTab] = useState('care-plan');

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-60 bg-gray-bg flex flex-col"
    >
      {/* Sticky patient identity bar */}
      <header className="bg-white border-b border-gray-border px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1300px] mx-auto">
          {/* Back + actions row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <BackButton onClick={onClose} label="Back to Triage" />
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={onWriteShiftNote} className="btn-secondary py-2 text-xs">
                <FileText className="w-3.5 h-3.5" /> Shift Note
              </button>
              <button className="btn-secondary py-2 text-xs">
                <Calendar className="w-3.5 h-3.5" /> Book Appointment
              </button>
              <button onClick={onEditCarePlan} className="btn-primary py-2 text-xs shadow-md shadow-primary/20">
                <Edit2 className="w-3.5 h-3.5" /> Edit Care Plan
              </button>
              <button className="h-9 px-3 flex items-center gap-1.5 text-xs font-semibold text-critical border border-critical/30 rounded-lg hover:bg-critical/5 transition-colors">
                <Flag className="w-3.5 h-3.5" /> Flag
              </button>
            </div>
          </div>

          {/* Patient identity */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar name={patient.full_name} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-serif font-bold text-navy">{patient.full_name}</h1>
                <Badge variant={patient.triage_status === 'critical' ? 'danger' : patient.triage_status === 'pending' ? 'warning' : 'success'}>
                  {patient.triage_status}
                </Badge>
                {patient.has_app_access ? (
                  <Badge variant="success" size="sm">App Active</Badge>
                ) : (
                  <Badge variant="warning" size="sm">No App Access</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <p className="text-xs text-gray-secondary">Age {patient.age} • DOB {patient.date_of_birth}</p>
                <p className="text-xs font-mono text-gray-secondary">{patient.mrn}</p>
                {patient.icd10_diagnoses?.map(d => (
                  <span key={d} className="text-[10px] bg-navy-surface text-navy px-2 py-0.5 rounded font-mono">{d}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto flex items-center md:block justify-between border-t md:border-t-0 border-gray-border pt-3 md:pt-0">
              <div>
                <div className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest md:hidden">Compliance</div>
                <div className="text-2xl font-serif font-bold text-primary">{patient.complianceRate}%</div>
              </div>
              <div className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest hidden md:block">Compliance</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto lg:overflow-hidden flex flex-col lg:flex-row max-w-[1300px] w-full mx-auto">
        {/* Left sidebar */}
        <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-border bg-white lg:overflow-y-auto p-5 space-y-6 scrollbar-hide">

          {/* Shift Note */}
          <ShiftNoteBlock note={patient.current_shift_note} onEdit={onWriteShiftNote} />

          {/* Current vitals */}
          <section>
            <h3 className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-3">Current Vitals</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'BP', value: '165/95', unit: 'mmHg', alert: true },
                { label: 'HR', value: '88', unit: 'bpm', alert: false },
                { label: 'SpO2', value: '98', unit: '%', alert: false },
                { label: 'Temp', value: '98.6', unit: '°F', alert: false },
              ].map(v => (
                <div key={v.label} className={`p-3 rounded-xl border ${v.alert ? 'bg-critical/5 border-critical/20' : 'bg-gray-bg border-gray-border'}`}>
                  <div className="text-[9px] font-bold text-gray-secondary uppercase tracking-widest mb-1">{v.label}</div>
                  <div className={`text-lg font-bold leading-none ${v.alert ? 'text-critical' : 'text-navy'}`}>{v.value}</div>
                  <div className="text-[9px] text-gray-secondary mt-0.5">{v.unit}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Care team */}
          <section>
            <h3 className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-3">Care Team</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-primary-light/40 rounded-xl border border-primary/10">
                <Avatar name="Amit Shah" size="sm" />
                <div>
                  <div className="text-sm font-bold text-navy">Dr. Amit Shah</div>
                  <div className="text-[10px] text-primary font-bold uppercase">Cardiologist (Lead)</div>
                </div>
              </div>
              {patient.assigned_nurse_name && (
                <div className="flex items-center gap-3 p-3 bg-gray-bg rounded-xl border border-gray-border">
                  <Avatar name={patient.assigned_nurse_name} size="sm" color="gray" />
                  <div>
                    <div className="text-sm font-bold text-navy">{patient.assigned_nurse_name}</div>
                    <div className="text-[10px] text-gray-secondary font-bold uppercase">Primary Nurse</div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-3">Contact</h3>
            <div className="space-y-2">
              {patient.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-body">
                  <Phone className="w-3.5 h-3.5 text-gray-secondary" /> {patient.phone}
                </div>
              )}
              {patient.emergency_contact && (
                <div className="p-3 bg-gray-bg rounded-xl border border-gray-border">
                  <div className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-1">Emergency Contact</div>
                  <div className="text-xs font-bold text-navy">{patient.emergency_contact.name}</div>
                  <div className="text-xs text-gray-secondary">{patient.emergency_contact.relationship} • {patient.emergency_contact.phone}</div>
                </div>
              )}
            </div>
          </section>

          <button className="w-full btn-secondary py-3 text-xs">
            <MessageSquare className="w-4 h-4" /> Message {patient.assigned_nurse_name || 'Nurse'}
          </button>
        </aside>

        {/* Main content with tabs */}
        <main className="flex-1 lg:overflow-y-auto">
          {/* Tab bar */}
          <div className="bg-white border-b border-gray-border px-6 sticky top-0 z-10">
            <div className="flex gap-6">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-secondary hover:text-navy'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {activeTab === 'care-plan' && <CarePlanTab onEdit={onEditCarePlan} />}
                {activeTab === 'vitals' && <VitalsTab />}
                {activeTab === 'compliance' && <ComplianceTab patient={patient} />}
                {activeTab === 'notes' && <NotesTab note={patient.current_shift_note} onEdit={onWriteShiftNote} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </motion.div>
  );
};
