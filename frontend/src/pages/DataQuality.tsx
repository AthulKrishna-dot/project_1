// pages/DataQuality.tsx
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Wifi, Clock, Server, AlertTriangle } from 'lucide-react';
import type { PatientId, DataQualityReport } from '../types';
import { getDataQuality } from '../services/dataService';
import StatusBadge from '../components/common/StatusBadge';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

interface Props { selectedPatient: PatientId; selectedDate: string; }

function CompletionRing({ pct }: { pct: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  const color = pct >= 95 ? '#10b981' : pct >= 85 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center justify-center">
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#f1f5f9" strokeWidth={10} />
        <circle
          cx={55} cy={55} r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
        <text x={55} y={59} textAnchor="middle" fontSize={18} fontWeight="700" fill={color}>
          {pct.toFixed(1)}%
        </text>
      </svg>
    </div>
  );
}

export default function DataQuality({ selectedPatient }: Props) {
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDataQuality(selectedPatient).then(setReport).finally(() => setLoading(false));
  }, [selectedPatient]);

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality & Device Status"
        subtitle="Sensor availability, data completeness, and system status — Demo Mode"
        icon={<ShieldCheck size={20} />}
      />

      <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-blue-500" />
        <p className="text-xs leading-snug">
          All sensor statuses and device metrics shown are <strong>prototype demonstration values</strong>.
          Real device status will be available after hardware integration (Phase 4).
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completeness ring */}
        <Card>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Data Completeness</p>
          <CompletionRing pct={report.completeness} />
          <p className="text-center text-[10px] text-amber-600 font-medium mt-1">Demo value</p>
        </Card>

        {/* Communication */}
        <Card>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Communication</p>
          <div className="flex items-center gap-2 mb-2">
            <Wifi size={18} className="text-blue-500" />
            <StatusBadge status="Demo" size="md" />
          </div>
          <p className="text-sm font-bold text-slate-700">{report.communication_status}</p>
          <p className="text-xs text-slate-400 mt-1">Hardware not yet connected</p>
        </Card>

        {/* Last data */}
        <Card>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Last Data Received</p>
          <Clock size={18} className="text-teal-500 mb-2" />
          <p className="text-sm font-bold text-slate-700">{report.last_data_received}</p>
          <p className="text-xs text-slate-400 mt-1">Simulated — Demo Mode</p>
        </Card>

        {/* Uptime */}
        <Card>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Device Uptime</p>
          <Server size={18} className="text-emerald-500 mb-2" />
          <p className="text-sm font-bold text-slate-700">{report.device_uptime}</p>
          <p className="text-xs text-slate-400 mt-1">Simulated — Demo Mode</p>
        </Card>
      </div>

      {/* Records stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: report.total_records, icon: '📊' },
          { label: 'Missing Records', value: report.missing_records, icon: '❓' },
          { label: 'Missing %', value: `${report.missing_pct}%`, icon: '⚠️' },
          { label: 'Sensor Errors', value: report.sensor_errors, icon: '🔴' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-xl mb-1">{m.icon}</p>
            <p className="text-2xl font-bold text-slate-800">{m.value}</p>
            <p className="text-xs text-slate-500 mt-1">{m.label}</p>
            <p className="text-[10px] text-amber-600 mt-0.5 font-medium">Demo</p>
          </div>
        ))}
      </div>

      {/* Sensor status table */}
      <Card title="Sensor Status" subtitle="Prototype sensor availability — all Demo">
        <div className="space-y-2">
          {report.sensors.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.status === 'Online' ? 'bg-emerald-500' : s.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                <p className="text-sm font-medium text-slate-700">{s.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-slate-400">Last: {s.lastSeen}</p>
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Smart Insole architecture */}
      <Card title="Planned Hardware Architecture" subtitle="Future ESP32 Smart Insole Integration">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Smart Insole Sensors',
              icon: '👟',
              items: ['4× Force/Pressure Sensors', '3-axis Accelerometer', 'Energy Harvesting Module', 'Piezoelectric/Triboelectric'],
            },
            {
              title: 'Edge Processing (ESP32)',
              icon: '🔌',
              items: ['On-device AI inference', 'Wi-Fi / BLE communication', 'Data preprocessing', 'Power management'],
            },
            {
              title: 'Optional Smart Band',
              icon: '⌚',
              items: ['Heart Rate Monitor', 'Activity Tracking', 'Sleep Monitoring', 'Step Counter'],
            },
          ].map((section) => (
            <div key={section.title} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{section.icon}</span>
                <p className="text-xs font-bold text-slate-700">{section.title}</p>
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item} className="text-xs text-slate-500 flex items-start gap-1.5">
                    <span className="text-teal-400 shrink-0 mt-0.5">•</span>{item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-amber-600 font-medium mt-3">Planned integration</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
