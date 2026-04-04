import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { Patient } from '../types';

interface ShiftNoteEditorProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftNoteEditor = ({ patient, isOpen, onClose }: ShiftNoteEditorProps) => {
  const [note, setNote] = useState(patient.current_shift_note || '');
  const [saved, setSaved] = useState(false);
  const MAX = 140;
  const len = note.length;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-70" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-80 shadow-2xl flex flex-col"
          >
            <header className="h-16 border-b border-gray-border px-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-navy">Shift Note</h2>
                <p className="text-[11px] text-gray-secondary">{patient.full_name}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-bg rounded-full transition-colors">
                <X className="w-5 h-5 text-navy" />
              </button>
            </header>

            <div className="flex-1 p-6 space-y-5">
              <div className="p-4 bg-primary-light/50 rounded-xl border border-primary/10 text-sm text-navy/70">
                Write the single most important thing the incoming provider needs to know. Keep it under 140 characters.
              </div>

              <div>
                <label className="form-label">Note</label>
                <textarea
                  value={note}
                  onChange={e => { if (e.target.value.length <= MAX) setNote(e.target.value); }}
                  placeholder="e.g. BP spiking — adjusted Lisinopril to 20mg. Monitor overnight."
                  autoFocus
                  className={`form-input h-36 resize-none py-3 ${len > 130 ? 'border-critical focus:border-critical focus:ring-critical/20' : len > 110 ? 'border-pending' : ''}`}
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[11px] font-bold ${len > 130 ? 'text-critical' : len > 110 ? 'text-pending' : 'text-gray-secondary'}`}>
                    {len} / {MAX}
                  </span>
                </div>
              </div>

              {/* Previous notes */}
              {patient.current_shift_note && (
                <div>
                  <p className="form-label mb-2">Previous Note</p>
                  <div className="p-3 bg-gray-bg rounded-xl border border-gray-border text-xs text-gray-secondary italic">
                    "{patient.current_shift_note}"
                  </div>
                </div>
              )}
            </div>

            <footer className="p-6 border-t border-gray-border bg-gray-bg/50">
              {saved ? (
                <div className="w-full py-3 flex items-center justify-center gap-2 text-stable font-bold text-sm">
                  ✓ Note saved.
                </div>
              ) : (
                <button onClick={handleSave} disabled={!note.trim() || note === patient.current_shift_note}
                  className="w-full btn-primary py-3 shadow-md shadow-primary/20 disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save Shift Note
                </button>
              )}
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
