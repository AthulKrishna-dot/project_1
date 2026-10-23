// pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Footprints, MapPin, Gauge, ArrowLeftRight, Activity,
  Zap, Database, TrendingUp, AlertTriangle, Info, AlertCircle
} from 'lucide-react';
import KPICard from '../components/common/KPICard';
import AlertCard from '../components/common/AlertCard';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, AreaChart, Area
} from 'recharts';
import type { PatientId, DailyRecord, Alert } from '../types';
import { getPatientData } from '../services/dataService';
import { generateAlerts } from '../utils/alertUtils';
import { formatNumber, formatDate, formatDateShort, pctChange } from '../utils/formatters';

interface DashboardProps {
  selectedPatient: PatientId;
  selectedDate: string;
}

export default function Dashboard({ selectedPatient, selectedDate }: DashboardProps) {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPatientData(selectedPatient)
      .then((data) => {
        setRecords(data);
        setAlerts(generateAlerts(data));
      })
      .finally(() => setLoading(false));
  }, [selectedPatient]);

  const latest = records[records.length - 1];
  const prev = records[records.length - 8];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading demo data...</p>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">No data available for {selectedPatient}</p>
      </div>
    );
  }

  // Chart data — last 14 days
  const chartData = records.slice(-14).map((r) => ({
    date: formatDateShort(r.date),
    steps: r.steps,
    speed: r.gait_speed,
    energy: r.energy_harvested_mj,
    completeness: r.data_completeness,
  }));

  const kpis = [
    {
      title: 'Steps',
      value: formatNumber(latest.steps),
      unit: 'steps',
      icon: <Footprints size={16} />,
      iconBg: 'bg-teal-500',
      trend: latest.steps > (prev?.steps ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.steps, prev?.steps ?? latest.steps),
      trendNote: 'vs 7 days ago',
    },
    {
      title: 'Walking Distance',
      value: latest.distance_km.toFixed(2),
      unit: 'km',
      icon: <MapPin size={16} />,
      iconBg: 'bg-blue-500',
      trend: latest.distance_km > (prev?.distance_km ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.distance_km, prev?.distance_km ?? latest.distance_km),
      trendNote: 'vs 7 days ago',
    },
    {
      title: 'Avg Gait Speed',
      value: latest.gait_speed.toFixed(2),
      unit: 'm/s',
      icon: <Gauge size={16} />,
      iconBg: 'bg-indigo-500',
      trend: latest.gait_speed > (prev?.gait_speed ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.gait_speed, prev?.gait_speed ?? latest.gait_speed),
      trendNote: 'vs 7 days ago',
    },
    {
      title: 'Avg Stride Length',
      value: latest.stride_length_cm.toFixed(1),
      unit: 'cm',
      icon: <ArrowLeftRight size={16} />,
      iconBg: 'bg-violet-500',
      trend: latest.stride_length_cm > (prev?.stride_length_cm ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.stride_length_cm, prev?.stride_length_cm ?? latest.stride_length_cm),
      trendNote: 'vs 7 days ago',
    },
    {
      title: 'Gait Asymmetry',
      value: latest.gait_asymmetry.toFixed(1),
      unit: '%',
      icon: <TrendingUp size={16} />,
      iconBg: 'bg-orange-500',
      trend: latest.gait_asymmetry < (prev?.gait_asymmetry ?? 999) ? 'down' : 'up',
      trendPct: pctChange(latest.gait_asymmetry, prev?.gait_asymmetry ?? latest.gait_asymmetry),
      trendNote: 'vs 7 days ago',
      description: 'Difference between left/right gait patterns. Lower = more symmetric.',
    },
    {
      title: 'Activity Duration',
      value: latest.activity_minutes,
      unit: 'min',
      icon: <Activity size={16} />,
      iconBg: 'bg-emerald-500',
      trend: latest.activity_minutes > (prev?.activity_minutes ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.activity_minutes, prev?.activity_minutes ?? latest.activity_minutes),
      trendNote: 'vs 7 days ago',
    },
    {
      title: 'Energy Harvested',
      value: latest.energy_harvested_mj.toFixed(2),
      unit: 'mJ',
      icon: <Zap size={16} />,
      iconBg: 'bg-yellow-500',
      trend: latest.energy_harvested_mj > (prev?.energy_harvested_mj ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.energy_harvested_mj, prev?.energy_harvested_mj ?? latest.energy_harvested_mj),
      trendNote: 'vs 7 days ago',
      description: 'Kinetic energy harvested from walking activity. Prototype value.',
    },
    {
      title: 'Data Completeness',
      value: latest.data_completeness.toFixed(1),
      unit: '%',
      icon: <Database size={16} />,
      iconBg: 'bg-slate-600',
      trend: latest.data_completeness > (prev?.data_completeness ?? 0) ? 'up' : 'down',
      trendPct: pctChange(latest.data_completeness, prev?.data_completeness ?? latest.data_completeness),
      trendNote: 'vs 7 days ago',
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="Rehabilitation Dashboard"
        subtitle={`Overview for Patient ${selectedPatient} — Demo Data Only — Not for Clinical Use`}
        icon={<Activity size={20} />}
      />

      {/* Demo disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
        <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-500" />
        <p className="text-xs leading-snug">
          <strong>Prototype / Research Dashboard.</strong> All displayed values are demonstration data only.
          This is not a medical diagnosis system and should not be used for clinical decision-making.
          No real patient data is used.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} trend={kpi.trend as 'up' | 'down'} isDemo />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Steps trend */}
        <Card title="Steps Over Time" subtitle="Last 14 days (Demo Data)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={45} />
              <Tooltip formatter={(v: unknown) => [formatNumber(v as number), 'Steps']} />
              <Area type="monotone" dataKey="steps" stroke="#14b8a6" fill="url(#stepsGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Gait speed trend */}
        <Card title="Gait Speed Over Time" subtitle="Last 14 days (Demo Data)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={45} domain={['auto', 'auto']} />
              <Tooltip formatter={(v: unknown) => [`${v} m/s`, 'Gait Speed']} />
              <Line type="monotone" dataKey="speed" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Energy trend */}
        <Card title="Energy Harvested Over Time" subtitle="Last 14 days — Prototype values">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={45} />
              <Tooltip formatter={(v: unknown) => [`${v} mJ`, 'Energy']} />
              <Area type="monotone" dataKey="energy" stroke="#eab308" fill="url(#energyGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Data completeness */}
        <Card title="Data Completeness" subtitle="Last 14 days — Sensor data quality">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={45} domain={[70, 100]} />
              <Tooltip formatter={(v: unknown) => [`${v}%`, 'Completeness']} />
              <Line type="monotone" dataKey="completeness" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card title="System Alerts" subtitle="Device & data status — not medical alerts">
          <div className="space-y-2">
            {alerts.map((a) => <AlertCard key={a.id} alert={a} />)}
          </div>
        </Card>
      )}
    </div>
  );
}
