export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient';

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  timezone: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'private_practice';
  address?: string;
  phone?: string;
  logo_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  clinic_id: string;
  organization_id?: string;
  role: UserRole;
  full_name: string;
  display_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  push_token?: string;
  is_active: boolean;
  last_seen_at?: string;
  // Doctor/Provider specific
  specialty?: string;
  department?: string;
  bio?: string;
  rating?: number;
  review_count?: number;
  patient_count?: number;
  years_experience?: number;
}

export interface Patient {
  id: string;
  profile_id?: string;
  clinic_id: string;
  mrn?: string;
  full_name: string;
  date_of_birth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  triage_status: 'critical' | 'pending' | 'stable';
  is_active: boolean;
  has_app_access: boolean;
  last_app_activity?: string;
  onboarding_invite_sent_at?: string;
  icd10_diagnoses?: string[];
  notes?: string;
  created_by?: string;
  created_at: string;
  // UI computed fields
  age?: number;
  complianceRate?: number;
  tasks_today?: number;
  tasks_done_today?: number;
  current_shift_note?: string;
  latest_alert_title?: string;
  latest_alert_time?: string;
  assigned_nurse_name?: string;
}

export interface CareTeamAssignment {
  id: string;
  patient_id: string;
  provider_id: string;
  role: 'doctor' | 'nurse';
  is_primary: boolean;
  assigned_by: string;
  assigned_at: string;
  removed_at?: string;
}

export interface CarePlanEntry {
  id: string;
  patient_id: string;
  author_id: string;
  entry_type: 'medication_change' | 'new_task' | 'dosage_change' | 'lab_request' | 'general_note' | 'amendment';
  medication_id?: string;
  dosage_amount?: number;
  dosage_unit?: string;
  frequency?: string;
  clinical_note?: string;
  patient_message: string;
  is_urgent: boolean;
  is_active: boolean;
  effective_from: string;
  effective_until?: string;
  original_entry_id?: string;
  icd10_code?: string;
  created_at: string;
}

export interface PatientTask {
  id: string;
  patient_id: string;
  care_plan_entry_id?: string;
  task_type: 'medication' | 'photo_upload' | 'appointment' | 'general';
  instruction: string;
  context_note?: string;
  scheduled_date: string;
  scheduled_time?: string;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  is_urgent: boolean;
  status: 'pending' | 'done' | 'skipped' | 'missed';
  completed_at?: string;
  created_at: string;
}

export interface ComplianceLog {
  id: string;
  patient_id: string;
  task_id: string;
  action: 'done' | 'skipped' | 'missed' | 'undo';
  skip_reason?: string;
  skip_reason_other?: string;
  undo_of?: string;
  logged_at: string;
  source: 'app' | 'ivr' | 'sms' | 'manual';
}

export interface Vital {
  id: string;
  patient_id: string;
  recorded_by: string;
  vital_type: 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'heart_rate' | 'blood_glucose' | 'spo2' | 'temperature' | 'weight_kg' | 'custom';
  value: number;
  unit: string;
  custom_label?: string;
  recorded_at: string;
  source: 'manual' | 'device' | 'import';
  is_editable: boolean;
}

export interface AlertThreshold {
  id: string;
  patient_id: string;
  doctor_id: string;
  vital_type: string;
  min_value?: number;
  max_value?: number;
  unit: string;
  duration_minutes?: number;
  missed_dose_count: number;
  alert_channel: string[];
  is_active: boolean;
}

export interface Alert {
  id: string;
  patient_id: string;
  threshold_id?: string;
  alert_type: 'vital_breach' | 'missed_doses' | 'lab_result' | 'no_app_activity' | 'manual';
  severity: 'critical' | 'pending';
  title: string;
  detail?: string;
  triggered_value?: number;
  triggered_at: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_note?: string;
}

export interface ShiftNote {
  id: string;
  patient_id: string;
  author_id: string;
  note: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  booked_by: string;
  appointment_type: 'in_person' | 'video_call' | 'phone_call';
  scheduled_at: string;
  duration_minutes: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  created_at: string;
}
