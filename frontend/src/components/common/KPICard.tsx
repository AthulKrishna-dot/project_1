// components/common/KPICard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPct } from '../../utils/formatters';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPct?: number;
  trendNote?: string;
  description?: string;
  isDemo?: boolean;
}

export default function KPICard({
  title,
  value,
  unit,
  icon,
  iconBg = 'bg-teal-500',
  trend,
  trendPct,
  trendNote,
  description,
  isDemo = true,
}: KPICardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600'
      : trend === 'down'
      ? 'text-red-500'
      : 'text-slate-400';

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          {isDemo && (
            <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-semibold bg-amber-100 text-amber-700 rounded uppercase tracking-wide">
              Demo
            </span>
          )}
        </div>
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${iconBg} text-white shrink-0`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>

      {/* Trend */}
      {trend && trendPct !== undefined && (
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={13} />
          <span className="text-xs font-medium">{formatPct(Math.abs(trendPct))}</span>
          {trendNote && <span className="text-xs text-slate-400">{trendNote}</span>}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-400 leading-snug border-t border-slate-50 pt-2">
          {description}
        </p>
      )}
    </div>
  );
}
