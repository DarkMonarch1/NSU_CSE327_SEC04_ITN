import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../state/app_state.dart';
import '../models/models.dart';
import '../widgets/bottom_sheets.dart';
import 'course_detail_screen.dart';

class CourseCatalogScreen extends StatefulWidget {
  final AppState appState;

  const CourseCatalogScreen({super.key, required this.appState});

  @override
  State<CourseCatalogScreen> createState() => _CourseCatalogScreenState();
}

class _CourseCatalogScreenState extends State<CourseCatalogScreen> {
  String _selectedFilter = 'All (48)';
  String _searchQuery = '';

  final List<CourseItem> _allCourses = [
    const CourseItem(
      code: 'CSE 327',
      title: 'Software Engineering',
      credits: 3.0,
      department: 'ECE / CSE',
      statusAction: 'Choose Section (4 Avail)',
      sections: [
        CourseSection(
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
      ],
    ),
    const CourseItem(
      code: 'CSE 311',
      title: 'Database Systems',
      credits: 3.0,
      department: 'ECE / CSE',
      statusAction: 'Fast-Track Add Section',
      sections: [
        CourseSection(
          id: 'CSE311-03',
          courseCode: 'CSE 311',
          sectionNumber: '03',
          faculty: 'Dr. Tanjila Farah',
          days: 'MW',
          timeSlot: '09:40 AM - 11:10 AM',
          room: 'NAC 408',
          capacity: 40,
          enrolled: 37,
        ),
      ],
    ),
    const CourseItem(
      code: 'CSE 331',
      title: 'Microprocessor Systems',
      credits: 3.0,
      department: 'ECE / CSE',
      statusAction: 'Join Waitlist & Auto-Alert',
      sections: [
        CourseSection(
          id: 'CSE331-01',
          courseCode: 'CSE 331',
          sectionNumber: '01',
          faculty: 'Prof. Dr. Rajesh Palit',
          days: 'MW',
          timeSlot: '01:20 PM - 02:50 PM',
          room: 'SAC 415',
          capacity: 40,
          enrolled: 35,
        ),
      ],
    ),
    const CourseItem(
      code: 'CSE 425',
      title: 'Concepts of Programming Languages',
      credits: 3.0,
      department: 'ECE / CSE',
      isPrereqBlocked: true,
      prereqNote: '100+ Credits Required (You have 96 Cr)',
      statusAction: 'Prerequisites Not Met',
      sections: [
        CourseSection(
          id: 'CSE425-01',
          courseCode: 'CSE 425',
          sectionNumber: '01',
          faculty: 'Dr. Nova Ahmed',
          days: 'MW',
          timeSlot: '02:40 PM - 04:10 PM',
          room: 'LIB 602',
          capacity: 40,
          enrolled: 40,
        ),
      ],
    ),
    const CourseItem(
      code: 'MAT 361',
      title: 'Probability & Statistics',
      credits: 3.0,
      department: 'Math & Physics',
      statusAction: 'Fast-Track Add Section',
      sections: [
        CourseSection(
          id: 'MAT361-04',
          courseCode: 'MAT 361',
          sectionNumber: '04',
          faculty: 'Dr. Hasina Akter',
          days: 'ST',
          timeSlot: '01:20 PM - 02:50 PM',
          room: 'NAC 510',
          capacity: 40,
          enrolled: 18,
        ),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _allCourses.where((course) {
      if (_selectedFilter == 'Eligible for me' && course.isPrereqBlocked) {
        return false;
      }
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        return course.code.toLowerCase().contains(q) ||
            course.title.toLowerCase().contains(q);
      }
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppTheme.navy,
        foregroundColor: Colors.white,
        title: const Text(
          'Course Catalog & Search',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Search & Filter header container
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            color: Colors.white,
            child: Column(
              children: [
                // Search Input
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'Search course code or title (e.g. CSE 327)...',
                    hintStyle: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                    prefixIcon: const Icon(Icons.search, size: 20, color: AppTheme.textMuted),
                    filled: true,
                    fillColor: AppTheme.canvas,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppTheme.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppTheme.border),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Filter Chips
                Row(
                  children: ['All (48)', 'Eligible for me', 'Available Seats'].map((filter) {
                    final isSelected = _selectedFilter == filter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(filter),
                        labelStyle: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? Colors.white : AppTheme.textSecondary,
                        ),
                        selected: isSelected,
                        selectedColor: AppTheme.navy,
                        backgroundColor: AppTheme.canvas,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(color: isSelected ? AppTheme.navy : AppTheme.border),
                        ),
                        onSelected: (_) => setState(() => _selectedFilter = filter),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppTheme.border),

          // Course Cards List
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (ctx, index) {
                final course = filtered[index];
                return _buildCourseCard(course);
              },
            ),
          ),

          // Floating Bottom Cart Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            decoration: BoxDecoration(
              color: AppTheme.navy,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.12),
                  blurRadius: 10,
                  offset: const Offset(0, -3),
                ),
              ],
            ),
            child: SafeArea(
              top: false,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'ADVISING CART',
                          style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${widget.appState.totalCredits.toStringAsFixed(1)} / 15.0 Cr (${widget.appState.stagedCourses.length} Staged)',
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      widget.appState.setTab(1); // Go to Schedule Tab
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.teal,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Review Cart →',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseCard(CourseItem course) {
    return Container(
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
              Text(
                course.code,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.navy,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.canvasAlt,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '${course.credits.toStringAsFixed(1)} Cr',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.navy),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),

          Text(
            course.title,
            style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
          ),
          const SizedBox(height: 12),

          // Action Button based on course type
          if (course.code == 'CSE 327')
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CourseDetailScreen(appState: widget.appState),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.teal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  elevation: 0,
                ),
                child: const Text('Choose Section (4 Avail) →', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            )
          else if (course.isPrereqBlocked)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  MobileBottomSheets.showMissingPrereqRule42(
                    context,
                    targetCourse: course.code,
                    appState: widget.appState,
                  );
                },
                icon: const Icon(Icons.lock_outline, size: 16),
                label: const Text('Prerequisites Not Met (Rule 4.2)'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.amberLight,
                  foregroundColor: AppTheme.amberDark,
                  elevation: 0,
                  side: BorderSide(color: AppTheme.amber.withOpacity(0.3)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            )
          else
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  final sec = course.sections.first;
                  widget.appState.addStagedCourse(
                    StagedCourse(
                      courseCode: sec.courseCode,
                      sectionNumber: sec.sectionNumber,
                      faculty: sec.faculty,
                      timeSlot: sec.timeSlot,
                      days: sec.days,
                      room: sec.room,
                      credits: course.credits,
                    ),
                  );
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${sec.courseCode} Sec ${sec.sectionNumber} staged!'),
                      backgroundColor: AppTheme.emeraldDark,
                    ),
                  );
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.border),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: Text(
                  course.statusAction,
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.navy),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
