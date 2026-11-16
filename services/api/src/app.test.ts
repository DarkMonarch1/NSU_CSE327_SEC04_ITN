import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';

describe('SmartAdvisor API Health Check', () => {
  it('GET /health should return 200 and ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      service: 'smartadvisor-api'
    });
  });

  it('GET / should return welcome message with course information', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.course).toBe('CSE 327 Sec 04');
    expect(res.body.supervisor).toBe('Intisar Tahmeed (ITN)');
  });
});
