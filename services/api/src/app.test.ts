import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './app';
import { backendStore } from './store/backendStore';
import { checkCreditFloor, detectScheduleClashes } from './services/ruleValidator';
import { INITIAL_STUDENT, INITIAL_SECTIONS } from './seedData';
import { CourseSection, ExceptionCase, BypassRule } from './types';

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

describe('Student Portal Advising & ACID Enrollment Routes', () => {
  beforeEach(() => {
    backendStore.resetState();
  });

  it('POST /api/v1/student/cart/stage with { sectionId: "CSE331-01" } returns 200 and adds CSE331-01 to stagedSectionIds', async () => {
    const res = await request(app)
      .post('/api/v1/student/cart/stage')
      .send({ sectionId: 'CSE331-01' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.state.stagedSectionIds).toContain('CSE331-01');
  });

  it('POST /api/v1/student/cart/stage with { sectionId: "CSE425-01" } returns 422 with modal: "rule_alert" and payload.ruleCode === "RULE-4.2"', async () => {
    const res = await request(app)
      .post('/api/v1/student/cart/stage')
      .send({ sectionId: 'CSE425-01' });

    expect(res.status).toBe(422);
    expect(res.body.ok).toBe(false);
    expect(res.body.modal).toBe('rule_alert');
    expect(res.body.payload.ruleCode).toBe('RULE-4.2');
    expect(res.body.payload.studentCredits).toBe(96);
    expect(res.body.payload.requiredCredits).toBe(100);
  });

  it('POST /api/v1/student/cart/stage with { sectionId: "CSE327-03" } (40/40 full) returns 409 with modal: "section_full" and non-empty payload.alternatives', async () => {
    const res = await request(app)
      .post('/api/v1/student/cart/stage')
      .send({ sectionId: 'CSE327-03' });

    expect(res.status).toBe(409);
    expect(res.body.ok).toBe(false);
    expect(res.body.modal).toBe('section_full');
    expect(res.body.payload.fullSection.id).toBe('CSE327-03');
    expect(res.body.payload.alternatives.length).toBeGreaterThan(0);
    expect(
      res.body.payload.alternatives.every(
        (alt: CourseSection) => alt.courseCode === 'CSE 327' && alt.capacity - alt.enrolled > 0
      )
    ).toBe(true);
  });

  it('DELETE /api/v1/student/cart/MAT361-04 returns 200 and removes MAT361-04 from stagedSectionIds', async () => {
    expect(backendStore.getState().stagedSectionIds).toContain('MAT361-04');

    const res = await request(app).delete('/api/v1/student/cart/MAT361-04');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.state.stagedSectionIds).not.toContain('MAT361-04');
  });

  it('POST /api/v1/student/enroll/confirm returns 200, increments enrolled on staged sections, and returns a ScheduleReceipt whose digitalSignature starts with "SHA256:"', async () => {
    const preConfirmState = backendStore.getState();
    const cse327Before = preConfirmState.sections.find((s) => s.id === 'CSE327-01')!;

    const res = await request(app).post('/api/v1/student/enroll/confirm');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.receipt).toBeDefined();
    expect(res.body.receipt.digitalSignature.startsWith('SHA256:')).toBe(true);
    expect(res.body.receipt.transactionId).toMatch(/^#RDS-TXN-2025-\d{5}$/);
    expect(res.body.receipt.totalCredits).toBe(10);

    const cse327After = res.body.state.sections.find((s: CourseSection) => s.id === 'CSE327-01')!;
    expect(cse327After.enrolled).toBe(cse327Before.enrolled + 1);
  });
});

describe('Faculty Portal Exception & Rule Routes', () => {
  beforeEach(() => {
    backendStore.resetState();
  });

  it('POST /api/v1/faculty/exceptions/decision approving "CASE #EX-2025-0841" sets status to "approved" and increments CSE425-01 capacity and enrolled count', async () => {
    const preState = backendStore.getState();
    const cse425Before = preState.sections.find((s) => s.id === 'CSE425-01')!;

    const res = await request(app)
      .post('/api/v1/faculty/exceptions/decision')
      .send({ caseId: 'CASE #EX-2025-0841', action: 'approve' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updatedCase = res.body.state.exceptions.find((e: ExceptionCase) => e.id === 'CASE #EX-2025-0841');
    expect(updatedCase?.status).toBe('approved');
    expect(updatedCase?.facultyDecisionBy).toBe('Dr. Nova Ahmed');

    const cse425After = res.body.state.sections.find((s: CourseSection) => s.id === 'CSE425-01')!;
    expect(cse425After.capacity).toBe(cse425Before.capacity + 1);
    expect(cse425After.enrolled).toBe(cse425Before.enrolled + 1);
  });

  it('POST /api/v1/faculty/exceptions/decision rejecting "CASE #EX-2025-0839" sets status to "rejected"', async () => {
    const res = await request(app)
      .post('/api/v1/faculty/exceptions/decision')
      .send({ caseId: 'CASE #EX-2025-0839', action: 'reject' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updatedCase = res.body.state.exceptions.find((e: ExceptionCase) => e.id === 'CASE #EX-2025-0839');
    expect(updatedCase?.status).toBe('rejected');
    expect(updatedCase?.facultyDecisionBy).toBe('Dr. Nova Ahmed');
  });

  it('POST /api/v1/faculty/sections/expand-capacity with { sectionId: "CSE327-01", delta: 10 } increases capacity from 40 to 50', async () => {
    const preState = backendStore.getState();
    const secBefore = preState.sections.find((s) => s.id === 'CSE327-01')!;
    expect(secBefore.capacity).toBe(40);

    const res = await request(app)
      .post('/api/v1/faculty/sections/expand-capacity')
      .send({ sectionId: 'CSE327-01', delta: 10 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const secAfter = res.body.state.sections.find((s: CourseSection) => s.id === 'CSE327-01')!;
    expect(secAfter.capacity).toBe(50);
  });

  it('POST /api/v1/faculty/rules/toggle with { ruleId: "rule-6-3" } toggles enabled from false to true', async () => {
    const preState = backendStore.getState();
    const ruleBefore = preState.bypassRules.find((r) => r.id === 'rule-6-3')!;
    expect(ruleBefore.enabled).toBe(false);

    const res = await request(app)
      .post('/api/v1/faculty/rules/toggle')
      .send({ ruleId: 'rule-6-3' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const ruleAfter = res.body.state.bypassRules.find((r: BypassRule) => r.id === 'rule-6-3')!;
    expect(ruleAfter?.enabled).toBe(true);
  });
});
