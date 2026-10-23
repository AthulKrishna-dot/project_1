// utils/csvExport.ts
// CSV export utilities for patient data and analytics reports.

import type { DailyRecord } from '../types';

/** Convert an array of objects to a CSV string. */
function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => {
        const v = r[h];
        // Wrap strings that may contain commas
        if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
        return v ?? '';
      }).join(',')
    ),
  ];
  return lines.join('\n');
}

/** Trigger a CSV file download in the browser. */
function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Export filtered daily records as CSV. */
export function exportDailyData(records: DailyRecord[], filename?: string): void {
  const rows = records.map((r) => ({
    patient_id: r.patient_id,
    date: r.date,
    steps: r.steps,
    distance_km: r.distance_km,
    gait_speed: r.gait_speed,
    stride_length_cm: r.stride_length_cm,
    gait_asymmetry: r.gait_asymmetry,
    activity_minutes: r.activity_minutes,
    energy_harvested_mj: r.energy_harvested_mj,
    energy_stored_mj: r.energy_stored_mj,
    energy_consumed_mj: r.energy_consumed_mj,
    data_completeness: r.data_completeness,
    pain_score: r.pain_score,
    anxiety_score: r.anxiety_score,
    depression_score: r.depression_score,
    appetite_score: r.appetite_score,
    sleep_score: r.sleep_score,
    general_condition_score: r.general_condition_score,
  }));

  const csv = toCSV(rows as Record<string, unknown>[]);
  const name = filename ?? `rehab_data_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, name);
}

/** Export an AI summary as a text file. */
export function exportSummaryText(summary: string, patientId: string, language: string): void {
  const header = [
    '==============================================================',
    '  Smart Rehabilitation Analytics — Demo Report',
    '  DISCLAIMER: This is demonstration data only.',
    '  NOT for clinical use. Not a medical diagnosis.',
    '==============================================================',
    `  Patient: ${patientId}`,
    `  Language: ${language}`,
    `  Generated: ${new Date().toLocaleString()}`,
    '==============================================================',
    '',
  ].join('\n');

  const blob = new Blob([header + summary], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rehab_summary_${patientId}_${Date.now()}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
