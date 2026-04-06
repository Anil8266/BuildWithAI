import { seedDatabase } from './src/services/dataService';
seedDatabase().then(() => {
  console.log("Seeding complete. Exiting...");
  process.exit(0);
});
