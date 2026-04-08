import 'package:flutter_test/flutter_test.dart';

import 'package:royaledex/main.dart';

void main() {
  testWidgets('renders bootstrap home text', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('RoyaleDex - teste'), findsOneWidget);
  });
}
