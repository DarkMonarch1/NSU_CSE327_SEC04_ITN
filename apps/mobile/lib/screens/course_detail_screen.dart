import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../state/app_state.dart';
import '../models/models.dart';
import '../widgets/bottom_sheets.dart';

class CourseDetailScreen extends StatefulWidget {
  final AppState appState;

  const CourseDetailScreen({super.key, required this.appState});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  String _selectedSectionNumber = '01';

  final List<CourseSection> _sections = [
    const CourseSection(
      id: 'CSE327-01',
      courseCode: 'CSE 327',
      sectionNumber: '01',
      faculty: 'Dr. Nabeel Mohammed',
      days: 'ST',
      timeSlot: '11:20 AM - 12:50 PM',
      room: 'SAC 502',
      capacity: 40,
      enrolled: 28,
      badge: 'Recommended',
    ),
    const CourseSection(
      id: 'CSE327-02',
      courseCode: 'CSE 327',
      sectionNumber: '02',
      faculty: 'Dr. Silvia Ahmed',
      days: 'MW',
      timeSlot: '09:40 AM - 11:10 AM',
      room: 'NAC 408',
      capacity: 40,
      enrolled: 36,
      badge: '4 Seats Left',
    ),
    const CourseSection(
      id: 'CSE327-03',
      courseCode: 'CSE 327',
      sectionNumber: '03',
      faculty: 'Prof. Dr. Rajesh Palit',
      days: 'ST',
      timeSlot: '01:20 PM - 02:50 PM',
      room: 'SAC 415',
      capacity: 40,
      enrolled: 40,
      waitlisted: 14,
      badge: 'Full (40/40)',
    ),
    const CourseSection(
      id: 'CSE327-04',
      courseCode: 'CSE 327',
      sectionNumber: '04',
      faculty: 'Mr. Tanvir Rahman',
      days: 'RA',
      timeSlot: '04:20 PM - 05:50 PM',
      room: 'LIB 602',
      capacity: 40,
      enrolled: 21,
      badge: 'Evening Slot',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppTheme.navy,
        foregroundColor: Colors.white,
        title: const Text(
          'CSE 327 • Section Picker',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course Header Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'CSE 327',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.navy),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.navy.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          '3.0 Cr • Major Core',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.navy),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Software Engineering',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: 14),

                  // Stats Row
                  Row(
                    children: [
                      _buildStatBox('04 Total', 'Sections'),
                      const SizedBox(width: 8),
                      _buildStatBox('02 Sec Open', 'Seat Availability', isPositive: true),
                      const SizedBox(width: 8),
                      _buildStatBox('38/40', 'Avg Capacity'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Prerequisite DAG Chain
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'PREREQUISITE DIRECTED ACYCLIC GRAPH (DAG)',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: AppTheme.textMuted,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildDagNode('CSE 215', 'Grade: A', true),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 4),
                        child: Icon(Icons.arrow_forward_rounded, size: 16, color: AppTheme.emerald),
                      ),
                      _buildDagNode('CSE 311', 'Grade: A-', true),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 4),
                        child: Icon(Icons.arrow_forward_rounded, size: 16, color: AppTheme.emerald),
                      ),
                      _buildDagNode('CSE 327', 'Target', false, isTarget: true),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Selectable Section Cards
            const Text(
              'SELECTABLE SECTIONS',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.8,
                color: AppTheme.textMuted,
              ),
            ),
            const SizedBox(height: 10),

            ...List.generate(_sections.length, (index) {
              final sec = _sections[index];
              final isSelected = _selectedSectionNumber == sec.sectionNumber;
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: _buildSectionCard(sec, isSelected),
              );
            }),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppTheme.border)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.lock_clock_outlined, size: 14, color: AppTheme.teal),
                  const SizedBox(width: 4),
                  Text(
                    '60s atomic reservation lock will be activated',
                    style: TextStyle(fontSize: 11, color: AppTheme.teal.withOpacity(0.9), fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    final targetSec = _sections.firstWhere((s) => s.sectionNumber == _selectedSectionNumber);
                    if (targetSec.isFull) {
                      MobileBottomSheets.showSectionFullFallback(
                        context,
                        courseCode: 'CSE 327',
                        fullSection: targetSec.sectionNumber,
                        onSelectAlternative: (altSec) {
                          setState(() => _selectedSectionNumber = altSec);
                        },
                      );
                      return;
                    }

                    widget.appState.addStagedCourse(
                      StagedCourse(
                        courseCode: targetSec.courseCode,
                        sectionNumber: targetSec.sectionNumber,
                        faculty: targetSec.faculty,
                        timeSlot: targetSec.timeSlot,
                        days: targetSec.days,
                        room: targetSec.room,
                        credits: 3.0,
                      ),
                    );

                    MobileBottomSheets.showSeatApproved(
                      context,
                      courseCode: targetSec.courseCode,
                      sectionNumber: targetSec.sectionNumber,
                      onViewSchedule: () {
                        Navigator.pop(context);
                        widget.appState.setTab(1);
                      },
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.teal,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Confirm & Add to Advising Cart →',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatBox(String val, String label, {bool isPositive = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: isPositive ? AppTheme.emeraldLight : AppTheme.canvas,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isPositive ? AppTheme.emerald.withOpacity(0.3) : AppTheme.border,
          ),
        ),
        child: Column(
          children: [
            Text(
              val,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isPositive ? AppTheme.emeraldDark : AppTheme.navy,
              ),
            ),
            Text(
              label,
              style: const TextStyle(fontSize: 9, color: AppTheme.textMuted),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDagNode(String course, String grade, bool passed, {bool isTarget = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: passed
              ? AppTheme.emeraldLight
              : isTarget
                  ? AppTheme.navy.withOpacity(0.08)
                  : AppTheme.amberLight,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: passed
                ? AppTheme.emerald.withOpacity(0.4)
                : isTarget
                    ? AppTheme.navy.withOpacity(0.3)
                    : AppTheme.amber.withOpacity(0.4),
          ),
        ),
        child: Column(
          children: [
            Text(
              course,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: passed
                    ? AppTheme.emeraldDark
                    : isTarget
                        ? AppTheme.navy
                        : AppTheme.amberDark,
              ),
            ),
            Text(
              grade,
              style: const TextStyle(fontSize: 9, color: AppTheme.textMuted),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard(CourseSection sec, bool isSelected) {
    return InkWell(
      onTap: () {
        if (sec.isFull) {
          MobileBottomSheets.showSectionFullFallback(
            context,
            courseCode: 'CSE 327',
            fullSection: sec.sectionNumber,
            onSelectAlternative: (altSec) {
              setState(() => _selectedSectionNumber = altSec);
            },
          );
        } else {
          setState(() => _selectedSectionNumber = sec.sectionNumber);
        }
      },
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.teal.withOpacity(0.05) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppTheme.teal : AppTheme.border,
            width: isSelected ? 1.8 : 1.0,
          ),
        ),
        child: Row(
          children: [
            // Radio Indicator
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? AppTheme.teal : AppTheme.textMuted,
              size: 20,
            ),
            const SizedBox(width: 12),

            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'Sec ${sec.sectionNumber}',
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.navy),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: sec.isFull
                              ? AppTheme.crimsonLight
                              : sec.isFewSeats
                                  ? AppTheme.amberLight
                                  : AppTheme.emeraldLight,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          sec.badge,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: sec.isFull
                                ? AppTheme.crimson
                                : sec.isFewSeats
                                    ? AppTheme.amberDark
                                    : AppTheme.emeraldDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    sec.faculty,
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                  ),
                  Text(
                    '${sec.days} ${sec.timeSlot} • ${sec.room}',
                    style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ),

            // Seat counts
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${sec.availableSeats}/${sec.capacity}',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'monospace',
                    color: sec.isFull ? AppTheme.crimson : AppTheme.navy,
                  ),
                ),
                Text(
                  sec.isFull ? 'Waitlisted' : 'Open Seats',
                  style: const TextStyle(fontSize: 9, color: AppTheme.textMuted),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
