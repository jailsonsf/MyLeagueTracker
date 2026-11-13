# 06: Nova carreira

**What to build:** O User cria uma Career pela interface e cai no Central Squad vazio dela.

**Blocked by:** 05

**Status:** ready-for-agent

- [x] `/careers/new` coleta Game Title, Manager, Club e orçamento opcional.
- [x] O seletor de Club busca no `GET /api/clubs` cacheado, no cliente, e mostra nome/escudo.
- [x] Escolher um Club preenche nome e escudo do time; se o catálogo estiver vazio, um nome de time em texto livre é aceito.
- [x] Validação client-side bloqueia Manager/time vazios e orçamento inválido; falha do backend mostra retry.
- [x] Submit chama `POST /api/careers`, mostra toast de sucesso e navega para o Central Squad da nova Career.
- [x] Testes cobrem busca de Club, fallback de nome livre, validação, sucesso e falha.

## Comments

- **2026-11-13** — Implementado.
- `/careers/new` com Game Title em segmented control, Manager, Club (busca client-side sobre `GET /api/clubs` cacheado, com escudo e rating) e orçamento opcional.
- Fallback de nome livre quando o catálogo está vazio ("Não encontro meu clube"); validação de manager, time e orçamento.
- `POST /api/careers` com toast de sucesso e navegação para `/careers/:id/squad`; falha exibe retry.
- `ToastProvider` global, reutilizável pelos próximos tickets.
- Testes: 47 no frontend. `npm run typecheck`, `npm run lint` e `npm run build` passam.
