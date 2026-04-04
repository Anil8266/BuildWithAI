import { Patient, PatientTask, ShiftNote, Appointment, Organization, Profile } from './types';

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-001',
    name: 'St. Jude Medical Center',
    type: 'hospital',
    address: '123 Healthcare Blvd, Mumbai',
    phone: '+91 22 1234 5678',
    created_at: '2020-01-01T00:00:00Z'
  },
  {
    id: 'org-002',
    name: 'City Care Clinic',
    type: 'clinic',
    address: '45 Wellness Road, Mumbai',
    phone: '+91 22 8765 4321',
    created_at: '2021-06-15T00:00:00Z'
  }
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'doc001',
    clinic_id: 'CLINIC-001',
    organization_id: 'org-001',
    role: 'doctor',
    full_name: 'Dr. Amit Shah',
    email: 'doctor@syncro.care',
    is_active: true,
    specialty: 'Cardiologist',
    department: 'Cardiology',
    bio: 'Lead Cardiologist with 15+ years of experience in heart health and preventive care.',
    rating: 4.9,
    review_count: 128,
    patient_count: 1450,
    years_experience: 15,
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'doc002',
    clinic_id: 'CLINIC-001',
    organization_id: 'org-001',
    role: 'doctor',
    full_name: 'Dr. Priya Verma',
    email: 'priya.v@syncro.care',
    is_active: true,
    specialty: 'Endocrinologist',
    department: 'Endocrinology',
    bio: 'Specialist in diabetes management and hormonal disorders.',
    rating: 4.8,
    review_count: 85,
    patient_count: 920,
    years_experience: 10,
    avatar_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'doc003',
    clinic_id: 'CLINIC-001',
    organization_id: 'org-002',
    role: 'doctor',
    full_name: 'Dr. Rajesh Khanna',
    email: 'khanna@syncro.care',
    is_active: true,
    specialty: 'Neurologist',
    department: 'Neurology',
    bio: 'Expert in neurodegenerative diseases and stroke recovery.',
    rating: 4.7,
    review_count: 56,
    patient_count: 640,
    years_experience: 12,
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export const MOCK_PATIENTS: Patient[] = [
  // ... existing patients (I'll keep them but update the reference in my mind)
  {
    id: 'p001', clinic_id: 'CLINIC-001', mrn: 'MRN-2024-001',
    full_name: 'Priya Mehta', date_of_birth: '1962-03-14', gender: 'female',
    phone: '+91-98765-43210', email: 'priya.mehta@email.com',
    address: '12, Andheri West, Mumbai 400058',
    emergency_contact: { name: 'Raj Mehta', phone: '+91-98765-43211', relationship: 'Spouse' },
    triage_status: 'critical', is_active: true, has_app_access: true,
    last_app_activity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icd10_diagnoses: ['I10', 'E11.9'],
    created_at: '2024-01-15T08:00:00Z',
    age: 62, complianceRate: 68, tasks_today: 4, tasks_done_today: 1,
    current_shift_note: 'BP spiking — adjusted Lisinopril to 20mg. Monitor overnight.',
    latest_alert_title: 'BP 165/95 — threshold exceeded', latest_alert_time: '3h ago',
    assigned_nurse_name: 'Nurse Sarah'
  },
  {
    id: 'p002', clinic_id: 'CLINIC-001', mrn: 'MRN-2024-002',
    full_name: 'Arjun Sharma', date_of_birth: '1955-07-22', gender: 'male',
    phone: '+91-98765-11111', email: 'arjun.sharma@email.com',
    address: '45, Bandra, Mumbai 400050',
    triage_status: 'pending', is_active: true, has_app_access: true,
    last_app_activity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icd10_diagnoses: ['E11.9', 'I25.10'],
    created_at: '2024-02-10T09:00:00Z',
    age: 68, complianceRate: 84, tasks_today: 3, tasks_done_today: 2,
    current_shift_note: 'Blood glucose fluctuating. Awaiting HbA1c results.',
    latest_alert_title: 'Lab result pending review', latest_alert_time: '1h ago',
    assigned_nurse_name: 'Nurse Sarah'
  },
  {
    id: 'p003', clinic_id: 'CLINIC-001', mrn: 'MRN-2024-003',
    full_name: 'Kavitha Nair', date_of_birth: '1978-11-05', gender: 'female',
    phone: '+91-98765-22222', email: 'kavitha.nair@email.com',
    address: '8, Juhu, Mumbai 400049',
    triage_status: 'stable', is_active: true, has_app_access: true,
    last_app_activity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    icd10_diagnoses: ['J45.20'],
    created_at: '2024-03-05T10:00:00Z',
    age: 46, complianceRate: 96, tasks_today: 2, tasks_done_today: 2,
    current_shift_note: 'Stable. Asthma well-controlled. Routine follow-up only.',
    latest_alert_title: 'All tasks completed', latest_alert_time: '30m ago',
    assigned_nurse_name: 'Nurse Ravi'
  },
  {
    id: 'p004', clinic_id: 'CLINIC-001', mrn: 'MRN-2024-004',
    full_name: 'Ravi Kumar', date_of_birth: '1945-09-18', gender: 'male',
    phone: '+91-98765-33333', email: 'ravi.kumar@email.com',
    address: '22, Dadar, Mumbai 400014',
    triage_status: 'stable', is_active: true, has_app_access: false,
    last_app_activity: undefined,
    icd10_diagnoses: ['I50.9'],
    created_at: '2024-01-20T08:00:00Z',
    age: 79, complianceRate: 72, tasks_today: 3, tasks_done_today: 2,
    current_shift_note: null as any,
    latest_alert_title: 'No recent activity', latest_alert_time: '48h ago',
    assigned_nurse_name: 'Nurse Ravi'
  },
  {
    id: 'p005', clinic_id: 'CLINIC-001', mrn: 'MRN-2024-005',
    full_name: 'Sunita Patel', date_of_birth: '1970-04-30', gender: 'female',
    phone: '+91-98765-44444', email: 'sunita.patel@email.com',
    address: '15, Powai, Mumbai 400076',
    triage_status: 'critical', is_active: true, has_app_access: true,
    last_app_activity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icd10_diagnoses: ['I10', 'N18.3'],
    created_at: '2024-04-01T08:00:00Z',
    age: 54, complianceRate: 55, tasks_today: 5, tasks_done_today: 1,
    current_shift_note: 'Missed 3 doses this week. Kidney function declining.',
    latest_alert_title: 'Missed 3 consecutive doses', latest_alert_time: '5h ago',
    assigned_nurse_name: 'Nurse Sarah'
  },
];

export const MOCK_TASKS: PatientTask[] = [
  {
    id: 't001', patient_id: 'p001', task_type: 'medication',
    instruction: 'Take 1 white pill (Lisinopril 20mg)',
    context_note: 'With food. This is your blood pressure medication.',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '08:00', time_of_day: 'morning',
    is_urgent: true, status: 'pending', created_at: new Date().toISOString()
  },
  {
    id: 't002', patient_id: 'p001', task_type: 'medication',
    instruction: 'Take 1 small blue pill (Atorvastatin 10mg)',
    context_note: 'Before bed. This helps lower your cholesterol.',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '21:00', time_of_day: 'evening',
    is_urgent: false, status: 'pending', created_at: new Date().toISOString()
  },
  {
    id: 't003', patient_id: 'p001', task_type: 'photo_upload',
    instruction: 'Take a photo of your arm (medication patch)',
    context_note: 'Dr. Shah needs to check the patch placement.',
    scheduled_date: new Date().toISOString().split('T')[0],
    time_of_day: 'morning', is_urgent: false, status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 't004', patient_id: 'p001', task_type: 'general',
    instruction: 'Check your blood pressure at home',
    context_note: 'Use your home BP monitor. Note the reading.',
    scheduled_date: new Date().toISOString().split('T')[0],
    time_of_day: 'afternoon', is_urgent: false, status: 'done',
    completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a001', patient_id: 'p001', doctor_id: 'doc001', booked_by: 'admin001',
    appointment_type: 'in_person',
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 30, status: 'confirmed',
    notes: 'Follow-up on BP management', created_at: new Date().toISOString()
  },
  {
    id: 'a002', patient_id: 'p002', doctor_id: 'doc001', booked_by: 'admin001',
    appointment_type: 'video_call',
    scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 30, status: 'confirmed',
    notes: 'HbA1c review', created_at: new Date().toISOString()
  },
];
