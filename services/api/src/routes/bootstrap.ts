import { Router, Request, Response } from 'express';
import { backendStore } from '../store/backendStore';
import { detectScheduleClashes } from '../services/ruleValidator';
import { CourseSection } from '../types';

export const bootstrapRouter = Router();

bootstrapRouter.get('/bootstrap', (_req: Request, res: Response) => {
  const state = backendStore.getState();

  const stagedSections: CourseSection[] = state.stagedSectionIds
    .map((id) => state.sections.find((s) => s.id === id))
    .filter((s): s is CourseSection => Boolean(s));

  const totalCredits = stagedSections.reduce((acc, curr) => acc + curr.credits, 0);

  const clashes = detectScheduleClashes(stagedSections);

  res.status(200).json({
    ...state,
    stagedSections,
    totalCredits,
    clashes
  });
});
