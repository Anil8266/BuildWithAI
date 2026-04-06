-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('hospital', 'clinic', 'private_practice')),
    address TEXT,
    phone TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    role TEXT CHECK (role IN ('admin', 'doctor', 'nurse', 'patient')),
    full_name TEXT NOT NULL,
    display_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ,
    specialty TEXT,
    department TEXT,
    bio TEXT,
    rating NUMERIC,
    review_count INTEGER DEFAULT 0,
    patient_count INTEGER DEFAULT 0,
    years_experience INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    profile_id TEXT REFERENCES profiles(id),
    organization_id TEXT REFERENCES organizations(id),
    mrn TEXT,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    phone TEXT,
    email TEXT,
    address TEXT,
    triage_status TEXT CHECK (triage_status IN ('critical', 'pending', 'stable')) DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    has_app_access BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_by TEXT REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient Tasks
CREATE TABLE IF NOT EXISTS patient_tasks (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
    task_type TEXT CHECK (task_type IN ('medication', 'photo_upload', 'appointment', 'general')),
    instruction TEXT NOT NULL,
    context_note TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'anytime')),
    is_urgent BOOLEAN DEFAULT FALSE,
    status TEXT CHECK (status IN ('pending', 'done', 'skipped', 'missed')) DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vitals
CREATE TABLE IF NOT EXISTS vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
    recorded_by TEXT REFERENCES profiles(id),
    vital_type TEXT CHECK (vital_type IN ('blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'blood_glucose', 'spo2', 'temperature', 'weight_kg', 'custom')),
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    custom_label TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT CHECK (source IN ('manual', 'device', 'import')) DEFAULT 'manual',
    is_editable BOOLEAN DEFAULT TRUE
);

-- Care Plan Entries
CREATE TABLE IF NOT EXISTS care_plan_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES profiles(id),
    entry_type TEXT CHECK (entry_type IN ('medication_change', 'new_task', 'dosage_change', 'lab_request', 'general_note', 'amendment')),
    medication_name TEXT,
    dosage_amount NUMERIC,
    dosage_unit TEXT,
    frequency TEXT,
    clinical_note TEXT,
    patient_message TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shift Notes
CREATE TABLE IF NOT EXISTS shift_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES profiles(id),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plan_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_notes ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Authenticated users can read/write everything for now)
DROP POLICY IF EXISTS "Allow authenticated access to organizations" ON organizations;
CREATE POLICY "Allow authenticated access to organizations" ON organizations FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated access to profiles" ON profiles;
CREATE POLICY "Allow authenticated access to profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated access to patients" ON patients;
CREATE POLICY "Allow authenticated access to patients" ON patients FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated access to patient_tasks" ON patient_tasks;
CREATE POLICY "Allow authenticated access to patient_tasks" ON patient_tasks FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated access to vitals" ON vitals;
CREATE POLICY "Allow authenticated access to vitals" ON vitals FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated access to care_plan_entries" ON care_plan_entries;
CREATE POLICY "Allow authenticated access to care_plan_entries" ON care_plan_entries FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated access to shift_notes" ON shift_notes;
CREATE POLICY "Allow authenticated access to shift_notes" ON shift_notes FOR ALL USING (auth.role() = 'authenticated');
