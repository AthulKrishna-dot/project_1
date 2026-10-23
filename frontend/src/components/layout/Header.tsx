// components/layout/Header.tsx
import React from 'react';
import { Menu, Bell, Activity } from 'lucide-react';
import type { PatientId } from '../../types';

const PATIENTS: PatientId[] = ['P001', 'P002', 'P003', 'P004'];

interface HeaderProps {
  selectedPatient: PatientId;
  onPatientChange: (p: PatientId) => void;
  selectedDate: string;
  onDateChange: (d: string) => void;
  onMenuToggle: () => void;
  alertCount: number;
}

export default function Header({
  selectedPatient,
  onPatientChange,
  selectedDate,
  onDateChange,
  onMenuToggle,
  alertCount,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* App title */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 shrink-0">
          <Activity size={15} className="text-white" />
        </div>
        <div className="hidden sm:block overflow-hidden">
          <h1 className="text-sm font-bold text-slate-800 leading-tight whitespace-nowrap">
            Smart Rehabilitation Analytics
          </h1>
          <p className="text-[10px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
            Edge-AI Rehabilitation Monitoring & Gait Analytics
          </p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Patient selector */}
        <div className="flex items-center gap-1.5">
          <label className="hidden sm:block text-xs text-slate-500 font-medium whitespace-nowrap">
            Patient:
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => onPatientChange(e.target.value as PatientId)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {PATIENTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-1.5">
          <label className="hidden sm:block text-xs text-slate-500 font-medium whitespace-nowrap">
            Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">Monitoring: Active</span>
        </div>

        {/* Alert bell */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
