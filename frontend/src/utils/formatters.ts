// utils/formatters.ts
// Formatting helpers for numbers, dates, and display values.

/** Format a number with thousands separator. */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format a date string (YYYY-MM-DD) to human-readable form. */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Format a date string to short form (e.g., 01 Jul). */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

/** Format percentage change with + or - sign. */
export function formatPct(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

/** Compute percentage change between current and previous. */
export function pctChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

/** Convert steps to approximate distance in km. */
export function stepsToKm(steps: number): number {
  return parseFloat((steps * 0.00062).toFixed(2));
}

/** Capitalize first letter. */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Get today's date as YYYY-MM-DD. */
export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/** Get a date N days ago as YYYY-MM-DD. */
export function daysAgoStr(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

/** Clamp a value to [lo, hi]. */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Get a color class based on data completeness. */
export function completenessColor(pct: number): string {
  if (pct >= 95) return 'text-emerald-600';
  if (pct >= 85) return 'text-amber-500';
  return 'text-red-500';
}

/** Describe a trend direction using neutral clinical language. */
export function trendLabel(direction: 'increased' | 'decreased' | 'stable'): string {
  return { increased: 'Increased', decreased: 'Decreased', stable: 'Stable' }[direction];
}
