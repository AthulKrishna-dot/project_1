// App.tsx — Main application shell with routing, sidebar, and header
import React, { useState, useCallback } from 'react';
import Sidebar, { type PageId } from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import DailyAnalytics from './pages/DailyAnalytics';
import GaitAnalysis from './pages/GaitAnalysis';
import EnergyAnalytics from './pages/EnergyAnalytics';
import PatientReports from './pages/PatientReports';
import AISummary from './pages/AISummary';
import DataQuality from './pages/DataQuality';
import Settings from './pages/Settings';
import type { PatientId } from './types';

const DEFAULT_DATE = '2026-07-31';
const DEFAULT_PATIENT: PatientId = 'P001';

function getAlertCount(): number {
  // In production this would come from a reactive store
  return 2;
}

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<PatientId>(DEFAULT_PATIENT);
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigate = useCallback((p: PageId) => {
    setPage(p);
    setMobileSidebarOpen(false);
  }, []);

  const pageProps = { selectedPatient, selectedDate };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile, static on desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 md:static md:z-auto
          transition-transform duration-300
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <Sidebar
          activePage={page}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          selectedPatient={selectedPatient}
          onPatientChange={setSelectedPatient}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onMenuToggle={() => setMobileSidebarOpen((o) => !o)}
          alertCount={getAlertCount()}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {page === 'dashboard' && <Dashboard {...pageProps} />}
          {page === 'daily' && <DailyAnalytics {...pageProps} />}
          {page === 'gait' && <GaitAnalysis {...pageProps} />}
          {page === 'energy' && <EnergyAnalytics {...pageProps} />}
          {page === 'reports' && <PatientReports {...pageProps} />}
          {page === 'summary' && <AISummary {...pageProps} />}
          {page === 'quality' && <DataQuality {...pageProps} />}
          {page === 'settings' && <Settings />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 px-6 py-2 bg-white">
          <p className="text-[10px] text-slate-400 text-center">
            Smart Rehabilitation Analytics · Prototype v1.0 · Demo Data Only · Not for Clinical Use ·
            Edge-AI IoT Final-Year ECE Project
          </p>
        </footer>
      </div>
    </div>
  );
}
