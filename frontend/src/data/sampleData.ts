// data/sampleData.ts
// Static fallback demo data used when the backend API is unavailable.
// All patient identifiers are entirely fictional — no real patient data.

import type { DailyRecord, PatientSummary, PatientId } from '../types';

export const PATIENT_PROFILES: PatientSummary[] = [
  {
    patient_id: 'P001',
    name: 'Demo Patient A',
    age: 58,
    diagnosis: 'Post-surgical lower-limb rehabilitation',
    admission_date: '2026-06-15',
    assigned_clinician: 'Dr. Sample (Demo)',
  },
  {
    patient_id: 'P002',
    name: 'Demo Patient B',
    age: 45,
    diagnosis: 'Stroke rehabilitation — gait re-training',
    admission_date: '2026-06-20',
    assigned_clinician: 'Dr. Sample (Demo)',
  },
  {
    patient_id: 'P003',
    name: 'Demo Patient C',
    age: 34,
    diagnosis: 'Orthopedic recovery — knee replacement',
    admission_date: '2026-06-10',
    assigned_clinician: 'Dr. Sample (Demo)',
  },
  {
    patient_id: 'P004',
    name: 'Demo Patient D',
    age: 67,
    diagnosis: 'Neurological rehabilitation — balance training',
    admission_date: '2026-06-25',
    assigned_clinician: 'Dr. Sample (Demo)',
  },
];

// Seeded pseudo-random for reproducible demo data
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function jitter(v: number, pct: number, rand: () => number) {
  return v * (1 + (rand() - 0.5) * 2 * pct);
}

const PROFILES: Record<
  PatientId,
  {
    steps_base: number;
    speed_base: number;
    stride_base: number;
    asym_base: number;
    activity_base: number;
    energy_base: number;
    pain_base: number;
    anxiety_base: number;
    depression_base: number;
    appetite_base: number;
    sleep_base: number;
    condition_base: number;
    trend: number;
    seed: number;
  }
> = {
  P001: {
    steps_base: 6500, speed_base: 1.02, stride_base: 100, asym_base: 7.0,
    activity_base: 48, energy_base: 13.0, pain_base: 40, anxiety_base: 45,
    depression_base: 30, appetite_base: 70, sleep_base: 65, condition_base: 68,
    trend: 1.015, seed: 42,
  },
  P002: {
    steps_base: 5000, speed_base: 0.90, stride_base: 94, asym_base: 9.5,
    activity_base: 38, energy_base: 10.5, pain_base: 55, anxiety_base: 50,
    depression_base: 40, appetite_base: 62, sleep_base: 58, condition_base: 60,
    trend: 1.012, seed: 137,
  },
  P003: {
    steps_base: 8000, speed_base: 1.15, stride_base: 108, asym_base: 5.0,
    activity_base: 60, energy_base: 16.0, pain_base: 25, anxiety_base: 35,
    depression_base: 20, appetite_base: 80, sleep_base: 75, condition_base: 78,
    trend: 1.010, seed: 789,
  },
  P004: {
    steps_base: 4200, speed_base: 0.82, stride_base: 88, asym_base: 12.0,
    activity_base: 30, energy_base: 8.5, pain_base: 65, anxiety_base: 60,
    depression_base: 50, appetite_base: 55, sleep_base: 50, condition_base: 52,
    trend: 1.018, seed: 1023,
  },
};

const START_DATE = new Date('2026-07-01');

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function generatePatientData(patientId: PatientId): DailyRecord[] {
  const p = PROFILES[patientId];
  const rand = seededRandom(p.seed);
  const records: DailyRecord[] = [];

  for (let day = 0; day < 31; day++) {
    const date = addDays(START_DATE, day);
    const trend = Math.pow(p.trend, day);
    const weekday = date.getDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.85 : 1.0;
    const badDay = rand() < 0.08 ? 0.80 : 1.0;
    const factor = trend * weekendFactor * badDay;

    const steps = clamp(Math.round(jitter(p.steps_base * factor, 0.06, rand)), 1000, 15000);
    const distance_km = parseFloat(clamp(jitter(steps * 0.00062 * factor, 0.05, rand), 0.3, 12).toFixed(2));
    const gait_speed = parseFloat(clamp(jitter(p.speed_base * factor, 0.05, rand), 0.4, 2.0).toFixed(2));
    const stride_length_cm = parseFloat(clamp(jitter(p.stride_base * factor, 0.05, rand), 55, 155).toFixed(1));
    const gait_asymmetry = parseFloat(clamp(jitter(p.asym_base / trend, 0.08, rand), 1.0, 25.0).toFixed(1));
    const activity_minutes = clamp(Math.round(jitter(p.activity_base * factor, 0.06, rand)), 5, 120);
    const energy_harvested_mj = parseFloat(clamp(jitter(p.energy_base * factor, 0.08, rand), 2.0, 30.0).toFixed(2));
    const energy_stored_mj = parseFloat((energy_harvested_mj * (0.55 + rand() * 0.20)).toFixed(2));
    const energy_consumed_mj = parseFloat((energy_harvested_mj * (0.20 + rand() * 0.20)).toFixed(2));
    const data_completeness = parseFloat(clamp(92 + (rand() - 0.5) * 10, 72, 100).toFixed(1));

    const pain_score = parseFloat(clamp(jitter(p.pain_base / trend, 0.09, rand), 0, 100).toFixed(1));
    const anxiety_score = parseFloat(clamp(jitter(p.anxiety_base / trend, 0.09, rand), 0, 100).toFixed(1));
    const depression_score = parseFloat(clamp(jitter(p.depression_base / trend, 0.09, rand), 0, 100).toFixed(1));
    const appetite_score = parseFloat(clamp(jitter(p.appetite_base * Math.pow(trend, 0.5), 0.07, rand), 0, 100).toFixed(1));
    const sleep_score = parseFloat(clamp(jitter(p.sleep_base * Math.pow(trend, 0.5), 0.07, rand), 0, 100).toFixed(1));
    const general_condition_score = parseFloat(clamp(jitter(p.condition_base * Math.pow(trend, 0.5), 0.07, rand), 0, 100).toFixed(1));

    records.push({
      patient_id: patientId,
      date: formatDate(date),
      steps,
      distance_km,
      gait_speed,
      stride_length_cm,
      gait_asymmetry,
      activity_minutes,
      energy_harvested_mj,
      energy_stored_mj,
      energy_consumed_mj,
      data_completeness,
      pain_score,
      anxiety_score,
      depression_score,
      appetite_score,
      sleep_score,
      general_condition_score,
    });
  }
  return records;
}

// Pre-generate all demo data
export const ALL_DEMO_DATA: DailyRecord[] = [
  ...generatePatientData('P001'),
  ...generatePatientData('P002'),
  ...generatePatientData('P003'),
  ...generatePatientData('P004'),
];

export function getDemoDataForPatient(patientId: PatientId): DailyRecord[] {
  return ALL_DEMO_DATA.filter((r) => r.patient_id === patientId);
}

export function getLatestRecord(patientId: PatientId): DailyRecord | undefined {
  const records = getDemoDataForPatient(patientId);
  return records[records.length - 1];
}

export function getPreviousRecord(patientId: PatientId): DailyRecord | undefined {
  const records = getDemoDataForPatient(patientId);
  return records[records.length - 8]; // ~1 week ago
}
