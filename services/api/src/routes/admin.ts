import { Router, Request, Response } from 'express';
import { backendStore } from '../store/backendStore';
import { CourseSection } from '../types';

export const adminRouter = Router();

/**
 * POST /api/v1/admin/scale
 *
 * Simulates Kubernetes node auto-scaling: increments apiNodes by +2,
 * drops p95 latency to 138ms, records the scaling event and logs.
 */
adminRouter.post('/scale', (_req: Request, res: Response) => {
  backendStore.updateState((s) => {
    const nextNodes = s.metrics.apiNodes + 2;
    s.metrics = {
      ...s.metrics,
      apiNodes: nextNodes,
      p95LatencyMs: 138,
      requestsPerSec: Math.max(1842, s.metrics.requestsPerSec),
      lastScalingEvent: `Scaled +2 nodes (${nextNodes} active). p95 Latency stabilized to 138 ms.`
    };
  });

  backendStore.addAuditLog(
    'IT Operations Edge Controller',
    'Cluster Auto-Scaled',
    'Provisioned 2 worker instances. P95 latency dropped from 218 ms to 138 ms (SLA <200 ms met).',
    'emerald'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/admin/acknowledge
 *
 * Acknowledges active surge spike incident, resetting surgeSpikeActive to false.
 */
adminRouter.post('/acknowledge', (_req: Request, res: Response) => {
  backendStore.updateState((s) => {
    s.metrics = {
      ...s.metrics,
      surgeSpikeActive: false,
      lastScalingEvent: 'SEV-1 incident acknowledged by on-call engineer.'
    };
  });

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/admin/sections/emergency
 * Body: { courseCode: string; sectionData?: Partial<CourseSection> }
 *
 * Provisions an emergency Section 05 for a course under high waitlist surge,
 * updates the matching escalation status to 'Mitigated', and logs the action.
 */
adminRouter.post('/sections/emergency', (req: Request, res: Response) => {
  const { courseCode, sectionData = {} } = req.body || {};

  if (!courseCode) {
    return res.status(400).json({
      ok: false,
      message: 'Course code is required'
    });
  }

  const newSectionId = `${courseCode.replace(/\s+/g, '')}-05`;
  const newSection: CourseSection = {
    id: newSectionId,
    courseCode,
    courseTitle: courseCode === 'CSE 327' ? 'Software Engineering' : 'Course',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '05',
    faculty: sectionData.faculty || 'Mr. Tanvir Rahman',
    days: sectionData.days || 'MW',
    timeSlot: sectionData.timeSlot || '04:20 PM - 05:50 PM',
    room: sectionData.room || 'LIB 608',
    capacity: 40,
    enrolled: 0,
    waitlisted: 0,
    prerequisites: ['CSE 215'],
    ...sectionData
  };

  backendStore.updateState((s) => {
    s.sections = [...s.sections, newSection];
    s.escalations = s.escalations.map((esc) => {
      if (esc.courseCode === courseCode) {
        return {
          ...esc,
          status: 'Mitigated',
          totalCapacity: esc.totalCapacity + 40,
          deficit: Math.max(0, esc.deficit - 40)
        };
      }
      return esc;
    });
  });

  backendStore.addAuditLog(
    'IT Operations Administrator',
    'Emergency Section Provisioned',
    `Created ${courseCode} Sec 05 (${newSection.room}, ${newSection.timeSlot}) with 40 seats.`,
    'emerald'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/admin/courses/add-seats
 * Body: { courseCode: string; count: number }
 *
 * Adds seats across all sections of a course, marks matching escalation 'Resolved',
 * and logs the batch capacity increase.
 */
adminRouter.post('/courses/add-seats', (req: Request, res: Response) => {
  const { courseCode, count } = req.body || {};

  if (!courseCode) {
    return res.status(400).json({
      ok: false,
      message: 'Course code is required'
    });
  }

  const numericCount = Number(count) || 0;

  backendStore.updateState((s) => {
    s.sections = s.sections.map((sec) => {
      if (sec.courseCode === courseCode) {
        return {
          ...sec,
          capacity: sec.capacity + numericCount
        };
      }
      return sec;
    });

    s.escalations = s.escalations.map((esc) => {
      if (esc.courseCode === courseCode) {
        return {
          ...esc,
          totalCapacity: esc.totalCapacity + numericCount * 4,
          deficit: Math.max(0, esc.deficit - numericCount * 4),
          status: 'Resolved'
        };
      }
      return esc;
    });
  });

  backendStore.addAuditLog(
    'IT Operations Administrator',
    'Batch Capacity Added',
    `Added +${numericCount} seats across all sections of ${courseCode}.`,
    'emerald'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});
