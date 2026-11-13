# 10: PWA instalável com shell offline

**What to build:** O app pode ser instalado na tela inicial e abre o shell sem conexão de rede.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] Manifest com nome, cores de tema/fundo, modo de exibição e ícones; instalável no Chromium.
- [ ] O service worker precacheia o shell e serve o fallback de SPA para rotas client-side.
- [ ] Abrir uma rota desconhecida ou recarregar offline mostra o shell, não o erro do navegador.
- [ ] Respostas da API nunca são cacheadas pelo service worker.
- [ ] O build continua funcional quando instalado e atualizado após um novo deploy.
- [ ] Testes verificam o manifest e o reload offline.
