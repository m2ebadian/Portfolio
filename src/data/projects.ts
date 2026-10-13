import type { Project } from '../types/project'
import { orgs } from './orgs'

export const projects: Project[] = [
  // Research
  {
    slug: 'biomedical-selective-answering',
    title: 'Evaluating Selective Answering in a Lightweight NLP Agent for Confidence-Aware Biomedical Evidence Triage',
    category: 'research',
    org: 'Undergraduate Researcher · Michigan State University · Faculty Advisor: Dr. Mohammad M. Ghassemi',
    start: '2026-09',
    status: 'in-progress',
    contributions: [
      'Developed the core workflow of a lightweight NLP agent for biomedical evidence retrieval, question answering, and information triage, connecting relevant scientific literature with evidence-grounded responses.',
      'Implemented confidence-aware selective answering and human-in-the-loop deferral to distinguish questions the agent can answer reliably from those requiring additional evidence or human judgment.',
      "Investigating how incomplete, noisy, and insufficient evidence affects the agent's ability to retrieve relevant information, reason over scientific findings, and recognize when a confident response is unsupported.",
      'Designing controlled experiments using biomedical question-answering data under complete, reduced, and noisy evidence conditions to assess robustness as the quality and availability of supporting information change.',
      'Evaluating the tradeoff between answer coverage and reliability, examining whether selective deferral reduces unsupported or overconfident predictions while preserving useful responses.',
      'Working with Dr. Ghassemi to refine the research methodology, interpret experimental findings, and document limitations relevant to biomedical information triage and decision support.',
      "Preparing the research for submission to the [EACL 2027](https://2027.eacl.org/) Student Research Workshop and planning a submission to MSU's [UURAF](https://urca.msu.edu/uuraf) to present the methodology and findings as a research poster.",
    ],
    focus: ['Biomedical Question Answering', 'Evidence Retrieval', 'Confidence-Aware NLP', 'Selective Answering', 'Human-in-the-Loop AI'],
    tech: [],
    orgs: [orgs.msuEngineering],
  },

  // Projects
  {
    slug: 'urban-science-capstone',
    title: 'AI-Powered Automotive Service Analytics Platform',
    category: 'project',
    course: 'CSE 498',
    org: 'Urban Science · The Capstone Experience',
    start: '2026-08',
    status: 'in-progress',
    contributions: [
      'Collaborated closely with Urban Science stakeholders to translate business requirements and client feedback into a full-stack platform for dealership analytics, competitive intelligence, and campaign optimization.',
      'Built an AI pipeline combining OCR, structured LLM extraction, validation, and human review to convert multi-coupon advertisements into reliable pricing, discount, service, and eligibility data.',
      'Applied AI-assisted analytics to examine how offer characteristics, customer distance, and service history related to response and redemption rates, informing campaign targeting, pricing, and timing.',
      'Benchmarked campaigns against historical performance, market medians, same-brand dealers, and independent competitors to calibrate expectations, identify promotional gaps, and evaluate competitive positioning.',
      'Developed interactive dashboards, geographic market views, and conversational analytics for exploring campaign effectiveness, retention, and dealership performance, backed by .NET APIs, SQL Server, and containerized Azure deployment.',
    ],
    // add the YouTube link to `video` and the booklet PDF to `booklet` once they're out
    showcase: {
      snapshots: [
        { src: '/showcase/dealer-overview.webp', thumb: '/showcase/dealer-overview-thumb.webp', label: 'Dealer overview' },
        { src: '/showcase/campaign-analytics.webp', thumb: '/showcase/campaign-analytics-thumb.webp', label: 'Campaign analytics' },
      ],
      bookletPreview: '/showcase/booklet-blur.webp',
    },
    tech: [
      'Angular', 'TypeScript', 'C# / .NET', 'Python', 'Microsoft SQL Server', 'Azure', 'Microsoft AI Foundry',
      'Azure Document Intelligence', 'LangChain', 'LangGraph', 'FastAPI', 'ASP.NET Core', 'Entity Framework Core',
      'Docker', 'GitLab CI/CD', 'Nginx',
    ],
    orgs: [orgs.urbanScience, orgs.msuEngineering],
  },
  {
    slug: 'auto-owners-claims-timeline',
    title: 'Claim/Case Timeline Builder',
    category: 'project',
    cluster: 'ml-ai',
    org: 'Auto-Owners Insurance · MSU AI Club · Partner Project',
    start: '2026-09',
    status: 'in-progress',
    summary:
      'A tool that turns scattered insurance claim materials (adjuster notes, correspondence, estimates, police reports, payment records) into a chronological case timeline, where every event can be traced back to the document it came from.',
    contributions: [
      'Building the backend RAG pipeline: OCR for scanned records, document chunking, embeddings, and retrieval with LlamaIndex and ChromaDB, so every result stays grounded in the original source',
      'Extracting events and resolving dates, separating event dates from document dates and anchoring relative references like "two days ago" to the note they appear in',
      'Consolidating duplicate events across documents and producing structured JSONL/CSV output with source excerpts and confidence scores for the visual timeline',
      'Evaluating against human-made ground-truth timelines on synthetic claim data, measuring date and ordering accuracy and flagging contradictions, information gaps, and unusual periods of inactivity',
    ],
    tech: ['RAG', 'OCR', 'Embeddings', 'LlamaIndex', 'ChromaDB', 'Python', 'FastAPI', 'Pydantic', 'Azure Document Intelligence', 'Streamlit'],
    orgs: [orgs.autoOwners, orgs.msuAiClub],
  },

  // Side projects
  {
    slug: 'insightdesk',
    title: 'InsightDesk',
    category: 'side',
    cluster: 'ml-ai',
    org: 'Personal project',
    start: '2026-06',
    end: '2026-06',
    status: 'completed',
    summary:
      'A small internal-knowledge assistant that turns business notes, CSVs, and text files into a searchable Q&A tool. It retrieves the most relevant passages with TF-IDF and answers with cited source snippets, without relying on a paid LLM API.',
    result: 'Grounded answers · flags low confidence',
    details: [
      'Splits .txt, .md, and .csv files into ~120-word passages and indexes them with TF-IDF (unigrams + bigrams)',
      'Ranks passages by cosine similarity and returns the top 3 with scores and sources',
      'Marks weak matches as low confidence instead of guessing',
      'React + TypeScript chat interface over a typed FastAPI backend',
    ],
    tech: ['Python', 'FastAPI', 'scikit-learn', 'pandas', 'React', 'TypeScript', 'Vite'],
    links: [{ label: 'GitHub', url: 'https://github.com/m2ebadian/InsightDesk' }],
  },
  {
    slug: 'logflarex',
    title: 'LogFlareX',
    category: 'side',
    cluster: 'software',
    org: 'Personal project',
    start: '2025-07',
    end: '2025-07',
    status: 'completed',
    summary:
      'A lightweight log-monitoring backend for small teams: a FastAPI service ingests structured logs into PostgreSQL, exposes Prometheus metrics, and raises an alert when the ERROR rate crosses a threshold within a time window.',
    result: 'Error-rate alerting · Prometheus metrics',
    details: [
      'REST endpoints to ingest logs and query them by level and source, stored in PostgreSQL via SQLAlchemy',
      'Prometheus instrumentation plus a custom counter for ERROR logs, with a scrape config for monitoring',
      'Alert endpoint that flags high ERROR rates over a configurable time window and threshold',
      'Containerized with a Dockerfile and Docker Compose (API + PostgreSQL)',
    ],
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Prometheus', 'Docker'],
    links: [{ label: 'GitHub', url: 'https://github.com/m2ebadian/LogFlareX' }],
  },

  // Course projects
  {
    slug: 'cse404-satellite-classification',
    title: 'Satellite Image Classification: CNN vs. GCN',
    category: 'course',
    course: 'CSE 404',
    org: 'Team of 6',
    start: '2025-01',
    end: '2025-05',
    status: 'completed',
    summary:
      'Compared a ResNet-18 CNN fine-tuned on EuroSAT (27,000 images, 10 land-cover classes) with a graph convolutional network built on ResNet-18 features and a cosine-similarity kNN graph.',
    result: 'CNN 96.7% · GCN 91.1% test accuracy',
    contributions: [
      'Tuned hyperparameters for both models',
      'Handled preprocessing and augmentation, and trained the ResNet-18 baseline',
      'Built the GCN on ResNet-18 features, including kNN graph construction',
    ],
    media: [
      {
        kind: 'pdf',
        src: '/projects/cse404/proposal.pdf',
        thumb: '/projects/cse404/proposal.webp',
        label: 'Proposal',
      },
      {
        kind: 'pdf',
        src: '/projects/cse404/presentation.pdf',
        thumb: '/projects/cse404/presentation.webp',
        label: 'Slides',
      },
    ],
    tech: ['Python', 'PyTorch', 'PyTorch Geometric', 'scikit-learn'],
    links: [{ label: 'GitHub', url: 'https://github.com/m2ebadian/CSE404_SatelliteClassification_CNN_GCN' }],
  },
  {
    slug: 'cse482-movielens-recommender',
    title: 'MovieLens Recommendation System',
    category: 'course',
    course: 'CSE 482',
    org: 'Individual',
    start: '2026-01',
    end: '2026-05',
    status: 'completed',
    summary:
      'Compared user-based and item-based collaborative filtering on about 100K MovieLens ratings (about 98% sparse), then shipped it as a full-stack app: a React + TypeScript dashboard, Flask API, and MySQL, containerized and deployed on Google Cloud Run.',
    result: 'Item-based CF · RMSE 0.90 · MAE 0.68',
    tech: ['React', 'TypeScript', 'Flask', 'pandas', 'scikit-learn', 'MySQL', 'Docker', 'Google Cloud Run'],
    links: [
      { label: 'Live demo', url: 'https://cse482-frontend-816507479795.us-central1.run.app/' },
      { label: 'GitHub', url: 'https://github.com/m2ebadian/movielens-recommender-system' },
    ],
  },
  {
    slug: 'cse380-cloud-backends',
    title: 'Cloud Infrastructure Backends',
    category: 'course',
    course: 'CSE 380',
    org: 'Individual',
    start: '2025-01',
    end: '2025-05',
    status: 'completed',
    summary:
      'Three Flask backends: user authentication with salted SHA-256 hashing and JWTs implemented from scratch with HMAC, a role-based movie rating service, and a grocery store split into five Dockerized microservices that validate JWTs across services.',
    result: '5 microservices · JWTs built from scratch',
    details: [
      'User management: salted SHA-256 passwords, HMAC-signed JWTs, password history checks',
      'Movie rating site: moderator and user roles, normalized schema, review search',
      'Micro Foods Market: users, products, orders, search, and logs services in Docker Compose',
    ],
    tech: ['Python', 'Flask', 'SQLite', 'Docker', 'Docker Compose'],
    links: [{ label: 'GitHub', url: 'https://github.com/m2ebadian/CSE380-CloudInfraBackend-Projects' }],
  },
  {
    slug: 'cse335-spartys-boots',
    title: "Sparty's Boots",
    category: 'course',
    course: 'CSE 335',
    org: 'Team of 5',
    start: '2024-09',
    end: '2024-12',
    status: 'completed',
    summary:
      "A C++ logic-puzzle game inspired by Rocky's Boots: players wire gates and sensors into circuits that make Sparty kick the right products off a moving conveyor. Built around a strict object-oriented design, a three-state logic engine, custom wxWidgets drawing, and XML-loaded levels.",
    result: '8 playable levels · 2 designed by the team',
    tech: ['C++', 'wxWidgets', 'CMake', 'XML'],
    media: [{ kind: 'image', src: '/projects/spartys-boots.webp', label: 'Gameplay: building a logic circuit' }],
    links: [{ label: 'GitHub', url: 'https://github.com/m2ebadian/CSE335_project1' }],
  },
]
