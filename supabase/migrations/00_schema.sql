-- Migration: 00_schema.sql
-- Create core tables for SYNCRO

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospital', 'clinic', 'private_practice')),
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Clinics (Alias/Branch for organizations)
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC'
);

-- 3. Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- Maps to auth.users.id
  clinic_id UUID REFERENCES clinics(id),
  organization_id UUID REFERENCES organizations(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'patient')),
  full_name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  push_token TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ,
  specialty TEXT,
  department TEXT,
  bio TEXT,
  rating NUMERIC,
  review_count INT DEFAULT 0,
  patient_count INT DEFAULT 0,
  years_experience INT
);

-- 4. Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  clinic_id UUID REFERENCES clinics(id),
  mrn TEXT,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact JSONB,
  triage_status TEXT NOT NULL CHECK (triage_status IN ('critical', 'pending', 'stable')),
  is_active BOOLEAN DEFAULT TRUE,
  has_app_access BOOLEAN DEFAULT FALSE,
  last_app_activity TIMESTAMPTZ,
  onboarding_invite_sent_at TIMESTAMPTZ,
  icd10_diagnoses TEXT[],
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Care Team Assignments
CREATE TABLE care_team_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  provider_id UUID REFERENCES profiles(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'nurse')),
  is_primary BOOLEAN DEFAULT FALSE,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  removed_at TIMESTAMPTZ
);

-- 6. Care Plan Entries
CREATE TABLE care_plan_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('medication_change', 'new_task', 'dosage_change', 'lab_request', 'general_note', 'amendment')),
  medication_id TEXT,
  dosage_amount NUMERIC,
  dosage_unit TEXT,
  frequency TEXT,
  clinical_note TEXT,
  patient_message TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  effective_from TIMESTAMPTZ NOT NULL,
  effective_until TIMESTAMPTZ,
  original_entry_id UUID REFERENCES care_plan_entries(id),
  icd10_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Patient Tasks
CREATE TABLE patient_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  care_plan_entry_id UUID REFERENCES care_plan_entries(id),
  task_type TEXT NOT NULL CHECK (task_type IN ('medication', 'photo_upload', 'appointment', 'general')),
  instruction TEXT NOT NULL,
  context_note TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'anytime')),
  is_urgent BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'done', 'skipped', 'missed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Compliance Logs
CREATE TABLE compliance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  task_id UUID REFERENCES patient_tasks(id) NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('done', 'skipped', 'missed', 'undo')),
  skip_reason TEXT,
  skip_reason_other TEXT,
  undo_of UUID REFERENCES compliance_logs(id),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT NOT NULL CHECK (source IN ('app', 'ivr', 'sms', 'manual'))
);

-- 9. Vitals
CREATE TABLE vitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  recorded_by UUID REFERENCES profiles(id),
  vital_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  custom_label TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT NOT NULL CHECK (source IN ('manual', 'device', 'import')),
  is_editable BOOLEAN DEFAULT FALSE
);

-- 10. Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES profiles(id) NOT NULL,
  booked_by UUID REFERENCES profiles(id) NOT NULL,
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('in_person', 'video_call', 'phone_call')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  cancelled_at TIMESTAMPTZ
);

-- 11. Shift Notes
CREATE TABLE shift_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('vital_breach', 'missed_doses', 'lab_result', 'no_app_activity', 'manual')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'pending')),
  title TEXT NOT NULL,
  detail TEXT,
  triggered_value NUMERIC,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  resolution_note TEXT
);

-- ========== Row Level Security (RLS) ==========
-- We establish a baseline level of RLS where reading is permitted for authenticated users on most tables,
-- but inserts/updates will require more granular policies later depending on exactly how roles interact.

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plan_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view everything for now (prototype)
CREATE POLICY "Allow view for authenticated" ON organizations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON clinics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON care_team_assignments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON care_plan_entries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON patient_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON compliance_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON vitals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON appointments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON shift_notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow view for authenticated" ON alerts FOR SELECT USING (auth.role() = 'authenticated');

-- For prototype data insertion we also allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated on organizations" ON organizations USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on clinics" ON clinics USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on profiles" ON profiles USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on patients" ON patients USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on care_team_assignments" ON care_team_assignments USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on care_plan_entries" ON care_plan_entries USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on patient_tasks" ON patient_tasks USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on compliance_logs" ON compliance_logs USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on vitals" ON vitals USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on appointments" ON appointments USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on shift_notes" ON shift_notes USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated on alerts" ON alerts USING (auth.role() = 'authenticated');
