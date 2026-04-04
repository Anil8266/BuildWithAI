import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, MapPin, Calendar, CheckCircle, Plus, Edit2, Trash2, Camera, Briefcase, Phone, Mail, X } from 'lucide-react';
import { Container, GridItem } from '../components/Layout';
import { Badge, Avatar, SearchInput, EmptyState, ConfirmModal } from '../components/UI';
import { Profile, UserRole } from '../types';
import { MOCK_PROFILES } from '../data';

interface DoctorDirectoryProps {
  role: UserRole;
  onSelectDoctor?: (doc: Profile) => void;
  onAdminAction?: (action: string, doc: Profile) => void;
}

/**
 * Unified Doctor Directory:
 * - Patients: Browse, view ratings/images, book meetings.
 * - Admin: List, Categorize, Edit, Delete doctors.
 */
export const DoctorDirectory = ({ role, onSelectDoctor, onAdminAction }: DoctorDirectoryProps) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [isAdminAdding, setIsAdminAdding] = useState(false);
  const [bookingDoc, setBookingDoc] = useState<Profile | null>(null);

  const isAdmin = role === 'admin';
  const doctors = MOCK_PROFILES.filter(p => 
    p.role === 'doctor' &&
    (search === '' || p.full_name.toLowerCase().includes(search.toLowerCase()) || p.specialty?.toLowerCase().includes(search.toLowerCase())) &&
    (department === 'All' || p.department === department)
  );

  const DEPARTMENTS = ['All', 'Cardiology', 'Endocrinology', 'Neurology', 'Pediatrics', 'Oncology'];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-bg py-8 md:py-12">
      <Container className="space-y-8">
        {/* Header */}
        <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
          <div className="bg-white rounded-smooth p-8 border border-gray-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-serif font-bold text-navy">
                {isAdmin ? 'Practitioner Management' : 'Discover Specialists'}
              </h1>
              <p className="text-sm text-gray-secondary mt-1">
                {isAdmin ? 'Manage your healthcare organization staff and departments.' : 'Browse top-rated doctors across all departments and book an appointment.'}
              </p>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => setIsAdminAdding(true)} 
                className="btn-primary shadow-lg shadow-primary/20 relative z-10 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Doctor
              </button>
            )}
            
            {/* Background design element */}
            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none transform rotate-12">
              <Plus className="w-48 h-48" />
            </div>
          </div>
        </GridItem>

        {/* Toolbar */}
        <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
          <div className="bg-white rounded-2xl p-6 border border-gray-border shadow-sm flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-disabled" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, specialty, or clinic..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-bg border border-gray-border rounded-xl text-sm focus:border-primary outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  onClick={() => setDepartment(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${department === dept ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white text-gray-secondary border-gray-border hover:border-primary/40'}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </GridItem>

        {/* Discovery Grid */}
        <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
          {doctors.length > 0 ? (
            <div className="app-grid">
              {doctors.map((doc, idx) => (
                <GridItem 
                  key={doc.id} 
                  span={{ mobile: 4, tablet: 4, desktop: 4 }}
                  className="animate-fadeIn"
                >
                  <div className="bg-white rounded-smooth border border-gray-border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                    {/* Doctor Image & Header */}
                    <div className="relative h-48 bg-gray-bg overflow-hidden">
                      {doc.avatar_url ? (
                        <img 
                          src={doc.avatar_url} 
                          alt={doc.full_name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-disabled">
                          <Avatar name={doc.full_name} size="lg" />
                        </div>
                      )}
              <div className="absolute top-4 left-4">
                <Badge variant="info" size="sm" className="bg-white/90 backdrop-blur-sm border shadow-sm border-none!">
                  {doc.department}
                </Badge>
              </div>
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 text-pending fill-pending" />
                        <span className="text-[10px] font-bold text-navy">{doc.rating}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-navy group-hover:text-primary transition-colors">
                          {doc.full_name}
                        </h3>
                        <p className="text-xs font-bold text-gray-secondary uppercase tracking-widest mt-1">
                          {doc.specialty}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-secondary font-medium">
                          <MapPin className="w-3.5 h-3.5" /> St. Jude Medical Center
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-secondary font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-stable" /> {doc.patient_count}+ Success Stories
                        </div>
                      </div>

                      <footer className="pt-4 border-t border-gray-border flex items-center justify-between gap-3">
                        {isAdmin ? (
                          <>
                            <button className="p-2.5 rounded-xl bg-gray-bg text-gray-secondary hover:text-primary hover:bg-primary-light transition-all flex-1 flex items-center justify-center gap-2 text-xs font-bold">
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button className="p-2.5 rounded-xl bg-gray-bg text-gray-secondary hover:text-critical hover:bg-critical/5 transition-all flex-1 flex items-center justify-center gap-2 text-xs font-bold">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => onSelectDoctor?.(doc)}
                              className="text-xs font-bold text-navy hover:text-primary transition-colors"
                            >
                              View Profile
                            </button>
                            <button 
                              onClick={() => setBookingDoc(doc)}
                              className="btn-primary h-10 px-4 text-[11px] uppercase tracking-widest font-bold"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Book Now
                            </button>
                          </>
                        )}
                      </footer>
                    </div>
                  </div>
                </GridItem>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="👨‍⚕️" 
              title="No Doctors Found" 
              subtitle={`Try searching for another specialty or checking a different department.`}
            />
          )}
        </GridItem>
      </Container>

      {/* Booking Modal (Patient Only) */}
      <AnimatePresence>
        {bookingDoc && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 sm:p-24 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setBookingDoc(null)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm shadow-2xl" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-smooth w-full max-w-lg shadow-2xl relative z-210 overflow-hidden flex flex-col"
            >
              <header className="px-8 py-6 border-b border-gray-border bg-gray-bg/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-navy">Confirm Consultation</h2>
                  <p className="text-xs text-gray-secondary mt-1">Book your real-time coordination sync with {bookingDoc.full_name}.</p>
                </div>
                <button onClick={() => setBookingDoc(null)} className="p-2 hover:bg-gray-bg rounded-full">
                  <X className="w-5 h-5 text-gray-secondary" />
                </button>
              </header>

              <div className="p-8 space-y-6">
                <div className="p-4 bg-primary-light rounded-2xl flex items-center gap-4 border border-primary/20">
                  <Avatar name={bookingDoc.full_name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-navy">{bookingDoc.full_name}</p>
                    <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{bookingDoc.specialty}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Preferred Date</label>
                      <input type="date" className="form-input" defaultValue="2026-04-10" />
                    </div>
                    <div>
                      <label className="form-label">Preferred Slot</label>
                      <select className="form-input">
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>02:00 PM</option>
                        <option>04:30 PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Consultation Reason</label>
                    <textarea 
                      placeholder="e.g., Blood pressure spikes and headache..." 
                      className="form-input h-24 resize-none py-3"
                    />
                  </div>
                </div>
              </div>

              <footer className="px-8 py-6 border-t border-gray-border bg-gray-bg/50 flex flex-col gap-3">
                <button className="w-full btn-primary h-12 shadow-lg shadow-primary/20">
                  Request Meeting
                </button>
                <p className="text-center text-[10px] text-gray-secondary uppercase font-bold tracking-widest">
                  HIPAA Secure Connection • Syncro Verified 
                </p>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Add Modal */}
      <AnimatePresence>
        {isAdminAdding && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminAdding(false)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-smooth w-full max-w-xl shadow-2xl relative z-210 overflow-hidden"
            >
              <header className="px-8 py-6 border-b border-gray-border bg-gray-bg/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-navy">Onboard Practitioner</h2>
                  <p className="text-xs text-gray-secondary mt-1">Add a new specialist to the St. Jude Medical Center staff directory.</p>
                </div>
                <button onClick={() => setIsAdminAdding(false)} className="p-2 hover:bg-gray-bg rounded-full">
                  <X className="w-5 h-5 text-gray-secondary" />
                </button>
              </header>

              <div className="p-8 space-y-6">
                {/* Image upload simulation */}
                <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-border rounded-2xl bg-gray-bg/50 hover:bg-gray-bg transition-colors group cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-disabled group-hover:text-primary transition-all shadow-sm">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-navy uppercase tracking-widest">Upload Practitioner Image</p>
                    <p className="text-[10px] text-gray-disabled mt-1 pb-1">Recommended: Square 500x500px </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="form-label">Full Medical Name</label>
                    <input type="text" placeholder="Dr. Suman Rathore" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <select className="form-input">
                      {DEPARTMENTS.slice(1).map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Medical Registration (MMC #)</label>
                    <input type="text" placeholder="2024-XXX-XXX" className="form-input" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Specialty Qualification</label>
                    <input type="text" placeholder="MD - Interventional Cardiology" className="form-input" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Brief Medical Bio</label>
                    <textarea 
                      placeholder="Doctor's background, expertise, and focus areas..." 
                      className="form-input h-24 resize-none py-3"
                    />
                  </div>
                </div>
              </div>

              <footer className="px-8 py-6 border-t border-gray-border bg-gray-bg/50 flex gap-4">
                <button onClick={() => setIsAdminAdding(false)} className="flex-1 btn-ghost border border-gray-border">Cancel</button>
                <button 
                  onClick={() => setIsAdminAdding(false)}
                  className="flex-1 btn-primary shadow-lg shadow-primary/20"
                >
                  Onboard Practitioner
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
