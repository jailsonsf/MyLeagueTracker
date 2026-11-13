# 05: Central Squad: navegar o elenco principal

**What to build:** O User abre uma Career e navega pelo Principal Squad, com a posição resolvida a partir do catálogo de jogadores quando possível e "—" quando não for.

**Blocked by:** 04

**Status:** ready-for-agent

- [x] O shell dentro da Career mostra Club, Manager, um trocador que volta ao Dashboard e navegação para Central Squad e Youth Academy.
- [x] O Central Squad carrega `GET /api/careers/{id}/dashboard` e lista Squad Players com kit ("—" quando 0), nome, posição, idade, overall, potential, role e valor.
- [x] A busca filtra por nome no cliente.
- [x] Selecionar um jogador abre o detalhe com barras de overall/potential nas cores e faixas do design system, role, pé preferido, ano de entrada, valor, salário e nacionalidade.
- [x] A posição vem de match exato e case-insensitive no catálogo, desempatado pelo overall mais próximo; ausências mostram "—"; resultados são cacheados e a concorrência é limitada.
- [x] Nomes e bandeiras de países vêm de `GET /api/countries`; elenco vazio mostra a chamada para adicionar jogador.
- [x] No mobile a lista ocupa a tela e o detalhe abre em tela cheia com voltar; no desktop lista e detalhe ficam lado a lado.
- [x] Testes cobrem lista, busca, detalhe, enriquecimento com acerto e ausência, e elenco vazio.

## Comments

- **2026-11-13** — Implementado.
- Shell da carreira em `CareerLayout`: clube, manager, orçamento, "Trocar carreira" e navegação Elenco/Academia na sidebar e nas bottom tabs.
- Central Squad: lista com kit ("—" quando 0), posição enriquecida, nome, idade, overall/potential, role e valor; busca por nome; detalhe com barras, nacionalidade/bandeira, pé, ano de entrada, valor e salário; vazio com chamada para adicionar (desabilitada com "Em breve" até o ticket 07).
- Enriquecimento: match exato case-insensitive no catálogo, desempate pelo overall mais próximo, fallback "—", cache do TanStack Query e limite de 4 requisições concorrentes.
- Mobile: detalhe em tela cheia com voltar; desktop em duas colunas.
- Testes: 39 no frontend (lista, busca, detalhe, acerto/ausência de enriquecimento, vazio e navegação). `npm run typecheck`, `npm run lint` e `npm run build` passam.
- Placeholder temporário: `/careers/:id/youth` será substituído pelo ticket 08.
