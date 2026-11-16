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

    // 3. Verify Login Screen renders branding and sign in button
    expect(find.text('SmartAdvisor NSU'), findsOneWidget);
    expect(find.textContaining('Sign in'), findsOneWidget);
    expect(find.text('RDS GATEWAY LIVE • NSU Official'), findsOneWidget);

    // 4. Tap Sign In button and pump frame (do not use pumpAndSettle due to periodic timer)
    final signInButton = find.textContaining('Sign in');
    expect(signInButton, findsOneWidget);
    await tester.tap(signInButton);
    await tester.pump(const Duration(seconds: 1));

    // 5. Verify Main Navigation Shell and Advising Dashboard loaded
    expect(find.text('Phase 2 (90+ Cr)'), findsOneWidget);
    expect(find.text('Good morning, Rahim'), findsOneWidget);
    expect(find.text('PRIORITY WINDOW'), findsOneWidget);
    expect(find.text('Credit Summary'), findsOneWidget);
    expect(find.text('ACTION WORKSPACE'), findsOneWidget);

    // 6. Test Navigation Tab 1: Schedule Builder
    final scheduleTab = find.text('Schedule');
    expect(scheduleTab, findsWidgets);
    await tester.tap(scheduleTab.first);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Instant Schedule AI Builder'), findsOneWidget);
    expect(find.text('5-DAY TIMETABLE PREVIEW'), findsOneWidget);
    expect(find.text('0 Clash'), findsOneWidget);

    // 7. Test Navigation Tab 2: Prereqs & Petitions
    final prereqsTab = find.text('Prereqs');
    expect(prereqsTab, findsOneWidget);
    await tester.tap(prereqsTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Seat Requests & Petitions'), findsOneWidget);
    expect(find.text('CSE 327 Sec 01'), findsOneWidget);

    // 8. Test Navigation Tab 3: Alerts & IT
    final alertsTab = find.text('Alerts & IT');
    expect(alertsTab, findsOneWidget);
    await tester.tap(alertsTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Alerts & Real-Time Radar'), findsOneWidget);
    expect(find.text('RDS EDGE GATEWAY (12ms)'), findsOneWidget);

    // 9. Return to Advising Tab
    final advisingTab = find.text('Advising');
    expect(advisingTab, findsOneWidget);
    await tester.tap(advisingTab);
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Good morning, Rahim'), findsOneWidget);
  });
}
