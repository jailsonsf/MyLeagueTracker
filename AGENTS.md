# MyLeagueTracker

A companion for EA FC career-mode playthroughs. The repository has two parts:

- `leaguetracker-backend/` — Spring Boot 4 + PostgreSQL REST API (Java 17).
- `frontend/app/` — React + TypeScript + Vite PWA (planned; see the spec in `.scratch/frontend-app/`).
- `frontend/example/` — static HTML mockups and the design system. Reference only; not part of the runtime.

See `README.md` for how to run the backend and `GLOSSARY.md` for the project's domain vocabulary.

## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles mapped to default label strings. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the root and ADRs in `docs/adr/`. See `docs/agents/domain.md`.
