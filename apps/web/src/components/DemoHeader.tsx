'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import {
  Sparkles,
  Zap,
  RotateCcw,
  AlertTriangle,
  Users,
  ShieldAlert,
  ChevronDown,
  Layers,
  GraduationCap,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export function DemoHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    setRole,
    simulateSurgeSpike,
    simulateSectionFull,
    resetDemoState,
    approveException,
    metrics
  } = useSmartAdvisor();

  const [isOpen, setIsOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const isStudent = pathname?.startsWith('/student');
  const isFaculty = pathname?.startsWith('/faculty');
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname === '/' || pathname === '/login';

  return (
    <div className="bg-nsu-navy text-white text-xs border-b border-slate-700/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-11 flex items-center justify-between gap-2">
        {/* Left: Branding & Role switcher */}
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-bold tracking-tight text-white hover:text-indigo-200 transition-colors shrink-0"
          >
            <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
              S
            </div>
            <span className="hidden sm:inline font-mono font-semibold">SmartAdvisor NSU</span>
          </Link>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* Quick Portal Switcher Pills */}
          <div className="flex items-center space-x-1 shrink-0">
            <Link
              href="/student/dashboard"
              onClick={() => setRole('student')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                isStudent
                  ? 'bg-nsu-teal text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </Link>

            <Link
              href="/faculty/exceptions"
              onClick={() => setRole('faculty')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                isFaculty
                  ? 'bg-nsu-teal text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Faculty
            </Link>

            <Link
              href="/admin/health"
              onClick={() => setRole('admin')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-nsu-teal text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              IT Admin
            </Link>
          </div>
        </div>

        {/* Right: Cross-Tab Sync & Demo Controls Popover */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Live Sync Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">Cross-Tab Sync &lt;50ms Active</span>
          </div>

          {/* Demo Controls Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo Controls</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Presentation Controls
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    Sprint 1
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mb-2.5">
                  Trigger instant real-time events to demo cross-tab updates to faculty:
                </p>

                <div className="space-y-1.5">
                  {/* Simulate Surge Spike */}
                  <button
                    onClick={() => {
                      simulateSurgeSpike();
                      setIsOpen(false);
                      if (!isAdmin) router.push('/admin/health');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-300 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-rose-900">
                          Simulate Surge Spike
                        </div>
                        <div className="text-[10px] text-slate-500">
                          3,450 req/s &bull; 275ms latency spike
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-rose-600 font-bold">SEV-1</span>
                  </button>

                  {/* Simulate Full Section */}
                  <button
                    onClick={() => {
                      simulateSectionFull('CSE327-01');
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-amber-900">
                          Fill CSE 327 Sec 01
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Forces 40/40 &bull; Triggers alternatives
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-600 font-bold">40/40</span>
                  </button>

                  {/* Approve Rahim Ahmed Exception */}
                  <button
                    onClick={() => {
                      approveException('CASE #EX-2025-0841');
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-emerald-900">
                          Dr. Nova Approves CSE 425
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Enrolls Rahim &bull; Updates all open tabs
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Auto</span>
                  </button>

                  {/* Reset State */}
                  <button
                    onClick={() => {
                      resetDemoState();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-between text-slate-700 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span className="font-medium">Reset Demo State</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Pristine</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
