# 10: PWA instalável com shell offline

**What to build:** O app pode ser instalado na tela inicial e abre o shell sem conexão de rede.

**Blocked by:** 02

**Status:** ready-for-agent

- [x] Manifest com nome, cores de tema/fundo, modo de exibição e ícones; instalável no Chromium.
- [x] O service worker precacheia o shell e serve o fallback de SPA para rotas client-side.
- [x] Abrir uma rota desconhecida ou recarregar offline mostra o shell, não o erro do navegador.
- [x] Respostas da API nunca são cacheadas pelo service worker.
- [x] O build continua funcional quando instalado e atualizado após um novo deploy.
- [x] Testes verificam o manifest e o reload offline.

## Comments

- **2026-11-13** — Implementado.
- Manifest instalavel: `standalone`, `pt-BR`, cores do design, icones 192/512/maskable e `start_url`/`scope` na raiz.
- `vite-plugin-pwa`/Workbox com `generateSW`, `autoUpdate`, precache do shell/fontes/manifest e `navigateFallback` para rotas client-side.
- `/api` e `/auth` fora do fallback; `runtimeCaching` vazio, entao nenhuma resposta de API e cacheada.
- `maximumFileSizeToCacheInBytes` elevado para incluir a fonte Material Symbols; precache final de 73 entradas (~5,2 MB).
- `npm run test:pwa` valida manifest, icones, precache, fallback e denylist; teste unitario cobre o contrato do manifest.
- Reload offline verificado em Firefox headless: service worker ativo controlando a pagina, preview desligado e a tela de login renderizada do cache.
- Testes: 62 no frontend. `npm run typecheck`, `npm run lint`, `npm run build` e `npm run test:pwa` passam.
