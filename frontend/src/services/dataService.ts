// services/dataService.ts
// Data abstraction layer.
// Currently loads demo/CSV data.
// To switch to live API: replace each function body with an API call.

import type { DailyRecord, PatientId, DataQualityReport, SensorStatus } from '../types';
import { ALL_DEMO_DATA, PATIENT_PROFILES, getDemoDataForPatient } from '../data/sampleData';

// Base URL for the FastAPI backend (used in future live mode)
const API_BASE = 'http://localhost:8000/api';

// Whether to use live API or demo data
const USE_LIVE_API = false; // Set to true when hardware is connected

/** Fetch all daily records for all patients. */
export async function getAllData(): Promise<DailyRecord[]> {
  if (USE_LIVE_API) {
    const resp = await fetch(`${API_BASE}/data`);
    if (!resp.ok) throw new Error('API unavailable');
    return resp.json();
  }
  return ALL_DEMO_DATA;
}

/** Fetch daily records for a specific patient. */
export async function getPatientData(patientId: PatientId): Promise<DailyRecord[]> {
  if (USE_LIVE_API) {
    const resp = await fetch(`${API_BASE}/data?patient_id=${patientId}`);
    if (!resp.ok) throw new Error('API unavailable');
    return resp.json();
  }
  return getDemoDataForPatient(patientId);
}

/** Fetch records filtered by patient and date range. */
export async function getDailyData(
  patientId: PatientId,
  from: string,
  to: string,
): Promise<DailyRecord[]> {
  const records = await getPatientData(patientId);
  return records.filter((r) => r.date >= from && r.date <= to);
}

/** Fetch gait-specific data for a patient. */
export async function getGaitData(
  patientId: PatientId,
  from?: string,
  to?: string,
): Promise<DailyRecord[]> {
  const records = await getPatientData(patientId);
  if (from && to) return records.filter((r) => r.date >= from && r.date <= to);
  return records;
}

/** Fetch energy-specific data for a patient. */
export async function getEnergyData(
  patientId: PatientId,
  from?: string,
  to?: string,
): Promise<Pick<DailyRecord, 'date' | 'energy_harvested_mj' | 'energy_stored_mj' | 'energy_consumed_mj' | 'patient_id'>[]> {
  const records = await getPatientData(patientId);
  const filtered = from && to ? records.filter((r) => r.date >= from && r.date <= to) : records;
  return filtered.map(({ date, energy_harvested_mj, energy_stored_mj, energy_consumed_mj, patient_id }) => ({
    date,
    energy_harvested_mj,
    energy_stored_mj,
    energy_consumed_mj,
    patient_id,
  }));
}

/** Fetch patient-reported outcome data. */
export async function getPatientReports(
  patientId: PatientId,
  from?: string,
  to?: string,
): Promise<Pick<DailyRecord, 'date' | 'pain_score' | 'anxiety_score' | 'depression_score' | 'appetite_score' | 'sleep_score' | 'general_condition_score' | 'patient_id'>[]> {
  const records = await getPatientData(patientId);
  const filtered = from && to ? records.filter((r) => r.date >= from && r.date <= to) : records;
  return filtered.map(({ date, pain_score, anxiety_score, depression_score, appetite_score, sleep_score, general_condition_score, patient_id }) => ({
    date,
    pain_score,
    anxiety_score,
    depression_score,
    appetite_score,
    sleep_score,
    general_condition_score,
    patient_id,
  }));
}

/** Return mock data quality report (always demo in v1). */
export async function getDataQuality(patientId: PatientId): Promise<DataQualityReport> {
  const records = await getPatientData(patientId);
  const avgCompleteness =
    records.reduce((sum, r) => sum + r.data_completeness, 0) / records.length;

  const sensors: SensorStatus[] = [
    { name: 'Pressure Sensor 1', status: 'Online', lastSeen: '10:32:14' },
    { name: 'Pressure Sensor 2', status: 'Online', lastSeen: '10:32:14' },
    { name: 'Pressure Sensor 3', status: 'Online', lastSeen: '10:32:14' },
    { name: 'Pressure Sensor 4', status: 'Online', lastSeen: '10:32:14' },
    { name: 'Accelerometer (3-axis)', status: 'Online', lastSeen: '10:32:14' },
    { name: 'Energy Harvesting Sensor', status: 'Online', lastSeen: '10:32:14' },
  ];

  return {
    completeness: parseFloat(avgCompleteness.toFixed(1)),
    missing_pct: parseFloat((100 - avgCompleteness).toFixed(1)),
    total_records: records.length,
    missing_records: Math.round(records.length * ((100 - avgCompleteness) / 100)),
    communication_status: 'Demo',
    last_data_received: '10:32:14 AM (Demo)',
    device_uptime: '18 h 42 min (Demo)',
    sensor_errors: 0,
    sensors,
  };
}

/** Get patient profile info. */
export function getPatientProfile(patientId: PatientId) {
  return PATIENT_PROFILES.find((p) => p.patient_id === patientId) ?? PATIENT_PROFILES[0];
}

export { PATIENT_PROFILES };
