import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';
import '../state/app_state.dart';

class MobileBottomSheets {
  /// 1. SEAT REQUEST APPROVED SHEET
  static void showSeatApproved(BuildContext context, {
    String courseCode = 'CSE 327',
    String sectionNumber = '01',
    String rdsToken = '#NSU-241215-327A',
    VoidCallback? onViewSchedule,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Drag handle
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: AppTheme.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),

              // Animated Emerald Check Icon
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppTheme.emeraldLight,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.emerald.withOpacity(0.3), width: 2),
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: AppTheme.emerald,
                  size: 40,
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                'Seat Reservation Confirmed',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.navy,
                ),
              ),
              const SizedBox(height: 6),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.navy,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text(
                      'LOCKED',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      '$courseCode Sec $sectionNumber',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textSecondary,
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Token & Sync Status Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.canvas,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Flexible(
                          child: Text(
                            'RDS Transaction Token',
                            style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          rdsToken,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                            color: AppTheme.navy,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Divider(height: 1, color: AppTheme.border),
                    const SizedBox(height: 8),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          child: Text(
                            'Atomic Lock Buffer',
                            style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ),
                        SizedBox(width: 8),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.bolt, color: AppTheme.emerald, size: 16),
                            SizedBox(width: 4),
                            Text(
                              'Atomic Sync OK',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.emeraldDark,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Action button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    onViewSchedule?.call();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.teal,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'View Conflict-Free Schedule →',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  /// 2. MISSING PREREQUISITE RULE 4.2 SHEET
  static void showMissingPrereqRule42(BuildContext context, {
    String targetCourse = 'CSE 425',
    AppState? appState,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: AppTheme.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.amberLight,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.warning_amber_rounded, color: AppTheme.amber, size: 24),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Academic Rule 4.2 Floor Check',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.navy,
                          ),
                        ),
                        Text(
                          'Prerequisite & Senior Standing Audit',
                          style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Visual DAG Chain Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.canvas,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'PREREQUISITE DEPENDENCY GRAPH',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.6,
                        color: AppTheme.textMuted,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        _buildDagChip('CSE 215', 'Completed (A)', true),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 6),
                          child: Icon(Icons.arrow_forward, size: 14, color: AppTheme.textMuted),
                        ),
                        _buildDagChip('100+ Cr', '96/100 Cr', false),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 6),
                          child: Icon(Icons.arrow_forward, size: 14, color: AppTheme.textMuted),
                        ),
                        _buildDagChip(targetCourse, 'Target', false, isTarget: true),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              const Text(
                'Registration for 400-level electives requires completion of 100+ academic credits. You have earned 96.0 credits (Deficit: -4.0 Cr). Advisor sign-off is required under Rule 4.2 Standing Waiver.',
                style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 20),

              // 2 Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        final messenger = ScaffoldMessenger.maybeOf(context);
                        Navigator.pop(ctx);
                        messenger?.showSnackBar(
                          const SnackBar(
                            content: Text('Suggested alternative 300-level electives displayed.'),
                            backgroundColor: AppTheme.navy,
                          ),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
                        side: const BorderSide(color: AppTheme.border),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          'Take CSE 215/311 Alt',
                          style: TextStyle(fontSize: 12, color: AppTheme.textPrimary, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        final messenger = ScaffoldMessenger.maybeOf(context);
                        appState?.addPetition(
                          const PetitionItem(
                            id: 'PET-425-NEW',
                            courseCode: 'CSE 425',
                            sectionNumber: '01',
                            status: PetitionStatus.pending,
                            submittedAt: 'Just Now',
                            note: 'Rule 4.2 Senior Standing Waiver requested from Dr. Nova Ahmed.',
                          ),
                        );
                        Navigator.pop(ctx);
                        messenger?.showSnackBar(
                          const SnackBar(
                            content: Text('Standing Exception logged with Dr. Nova Ahmed.'),
                            backgroundColor: AppTheme.emeraldDark,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.amber,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          'Ask Advisor Exception',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  /// 3. SECTION FULL FALLBACK SHEET
  static void showSectionFullFallback(BuildContext context, {
    String courseCode = 'CSE 327',
    String fullSection = '03',
    Function(String secNumber)? onSelectAlternative,
  }) {
    bool isWatchActive = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(
                        color: AppTheme.border,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'CAPACITY REACHED (40/40)',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.8,
                                color: AppTheme.crimson,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '$courseCode Sec $fullSection • Prof. Dr. Rajesh Palit',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.navy,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.crimsonLight,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppTheme.crimson.withOpacity(0.3)),
                        ),
                        child: const Text(
                          '0 Seats',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.crimson,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Auto-Drop Watch toggle
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.canvas,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.border),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.notifications_active_outlined, color: AppTheme.teal, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Notify me if Sec $fullSection opens',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                              ),
                              const Text(
                                'Instant Telegram & SMS Radar auto-promotes',
                                style: TextStyle(fontSize: 10, color: AppTheme.textMuted),
                              ),
                            ],
                          ),
                        ),
                        Switch(
                          value: isWatchActive,
                          activeColor: AppTheme.teal,
                          onChanged: (val) {
                            setModalState(() {
                              isWatchActive = val;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  const Text(
                    'RECOMMENDED ALTERNATIVES (INSTANT 1-TAP SWAP)',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.6,
                      color: AppTheme.textMuted,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Alternative 1: Sec 01 Top Fit
                  _buildAlternativeTile(
                    title: 'Sec 01 • Dr. Nabeel Mohammed',
                    time: 'ST 11:20 AM - 12:50 PM',
                    room: 'SAC 502',
                    badge: '12 Open Seats',
                    badgeColor: AppTheme.emerald,
                    onTap: () {
                      Navigator.pop(ctx);
                      onSelectAlternative?.call('01');
                    },
                  ),
                  const SizedBox(height: 8),

                  // Alternative 2: Sec 02
                  _buildAlternativeTile(
                    title: 'Sec 02 • Dr. Silvia Ahmed',
                    time: 'MW 09:40 AM - 11:10 AM',
                    room: 'NAC 408',
                    badge: '4 Seats Left',
                    badgeColor: AppTheme.amber,
                    onTap: () {
                      Navigator.pop(ctx);
                      onSelectAlternative?.call('02');
                    },
                  ),
                  const SizedBox(height: 8),

                  // Alternative 3: Sec 04 Evening Slot
                  _buildAlternativeTile(
                    title: 'Sec 04 • Mr. Tanvir Rahman',
                    time: 'RA 04:20 PM - 05:50 PM',
                    room: 'LIB 602',
                    badge: '19 Open Seats',
                    badgeColor: AppTheme.emerald,
                    onTap: () {
                      Navigator.pop(ctx);
                      onSelectAlternative?.call('04');
                    },
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  static Widget _buildDagChip(String title, String subtitle, bool passed, {bool isTarget = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          color: passed
              ? AppTheme.emeraldLight
              : isTarget
                  ? AppTheme.navy.withOpacity(0.06)
                  : AppTheme.amberLight,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: passed
                ? AppTheme.emerald.withOpacity(0.3)
                : isTarget
                    ? AppTheme.navy.withOpacity(0.2)
                    : AppTheme.amber.withOpacity(0.3),
          ),
        ),
        child: Column(
          children: [
            Text(
              title,
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
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 9, color: AppTheme.textMuted),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  static Widget _buildAlternativeTile({
    required String title,
    required String time,
    required String room,
    required String badge,
    required Color badgeColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
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
                  Text(
                    title,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.navy),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '$time • $room',
                    style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: badgeColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: badgeColor.withOpacity(0.25)),
              ),
              child: Text(
                badge,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: badgeColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
