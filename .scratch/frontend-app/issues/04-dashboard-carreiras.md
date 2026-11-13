# 04: Dashboard: minhas carreiras

**What to build:** O User vê suas Careers em cards e consegue abrir uma delas.

**Blocked by:** 02

**Status:** ready-for-agent

- [x] `/` consulta `GET /api/careers` e renderiza cards com nome/escudo do clube, Game Title, Manager, data de início e orçamento, formatados em pt-BR.
- [x] O estado vazio explica que não há Careers e oferece "Criar carreira".
- [x] O loading mostra skeletons; a falha mostra retry que refaz a consulta.
- [x] Selecionar um card navega para o Central Squad da Career.
- [x] Card sem escudo usa fallback de gradiente com iniciais.
- [x] Testes cobrem lista, vazio, erro e navegação.

## Comments

- **2026-11-13** — Implementado.
- O Dashboard consulta `GET /api/careers` e renderiza cards com escudo (fallback de iniciais), Game Title, Manager, data de início e orçamento em pt-BR.
- Estados: skeletons no loading, vazio com "Criar carreira" e erro com "Tentar novamente".
- Cards navegam para `/careers/:careerId/squad`; o CTA do vazio vai para `/careers/new`. Ambos são placeholders temporários, substituídos pelos tickets 05 e 06.
- Testes: 29 no frontend. `npm test`, `npm run typecheck`, `npm run lint` e `npm run build` passam.
