## Talent Flow Hub

Modern recruiting dashboard built with React, TypeScript, Vite, shadcn/ui, Zustand, and MSW. It provides candidate, job, and assessment management with a polished UI and fully local persistence using IndexedDB.

### Features
- Candidate pipeline with list, kanban, and virtualized views
- Candidate profile and detail modal with notes, timeline, and documents
- Job management with create/update/reorder
- Assessment builder, preview, and runtime
- Protected dashboard layout with sidebar and header
- Local-first persistence backed by IndexedDB (no server required)
- Mock API via MSW that simulates network latency and write failures

### Tech Stack
- React 18, TypeScript, Vite
- shadcn/ui (Radix UI primitives + Tailwind)
- Zustand (state + persist to IndexedDB)
- MSW (mock service worker) as the network layer
- IndexedDB (custom helper) for durable storage

### Getting Started
Prerequisites:
- Node.js 18+ (LTS recommended)

Install dependencies:
```bash
npm install
```

Start the dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Data and Persistence
- All data (jobs, candidates, assessments, responses, and small KV) is stored in IndexedDB under the `talentflow` database.
- Zustand stores use an IndexedDB-backed storage adapter to rehydrate UI state across refreshes.
- MSW acts as the network layer and writes through to IndexedDB. On first run, sample data is seeded into IndexedDB.

Relevant modules:
- `src/lib/idb.ts`: minimal IndexedDB helper (get/put/bulkPut/delete/clear + KV)
- `src/lib/zustandStorage.ts`: adapter to persist Zustand state in IndexedDB
- `src/mocks/handlers.ts`: MSW handlers reading/writing to IndexedDB and seeding once
- `src/store/*`: Zustand stores configured with IndexedDB persistence

### Mock API Behavior
- Latency: every request is delayed by 200–1200ms
- Write error rate: ~8% of write requests return a simulated 500 error
- Endpoints implemented (examples):
  - Jobs: `GET /jobs`, `POST /jobs`, `PATCH /jobs/:id`, `PATCH /jobs/:id/reorder`
  - Candidates: `GET /candidates`, `POST /candidates`, `PATCH /candidates/:id`, `GET /candidates/:id/timeline`
  - Assessments: `GET /assessments/:jobId`, `PUT /assessments/:jobId`, `POST /assessments/:jobId/submit`

### App Routes (high level)
- `/` Landing
- `/signin`, `/signup`, `/register`
- `/dashboard` (protected)
  - `/dashboard/jobs`, `/dashboard/jobs/:jobId`
  - `/dashboard/candidates`, `/dashboard/candidates/:candidateId`
  - `/dashboard/assessments`, `/dashboard/assessments/:assessmentId/(edit|preview)`, `/dashboard/assessments/:assessmentId/take`
  - `/dashboard/analytics`, `/dashboard/settings`

### Development Notes
- Styling: Tailwind CSS; tokens and components in `src/components/ui/*`
- State: See `src/store/` for jobs, candidates, settings, and assessment stores
- Seeding (first run): Occurs inside MSW handlers; if the DB is empty, it seeds jobs, candidates, and assessments
- Deep links: Candidate profile handles direct navigation by hydrating state from IndexedDB via the store persistor

### Scripts
- `npm run dev` – Start Vite dev server
- `npm run build` – Build production bundle
- `npm run preview` – Preview the production build locally
- `npm run lint` – Lint the project

### Troubleshooting
- Empty pages or missing data:
  - Ensure the service worker is running (open DevTools > Application > Service Workers).
  - Clear site data (Application tab) to reset IndexedDB and reload.
- Intermittent write failures:
  - This is by design to simulate real network issues (~8% on writes). Implement retries in the UI layer if needed.




