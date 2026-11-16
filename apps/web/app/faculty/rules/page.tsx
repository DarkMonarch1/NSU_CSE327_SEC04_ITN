'use client';

import React from 'react';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import { FacultyHeader } from '@/components/FacultyHeader';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Info
} from 'lucide-react';

export default function FacultyRulesPage() {
  const { bypassRules, toggleBypassRule } = useSmartAdvisor();

  return (
    <div className="min-h-[calc(100vh-2.75rem)] bg-slate-50 flex flex-col">
      <FacultyHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Automated Bypass Rules &amp; Standing Exceptions Engine
          </h1>
          <p className="text-xs text-slate-500">
            Configure automated DAG routing policies enacted by the NSU Academic Senate
          </p>
        </div>

        {/* Informational Banner */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Autonomous Exception Governance</div>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              When enabled, these academic policies allow the SmartAdvisor DAG engine to automatically validate and
              grant waivers for eligible senior students without requiring synchronous faculty intervention.
            </p>
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 w-32">Rule Code</th>
                  <th className="py-3.5 px-4">Policy Title &amp; Description</th>
                  <th className="py-3.5 px-4 w-32">Category</th>
                  <th className="py-3.5 px-4">Authority Directives</th>
                  <th className="py-3.5 px-4 text-right w-36">Policy State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bypassRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-700">
                      {rule.code}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs">{rule.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {rule.description}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {rule.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[11px] text-slate-500 font-mono">
                      {rule.lastUpdated}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleBypassRule(rule.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          rule.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                        <span>{rule.enabled ? 'Enabled' : 'Suspended'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
