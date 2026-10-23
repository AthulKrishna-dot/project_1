"""
generate_data.py
================
Generates realistic but entirely FICTIONAL demo data for the
Smart Rehabilitation Analytics Dashboard.

All patient identifiers (P001-P004) are invented.
No real patient information is used.
"""

import csv
import random
import math
import os
from datetime import datetime, timedelta

random.seed(42)

PATIENTS = ["P001", "P002", "P003", "P004"]
START_DATE = datetime(2026, 7, 1)
NUM_DAYS = 31

# Per-patient baseline profiles (fictional)
PROFILES = {
    "P001": {
        "steps_base": 6500, "speed_base": 1.02, "stride_base": 100,
        "asym_base": 7.0, "activity_base": 48, "energy_base": 13.0,
        "pain_base": 40, "anxiety_base": 45, "depression_base": 30,
        "appetite_base": 70, "sleep_base": 65, "condition_base": 68,
        "trend": 1.015,  # improving daily
    },
    "P002": {
        "steps_base": 5000, "speed_base": 0.90, "stride_base": 94,
        "asym_base": 9.5, "activity_base": 38, "energy_base": 10.5,
        "pain_base": 55, "anxiety_base": 50, "depression_base": 40,
        "appetite_base": 62, "sleep_base": 58, "condition_base": 60,
        "trend": 1.012,
    },
    "P003": {
        "steps_base": 8000, "speed_base": 1.15, "stride_base": 108,
        "asym_base": 5.0, "activity_base": 60, "energy_base": 16.0,
        "pain_base": 25, "anxiety_base": 35, "depression_base": 20,
        "appetite_base": 80, "sleep_base": 75, "condition_base": 78,
        "trend": 1.010,
    },
    "P004": {
        "steps_base": 4200, "speed_base": 0.82, "stride_base": 88,
        "asym_base": 12.0, "activity_base": 30, "energy_base": 8.5,
        "pain_base": 65, "anxiety_base": 60, "depression_base": 50,
        "appetite_base": 55, "sleep_base": 50, "condition_base": 52,
        "trend": 1.018,
    },
}

def jitter(value, pct=0.05):
    """Add realistic random noise to a value."""
    return value * (1 + random.uniform(-pct, pct))

def clamp(value, lo, hi):
    return max(lo, min(hi, value))

def generate_daily_data():
    rows = []
    for patient_id in PATIENTS:
        p = PROFILES[patient_id]
        for day_offset in range(NUM_DAYS):
            date = START_DATE + timedelta(days=day_offset)
            trend = p["trend"] ** day_offset  # cumulative improvement factor

            # Weekend dip
            day_of_week = date.weekday()
            weekend_factor = 0.85 if day_of_week >= 5 else 1.0

            # Occasional bad day
            bad_day = 0.80 if random.random() < 0.08 else 1.0

            factor = trend * weekend_factor * bad_day

            steps = clamp(int(jitter(p["steps_base"] * factor)), 1000, 15000)
            distance_km = round(jitter(steps * 0.0006 * factor), 2)
            gait_speed = round(clamp(jitter(p["speed_base"] * factor), 0.5, 2.0), 2)
            stride_length_cm = round(clamp(jitter(p["stride_base"] * factor), 60, 150), 1)
            gait_asymmetry = round(clamp(jitter(p["asym_base"] / trend, 0.08), 1.0, 25.0), 1)
            activity_minutes = clamp(int(jitter(p["activity_base"] * factor)), 5, 120)
            energy_harvested_mj = round(clamp(jitter(p["energy_base"] * factor), 2.0, 30.0), 2)
            energy_stored_mj = round(energy_harvested_mj * random.uniform(0.55, 0.75), 2)
            energy_consumed_mj = round(energy_harvested_mj * random.uniform(0.20, 0.40), 2)
            data_completeness = round(clamp(random.gauss(96, 3), 75, 100), 1)

            # Patient-reported scores (0-100 scale)
            # Pain and anxiety trend downward (improving), others trend upward
            pain = round(clamp(jitter(p["pain_base"] / trend, 0.08), 0, 100), 1)
            anxiety = round(clamp(jitter(p["anxiety_base"] / trend, 0.08), 0, 100), 1)
            depression = round(clamp(jitter(p["depression_base"] / trend, 0.08), 0, 100), 1)
            appetite = round(clamp(jitter(p["appetite_base"] * (trend ** 0.5), 0.07), 0, 100), 1)
            sleep_score = round(clamp(jitter(p["sleep_base"] * (trend ** 0.5), 0.07), 0, 100), 1)
            general_condition = round(clamp(jitter(p["condition_base"] * (trend ** 0.5), 0.07), 0, 100), 1)

            rows.append({
                "patient_id": patient_id,
                "date": date.strftime("%Y-%m-%d"),
                "steps": steps,
                "distance_km": distance_km,
                "gait_speed": gait_speed,
                "stride_length_cm": stride_length_cm,
                "gait_asymmetry": gait_asymmetry,
                "activity_minutes": activity_minutes,
                "energy_harvested_mj": energy_harvested_mj,
                "energy_stored_mj": energy_stored_mj,
                "energy_consumed_mj": energy_consumed_mj,
                "data_completeness": data_completeness,
                "pain_score": pain,
                "anxiety_score": anxiety,
                "depression_score": depression,
                "appetite_score": appetite,
                "sleep_score": sleep_score,
                "general_condition_score": general_condition,
            })
    return rows

def generate_intraday_data():
    """Generate hourly data rows for realistic intraday chart support."""
    rows = []
    for patient_id in PATIENTS:
        p = PROFILES[patient_id]
        for day_offset in range(7):  # Last 7 days of intraday
            date = START_DATE + timedelta(days=NUM_DAYS - 7 + day_offset)
            active_hours = random.sample(range(7, 21), 6)  # 6 active hours per day
            for hour in active_hours:
                ts = datetime(date.year, date.month, date.day, hour,
                              random.randint(0, 59), random.randint(0, 59))
                steps_hr = random.randint(200, 1800)
                speed = round(random.uniform(0.7, 1.4), 2)
                energy = round(random.uniform(0.5, 3.0), 2)
                rows.append({
                    "patient_id": patient_id,
                    "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%S"),
                    "steps_interval": steps_hr,
                    "gait_speed_interval": speed,
                    "energy_interval_mj": energy,
                })
    return rows

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(out_dir, exist_ok=True)

    # Daily data
    daily_rows = generate_daily_data()
    daily_path = os.path.join(out_dir, "rehabilitation_data.csv")
    fieldnames = list(daily_rows[0].keys())
    with open(daily_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(daily_rows)
    print(f"[OK] Generated {len(daily_rows)} daily rows -> {daily_path}")

    # Intraday data
    intraday_rows = generate_intraday_data()
    intraday_path = os.path.join(out_dir, "intraday_data.csv")
    with open(intraday_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(intraday_rows[0].keys()))
        writer.writeheader()
        writer.writerows(intraday_rows)
    print(f"[OK] Generated {len(intraday_rows)} intraday rows -> {intraday_path}")
    print("Data generation complete. All data is fictional/demo only.")
