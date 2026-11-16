import { describe, it, expect } from 'vitest';
import { processRdsEnrollment, RDS_QUEUE_NAME } from './worker';

describe('SmartAdvisor RDS Worker Processing', () => {
  it('should expose the correct queue name', () => {
    expect(RDS_QUEUE_NAME).toBe('rds-enrollment-queue');
  });

  it('should successfully process a valid enrollment task', async () => {
    const payload = {
      studentId: '21200000',
      courseCode: 'CSE327',
      section: 4,
      semester: 'Spring 2026'
    };

    const result = await processRdsEnrollment(payload);

    expect(result.success).toBe(true);
    expect(result.studentId).toBe('21200000');
    expect(result.courseCode).toBe('CSE327');
    expect(result.message).toContain('Successfully processed enrollment');
    expect(result.enrolledAt).toBeDefined();
  });

  it('should throw an error when missing required payload fields', async () => {
    const invalidPayload = {
      studentId: '',
      courseCode: 'CSE327',
      section: 0,
      semester: 'Spring 2026'
    };

    await expect(processRdsEnrollment(invalidPayload)).rejects.toThrow(
      'Invalid enrollment payload'
    );
  });
});
