import {
  StudentProfile,
  CourseSection,
  ExceptionCase,
  BypassRule,
  AuditLogItem,
  AdminMetrics,
  EscalationItem
} from './types';

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
