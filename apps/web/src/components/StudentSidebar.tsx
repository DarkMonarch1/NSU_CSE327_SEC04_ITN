'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  FileClock,
  Bell,
  Settings,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function StudentSidebar() {
  const pathname = usePathname();
  const { student, stagedSectionIds, exceptions } = useSmartAdvisor();

  const pendingExceptionsCount = exceptions.filter(
    (e) => e.studentId === student.id && e.status === 'pending'
  ).length;

  const navItems = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Courses Radar', href: '/student/dashboard', icon: BookOpen },
    { label: 'Weekly Schedule', href: '/student/schedule', icon: CalendarDays, badge: `${stagedSectionIds.length} staged` },
    { label: 'Requests & Exceptions', href: '/faculty/exceptions', icon: FileClock, badge: pendingExceptionsCount > 0 ? `${pendingExceptionsCount}` : undefined },
    { label: 'Advising Clearance', href: '/student/dashboard', icon: ShieldCheck, badge: 'Cleared' },
    { label: 'Settings', href: '/student/dashboard', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-2.75rem)]">
      <div className="p-4 space-y-6">
        {/* Student Profile Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              RA
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-sm text-slate-900 truncate">{student.name}</div>
              <div className="text-[11px] font-mono text-slate-500 tabular-nums">{student.id}</div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Standing</span>
              <span className="font-semibold text-slate-700">Senior</span>
            </div>
            <div>
              <span className="text-slate-400 block">CGPA</span>
              <span className="font-bold text-indigo-700 tabular-nums">{student.cgpa.toFixed(2)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Credits Earned</span>
              <span className="font-bold text-slate-800 tabular-nums">
                {student.creditsCompleted} / {student.creditsTotal} Cr
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Advising Workspace
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href && (item.label === 'Dashboard' ? pathname === '/student/dashboard' : true);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-nsu-teal/10 text-nsu-teal font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-nsu-teal' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                      item.badge === 'Cleared'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer telemetry */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            RDS Live Sync
          </span>
          <span className="font-bold text-slate-700">12ms Active</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono truncate">
          Cart Token: {student.cartToken}
        </div>
      </div>
    </aside>
  );
}
