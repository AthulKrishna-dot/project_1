// pages/PatientReports.tsx
import React, { useEffect, useState } from 'react';
import { ClipboardList, Download, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import type { PatientId, DailyRecord } from '../types';
import { getPatientData } from '../services/dataService';
import { formatDateShort } from '../utils/formatters';
import { exportDailyData } from '../utils/csvExport';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

interface Props { selectedPatient: PatientId; selectedDate: string; }

const SCORE_FIELDS = [
  { key: 'pain_score', label: 'Pain', color: '#ef4444', description: 'Self-reported pain level' },
  { key: 'anxiety_score', label: 'Anxiety', color: '#f59e0b', description: 'Self-reported anxiety level' },
  { key: 'depression_score', label: 'Depression', color: '#8b5cf6', description: 'Self-reported depression level' },
  { key: 'appetite_score', label: 'Appetite', color: '#10b981', description: 'Self-reported appetite level' },
  { key: 'sleep_score', label: 'Sleep', color: '#3b82f6', description: 'Self-reported sleep quality' },
  { key: 'general_condition_score', label: 'General Condition', color: '#14b8a6', description: 'Self-reported general condition' },
] as const;

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 w-12 text-right">{value}/100</span>
    </div>
  );
}

export default function PatientReports({ selectedPatient }: Props) {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPatientData(selectedPatient).then(setRecords).finally(() => setLoading(false));
  }, [selectedPatient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const latest = records[records.length - 1];
  const chartData = records.map((r) => ({
    date: formatDateShort(r.date),
    pain: r.pain_score,
    anxiety: r.anxiety_score,
    depression: r.depression_score,
    appetite: r.appetite_score,
    sleep: r.sleep_score,
    condition: r.general_condition_score,
  }));

  // Radar chart data (latest scores)
  const radarData = SCORE_FIELDS.map((f) => ({
    subject: f.label,
    value: (latest?.[f.key] as number) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Reports"
        subtitle="Self-reported outcome measures — Prototype values only"
        icon={<ClipboardList size={20} />}
        actions={
          <button
            onClick={() => exportDailyData(records, `patient_reports_${selectedPatient}.csv`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <Download size={13} /> Export
          </button>
        }
      />

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-500" />
        <p className="text-xs leading-snug">
          <strong>Self-Reported Prototype Values.</strong> Scores are entered by the patient (or generated as demo data).
          This is not a validated clinical assessment tool. Scale is 0–100 for prototype purposes only.
          Not for clinical decision-making.
        </p>
      </div>

      {/* Latest scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Latest Self-Reported Scores" subtitle={`${latest?.date ?? 'N/A'} — Demo data`}>
          <div className="space-y-4">
            {SCORE_FIELDS.map((f) => (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-600">{f.label}</p>
                  <p className="text-[10px] text-slate-400">{f.description}</p>
                </div>
                <ScoreBar value={(latest?.[f.key] as number) ?? 0} color={f.color} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-amber-600 font-medium">⚠ All values are prototype demonstration data</p>
        </Card>

        <Card title="Score Overview (Radar)" subtitle="Current period — Demo data">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
              <Tooltip formatter={(v: unknown) => [`${v}/100`, 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trends chart */}
      <Card title="Score Trends Over Time" subtitle="All self-reported scores — Demo data">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={35} domain={[0, 100]} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Pain" />
            <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Anxiety" />
            <Line type="monotone" dataKey="depression" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="Depression" />
            <Line type="monotone" dataKey="appetite" stroke="#10b981" strokeWidth={1.5} dot={false} name="Appetite" />
            <Line type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Sleep" />
            <Line type="monotone" dataKey="condition" stroke="#14b8a6" strokeWidth={1.5} dot={false} name="General Condition" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary table */}
      <Card title="Patient Report History" subtitle="Chronological self-reported data — Demo">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-100">
                {['Date', 'Pain', 'Anxiety', 'Depression', 'Appetite', 'Sleep', 'General Condition'].map((h) => (
                  <th key={h} className="text-left px-2 py-2 font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.slice(-14).reverse().map((r) => (
                <tr key={r.date} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-2 py-2 font-medium">{r.date}</td>
                  <td className="px-2 py-2">{r.pain_score}</td>
                  <td className="px-2 py-2">{r.anxiety_score}</td>
                  <td className="px-2 py-2">{r.depression_score}</td>
                  <td className="px-2 py-2">{r.appetite_score}</td>
                  <td className="px-2 py-2">{r.sleep_score}</td>
                  <td className="px-2 py-2">{r.general_condition_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
