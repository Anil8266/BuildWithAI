import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Patient } from '../types';

interface CarePlanEditorProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const ENTRY_TYPES = [
  { value: 'medication_change', label: 'Medication Change' },
  { value: 'new_task', label: 'New Task' },
  { value: 'dosage_change', label: 'Dosage Change' },
  { value: 'lab_request', label: 'Lab Request' },
  { value: 'general_note', label: 'General Note' },
];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Custom'];

export const CarePlanEditor = ({ patient, isOpen, onClose, onSaved }: CarePlanEditorProps) => {
  const [entryType, setEntryType] = useState('medication_change');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [frequency, setFrequency] = useState('Once daily');
  const [clinicalNote, setClinicalNote] = useState('');
  const [patientMessage, setPatientMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmUrgent, setShowConfirmUrgent] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (['medication_change', 'dosage_change'].includes(entryType) && !medication.trim()) e.medication = 'Medication name is required';
    if (!patientMessage.trim()) e.patientMessage = 'Patient instruction is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (isUrgent) { setShowConfirmUrgent(true); return; }
    doSave();
  };

  const doSave = () => {
    setIsSaving(true);
    setShowConfirmUrgent(false);
    setTimeout(() => {
      setIsSaving(false);
      onSaved?.();
      onClose();
    }, 1200);
  };

  const handleDiscard = () => {
    const touched = medication || patientMessage || clinicalNote;
    if (touched && !confirm('Discard unsaved changes?')) return;
    onClose();
  };

  const msgLen = patientMessage.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleDiscard}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-70"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-80 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <header className="h-16 border-b border-gray-border px-6 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-serif font-bold text-navy">Update Care Plan</h2>
                <p className="text-[11px] text-gray-secondary font-medium">Patient: {patient.full_name}</p>
              </div>
              <button onClick={handleDiscard} className="p-2 hover:bg-gray-bg rounded-full transition-colors">
                <X className="w-5 h-5 text-navy" />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">

              {/* Entry type */}
              <div>
                <label className="form-label">Update Type</label>
                <select value={entryType} onChange={e => setEntryType(e.target.value)}
                  className="form-input">
                  {ENTRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Medication fields */}
              {['medication_change', 'dosage_change'].includes(entryType) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Medication Name</label>
                    <input
                      value={medication} onChange={e => setMedication(e.target.value)}
                      placeholder="e.g. Lisinopril"
                      className={`form-input ${errors.medication ? 'border-critical' : ''}`}
                    />
                    {errors.medication && <p className="text-[11px] text-critical mt-1">{errors.medication}</p>}
                  </div>
                  <div>
                    <label className="form-label">Dosage</label>
                    <div className="flex gap-2">
                      <input value={dosage} onChange={e => setDosage(e.target.value)}
                        placeholder="20" className="form-input flex-1 w-auto" type="number" />
                      <select value={unit} onChange={e => setUnit(e.target.value)}
                        className="form-input w-20">
                        {['mg', 'ml', 'mcg', 'IU'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    {Number(dosage) > 40 && (
                      <p className="text-[11px] text-pending mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Above typical range — confirm with patient
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Frequency</label>
                    <select value={frequency} onChange={e => setFrequency(e.target.value)}
                      className="form-input">
                      {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Clinical note (internal) */}
              <div>
                <label className="form-label">Clinical Note <span className="normal-case font-normal text-gray-disabled">(Internal — not shown to patient)</span></label>
                <textarea value={clinicalNote} onChange={e => setClinicalNote(e.target.value)}
                  placeholder="Internal note for clinical record..."
                  className="form-input h-24 resize-none py-3" maxLength={500}
                />
                <p className="text-[11px] text-gray-secondary mt-1 text-right">{clinicalNote.length}/500</p>
              </div>

              {/* Patient message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0">Patient Instruction <span className="text-critical">*</span></label>
                  <button onClick={() => setShowPreview(v => !v)} className="flex items-center gap-1 text-[11px] text-primary font-semibold">
                    {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showPreview ? 'Hide' : 'Show'} preview
                  </button>
                </div>
                <textarea value={patientMessage} onChange={e => setPatientMessage(e.target.value)}
                  placeholder="Tell the patient what to do, in plain words. e.g. Take 1 white pill (Lisinopril) every morning after breakfast."
                  className={`form-input h-28 resize-none py-3 ${errors.patientMessage ? 'border-critical' : ''}`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.patientMessage ? <p className="text-[11px] text-critical">{errors.patientMessage}</p> : <span />}
                  <p className={`text-[11px] font-medium ${msgLen > 180 ? 'text-critical' : msgLen > 140 ? 'text-pending' : 'text-gray-secondary'}`}>{msgLen}/200</p>
                </div>
              </div>

              {/* Live patient preview */}
              <AnimatePresence>
                {showPreview && patientMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <p className="form-label mb-2">Patient sees this →</p>
                    <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 bg-primary-light/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">💊</div>
                        <div className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest">New task from Dr. Shah</div>
                      </div>
                      <p className="text-sm font-semibold text-navy leading-relaxed">{patientMessage}</p>
                      <button className="mt-4 w-full bg-primary text-white text-sm font-bold py-3 rounded-lg">Done</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Urgent toggle */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${isUrgent ? 'bg-critical/5 border-critical/20' : 'bg-gray-bg border-gray-border'}`}>
                <div>
                  <div className="text-sm font-bold text-navy">Mark as Urgent</div>
                  <div className="text-[11px] text-gray-secondary mt-0.5">Sends an immediate push notification to the patient</div>
                </div>
                <button
                  onClick={() => setIsUrgent(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isUrgent ? 'bg-critical' : 'bg-gray-border'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isUrgent ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-border p-5 bg-gray-bg/50 space-y-3 shrink-0">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full btn-primary py-3 text-base shadow-lg shadow-primary/20"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <><Save className="w-4 h-4" /> Update Care Plan</>
                )}
              </button>
              <button onClick={handleDiscard} className="w-full btn-ghost text-sm">Discard changes</button>
            </footer>
          </motion.div>

          {/* Urgent confirmation */}
          {showConfirmUrgent && (
            <div className="fixed inset-0 z-90 flex items-center justify-center p-6">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-critical mx-auto" />
                <h3 className="text-lg font-serif font-bold text-navy">Send Urgent Notification?</h3>
                <p className="text-sm text-gray-secondary">This will send an <strong>immediate push notification</strong> to {patient.full_name}.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmUrgent(false)} className="flex-1 btn-ghost border border-gray-border">Cancel</button>
                  <button onClick={doSave} className="flex-1 btn-danger">Yes, Send Now</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
