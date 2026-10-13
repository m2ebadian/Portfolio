import type { Experience } from '../types/experience'

export const experience: Experience[] = [
  {
    role: 'Strategic Support Associate',
    company: 'Jackson Financial',
    location: 'Lansing, MI',
    logo: '/logos/jackson-financial.png',
    periods: [{ start: '2025-06', end: '2026-01' }],
    summary:
      'Supported insurance and annuity claim processing through data entry, verification, and documentation where accuracy mattered.',
  },
  {
    role: 'Volunteer Data Management Student Researcher',
    company: 'Henry Ford Health',
    location: 'Detroit, MI',
    logo: '/logos/henry-ford-health.png',
    periods: [
      { start: '2023-05', end: '2023-08' },
      { start: '2024-05', end: '2024-08' },
    ],
    summary:
      'Processed human and animal imaging datasets in a Linux environment using ImageJ and shell scripting, and kept research data organized for downstream analysis.',
  },
]
