import 'package:flutter_test/flutter_test.dart';
import 'package:smartadvisor_mobile/main.dart';

void main() {
  testWidgets('SmartAdvisor app smoke test renders dashboard and supervisor details',
      (WidgetTester tester) async {
    // Build the widget tree
    await tester.pumpWidget(const SmartAdvisorApp());

    // Verify title is rendered
    expect(find.text('SmartAdvisor NSU'), findsOneWidget);

    // Verify course & supervisor info are rendered
    expect(find.text('Autonomous Advising Engine'), findsOneWidget);
    expect(find.text('Supervisor: Intisar Tahmeed Sir (ITN)'), findsOneWidget);
  });
}
