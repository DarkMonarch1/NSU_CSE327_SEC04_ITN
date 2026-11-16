import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../state/app_state.dart';
import '../models/models.dart';
import '../widgets/priority_window_card.dart';
import '../widgets/credit_ring_widget.dart';
import 'course_catalog_screen.dart';

class HomeDashboardScreen extends StatelessWidget {
  final AppState appState;

  const HomeDashboardScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting & Academic Clearance Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Good morning, ${appState.studentName.split(' ').first}',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.navy,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${appState.studentId} • ${appState.standing}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textMuted,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.emeraldLight,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.emerald.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle, color: AppTheme.emerald, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'Cleared',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.emeraldDark,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // 1. Dark-Navy Priority Window Countdown Card
          const PriorityWindowCard(),
          const SizedBox(height: 14),

          // 2. Credit Summary Circular Ring Card
          CreditSummaryRing(
            currentCredits: appState.totalCredits,
            maxCredits: 15.0,
          ),
          const SizedBox(height: 22),

          // 3. Action Workspace (4 Tiles)
          const Text(
            'ACTION WORKSPACE',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 10),

          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollExceptionScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.45,
            children: [
              _buildActionTile(
                icon: Icons.search_rounded,
                title: 'Courses',
                subtitle: 'Catalog & Radar',
                color: AppTheme.teal,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CourseCatalogScreen(appState: appState),
                    ),
                  );
                },
              ),
              _buildActionTile(
                icon: Icons.calendar_month_outlined,
                title: 'Schedule',
                subtitle: 'AI Timetable (${appState.stagedCourses.length})',
                color: AppTheme.navy,
                onTap: () => appState.setTab(1),
              ),
              _buildActionTile(
                icon: Icons.assignment_outlined,
                title: 'Requests',
                subtitle: '${appState.petitions.length} Active Petitions',
                color: AppTheme.amber,
                onTap: () => appState.setTab(2),
              ),
              _buildActionTile(
                icon: Icons.notifications_active_outlined,
                title: 'Alerts',
                subtitle: '${appState.alerts.length} Real-time Pulses',
                color: AppTheme.crimson,
                onTap: () => appState.setTab(3),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // 4. Live Feed & Updates with working 1-tap Quick Add
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'LIVE FEED & FAST-ENROLL',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.8,
                  color: AppTheme.textMuted,
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CourseCatalogScreen(appState: appState),
                    ),
                  );
                },
                child: const Text(
                  'View All (48) →',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.teal,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Quick Add Card 1: CSE 327 Sec 01
          _buildQuickAddCard(
            context,
            code: 'CSE 327',
            section: '01',
            faculty: 'Dr. Nabeel Mohammed',
            time: 'ST 11:20 AM - 12:50 PM • SAC 502',
            seatsAvailable: 12,
            isStaged: appState.stagedCourses.any((c) => c.courseCode == 'CSE 327'),
            onQuickAdd: () {
              appState.addStagedCourse(
                const StagedCourse(
                  courseCode: 'CSE 327',
                  sectionNumber: '01',
                  faculty: 'Dr. Nabeel Mohammed',
                  days: 'ST',
                  timeSlot: '11:20 AM - 12:50 PM',
                  room: 'SAC 502',
                  credits: 3.0,
                ),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('CSE 327 Sec 01 staged in advising cart!'),
                  backgroundColor: AppTheme.emeraldDark,
                ),
              );
            },
          ),
          const SizedBox(height: 10),

          // Quick Add Card 2: MAT 361 Sec 04
          _buildQuickAddCard(
            context,
            code: 'MAT 361',
            section: '04',
            faculty: 'Dr. Hasina Akter',
            time: 'ST 01:20 PM - 02:50 PM • NAC 510',
            seatsAvailable: 22,
            isStaged: appState.stagedCourses.any((c) => c.courseCode == 'MAT 361'),
            onQuickAdd: () {
              appState.addStagedCourse(
                const StagedCourse(
                  courseCode: 'MAT 361',
                  sectionNumber: '04',
                  faculty: 'Dr. Hasina Akter',
                  days: 'ST',
                  timeSlot: '01:20 PM - 02:50 PM',
                  room: 'NAC 510',
                  credits: 3.0,
                ),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('MAT 361 Sec 04 staged in advising cart!'),
                  backgroundColor: AppTheme.emeraldDark,
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.navy,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppTheme.textMuted,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAddCard(
    BuildContext context, {
    required String code,
    required String section,
    required String faculty,
    required String time,
    required int seatsAvailable,
    required bool isStaged,
    required VoidCallback onQuickAdd,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
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
                    Text(
                      '$code Sec $section',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.navy,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppTheme.emeraldLight,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '$seatsAvailable Open',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.emeraldDark,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  faculty,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
                Text(
                  time,
                  style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: isStaged ? null : onQuickAdd,
            style: ElevatedButton.styleFrom(
              backgroundColor: isStaged ? AppTheme.canvasAlt : AppTheme.teal,
              foregroundColor: isStaged ? AppTheme.textMuted : Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Text(
              isStaged ? 'Staged ✓' : 'Quick Add',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
