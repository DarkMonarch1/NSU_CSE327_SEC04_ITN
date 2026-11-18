import { Router, Request, Response } from 'express';
import { backendStore } from '../store/backendStore';

export const demoRouter = Router();

/**
 * POST /api/v1/demo/surge
 *
 * Simulates high-concurrency surge spike (3,450 req/s, 275ms latency),
 * triggering active SEV-1 incident state.
 */
demoRouter.post('/surge', (_req: Request, res: Response) => {
  backendStore.updateState((s) => {
    s.metrics = {
      ...s.metrics,
      requestsPerSec: 3450,
      p95LatencyMs: 275,
      poolUsed: 194,
      surgeSpikeActive: true,
      lastScalingEvent: 'Simulated high-concurrency surge spike triggered.'
    };
  });

  backendStore.addAuditLog(
    'Surge Simulation Generator',
    'Traffic Spike Injected',
    'Injected 3,450 req/s load. P95 latency jumped to 275 ms (Breaching SLA Ceiling).',
    'crimson'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/demo/section-full
 * Body: { sectionId: string }
 *
 * Simulates real-time seat exhaustion on a section by setting enrolled = capacity.
 */
demoRouter.post('/section-full', (req: Request, res: Response) => {
  const { sectionId } = req.body || {};

  const state = backendStore.getState();
  const targetSection = state.sections.find((s) => s.id === sectionId);

  if (!targetSection) {
    return res.status(404).json({
      ok: false,
      message: 'Section not found'
    });
  }

  backendStore.updateState((s) => {
    s.sections = s.sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          enrolled: sec.capacity
        };
      }
      return sec;
    });
  });

  backendStore.addAuditLog(
    'Seat Contention Daemon',
    'Section Sold Out (40/40)',
    `${targetSection.courseCode} Sec ${targetSection.sectionNumber} reached full capacity (0 available).`,
    'crimson'
  );

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});

/**
 * POST /api/v1/demo/reset
 *
 * Restores entire in-memory dual-mode backend store to pristine initial state fixtures.
 */
demoRouter.post('/reset', (_req: Request, res: Response) => {
  backendStore.resetState();

  return res.status(200).json({
    ok: true,
    state: backendStore.getState()
  });
});
