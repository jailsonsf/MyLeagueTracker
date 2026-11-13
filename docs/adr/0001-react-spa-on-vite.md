# Build the frontend as a React SPA on Vite

The product is a private, authenticated dashboard for one user's careers. It needs client-side routing, token-based sessions and fast iteration against a REST backend that already exists; it does not need server-side rendering or SEO. We chose React 19 + TypeScript + Vite with TanStack Router and TanStack Query, styled with Tailwind CSS v4.

Next.js was rejected because its server layer adds nothing here and complicates storing a JWT in the browser. Angular was rejected as heavier than the team needs; Vue and Svelte offered no decisive advantage over the chosen ecosystem.

Consequences: the app is a static bundle that talks to the API directly, so CORS (or a same-origin proxy) is required, and all session handling lives in the browser.
