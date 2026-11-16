import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smartadvisor_mobile/main.dart';

void main() {
  testWidgets('SmartAdvisor Mobile App complete interactive smoke and navigation test',
      (WidgetTester tester) async {
    // 1. Set realistic mobile viewport size to prevent RenderFlex overflow in headless environments
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.625;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    // 2. Build root widget (starts at LoginScreen)
    await tester.pumpWidget(const SmartAdvisorApp());
    await tester.pump();

    // 3. Verify Login Screen renders branding, input labels, and sign in button
    expect(find.text('SmartAdvisor NSU'), findsOneWidget);
    expect(find.text('RDS GATEWAY LIVE • NSU Official'), findsOneWidget);
    expect(find.text('Student Portal'), findsOneWidget);
    expect(find.text('10-DIGIT NSU ID'), findsOneWidget);
    expect(find.text('PASSWORD'), findsOneWidget);
    expect(find.text('Sign in →'), findsOneWidget);
    expect(find.byIcon(Icons.badge_outlined), findsOneWidget);
    expect(find.byIcon(Icons.lock_outline), findsOneWidget);

    // 4. Tap Sign In button and pump frame (using 500ms duration due to live countdown timer)
    final signInButton = find.text('Sign in →');
    expect(signInButton, findsOneWidget);
    await tester.tap(signInButton);
    await tester.pump(const Duration(milliseconds: 500));

    // 5. Verify Main Navigation Shell and Advising Dashboard loaded
    expect(find.text('SmartAdvisor NSU'), findsOneWidget);
    expect(find.text('Phase 2 (90+ Cr)'), findsOneWidget);
    expect(find.text('Good morning, Rahim'), findsOneWidget);
    expect(find.text('PRIORITY WINDOW'), findsOneWidget);
    expect(find.text('Credit Summary'), findsOneWidget);
    expect(find.text('ACTION WORKSPACE'), findsOneWidget);
    expect(find.byIcon(Icons.dashboard), findsOneWidget);

    // 6. Test Navigation Tab 1: Schedule Builder
    final scheduleTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Schedule'),
    );
    expect(scheduleTab, findsOneWidget);
    await tester.tap(scheduleTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Instant Schedule AI Builder'), findsOneWidget);
    expect(find.text('5-DAY TIMETABLE PREVIEW'), findsOneWidget);
    expect(find.text('0 Clash'), findsOneWidget);
    expect(find.byIcon(Icons.calendar_month), findsOneWidget);

    // 7. Test Navigation Tab 2: Prereqs & Petitions
    final prereqsTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Prereqs'),
    );
    expect(prereqsTab, findsOneWidget);
    await tester.tap(prereqsTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Seat Requests & Petitions'), findsOneWidget);
    expect(find.text('CSE 327 Sec 01'), findsOneWidget);
    expect(find.byIcon(Icons.assignment), findsOneWidget);

    // 8. Test Navigation Tab 3: Alerts & IT
    final alertsTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Alerts & IT'),
    );
    expect(alertsTab, findsOneWidget);
    await tester.tap(alertsTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Alerts & Real-Time Radar'), findsOneWidget);
    expect(find.text('RDS EDGE GATEWAY (12ms)'), findsOneWidget);
    expect(find.byIcon(Icons.notifications), findsOneWidget);

    // 9. Return to Advising Tab
    final advisingTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Advising'),
    );
    expect(advisingTab, findsOneWidget);
    await tester.tap(advisingTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Good morning, Rahim'), findsOneWidget);
    expect(find.byIcon(Icons.dashboard), findsOneWidget);
  });

  testWidgets('SmartAdvisor Mobile App narrow viewport layout smoke test (360dp)',
      (WidgetTester tester) async {
    tester.view.physicalSize = const Size(360, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    await tester.pumpWidget(const SmartAdvisorApp());
    await tester.pump();

    // Verify Login Screen on 360dp
    expect(find.text('SmartAdvisor NSU'), findsOneWidget);
    expect(find.text('RDS GATEWAY LIVE • NSU Official'), findsOneWidget);
    final signInButton = find.text('Sign in →');
    expect(signInButton, findsOneWidget);
    await tester.tap(signInButton);
    await tester.pump(const Duration(milliseconds: 500));

    // Advising tab on 360dp
    expect(find.text('Good morning, Rahim'), findsOneWidget);
    expect(find.text('PRIORITY WINDOW'), findsOneWidget);
    expect(find.text('Credit Summary'), findsOneWidget);
    expect(find.text('ACTION WORKSPACE'), findsOneWidget);
    expect(find.byIcon(Icons.dashboard), findsOneWidget);

    // Schedule tab on 360dp
    final scheduleTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Schedule'),
    );
    expect(scheduleTab, findsOneWidget);
    await tester.tap(scheduleTab);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('Instant Schedule AI Builder'), findsOneWidget);
    expect(find.text('5-DAY TIMETABLE PREVIEW'), findsOneWidget);
    expect(find.byIcon(Icons.calendar_month), findsOneWidget);

    // Prereqs tab on 360dp
    final prereqsTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Prereqs'),
    );
    expect(prereqsTab, findsOneWidget);
    await tester.tap(prereqsTab);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('Seat Requests & Petitions'), findsOneWidget);
    expect(find.text('CSE 327 Sec 01'), findsOneWidget);
    expect(find.byIcon(Icons.assignment), findsOneWidget);

    // Alerts tab on 360dp
    final alertsTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Alerts & IT'),
    );
    expect(alertsTab, findsOneWidget);
    await tester.tap(alertsTab);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('Alerts & Real-Time Radar'), findsOneWidget);
    expect(find.text('RDS EDGE GATEWAY (12ms)'), findsOneWidget);
    expect(find.byIcon(Icons.notifications), findsOneWidget);

    // Return to Advising Tab on 360dp
    final advisingTab = find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Advising'),
    );
    expect(advisingTab, findsOneWidget);
    await tester.tap(advisingTab);
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('Good morning, Rahim'), findsOneWidget);
    expect(find.byIcon(Icons.dashboard), findsOneWidget);
  });
}
