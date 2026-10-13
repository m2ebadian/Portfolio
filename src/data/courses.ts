import type { Cluster, Course } from '../types/course'

export const clusters: Cluster[] = [
  { id: 'ml-ai', name: 'Machine Learning & AI', color: '#14b8a6' },
  { id: 'data-stats', name: 'Data Science & Statistics', color: '#8b5cf6' },
  { id: 'software', name: 'Software & Systems', color: '#f59e0b' },
]

export const courses: Course[] = [
  // Machine Learning & AI
  {
    code: 'CSE 404',
    name: 'Introduction to Machine Learning',
    cluster: 'ml-ai',
    description: 'Core principles and techniques for machine learning, including algorithms, model design, and programming.',
    topics: ['Machine Learning', 'Model Design'],
  },
  {
    code: 'CMSE 492',
    name: 'Applied Machine Learning',
    cluster: 'ml-ai',
    description:
      'Hands-on machine learning from data preprocessing to deep learning: feature engineering, model selection and evaluation, neural networks, image classification, NLP, and time series, with a semester-long group project.',
    topics: ['Machine Learning', 'Deep Learning', 'Feature Engineering', 'NLP', 'Time Series'],
    prereqs: ['CMSE 202'],
  },
  {
    code: 'CSE 440',
    name: 'Artificial Intelligence',
    cluster: 'ml-ai',
    description: 'Advanced algorithms and methods in intelligent systems and artificial intelligence.',
    topics: ['Artificial Intelligence', 'Intelligent Systems'],
  },
  {
    code: 'CSE 446',
    name: 'AI Agents',
    cluster: 'ml-ai',
    description: 'The design, implementation, and evaluation of large language model (LLM)-based agents.',
    topics: ['Artificial Intelligence', 'LLM Agents'],
    prereqs: ['CSE 335', 'CSE 380', 'CMSE 381'],
    inProgress: true,
  },

  // Data Science & Statistics
  {
    code: 'CMSE 202',
    name: 'Computational Modeling Tools and Techniques',
    cluster: 'data-stats',
    description:
      'Standard methods and tools for computational modeling and data analysis: statistical analysis, symbolic math, linear algebra, simulation, and data mining.',
    topics: ['Computational Modeling', 'Statistics', 'Data Mining', 'Simulation'],
  },
  {
    code: 'CMSE 381',
    name: 'Fundamentals of Data Science Methods',
    cluster: 'data-stats',
    description:
      'Supervised and unsupervised learning, feature extraction, dimension reduction, clustering, regression, and classification.',
    topics: ['Machine Learning', 'Feature Engineering', 'Regression', 'Clustering'],
    prereqs: ['STT 442'],
  },
  {
    code: 'STT 442',
    name: 'Probability and Statistics II: Statistics',
    cluster: 'data-stats',
    description:
      'Parameter estimation, sampling distributions, confidence intervals, hypothesis testing, regression, analysis of variance, and time series forecasting.',
    topics: ['Statistics', 'Regression', 'Time Series'],
  },
  {
    code: 'CSE 482',
    name: 'Big Data Analysis',
    cluster: 'data-stats',
    description: 'Principles and techniques for large-scale data analysis and applications.',
    topics: ['Big Data', 'Data Mining'],
    prereqs: ['CSE 380', 'CMSE 381'],
  },

  // Software & Systems
  {
    code: 'CSE 320',
    name: 'Computer Organization and Architecture',
    cluster: 'software',
    description:
      'Digital logic and Boolean algebra, combinational and sequential circuits, data and instruction representation, computer system architecture, and assembly language programming.',
    topics: ['Computer Architecture', 'Assembly Language'],
  },
  {
    code: 'CSE 325',
    name: 'Computer Systems',
    cluster: 'software',
    description:
      'Process and processor management, concurrency and threads, memory management and the memory hierarchy, networking and protocols, and secure programming.',
    topics: ['Operating Systems', 'Concurrency', 'Networking', 'Security'],
    prereqs: ['CSE 320'],
  },
  {
    code: 'CSE 335',
    name: 'Object-Oriented Software Design',
    cluster: 'software',
    description:
      'Development of large software products and libraries: object-oriented programming with inheritance and polymorphism, design methods, contracts for reliable software, and configuration management.',
    topics: ['Software Design', 'Object-Oriented Programming'],
  },
  {
    code: 'CSE 435',
    name: 'Software Engineering',
    cluster: 'software',
    description: 'Software engineering methods for reliable, reusable, and dependable software.',
    topics: ['Software Engineering', 'Software Design'],
    prereqs: ['CSE 335'],
  },
  {
    code: 'CSE 477',
    name: 'Web Application Architecture and Development',
    cluster: 'software',
    description:
      'Web programming fundamentals: protocols, client-server interaction, client- and server-side programming, databases, and building scalable, distributed web applications.',
    topics: ['Web Development', 'Databases', 'Distributed Systems'],
    prereqs: ['CSE 335'],
  },
  {
    code: 'CSE 380',
    name: 'Information Management and the Cloud',
    cluster: 'software',
    description: 'Introduction to information management and cloud computing.',
    topics: ['Cloud Computing', 'Databases'],
  },
  {
    code: 'CSE 498',
    name: 'The Capstone Experience',
    cluster: 'software',
    description:
      'Senior capstone: a student team designs and builds a software system for an industry sponsor. My team is working with Urban Science.',
    topics: ['Software Engineering', 'Web Development'],
    inProgress: true,
  },
]
