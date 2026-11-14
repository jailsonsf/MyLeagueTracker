# 07: Adicionar um Squad Player ao elenco principal

**What to build:** O User adiciona um Squad Player ao Principal Squad da Career ativa.

**Blocked by:** 05

**Status:** ready-for-agent

- [x] O formulário oferece apenas campos que a API persiste: nome completo, idade, ano de entrada, overall atual, potential, valor de mercado, pé preferido, role e país; `careerSquadId` vem da Career, oculto.
- [x] As opções de país vêm de `GET /api/countries`; role e pé preferido aparecem rotulados em pt-BR.
- [x] Validação client-side exige os campos obrigatórios e faixas plausíveis.
- [x] Submit envia para a API, fecha o formulário, refaz a consulta do Central Squad e mostra toast.
- [x] A ação é acessível pelo cabeçalho e pela chamada do elenco vazio.
- [x] Testes cobrem sucesso, validação, erro do servidor e o caminho do elenco vazio.

## Comments

- **2026-11-13** — Implementado.
- Modal responsivo (bottom sheet no mobile, diálogo no desktop) com React Hook Form + Zod.
- Campos apenas persistidos: nome, idade, ano de entrada, overall, potential, valor de mercado, pé, role e país; `careerSquadId` oculto.
- Países de `GET /api/countries`; role e pé rotulados em pt-BR; validação de faixas e de potential >= overall.
- Sucesso: toast, fecha o modal e invalida a query da carreira; erro do servidor mantém o formulário aberto com alerta.
- Entradas: botão no cabeçalho e CTA do elenco vazio (agora habilitado).
- Testes: 51 no frontend. `npm run typecheck`, `npm run lint` e `npm run build` passam.
