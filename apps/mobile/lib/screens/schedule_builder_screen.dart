import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../state/app_state.dart';
import '../models/models.dart';
import '../widgets/bottom_sheets.dart';

class ScheduleBuilderScreen extends StatelessWidget {
  final AppState appState;

  const ScheduleBuilderScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header & Strategy Toggle
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Instant Schedule AI Builder',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.navy,
                        letterSpacing: -0.2,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      'Zero-Clash Optimization Engine',
                      style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // Milestone First vs Minimize Gaps Toggle
              Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  color: AppTheme.canvasAlt,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildStrategyPill(
                      label: 'Milestone',
                      isSelected: appState.isMilestoneFirst,
                      onTap: () => appState.toggleStrategy(true),
                    ),
                    _buildStrategyPill(
                      label: 'Min Gaps',
                      isSelected: !appState.isMilestoneFirst,
                      onTap: () => appState.toggleStrategy(false),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // KPI Badges Row
          Row(
            children: [
              _buildKpiBadge(
                label: '${appState.totalCredits.toStringAsFixed(1)} / 15.0 Cr',
                icon: Icons.school_outlined,
                color: AppTheme.navy,
              ),
              const SizedBox(width: 8),
              _buildKpiBadge(
                label: '0 Clash',
                icon: Icons.check_circle_outline,
                color: AppTheme.emerald,
              ),
              const SizedBox(width: 8),
              _buildKpiBadge(
                label: '96% Plan Fit AI',
                icon: Icons.auto_awesome,
                color: AppTheme.teal,
              ),
            ],
          ),
          const SizedBox(height: 18),

          // 5-Day Compact Timetable Grid
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
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '5-DAY TIMETABLE PREVIEW',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                          color: AppTheme.textMuted,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'ST • MW • RA Pattern',
                      style: TextStyle(fontSize: 10, color: AppTheme.textMuted),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Compact Table header
                Row(
                  children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map((day) {
                    return Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: AppTheme.canvas,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          day,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.navy,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 10),

                // Timetable Slots Row representation
                _buildTimetableSlotRow('09:40 AM', ['-', 'CSE 311', '-', 'CSE 311', 'CSE 311L']),
                const SizedBox(height: 6),
                _buildTimetableSlotRow('11:20 AM', ['CSE 327', '-', 'CSE 327', '-', 'CSE 311L']),
                const SizedBox(height: 6),
                _buildTimetableSlotRow('01:20 PM', ['MAT 361', 'CSE 331', 'MAT 361', 'CSE 331', '-']),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Staged Courses List Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'STAGED COURSES (${appState.stagedCourses.length})',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.8,
                    color: AppTheme.textMuted,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Auto-Ranked by AI',
                style: TextStyle(fontSize: 10, color: AppTheme.teal, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Staged Course Cards
          ...List.generate(appState.stagedCourses.length, (index) {
            final course = appState.stagedCourses[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: _buildStagedCard(context, course),
            );
          }),

          const SizedBox(height: 16),

          // Confirm & Finalize Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                MobileBottomSheets.showSeatApproved(
                  context,
                  courseCode: 'CSE 327',
                  sectionNumber: '01',
                  rdsToken: '#NSU-241215-327A',
                  onViewSchedule: () {},
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.navy,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: Text(
                'Confirm (${appState.totalCredits.toStringAsFixed(1)} Cr) Finalize →',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStrategyPill({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.navy : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : AppTheme.textSecondary,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }

  Widget _buildKpiBadge({
    required String label,
    required IconData icon,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 4),
            Flexible(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  label,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color),
                  maxLines: 1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimetableSlotRow(String time, List<String> subjects) {
    return Row(
      children: subjects.map((sub) {
        final isEmpty = sub == '-';
        return Expanded(
          child: Container(
            height: 38,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            decoration: BoxDecoration(
              color: isEmpty
                  ? AppTheme.canvas
                  : sub.contains('327')
                      ? AppTheme.navy.withOpacity(0.08)
                      : AppTheme.teal.withOpacity(0.12),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(
                color: isEmpty ? AppTheme.border.withOpacity(0.5) : AppTheme.border,
              ),
            ),
            child: Center(
              child: Text(
                sub,
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: isEmpty ? AppTheme.textMuted : AppTheme.navy,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildStagedCard(BuildContext context, StagedCourse course) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        '${course.courseCode} Sec ${course.sectionNumber}',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.navy),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '(${course.credits.toStringAsFixed(1)} Cr)',
                      style: const TextStyle(fontSize: 11, color: AppTheme.teal, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '${course.days} ${course.timeSlot} • ${course.room}',
                  style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextButton(
                onPressed: () {
                  MobileBottomSheets.showSectionFullFallback(
                    context,
                    courseCode: course.courseCode,
                    fullSection: course.sectionNumber,
                    onSelectAlternative: (newSec) {
                      appState.addStagedCourse(
                        StagedCourse(
                          courseCode: course.courseCode,
                          sectionNumber: newSec,
                          faculty: course.faculty,
                          timeSlot: course.timeSlot,
                          days: course.days,
                          room: course.room,
                          credits: course.credits,
                        ),
                      );
                    },
                  );
                },
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('Swap Sec', style: TextStyle(fontSize: 11, color: AppTheme.teal)),
              ),
              IconButton(
                onPressed: () => appState.removeStagedCourse(course.courseCode),
                icon: const Icon(Icons.close, size: 16, color: AppTheme.textMuted),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
