'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import { StudentSidebar } from '@/components/StudentSidebar';
import { CourseSection } from '@/types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  X,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function StudentDashboardPage() {
  const {
    student,
    sections,
    stagedSectionIds,
    stagedSections,
    totalCredits,
    clashes,
    stageSection,
    unstageSection
  } = useSmartAdvisor();

  // Search & Filter state
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [strategy, setStrategy] = useState<'milestone' | 'minimize_gaps'>('milestone');

  // Live countdown timer state (ticking every 1s)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 28,
    seconds: 14
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter sections
  const filteredSections = sections.filter((sec) => {
    const matchesDept = selectedDept === 'All Departments' || sec.department === selectedDept;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      sec.courseCode.toLowerCase().includes(q) ||
      sec.courseTitle.toLowerCase().includes(q) ||
      sec.faculty.toLowerCase().includes(q) ||
      sec.room.toLowerCase().includes(q);
    return matchesDept && matchesQuery;
  });

  const departmentTabs = [
    'All Departments',
    'ECE / CSE',
    'Math & Physics',
    'BBA',
    'English & Mod. Lang'
  ];

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-2.75rem)]">
      <StudentSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Banner: Welcome + Advising Clearance + Slot Countdown */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome back, Rahim
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Senior Standing
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ADVISING CLEARANCE: Cleared by Dr. Nova
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">&bull;</span>
                <span className="text-xs text-slate-500 hidden sm:inline font-mono">
                  Cart Token: #{student.cartToken}
                </span>
              </div>
            </div>

            {/* Live Ticking Countdown */}
            <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-4 shrink-0 shadow-sm border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  YOUR SLOT CLOSES IN
                </div>
                <div className="text-lg font-black font-mono tracking-wider tabular-nums text-emerald-400">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </div>
              </div>
              <Clock className="w-5 h-5 text-emerald-400/80 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Center + Left Column: Course Radar & Search (2 Columns on large screens) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Department Filter Pills + Search */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {departmentTabs.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedDept === dept
                          ? 'bg-nsu-navy text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search course code, faculty, room (e.g. CSE 327, Nabeel, SAC 502)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-nsu-teal shadow-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Live Seat Radar Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h2 className="font-bold text-sm text-slate-900 tracking-tight">
                      Live Seat Radar &bull; Spring 2025
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Showing {filteredSections.length} sections
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4">Course &amp; Title</th>
                        <th className="py-3 px-3">Faculty &amp; Room</th>
                        <th className="py-3 px-3">Schedule</th>
                        <th className="py-3 px-3">Seat Availability</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredSections.map((sec) => {
                        const available = sec.capacity - sec.enrolled;
                        const isStaged = stagedSectionIds.includes(sec.id);
                        const isFull = available <= 0;
                        const isFew = available > 0 && available <= 5;
                        const percentage = Math.round((sec.enrolled / sec.capacity) * 100);

                        return (
                          <tr
                            key={sec.id}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              isStaged ? 'bg-teal-50/30' : ''
                            }`}
                          >
                            {/* Course Code & Title */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                {sec.courseCode}
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-600">
                                  Sec {sec.sectionNumber}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                                {sec.courseTitle}
                              </div>
                            </td>

                            {/* Faculty & Room */}
                            <td className="py-3.5 px-3">
                              <div className="font-medium text-slate-800 truncate max-w-[150px]">
                                {sec.faculty}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {sec.room}
                              </div>
                            </td>

                            {/* Schedule */}
                            <td className="py-3.5 px-3">
                              <div className="font-semibold text-slate-700">{sec.days}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{sec.timeSlot}</div>
                            </td>

                            {/* Seat Availability Radar */}
                            <td className="py-3.5 px-3 min-w-[160px]">
                              <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                                <span className="font-bold tabular-nums">
                                  {String(available).padStart(2, '0')}/{sec.capacity}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                    isFull
                                      ? 'bg-rose-100 text-rose-700'
                                      : isFew
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {isFull ? 'Full (0 Left)' : isFew ? 'Few Seats' : 'Available'}
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    isFull
                                      ? 'bg-rose-500'
                                      : isFew
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </td>

                            {/* Action Button */}
                            <td className="py-3.5 px-4 text-right">
                              {isStaged ? (
                                <button
                                  onClick={() => unstageSection(sec.id)}
                                  className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-800 hover:bg-rose-100 hover:text-rose-800 text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                  <span>Staged &times;</span>
                                </button>
                              ) : isFull ? (
                                <button
                                  onClick={() => stageSection(sec.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                                >
                                  <span>Full (Swap)</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => stageSection(sec.id)}
                                  className="px-3 py-1.5 rounded-lg bg-nsu-navy hover:bg-nsu-teal text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1 ml-auto cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Stage</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sticky Draft Plan Panel (1 Column) */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm sticky top-16 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 tracking-tight">My Selection</h2>
                    <p className="text-[11px] text-slate-500">Spring 2025 Draft Plan</p>
                  </div>
                  {clashes.length > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      {clashes.length} Clash Detected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      0 Timetable Clashes
                    </span>
                  )}
                </div>

                {/* Staged Sections List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Staged Courses ({stagedSections.length})</span>
                    <span className="font-bold text-indigo-700 tabular-nums font-mono">
                      {totalCredits.toFixed(1)} / 15.0 Cr
                    </span>
                  </div>

                  {stagedSections.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No sections staged yet. Click &ldquo;+ Stage&rdquo; on any course to add it to your draft plan.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {stagedSections.map((sec) => (
                        <div
                          key={sec.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex items-start justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{sec.courseCode}</span>
                              <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                                Sec {sec.sectionNumber}
                              </span>
                              <span className="text-[10px] text-indigo-700 font-semibold tabular-nums">
                                {sec.credits.toFixed(1)} Cr
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">{sec.faculty}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 font-mono">
                              <span>
                                {sec.days} {sec.timeSlot}
                              </span>
                              <span>&bull;</span>
                              <span>{sec.room}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => unstageSection(sec.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-white transition-colors"
                            title="Remove section"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Strategy Optimizer Toggle */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Automated Schedule Strategy
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setStrategy('milestone')}
                      className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all ${
                        strategy === 'milestone'
                          ? 'bg-nsu-navy text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Milestone First
                    </button>
                    <button
                      type="button"
                      onClick={() => setStrategy('minimize_gaps')}
                      className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all ${
                        strategy === 'minimize_gaps'
                          ? 'bg-nsu-navy text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Minimize Gaps
                    </button>
                  </div>
                </div>

                {/* Generate Schedule Button */}
                <Link
                  href="/student/schedule"
                  className="w-full py-3 px-4 rounded-xl bg-nsu-teal hover:bg-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Schedule ({totalCredits.toFixed(1)} Cr) &rarr;</span>
                </Link>

                {/* Degree Completion Progress Bar */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Degree Progress:</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {student.creditsCompleted} / {student.creditsTotal} Cr (73.8%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(student.creditsCompleted / student.creditsTotal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Graduation window: Fall 2025 &bull; Systems Track
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
