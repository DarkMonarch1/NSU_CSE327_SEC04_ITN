class CourseSection {
  final String id;
  final String courseCode;
  final String sectionNumber;
  final String faculty;
  final String days;
  final String timeSlot;
  final String room;
  final int capacity;
  final int enrolled;
  final int waitlisted;
  final bool isLab;
  final String badge;

  const CourseSection({
    required this.id,
    required this.courseCode,
    required this.sectionNumber,
    required this.faculty,
    required this.days,
    required this.timeSlot,
    required this.room,
    required this.capacity,
    required this.enrolled,
    this.waitlisted = 0,
    this.isLab = false,
    this.badge = '',
  });

  int get availableSeats => capacity - enrolled;
  bool get isFull => availableSeats <= 0;
  bool get isFewSeats => availableSeats > 0 && availableSeats <= 5;
}

class CourseItem {
  final String code;
  final String title;
  final double credits;
  final String department;
  final List<CourseSection> sections;
  final bool isEligible;
  final String statusAction; // 'Fast-Track Add Section', 'Join Waitlist', etc.
  final bool isPrereqBlocked;
  final String prereqNote;

  const CourseItem({
    required this.code,
    required this.title,
    required this.credits,
    required this.department,
    required this.sections,
    this.isEligible = true,
    required this.statusAction,
    this.isPrereqBlocked = false,
    this.prereqNote = '',
  });
}

class StagedCourse {
  final String courseCode;
  final String sectionNumber;
  final String faculty;
  final String timeSlot;
  final String days;
  final String room;
  final double credits;

  const StagedCourse({
    required this.courseCode,
    required this.sectionNumber,
    required this.faculty,
    required this.timeSlot,
    required this.days,
    required this.room,
    required this.credits,
  });
}

enum PetitionStatus { approved, pending, waitlisted, rejected }

class PetitionItem {
  final String id;
  final String courseCode;
  final String sectionNumber;
  final PetitionStatus status;
  final String submittedAt;
  final String rdsToken;
  final String note;

  const PetitionItem({
    required this.id,
    required this.courseCode,
    required this.sectionNumber,
    required this.status,
    required this.submittedAt,
    this.rdsToken = '',
    this.note = '',
  });
}

class AlertItem {
  final String id;
  final String title;
  final String description;
  final String timeAgo;
  final String type; // 'seat_drop', 'fast_enroll', 'rule_alert', 'clearance'
  final String actionLabel;

  const AlertItem({
    required this.id,
    required this.title,
    required this.description,
    required this.timeAgo,
    required this.type,
    required this.actionLabel,
  });
}
