@echo off
echo ==========================================
echo  Smart Rehabilitation Analytics Dashboard
echo  Backend Server Startup
echo ==========================================
echo.
echo Step 1: Generating demo data...
python generate_data.py
echo.
echo Step 2: Starting FastAPI server on http://localhost:8000
echo   API docs available at: http://localhost:8000/docs
echo   Press Ctrl+C to stop.
echo.
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
