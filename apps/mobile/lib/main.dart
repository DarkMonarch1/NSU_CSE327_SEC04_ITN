import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'state/app_state.dart';
import 'screens/login_screen.dart';
import 'screens/main_scaffold.dart';

void main() {
  runApp(const SmartAdvisorMobileApp());
}

class SmartAdvisorMobileApp extends StatefulWidget {
  const SmartAdvisorMobileApp({super.key});

  @override
  State<SmartAdvisorMobileApp> createState() => _SmartAdvisorMobileAppState();
}

class _SmartAdvisorMobileAppState extends State<SmartAdvisorMobileApp> {
  final AppState _appState = AppState();

  @override
  void initState() {
    super.initState();
    _appState.addListener(_onStateChange);
  }

  @override
  void dispose() {
    _appState.removeListener(_onStateChange);
    _appState.dispose();
    super.dispose();
  }

  void _onStateChange() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartAdvisor NSU',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.themeData,
      home: _appState.isLoggedIn
          ? MainScaffold(appState: _appState)
          : LoginScreen(appState: _appState),
    );
  }
}
