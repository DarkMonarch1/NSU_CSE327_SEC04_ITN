'use client';

import React, { useState } from 'react';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import { CourseSection, ScheduleReceipt } from '@/types';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  ShieldAlert,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  Clock,
  MapPin,
  UserCheck,
  Building2,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export function GlobalModals() {
  const {
    activeModal,
    modalPayload,
    closeModal,
    stageSection,
    expandCapacity,
    allocateEmergencySection,
    exceptions,
    approveException
  } = useSmartAdvisor();

  // For Capacity Expansion Modal
  const [selectedDelta, setSelectedDelta] = useState<number>(10);

  // For Emergency Section Modal
  const [emergencyFaculty, setEmergencyFaculty] = useState('Mr. Tanvir Rahman');
  const [emergencyRoom, setEmergencyRoom] = useState('LIB 608');
  const [emergencySlot, setEmergencySlot] = useState('04:20 PM - 05:50 PM');
  const [emergencyDays, setEmergencyDays] = useState<'MW' | 'ST' | 'RA'>('MW');

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* 1. RULE 4.2 / CREDIT STANDING ALERT MODAL */}
      {activeModal === 'rule_alert' && (
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="bg-amber-500 text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Academic Rule 4.2 Standing Alert</h3>
                <p className="text-amber-100 text-xs">Pre-Advising Automated Rule Engine Audit</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-amber-100 hover:text-white p-1 rounded-lg hover:bg-amber-600/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-sm">
              <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Senior Standing Floor Requirement Not Met
              </div>
              <p className="text-amber-800 text-xs leading-relaxed">
                Registration for <strong>{modalPayload?.section?.courseCode}</strong> (
                {modalPayload?.section?.courseTitle}) requires a minimum of{' '}
                <strong>{modalPayload?.requiredCredits} completed credits</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-0.5">Your Completed Credits</div>
                <div className="font-bold text-base text-slate-800 tabular-nums">
                  {modalPayload?.studentCredits || 96} / 130 Cr
                </div>
                <div className="text-[11px] text-amber-600 font-medium mt-0.5">
                  Deficit: -4.0 Credits
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-0.5">Course Credit Floor</div>
                <div className="font-bold text-base text-slate-800 tabular-nums">
                  {modalPayload?.requiredCredits || 100} Cr Required
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">400-Level Elective Track</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
              <div className="font-semibold text-slate-800">Automated Resolution Path:</div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your CGPA is 3.64 (Meets Honors threshold &ge; 3.00)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Standing Exception case <strong>#EX-2025-0841</strong> is logged with Dr. Nova Ahmed</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeModal();
                  // Simulate auto-approval by advisor
                  approveException('CASE #EX-2025-0841');
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                Request Advisor Override (Dr. Nova)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTION FULL ALTERNATIVES MODAL */}
      {activeModal === 'section_full' && (
        <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="bg-rose-600 text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-700 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Section Sold Out (0 Seats Remaining)</h3>
                <p className="text-rose-100 text-xs">
                  {modalPayload?.fullSection?.courseCode} &bull; Section {modalPayload?.fullSection?.sectionNumber} is
                  Full
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-rose-100 hover:text-white p-1 rounded-lg hover:bg-rose-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600">
              This section currently has <strong>0 open seats</strong> (40/40 enrolled) and{' '}
              <strong>14 students waitlisted</strong>. SmartAdvisor has detected available open sections for this exact
              course:
            </p>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Instant Section Swap Options:
              </div>

              {modalPayload?.alternatives && modalPayload.alternatives.length > 0 ? (
                modalPayload.alternatives.map((alt: CourseSection) => {
                  const available = alt.capacity - alt.enrolled;
                  return (
                    <div
                      key={alt.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-nsu-teal bg-slate-50/50 hover:bg-teal-50/30 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">Section {alt.sectionNumber}</span>
                          <span className="text-xs text-slate-600">&bull; {alt.faculty}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {alt.days} {alt.timeSlot}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {alt.room}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 tabular-nums">
                          {available} seats open
                        </span>
                        <button
                          onClick={() => {
                            stageSection(alt.id);
                            closeModal();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-nsu-teal hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          Select Section
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-xs text-center">
                  All standard sections currently full. You may join the waitlist or request a department expansion.
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Waitlist Position: #15 if you proceed</span>
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FACULTY CAPACITY EXPANSION MODAL */}
      {activeModal === 'capacity_expand' && (
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="bg-nsu-navy text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-nsu-teal rounded-xl">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Expand Section Capacity</h3>
                <p className="text-slate-300 text-xs">
                  {modalPayload?.courseCode} &bull; Section {modalPayload?.sectionNumber} ({modalPayload?.faculty})
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Current Cap</div>
                <div className="text-2xl font-black text-slate-800 tabular-nums">
                  {modalPayload?.capacity || 40}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-xs text-emerald-600 uppercase font-semibold">Expanded Cap</div>
                <div className="text-2xl font-black text-emerald-700 tabular-nums">
                  {(modalPayload?.capacity || 40) + selectedDelta}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-semibold">Delta</div>
                <div className="text-lg font-bold text-indigo-600 tabular-nums">+{selectedDelta}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Capacity Delta:</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setSelectedDelta(delta)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      selectedDelta === delta
                        ? 'bg-nsu-teal text-white border-nsu-teal shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    +{delta} Seats
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-700" />
                Physical Lab Safety Threshold Check
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Room <strong>{modalPayload?.room || 'LIB 602'}</strong> has a certified maximum capacity of{' '}
                <strong>55 physical workstations</strong>. Expanding to {(modalPayload?.capacity || 40) + selectedDelta}{' '}
                is strictly compliant with building fire and safety codes.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  expandCapacity(modalPayload.id, selectedDelta);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                Confirm Capacity Expansion (+{selectedDelta})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SCHEDULE CONFIRMATION RECEIPT MODAL */}
      {activeModal === 'receipt' && (
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="bg-emerald-600 text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-700 rounded-xl">
                <FileCheck2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Advising Enrollment Confirmed</h3>
                <p className="text-emerald-100 text-xs font-mono">
                  {modalPayload?.transactionId || '#RDS-TXN-2025-98412'}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
              <div>
                <span className="text-slate-500">Student:</span>{' '}
                <strong className="text-slate-900">Rahim Ahmed (2412159042)</strong>
              </div>
              <div>
                <span className="text-slate-500">Semester:</span>{' '}
                <strong className="text-slate-900">Spring 2025</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Confirmed &amp; Locked Courses:
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {modalPayload?.sections?.map((sec: CourseSection) => (
                  <div
                    key={sec.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{sec.courseCode}</span>{' '}
                      <span className="text-slate-600">Sec {sec.sectionNumber}</span>
                      <div className="text-[11px] text-slate-500">
                        {sec.days} {sec.timeSlot} &bull; {sec.room}
                      </div>
                    </div>
                    <span className="font-semibold text-indigo-700 tabular-nums">{sec.credits.toFixed(1)} Cr</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 font-mono text-[10px] text-slate-600 break-all space-y-1">
              <div>
                <strong>Digital Signature:</strong> {modalPayload?.digitalSignature}
              </div>
              <div>
                <strong>Timestamp:</strong> {modalPayload?.timestamp}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-700 font-bold">
                Total Enrolled Credits:{' '}
                <span className="text-emerald-600 tabular-nums">
                  {modalPayload?.totalCredits?.toFixed(1) || '10.0'} Cr
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EMERGENCY SECTION MODAL (IT ADMIN) */}
      {activeModal === 'emergency_section' && (
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="bg-rose-700 text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-800 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Provision Emergency Section</h3>
                <p className="text-rose-100 text-xs">
                  {modalPayload?.courseCode || 'CSE 327'} &bull; Direct Database Dispatch
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600">
              Allocating an emergency section will instantly create <strong>Section 05 (+40 capacity)</strong> in the
              RDS database and broadcast the availability to student clients in &lt;50ms.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Faculty In-Charge:</label>
                <input
                  type="text"
                  value={emergencyFaculty}
                  onChange={(e) => setEmergencyFaculty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Days Pattern:</label>
                  <select
                    value={emergencyDays}
                    onChange={(e: any) => setEmergencyDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="MW">MW (Mon/Wed)</option>
                    <option value="ST">ST (Sun/Tue)</option>
                    <option value="RA">RA (Thu Lab)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Room Assignment:</label>
                  <input
                    type="text"
                    value={emergencyRoom}
                    onChange={(e) => setEmergencyRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Time Slot:</label>
                <input
                  type="text"
                  value={emergencySlot}
                  onChange={(e) => setEmergencySlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  allocateEmergencySection(modalPayload?.courseCode || 'CSE 327', {
                    faculty: emergencyFaculty,
                    days: emergencyDays,
                    room: emergencyRoom,
                    timeSlot: emergencySlot,
                    capacity: 40
                  });
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Deploy Section 05 (+40 Seats)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
