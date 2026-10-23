// types/index.ts
// All TypeScript types for the Smart Rehabilitation Analytics Dashboard

export type PatientId = 'P001' | 'P002' | 'P003' | 'P004';

export interface DailyRecord {
  patient_id: PatientId;
  date: string; // YYYY-MM-DD
  steps: number;
  distance_km: number;
  gait_speed: number;
  stride_length_cm: number;
  gait_asymmetry: number;
  activity_minutes: number;
  energy_harvested_mj: number;
  energy_stored_mj: number;
  energy_consumed_mj: number;
  data_completeness: number;
  pain_score: number;
  anxiety_score: number;
  depression_score: number;
  appetite_score: number;
  sleep_score: number;
  general_condition_score: number;
}

export interface IntradayRecord {
  patient_id: PatientId;
  timestamp: string; // ISO 8601
  steps_interval: number;
  gait_speed_interval: number;
  energy_interval_mj: number;
}

export interface PatientSummary {
  patient_id: PatientId;
  name: string; // Fictional alias
  age: number;
  diagnosis: string; // Generic rehab category
  admission_date: string;
  assigned_clinician: string;
}

export interface KPIValue {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPct?: number;
  description?: string;
}

export interface GaitTrend {
  parameter: string;
  current: number;
  previous: number;
  unit: string;
  changePct: number;
  direction: 'increased' | 'decreased' | 'stable';
}

export interface EnergyStatus {
  label: 'Good' | 'Moderate' | 'Low';
  color: 'green' | 'yellow' | 'red';
  threshold: string;
}

export interface SensorStatus {
  name: string;
  status: 'Online' | 'Offline' | 'Warning';
  lastSeen: string;
}

export interface DataQualityReport {
  completeness: number;
  missing_pct: number;
  total_records: number;
  missing_records: number;
  communication_status: 'Connected' | 'Disconnected' | 'Demo';
  last_data_received: string;
  device_uptime: string;
  sensor_errors: number;
  sensors: SensorStatus[];
}

export interface AISummaryInput {
  patient_id: PatientId;
  date_range: { from: string; to: string };
  records: DailyRecord[];
  language: SupportedLanguage;
}

export type SupportedLanguage = 'en' | 'ta' | 'ml' | 'hi';

export interface AISummaryOutput {
  summary: string;
  language: SupportedLanguage;
  generated_at: string;
  model_used: string;
  is_demo: boolean;
}

// Future ESP32 sensor data schema
export interface ESP32SensorPayload {
  patient_id: PatientId;
  timestamp: string;
  steps: number;
  distance_km: number;
  gait_speed: number;
  stride_length_cm: number;
  gait_asymmetry: number;
  activity_minutes: number;
  energy_harvested_mj: number;
  energy_stored_mj: number;
}

export interface Alert {
  id: string;
  type: 'data_quality' | 'energy' | 'communication' | 'info';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
}

export interface AppState {
  selectedPatient: PatientId;
  selectedDate: string;
  dateRange: { from: string; to: string };
  isHardwareConnected: boolean;
  dataMode: 'demo' | 'live';
}
