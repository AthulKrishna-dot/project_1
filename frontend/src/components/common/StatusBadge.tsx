// components/common/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: 'Online' | 'Offline' | 'Warning' | 'Demo' | 'Connected' | 'Disconnected';
  size?: 'sm' | 'md';
}

const CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Online: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Connected: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Offline: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  Disconnected: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  Warning: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Demo: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG['Demo'];
  const textSize = size === 'md' ? 'text-xs' : 'text-[10px]';
  const dotSize = size === 'md' ? 'w-2 h-2' : 'w-1.5 h-1.5';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text} ${textSize}`}>
      <span className={`${dotSize} rounded-full ${cfg.dot} shrink-0`} />
      {status}
    </span>
  );
}
