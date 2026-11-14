# 03: Cadastro com auto-login

**What to build:** Um novo User consegue criar sua conta e entrar no app imediatamente, sem um segundo login.

**Blocked by:** 02

**Status:** ready-for-agent

- [x] `/register` coleta username, email e senha com validação client-side (obrigatórios, formato de email, tamanho mínimo de senha).
- [x] Cadastro bem-sucedido chama a API e, em seguida, faz login automático com as mesmas credenciais, caindo no Dashboard.
- [x] Username ou email já em uso exibe uma mensagem pt-BR clara, sem vazar o texto cru do backend.
- [x] A tela de login aponta para o cadastro e o cadastro aponta de volta para o login.
- [x] Testes cobrem sucesso, duplicidade e falha de validação.

## Comments

- **2026-11-13** — Implementado.
- `/register` com username, email e senha; validação Zod (3 caracteres, email válido, 6 caracteres), duplicidade em pt-BR e auto-login após o cadastro.
- `registerAccount` no client HTTP, com o corpo exato esperado pela API; erros de duplicidade não vazam o texto cru do backend.
- `AuthLayout` e estilos de formulário compartilhados entre login e cadastro; links cruzados entre as duas telas.
- Testes: 26 no frontend. `npm test`, `npm run typecheck`, `npm run lint` e `npm run build` passam.
