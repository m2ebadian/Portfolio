const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Dates are stored as 'YYYY-MM'.
export function formatMonth(value: string): string {
  const [year, month] = value.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

export function formatRange(start: string, end?: string): string {
  if (end === start) return formatMonth(start)
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`
}
