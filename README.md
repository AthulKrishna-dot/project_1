# Smart Rehabilitation Analytics Dashboard

> **Prototype v1.0 — Demo Data Only — Not for Clinical Use**

A complete, modular, professional web dashboard for an ECE final-year project:

**"Self-Powered, Edge-AI Rehabilitation Companion: Kinetic-Energy-Harvesting Smart Insole with an On-Device Local Language Model for Multilingual Clinical Summarization"**

---

## Project Purpose

This dashboard is designed to help clinicians and researchers monitor rehabilitation patients using:
- Smart-insole gait data
- Activity information
- Patient-reported outcome measures
- Energy-harvesting metrics

All current data is **fictional demonstration data only**. The architecture is designed so that demo data can be seamlessly replaced with real ESP32 hardware data without rebuilding the frontend.

---

## Features

| Feature | Status |
|---------|--------|
| Dashboard with 8 KPI cards | ✅ Phase 1 |
| Daily analytics (table + 6 charts) | ✅ Phase 1 |
| Gait analysis with trend cards | ✅ Phase 2 |
| Energy harvesting analytics | ✅ Phase 3 |
| Patient-reported outcomes | ✅ Phase 1 |
| AI clinical summary (rule-based) | ✅ Phase 1 |
| Multilingual summary (demo stubs) | ✅ Phase 1 |
| Data quality & sensor status | ✅ Phase 1 |
| Settings / roadmap page | ✅ Phase 1 |
| CSV export | ✅ Phase 1 |
| FastAPI backend | ✅ Phase 1 |
| ESP32 data endpoint | ✅ Endpoint ready |
| Real-time hardware integration | 🔲 Phase 4 |
| Database (PostgreSQL/MySQL) | 🔲 Phase 5 |
| Local SLM integration | 🔲 Phase 6 |
| Full multilingual output | 🔲 Phase 7 |

---

## Technology Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Recharts (charts)
- Lucide React (icons)

**Backend:**
- Python 3.x + FastAPI + Uvicorn
- Pandas (data processing)

**Data:**
- CSV demo files (4 patients × 31 days)
- Architecture ready for PostgreSQL/MySQL

---

## Project Structure

```
smart-rehab-dashboard/
├── frontend/                    ← React + TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          ← Sidebar, Header
│   │   │   └── common/          ← KPICard, Card, AlertCard, StatusBadge
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DailyAnalytics.tsx
│   │   │   ├── GaitAnalysis.tsx
│   │   │   ├── EnergyAnalytics.tsx
│   │   │   ├── PatientReports.tsx
│   │   │   ├── AISummary.tsx
│   │   │   ├── DataQuality.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/
│   │   │   ├── dataService.ts   ← Data abstraction layer
│   │   │   └── summaryService.ts← AI summary (SLM integration point)
│   │   ├── data/
│   │   │   └── sampleData.ts    ← Static demo data fallback
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── csvExport.ts
│   │   │   └── alertUtils.ts
│   │   └── types/index.ts       ← All TypeScript types
│   └── vite.config.ts
│
└── backend/                     ← Python FastAPI server
    ├── main.py                  ← API endpoints
    ├── generate_data.py         ← Demo data generator
    ├── requirements.txt
    ├── start_backend.bat
    └── data/
        ├── rehabilitation_data.csv   ← 124 daily records
        └── intraday_data.csv         ← 168 intraday records
```

---

## Installation & Running

### Prerequisites
- **Node.js** v18+ (for frontend)
- **Python** 3.9+ (for backend)

### 1. Frontend Setup

```bash
cd smart-rehab-dashboard/frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**

### 2. Backend Setup (optional — frontend works without it)

```bash
cd smart-rehab-dashboard/backend

# Install Python packages
pip install fastapi uvicorn pandas python-multipart

# Generate demo CSV data
python generate_data.py

# Start backend server
python -m uvicorn main:app --reload --port 8000
# OR on Windows:
start_backend.bat
```

The API will be available at **http://localhost:8000**
API docs at **http://localhost:8000/docs**

### Windows Quick Start

```powershell
# Terminal 1 — Backend
cd smart-rehab-dashboard\backend
python generate_data.py
python -m uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd smart-rehab-dashboard\frontend
npm run dev
```

---

## How Demo Data Works

1. `backend/generate_data.py` generates two CSV files with fictional patient data
2. `frontend/src/data/sampleData.ts` also generates the same data client-side (seeded, reproducible)
3. The frontend uses `src/services/dataService.ts` as the data abstraction layer
4. Currently `USE_LIVE_API = false` in `dataService.ts` — all data comes from the client-side generator
5. The frontend gracefully falls back to built-in demo data if the backend is not running

---

## How to Replace CSV with a Real API

1. Start the FastAPI backend with real data connected
2. In `frontend/src/services/dataService.ts`, change:
   ```typescript
   const USE_LIVE_API = false;  // Change to true
   ```
3. All UI components will automatically fetch from the API — no other changes needed

---

## ESP32 Hardware Integration (Phase 4)

When the ESP32 smart insole is ready, send data to:

```http
POST http://localhost:8000/api/sensor-data
Content-Type: application/json

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
}
```

The endpoint is already implemented and waiting. See `backend/main.py` → `POST /api/sensor-data`.

---

## Local SLM Integration (Phase 6)

The AI summary integration point is in:

```
frontend/src/services/summaryService.ts
```

To connect a local SLM (e.g., via Ollama):

```typescript
// Replace the current rule-based logic with:
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'gemma2:2b',
    prompt: buildPrompt(input),
    stream: false,
  }),
});
```

No cloud AI API is needed. The system is designed for fully on-device inference.

---

## Development Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Dashboard + Sample Data | ✅ Complete |
| 2 | Advanced Gait Analytics | ✅ Complete |
| 3 | Energy Analytics | ✅ Complete |
| 4 | ESP32 Smart-Insole Integration | 🔲 Planned |
| 5 | Database + Real-Time Data | 🔲 Planned |
| 6 | Local SLM Integration | 🔲 Planned |
| 7 | Multilingual Clinical Summarization | 🔲 Planned |
| 8 | Prototype Evaluation | 🔲 Planned |

---

## Important Disclaimers

- **All patient data is entirely fictional.** No real patient information is used.
- This is a **prototype research dashboard**, not a medical device.
- The dashboard does **not** provide medical diagnoses or clinical recommendations.
- The system is **not** HIPAA or GDPR certified in its current form.
- All values labeled "Demo" are demonstration values only.

---

## License

This project is a Final-Year ECE academic project prototype. All data is fictional.
