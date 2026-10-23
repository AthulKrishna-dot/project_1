"""
backend/main.py
===============
FastAPI backend for the Smart Rehabilitation Analytics Dashboard.

Currently serves demo CSV data.
Architecture is ready for:
  - Live ESP32 sensor data ingestion (POST /api/sensor-data)
  - Database replacement (swap CSV reads with SQLAlchemy queries)
  - Local SLM summary generation

Run with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import os
import io
import json
from datetime import datetime

# ── App setup ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Rehabilitation Analytics API",
    description="Backend API for the Smart Rehabilitation Analytics Dashboard. "
                "Currently serves demo CSV data. Designed for ESP32 integration.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Data loading ───────────────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CSV_PATH = os.path.join(DATA_DIR, "rehabilitation_data.csv")


def load_data() -> pd.DataFrame:
    """Load demo CSV data. Replace this function body to use a database."""
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Demo data not found at {CSV_PATH}. Run generate_data.py first.")
    df = pd.read_csv(CSV_PATH)
    df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
    return df


# ── Pydantic models ────────────────────────────────────────────────────────

class ESP32SensorPayload(BaseModel):
    """
    Schema for real-time sensor data from an ESP32 smart insole.
    POST /api/sensor-data will accept this payload in Phase 4.
    """
    patient_id: str
    timestamp: str
    steps: int
    distance_km: float
    gait_speed: float
    stride_length_cm: float
    gait_asymmetry: float
    activity_minutes: int
    energy_harvested_mj: float
    energy_stored_mj: float


class DailySummaryRequest(BaseModel):
    patient_id: str
    language: str = "en"
    date_from: Optional[str] = None
    date_to: Optional[str] = None


# ── Endpoints ──────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "app": "Smart Rehabilitation Analytics API",
        "version": "1.0.0",
        "mode": "demo",
        "docs": "/docs",
        "note": "All data is fictional demonstration data only.",
    }


@app.get("/api/data")
def get_all_data(
    patient_id: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """
    Return daily records, optionally filtered by patient and date range.
    Future: Replace load_data() with a database query.
    """
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    if patient_id:
        df = df[df["patient_id"] == patient_id]
    if date_from:
        df = df[df["date"] >= date_from]
    if date_to:
        df = df[df["date"] <= date_to]

    return df.to_dict(orient="records")


@app.get("/api/patients")
def get_patients():
    """Return list of patient IDs."""
    return {"patients": ["P001", "P002", "P003", "P004"]}


@app.get("/api/data/gait")
def get_gait_data(
    patient_id: str = Query(...),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """Return gait-specific columns for a patient."""
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    df = df[df["patient_id"] == patient_id]
    if date_from:
        df = df[df["date"] >= date_from]
    if date_to:
        df = df[df["date"] <= date_to]

    cols = ["patient_id", "date", "steps", "distance_km", "gait_speed",
            "stride_length_cm", "gait_asymmetry", "activity_minutes", "data_completeness"]
    return df[cols].to_dict(orient="records")


@app.get("/api/data/energy")
def get_energy_data(
    patient_id: str = Query(...),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """Return energy-specific columns for a patient."""
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    df = df[df["patient_id"] == patient_id]
    if date_from:
        df = df[df["date"] >= date_from]
    if date_to:
        df = df[df["date"] <= date_to]

    cols = ["patient_id", "date", "energy_harvested_mj", "energy_stored_mj", "energy_consumed_mj"]
    return df[cols].to_dict(orient="records")


@app.get("/api/data/patient-reports")
def get_patient_reports(
    patient_id: str = Query(...),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """Return patient-reported outcome columns."""
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    df = df[df["patient_id"] == patient_id]
    if date_from:
        df = df[df["date"] >= date_from]
    if date_to:
        df = df[df["date"] <= date_to]

    cols = ["patient_id", "date", "pain_score", "anxiety_score", "depression_score",
            "appetite_score", "sleep_score", "general_condition_score"]
    return df[cols].to_dict(orient="records")


@app.get("/api/data/quality")
def get_data_quality(patient_id: str = Query(...)):
    """Return data quality report for a patient."""
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    pdata = df[df["patient_id"] == patient_id]
    avg_completeness = float(pdata["data_completeness"].mean())
    missing_pct = round(100 - avg_completeness, 1)

    return {
        "patient_id": patient_id,
        "total_records": int(len(pdata)),
        "completeness": round(avg_completeness, 1),
        "missing_pct": missing_pct,
        "missing_records": int(len(pdata) * missing_pct / 100),
        "communication_status": "Demo",
        "last_data_received": "Demo mode — no live hardware",
        "device_uptime": "Demo mode",
        "sensor_errors": 0,
        "sensors": [
            {"name": f"Pressure Sensor {i}", "status": "Demo", "lastSeen": "N/A"}
            for i in range(1, 5)
        ] + [
            {"name": "Accelerometer (3-axis)", "status": "Demo", "lastSeen": "N/A"},
            {"name": "Energy Harvesting Sensor", "status": "Demo", "lastSeen": "N/A"},
        ],
        "note": "All statuses are prototype demonstration values.",
    }


@app.get("/api/data/export")
def export_csv(
    patient_id: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
):
    """Export filtered data as CSV download."""
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    if patient_id:
        df = df[df["patient_id"] == patient_id]
    if date_from:
        df = df[df["date"] >= date_from]
    if date_to:
        df = df[df["date"] <= date_to]

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)
    filename = f"rehab_demo_{patient_id or 'all'}_{datetime.now().strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


# ── Future ESP32 endpoint ──────────────────────────────────────────────────

# In-memory buffer for live sensor data (Phase 4 placeholder)
_live_sensor_buffer: List[dict] = []


@app.post("/api/sensor-data")
def receive_sensor_data(payload: ESP32SensorPayload):
    """
    Endpoint for ESP32 smart insole to POST real-time sensor data.
    Currently stores in an in-memory buffer (demo).
    Phase 4: Write to PostgreSQL/MySQL and trigger WebSocket update.
    """
    record = payload.model_dump()
    record["received_at"] = datetime.utcnow().isoformat()
    _live_sensor_buffer.append(record)
    # Keep last 1000 records in buffer
    if len(_live_sensor_buffer) > 1000:
        _live_sensor_buffer.pop(0)
    return {"status": "received", "record_id": len(_live_sensor_buffer), "note": "Demo buffer — not persisted"}


@app.get("/api/sensor-data/live")
def get_live_sensor_data(patient_id: Optional[str] = Query(None)):
    """Return buffered live sensor records."""
    data = _live_sensor_buffer
    if patient_id:
        data = [r for r in data if r.get("patient_id") == patient_id]
    return {"count": len(data), "records": data[-50:], "mode": "demo_buffer"}


# ── AI Summary endpoint ────────────────────────────────────────────────────

@app.post("/api/summary")
def generate_summary(req: DailySummaryRequest):
    """
    Generate a clinical summary.
    Phase 6: Replace the rule-based logic below with a local SLM call:
        response = requests.post("http://localhost:11434/api/generate",
            json={"model": "gemma2:2b", "prompt": build_prompt(data)})
    """
    try:
        df = load_data()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    pdata = df[df["patient_id"] == req.patient_id]
    if req.date_from:
        pdata = pdata[pdata["date"] >= req.date_from]
    if req.date_to:
        pdata = pdata[pdata["date"] <= req.date_to]

    if pdata.empty:
        return {"summary": "No data available for the selected patient and date range.", "is_demo": True}

    n = len(pdata)
    half = n // 2
    first = pdata.iloc[:half] if half > 0 else pdata
    second = pdata.iloc[half:]

    def trend_word(cur, prev):
        pct = (cur - prev) / (prev + 1e-9) * 100
        if pct > 3: return "increased"
        if pct < -3: return "decreased"
        return "remained stable"

    steps_trend = trend_word(second["steps"].mean(), first["steps"].mean())
    speed_trend = trend_word(second["gait_speed"].mean(), first["gait_speed"].mean())
    stride_trend = trend_word(second["stride_length_cm"].mean(), first["stride_length_cm"].mean())
    asym_trend = trend_word(second["gait_asymmetry"].mean(), first["gait_asymmetry"].mean())
    energy_trend = trend_word(second["energy_harvested_mj"].mean(), first["energy_harvested_mj"].mean())
    sleep_trend = trend_word(second["sleep_score"].mean(), first["sleep_score"].mean())
    cond_trend = trend_word(second["general_condition_score"].mean(), first["general_condition_score"].mean())

    summary = f"""[DEMO DATA — NOT FOR CLINICAL USE]

During the {n}-day monitoring period, the system recorded the following trends for Patient {req.patient_id}:

• Walking Activity: Step count has {steps_trend} over the observed period.
• Gait Speed: The measured gait speed has {speed_trend}.
• Stride Length: The measured stride length has {stride_trend}.
• Gait Asymmetry: The measured gait asymmetry has {asym_trend}.
• Energy Harvesting: Harvested energy has {energy_trend}, correlated with activity levels.
• Self-Reported Sleep: Sleep score has {sleep_trend}.
• Self-Reported General Condition: General condition score has {cond_trend}.

Note: This summary is generated by a prototype rule-based system using demonstration data.
It does not constitute a medical diagnosis or clinical assessment.
All values are demonstration data only.

Model: Rule-Based Demo (Local SLM planned for Phase 6)
Language: {req.language} (Full multilingual output planned for Phase 7)
"""

    return {
        "summary": summary,
        "language": req.language,
        "generated_at": datetime.utcnow().isoformat(),
        "model_used": "Rule-Based Demo (Local SLM — Planned Phase 6)",
        "is_demo": True,
    }
