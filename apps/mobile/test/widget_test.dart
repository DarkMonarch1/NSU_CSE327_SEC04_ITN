import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smartadvisor_mobile/main.dart';
import 'package:smartadvisor_mobile/widgets/bottom_sheets.dart';

void main() {
  testWidgets('SmartAdvisor Mobile App complete interactive smoke and navigation test',
      (WidgetTester tester) async {
    // Build the full app
    await tester.pumpWidget(const SmartAdvisorMobileApp());
    await tester.pump();

    // 1. Verify Persistent App Bar
    expect(find.text('SmartAdvisor NSU'), findsOneWidget);
    expect(find.text('Phase 2 (90+ Cr)'), findsOneWidget);

    // 2. Verify Home Advising Dashboard elements
    expect(find.text('Good morning, Rahim'), findsOneWidget);
    expect(find.text('PRIORITY WINDOW'), findsOneWidget);
    expect(find.text('Credit Summary'), findsOneWidget);
    expect(find.text('ACTION WORKSPACE'), findsOneWidget);
    expect(find.text('Courses'), findsOneWidget);

    // 3. Navigate to Tab 1: Schedule Builder
    final scheduleTab = find.text('Schedule');
    expect(scheduleTab, findsWidgets);
    await tester.tap(scheduleTab.first);
    await tester.pump();

    expect(find.text('Instant Schedule AI Builder'), findsOneWidget);
    expect(find.text('5-DAY TIMETABLE PREVIEW'), findsOneWidget);
    expect(find.text('0 Clash'), findsOneWidget);

    // 4. Navigate to Tab 2: Prereqs & Petitions
    final prereqsTab = find.text('Prereqs');
    expect(prereqsTab, findsOneWidget);
    await tester.tap(prereqsTab);
    await tester.pump();

    expect(find.text('Seat Requests & Petitions'), findsOneWidget);
    expect(find.text('CSE 327 Sec 01'), findsOneWidget);

    // 5. Navigate to Tab 3: Alerts & IT
    final alertsTab = find.text('Alerts & IT');
    expect(alertsTab, findsOneWidget);
    await tester.tap(alertsTab);
    await tester.pump();

    expect(find.text('Alerts & Real-Time Radar'), findsOneWidget);
    expect(find.text('RDS EDGE GATEWAY (12ms)'), findsOneWidget);

    // 6. Test Bottom Sheet Modal invocation
    await tester.tap(find.text('Advising'));
    await tester.pump();

    final BuildContext context = tester.element(find.text('Good morning, Rahim'));
    MobileBottomSheets.showSeatApproved(
      context,
      courseCode: 'CSE 327',
      sectionNumber: '01',
      rdsToken: '#NSU-241215-327A',
    );
    await tester.pump();

    expect(find.text('Seat Reservation Confirmed'), findsOneWidget);
    expect(find.text('LOCKED'), findsOneWidget);
    expect(find.text('#NSU-241215-327A'), findsOneWidget);
  });
}
