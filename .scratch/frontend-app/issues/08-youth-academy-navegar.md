# 08: Youth Academy: navegar a base

**What to build:** O User vê a Youth Academy de uma Career.

**Blocked by:** 05

**Status:** ready-for-agent

- [x] `/careers/{id}/youth` usa os mesmos dados do dashboard da Career que o Central Squad, compartilhando o cache.
- [x] Mostra total de prospectos, potential médio e o Youth Player de maior potential em destaque.
- [x] Lista Youth Players com nome, idade, posição (quando houver match), overall, potential, role e valor.
- [x] O estado vazio explica que a academia não tem jovens, sem botão morto; a ação de adicionar chega no ticket 09.
- [x] Loading e erro se comportam como no Central Squad.
- [x] Testes cobrem métricas, destaque, lista, vazio e erro.

## Comments

- **2026-11-13** — Implementado.
- `/careers/:id/youth` reaproveita o `CareerDashboard` do `CareerLayout` (mesma query/contexto do Central Squad), sem fetch próprio.
- Métricas de total e potential médio, destaque do maior potential e grid de jovens com posição enriquecida, idade, role, overall/potential e valor.
- Estado vazio sem botão morto; loading e erro delegados ao shell da carreira, com erro coberto por teste.
- `useSquadPositions` passou a aceitar qualquer jogador enriquecível, reutilizado por Central Squad e Youth Academy.
- Testes: 54 no frontend. `npm run typecheck`, `npm run lint` e `npm run build` passam.
