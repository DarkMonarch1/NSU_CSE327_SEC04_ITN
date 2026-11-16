import dotenv from 'dotenv';
import { createRdsWorker } from './worker';

dotenv.config();

console.log('[SmartAdvisor RDS Worker] Initializing worker...');

const worker = createRdsWorker();

worker.on('completed', (job) => {
  console.log(`[RDS Worker] Job ${job.id} completed:`, job.returnvalue);
});

worker.on('failed', (job, err) => {
  console.error(`[RDS Worker] Job ${job?.id} failed with error:`, err.message);
});

worker.run().then(() => {
  console.log('[SmartAdvisor RDS Worker] Worker is actively listening for jobs.');
});
