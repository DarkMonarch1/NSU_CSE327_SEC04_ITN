import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';
import { checkCreditFloor, detectScheduleClashes } from './services/ruleValidator';
import { INITIAL_STUDENT, INITIAL_SECTIONS } from './seedData';
import { CourseSection } from './types';

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

describe('SmartAdvisor Bootstrap & Rule Validator', () => {
  it('GET /api/v1/bootstrap returns 200 with complete initial state and derived values', async () => {
    const res = await request(app).get('/api/v1/bootstrap');
    expect(res.status).toBe(200);
    expect(res.body.student.id).toBe('2412159042');
    expect(res.body.sections).toHaveLength(9);
    expect(res.body.stagedSectionIds).toHaveLength(4);
    expect(res.body.totalCredits).toBe(10);
    expect(res.body.exceptions).toHaveLength(3);
    expect(res.body.bypassRules).toHaveLength(4);
  });

  it('checkCreditFloor blocks CSE425-01 under Rule 4.2 and passes CSE327-01', () => {
    const cse425 = INITIAL_SECTIONS.find((s) => s.id === 'CSE425-01')!;
    const cse327 = INITIAL_SECTIONS.find((s) => s.id === 'CSE327-01')!;

    const result425 = checkCreditFloor(cse425, INITIAL_STUDENT);
    expect(result425.passed).toBe(false);
    expect(result425.ruleCode).toBe('RULE-4.2');
    expect(result425.studentCredits).toBe(96);
    expect(result425.requiredCredits).toBe(100);

    const result327 = checkCreditFloor(cse327, INITIAL_STUDENT);
    expect(result327.passed).toBe(true);
    expect(result327.ruleCode).toBe('RULE-4.2');
  });

  it('detectScheduleClashes detects a clash when two sections share overlapping days and timeSlot', () => {
    const sectionA: CourseSection = {
      ...INITIAL_SECTIONS[0],
      days: 'ST',
      timeSlot: '11:20 AM - 12:50 PM'
    };
    const sectionB: CourseSection = {
      ...INITIAL_SECTIONS[1],
      days: 'Sun',
      timeSlot: '11:20 AM - 12:50 PM'
    };

    const clashes = detectScheduleClashes([sectionA, sectionB]);
    expect(clashes).toHaveLength(1);
    expect(clashes[0].sectionA.id).toBe(sectionA.id);
    expect(clashes[0].sectionB.id).toBe(sectionB.id);
    expect(clashes[0].day).toBe('ST');
    expect(clashes[0].time).toBe('11:20 AM - 12:50 PM');
  });
});
