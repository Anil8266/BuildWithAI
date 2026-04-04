-- Migration: 01_seed.sql

-- Insert mock clinic
INSERT INTO clinics (id, name, timezone)
VALUES ('748882ca-8c01-4475-be45-e6f66de940fa', 'St. Jude Medical Center', 'America/New_York')
ON CONFLICT DO NOTHING;

-- Insert mock initial profiles
INSERT INTO profiles (id, clinic_id, role, full_name, email, specialty, is_active)
VALUES 
  ('123e4567-e89b-12d3-a456-426614174000', '748882ca-8c01-4475-be45-e6f66de940fa', 'doctor', 'Dr. Amit Shah', 'amit@syncro.care', 'Cardiologist', true),
  ('123e4567-e89b-12d3-a456-426614174001', '748882ca-8c01-4475-be45-e6f66de940fa', 'nurse', 'Nurse Sarah', 'sarah@syncro.care', NULL, true)
ON CONFLICT DO NOTHING;

-- Insert mocked patients
INSERT INTO patients (id, clinic_id, mrn, full_name, date_of_birth, gender, triage_status, icd10_diagnoses, has_app_access, created_by)
VALUES 
  ('f4115160-5f25-4c07-ba91-c8cc29d712e5', '748882ca-8c01-4475-be45-e6f66de940fa', 'MRN-2024-001', 'Priya Mehta', '1962-03-14', 'female', 'critical', ARRAY['I10', 'E11.9'], true, '123e4567-e89b-12d3-a456-426614174000'),
  ('f4115160-5f25-4c07-ba91-c8cc29d712e6', '748882ca-8c01-4475-be45-e6f66de940fa', 'MRN-2024-002', 'Arjun Sharma', '1955-07-22', 'male', 'pending', ARRAY['E11.9', 'I25.10'], true, '123e4567-e89b-12d3-a456-426614174000'),
  ('f4115160-5f25-4c07-ba91-c8cc29d712e7', '748882ca-8c01-4475-be45-e6f66de940fa', 'MRN-2024-003', 'Kavitha Nair', '1978-11-05', 'female', 'stable', ARRAY['J45.20'], true, '123e4567-e89b-12d3-a456-426614174000'),
  ('f4115160-5f25-4c07-ba91-c8cc29d712e8', '748882ca-8c01-4475-be45-e6f66de940fa', 'MRN-2024-004', 'Ravi Kumar', '1945-09-18', 'male', 'stable', ARRAY['I50.9'], false, '123e4567-e89b-12d3-a456-426614174000'),
  ('f4115160-5f25-4c07-ba91-c8cc29d712e9', '748882ca-8c01-4475-be45-e6f66de940fa', 'MRN-2024-005', 'Sunita Patel', '1970-04-30', 'female', 'critical', ARRAY['I10', 'N18.3'], true, '123e4567-e89b-12d3-a456-426614174000')
ON CONFLICT DO NOTHING;

-- Insert mocked tasks for Priya Mehta
INSERT INTO patient_tasks (id, patient_id, task_type, instruction, scheduled_date, status, time_of_day, is_urgent, context_note)
VALUES
  ('a82d0fd5-e3d0-482a-bc99-2a9f73f8489f', 'f4115160-5f25-4c07-ba91-c8cc29d712e5', 'medication', 'Take 1 white pill (Lisinopril 20mg)', '2026-04-05', 'pending', 'morning', true, 'With food. This is your blood pressure medication.'),
  ('a82d0fd5-e3d0-482a-bc99-2a9f73f8489e', 'f4115160-5f25-4c07-ba91-c8cc29d712e5', 'medication', 'Take 1 small blue pill (Atorvastatin 10mg)', '2026-04-05', 'pending', 'evening', false, 'Before bed. This helps lower your cholesterol.'),
  ('a82d0fd5-e3d0-482a-bc99-2a9f73f8489d', 'f4115160-5f25-4c07-ba91-c8cc29d712e5', 'photo_upload', 'Take a photo of your arm (medication patch)', '2026-04-05', 'pending', 'morning', false, 'Dr. Shah needs to check the patch placement.'),
  ('a82d0fd5-e3d0-482a-bc99-2a9f73f8489c', 'f4115160-5f25-4c07-ba91-c8cc29d712e5', 'general', 'Check your blood pressure at home', '2026-04-05', 'done', 'afternoon', false, 'Use your home BP monitor. Note the reading.')
ON CONFLICT DO NOTHING;
