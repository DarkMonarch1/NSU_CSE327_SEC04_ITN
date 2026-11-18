import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { backendStore } from '../store/backendStore';
import { checkCreditFloor } from '../services/ruleValidator';
import { CourseSection, ScheduleReceipt } from '../types';

export const studentRouter = Router();

/**
 * POST /api/v1/student/cart/stage
 * Body: { sectionId: string }
 *
 * Stages a course section into the student's cart, enforcing Rule 4.2 credit floor
 * and seat availability checks.
 */
studentRouter.post('/cart/stage', (req: Request, res: Response) => {
  const { sectionId } = req.body || {};

  const state = backendStore.getState();
  const targetSection = state.sections.find((s) => s.id === sectionId);

  // 1. Return 404 if section does not exist
  if (!targetSection) {
    return res.status(404).json({
      ok: false,
      message: 'Section not found'
    });
  }

  // 2. Return 200 if already staged
  if (state.stagedSectionIds.includes(sectionId)) {
    return res.status(200).json({
      ok: true,
      state: backendStore.getState()
    });
  }

  // 3. Enforce Rule 4.2 credit floor standing check
  const creditFloorResult = checkCreditFloor(targetSection, state.student);
  if (!creditFloorResult.passed) {
    return res.status(422).json({
      ok: false,
      modal: 'rule_alert',
      payload: {
        section: targetSection,
        studentCredits: creditFloorResult.studentCredits,
        requiredCredits: creditFloorResult.requiredCredits,
        ruleCode: 'RULE-4.2'
      }
    });
  }

  // 4. Enforce seat availability check
  if (targetSection.capacity - targetSection.enrolled <= 0) {
    const alternatives = state.sections.filter(
      (s) =>
        s.courseCode === targetSection.courseCode &&
        s.id !== targetSection.id &&
        s.capacity - s.enrolled > 0
    );

    return res.status(409).json({
      ok: false,
      modal: 'section_full',
      payload: {
        fullSection: targetSection,
        alternatives
      }
    });
  }

  // 5. Replace existing staged section of same courseCode with sectionId
  backendStore.updateState((s) => {
    const filteredStagedIds = s.stagedSectionIds.filter((id) => {
      const sec = s.sections.find((item) => item.id === id);
      return sec?.courseCode !== targetSection.courseCode;
    });
    s.stagedSectionIds = [...filteredStagedIds, sectionId];
  });

  // Prepend teal audit log
  backendStore.addAuditLog(
    state.student.name,
    'Section Staged',
    `Staged ${targetSection.courseCode} Sec ${targetSection.sectionNumber} (${targetSection.timeSlot})`,
    'teal'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * DELETE /api/v1/student/cart/:sectionId
 *
 * Removes a course section from the student's staged cart and records an audit log.
 */
studentRouter.delete('/cart/:sectionId', (req: Request, res: Response) => {
  const { sectionId } = req.params;

  const state = backendStore.getState();
  const targetSection = state.sections.find((s) => s.id === sectionId);

  // Remove sectionId from stagedSectionIds
  backendStore.updateState((s) => {
    s.stagedSectionIds = s.stagedSectionIds.filter((id) => id !== sectionId);
  });

  // Prepend amber audit log
  backendStore.addAuditLog(
    state.student.name,
    'Section Removed',
    `Removed ${targetSection?.courseCode || sectionId} from draft plan.`,
    'amber'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/student/enroll/confirm
 *
 * Confirms the student's staged schedule, atomically increments enrolled seat counts,
 * computes deterministic SHA-256 digital signature, stores official ScheduleReceipt,
 * and logs the lock action.
 */
studentRouter.post('/enroll/confirm', (_req: Request, res: Response) => {
  const state = backendStore.getState();
  const student = state.student;
  const stagedSectionIds = state.stagedSectionIds;

  const hashPayload = `${student.id}:${student.cartToken}:${stagedSectionIds.join(',')}`;
  const hashHex = crypto.createHash('sha256').update(hashPayload).digest('hex');
  const digitalSignature = `SHA256:${hashHex}`;

  const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
  const transactionId = `#RDS-TXN-2025-${randomFiveDigit}`;

  let stagedSections: CourseSection[] = [];
  let totalCredits = 0;
  let receipt: ScheduleReceipt;

  backendStore.updateState((s) => {
    s.sections = s.sections.map((sec) => {
      if (s.stagedSectionIds.includes(sec.id)) {
        return {
          ...sec,
          enrolled: Math.min(sec.capacity, sec.enrolled + 1)
        };
      }
      return sec;
    });

    stagedSections = s.stagedSectionIds
      .map((id) => s.sections.find((sec) => sec.id === id))
      .filter((sec): sec is CourseSection => Boolean(sec));

    totalCredits = stagedSections.reduce((acc, curr) => acc + curr.credits, 0);

    receipt = {
      transactionId,
      studentId: student.id,
      cartToken: student.cartToken,
      timestamp: new Date().toLocaleString(),
      totalCredits,
      sections: stagedSections,
      digitalSignature
    };

    s.receipt = receipt;
  });

  backendStore.addAuditLog(
    student.name,
    'RDS Enrollment Locked',
    `Schedule locked with ${totalCredits} Cr. Generated ${receipt!.transactionId}`,
    'emerald'
  );

  return res.status(200).json({
    ok: true,
    receipt: receipt!,
    state: backendStore.getState()
  });
});
