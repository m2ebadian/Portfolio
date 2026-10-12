// src/data/projects.ts
import type { Project } from '../types/project'
import { orgs } from './orgs'

export const projects: Project[] = [
  // ---------- Research ----------
  {
    slug: 'biomedical-selective-answering',
    title: 'Confidence-Aware Biomedical Evidence Triage',
    category: 'research',
    org: 'MSU Research · Advisor: Dr. Mohammad M. Ghassemi',
    start: '2026-09',
    status: 'in-progress',
    summary:
      'Evaluating selective answering in a lightweight NLP agent: can it retrieve and reason over biomedical literature while recognizing when the evidence is incomplete, noisy, or insufficient, and defer instead of giving an overconfident answer?',
    contributions: [
      'Developing the agent, including confidence-aware selective answering and human-in-the-loop deferral',
      'Running experiments on biomedical QA data under complete, reduced, and noisy evidence conditions',
      'Preparing the work for submission to the EACL 2027 Student Research Workshop',
    ],
    tech: [], // TODO: add the tools you're using
    orgs: [orgs.msuEngineering],
  },

  // ---------- Projects ----------
  {
    slug: 'urban-science-capstone',
    title: 'AI-Powered Automotive Service Analytics Platform',
    category: 'project',
    org: 'Urban Science · CSE 498 Capstone',
    start: '2026-08',
    status: 'in-progress',
    summary:
      'Our team is building a platform that helps dealerships understand service promotions: coupons are uploaded, read with OCR, structured by an AI processing stage, and confirmed through human review before feeding dashboards and market comparisons.',
    contributions: [
      'Built the Azure Document Intelligence integration, including its C# service and API endpoint',
      'Developed the Angular Overview dashboard: interactive dealership map, summary metrics, and layout',
      'Built the sidebar, navigation, header, and campaign actions, plus general interface polish',
    ],
    tech: ['Angular', 'TypeScript', 'C#', 'ASP.NET Core', 'SQL Server', 'Azure Document Intelligence'],
    orgs: [orgs.urbanScience, orgs.msuEngineering],
  },
  {
    slug: 'auto-owners-claims-timeline',
    title: 'Evidence-Grounded Claims Timeline',
    category: 'project',
    org: 'MSU AI Club · Auto-Owners Insurance',
    start: '2026-09',
    status: 'in-progress',
    summary:
      'Building a system that reads synthetic insurance claim documents (adjuster notes, police reports, emails, payment records) and assembles a chronological timeline of key events, with every event linked to the evidence behind it.',
    // TODO: add contributions once your role is settled
    tech: [], // TODO
    orgs: [orgs.msuAiClub, orgs.autoOwners],
  },

  // ---------- Course projects ----------
  // Add entries with category: 'course', a course code (e.g. course: 'CSE 404'), and start/end dates.
  // The "Course projects" group appears automatically once there is at least one.
]
