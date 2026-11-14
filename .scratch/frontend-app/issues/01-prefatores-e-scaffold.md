# 01: Prefatores de backend e scaffold do frontend

**What to build:** O repositório consegue servir um shell de frontend temático que conversa com a API existente a partir do navegador, e o dashboard da Career passa a expor o identificador do Career Squad necessário para as escritas posteriores.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] O backend aceita requisições cross-origin da origem configurada do frontend (default `http://localhost:5173`) com `Authorization` e `Content-Type`, para `GET/POST/PATCH/DELETE/OPTIONS`; um preflight de navegador tem sucesso.
- [x] `GET /api/careers/{id}/dashboard` inclui `careerSquadId` no topo, igual ao id do Career Squad da Career, mantendo os campos existentes compatíveis.
- [x] O frontend compila e roda localmente com os tokens do design system (superfícies, primary/secondary/error, Epilogue/Manrope, Material Symbols), renderizando uma rota placeholder temática.
- [x] Client HTTP tipado, módulo de strings pt-BR, formatadores de moeda/data, TanStack Router e TanStack Query estão configurados.
- [x] A URL da API vem de configuração de ambiente (`VITE_API_URL`).
- [x] O seam de teste existe: um teste com MSW renderiza uma rota real e prova o contrato HTTP; lint e typecheck passam.

## Comments

- **2026-11-13** — Implementado.
- Backend: `CorsConfig` com origens por ambiente (`CORS_ALLOWED_ORIGINS`, default `http://localhost:5173`) ligado à cadeia do Spring Security; `careerSquadId` no topo de `CareerDashboardDTO`.
- Frontend: scaffold Vite + React + TypeScript + Tailwind v4 com os tokens do design system, TanStack Router/Query, client HTTP tipado, i18n pt-BR, formatadores e rota placeholder temática.
- Testes: backend `CareerServiceTest` (1), `CorsConfigTest` (3), `CorsPreflightTest` (2); frontend 3 testes no seam HTTP (rota + client). `npm run typecheck`, `npm run lint` e `npm run build` passam.
- Gap aceito: o preflight é verificado com `CorsFilter` sobre a configuração real; a cadeia de segurança completa será exercitada no smoke contra o backend nos tickets seguintes.
- Gap pré-existente: `contextLoads` exige PostgreSQL; a suíte completa do backend não roda sem banco.
