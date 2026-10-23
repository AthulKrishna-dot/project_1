// components/layout/Sidebar.tsx
import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Footprints,
  Zap,
  ClipboardList,
  Brain,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'daily'
  | 'gait'
  | 'energy'
  | 'reports'
  | 'summary'
  | 'quality'
  | 'settings';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'daily', label: 'Daily Analytics', icon: <Activity size={18} /> },
  { id: 'gait', label: 'Gait Analysis', icon: <Footprints size={18} /> },
  { id: 'energy', label: 'Energy Analytics', icon: <Zap size={18} /> },
  { id: 'reports', label: 'Patient Reports', icon: <ClipboardList size={18} /> },
  { id: 'summary', label: 'AI Clinical Summary', icon: <Brain size={18} /> },
  { id: 'quality', label: 'Data Quality', icon: <ShieldCheck size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-60'
      } bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out shrink-0 min-h-screen`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-500 shrink-0">
          <Heart size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold leading-tight text-white whitespace-nowrap">Smart Rehab</p>
            <p className="text-[10px] text-slate-400 whitespace-nowrap">Analytics Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-300 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo mode badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Mode</p>
          <p className="text-xs text-amber-400 font-medium">Demo Data</p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-center py-3 border-t border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
