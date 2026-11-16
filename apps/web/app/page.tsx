import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-700/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                SmartAdvisor NSU
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-indigo-400 font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50">
                CSE 327 Sec 04
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          North South University &bull; Dept of Electrical & Computer Engineering
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Autonomous Advising &amp;{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300">
            Registration Engine
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
          Eliminating launch-minute seat contention, prerequisite errors, and manual advising bottlenecks through
          DAG-based curriculum validation, PostgreSQL ACID row locks, and headless RDS workers.
        </p>

        {/* Academic Supervision Info */}
        <div className="inline-block p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner max-w-xl text-left">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Project Supervision &amp; Course
          </div>
          <div className="text-sm text-slate-200">
            <strong className="text-white">Supervisor:</strong> Intisar Tahmeed Sir [ITN]
          </div>
          <div className="text-sm text-slate-300">
            <strong className="text-white">Course:</strong> CSE 327 (Section 04) &mdash; Software Engineering
          </div>
        </div>
      </section>

      {/* Architecture Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 transition-colors">
            <div className="p-3 bg-indigo-600/20 rounded-lg w-fit text-indigo-400 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Autonomous DAG Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Validates curriculum prerequisites dynamically via a Directed Acyclic Graph with 1-click fallback resolution.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 transition-colors">
            <div className="p-3 bg-sky-600/20 rounded-lg w-fit text-sky-400 mb-4">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Zero Double-Booking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Guaranteed seat atomicity via PostgreSQL 16 row-level locks and strict ACID transactions tested for peak loads.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 transition-colors">
            <div className="p-3 bg-teal-600/20 rounded-lg w-fit text-teal-400 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Real-Time Sync (&le;500ms)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Redis Pub/Sub synchronizes seat capacity across Next.js Web, Flutter Mobile, and administrative portals.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 transition-colors">
            <div className="p-3 bg-purple-600/20 rounded-lg w-fit text-purple-400 mb-4">
              <Server className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Headless RDS Worker</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Redis BullMQ and automated workers execute high-concurrency enrollment batches into the legacy NSU RDS system.
            </p>
          </div>
        </div>

        {/* Monorepo Services Status */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/70">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400" /> Monorepo Services &amp; Pipeline Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-slate-200">services/api</div>
                <div className="text-xs text-slate-400">Node + Express + TS</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-slate-200">services/rds-worker</div>
                <div className="text-xs text-slate-400">Node + BullMQ + TS</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-slate-200">apps/web</div>
                <div className="text-xs text-slate-400">Next.js App Router</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-slate-200">apps/mobile</div>
                <div className="text-xs text-slate-400">Flutter Cross-Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>SmartAdvisor NSU &bull; CSE 327 Sec 04 (Spring 2026) &bull; North South University</p>
      </footer>
    </main>
  );
}
