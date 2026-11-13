# Keep the JWT in localStorage

The API returns a JWT and nothing else: no refresh token, no profile, no logout endpoint, a two-hour expiry. The frontend stores the token in `localStorage`, decodes `sub` (the account username) and `exp` on load, schedules a local logout at expiry, and treats 401/403 responses as an expired session.

The alternatives were weaker for this product. `sessionStorage` logs the user out when the tab closes. In-memory storage loses the session on every reload. An httpOnly cookie would be the safer choice against XSS, but it requires backend changes that are out of scope.

Consequences: any XSS can read the token, and there is no server-side revocation. The backend sometimes answers an invalid token with 500 rather than 401, so the client also checks `exp` before calling the API.
