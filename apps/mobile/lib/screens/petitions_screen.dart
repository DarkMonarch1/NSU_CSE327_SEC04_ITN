import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../state/app_state.dart';
import '../models/models.dart';
import '../widgets/bottom_sheets.dart';

class PetitionsScreen extends StatefulWidget {
  final AppState appState;

  const PetitionsScreen({super.key, required this.appState});

  @override
  State<PetitionsScreen> createState() => _PetitionsScreenState();
}

class _PetitionsScreenState extends State<PetitionsScreen> {
  String _selectedFilter = 'All 4';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.appState.petitions.where((p) {
      if (_selectedFilter == 'Approved 1') return p.status == PetitionStatus.approved;
      if (_selectedFilter == 'Pending 1') return p.status == PetitionStatus.pending;
      if (_selectedFilter == 'Waitlisted 1') return p.status == PetitionStatus.waitlisted;
      return true;
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Seat Requests & Petitions',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.navy,
              letterSpacing: -0.2,
            ),
          ),
          const Text(
            'Audited by Autonomous DAG & Faculty Committee',
            style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 14),

          // Filter Pills
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['All 4', 'Approved 1', 'Pending 1', 'Waitlisted 1'].map((filter) {
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
                    backgroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(color: isSelected ? AppTheme.navy : AppTheme.border),
                    ),
                    onSelected: (_) => setState(() => _selectedFilter = filter),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // Petition Timeline Cards
          ...List.generate(filtered.length, (index) {
            final petition = filtered[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildPetitionCard(context, petition),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildPetitionCard(BuildContext context, PetitionItem petition) {
    Color statusColor;
    Color statusBg;
    String statusText;
    IconData statusIcon;

    switch (petition.status) {
      case PetitionStatus.approved:
        statusColor = AppTheme.emerald;
        statusBg = AppTheme.emeraldLight;
        statusText = 'APPROVED';
        statusIcon = Icons.check_circle_outline;
        break;
      case PetitionStatus.pending:
        statusColor = AppTheme.amber;
        statusBg = AppTheme.amberLight;
        statusText = 'PENDING REVIEW';
        statusIcon = Icons.hourglass_top_outlined;
        break;
      case PetitionStatus.waitlisted:
        statusColor = AppTheme.teal;
        statusBg = AppTheme.teal.withOpacity(0.1);
        statusText = 'WAITLISTED (#3)';
        statusIcon = Icons.format_list_numbered_rounded;
        break;
      case PetitionStatus.rejected:
        statusColor = AppTheme.crimson;
        statusBg = AppTheme.crimsonLight;
        statusText = 'REJECTED';
        statusIcon = Icons.cancel_outlined;
        break;
    }

    return InkWell(
      onTap: () {
        if (petition.status == PetitionStatus.approved) {
          MobileBottomSheets.showSeatApproved(
            context,
            courseCode: petition.courseCode,
            sectionNumber: petition.sectionNumber,
            rdsToken: petition.rdsToken,
            onViewSchedule: () => widget.appState.setTab(1),
          );
        } else if (petition.status == PetitionStatus.pending) {
          MobileBottomSheets.showMissingPrereqRule42(
            context,
            targetCourse: petition.courseCode,
            appState: widget.appState,
          );
        }
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        '${petition.courseCode} Sec ${petition.sectionNumber}',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.navy,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: statusBg,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(statusIcon, color: statusColor, size: 12),
                            const SizedBox(width: 4),
                            Text(
                              statusText,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: statusColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  petition.submittedAt,
                  style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                ),
              ],
            ),
            const SizedBox(height: 8),

            Text(
              petition.note,
              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.3),
            ),

            if (petition.rdsToken.isNotEmpty) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.canvas,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.vpn_key_outlined, size: 12, color: AppTheme.teal),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        'RDS Token: ${petition.rdsToken}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontFamily: 'monospace',
                          fontWeight: FontWeight.bold,
                          color: AppTheme.navy,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
