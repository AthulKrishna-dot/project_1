// pages/EnergyAnalytics.tsx
import React, { useEffect, useState } from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import type { PatientId, DailyRecord } from '../types';
import { getPatientData } from '../services/dataService';
import { formatDateShort, formatNumber } from '../utils/formatters';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import KPICard from '../components/common/KPICard';

interface Props { selectedPatient: PatientId; selectedDate: string; }

function avg(arr: number[]) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export default function EnergyAnalytics({ selectedPatient }: Props) {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPatientData(selectedPatient).then(setRecords).finally(() => setLoading(false));
  }, [selectedPatient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const latest = records[records.length - 1];
  const harvested = records.map((r) => r.energy_harvested_mj);
  const avgHarvested = avg(harvested);
  const maxHarvested = Math.max(...harvested);
  const minHarvested = Math.min(...harvested);
  const stored = records.map((r) => r.energy_stored_mj);
  const avgStored = avg(stored);

  const energyStatus =
    avgHarvested >= 12 ? { label: 'Good', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    : avgHarvested >= 8 ? { label: 'Moderate', color: 'bg-amber-100 text-amber-700 border-amber-200' }
    : { label: 'Low', color: 'bg-red-100 text-red-700 border-red-200' };

  const chartData = records.map((r) => ({
    date: formatDateShort(r.date),
    harvested: r.energy_harvested_mj,
    stored: r.energy_stored_mj,
    consumed: r.energy_consumed_mj,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Energy Harvesting & Power Analytics"
        subtitle="Kinetic energy harvesting from walking activity — Demo Data Only"
        icon={<Zap size={20} />}
      />

      {/* Concept explanation */}
      <Card>
        <div className="flex items-start gap-3">
          <Zap size={18} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Energy Harvesting Concept</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The proposed smart insole uses kinetic energy generated during walking — such as heel-strike and
              toe-off events — to support low-power operation of on-device sensors and edge AI processing.
              All values displayed here are <strong>prototype demonstration values</strong> and do not represent
              real hardware measurements.
            </p>
          </div>
        </div>
      </Card>

      {/* Energy status badge */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${energyStatus.color}`}>
        <AlertTriangle size={16} className="shrink-0" />
        <div>
          <p className="text-sm font-semibold">Energy Status: {energyStatus.label}</p>
          <p className="text-xs opacity-80">
            Prototype threshold only — not a medical or device certification threshold.
            Good: ≥12 mJ avg | Moderate: 8–12 mJ avg | Low: &lt;8 mJ avg
          </p>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: 'Energy Harvested Today', value: latest?.energy_harvested_mj.toFixed(2) ?? '—', unit: 'mJ', bg: 'bg-yellow-500' },
          { title: 'Average Daily Energy', value: avgHarvested.toFixed(2), unit: 'mJ', bg: 'bg-amber-500' },
          { title: 'Maximum Harvested', value: maxHarvested.toFixed(2), unit: 'mJ', bg: 'bg-orange-500' },
          { title: 'Minimum Harvested', value: minHarvested.toFixed(2), unit: 'mJ', bg: 'bg-red-400' },
          { title: 'Avg Stored Energy', value: avgStored.toFixed(2), unit: 'mJ', bg: 'bg-teal-500' },
          { title: 'Avg Consumed', value: avg(records.map((r) => r.energy_consumed_mj)).toFixed(2), unit: 'mJ', bg: 'bg-slate-500' },
        ].map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            icon={<Zap size={16} />}
            iconBg={kpi.bg}
            isDemo
            description="Prototype demonstration value"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Energy Harvested vs Date" subtitle="Demo data — prototype values">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="harvestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={40} />
              <Tooltip formatter={(v: unknown) => [`${v} mJ`, 'Harvested']} />
              <Area type="monotone" dataKey="harvested" stroke="#eab308" fill="url(#harvestGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Energy Stored vs Date" subtitle="Demo data — supercapacitor prototype">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="storedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={40} />
              <Tooltip formatter={(v: unknown) => [`${v} mJ`, 'Stored']} />
              <Area type="monotone" dataKey="stored" stroke="#14b8a6" fill="url(#storedGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Energy Consumption vs Date" subtitle="Estimated on-device consumption">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={40} />
              <Tooltip formatter={(v: unknown) => [`${v} mJ`, 'Consumed']} />
              <Line type="monotone" dataKey="consumed" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Harvested vs Consumed Energy" subtitle="Energy balance overview — Demo">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData.slice(-14)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="harvested" name="Harvested (mJ)" fill="#eab308" radius={[3, 3, 0, 0]} />
              <Bar dataKey="consumed" name="Consumed (mJ)" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
