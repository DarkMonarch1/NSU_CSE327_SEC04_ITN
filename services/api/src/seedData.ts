import { StudentProfile, CourseSection } from './types';

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
