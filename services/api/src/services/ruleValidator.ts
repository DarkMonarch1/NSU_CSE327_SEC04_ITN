import { CourseSection, StudentProfile, BypassRule } from '../types';

export interface CreditFloorCheckResult {
  passed: boolean;
  ruleCode: 'RULE-4.2';
  studentCredits: number;
  requiredCredits: number;
}

export interface PrerequisiteCheckResult {
  passed: boolean;
  missingPrerequisites: string[];
  bypassActive: boolean;
}

export interface ScheduleClash {
  sectionA: CourseSection;
  sectionB: CourseSection;
  day: string;
  time: string;
}

/**
 * Checks Rule 4.2: Credit Floor Standing for 400-level course sections.
 * Fails when section.minCreditsRequired is defined and student.creditsCompleted < section.minCreditsRequired.
 */
export function checkCreditFloor(
  section: CourseSection,
  student: StudentProfile
): CreditFloorCheckResult {
  const requiredCredits = section.minCreditsRequired ?? 0;
  const passed =
    section.minCreditsRequired === undefined ||
    student.creditsCompleted >= section.minCreditsRequired;

  return {
    passed,
    ruleCode: 'RULE-4.2',
    studentCredits: student.creditsCompleted,
    requiredCredits
  };
}

/**
 * Validates DAG prerequisite requirements against student's cleared courses.
 * Bypassed if Rule 2.1 (Prerequisite Co-Registration Exemption) is currently enabled.
 */
export function checkPrerequisites(
  section: CourseSection,
  student: StudentProfile,
  bypassRules: BypassRule[] = []
): PrerequisiteCheckResult {
  const isRule21Active = bypassRules.some(
    (rule) => (rule.id === 'rule-2-1' || rule.code === 'RULE-2.1') && rule.enabled
  );

  if (isRule21Active) {
    return {
      passed: true,
      missingPrerequisites: [],
      bypassActive: true
    };
  }

  const normalize = (code: string) => code.replace(/\s+/g, '').toUpperCase();
  const clearedSet = new Set(student.clearedCourses.map((c) => normalize(c.code)));

  const missingPrerequisites = section.prerequisites.filter(
    (prereq) => !clearedSet.has(normalize(prereq))
  );

  return {
    passed: missingPrerequisites.length === 0,
    missingPrerequisites,
    bypassActive: false
  };
}

/**
 * Detects timetable schedule clashes among staged sections.
 * ST overlaps with ST, Sun, Tue.
 * MW overlaps with MW, Mon, Wed.
 * RA overlaps with RA, Thu.
 * Clashes occur when overlapping days share the exact same timeSlot.
 */
export function detectScheduleClashes(stagedSections: CourseSection[]): ScheduleClash[] {
  const clashes: ScheduleClash[] = [];

  for (let i = 0; i < stagedSections.length; i++) {
    for (let j = i + 1; j < stagedSections.length; j++) {
      const a = stagedSections[i];
      const b = stagedSections[j];

      const daysOverlap =
        a.days === b.days ||
        (a.days === 'ST' && (b.days === 'Sun' || b.days === 'Tue')) ||
        (b.days === 'ST' && (a.days === 'Sun' || a.days === 'Tue')) ||
        (a.days === 'MW' && (b.days === 'Mon' || b.days === 'Wed')) ||
        (b.days === 'MW' && (a.days === 'Mon' || a.days === 'Wed')) ||
        (a.days === 'RA' && b.days === 'Thu') ||
        (b.days === 'RA' && a.days === 'Thu');

      if (daysOverlap && a.timeSlot === b.timeSlot) {
        clashes.push({
          sectionA: a,
          sectionB: b,
          day: a.days,
          time: a.timeSlot
        });
      }
    }
  }

  return clashes;
}
