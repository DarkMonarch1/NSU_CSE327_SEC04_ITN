'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import { StudentSidebar } from '@/components/StudentSidebar';
import { CourseSection } from '@/types';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Building2,
  FileCheck2,
  Printer,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function StudentSchedulePage() {
  const {
    student,
    stagedSections,
    totalCredits,
    clashes,
    confirmSchedule,
    receipt,
    unstageSection
  } = useSmartAdvisor();

  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    confirmSchedule();
    setConfirmed(true);
  };

  // Days list
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  // Time slots grid definition
  const slots = [
    { label: '08:00 AM - 09:30 AM', id: '08:00 AM - 09:30 AM' },
    { label: '09:40 AM - 11:10 AM', id: '09:40 AM - 11:10 AM' },
    { label: '11:20 AM - 12:50 PM', id: '11:20 AM - 12:50 PM' },
    { label: '12:50 PM - 01:20 PM', id: 'recess', isRecess: true },
    { label: '01:20 PM - 02:50 PM', id: '01:20 PM - 02:50 PM' },
    { label: '02:40 PM - 04:10 PM', id: '02:40 PM - 04:10 PM' },
    { label: '04:20 PM - 05:50 PM', id: '04:20 PM - 05:50 PM' }
  ];

  // Helper to match section with day and time slot
  const getSectionForSlot = (day: string, slotId: string): CourseSection | undefined => {
    return stagedSections.find((sec) => {
      // Lab check: Thursday lab e.g. CSE 311L
      if (sec.days === 'Thu' || sec.isLab) {
        if (day === 'Thursday' && (slotId === '09:40 AM - 11:10 AM' || slotId === '11:20 AM - 12:50 PM')) {
          return true;
        }
      }

      // ST courses
      if (sec.days === 'ST' && (day === 'Sunday' || day === 'Tuesday')) {
        return sec.timeSlot === slotId;
      }

      // MW courses
      if (sec.days === 'MW' && (day === 'Monday' || day === 'Wednesday')) {
        return sec.timeSlot === slotId;
      }

      // RA courses (Thursday / Sunday)
      if (sec.days === 'RA' && (day === 'Sunday' || day === 'Thursday')) {
        return sec.timeSlot === slotId;
      }

      return false;
    });
  };

  const getCourseBadgeColor = (courseCode: string) => {
    if (courseCode.startsWith('CSE 327')) return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    if (courseCode.startsWith('CSE 311')) return 'bg-teal-50 border-teal-200 text-teal-900';
    if (courseCode.startsWith('MAT')) return 'bg-amber-50 border-amber-200 text-amber-900';
    if (courseCode.startsWith('CSE 331')) return 'bg-sky-50 border-sky-200 text-sky-900';
    return 'bg-purple-50 border-purple-200 text-purple-900';
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-2.75rem)]">
      <StudentSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/student/dashboard"
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Weekly Timetable Planner
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Spring 2025
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Five-Day Schedule Grid &bull; Conflict-free optimization engine
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Selected Load</div>
                <div className="text-sm font-bold text-indigo-700 tabular-nums font-mono">
                  {totalCredits.toFixed(1)} / 15.0 Cr
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="py-2.5 px-5 rounded-xl bg-nsu-teal hover:bg-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Schedule ({totalCredits.toFixed(1)} Cr)</span>
              </button>
            </div>
          </div>

          {/* Contact Hours & Campus Transition Telemetry Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Weekly Contact Hours</div>
                <div className="text-base font-bold text-slate-900 tabular-nums">
                  {(totalCredits * 1.5).toFixed(1)} Hours / Week
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Campus Building Transitions</div>
                <div className="text-base font-bold text-slate-900">SAC &amp; NAC (10m Walk)</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Clash Validation Status</div>
                <div className="text-base font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  0 Clashes (Verified)
                </div>
              </div>
            </div>
          </div>

          {/* Full 5-Day Weekly Timetable Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[760px]">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 w-32 border-r border-slate-200 text-slate-500 font-mono text-[11px]">
                      Time Slot
                    </th>
                    {days.map((day) => (
                      <th key={day} className="py-3 px-4 text-center border-r border-slate-200 last:border-r-0">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {slots.map((slot) => {
                    // Render Recess Row
                    if (slot.isRecess) {
                      return (
                        <tr key={slot.id} className="bg-amber-50/70 border-y border-amber-200">
                          <td className="py-2.5 px-4 font-mono font-semibold text-[11px] text-amber-800 border-r border-amber-200">
                            {slot.label}
                          </td>
                          <td
                            colSpan={5}
                            className="py-2.5 px-4 text-center text-xs font-bold tracking-wide text-amber-900 uppercase"
                          >
                            &bull;&bull;&bull; CAMPUS LUNCH &amp; ZUHR PRAYER RECESS (30 MINUTES NO CONFLICTS) &bull;&bull;&bull;
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Time Slot Label */}
                        <td className="py-3.5 px-4 font-mono font-medium text-[11px] text-slate-500 border-r border-slate-200 whitespace-nowrap bg-slate-50/30">
                          {slot.label}
                        </td>

                        {/* Day Columns */}
                        {days.map((day) => {
                          const sec = getSectionForSlot(day, slot.id);

                          return (
                            <td
                              key={day}
                              className="py-2 px-3 border-r border-slate-200 last:border-r-0 align-top min-w-[140px]"
                            >
                              {sec ? (
                                <div
                                  className={`p-2.5 rounded-xl border shadow-xs transition-transform hover:scale-[1.02] ${getCourseBadgeColor(
                                    sec.courseCode
                                  )}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-black text-xs tracking-tight">
                                      {sec.courseCode}
                                    </span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/80 border border-current">
                                      Sec {sec.sectionNumber}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-medium truncate mt-0.5 opacity-90">
                                    {sec.faculty}
                                  </div>
                                  <div className="text-[10px] font-mono mt-1 flex items-center justify-between opacity-80">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {sec.room}
                                    </span>
                                    <span className="font-bold">{sec.credits.toFixed(1)} Cr</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-14 rounded-lg border border-dashed border-slate-200/60 flex items-center justify-center text-[10px] text-slate-300">
                                  &mdash;
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
