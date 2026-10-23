// pages/DailyAnalytics.tsx
import React, { useEffect, useState } from 'react';
import { Activity, Download } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import type { PatientId, DailyRecord } from '../types';
import { getPatientData } from '../services/dataService';
import { exportDailyData } from '../utils/csvExport';
import { formatDateShort, formatNumber } from '../utils/formatters';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

interface Props { selectedPatient: PatientId; selectedDate: string; }

const CHART_COLOR = ['#14b8a6', '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function DailyAnalytics({ selectedPatient }: Props) {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [from, setFrom] = useState('2026-07-01');
  const [to, setTo] = useState('2026-07-31');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPatientData(selectedPatient)
      .then((d) => setRecords(d))
      .finally(() => setLoading(false));
  }, [selectedPatient]);

  const filtered = records.filter((r) => r.date >= from && r.date <= to);
  const chartData = filtered.map((r) => ({
    date: formatDateShort(r.date),
    steps: r.steps,
    distance: r.distance_km,
    speed: r.gait_speed,
    stride: r.stride_length_cm,
    asymmetry: r.gait_asymmetry,
    activity: r.activity_minutes,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Analytics"
        subtitle="Daily rehabilitation activity overview — Demo Data Only"
        icon={<Activity size={20} />}
        actions={
          <button
            onClick={() => exportDailyData(filtered, `daily_${selectedPatient}.csv`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        }
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">From:</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600">To:</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <span className="text-xs text-slate-400">{filtered.length} records</span>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Data table */}
          <Card title="Daily Records" subtitle="All values are demonstration data">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Date', 'Steps', 'Distance (km)', 'Gait Speed (m/s)', 'Stride (cm)', 'Asymmetry (%)', 'Activity (min)', 'Energy (mJ)', 'Completeness (%)'].map((h) => (
                      <th key={h} className="text-left px-2 py-2 font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.date} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-2 py-2 font-medium whitespace-nowrap">{r.date}</td>
                      <td className="px-2 py-2">{formatNumber(r.steps)}</td>
                      <td className="px-2 py-2">{r.distance_km}</td>
                      <td className="px-2 py-2">{r.gait_speed}</td>
                      <td className="px-2 py-2">{r.stride_length_cm}</td>
                      <td className="px-2 py-2">{r.gait_asymmetry}</td>
                      <td className="px-2 py-2">{r.activity_minutes}</td>
                      <td className="px-2 py-2">{r.energy_harvested_mj}</td>
                      <td className="px-2 py-2">
                        <span className={r.data_completeness >= 95 ? 'text-emerald-600' : r.data_completeness >= 85 ? 'text-amber-500' : 'text-red-500'}>
                          {r.data_completeness}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && (
                <p className="text-center text-sm text-slate-400 py-8">No records in selected date range</p>
              )}
            </div>
          </Card>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { key: 'steps', label: 'Steps vs Date', color: CHART_COLOR[0], type: 'bar' },
              { key: 'distance', label: 'Distance (km) vs Date', color: CHART_COLOR[1], type: 'line' },
              { key: 'speed', label: 'Gait Speed (m/s) vs Date', color: CHART_COLOR[2], type: 'line' },
              { key: 'stride', label: 'Stride Length (cm) vs Date', color: CHART_COLOR[3], type: 'line' },
              { key: 'asymmetry', label: 'Gait Asymmetry (%) vs Date', color: CHART_COLOR[4], type: 'line' },
              { key: 'activity', label: 'Activity Duration (min) vs Date', color: CHART_COLOR[5], type: 'bar' },
            ].map(({ key, label, color, type }) => (
              <Card key={key} title={label} subtitle="Demo data">
                <ResponsiveContainer width="100%" height={200}>
                  {type === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} width={40} />
                      <Tooltip />
                      <Bar dataKey={key} fill={color} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} width={40} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
