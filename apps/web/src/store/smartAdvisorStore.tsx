'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  StudentProfile,
  CourseSection,
  ExceptionCase,
  BypassRule,
  AuditLogItem,
  AdminMetrics,
  EscalationItem,
  ScheduleReceipt,
  UserRole
} from '@/types';

// ================= INITIAL PRE-SEEDED DATA =================

export const INITIAL_STUDENT: StudentProfile = {
  id: '2412159042',
  name: 'Rahim Ahmed',
  email: 'rahim.ahmed01@northsouth.edu',
  program: 'B.Sc in Computer Science and Engineering',
  standing: 'Senior Standing',
  creditsCompleted: 96,
  creditsTotal: 130,
  cgpa: 3.64,
  cartToken: '#NSU-241215-9042',
  clearedCourses: [
    { code: 'CSE 115', grade: 'A' },
    { code: 'CSE 215', grade: 'A' },
    { code: 'CSE 311', grade: 'A-' },
    { code: 'CSE 231', grade: 'B+' }
  ],
  advisingClearedBy: 'Dr. Nova Ahmed',
  slotClosesAt: new Date(Date.now() + 16094000).toISOString() // ~4h 28m
};

export const INITIAL_SECTIONS: CourseSection[] = [
  {
    id: 'CSE327-01',
    courseCode: 'CSE 327',
    courseTitle: 'Software Engineering',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '01',
    faculty: 'Dr. Nabeel Mohammed',
    days: 'ST',
    timeSlot: '11:20 AM - 12:50 PM',
    room: 'SAC 502',
    capacity: 40,
    enrolled: 28, // 12 available
    waitlisted: 0,
    prerequisites: ['CSE 215']
  },
  {
    id: 'CSE327-02',
    courseCode: 'CSE 327',
    courseTitle: 'Software Engineering',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '02',
    faculty: 'Dr. Silvia Ahmed',
    days: 'MW',
    timeSlot: '09:40 AM - 11:10 AM',
    room: 'NAC 408',
    capacity: 40,
    enrolled: 36, // 04 available (Few Seats)
    waitlisted: 0,
    prerequisites: ['CSE 215']
  },
  {
    id: 'CSE327-03',
    courseCode: 'CSE 327',
    courseTitle: 'Software Engineering',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '03',
    faculty: 'Prof. Dr. Rajesh Palit',
    days: 'ST',
    timeSlot: '01:20 PM - 02:50 PM',
    room: 'SAC 415',
    capacity: 40,
    enrolled: 40, // 00 available (Full)
    waitlisted: 14,
    prerequisites: ['CSE 215']
  },
  {
    id: 'CSE327-04',
    courseCode: 'CSE 327',
    courseTitle: 'Software Engineering',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '04',
    faculty: 'Mr. Tanvir Rahman',
    days: 'RA',
    timeSlot: '04:20 PM - 05:50 PM',
    room: 'LIB 602',
    capacity: 40,
    enrolled: 21, // 19 available
    waitlisted: 0,
    prerequisites: ['CSE 215']
  },
  {
    id: 'CSE311-03',
    courseCode: 'CSE 311',
    courseTitle: 'Database Systems',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '03',
    faculty: 'Dr. Tanjila Farah',
    days: 'MW',
    timeSlot: '09:40 AM - 11:10 AM',
    room: 'NAC 408',
    capacity: 40,
    enrolled: 37, // 03 available (Few Seats Left)
    waitlisted: 0,
    prerequisites: ['CSE 215']
  },
  {
    id: 'CSE311L-02',
    courseCode: 'CSE 311L',
    courseTitle: 'Database Lab',
    department: 'ECE / CSE',
    credits: 1.0,
    sectionNumber: '02',
    faculty: 'Mr. Safayat Hossain',
    days: 'Thu',
    timeSlot: '09:40 AM - 12:40 PM',
    room: 'LIB 608',
    capacity: 35,
    enrolled: 27, // 08 available
    waitlisted: 0,
    prerequisites: ['CSE 215'],
    isLab: true
  },
  {
    id: 'MAT361-04',
    courseCode: 'MAT 361',
    courseTitle: 'Probability & Statistics',
    department: 'Math & Physics',
    credits: 3.0,
    sectionNumber: '04',
    faculty: 'Dr. Hasina Akter',
    days: 'ST',
    timeSlot: '01:20 PM - 02:50 PM',
    room: 'NAC 510',
    capacity: 40,
    enrolled: 18, // 22 available
    waitlisted: 0,
    prerequisites: ['MAT 120']
  },
  {
    id: 'CSE331-01',
    courseCode: 'CSE 331',
    courseTitle: 'Microprocessor Systems',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '01',
    faculty: 'Prof. Dr. Rajesh Palit',
    days: 'MW',
    timeSlot: '01:20 PM - 02:50 PM',
    room: 'SAC 415',
    capacity: 40,
    enrolled: 35, // 05 available
    waitlisted: 0,
    prerequisites: ['CSE 231']
  },
  {
    id: 'CSE425-01',
    courseCode: 'CSE 425',
    courseTitle: 'Concepts of Programming Languages',
    department: 'ECE / CSE',
    credits: 3.0,
    sectionNumber: '01',
    faculty: 'Dr. Nova Ahmed',
    days: 'MW',
    timeSlot: '02:40 PM - 04:10 PM',
    room: 'LIB 602',
    capacity: 40,
    enrolled: 40, // 00 available (Full)
    waitlisted: 10,
    minCreditsRequired: 100,
    prerequisites: ['CSE 215', 'CSE 311']
  }
];

export const INITIAL_STAGED_IDS: string[] = [
  'CSE327-01', // 3.0 Cr ST 11:20 AM
  'CSE311-03', // 3.0 Cr MW 09:40 AM
  'CSE311L-02', // 1.0 Cr Thu 09:40 AM
  'MAT361-04'  // 3.0 Cr ST 01:20 PM
  // Total: 10.0 Cr initial draft
];

export const INITIAL_EXCEPTIONS: ExceptionCase[] = [
  {
    id: 'CASE #EX-2025-0841',
    studentId: '2412159042',
    studentName: 'Rahim Ahmed',
    program: 'B.Sc CSE',
    standing: 'Senior Standing',
    cgpa: 3.64,
    creditsCompleted: 96,
    courseCode: 'CSE 425',
    courseTitle: 'Concepts of Programming Languages',
    sectionNumber: '01',
    category: 'Credit Standing',
    submittedAt: 'Today, 09:14 AM',
    status: 'pending',
    statement:
      'I require CSE 425 this semester to complete my Systems Track capstone prerequisite chain before Fall 2025 graduation. I have completed all core programming courses with A grades.',
    auditChecks: [
      {
        rule: 'Prerequisite Audit: CSE 215',
        description: 'Passed with Grade A (Earned in Spring 2024)',
        passed: true,
        notes: 'Verified via SIS grade record'
      },
      {
        rule: 'Rule 4.2: Credit Standing (100+ Cr Required)',
        description: 'Student has earned 96/130 credits (Delta: -4 Cr)',
        passed: false,
        notes: 'Standing exception required for Senior Track'
      },
      {
        rule: 'CGPA Minimum Threshold (>= 3.00)',
        description: 'Current Cumulative GPA is 3.64',
        passed: true,
        notes: 'Honors list standing qualifies for discretionary waiver'
      },
      {
        rule: 'Seat Capacity Allocation',
        description: 'Section 01 is currently 40/40 (Waitlist Queue Pos #1)',
        passed: true,
        notes: 'Instructor +1 override permitted under Rule 8.4'
      },
      {
        rule: 'Timetable Conflict Audit',
        description: 'MW 02:40 PM - 04:10 PM does not clash with draft plan',
        passed: true,
        notes: '0 timetable conflicts detected'
      },
      {
        rule: 'Senior Priority Allocation',
        description: 'Student is within 34 credits of graduation',
        passed: true,
        notes: 'Degree milestone verified by registrar'
      }
    ]
  },
  {
    id: 'CASE #EX-2025-0839',
    studentId: '2321450042',
    studentName: 'Fariha Tasnim',
    program: 'B.Sc CSE',
    standing: 'Junior Standing',
    cgpa: 3.42,
    creditsCompleted: 68,
    courseCode: 'CSE 327',
    courseTitle: 'Software Engineering',
    sectionNumber: '03',
    category: 'Capacity',
    submittedAt: 'Today, 08:42 AM',
    status: 'pending',
    statement: 'Section 03 fits my thesis scheduling window with Prof. Rajesh Palit.',
    auditChecks: [
      { rule: 'Prerequisite Audit: CSE 215', description: 'Passed with B+', passed: true, notes: 'SIS OK' },
      { rule: 'Seat Capacity', description: 'Full 40/40', passed: false, notes: 'Waitlist position #3' }
    ]
  },
  {
    id: 'CASE #EX-2025-0835',
    studentId: '2211290042',
    studentName: 'Tanveer Hasan',
    program: 'B.Sc CSE',
    standing: 'Senior Standing',
    cgpa: 3.81,
    creditsCompleted: 112,
    courseCode: 'CSE 331',
    courseTitle: 'Microprocessor Systems',
    sectionNumber: '01',
    category: 'Prereqs',
    submittedAt: 'Today, 08:15 AM',
    status: 'pending',
    statement: 'Graduating senior needs concurrent registration with CSE 231 lab.',
    auditChecks: [
      { rule: 'Graduation Verification', description: 'Eligible for degree', passed: true, notes: 'Verified' },
      { rule: 'Prerequisite Co-Registration', description: 'Rule 2.1 waiver', passed: true, notes: 'Waiver active' }
    ]
  }
];

export const INITIAL_BYPASS_RULES: BypassRule[] = [
  {
    id: 'rule-4-2',
    code: 'RULE-4.2',
    title: 'Senior Standing Credit Floor Exception',
    description: 'Allows students with >= 94 credits to register for 400-level courses with advisor consent.',
    category: 'Standing',
    enabled: true,
    lastUpdated: 'Spring 2025 Regular Senate'
  },
  {
    id: 'rule-2-1',
    code: 'RULE-2.1',
    title: 'Prerequisite Co-Registration Exemption',
    description: 'Permits concurrent enrollment in theory and pre-requisite lab during terminal semesters.',
    category: 'Prerequisite',
    enabled: true,
    lastUpdated: 'ECE Academic Council 2024'
  },
  {
    id: 'rule-6-3',
    code: 'RULE-6.3',
    title: 'Consecutive Exam Load Rebalancer',
    description: 'Prevents automated placement if student has 3 consecutive final exams in 24 hours.',
    category: 'Exam Load',
    enabled: false,
    lastUpdated: 'Suspended for Phase 2 Add/Drop'
  },
  {
    id: 'rule-8-4',
    code: 'RULE-8.4',
    title: 'Department Head +10 Seat Override',
    description: 'Authorizes departmental expansion up to physical room fire code limits (LIB 602 max 55).',
    category: 'Capacity',
    enabled: true,
    lastUpdated: 'Office of Registrar Directives'
  }
];

export const INITIAL_AUDIT_LOG: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '10:14:02 AM',
    actor: 'Dr. Nova Ahmed',
    action: 'Advising Clearance Granted',
    details: 'Student Rahim Ahmed (2412159042) cleared for Phase 2 registration window.',
    badgeType: 'emerald'
  },
  {
    id: 'log-2',
    timestamp: '09:45:18 AM',
    actor: 'Automated Rule Engine',
    action: 'Standing Rule Verified',
    details: 'CASE #EX-2025-0841 flagged for advisor sign-off under Rule 4.2.',
    badgeType: 'amber'
  },
  {
    id: 'log-3',
    timestamp: '09:22:40 AM',
    actor: 'IT Operations Node 04',
    action: 'PostgreSQL Pool Rebalanced',
    details: 'Auto-scaled active backend connection pool to 200 slots.',
    badgeType: 'teal'
  }
];

export const INITIAL_METRICS: AdminMetrics = {
  requestsPerSec: 1842,
  p95LatencyMs: 218,
  slaCeilingMs: 200,
  errorRate: 0.08,
  poolUsed: 156,
  poolTotal: 200,
  apiNodes: 6,
  surgeSpikeActive: false,
  lastScalingEvent: 'Initial deployment steady-state'
};

export const INITIAL_ESCALATIONS: EscalationItem[] = [
  {
    id: '#ESC-9481',
    courseCode: 'CSE 327',
    courseTitle: 'Software Engineering',
    enrolled: 125,
    totalCapacity: 160,
    waitlisted: 42,
    deficit: 42,
    severity: 'SEV-1',
    status: 'Open',
    demandSurge: [
      { time: '08:00', requests: 420 },
      { time: '08:30', requests: 890 },
      { time: '09:00', requests: 1450 },
      { time: '09:30', requests: 1842 },
      { time: '10:00', requests: 2180 }
    ],
    breakdown: [
      { major: 'B.Sc CSE (Regular)', count: 28, percentage: 66 },
      { major: 'B.Sc CS (Dual Major)', count: 9, percentage: 22 },
      { major: 'B.Sc EEE / ETE', count: 5, percentage: 12 }
    ]
  },
  {
    id: '#ESC-9482',
    courseCode: 'CSE 425',
    courseTitle: 'Concepts of Programming Languages',
    enrolled: 40,
    totalCapacity: 40,
    waitlisted: 38,
    deficit: 38,
    severity: 'SEV-1',
    status: 'Open',
    demandSurge: [
      { time: '08:00', requests: 310 },
      { time: '08:30', requests: 620 },
      { time: '09:00', requests: 940 },
      { time: '09:30', requests: 1220 },
      { time: '10:00', requests: 1540 }
    ],
    breakdown: [
      { major: 'B.Sc CSE (Graduating Senior)', count: 32, percentage: 84 },
      { major: 'B.Sc CSE (Junior)', count: 6, percentage: 16 }
    ]
  }
];

// ================= CONTEXT & STORE INTERFACE =================

interface SmartAdvisorContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  sections: CourseSection[];
  stagedSectionIds: string[];
  exceptions: ExceptionCase[];
  bypassRules: BypassRule[];
  auditLog: AuditLogItem[];
  metrics: AdminMetrics;
  escalations: EscalationItem[];
  receipt: ScheduleReceipt | null;
  activeModal: 'rule_alert' | 'section_full' | 'capacity_expand' | 'receipt' | 'emergency_section' | null;
  modalPayload: any;
  openModal: (modal: 'rule_alert' | 'section_full' | 'capacity_expand' | 'receipt' | 'emergency_section', payload?: any) => void;
  closeModal: () => void;
  // Actions
  stageSection: (sectionId: string) => boolean;
  unstageSection: (sectionId: string) => void;
  confirmSchedule: () => ScheduleReceipt;
  approveException: (caseId: string) => void;
  rejectException: (caseId: string) => void;
  flagException: (caseId: string) => void;
  expandCapacity: (sectionId: string, delta: number) => void;
  toggleBypassRule: (ruleId: string) => void;
  autoScaleApiNodes: () => void;
  acknowledgeIncident: () => void;
  allocateEmergencySection: (courseCode: string, sectionData: Partial<CourseSection>) => void;
  addSeatsToAllSections: (courseCode: string, count: number) => void;
  // Demo Controls
  simulateSurgeSpike: () => void;
  simulateSectionFull: (sectionId: string) => void;
  resetDemoState: () => void;
  // Helpers
  stagedSections: CourseSection[];
  totalCredits: number;
  clashes: { sectionA: CourseSection; sectionB: CourseSection; day: string; time: string }[];
}

const SmartAdvisorContext = createContext<SmartAdvisorContextType | null>(null);

const STORAGE_KEY = 'smartadvisor_store_v1';
const SYNC_CHANNEL = 'smartadvisor-sync';

export function SmartAdvisorProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('student');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [sections, setSections] = useState<CourseSection[]>(INITIAL_SECTIONS);
  const [stagedSectionIds, setStagedSectionIds] = useState<string[]>(INITIAL_STAGED_IDS);
  const [exceptions, setExceptions] = useState<ExceptionCase[]>(INITIAL_EXCEPTIONS);
  const [bypassRules, setBypassRules] = useState<BypassRule[]>(INITIAL_BYPASS_RULES);
  const [auditLog, setAuditLog] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOG);
  const [metrics, setMetrics] = useState<AdminMetrics>(INITIAL_METRICS);
  const [escalations, setEscalations] = useState<EscalationItem[]>(INITIAL_ESCALATIONS);
  const [receipt, setReceipt] = useState<ScheduleReceipt | null>(null);

  const [activeModal, setActiveModal] = useState<'rule_alert' | 'section_full' | 'capacity_expand' | 'receipt' | 'emergency_section' | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  const openModal = useCallback((modal: any, payload: any = null) => {
    setActiveModal(modal);
    setModalPayload(payload);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  // Broadcast state changes across tabs
  const broadcastState = useCallback((stateToBroadcast: any) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToBroadcast));
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel(SYNC_CHANNEL);
          bc.postMessage({ type: 'SYNC_UPDATE', state: stateToBroadcast, timestamp: Date.now() });
          bc.close();
        }
      }
    } catch (e) {
      console.warn('Cross-tab sync error:', e);
    }
  }, []);

  // Load from localStorage or sync channel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.stagedSectionIds) setStagedSectionIds(parsed.stagedSectionIds);
        if (parsed.exceptions) setExceptions(parsed.exceptions);
        if (parsed.bypassRules) setBypassRules(parsed.bypassRules);
        if (parsed.auditLog) setAuditLog(parsed.auditLog);
        if (parsed.metrics) setMetrics(parsed.metrics);
        if (parsed.escalations) setEscalations(parsed.escalations);
        if (parsed.student) setStudent(parsed.student);
        if (parsed.receipt) setReceipt(parsed.receipt);
      }
    } catch (e) {
      console.warn('Failed to load initial state:', e);
    }

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_UPDATE' && event.data?.state) {
          const s = event.data.state;
          if (s.sections) setSections(s.sections);
          if (s.stagedSectionIds) setStagedSectionIds(s.stagedSectionIds);
          if (s.exceptions) setExceptions(s.exceptions);
          if (s.bypassRules) setBypassRules(s.bypassRules);
          if (s.auditLog) setAuditLog(s.auditLog);
          if (s.metrics) setMetrics(s.metrics);
          if (s.escalations) setEscalations(s.escalations);
          if (s.student) setStudent(s.student);
          if (s.receipt) setReceipt(s.receipt);
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const s = JSON.parse(e.newValue);
          if (s.sections) setSections(s.sections);
          if (s.stagedSectionIds) setStagedSectionIds(s.stagedSectionIds);
          if (s.exceptions) setExceptions(s.exceptions);
          if (s.bypassRules) setBypassRules(s.bypassRules);
          if (s.auditLog) setAuditLog(s.auditLog);
          if (s.metrics) setMetrics(s.metrics);
          if (s.escalations) setEscalations(s.escalations);
          if (s.student) setStudent(s.student);
          if (s.receipt) setReceipt(s.receipt);
        } catch (err) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Sync state helper
  const updateAndBroadcast = useCallback((updater: (prev: any) => any) => {
    setSections((prevSections) => {
      const newState = updater({
        sections: prevSections,
        stagedSectionIds,
        exceptions,
        bypassRules,
        auditLog,
        metrics,
        escalations,
        student,
        receipt
      });
      broadcastState(newState);
      return newState.sections || prevSections;
    });
  }, [stagedSectionIds, exceptions, bypassRules, auditLog, metrics, escalations, student, receipt, broadcastState]);

  // Derived: Staged Sections objects
  const stagedSections = useMemo(() => {
    return stagedSectionIds
      .map((id) => sections.find((s) => s.id === id))
      .filter((s): s is CourseSection => Boolean(s));
  }, [stagedSectionIds, sections]);

  // Derived: Total Credits
  const totalCredits = useMemo(() => {
    return stagedSections.reduce((acc, curr) => acc + curr.credits, 0);
  }, [stagedSections]);

  // Derived: Clashes calculation
  const clashes = useMemo(() => {
    const clashList: { sectionA: CourseSection; sectionB: CourseSection; day: string; time: string }[] = [];
    for (let i = 0; i < stagedSections.length; i++) {
      for (let j = i + 1; j < stagedSections.length; j++) {
        const a = stagedSections[i];
        const b = stagedSections[j];

        // Check matching days: ST with ST, MW with MW, RA with RA or Thu
        const daysOverlap =
          a.days === b.days ||
          (a.days === 'ST' && (b.days === 'Sun' || b.days === 'Tue')) ||
          (b.days === 'ST' && (a.days === 'Sun' || a.days === 'Tue')) ||
          (a.days === 'MW' && (b.days === 'Mon' || b.days === 'Wed')) ||
          (b.days === 'MW' && (a.days === 'Mon' || a.days === 'Wed'));

        if (daysOverlap && a.timeSlot === b.timeSlot) {
          clashList.push({
            sectionA: a,
            sectionB: b,
            day: a.days,
            time: a.timeSlot
          });
        }
      }
    }
    return clashList;
  }, [stagedSections]);

  // ================= ACTION HANDLERS =================

  // Stage section with interactive rule checking
  const stageSection = useCallback((sectionId: string): boolean => {
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!targetSection) return false;

    // 1. Check if section is already staged
    if (stagedSectionIds.includes(sectionId)) return true;

    // 2. Check 400-level credit floor rule (e.g. CSE 425 requires 100 credits, student has 96)
    if (targetSection.minCreditsRequired && student.creditsCompleted < targetSection.minCreditsRequired) {
      openModal('rule_alert', {
        section: targetSection,
        studentCredits: student.creditsCompleted,
        requiredCredits: targetSection.minCreditsRequired,
        ruleCode: 'RULE-4.2'
      });
      return false;
    }

    // 3. Check if section is full (0 seats)
    if (targetSection.capacity - targetSection.enrolled <= 0) {
      const alternativeSections = sections.filter(
        (s) => s.courseCode === targetSection.courseCode && s.id !== targetSection.id && s.capacity - s.enrolled > 0
      );
      openModal('section_full', {
        fullSection: targetSection,
        alternatives: alternativeSections
      });
      return false;
    }

    // 4. Check if student already has another section of the same course
    const filteredStagedIds = stagedSectionIds.filter((id) => {
      const s = sections.find((sec) => sec.id === id);
      return s?.courseCode !== targetSection.courseCode;
    });

    const nextStagedIds = [...filteredStagedIds, sectionId];
    setStagedSectionIds(nextStagedIds);

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: student.name,
      action: 'Section Staged',
      details: `Staged ${targetSection.courseCode} Sec ${targetSection.sectionNumber} (${targetSection.timeSlot})`,
      badgeType: 'teal'
    };

    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds: nextStagedIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });

    return true;
  }, [sections, stagedSectionIds, student, openModal, auditLog, bypassRules, escalations, exceptions, metrics, receipt, broadcastState]);

  // Unstage section
  const unstageSection = useCallback((sectionId: string) => {
    const nextStagedIds = stagedSectionIds.filter((id) => id !== sectionId);
    setStagedSectionIds(nextStagedIds);

    const targetSection = sections.find((s) => s.id === sectionId);
    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: student.name,
      action: 'Section Removed',
      details: `Removed ${targetSection?.courseCode || sectionId} from draft plan.`,
      badgeType: 'amber'
    };

    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds: nextStagedIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [stagedSectionIds, sections, student, auditLog, bypassRules, escalations, exceptions, metrics, receipt, broadcastState]);

  // Confirm schedule & generate official receipt
  const confirmSchedule = useCallback((): ScheduleReceipt => {
    const updatedSections = sections.map((sec) => {
      if (stagedSectionIds.includes(sec.id)) {
        return {
          ...sec,
          enrolled: Math.min(sec.capacity, sec.enrolled + 1)
        };
      }
      return sec;
    });

    const newReceipt: ScheduleReceipt = {
      transactionId: `#RDS-TXN-2025-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: student.id,
      cartToken: student.cartToken,
      timestamp: new Date().toLocaleString(),
      totalCredits,
      sections: stagedSections,
      digitalSignature: `SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    };

    setSections(updatedSections);
    setReceipt(newReceipt);

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: student.name,
      action: 'RDS Enrollment Locked',
      details: `Schedule locked with ${totalCredits} Cr. Generated ${newReceipt.transactionId}`,
      badgeType: 'emerald'
    };

    setAuditLog((prev) => [logItem, ...prev]);

    openModal('receipt', newReceipt);

    broadcastState({
      sections: updatedSections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt: newReceipt
    });

    return newReceipt;
  }, [sections, stagedSectionIds, student, totalCredits, stagedSections, auditLog, bypassRules, escalations, exceptions, metrics, openModal, broadcastState]);

  // Faculty: Approve exception
  const approveException = useCallback((caseId: string) => {
    let targetCase = exceptions.find((e) => e.id === caseId);
    if (!targetCase) return;

    const updatedExceptions: ExceptionCase[] = exceptions.map((c) => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'approved' as const,
          facultyDecisionBy: 'Dr. Nova Ahmed',
          facultyDecisionAt: new Date().toLocaleTimeString()
        };
      }
      return c;
    });

    // Also increment course capacity / enrolled for the student if needed
    const updatedSections = sections.map((sec) => {
      if (sec.courseCode === targetCase?.courseCode && sec.sectionNumber === targetCase?.sectionNumber) {
        return {
          ...sec,
          capacity: sec.capacity + 1,
          enrolled: sec.enrolled + 1
        };
      }
      return sec;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Dr. Nova Ahmed (Faculty)',
      action: 'Exception Approved & Enrolled',
      details: `${caseId} for ${targetCase.studentName} (${targetCase.courseCode} Sec ${targetCase.sectionNumber}) approved under Standing Rule 4.2.`,
      badgeType: 'emerald'
    };

    setExceptions(updatedExceptions);
    setSections(updatedSections);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections: updatedSections,
      stagedSectionIds,
      exceptions: updatedExceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [exceptions, sections, stagedSectionIds, bypassRules, auditLog, metrics, escalations, student, receipt, broadcastState]);

  // Faculty: Reject exception
  const rejectException = useCallback((caseId: string) => {
    const updatedExceptions: ExceptionCase[] = exceptions.map((c) => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'rejected' as const,
          facultyDecisionBy: 'Dr. Nova Ahmed',
          facultyDecisionAt: new Date().toLocaleTimeString()
        };
      }
      return c;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Dr. Nova Ahmed (Faculty)',
      action: 'Exception Rejected',
      details: `${caseId} declined due to curriculum track guidelines.`,
      badgeType: 'crimson'
    };

    setExceptions(updatedExceptions);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds,
      exceptions: updatedExceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [exceptions, sections, stagedSectionIds, bypassRules, auditLog, metrics, escalations, student, receipt, broadcastState]);

  // Faculty: Flag exception for in-person advising
  const flagException = useCallback((caseId: string) => {
    const updatedExceptions: ExceptionCase[] = exceptions.map((c) => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'flagged' as const,
          facultyDecisionBy: 'Dr. Nova Ahmed',
          facultyDecisionAt: new Date().toLocaleTimeString()
        };
      }
      return c;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Dr. Nova Ahmed (Faculty)',
      action: 'Flagged for In-Person Advising',
      details: `${caseId} routed to Faculty Consultation Room SAC 502.`,
      badgeType: 'amber'
    };

    setExceptions(updatedExceptions);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds,
      exceptions: updatedExceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [exceptions, sections, stagedSectionIds, bypassRules, auditLog, metrics, escalations, student, receipt, broadcastState]);

  // Faculty: Expand Capacity modal action
  const expandCapacity = useCallback((sectionId: string, delta: number) => {
    let targetCourse = '';
    const updatedSections = sections.map((sec) => {
      if (sec.id === sectionId) {
        targetCourse = `${sec.courseCode} Sec ${sec.sectionNumber}`;
        return {
          ...sec,
          capacity: sec.capacity + delta
        };
      }
      return sec;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Dr. Nova Ahmed (Faculty)',
      action: 'Capacity Expanded',
      details: `Expanded ${targetCourse} capacity by +${delta} seats (Safe room cap: 55).`,
      badgeType: 'emerald'
    };

    setSections(updatedSections);
    setAuditLog((prev) => [logItem, ...prev]);
    closeModal();

    broadcastState({
      sections: updatedSections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [sections, stagedSectionIds, exceptions, bypassRules, auditLog, metrics, escalations, student, receipt, closeModal, broadcastState]);

  // Faculty: Toggle bypass rule
  const toggleBypassRule = useCallback((ruleId: string) => {
    let ruleTitle = '';
    let isNowEnabled = false;

    const updatedRules = bypassRules.map((r) => {
      if (r.id === ruleId) {
        ruleTitle = r.title;
        isNowEnabled = !r.enabled;
        return {
          ...r,
          enabled: isNowEnabled
        };
      }
      return r;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Faculty Executive Committee',
      action: isNowEnabled ? 'Rule Activated' : 'Rule Suspended',
      details: `${ruleTitle} was ${isNowEnabled ? 'enabled' : 'suspended'}.`,
      badgeType: isNowEnabled ? 'emerald' : 'amber'
    };

    setBypassRules(updatedRules);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds,
      exceptions,
      bypassRules: updatedRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [bypassRules, sections, stagedSectionIds, exceptions, auditLog, metrics, escalations, student, receipt, broadcastState]);

  // Admin: Auto-scale API nodes (+2)
  const autoScaleApiNodes = useCallback(() => {
    const nextNodes = metrics.apiNodes + 2;
    // Drops latency from 218 ms back below 150 ms (e.g. 138 ms)
    const updatedMetrics: AdminMetrics = {
      ...metrics,
      apiNodes: nextNodes,
      p95LatencyMs: 138,
      requestsPerSec: Math.max(1842, metrics.requestsPerSec),
      lastScalingEvent: `Scaled +2 nodes (${nextNodes} active). p95 Latency stabilized to 138 ms.`
    };

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'IT Operations Edge Controller',
      action: 'Cluster Auto-Scaled',
      details: `Provisioned 2 worker instances. P95 latency dropped from 218 ms to 138 ms (SLA <200 ms met).`,
      badgeType: 'emerald'
    };

    setMetrics(updatedMetrics);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics: updatedMetrics,
      escalations,
      student,
      receipt
    });
  }, [metrics, sections, stagedSectionIds, exceptions, bypassRules, auditLog, escalations, student, receipt, broadcastState]);

  // Admin: Acknowledge incident
  const acknowledgeIncident = useCallback(() => {
    const updatedMetrics: AdminMetrics = {
      ...metrics,
      surgeSpikeActive: false,
      lastScalingEvent: 'SEV-1 incident acknowledged by on-call engineer.'
    };
    setMetrics(updatedMetrics);
    broadcastState({
      sections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog,
      metrics: updatedMetrics,
      escalations,
      student,
      receipt
    });
  }, [metrics, sections, stagedSectionIds, exceptions, bypassRules, auditLog, escalations, student, receipt, broadcastState]);

  // Admin: Allocate Emergency Section (e.g. Sec 05 Tanvir Rahman LIB 608)
  const allocateEmergencySection = useCallback((courseCode: string, sectionData: Partial<CourseSection>) => {
    const newSectionId = `${courseCode.replace(/\s+/g, '')}-05`;
    const newSection: CourseSection = {
      id: newSectionId,
      courseCode,
      courseTitle: courseCode === 'CSE 327' ? 'Software Engineering' : 'Course',
      department: 'ECE / CSE',
      credits: 3.0,
      sectionNumber: '05',
      faculty: sectionData.faculty || 'Mr. Tanvir Rahman',
      days: sectionData.days || 'MW',
      timeSlot: sectionData.timeSlot || '04:20 PM - 05:50 PM',
      room: sectionData.room || 'LIB 608',
      capacity: 40,
      enrolled: 0,
      waitlisted: 0,
      prerequisites: ['CSE 215'],
      ...sectionData
    };

    const updatedSections = [...sections, newSection];
    const updatedEscalations: EscalationItem[] = escalations.map((esc) => {
      if (esc.courseCode === courseCode) {
        return {
          ...esc,
          status: 'Mitigated' as const,
          totalCapacity: esc.totalCapacity + 40,
          deficit: Math.max(0, esc.deficit - 40)
        };
      }
      return esc;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'IT Operations Administrator',
      action: 'Emergency Section Provisioned',
      details: `Created ${courseCode} Sec 05 (${newSection.room}, ${newSection.timeSlot}) with 40 seats.`,
      badgeType: 'emerald'
    };

    setSections(updatedSections);
    setEscalations(updatedEscalations);
    setAuditLog((prev) => [logItem, ...prev]);
    closeModal();

    broadcastState({
      sections: updatedSections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations: updatedEscalations,
      student,
      receipt
    });
  }, [sections, escalations, stagedSectionIds, exceptions, bypassRules, auditLog, metrics, student, receipt, closeModal, broadcastState]);

  // Admin: Add seats to all sections
  const addSeatsToAllSections = useCallback((courseCode: string, count: number) => {
    const updatedSections = sections.map((sec) => {
      if (sec.courseCode === courseCode) {
        return {
          ...sec,
          capacity: sec.capacity + count
        };
      }
      return sec;
    });

    const updatedEscalations: EscalationItem[] = escalations.map((esc) => {
      if (esc.courseCode === courseCode) {
        return {
          ...esc,
          totalCapacity: esc.totalCapacity + count * 4,
          deficit: Math.max(0, esc.deficit - count * 4),
          status: 'Resolved' as const
        };
      }
      return esc;
    });

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'IT Operations Administrator',
      action: 'Batch Capacity Added',
      details: `Added +${count} seats across all sections of ${courseCode}.`,
      badgeType: 'emerald'
    };

    setSections(updatedSections);
    setEscalations(updatedEscalations);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections: updatedSections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations: updatedEscalations,
      student,
      receipt
    });
  }, [sections, escalations, stagedSectionIds, exceptions, bypassRules, auditLog, metrics, student, receipt, broadcastState]);

  // Demo Control: Simulate Surge Spike
  const simulateSurgeSpike = useCallback(() => {
    const updatedMetrics: AdminMetrics = {
      ...metrics,
      requestsPerSec: 3450,
      p95LatencyMs: 275,
      poolUsed: 194,
      surgeSpikeActive: true,
      lastScalingEvent: 'Simulated high-concurrency surge spike triggered.'
    };

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Surge Simulation Generator',
      action: 'Traffic Spike Injected',
      details: 'Injected 3,450 req/s load. P95 latency jumped to 275 ms (Breaching SLA Ceiling).',
      badgeType: 'crimson'
    };

    setMetrics(updatedMetrics);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics: updatedMetrics,
      escalations,
      student,
      receipt
    });
  }, [metrics, sections, stagedSectionIds, exceptions, bypassRules, auditLog, escalations, student, receipt, broadcastState]);

  // Demo Control: Simulate Section Filling Up
  const simulateSectionFull = useCallback((sectionId: string) => {
    const updatedSections = sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          enrolled: sec.capacity
        };
      }
      return sec;
    });

    const targetSec = sections.find((s) => s.id === sectionId);
    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'Seat Contention Daemon',
      action: 'Section Sold Out (40/40)',
      details: `${targetSec?.courseCode} Sec ${targetSec?.sectionNumber} reached full capacity (0 available).`,
      badgeType: 'crimson'
    };

    setSections(updatedSections);
    setAuditLog((prev) => [logItem, ...prev]);

    broadcastState({
      sections: updatedSections,
      stagedSectionIds,
      exceptions,
      bypassRules,
      auditLog: [logItem, ...auditLog],
      metrics,
      escalations,
      student,
      receipt
    });
  }, [sections, stagedSectionIds, exceptions, bypassRules, auditLog, metrics, escalations, student, receipt, broadcastState]);

  // Demo Control: Reset State
  const resetDemoState = useCallback(() => {
    setStudent(INITIAL_STUDENT);
    setSections(INITIAL_SECTIONS);
    setStagedSectionIds(INITIAL_STAGED_IDS);
    setExceptions(INITIAL_EXCEPTIONS);
    setBypassRules(INITIAL_BYPASS_RULES);
    setAuditLog(INITIAL_AUDIT_LOG);
    setMetrics(INITIAL_METRICS);
    setEscalations(INITIAL_ESCALATIONS);
    setReceipt(null);
    closeModal();

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel(SYNC_CHANNEL);
        bc.postMessage({ type: 'SYNC_UPDATE', state: {
          student: INITIAL_STUDENT,
          sections: INITIAL_SECTIONS,
          stagedSectionIds: INITIAL_STAGED_IDS,
          exceptions: INITIAL_EXCEPTIONS,
          bypassRules: INITIAL_BYPASS_RULES,
          auditLog: INITIAL_AUDIT_LOG,
          metrics: INITIAL_METRICS,
          escalations: INITIAL_ESCALATIONS,
          receipt: null
        }, timestamp: Date.now() });
        bc.close();
      }
    }
  }, [closeModal]);

  const value = {
    role,
    setRole,
    student,
    sections,
    stagedSectionIds,
    exceptions,
    bypassRules,
    auditLog,
    metrics,
    escalations,
    receipt,
    activeModal,
    modalPayload,
    openModal,
    closeModal,
    stageSection,
    unstageSection,
    confirmSchedule,
    approveException,
    rejectException,
    flagException,
    expandCapacity,
    toggleBypassRule,
    autoScaleApiNodes,
    acknowledgeIncident,
    allocateEmergencySection,
    addSeatsToAllSections,
    simulateSurgeSpike,
    simulateSectionFull,
    resetDemoState,
    stagedSections,
    totalCredits,
    clashes
  };

  return <SmartAdvisorContext.Provider value={value}>{children}</SmartAdvisorContext.Provider>;
}

export function useSmartAdvisor() {
  const context = useContext(SmartAdvisorContext);
  if (!context) {
    throw new Error('useSmartAdvisor must be used within a SmartAdvisorProvider');
  }
  return context;
}
