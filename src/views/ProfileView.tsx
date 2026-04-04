import React from 'react';
import { motion } from 'motion/react';
import { Star, Users, CheckCircle, TrendingUp, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { Profile } from '../types';
import { Container, GridItem } from '../components/Layout';
import { Badge, Avatar, BackButton } from '../components/UI';

interface ProfileViewProps {
  profile: Profile;
  isOwnProfile?: boolean;
  onBack?: () => void;
}

/**
 * Unified profile view for all roles, with specific analytics for doctors.
 */
export const ProfileView = ({ profile, isOwnProfile = false, onBack }: ProfileViewProps) => {
  const isDoctor = profile.role === 'doctor';

  const ANALYTICS = [
    { label: 'Total Patients', value: profile.patient_count || '0', icon: Users, color: 'text-primary' },
    { label: 'Patient Rating', value: `${profile.rating || '0'}/5`, icon: Star, color: 'text-pending' },
    { label: 'Avg Compliance', value: '88%', icon: CheckCircle, color: 'text-stable' },
    { label: 'Experience', value: `${profile.years_experience || '0'}y`, icon: TrendingUp, color: 'text-navy' }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-bg py-8 md:py-12">
      <Container className="space-y-8">
        {onBack && <GridItem span={{ desktop: 12 }}><BackButton onClick={onBack} /></GridItem>}

        {/* Hero Section */}
        <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
          <div className="bg-white rounded-smooth p-8 border border-gray-border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Star className="w-48 h-48" />
            </div>

            <div className="relative">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-32 h-32 rounded-3xl object-crop shadow-lg border-4 border-white" />
              ) : (
                <Avatar name={profile.full_name} size="lg" />
              )}
              {isDoctor && (
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg ring-4 ring-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-navy">{profile.full_name}</h1>
                <div className="flex justify-center md:justify-start gap-2">
                  <Badge variant="role" size="md">{profile.role}</Badge>
                  {isDoctor && profile.specialty && <Badge variant="info" size="md">{profile.specialty}</Badge>}
                </div>
              </div>
              <p className="text-gray-secondary max-w-2xl leading-relaxed">
                {profile.bio || "Personal medical profile on the SYNCRO healthcare platform."}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-secondary font-medium">
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-secondary font-medium">
                    <Phone className="w-3.5 h-3.5" /> {profile.phone}
                  </div>
                )}
                {profile.department && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-secondary font-medium">
                    <Briefcase className="w-3.5 h-3.5" /> {profile.department} Dept.
                  </div>
                )}
              </div>
            </div>

            {isOwnProfile && (
              <button className="md:absolute top-8 right-8 btn-secondary">
                Edit Profile
              </button>
            )}
          </div>
        </GridItem>

        {/* Doctor Analytics */}
        {isDoctor && (
          <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ANALYTICS.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-card p-6 border border-gray-border shadow-sm flex items-center md:items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gray-bg flex items-center justify-center shrink-0 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-secondary uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-2xl font-serif font-bold text-navy leading-none`}>{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GridItem>
        )}

        {/* Detailed Sections */}
        <GridItem span={{ mobile: 4, tablet: 4, desktop: 8 }}>
          <div className="bg-white rounded-card p-8 border border-gray-border shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-navy text-center md:text-left">About {isDoctor ? 'Practitioner' : 'User'}</h2>
            <p className="text-sm text-gray-secondary leading-relaxed">
              Serving at the intersection of clinical excellence and patient-first care coordination. Specialized in real-time monitoring and adaptive care protocol management. Committed to closing the compliance gap in modern healthcare systems.
            </p>
            <div className="pt-4 border-t border-gray-border grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold text-gray-secondary uppercase tracking-widest mb-3">Work Location</h3>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-bg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-navy" />
                  </div>
                  <p className="text-xs text-navy font-medium leading-relaxed">
                    St. Jude Medical Center<br />
                    123 Healthcare Blvd, Mumbai
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-secondary uppercase tracking-widest mb-3">Availability</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stable animate-pulse" />
                  <span className="text-xs text-navy font-medium">Currently Online</span>
                </div>
              </div>
            </div>
          </div>
        </GridItem>

        {/* Sidebar Info */}
        <GridItem span={{ mobile: 4, tablet: 4, desktop: 4 }}>
          <div className="space-y-6">
            <div className="bg-navy rounded-card p-8 text-white space-y-4 shadow-xl">
              <h2 className="text-lg font-serif font-bold">Certification</h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Licensed healthcare provider with active certification in the Maharashtra Medical Council.
              </p>
              <div className="pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary-mid" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest">Verified Expert</div>
              </div>
            </div>
            
            <div className="bg-white rounded-card p-6 border border-gray-border shadow-sm">
              <h3 className="text-sm font-bold text-navy mb-4">Patient Feedback</h3>
              <div className="space-y-4">
                {[5, 4, 3].map((star, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-gray-secondary w-4">{star}★</div>
                    <div className="flex-1 h-1.5 bg-gray-bg rounded-full overflow-hidden">
                      <div className="h-full bg-pending rounded-full" style={{ width: `${90 - i * 30}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GridItem>
      </Container>
    </div>
  );
};

// Dummy component for verified badge
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
