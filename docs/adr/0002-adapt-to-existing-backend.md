# Adapt the frontend to the existing backend

The backend's domain logic stays untouched in this phase. The frontend absorbs every gap instead of adding read endpoints or fixing known bugs. The only backend changes are two enabling ones: a CORS configuration, and a `careerSquadId` field exposed by the career dashboard.

This is deliberate. Adding `GET /auth/me`, a squad listing, career-by-id, ownership fixes and the broken transfer endpoint would expand the work well beyond the frontend. Two changes are the minimum needed to make the app usable: CORS lets a browser call the API, and `careerSquadId` makes it possible to add the first player to an empty career squad, since that identifier otherwise only appears inside player DTOs.

Consequences that future readers would otherwise find surprising:

- The career dashboard endpoint is the single source for the principal squad and youth squad.
- Account identity comes from the JWT `sub` claim, because login returns no profile and there is no `/auth/me`.
- Player positions are recovered by matching exact names against the player catalog, with a "—" fallback; this is heuristic.
- `GET /api/clubs` returns clubs with their full player lists, so the frontend must cache it.
- Seasons, trophies and transfers have no UI. The ownership bug comparing `email` to `username` and the broken `POST /api/transfer` remain in place.

Rejected alternative: adding the missing read endpoints and fixing the ownership bugs now. It was safer, but explicitly out of scope.
