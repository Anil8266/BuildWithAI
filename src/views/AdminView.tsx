import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Search, Users, AlertCircle, Activity, X, Check, ChevronRight } from 'lucide-react';
import { Patient } from '../types';
import { Badge, Avatar, SearchInput, EmptyState } from '../components/UI';

interface AdminViewProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onLogout: () => void;
}

const STEP1_FIELDS = [
  { key: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Priya Mehta', required: true },
  { key: 'date_of_birth', label: 'Date of Birth', type: 'date', placeholder: '', required: true },
  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', required: true },
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'priya@example.com', required: false },
];

const STEP2_FIELDS = [
  { key: 'address', label: 'Address', type: 'text', placeholder: '12, Andheri West, Mumbai', required: false },
  { key: 'emergency_name', label: 'Emergency Contact Name', type: 'text', placeholder: 'Raj Mehta', required: false },
  { key: 'emergency_phone', label: 'Emergency Contact Phone', type: 'tel', placeholder: '+91 98765 43211', required: false },
  { key: 'icd10', label: 'ICD-10 Diagnosis Code(s)', type: 'text', placeholder: 'I10, E11.9', required: false },
];

export const AdminView = ({ patients, onSelectPatient, onLogout }: AdminViewProps) => {
  const [search, setSearch] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Record<string, string>>({});
  const [isDone, setIsDone] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'pending' | 'stable'>('all');

  const filtered = patients.filter(p => {
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) || (p.mrn || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeFilter === 'all' || p.triage_status === activeFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: patients.length,
    critical: patients.filter(p => p.triage_status === 'critical').length,
    stable: patients.filter(p => p.triage_status === 'stable').length,
  };

  const handleRegister = () => {
    if (step === 1) { setStep(2); return; }
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      setIsRegistering(false);
      setStep(1);
      setForm({});
    }, 2000);
  };

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-gray-bg pb-10">
      {/* Page header */}
      <header className="bg-white border-b border-gray-border px-6 py-5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Organization Management</h1>
            <p className="text-sm text-gray-secondary mt-1">St. Jude Medical Center • HOSP-001</p>
          </div>
          <button onClick={() => setIsRegistering(true)} className="btn-primary shadow-md shadow-primary/20">
            <UserPlus className="w-4 h-4" /> Onboard Patient
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', value: stats.total, icon: Users, color: 'text-navy' },
            { label: 'Critical', value: stats.critical, icon: AlertCircle, color: 'text-critical' },
            { label: 'Stable', value: stats.stable, icon: Activity, color: 'text-stable' },
            { label: 'Staff Members', value: 24, icon: Users, color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-border rounded-xl p-5">
              <div className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`text-3xl font-serif font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Patient directory */}
        <div className="bg-white border border-gray-border rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-border bg-gray-bg/30 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest">Patient Directory</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {(['all', 'critical', 'pending', 'stable'] as const).map(s => (
                  <button key={s} onClick={() => setActiveFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border capitalize ${activeFilter === s ? 'bg-primary text-white border-primary' : 'bg-white text-gray-secondary border-gray-border hover:border-primary hover:text-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <SearchInput value={search} onChange={setSearch} placeholder="Search by name or MRN..." />
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <EmptyState icon="🔍" title={search ? `No results for "${search}"` : 'No patients found.'} subtitle={search ? 'Try a different name or MRN.' : undefined} />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-bg/30">
                  {['Patient', 'MRN', 'Date of Birth', 'Compliance', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-[10px] font-bold text-gray-secondary uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-border">
                {filtered.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-bg/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={patient.full_name} size="sm" color={patient.triage_status === 'critical' ? 'primary' : 'gray'} />
                        <div>
                          <div className="text-sm font-bold text-navy">{patient.full_name}</div>
                          <div className="text-[11px] text-gray-secondary">{patient.email || patient.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-secondary">{patient.mrn}</td>
                    <td className="px-6 py-4 text-xs text-gray-secondary">{patient.date_of_birth}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-bg rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${patient.complianceRate}%` }} />
                        </div>
                        <span className="text-xs font-bold text-navy">{patient.complianceRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={patient.triage_status === 'critical' ? 'danger' : patient.triage_status === 'pending' ? 'warning' : 'success'}>
                        {patient.triage_status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onSelectPatient(patient)} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                          View <ChevronRight className="w-3 h-3" />
                        </button>
                        <button className="text-gray-secondary text-xs font-bold hover:underline">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegistering && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsRegistering(false); setStep(1); setForm({}); }}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-100" />
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-2xl z-110 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

              {/* Modal header */}
              <div className="px-8 py-6 border-b border-gray-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-navy">
                    {isDone ? 'Patient Registered!' : `Onboard New Patient — Step ${step} of 2`}
                  </h2>
                  <p className="text-xs text-gray-secondary mt-1">
                    {isDone ? 'Invite sent. They will receive an SMS to set up their account.' : step === 1 ? 'Basic information' : 'Additional details & care team'}
                  </p>
                </div>
                {!isDone && (
                  <button onClick={() => { setIsRegistering(false); setStep(1); setForm({}); }} className="p-2 hover:bg-gray-bg rounded-full transition-colors">
                    <X className="w-5 h-5 text-navy" />
                  </button>
                )}
              </div>

              {isDone ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-16 h-16 bg-stable/10 border-2 border-stable/30 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-stable" />
                  </div>
                  <p className="text-sm text-gray-secondary">Records merged. {form.full_name || 'Patient'} is now active.</p>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="h-1 bg-gray-border">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${step * 50}%` }} />
                  </div>

                  <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-2 gap-5">
                      {(step === 1 ? STEP1_FIELDS : STEP2_FIELDS).map(f => (
                        <div key={f.key} className={f.key === 'full_name' || f.key === 'address' ? 'col-span-2' : ''}>
                          <label className="form-label">{f.label} {f.required && <span className="text-critical">*</span>}</label>
                          <input
                            type={f.type}
                            value={form[f.key] || ''}
                            onChange={e => update(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            className="form-input"
                          />
                        </div>
                      ))}
                      {step === 2 && (
                        <div className="col-span-2">
                          <label className="form-label">Assign Doctor</label>
                          <select className="form-input">
                            <option>Dr. Amit Shah — Cardiologist</option>
                            <option>Dr. Priya Verma — Endocrinologist</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-8 py-5 border-t border-gray-border bg-gray-bg/40 flex gap-3">
                    {step > 1 && (
                      <button onClick={() => setStep(1)} className="btn-ghost border border-gray-border flex-1">Back</button>
                    )}
                    <button onClick={() => { setIsRegistering(false); setStep(1); setForm({}); }} className="btn-ghost">Cancel</button>
                    <button onClick={handleRegister} className="btn-primary flex-1 shadow-md shadow-primary/20">
                      {step === 1 ? 'Continue →' : 'Register & Send Invite'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
