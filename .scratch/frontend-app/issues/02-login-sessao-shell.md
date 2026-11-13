# 02: Login, sessão e shell autenticado

**What to build:** Um User consegue entrar com username ou email, permanecer autenticado ao recarregar, sair e navegar por um shell autenticado com a navegação do produto.

**Blocked by:** 01

**Status:** ready-for-agent

- [x] `/login` envia `{ login, password }`, guarda o token devolvido e decodifica `sub` e `exp` no cliente.
- [x] Credenciais erradas exibem mensagem clara em pt-BR; falha de rede ou 5xx oferece retry.
- [x] Recarregar mantém a sessão; `exp` vencido redireciona para `/login` com aviso; 401/403 limpa a sessão.
- [x] Rotas protegidas redirecionam Users não autenticados para `/login`.
- [x] Logout limpa o token e retorna para `/login`.
- [x] O shell mostra sidebar no desktop e bottom tabs no mobile; Transferências, Estatísticas e Configurações aparecem desabilitadas com "Em breve" no desktop; o menu de conta expõe logout.
- [x] Testes no seam HTTP cobrem login com sucesso e falha, persistência, expiração e logout.

## Comments

- **2026-11-13** — Implementado.
- Sessão em `localStorage` com `sub`/`exp` decodificados, expiração agendada e handler de 401/403 limpando a sessão.
- Login com React Hook Form + Zod, mensagens pt-BR, retry em falha de rede/5xx e redirecionamento para `/`.
- Shell: sidebar no desktop com Transferências/Estatísticas/Configurações e "Avançar calendário" desabilitados com "Em breve"; bottom tabs no mobile; menu de conta (Radix) com logout.
- Guarda de rota: visitante sem sessão e sessão expirada vão para `/login`; aviso de sessão expirada.
- Testes: 20 no frontend (sessão, client HTTP, login, guarda, expiração, logout, 401/403). `npm test`, `npm run typecheck`, `npm run lint` e `npm run build` passam.
- Gap: as bottom tabs têm só Dashboard até o ticket 05 adicionar Elenco e Academia.
- Nota de performance: Material Symbols (4 MB) e chunk JS de 537 kB devem ser otimizados no ticket 10.
