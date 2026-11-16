'use client';

import React, { useState } from 'react';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import { FacultyHeader } from '@/components/FacultyHeader';
import { ExceptionCase } from '@/types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Filter,
  Check,
  X,
  MapPin,
  Calendar
} from 'lucide-react';

export default function FacultyExceptionsPage() {
  const {
    exceptions,
    approveException,
    rejectException,
    flagException
  } = useSmartAdvisor();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE #EX-2025-0841');

  const pendingExceptions = exceptions.filter((e) => e.status === 'pending');
  const approvedCount = 24 + exceptions.filter((e) => e.status === 'approved').length;

  const filteredList = exceptions.filter((e) => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Prereqs') return e.category === 'Prereqs';
    if (filterCategory === 'Capacity') return e.category === 'Capacity';
    if (filterCategory === 'Standing') return e.category === 'Credit Standing';
    return true;
  });

  const selectedCase =
    exceptions.find((e) => e.id === selectedCaseId) || exceptions[0];

  return (
    <div className="min-h-[calc(100vh-2.75rem)] bg-slate-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">
              Pending Exceptions
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {pendingExceptions.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Requires advisor sign-off</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Approved Today
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {approvedCount}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              100% SLA Compliant
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Auto-Approved by Rules
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">312</div>
            <div className="text-[11px] text-slate-500 mt-1">Standing Rules Engine</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">
              Avg. Response Time
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">18m</div>
            <div className="text-[11px] text-slate-500 mt-1">&le; 30m target threshold</div>
          </div>
        </div>

        {/* Split Screen Queue & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Queue List (5 Columns) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-slate-900">Advising Exception Queue</h2>
                <p className="text-xs text-slate-500">Select case to inspect rule audit</p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                {['All', 'Standing', 'Capacity', 'Prereqs'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      filterCategory === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredList.map((item) => {
                const isSelected = item.id === selectedCase?.id;
                const isApproved = item.status === 'approved';
                const isRejected = item.status === 'rejected';
                const isFlagged = item.status === 'flagged';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/50 border-l-4 border-nsu-teal'
                        : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-600">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : isFlagged
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-slate-900">{item.studentName}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      ID: {item.studentId} &bull; {item.program}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="font-bold text-slate-800">
                        {item.courseCode} Sec {item.sectionNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.submittedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Inspector (7 Columns) */}
          {selectedCase && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {selectedCase.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedCase.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedCase.studentName} ({selectedCase.studentId})
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedCase.program} &bull; {selectedCase.standing} &bull; CGPA{' '}
                    <strong className="text-slate-800 tabular-nums">{selectedCase.cgpa.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Requested Course</div>
                  <div className="text-base font-black text-nsu-teal">
                    {selectedCase.courseCode} Sec {selectedCase.sectionNumber}
                  </div>
                </div>
              </div>

              {/* Automated Rule Engine Verification */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Automated Rule Engine Verification
                </div>

                <div className="space-y-2">
                  {selectedCase.auditChecks?.map((check, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        check.passed
                          ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                          : 'bg-rose-50/60 border-rose-200/80 text-rose-950'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5">
                          {check.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span>{check.rule}</span>
                        </div>
                        <div className="text-[11px] opacity-80 pl-5.5">{check.description}</div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono shrink-0 ${
                          check.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {check.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Degree Completion Progress */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Degree Completion Progress:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {selectedCase.creditsCompleted} / 130 Cr (73.8%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(selectedCase.creditsCompleted / 130) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Student Statement Quote Card */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  STUDENT STATEMENT
                </div>
                <blockquote className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{selectedCase.statement}&rdquo;
                </blockquote>
              </div>

              {/* Decision Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => flagException(selectedCase.id)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Flag for In-Person Advising</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => rejectException(selectedCase.id)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => approveException(selectedCase.id)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Exception &amp; Enroll</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
