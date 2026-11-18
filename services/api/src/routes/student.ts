import { Router, Request, Response } from 'express';
import { backendStore } from '../store/backendStore';
import { checkCreditFloor } from '../services/ruleValidator';

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
