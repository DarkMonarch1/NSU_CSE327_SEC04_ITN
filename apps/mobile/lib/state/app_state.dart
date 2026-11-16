import 'package:flutter/material.dart';
import '../models/models.dart';

class AppState extends ChangeNotifier {
  bool _isLoggedIn;
  int _currentTab;
  bool _isMilestoneFirst;

  AppState({
    bool initialLoggedIn = false,
    int initialTab = 0,
    bool isMilestoneFirst = true,
  })  : _isLoggedIn = initialLoggedIn,
        _currentTab = initialTab,
        _isMilestoneFirst = isMilestoneFirst;

  // Student Profile Data
  final String studentName = 'Rahim Ahmed';
  final String studentId = '2412159042';
  final String standing = 'Senior Standing';
  final int completedCredits = 96;
  final int totalDegreeCredits = 130;
  final double cgpa = 3.64;
  final String cartToken = '#NSU-241215-9042';

  // Staged Courses (for Schedule & Cart)
  final List<StagedCourse> _stagedCourses = [
    const StagedCourse(
      courseCode: 'CSE 327',
      sectionNumber: '01',
      faculty: 'Dr. Nabeel Mohammed',
      days: 'ST',
      timeSlot: '11:20 AM - 12:50 PM',
      room: 'SAC 502',
      credits: 3.0,
    ),
    const StagedCourse(
      courseCode: 'CSE 311',
      sectionNumber: '03',
      faculty: 'Dr. Tanjila Farah',
      days: 'MW',
      timeSlot: '09:40 AM - 11:10 AM',
      room: 'NAC 408',
      credits: 3.0,
    ),
    const StagedCourse(
      courseCode: 'CSE 311L',
      sectionNumber: '02',
      faculty: 'Mr. Safayat Hossain',
      days: 'Thu',
      timeSlot: '09:40 AM - 12:40 PM',
      room: 'LIB 608',
      credits: 1.0,
    ),
    const StagedCourse(
      courseCode: 'MAT 361',
      sectionNumber: '04',
      faculty: 'Dr. Hasina Akter',
      days: 'ST',
      timeSlot: '01:20 PM - 02:50 PM',
      room: 'NAC 510',
      credits: 3.0,
    ),
    const StagedCourse(
      courseCode: 'CSE 331',
      sectionNumber: '01',
      faculty: 'Prof. Dr. Rajesh Palit',
      days: 'MW',
      timeSlot: '01:20 PM - 02:50 PM',
      room: 'SAC 415',
      credits: 3.0,
    ),
  ];

  // Petitions & Requests
  final List<PetitionItem> _petitions = [
    const PetitionItem(
      id: 'PET-327-01',
      courseCode: 'CSE 327',
      sectionNumber: '01',
      status: PetitionStatus.approved,
      submittedAt: 'Today 09:14 AM',
      rdsToken: '#NSU-241215-327A',
      note: 'Auto-Approved by DAG Engine (Prerequisite Cleared)',
    ),
    const PetitionItem(
      id: 'PET-425-01',
      courseCode: 'CSE 425',
      sectionNumber: '01',
      status: PetitionStatus.pending,
      submittedAt: 'Today 09:30 AM',
      note: 'Rule 4.2 Senior Standing Review by Dr. Nova Ahmed',
    ),
    const PetitionItem(
      id: 'PET-361-02',
      courseCode: 'MAT 361',
      sectionNumber: '02',
      status: PetitionStatus.waitlisted,
      submittedAt: 'Yesterday 04:12 PM',
      note: 'Waitlist Position #3 &bull; Auto-Promotion Armed',
    ),
    const PetitionItem(
      id: 'PET-331-01',
      courseCode: 'CSE 331',
      sectionNumber: '01',
      status: PetitionStatus.rejected,
      submittedAt: 'Yesterday 02:40 PM',
      note: 'Section Capacity Floor Exceeded. View 2 Alternative Open Sections.',
    ),
  ];

  // Real-Time Radar Alerts
  final List<AlertItem> _alerts = [
    const AlertItem(
      id: 'alt-1',
      title: 'SEAT DROP DETECTED',
      description: 'CSE 327 Sec 02 (Dr. Silvia Ahmed) has 1 open seat.',
      timeAgo: '2m ago',
      type: 'seat_drop',
      actionLabel: 'Claim Seat →',
    ),
    const AlertItem(
      id: 'alt-2',
      title: 'LAB TIME SLOT CONFIRMED',
      description: 'CSE 311L Sec 02 reserved in atomic lock buffer.',
      timeAgo: '8m ago',
      type: 'fast_enroll',
      actionLabel: 'Add to Cart',
    ),
    const AlertItem(
      id: 'alt-3',
      title: 'RULE 4.2 OVERRIDE LOGGED',
      description: 'CSE 425 credit standing exception queued for chair sign-off.',
      timeAgo: '14m ago',
      type: 'rule_alert',
      actionLabel: 'Waitlist Hub',
    ),
    const AlertItem(
      id: 'alt-4',
      title: 'ADVISING CLEARANCE ACTIVE',
      description: 'Dr. Nova Ahmed approved your pre-advising track.',
      timeAgo: '28m ago',
      type: 'clearance',
      actionLabel: 'View Audit',
    ),
    const AlertItem(
      id: 'alt-5',
      title: 'TELEMETRY PULSE: EDGE STABLE',
      description: 'PostgreSQL RDS primary sync latency &le;12ms across NSU subnet.',
      timeAgo: '35m ago',
      type: 'clearance',
      actionLabel: 'System Status',
    ),
  ];

  // Getters
  bool get isLoggedIn => _isLoggedIn;
  int get currentTab => _currentTab;
  bool get isMilestoneFirst => _isMilestoneFirst;
  List<StagedCourse> get stagedCourses => List.unmodifiable(_stagedCourses);
  List<PetitionItem> get petitions => List.unmodifiable(_petitions);
  List<AlertItem> get alerts => List.unmodifiable(_alerts);

  double get totalCredits =>
      _stagedCourses.fold(0.0, (sum, item) => sum + item.credits);

  // Actions
  void login(String id, String pass) {
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }

  void setTab(int index) {
    _currentTab = index;
    notifyListeners();
  }

  void toggleStrategy(bool milestone) {
    _isMilestoneFirst = milestone;
    notifyListeners();
  }

  bool addStagedCourse(StagedCourse course) {
    final existingIndex = _stagedCourses
        .indexWhere((c) => c.courseCode == course.courseCode);
    if (existingIndex >= 0) {
      _stagedCourses[existingIndex] = course;
    } else {
      _stagedCourses.add(course);
    }
    notifyListeners();
    return true;
  }

  void removeStagedCourse(String courseCode) {
    _stagedCourses.removeWhere((c) => c.courseCode == courseCode);
    notifyListeners();
  }

  void addPetition(PetitionItem petition) {
    _petitions.insert(0, petition);
    notifyListeners();
  }

  void dismissAlert(String id) {
    _alerts.removeWhere((a) => a.id == id);
    notifyListeners();
  }
}
