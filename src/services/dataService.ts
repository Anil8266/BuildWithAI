import { collection, doc, setDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MOCK_PATIENTS, MOCK_PROFILES, MOCK_TASKS, MOCK_ORGANIZATIONS } from '../data';
import { Patient, Profile, PatientTask, Organization } from '../types';

// Seed Database
export async function seedDatabase() {
  console.log("Seeding database with mock data...");
  try {
    // Organizations
    for (const org of MOCK_ORGANIZATIONS) {
      await setDoc(doc(db, 'organizations', org.id), org);
    }
    // Profiles
    for (const profile of MOCK_PROFILES) {
      await setDoc(doc(db, 'profiles', profile.id), profile);
    }
    // Patients
    for (const patient of MOCK_PATIENTS) {
      await setDoc(doc(db, 'patients', patient.id), patient);
    }
    // Tasks
    for (const task of MOCK_TASKS) {
      await setDoc(doc(db, 'patient_tasks', task.id), task);
    }
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Subscriptions
export function subscribeToPatients(callback: (patients: Patient[]) => void) {
  const patientCol = collection(db, 'patients');
  return onSnapshot(patientCol, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Patient));
  });
}

export function subscribeToTasks(patientId: string, callback: (tasks: PatientTask[]) => void) {
  const q = query(collection(db, 'patient_tasks'), where('patient_id', '==', patientId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as PatientTask));
  });
}
