// pages/Settings.tsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Cpu, Database, Wifi, Zap, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';

const ROADMAP = [
  { phase: 'Phase 1', title: 'Dashboard + Sample Data', status: 'done', desc: 'Fully functional dashboard with demo CSV data, all 8 navigation pages, KPI cards, charts.' },
  { phase: 'Phase 2', title: 'Advanced Gait Analytics', status: 'done', desc: 'Detailed gait parameter analysis, trend detection, current vs previous period comparison.' },
  { phase: 'Phase 3', title: 'Energy Analytics', status: 'done', desc: 'Energy harvesting visualization, power balance charts, prototype thresholds.' },
  { phase: 'Phase 4', title: 'ESP32 Smart-Insole Integration', status: 'planned', desc: 'Connect physical ESP32 hardware. POST /api/sensor-data endpoint ready for integration.' },
  { phase: 'Phase 5', title: 'Database + Real-Time Data', status: 'planned', desc: 'Replace CSV with PostgreSQL/MySQL. Real-time data streaming from edge device.' },
  { phase: 'Phase 6', title: 'Local SLM Integration', status: 'planned', desc: 'Replace rule-based summary with quantized local language model (Gemma-2B / Phi-3-mini via Ollama).' },
  { phase: 'Phase 7', title: 'Multilingual Clinical Summarization', status: 'planned', desc: 'Full Tamil, Malayalam, Hindi output via on-device SLM. No cloud API required.' },
  { phase: 'Phase 8', title: 'Prototype Evaluation', status: 'planned', desc: 'Clinical usability study, gait accuracy benchmarking, energy efficiency evaluation.' },
];

const EVAL_METRICS = [
  { label: 'Gait Measurement Accuracy', unit: '% agreement with reference', note: 'To be evaluated in Phase 8' },
  { label: 'Energy Harvested per Activity Session', unit: 'mJ / session', note: 'Prototype baseline: ~13 mJ (demo)' },
  { label: 'Device Uptime', unit: '%', note: 'Target: >98% during monitoring period' },
  { label: 'Communication Reliability', unit: '% packets received', note: 'Wi-Fi / BLE target: >99%' },
  { label: 'AI Summary Latency', unit: 'ms', note: 'Target: <3000 ms on ESP32-S3 with 4-bit quant SLM' },
  { label: 'System Usability Scale (SUS)', unit: '/100', note: 'Target: >70 (clinician usability study)' },
];

export default function Settings() {
  const [showHardwareMsg, setShowHardwareMsg] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Information"
        subtitle="Project configuration, roadmap, and hardware integration status"
        icon={<SettingsIcon size={20} />}
      />

      {/* System info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="System Information">
          <div className="space-y-3">
            {[
              { label: 'Project', value: 'Smart Rehabilitation Analytics' },
              { label: 'Project Type', value: 'Edge-AI + IoT Rehabilitation Monitoring' },
              { label: 'Current Mode', value: 'Demo Data' },
              { label: 'Hardware', value: 'Smart Insole — Planned Integration' },
              { label: 'AI', value: 'Local SLM — Planned Integration' },
              { label: 'Database', value: 'CSV Demo / Database Ready' },
              { label: 'Communication', value: 'API Ready (POST /api/sensor-data)' },
              { label: 'Version', value: 'Prototype v1.0' },
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-50 last:border-0">
                <p className="text-xs font-semibold text-slate-500">{row.label}</p>
                <p className="text-xs text-slate-700 text-right">{row.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Technology Stack">
          <div className="space-y-2">
            {[
              { icon: '⚛️', label: 'Frontend', value: 'React 18 + TypeScript + Vite' },
              { icon: '🎨', label: 'Styling', value: 'Tailwind CSS v3' },
              { icon: '📊', label: 'Charts', value: 'Recharts' },
              { icon: '🐍', label: 'Backend', value: 'Python 3 + FastAPI + Pandas' },
              { icon: '💾', label: 'Data (v1)', value: 'CSV / JSON demo files' },
              { icon: '🗄️', label: 'Database (planned)', value: 'PostgreSQL / MySQL' },
              { icon: '🤖', label: 'AI (v1)', value: 'Rule-based mock summary' },
              { icon: '🧠', label: 'AI (planned)', value: 'Local SLM (Gemma / Phi-3)' },
              { icon: '🔌', label: 'Hardware (planned)', value: 'ESP32 + Smart Insole' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-base shrink-0">{row.icon}</span>
                <p className="text-xs font-semibold text-slate-500 w-28 shrink-0">{row.label}</p>
                <p className="text-xs text-slate-700">{row.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Hardware connection */}
      <Card title="Hardware Connection" subtitle="ESP32 Smart Insole integration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[
              { label: 'Status', value: 'Demo Mode', badge: <StatusBadge status="Demo" size="md" /> },
              { label: 'Connection', value: 'Not Connected', badge: <StatusBadge status="Disconnected" size="md" /> },
              { label: 'Device', value: 'ESP32 Smart Insole' },
              { label: 'Communication', value: 'Wi-Fi / BLE' },
              { label: 'API Endpoint', value: 'POST /api/sensor-data' },
              { label: 'API Status', value: 'Ready for Integration' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-50 last:border-0">
                <p className="text-xs font-semibold text-slate-500">{row.label}</p>
                {row.badge ?? <p className="text-xs text-slate-700">{row.value}</p>}
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Wifi size={13} /> Future ESP32 Payload Schema
            </p>
            <pre className="text-[10px] text-slate-600 leading-relaxed overflow-x-auto">{`POST /api/sensor-data
{
  "patient_id": "P001",
  "timestamp": "2026-08-26T10:32:14",
  "steps": 120,
  "distance_km": 0.08,
  "gait_speed": 1.04,
  "stride_length_cm": 102,
  "gait_asymmetry": 6.5,
  "activity_minutes": 5,
  "energy_harvested_mj": 1.8,
  "energy_stored_mj": 12.4
}`}</pre>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowHardwareMsg(true)}
            className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            Switch to Hardware Data
          </button>
          {showHardwareMsg && (
            <p className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              ℹ️ Hardware integration will be enabled in Phase 4 of development. The API endpoint
              <code className="mx-1 px-1 py-0.5 bg-slate-100 rounded text-[10px]">POST /api/sensor-data</code>
              is already implemented in the FastAPI backend and ready to receive ESP32 payloads.
            </p>
          )}
        </div>
      </Card>

      {/* Privacy note */}
      <Card title="Privacy & Data Notice">
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>• All demo patients (P001–P004) are entirely <strong>fictional</strong>. No real patient data is used.</p>
          <p>• The system is designed so raw sensitive data can remain within the hospital/edge environment.</p>
          <p>• Authenticated access control is planned for Phase 5 (database integration).</p>
          <p>• This prototype has <strong>NOT</strong> been audited for HIPAA or GDPR compliance.</p>
          <p>• Do not enter real patient data into this prototype system.</p>
        </div>
      </Card>

      {/* Development Roadmap */}
      <Card title="Project Development Roadmap">
        <div className="space-y-3">
          {ROADMAP.map((item) => (
            <div key={item.phase} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.status === 'done' ? 'bg-teal-500' : 'bg-slate-200'}`}>
                  {item.status === 'done' ? <CheckCircle size={16} className="text-white" /> : <Clock size={14} className="text-slate-400" />}
                </div>
                <div className="w-0.5 flex-1 bg-slate-100 mt-1 mb-0" />
              </div>
              <div className="pb-4 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.phase}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${item.status === 'done' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.status === 'done' ? 'Complete' : 'Planned'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Evaluation metrics */}
      <Card title="Future Evaluation Metrics" subtitle="Planned assessment for Phase 8 — not current results">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EVAL_METRICS.map((m) => (
            <div key={m.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs font-bold text-slate-700">{m.label}</p>
              <p className="text-[10px] text-teal-600 font-medium mt-0.5">{m.unit}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{m.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
