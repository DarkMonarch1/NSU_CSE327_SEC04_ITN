'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSmartAdvisor } from '@/store/smartAdvisorStore';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  Activity,
  Zap,
  Server,
  Database,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function AdminHealthPage() {
  const {
    metrics,
    autoScaleApiNodes,
    acknowledgeIncident,
    escalations
  } = useSmartAdvisor();

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const isBreached = metrics.p95LatencyMs > metrics.slaCeilingMs;

  // Chart data simulation points
  const chartPoints = [
    { time: '09:00', rps: 1120, latency: 145 },
    { time: '09:15', rps: 1340, latency: 162 },
    { time: '09:30', rps: 1560, latency: 180 },
    { time: '09:45', rps: 1720, latency: 198 },
    { time: '10:00', rps: metrics.requestsPerSec, latency: metrics.p95LatencyMs },
  ];

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-2.75rem)]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  System Health &amp; Telemetry Hub
                </h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Node Cluster Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time connection pool, p95 latency monitoring, and auto-scaling controller
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/escalations"
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Seat Escalations</span>
              </Link>
            </div>
          </div>

          {/* 4 Live-Updating KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Requests / Sec
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                {metrics.requestsPerSec.toLocaleString()} <span className="text-xs font-normal text-slate-400">req/s</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Peak Registration Phase</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  P95 Latency
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isBreached ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  SLA: {metrics.slaCeilingMs} ms
                </span>
              </div>
              <div
                className={`text-2xl font-black tabular-nums font-mono ${
                  isBreached ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {metrics.p95LatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
              </div>
              <div
                className={`text-[11px] mt-1 font-semibold flex items-center gap-1 ${
                  isBreached ? 'text-rose-600 animate-pulse' : 'text-emerald-600'
                }`}
              >
                {isBreached ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Breached SLA Ceiling (+18 ms)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Compliant with SLA</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                HTTP 5xx Error Rate
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                {metrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Database Panics</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                PostgreSQL Pool
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                {metrics.poolUsed} / {metrics.poolTotal}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                {Math.round((metrics.poolUsed / metrics.poolTotal) * 100)}% Used &bull; 44 slots reserve
              </div>
            </div>
          </div>

          {/* Interactive SVG Dual-Axis Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Throughput &amp; Latency Dynamics (Live Stream)
                </h2>
                <p className="text-xs text-slate-500">
                  Dual-axis telemetry tracking queries per second and response duration
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                  <span className="w-3 h-0.5 bg-indigo-600"></span>
                  Throughput (req/s)
                </div>
                <div className="flex items-center gap-1.5 text-teal-600 font-semibold">
                  <span className="w-3 h-0.5 bg-teal-600"></span>
                  P95 Latency (ms)
                </div>
                <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                  <span className="w-3 h-0.5 border-t border-dashed border-rose-600"></span>
                  SLA Ceiling (200 ms)
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative h-64 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="#E2E8F0" strokeWidth="1" />

                {/* Dashed Red SLA Ceiling Line at y=60 (equivalent to 200ms) */}
                <line
                  x1="0"
                  y1="60"
                  x2="600"
                  y2="60"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text x="590" y="55" fill="#DC2626" fontSize="10" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                  CRITICAL SLA CEILING (200 ms)
                </text>

                {/* Latency Curve (Teal) */}
                <path
                  d="M 50 140 Q 150 120 250 95 T 450 70 T 550 50"
                  fill="none"
                  stroke="#0D7A91"
                  strokeWidth="3"
                />

                {/* Throughput Curve (Indigo) */}
                <path
                  d="M 50 170 Q 150 140 250 110 T 450 60 T 550 30"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2.5"
                />

                {/* Interactive Points */}
                {chartPoints.map((pt, idx) => {
                  const cx = 50 + idx * 125;
                  const cyLatency = 190 - (pt.latency / 300) * 160;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={cx}
                        cy={cyLatency}
                        r="5"
                        fill="#0D7A91"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-125"
                      />
                      <text
                        x={cx}
                        y="195"
                        fill="#64748B"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {pt.time}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover tooltip card */}
              {hoveredPoint !== null && (
                <div
                  className="absolute bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl pointer-events-none z-10 font-mono -translate-x-1/2 -translate-y-full"
                  style={{ left: `${(hoveredPoint / 4) * 80 + 10}%`, top: '40%' }}
                >
                  <div className="font-bold text-teal-400">
                    Time: {chartPoints[hoveredPoint].time}
                  </div>
                  <div>Throughput: {chartPoints[hoveredPoint].rps} req/s</div>
                  <div className={chartPoints[hoveredPoint].latency > 200 ? 'text-rose-400' : 'text-emerald-400'}>
                    P95 Latency: {chartPoints[hoveredPoint].latency} ms
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Alerts & Actionable Incident Resolution Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isBreached ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  ></span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isBreached
                      ? 'SEV-1 Telemetry Alert: Edge API Capacity Under Pressure'
                      : 'All Service Level Objectives Meeting Strict Standards'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {metrics.lastScalingEvent ||
                    'Currently 6 worker instances active in ap-south-1 Dhaka Edge zone.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={acknowledgeIncident}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Acknowledge
                </button>

                <button
                  type="button"
                  onClick={autoScaleApiNodes}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Auto-Scale API Nodes (+2)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Core Services Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">API Gateway</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500">{metrics.apiNodes} Instances Healthy</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">100% Uptime</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">WebSocket Radar</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500">Redis Pub/Sub Sync</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">12ms P99 Broadcast</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">Redis 7 Primary</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500">In-Memory Cache</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">0.4ms Latency</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">PostgreSQL RDS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500">Row-Lock ACID Engine</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">Zero Race Conditions</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800">NGINX Ingress</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500">TLS 1.3 Termination</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1">HTTP/2 Multiplexed</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
