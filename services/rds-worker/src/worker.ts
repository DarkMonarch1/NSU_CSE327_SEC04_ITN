import { Worker, Job } from 'bullmq';

export interface RdsEnrollmentPayload {
  studentId: string;
  courseCode: string;
  section: number;
  semester: string;
}

export interface RdsEnrollmentResult {
  success: boolean;
  studentId: string;
  courseCode: string;
  enrolledAt: string;
  message: string;
}

export const RDS_QUEUE_NAME = 'rds-enrollment-queue';

export async function processRdsEnrollment(
  jobData: RdsEnrollmentPayload
): Promise<RdsEnrollmentResult> {
  if (!jobData.studentId || !jobData.courseCode || !jobData.section) {
    throw new Error('Invalid enrollment payload: studentId, courseCode, and section are required');
  }

  return {
    success: true,
    studentId: jobData.studentId,
    courseCode: jobData.courseCode,
    enrolledAt: new Date().toISOString(),
    message: `Successfully processed enrollment for ${jobData.studentId} in ${jobData.courseCode} Sec ${jobData.section}`
  };
}

export function createRdsWorker(redisConnection?: { host: string; port: number }) {
  const connection = redisConnection || {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  };

  return new Worker<RdsEnrollmentPayload, RdsEnrollmentResult>(
    RDS_QUEUE_NAME,
    async (job: Job<RdsEnrollmentPayload, RdsEnrollmentResult>) => {
      return processRdsEnrollment(job.data);
    },
    { connection, autorun: false }
  );
}
