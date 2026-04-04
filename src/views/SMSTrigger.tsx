import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import { Patient } from '../types';

interface SMSTriggerProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES = [
  { id: 'med', label: 'Medication Reminder', text: 'Hi [Name], this is a reminder from Dr. Shah\'s clinic. Please take your medication today. Call us at 1800-XXX-XXXX if you need help.' },
  { id: 'appt', label: 'Appointment Reminder', text: 'Hi [Name], you have an appointment with Dr. Shah on [Date] at [Time]. Please confirm or call to reschedule.' },
  { id: 'checkin', label: 'Check-in', text: 'Hi [Name], your care team is checking in. Please call us today or download the SYNCRO app to stay connected.' },
  { id: 'custom', label: 'Custom Message', text: '' },
];

export const SMSTrigger = ({ patient, isOpen, onClose }: SMSTriggerProps) => {
  const [template, setTemplate] = useState('med');
  const [customText, setCustomText] = useState('');
  const [method, setMethod] = useState<'sms' | 'ivr' | 'both'>('sms');
  const [sent, setSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const selectedTemplate = TEMPLATES.find(t => t.id === template)!;
  const preview = template === 'custom'
    ? customText
    : selectedTemplate.text.replace('[Name]', patient.full_name.split(' ')[0]);

  const handleSend = () => {
    if (!confirmed) { setConfirmed(true); return; }
    setSent(true);
    setTimeout(() => { setSent(false); setConfirmed(false); onClose(); }, 2000);
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
                <h2 className="text-lg font-serif font-bold text-navy">Offline Reminder</h2>
                <p className="text-[11px] text-gray-secondary">To: {patient.full_name} • {patient.phone}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-bg rounded-full transition-colors">
                <X className="w-5 h-5 text-navy" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Template */}
              <div>
                <label className="form-label">Message Template</label>
                <select value={template} onChange={e => { setTemplate(e.target.value); setConfirmed(false); }} className="form-input">
                  {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              {/* Custom text */}
              {template === 'custom' && (
                <div>
                  <label className="form-label">Custom Message <span className="text-gray-disabled font-normal normal-case">(max 160 chars)</span></label>
                  <textarea value={customText} onChange={e => { if (e.target.value.length <= 160) setCustomText(e.target.value); setConfirmed(false); }}
                    placeholder="Write your message..."
                    className="form-input h-28 resize-none py-3" />
                  <div className="text-right text-[11px] text-gray-secondary mt-1">{customText.length}/160</div>
                </div>
              )}

              {/* Preview */}
              <div>
                <label className="form-label">Message Preview</label>
                <div className="p-4 bg-gray-bg border border-gray-border rounded-xl text-sm text-navy leading-relaxed">
                  {preview || <span className="text-gray-disabled italic">Your message will appear here…</span>}
                </div>
              </div>

              {/* Contact method */}
              <div>
                <label className="form-label">Send via</label>
                <div className="flex gap-2">
                  {[
                    { id: 'sms', label: 'SMS' },
                    { id: 'ivr', label: 'IVR Call' },
                    { id: 'both', label: 'Both' },
                  ].map(m => (
                    <button key={m.id} onClick={() => { setMethod(m.id as any); setConfirmed(false); }}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-bold transition-colors ${method === m.id ? 'border-primary bg-primary-light text-primary' : 'border-gray-border text-gray-secondary hover:border-primary hover:text-primary'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <footer className="p-6 border-t border-gray-border bg-gray-bg/50 space-y-3">
              {sent ? (
                <div className="w-full py-3 flex items-center justify-center gap-2 text-stable font-bold text-sm">
                  ✓ {method.toUpperCase()} sent to {patient.phone}
                </div>
              ) : confirmed ? (
                <div className="space-y-3">
                  <div className="p-3 bg-pending/5 border border-pending/20 rounded-xl text-xs text-navy font-medium">
                    Confirm: Send {method.toUpperCase()} to <strong>{patient.phone}</strong>?
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setConfirmed(false)} className="flex-1 btn-ghost border border-gray-border">Cancel</button>
                    <button onClick={handleSend} className="flex-1 btn-primary">
                      <Send className="w-4 h-4" /> Yes, Send Now
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleSend} disabled={template === 'custom' && !customText.trim()}
                  className="w-full btn-primary py-3 shadow-md shadow-primary/20 disabled:opacity-50">
                  <Send className="w-4 h-4" /> Send Reminder
                </button>
              )}
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
