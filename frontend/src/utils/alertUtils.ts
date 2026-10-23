// utils/alertUtils.ts
// Generate non-diagnostic device/data alerts based on recorded metrics.
// These alerts concern device status, data quality, and energy thresholds only.
// They are NOT medical alerts or diagnoses.

import type { Alert, DailyRecord } from '../types';

let alertIdCounter = 0;
function makeId() {
  return `alert-${++alertIdCounter}`;
}

export function generateAlerts(records: DailyRecord[]): Alert[] {
  if (!records.length) return [];
  const latest = records[records.length - 1];
  const alerts: Alert[] = [];

  // Data quality alert
  if (latest.data_completeness < 90) {
    alerts.push({
      id: makeId(),
      type: 'data_quality',
      severity: latest.data_completeness < 80 ? 'critical' : 'warning',
      title: 'Data Quality Notice',
      message: `Data completeness is ${latest.data_completeness}% for the most recent record. Some sensor readings may be missing.`,
      timestamp: latest.date,
    });
  }

  // Energy alert (prototype threshold — NOT a medical threshold)
  if (latest.energy_harvested_mj < 8) {
    alerts.push({
      id: makeId(),
      type: 'energy',
      severity: 'warning',
      title: 'Energy Harvesting Notice',
      message: `Energy harvested (${latest.energy_harvested_mj} mJ) is below the prototype reference threshold (8 mJ). This may indicate low activity or a sensor issue.`,
      timestamp: latest.date,
    });
  }

  // Demo mode info
  alerts.push({
    id: makeId(),
    type: 'info',
    severity: 'info',
    title: 'Demo Mode Active',
    message: 'The dashboard is currently using demonstration data. Hardware integration is planned for a future development phase.',
    timestamp: latest.date,
  });

  return alerts;
}

export function alertSeverityColor(severity: Alert['severity']): string {
  return {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  }[severity];
}

export function alertIconColor(severity: Alert['severity']): string {
  return {
    info: 'text-blue-500',
    warning: 'text-amber-500',
    critical: 'text-red-500',
  }[severity];
}
