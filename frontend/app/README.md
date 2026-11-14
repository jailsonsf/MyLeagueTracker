# MyLeagueTracker frontend

React + TypeScript + Vite PWA for the MyLeagueTracker API.

## Requirements

- Node.js 20+ (developed on Node 26)
- npm
- The backend running on `http://localhost:8080`

## Setup

```bash
cd frontend/app
npm install
cp .env.example .env
```

`VITE_API_URL` points at the backend (default `http://localhost:8080`).

## Running against the backend

Start the backend first, then:

```bash
npm run dev
```

The app runs on `http://localhost:5173`, which is the origin the backend allows by default. If Vite falls back to another port, restart the backend with the extra origin:

```bash
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

## PWA

The production build generates a manifest, icons and a Workbox service worker. The app shell, web fonts and manifest are precached; `/api` and `/auth` are excluded from the navigation fallback, and no API response is cached. The service worker uses `autoUpdate`.

```bash
npm run preview   # serve dist/ on http://localhost:4173
npm run test:pwa  # build + verify manifest, precache, fallback and denylist
```

The service worker is disabled in `npm run dev`; validate offline behavior with `preview`.

You can register a `USER` from `/register`, or sign in with an existing account. The public sign-up always creates a `USER`; imports and admin-only routes need an `ADMIN` created directly in the database or promoted by an existing admin.

## Reference data

The new-career screen reads clubs from `GET /api/clubs`, and player positions are enriched from `GET /api/catalog/players`. A fresh database has none of that data, so the app degrades on purpose: the club picker accepts a free-text team name and positions show "—". Countries come from `GET /api/countries`.

To populate the catalog, run the backend import endpoints as an admin:

- `POST /api/import/leagues` with `API_FOOTBALL_KEY` configured;
- `POST /api/import/players` with the player CSV as a multipart `file`.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5173
npm test           # Vitest, one run
npm run test:watch # Vitest, watch mode
npm run test:pwa   # build + verify the PWA manifest and service worker
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run build      # typecheck + production build
```

## Testing seam

Every feature test crosses the same seam: the HTTP boundary. Integration tests render real routes through TanStack Router and serve API contracts with MSW. The same contracts can be exercised against the real backend with a browser driver; the automated suite runs against MSW.

The PWA has a separate build check: `test:pwa` validates the generated manifest, icons, precache, navigation fallback and API denylist. Offline reload was verified in Firefox with the preview server stopped.

Tests assert what the user sees and which HTTP contract the app sends; they do not assert CSS classes, internal hooks or state shape.

## Auth

The JWT is stored in `localStorage`, its `sub` and `exp` claims are decoded on load, and the session is cleared when the token expires or the API answers 401/403. There is no refresh token or server-side logout endpoint.

## Layout

```
scripts/       build-time PWA verification
public/        favicon and installable icons
src/
  components/   shared UI and the authenticated shell
  features/     auth, careers, squad and youth screens
  lib/api/      typed fetch client and DTO mirror types
  lib/          formatters and shared helpers
  i18n/         pt-BR strings
  pwa/          manifest shared by Vite and the manifest test
  routes/       route components
  test/         MSW server, setup and render helpers
  styles/       Tailwind v4 theme from the design system
```
