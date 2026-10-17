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
    { label: 'Minors', value: 'Data Science · Computational Mathematics, Science & Engineering (CMSE)', tall: true },
    { label: 'Graduating', value: 'December 2026' },
  ],
  stack: [
    { category: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'C#', 'SQL', 'C++', 'C'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'Angular', 'Tailwind CSS', 'Vite'] },
    { category: 'Backend', items: ['FastAPI', 'Flask', 'ASP.NET Core', 'Express.js', 'SQLAlchemy', 'REST APIs'] },
    { category: 'Data & ML', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'pandas', 'NumPy', 'Matplotlib', 'PyTorch Geometric'] },
    { category: 'AI & LLMs', items: ['LangChain', 'Microsoft Foundry', 'Azure Document Intelligence'] },
    { category: 'Databases', items: ['PostgreSQL', 'SQL Server', 'MySQL', 'SQLite'] },
    { category: 'Cloud & DevOps', items: ['Azure', 'AWS', 'Google Cloud Run', 'Docker', 'Docker Compose', 'CI/CD', 'Prometheus'] },
    { category: 'Tools', items: ['Git', 'GitHub', 'GitLab', 'Linux', 'CMake'] },
  ],
  belt: [
    { name: 'Python', icon: '/tech/python.svg', color: '#3776ab' },
    { name: 'TypeScript', icon: '/tech/typescript.svg', color: '#3178c6' },
    { name: 'React', icon: '/tech/react.svg', color: '#61dafb' },
    { name: 'C#', icon: '/tech/csharp.svg', color: '#9b4f96', matches: ['C#', 'C# / .NET'] },
    { name: 'FastAPI', icon: '/tech/fastapi.svg', color: '#009688' },
    { name: 'Docker', icon: '/tech/docker.svg', color: '#2496ed', matches: ['Docker', 'Docker Compose'] },
    { name: 'Azure', icon: '/tech/azure.svg', color: '#0078d4', matches: ['Azure', 'Azure Document Intelligence'] },
    { name: 'AI Foundry', icon: '/tech/foundry.svg', color: '#7f5af0', matches: ['Microsoft Foundry', 'Microsoft AI Foundry'] },
    { name: 'LangChain', icon: '/tech/langchain.svg', color: '#2a9d8f' },
    { name: 'PyTorch', icon: '/tech/pytorch.svg', color: '#ee4c2c', matches: ['PyTorch', 'PyTorch Geometric'] },
    { name: 'scikit-learn', icon: '/tech/scikitlearn.svg', color: '#f7931e' },
    { name: 'pandas', icon: '/tech/pandas.svg', color: '#e70488' },
    { name: 'NumPy', icon: '/tech/numpy.svg', color: '#4dabcf' },
    { name: 'SQL Server', icon: '/tech/microsoftsqlserver.svg', color: '#cc2927', matches: ['SQL Server', 'Microsoft SQL Server'] },
    { name: 'PostgreSQL', icon: '/tech/postgresql.svg', color: '#4169e1' },
  ],
}
