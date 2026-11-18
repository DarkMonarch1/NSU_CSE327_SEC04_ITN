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

/**
 * POST /api/v1/faculty/sections/expand-capacity
 * Body: { sectionId: string; delta: number }
 *
 * Expands section capacity by delta and logs the modification.
 */
facultyRouter.post('/sections/expand-capacity', (req: Request, res: Response) => {
  const { sectionId, delta } = req.body || {};

  const state = backendStore.getState();
  const targetSection = state.sections.find((s) => s.id === sectionId);

  if (!targetSection) {
    return res.status(404).json({
      ok: false,
      message: 'Section not found'
    });
  }

  const numericDelta = Number(delta) || 0;
  const targetCourse = `${targetSection.courseCode} Sec ${targetSection.sectionNumber}`;

  backendStore.updateState((s) => {
    s.sections = s.sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          capacity: sec.capacity + numericDelta
        };
      }
      return sec;
    });
  });

  backendStore.addAuditLog(
    'Dr. Nova Ahmed (Faculty)',
    'Capacity Expanded',
    `Expanded ${targetCourse} capacity by +${numericDelta} seats (Safe room cap: 55).`,
    'emerald'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/faculty/rules/toggle
 * Body: { ruleId: string }
 *
 * Toggles a senate bypass rule on/off and logs the activation or suspension.
 */
facultyRouter.post('/rules/toggle', (req: Request, res: Response) => {
  const { ruleId } = req.body || {};

  const state = backendStore.getState();
  const targetRule = state.bypassRules.find((r) => r.id === ruleId);

  if (!targetRule) {
    return res.status(404).json({
      ok: false,
      message: 'Rule not found'
    });
  }

  const isNowEnabled = !targetRule.enabled;
  const ruleTitle = targetRule.title;

  backendStore.updateState((s) => {
    s.bypassRules = s.bypassRules.map((r) => {
      if (r.id === ruleId) {
        return {
          ...r,
          enabled: isNowEnabled
        };
      }
      return r;
    });
  });

  backendStore.addAuditLog(
    'Faculty Executive Committee',
    isNowEnabled ? 'Rule Activated' : 'Rule Suspended',
    `${ruleTitle} was ${isNowEnabled ? 'enabled' : 'suspended'}.`,
    isNowEnabled ? 'emerald' : 'amber'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});
