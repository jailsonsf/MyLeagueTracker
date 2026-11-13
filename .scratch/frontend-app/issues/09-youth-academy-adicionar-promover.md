# 09: Youth Academy: adicionar e promover

**What to build:** O User adiciona um Youth Player à academia e promove um jovem ao Principal Squad.

**Blocked by:** 07, 08

**Status:** ready-for-agent

- [ ] O formulário de jovem reusa as convenções do formulário de Squad Player e oferece apenas campos de youth que a API persiste; países vêm da API.
- [ ] Submit adiciona o jovem, refaz a consulta da academia e mostra toast; a chamada do estado vazio passa a abrir o formulário.
- [ ] Promover pede confirmação nomeando o Youth Player, chama a promoção, refaz as consultas e mostra toast.
- [ ] Após a promoção, o jovem some da academia e aparece no Principal Squad na próxima consulta.
- [ ] Validação, erro do servidor e proteção contra duplo submit estão cobertos.
- [ ] Testes cobrem adicionar com sucesso e com erro, promover com confirmar/cancelar e a atualização entre as duas telas.
