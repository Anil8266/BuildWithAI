import { supabase } from '../supabase';
import { MOCK_PATIENTS, MOCK_PROFILES, MOCK_TASKS, MOCK_ORGANIZATIONS } from '../data';

export async function seedSupabaseDatabase() {
  console.log("Seeding Supabase database with mock data...");
  try {
    // 1. Organizations
    const { error: orgError } = await supabase.from('organizations').upsert(MOCK_ORGANIZATIONS);
    if (orgError) throw orgError;

    // 2. Profiles (Note: These IDs must exist in auth.users if they have FK constraints)
    // For demo purposes, we might need to skip FK constraints or use specific IDs
    const { error: profileError } = await supabase.from('profiles').upsert(MOCK_PROFILES);
    if (profileError) console.warn("Profile seeding warning (likely auth.users constraint):", profileError.message);

    // 3. Patients
    const { error: patientError } = await supabase.from('patients').upsert(MOCK_PATIENTS);
    if (patientError) throw patientError;

    // 4. Tasks
    const { error: taskError } = await supabase.from('patient_tasks').upsert(MOCK_TASKS);
    if (taskError) throw taskError;

    console.log("Supabase database seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error seeding Supabase database:", error);
    return { success: false, error };
  }
}
