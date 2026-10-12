// src/lib/dates.ts
// Dates in data files are stored as 'YYYY-MM' (e.g. '2026-08') so they sort correctly
// and can be formatted consistently everywhere.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// '2026-08' → 'Aug 2026'
export function formatMonth(value: string): string {
  const [year, month] = value.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

// ('2026-08') → 'Aug 2026 – Present', ('2025-01', '2025-05') → 'Jan 2025 – May 2025'
export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`
}
