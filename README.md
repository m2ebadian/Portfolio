# Mehrshad Bagherebadian — Portfolio

Personal portfolio site built with React, TypeScript, and Vite.

## Stack

- **React 19 + TypeScript**, bundled with **Vite**
- **Tailwind CSS v4** for styling (theme tokens live in `src/index.css`)
- **Motion** for animation and **Lenis** for smooth scrolling
- **React Three Fiber / drei** for the 3D course graph (loaded lazily)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
npm run lint
```

## Project layout

```
src/
  data/        site content (profile, about, courses, projects, experience, beyond)
  types/       TypeScript types for the data
  sections/    one component per page section
  components/  shared UI (cards, timeline, navbar, course graph, ...)
  lib/         small helpers (dates, motion presets, scrolling)
public/        images, logos, PDFs, icons
```

## Editing content

Almost everything on the page comes from `src/data/`:

- **Projects:** `projects.ts`. Order in the file is the order on the page. `category` decides the section (`research`, `project`, `side`, `course`). Links can be written inline as `[text](https://...)`.
- **Courses:** `courses.ts`. Courses that share a topic or a prerequisite are connected in the graph.
- **Tech belt and stack:** `about.ts`. Belt icons live in `public/tech/`.
- **Beyond the Data:** `beyond.ts`. Food photos live in `public/beyond/`.
- **Résumé:** drop the PDF at `public/Mehrshad-Bagherebadian-Resume.pdf`.

Dates are written as `YYYY-MM`; leave out `end` for anything ongoing.
