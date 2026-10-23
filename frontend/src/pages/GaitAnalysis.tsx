// pages/GaitAnalysis.tsx
import React, { useEffect, useState } from 'react';
import { Footprints, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import type { PatientId, DailyRecord } from '../types';
import { getGaitData } from '../services/dataService';
import { formatDateShort, pctChange, formatPct } from '../utils/formatters';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

interface Props { selectedPatient: PatientId; selectedDate: string; }

interface TrendRow {
  parameter: string;
  unit: string;
  current: number;
  previous: number;
  key: keyof DailyRecord;
}

const TREND_ROWS: Omit<TrendRow, 'current' | 'previous'>[] = [
  { parameter: 'Steps', unit: 'steps', key: 'steps' },
  { parameter: 'Gait Speed', unit: 'm/s', key: 'gait_speed' },
  { parameter: 'Stride Length', unit: 'cm', key: 'stride_length_cm' },
  { parameter: 'Gait Asymmetry', unit: '%', key: 'gait_asymmetry' },
  { parameter: 'Activity Duration', unit: 'min', key: 'activity_minutes' },
  { parameter: 'Walking Distance', unit: 'km', key: 'distance_km' },
];

const PARAM_OPTIONS = [
  { key: 'steps', label: 'Steps' },
  { key: 'distance_km', label: 'Distance (km)' },
  { key: 'gait_speed', label: 'Gait Speed (m/s)' },
  { key: 'stride_length_cm', label: 'Stride Length (cm)' },
  { key: 'gait_asymmetry', label: 'Gait Asymmetry (%)' },
];

export default function GaitAnalysis({ selectedPatient }: Props) {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [selectedParam, setSelectedParam] = useState<string>('steps');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGaitData(selectedPatient)
      .then(setRecords)
      .finally(() => setLoading(false));
  }, [selectedPatient]);

  const latest = records[records.length - 1];
  const prevRecord = records[records.length - 8];
  const midpoint = Math.floor(records.length / 2);
  const firstHalf = records.slice(0, midpoint);
  const secondHalf = records.slice(midpoint);

  const trendRows = TREND_ROWS.map((row) => {
    const cur = (latest?.[row.key] as number) ?? 0;
    const prev = (prevRecord?.[row.key] as number) ?? cur;
    return { ...row, current: cur, previous: prev };
  });

  const chartData = records.map((r) => ({
    date: formatDateShort(r.date),
    [selectedParam]: (r as unknown as Record<string, unknown>)[selectedParam],
  }));

  // Comparison chart (current vs previous week averages)
  const compData = PARAM_OPTIONS.map((p) => {
    const firstAvg = firstHalf.length
      ? firstHalf.reduce((s, r) => s + ((r as unknown as Record<string, unknown>)[p.key] as number), 0) / firstHalf.length
      : 0;
    const secondAvg = secondHalf.length
      ? secondHalf.reduce((s, r) => s + ((r as unknown as Record<string, unknown>)[p.key] as number), 0) / secondHalf.length
      : 0;
    return { label: p.label.split(' ')[0], first: parseFloat(firstAvg.toFixed(2)), second: parseFloat(secondAvg.toFixed(2)) };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gait Analysis"
        subtitle={`Detailed gait parameter analysis for ${selectedPatient} — Demo Data Only`}
        icon={<Footprints size={20} />}
      />

      <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs">
        Trend labels (Increased / Decreased / Stable) describe recorded data changes only.
        They do not indicate clinical improvement or deterioration.
      </div>

      {/* Trend cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {trendRows.map((row) => {
          const pct = pctChange(row.current, row.previous);
          const dir = Math.abs(pct) < 3 ? 'stable' : pct > 0 ? 'increased' : 'decreased';
          const Icon = dir === 'stable' ? Minus : pct > 0 ? TrendingUp : TrendingDown;
          const color = dir === 'stable' ? 'text-slate-400' : pct > 0 ? 'text-emerald-600' : 'text-red-500';
          const bg = dir === 'stable' ? 'bg-slate-50' : pct > 0 ? 'bg-emerald-50' : 'bg-red-50';
          return (
            <div key={row.key} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{row.parameter}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${bg} ${color}`}>
                  <Icon size={10} />
                  {dir === 'stable' ? 'Stable' : dir === 'increased' ? 'Increased' : 'Decreased'}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {typeof row.current === 'number' && row.current > 100
                  ? Math.round(row.current).toLocaleString()
                  : row.current.toFixed(2)}
                <span className="text-sm font-normal text-slate-400 ml-1">{row.unit}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Previous: {typeof row.previous === 'number' && row.previous > 100
                  ? Math.round(row.previous).toLocaleString()
                  : row.previous.toFixed(2)} {row.unit}
                {' · '}<span className={color}>{formatPct(pct)}</span>
              </p>
              <p className="text-[10px] text-amber-600 mt-1 font-medium">Demo data</p>
            </div>
          );
        })}
      </div>

      {/* Parameter time series */}
      <Card
        title="Gait Parameters Over Time"
        subtitle="Select a parameter to visualize"
        actions={
          <select
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {PARAM_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        }
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={50} domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedParam}
              stroke="#14b8a6"
              strokeWidth={2.5}
              dot={false}
              name={PARAM_OPTIONS.find((p) => p.key === selectedParam)?.label}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Current vs previous period comparison */}
      <Card title="Current Period vs Previous Period" subtitle="First half vs second half of monitoring window — Demo Data">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={compData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={50} />
            <Tooltip />
            <Legend />
            <Bar dataKey="first" name="First Period" fill="#94a3b8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="second" name="Second Period" fill="#14b8a6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
