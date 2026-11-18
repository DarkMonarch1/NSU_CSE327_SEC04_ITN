export type UserRole = 'student' | 'faculty' | 'admin';

export interface StudentProfile {
  id: string; // 2412159042
  name: string; // Rahim Ahmed
  email: string;
  program: string; // B.Sc in Computer Science and Engineering
  standing: string; // Senior Standing
  creditsCompleted: number; // 96
  creditsTotal: number; // 130
  cgpa: number; // 3.64
  cartToken: string; // #NSU-241215-9042
  clearedCourses: { code: string; grade: string }[];
  advisingClearedBy: string; // Dr. Nova Ahmed
  slotClosesAt: string; // ISO date string
}

export type DayCode = 'ST' | 'MW' | 'RA' | 'Thu' | 'Sun' | 'Mon' | 'Tue' | 'Wed';

export interface CourseSection {
  id: string; // e.g. "CSE327-01"
  courseCode: string; // "CSE 327"
  courseTitle: string; // "Software Engineering"
  department: 'ECE / CSE' | 'Math & Physics' | 'BBA' | 'English & Mod. Lang';
  credits: number; // 3.0
  sectionNumber: string; // "01"
  faculty: string; // "Dr. Nabeel Mohammed"
  days: DayCode; // "ST" | "MW" | "RA"
  timeSlot: string; // "11:20 AM - 12:50 PM"
  room: string; // "SAC 502"
  capacity: number; // 40
  enrolled: number; // 12
  waitlisted: number; // 0
  minCreditsRequired?: number; // 100 for CSE 425
  prerequisites: string[]; // ["CSE 215"]
  isLab?: boolean;
}

export interface StagedSection {
  sectionId: string;
  courseCode: string;
  addedAt: number;
}

export interface RuleAuditCheck {
  rule: string;
  description: string;
  passed: boolean;
  notes: string;
}

export interface ExceptionCase {
  id: string; // "CASE #EX-2025-0841"
  studentId: string; // "2412159042"
  studentName: string; // "Rahim Ahmed"
  program: string; // "B.Sc CSE"
  standing: string; // "Senior Standing"
  cgpa: number; // 3.64
  creditsCompleted: number; // 96
  courseCode: string; // "CSE 425"
  courseTitle: string; // "Concepts of Programming Languages"
  sectionNumber: string; // "01"
  category: 'Prereqs' | 'Capacity' | 'Credit Standing';
  submittedAt: string; // "2025-02-16 09:14 AM"
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  statement: string;
  auditChecks: RuleAuditCheck[];
  facultyDecisionBy?: string;
  facultyDecisionAt?: string;
}

export interface BypassRule {
  id: string;
  code: string; // "RULE-4.2"
  title: string;
  description: string;
  category: 'Standing' | 'Prerequisite' | 'Exam Load' | 'Capacity';
  enabled: boolean;
  lastUpdated: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  badgeType: 'emerald' | 'amber' | 'crimson' | 'teal';
}

export interface AdminMetrics {
  requestsPerSec: number; // 1842
  p95LatencyMs: number; // 218
  slaCeilingMs: number; // 200
  errorRate: number; // 0.08
  poolUsed: number; // 156
  poolTotal: number; // 200
  apiNodes: number; // 6
  surgeSpikeActive: boolean;
  lastScalingEvent?: string;
}

export interface EscalationItem {
  id: string; // "#ESC-9481"
  courseCode: string; // "CSE 327"
  courseTitle: string;
  enrolled: number;
  totalCapacity: number;
  waitlisted: number;
  deficit: number;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  status: 'Open' | 'Mitigated' | 'Resolved';
  demandSurge: { time: string; requests: number }[];
  breakdown: { major: string; count: number; percentage: number }[];
}

export interface ScheduleReceipt {
  transactionId: string; // #RDS-TXN-2025-98412
  studentId: string;
  cartToken: string;
  timestamp: string;
  totalCredits: number;
  sections: CourseSection[];
  digitalSignature: string;
}
