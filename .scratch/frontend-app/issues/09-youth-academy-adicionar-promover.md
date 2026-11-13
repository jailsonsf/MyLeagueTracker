# 09: Youth Academy: adicionar e promover

**What to build:** O User adiciona um Youth Player à academia e promove um jovem ao Principal Squad.

**Blocked by:** 07, 08

**Status:** ready-for-agent

- [x] O formulário de jovem reusa as convenções do formulário de Squad Player e oferece apenas campos de youth que a API persiste; países vêm da API.
- [x] Submit adiciona o jovem, refaz a consulta da academia e mostra toast; a chamada do estado vazio passa a abrir o formulário.
- [x] Promover pede confirmação nomeando o Youth Player, chama a promoção, refaz as consultas e mostra toast.
- [x] Após a promoção, o jovem some da academia e aparece no Principal Squad na próxima consulta.
- [x] Validação, erro do servidor e proteção contra duplo submit estão cobertos.
- [x] Testes cobrem adicionar com sucesso e com erro, promover com confirmar/cancelar e a atualização entre as duas telas.

## Comments

- **2026-11-13** — Implementado.
- `PlayerForm` compartilhado entre squad e youth: campos persistidos, países da API, validação e erro.
- Adicionar jovem: modal, toast e invalidação da query; CTA do estado vazio e botão do cabeçalho.
- Promover: confirmação nomeando o jovem, `POST` de promoção, toast e invalidação; erro mantém o diálogo aberto.
- Duplo submit bloqueado por `isSubmitting` no formulário e `isPromoting` na confirmação.
- Teste de ponta a ponta: promove, a academia esvazia e o jovem aparece no Central Squad.
- Testes: 60 no frontend. `npm run typecheck`, `npm run lint` e `npm run build` passam.
