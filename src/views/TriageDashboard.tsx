import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, RefreshCcw, Filter, ChevronRight, AlertCircle, Clock, Search } from 'lucide-react';
import { Patient } from '../types';
import { Badge, EmptyState, SearchInput } from '../components/UI';

interface TriageDashboardProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onRegisterNew: () => void;
}

const COLUMNS = [
  { id: 'critical', label: 'Critical', status: 'critical' as const, badgeVariant: 'danger' as const, border: 'border-l-critical', bg: 'bg-red-50/40', actionLabel: 'Act Now', actionClass: 'bg-critical text-white hover:bg-[#a93226]' },
  { id: 'pending',  label: 'Pending Review', status: 'pending' as const, badgeVariant: 'warning' as const, border: 'border-l-pending', bg: 'bg-amber-50/40', actionLabel: 'Review Now', actionClass: 'bg-pending text-white hover:bg-[#b45309]' },
  { id: 'stable',  label: 'Stable', status: 'stable' as const, badgeVariant: 'success' as const, border: 'border-l-stable', bg: 'bg-emerald-50/30', actionLabel: 'View Patient', actionClass: 'bg-white border border-gray-border text-navy hover:bg-gray-bg' },
];

const timeAgo = (iso?: string) => {
  if (!iso) return 'N/A';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
};

const PatientCard: React.FC<{ patient: Patient; col: typeof COLUMNS[0]; onClick: () => void }> = ({ patient, col, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`bg-white border border-gray-border border-l-4 ${col.border} rounded-xl p-5 cursor-pointer hover:shadow-md transition-all group`}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-serif text-base font-bold text-navy leading-tight">{patient.full_name}</h3>
        <p className="text-[11px] text-gray-secondary font-medium mt-0.5">
          Age {patient.age} • <span className="font-mono">{patient.mrn}</span>
        </p>
      </div>
      <Badge variant={col.badgeVariant} size="sm">{col.label}</Badge>
    </div>

    {/* Primary alert */}
    {patient.latest_alert_title && (
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${patient.triage_status === 'critical' ? 'text-critical' : patient.triage_status === 'pending' ? 'text-pending' : 'text-stable'}`} />
        <span className="text-xs font-bold text-navy leading-snug">{patient.latest_alert_title}</span>
      </div>
    )}

    {/* Shift note */}
    {patient.current_shift_note ? (
      <p className="text-[11px] text-primary italic line-clamp-1 mb-3 pl-1 border-l-2 border-primary/30">
        "{patient.current_shift_note}"
      </p>
    ) : (
      <p className="text-[11px] text-gray-disabled italic mb-3 pl-1">No shift note</p>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-gray-border">
      <div className="flex items-center gap-2">
        <Clock className="w-3 h-3 text-gray-secondary" />
        <span className="text-[10px] text-gray-secondary font-medium">{timeAgo(patient.last_app_activity)}</span>
        {patient.assigned_nurse_name && (
          <>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-[10px] text-gray-secondary">{patient.assigned_nurse_name}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-secondary">{patient.complianceRate}%</span>
        <ChevronRight className="w-4 h-4 text-gray-secondary group-hover:text-primary transition-colors" />
      </div>
    </div>
  </motion.div>
);

export const TriageDashboard = ({ patients, onSelectPatient, onRegisterNew }: TriageDashboardProps) => {
  const [search, setSearch] = useState('');
  const [lastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'critical' | 'pending' | 'stable'>('critical');

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.mrn || '').toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = filtered.filter(p => p.triage_status === 'critical').length;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-bg">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-border px-6 py-5 shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif font-bold text-navy">Triage Dashboard</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-gray-secondary font-medium">Dr. Amit Shah • St. Jude Medical Center</p>
              <span className="text-gray-300">•</span>
              <button className="flex items-center gap-1.5 text-xs text-gray-secondary hover:text-primary transition-colors">
                <RefreshCcw className="w-3 h-3" />
                Updated {timeAgo(lastUpdated.toISOString())}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search patients..." />
            <button className="btn-secondary">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={onRegisterNew} className="btn-primary shadow-md shadow-primary/20">
              <Plus className="w-4 h-4" /> Register Patient
            </button>
          </div>
        </div>
      </header>

      {/* Column summary bar */}
      <div className="bg-white border-b border-gray-border px-6 shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center gap-6 py-3">
          {COLUMNS.map(col => {
            const count = filtered.filter(p => p.triage_status === col.status).length;
            return (
              <div key={col.id} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.status === 'critical' ? 'bg-critical' : col.status === 'pending' ? 'bg-pending' : 'bg-stable'}`} />
                <span className="text-xs font-bold text-navy">{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.status === 'critical' ? 'bg-critical/10 text-critical' : col.status === 'pending' ? 'bg-pending/10 text-pending' : 'bg-stable/10 text-stable'}`}>{count}</span>
              </div>
            );
          })}
          {criticalCount > 0 && (
            <span className="ml-auto text-xs font-bold text-critical animate-pulse">
              ⚠ {criticalCount} patient{criticalCount > 1 ? 's' : ''} need immediate attention
            </span>
          )}
        </div>
      </div>

      {/* Three-column triage (desktop) / Tabbed (mobile) */}
      <main className="flex-1 overflow-hidden">
        {/* Desktop: 3 columns */}
        <div className="hidden md:flex h-full max-w-[1400px] mx-auto divide-x divide-gray-border">
          {COLUMNS.map(col => {
            const colPatients = filtered.filter(p => p.triage_status === col.status);
            return (
              <section key={col.id} className={`flex-1 flex flex-col h-full ${col.bg}`}>
                <div className="px-5 py-3.5 border-b border-gray-border/60 bg-white/70 backdrop-blur-sm shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy uppercase tracking-[0.08em]">{col.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.status === 'critical' ? 'bg-critical text-white' : col.status === 'pending' ? 'bg-pending text-white' : 'bg-stable text-white'}`}>
                      {colPatients.length}
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide pb-8">
                  {colPatients.length > 0 ? (
                    colPatients.map(p => (
                      <PatientCard key={p.id} patient={p} col={col} onClick={() => onSelectPatient(p)} />
                    ))
                  ) : (
                    <EmptyState
                      icon={col.status === 'stable' ? '✅' : '✨'}
                      title={col.status === 'stable' ? 'All patients stable.' : `No ${col.label.toLowerCase()} patients`}
                      subtitle={col.status === 'stable' ? 'Good work.' : undefined}
                    />
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* Mobile: Tabs */}
        <div className="md:hidden h-full flex flex-col">
          <div className="flex border-b border-gray-border bg-white shrink-0">
            {COLUMNS.map(col => {
              const count = filtered.filter(p => p.triage_status === col.status).length;
              return (
                <button key={col.id} onClick={() => setActiveTab(col.status)}
                  className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${activeTab === col.status ? 'border-primary text-primary' : 'border-transparent text-gray-secondary'}`}>
                  {col.label} ({count})
                </button>
              );
            })}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {filtered.filter(p => p.triage_status === activeTab).map(p => {
              const col = COLUMNS.find(c => c.status === activeTab)!;
              return <PatientCard key={p.id} patient={p} col={col} onClick={() => onSelectPatient(p)} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
