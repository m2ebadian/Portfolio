// src/data/orgs.ts
// Every organization logo used on the site, defined once.
// To add a website preview, save a screenshot in public/previews/ and set `preview`.
import type { Org } from '../types/project'

export const orgs = {
  msuEngineering: {
    name: 'MSU College of Engineering',
    logo: '/logos/msu-engineering.png',
    url: 'https://engineering.msu.edu/',
  },
  urbanScience: {
    name: 'Urban Science',
    logo: '/logos/urban-science.png',
    url: 'https://www.urbanscience.com/',
  },
  autoOwners: {
    name: 'Auto-Owners Insurance',
    logo: '/logos/auto-owners.png',
    url: 'https://www.auto-owners.com/',
  },
  msuAiClub: {
    name: 'MSU AI Club',
    logo: '/logos/msu-ai-club.png',
    url: 'https://www.msuaiclub.com/',
  },
} satisfies Record<string, Org>
