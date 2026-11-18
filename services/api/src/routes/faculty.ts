import { Router, Request, Response } from 'express';
import { backendStore } from '../store/backendStore';
import { ExceptionCase } from '../types';

export const facultyRouter = Router();

/**
 * POST /api/v1/faculty/exceptions/decision
 * Body: { caseId: string; action: 'approve' | 'reject' | 'flag' }
 *
 * Processes a faculty decision on an exception case:
 * - 'approve': sets status to 'approved', increments section capacity (+1) & enrolled (+1),
 *              and prepends an 'emerald' audit log.
 * - 'reject':  sets status to 'rejected' and prepends a 'crimson' audit log.
 * - 'flag':    sets status to 'flagged' and prepends an 'amber' audit log.
 */
facultyRouter.post('/exceptions/decision', (req: Request, res: Response) => {
  const { caseId, action } = req.body || {};

  const state = backendStore.getState();
  const targetCase = state.exceptions.find((e) => e.id === caseId);

  if (!targetCase) {
    return res.status(404).json({
      ok: false,
      message: 'Exception case not found'
    });
  }

  if (action !== 'approve' && action !== 'reject' && action !== 'flag') {
    return res.status(400).json({
      ok: false,
      message: 'Invalid decision action'
    });
  }

  const decisionTime = new Date().toLocaleTimeString();
  const newStatus: ExceptionCase['status'] =
    action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged';

  backendStore.updateState((s) => {
    s.exceptions = s.exceptions.map((c) => {
      if (c.id === caseId) {
        return {
          ...c,
          status: newStatus,
          facultyDecisionBy: 'Dr. Nova Ahmed',
          facultyDecisionAt: decisionTime
        };
      }
      return c;
    });

    if (action === 'approve') {
      s.sections = s.sections.map((sec) => {
        if (
          sec.courseCode === targetCase.courseCode &&
          sec.sectionNumber === targetCase.sectionNumber
        ) {
          return {
            ...sec,
            capacity: sec.capacity + 1,
            enrolled: sec.enrolled + 1
          };
        }
        return sec;
      });
    }
  });

  if (action === 'approve') {
    backendStore.addAuditLog(
      'Dr. Nova Ahmed (Faculty)',
      'Exception Approved & Enrolled',
      `${caseId} for ${targetCase.studentName} (${targetCase.courseCode} Sec ${targetCase.sectionNumber}) approved under Standing Rule 4.2.`,
      'emerald'
    );
  } else if (action === 'reject') {
    backendStore.addAuditLog(
      'Dr. Nova Ahmed (Faculty)',
      'Exception Rejected',
      `${caseId} declined due to curriculum track guidelines.`,
      'crimson'
    );
  } else if (action === 'flag') {
    backendStore.addAuditLog(
      'Dr. Nova Ahmed (Faculty)',
      'Flagged for In-Person Advising',
      `${caseId} routed to Faculty Consultation Room SAC 502.`,
      'amber'
    );
  }

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});
