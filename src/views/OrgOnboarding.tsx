import React, { useState } from 'react';
import { Container, GridItem } from '../components/Layout';
import { Hospital, Building, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '../data';
import { Organization } from '../types';

interface OrgOnboardingProps {
  onComplete: (org: Organization) => void;
}

/**
 * Onboarding screen for Doctors to select or add their medical organization.
 */
export const OrgOnboarding = ({ onComplete }: OrgOnboardingProps) => {
  const [selected, setSelected] = useState<Organization | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'hospital' as 'hospital' | 'clinic' });
  const [loading, setLoading] = useState(false);

  const handleOrgSubmit = () => {
    if (!selected && !isAddingNew) return;
    setLoading(true);
    setTimeout(() => {
      onComplete(selected || {
        id: 'new-org-' + Date.now(),
        name: newOrg.name,
        type: newOrg.type,
        created_at: new Date().toISOString()
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full opacity-10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-mid rounded-full opacity-10 blur-[120px] pointer-events-none" />

      <Container useGrid={false} className="max-w-2xl relative z-10">
        <div className="bg-white rounded-smooth p-12 border border-gray-border shadow-2xl text-center space-y-8">
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-navy">Welcome to SYNCRO</h1>
            <p className="text-gray-secondary max-w-md mx-auto">
              Please connect your clinical practice to begin managing patient care plans and coordination.
            </p>
          </div>

          {!isAddingNew ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ORGANIZATIONS.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => setSelected(org)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left group ${selected?.id === org.id ? 'border-primary bg-primary-light/30 ring-4 ring-primary/10' : 'border-gray-border hover:border-primary/40 hover:bg-gray-bg'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selected?.id === org.id ? 'bg-primary text-white' : 'bg-gray-bg text-gray-secondary group-hover:text-primary'}`}>
                      {org.type === 'hospital' ? <Hospital className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                    </div>
                    <div className="font-bold text-navy text-sm mb-1">{org.name}</div>
                    <div className="text-[10px] text-gray-secondary uppercase font-bold tracking-widest">{org.type}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-gray-border text-xs font-bold text-gray-secondary hover:border-primary hover:text-primary transition-colors"
                disabled={loading}
              >
                + My organization is not listed
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Practice Name</label>
                  <input
                    type="text"
                    value={newOrg.name}
                    onChange={(e) => setNewOrg(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Life Care Multispecialty"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Practice Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['hospital', 'clinic'].map(type => (
                      <button
                        key={type}
                        onClick={() => setNewOrg(p => ({ ...p, type: type as any }))}
                        className={`py-3 rounded-lg border-2 text-xs font-bold transition-all uppercase tracking-widest ${newOrg.type === type ? 'border-primary bg-primary text-white' : 'border-gray-border text-gray-secondary hover:border-primary/40'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAddingNew(false)} className="text-xs text-primary font-bold hover:underline">
                ← Back to listings
              </button>
            </div>
          )}

          <footer className="pt-6 border-t border-gray-border">
            <button
              onClick={handleOrgSubmit}
              disabled={loading || (!selected && !newOrg.name)}
              className="w-full btn-primary h-14 text-base shadow-xl shadow-primary/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Complete Setup <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </footer>
        </div>

        <p className="text-center text-white/50 text-[10px] uppercase font-bold tracking-widest mt-8 flex items-center justify-center gap-2">
          <CheckCircle className="w-3.5 h-3.5" /> Data Encrypted • HIPAA Compliant Organization Setup
        </p>
      </Container>
    </div>
  );
};
