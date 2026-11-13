# MyLeagueTracker frontend

React + TypeScript + Vite PWA for the MyLeagueTracker API.

## Requirements

- Node.js 20+ (developed on Node 26)
- npm

## Setup

```bash
cd frontend/app
npm install
cp .env.example .env
```

`VITE_API_URL` points at the backend (default `http://localhost:8080`). The backend allows the dev origin `http://localhost:5173` via its CORS configuration.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5173
npm test           # Vitest, one run
npm run test:watch # Vitest, watch mode
npm run lint       # ESLint
npm run build      # typecheck + production build
```

## Testing seam

Every feature test crosses the same seam: the HTTP boundary. Integration tests render real routes through TanStack Router and serve API contracts with MSW. Playwright smoke tests reuse the same contracts against the real backend.

Tests assert what the user sees and which HTTP contract the app sends; they do not assert CSS classes, internal hooks or state shape.

## Layout

```
src/
  lib/api/      typed fetch client and DTO mirror types
  lib/          formatters and shared helpers
  i18n/         pt-BR strings
  routes/       route components
  test/         MSW server, setup and render helpers
  styles/       Tailwind v4 theme from the design system
```
