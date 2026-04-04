import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, ChevronRight, Filter, Search, MessageSquare, Phone, AlertCircle, Check } from 'lucide-react';
import { Patient } from '../types';
import { Badge, Avatar, SearchInput, EmptyState } from '../components/UI';

interface NurseDashboardProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onTriggerSMS: (p: Patient) => void;
}

const TASK_TYPES = [
  { id: 'vitals', label: 'Vitals Check', icon: '❤️' },
  { id: 'compliance', label: 'Non-Compliance', icon: '⚠️' },
  { id: 'reminder', label: 'SMS Reminder', icon: '📱' },
  { id: 'escalate', label: 'Escalate', icon: '🔴' },
];

export const NurseDashboard = ({ patients, onSelectPatient, onTriggerSMS }: NurseDashboardProps) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'pending' | 'no-app'>('all');
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const filtered = patients.filter(p => {
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'critical' ? p.triage_status === 'critical' :
      filter === 'pending' ? p.triage_status === 'pending' :
      !p.has_app_access;
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    const order = { critical: 0, pending: 1, stable: 2 };
    return order[a.triage_status] - order[b.triage_status];
  });

  const noAppPatients = patients.filter(p => !p.has_app_access);
  const criticalCount = patients.filter(p => p.triage_status === 'critical').length;
  const remainingTasks = patients.length * 2 - doneIds.size;

  return (
    <div className="min-h-screen bg-gray-bg pb-10">
      {/* Page header */}
      <header className="bg-white border-b border-gray-border px-6 py-5">
        <div className="max-w-[1100px] mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Task Queue</h1>
            <p className="text-sm text-gray-secondary mt-1">Nurse Sarah • <span className="font-semibold text-navy">{remainingTasks} tasks</span> remaining today</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search patients..." />
            <button className="btn-secondary"><Filter className="w-4 h-4" /> Filter</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-6 space-y-6">

        {/* Alert banners */}
        {criticalCount > 0 && (
          <div className="flex items-center gap-3 p-4 bg-critical/5 border border-critical/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-critical shrink-0" />
            <p className="text-sm font-semibold text-navy">{criticalCount} patient{criticalCount > 1 ? 's are' : ' is'} in critical status. Review immediately.</p>
          </div>
        )}
        {noAppPatients.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-pending/5 border border-pending/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-pending shrink-0" />
              <p className="text-sm font-semibold text-navy">{noAppPatients.length} patient{noAppPatients.length > 1 ? 's have' : ' has'} no app access — consider SMS/IVR reminder</p>
            </div>
            <button onClick={() => onTriggerSMS(noAppPatients[0])} className="btn-secondary py-1.5 text-xs">Send Reminder</button>
          </div>
        )}

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Patients' },
            { id: 'critical', label: 'Critical' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'no-app', label: 'No App Access' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${filter === f.id ? 'bg-primary text-white border-primary' : 'bg-white text-gray-secondary border-gray-border hover:border-primary hover:text-primary'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="bg-white border border-gray-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-border bg-gray-bg/30 flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest">Patient Tasks</h2>
            <span className="text-[10px] text-gray-secondary font-medium">{filtered.length} patients</span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="✅" title="No patients match your filter." />
          ) : (
            <div className="divide-y divide-gray-border">
              {filtered.map((patient) => {
                const isDone = doneIds.has(patient.id);
                const taskKey = `vitals-${patient.id}`;
                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-5 flex items-center gap-5 transition-colors ${isDone ? 'opacity-50' : 'hover:bg-gray-bg/30'}`}
                  >
                    {/* Avatar */}
                    <Avatar name={patient.full_name} size="md" color={patient.triage_status === 'critical' ? 'primary' : 'gray'} />

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => onSelectPatient(patient)} className="text-sm font-bold text-navy hover:text-primary transition-colors">{patient.full_name}</button>
                        <Badge variant={patient.triage_status === 'critical' ? 'danger' : patient.triage_status === 'pending' ? 'warning' : 'success'} size="sm">
                          {patient.triage_status}
                        </Badge>
                        {!patient.has_app_access && <Badge variant="warning" size="sm">No App</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-secondary">
                        <span><ClipboardList className="w-3 h-3 inline mr-1" />
                          {patient.triage_status === 'critical' ? 'Record vitals — overdue' :
                           !patient.has_app_access ? 'No app login — 48h — send reminder' :
                           'Morning vitals check due'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{patient.assigned_nurse_name}</span>
                      </div>
                    </div>

                    {/* Compliance bar */}
                    <div className="hidden sm:block w-24">
                      <div className="text-[10px] text-gray-secondary mb-1 font-medium">Compliance</div>
                      <div className="h-1.5 bg-gray-bg rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${patient.complianceRate}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-secondary mt-1">{patient.complianceRate}%</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!patient.has_app_access && (
                        <button onClick={() => onTriggerSMS(patient)} className="btn-secondary py-1.5 text-xs">
                          <MessageSquare className="w-3.5 h-3.5" /> SMS
                        </button>
                      )}
                      {patient.triage_status !== 'stable' && (
                        <button className="btn-secondary py-1.5 text-xs text-critical border-critical/30 hover:bg-critical/5">Escalate</button>
                      )}
                      <button
                        onClick={() => setDoneIds(prev => { const s = new Set(prev); s.add(patient.id); return s; })}
                        disabled={isDone}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'border-stable bg-stable/10 text-stable' : 'border-gray-border hover:border-primary hover:text-primary'}`}
                        title={isDone ? 'Done' : 'Mark done'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => onSelectPatient(patient)} className="p-2 hover:bg-gray-bg rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-secondary" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Done section */}
        {doneIds.size > 0 && (
          <div className="bg-white border border-gray-border rounded-2xl overflow-hidden">
            <button className="w-full px-6 py-4 text-left text-[10px] font-bold text-gray-secondary uppercase tracking-widest flex items-center justify-between">
              <span>Done today ({doneIds.size})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
