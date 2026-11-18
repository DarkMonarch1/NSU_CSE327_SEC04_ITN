import { Router, Request, Response } from 'express';
import { backendStore } from '../store/backendStore';

export const sseRouter = Router();

sseRouter.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  if (res.flushHeaders) {
    res.flushHeaders();
  }

  res.write(': connected\n\n');

  const unsubscribe = backendStore.subscribe((state) => {
    res.write(`data: ${JSON.stringify({ type: 'SYNC_UPDATE', state, timestamp: Date.now() })}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
    res.end();
  });
});
