// src/data/about.ts
import type { About } from '../types/about'

export const about: About = {
  subheading: 'Data science meets full-stack, building systems that make data useful.',
  bio: [
    "I'm Mehrshad, a computer science student who likes taking data from messy to meaningful. I'm drawn to the whole journey: understanding how models really work, finding the patterns worth trusting, and building the software that puts those insights in people's hands.",
    "My work spans both sides, from experimenting with machine learning methods to designing the APIs, dashboards, and full-stack applications around them. Along the way, I've worked on industry-partnered projects and learned that a good model is only as useful as the system built around it.",
  ],
  photo: {
    src: '/headshot.webp',
    alt: 'Headshot of Mehrshad Bagherebadian',
    width: 900,
    height: 1125,
  },
  facts: [
    { label: 'University', value: 'Michigan State University', logo: '/logos/michigan-state-university.svg' },
    { label: 'Degree', value: 'B.S. Computer Science' },
    { label: 'Concentration', value: 'Artificial Intelligence' },
    { label: 'Minors', value: 'Data Science · Computational Mathematics, Science & Engineering (CMSE)' },
    { label: 'Graduating', value: 'December 2026' },
    // Add { label: 'Location', value: '...' } here if you want it
  ],
  stack: [
    { category: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++', 'C'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'Angular', 'Tailwind CSS'] },
    { category: 'Backend', items: ['FastAPI', 'Flask', 'Express.js', 'ASP.NET Core'] },
    { category: 'Data & ML', items: ['PyTorch', 'scikit-learn', 'pandas', 'NumPy', 'Matplotlib'] },
    { category: 'Databases', items: ['PostgreSQL', 'SQL Server', 'MySQL', 'SQLite'] },
    { category: 'Cloud & Tools', items: ['Azure', 'AWS', 'Docker', 'Git', 'Linux'] },
  ],
}