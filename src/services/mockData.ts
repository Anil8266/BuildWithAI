import { Patient, PatientTask } from '../types';

export const MOCK_TASKS: PatientTask[] = [
  { 
    id: 't1', 
    patient_id: 'p1', 
    task_type: 'medication', 
    instruction: 'Take 1 additional white pill (Lisinopril)', 
    time_of_day: 'morning', 
    status: 'pending', 
    context_note: 'With food. This is your blood pressure medication.',
    is_urgent: true,
    scheduled_date: '2026-04-04',
    created_at: '2026-04-03T10:00:00Z'
  },
  { 
    id: 't2', 
    patient_id: 'p1', 
    task_type: 'general', 
    instruction: 'Check blood pressure', 
    time_of_day: 'morning', 
    status: 'pending', 
    context_note: 'Sit quietly for 5 minutes before checking.',
    is_urgent: false,
    scheduled_date: '2026-04-04',
    created_at: '2026-04-03T10:00:00Z'
  },
  { 
    id: 't3', 
    patient_id: 'p1', 
    task_type: 'photo_upload', 
    instruction: 'Upload photo of surgical site', 
    time_of_day: 'anytime', 
    status: 'pending',
    is_urgent: false,
    scheduled_date: '2026-04-04',
    created_at: '2026-04-03T10:00:00Z'
  },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    full_name: 'Priya Mehta',
    clinic_id: 'CLINIC-001',
    triage_status: 'critical',
    complianceRate: 45,
    age: 64,
    date_of_birth: '1962-05-12',
    current_shift_note: 'BP 162/98 — 3h ago. Patient reported mild headache. Monitor for vision changes.',
    assigned_nurse_name: 'Nurse Sarah',
    latest_alert_title: 'BP Threshold Breach',
    latest_alert_time: '2026-04-04T03:00:00Z',
    is_active: true,
    has_app_access: true,
    created_at: '2026-04-01T10:00:00Z'
  },
  {
    id: 'p2',
    full_name: 'Robert Chen',
    clinic_id: 'CLINIC-001',
    triage_status: 'stable',
    complianceRate: 98,
    age: 42,
    date_of_birth: '1984-08-20',
    assigned_nurse_name: 'Nurse Sarah',
    is_active: true,
    has_app_access: true,
    created_at: '2026-04-01T10:00:00Z'
  },
  {
    id: 'p3',
    full_name: 'Elena Rodriguez',
    clinic_id: 'CLINIC-001',
    triage_status: 'pending',
    complianceRate: 72,
    age: 58,
    date_of_birth: '1968-11-05',
    assigned_nurse_name: 'Nurse Sarah',
    is_active: true,
    has_app_access: true,
    created_at: '2026-04-01T10:00:00Z'
  }
];
