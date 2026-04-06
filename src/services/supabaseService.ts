import { supabase } from '../supabase';
import { Patient, PatientTask, Profile, Organization, Vital } from '../types';

// Patients
export function subscribeToPatients(callback: (patients: Patient[]) => void) {
  // Get initial data
  supabase
    .from('patients')
    .select('*')
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data as Patient[]);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('patients_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (!error && data) {
        callback(data as Patient[]);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function getPatientById(id: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*, organization:organizations(*), creator:profiles(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Patient;
}

// Tasks
export function subscribeToTasks(patientId: string, callback: (tasks: PatientTask[]) => void) {
  // Get initial data
  supabase
    .from('patient_tasks')
    .select('*')
    .eq('patient_id', patientId)
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data as PatientTask[]);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel(`tasks_channel_${patientId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'patient_tasks',
      filter: `patient_id=eq.${patientId}`
    }, async () => {
      const { data, error } = await supabase
        .from('patient_tasks')
        .select('*')
        .eq('patient_id', patientId);
      if (!error && data) {
        callback(data as PatientTask[]);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function updateTaskStatus(taskId: string, status: PatientTask['status']) {
  const { data, error } = await supabase
    .from('patient_tasks')
    .update({ status, completed_at: status === 'done' ? new Date().toISOString() : null })
    .eq('id', taskId)
    .select()
    .single();
    
  if (error) throw error;
  return data as PatientTask;
}

// Vitals
export async function getPatientVitals(patientId: string) {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false });
    
  if (error) throw error;
  return data as Vital[];
}

export async function recordVital(vital: Omit<Vital, 'id'>) {
  const { data, error } = await supabase
    .from('vitals')
    .insert(vital)
    .select()
    .single();
    
  if (error) throw error;
  return data as Vital;
}

// Care Plans
export async function createCarePlanEntry(entry: any) {
  const { data, error } = await supabase
    .from('care_plan_entries')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Shift Notes
export async function createShiftNote(note: { patient_id: string; author_id: string; note: string }) {
  const { data, error } = await supabase
    .from('shift_notes')
    .insert(note)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Auth Profiles
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*, organization:organizations(*)')
    .eq('id', user.id)
    .single();
    
  if (error) return null;
  return data as Profile;
}
