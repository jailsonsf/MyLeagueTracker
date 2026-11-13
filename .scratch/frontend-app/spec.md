# Frontend do MyLeagueTracker

Status: ready-for-agent

## Problem Statement

O MyLeagueTracker hoje é apenas uma API. Para registrar uma carreira de EA FC, o gerente precisa montar requisições no Swagger ou no `curl`: criar carreira, consultar elenco, adicionar jovens e promover jogadores. Os mockups em `frontend/example/` mostram a experiência desejada, mas são HTML estático sem dados, sem autenticação e sem ligação com o backend. Não existe interface utilizável para acompanhar as carreiras no dia a dia.

## Solution

Uma aplicação web responsiva em pt-BR, instalável como PWA, que autentica o usuário e oferece as seis telas do produto: login, cadastro, Dashboard (seleção de carreira), novo save, Central Squad e Youth Academy. O app consome a API existente, com apenas duas mudanças habilitadoras no backend: CORS e exposição do `careerSquadId` no dashboard da carreira. Transferências, Estatísticas e Configurações aparecem desabilitadas como "Em breve".

## User Stories

1. Como usuário, quero entrar com username ou email e senha, para acessar minhas carreiras.
2. Como usuário, quero ver uma mensagem clara quando minhas credenciais estiverem erradas, para corrigir o que digitei.
3. Como usuário, quero continuar logado ao recarregar a página, para não repetir o login a cada visita.
4. Como usuário, quero ser levado ao login quando minha sessão expirar, para não ficar preso em telas vazias.
5. Como usuário, quero sair da conta, para proteger meus dados em um computador compartilhado.
6. Como novo usuário, quero me cadastrar com username, email e senha, para começar a usar o app.
7. Como novo usuário, quero ser autenticado automaticamente após o cadastro, para não digitar a senha duas vezes.
8. Como novo usuário, quero saber quando o username ou email já estão em uso, para escolher outro.
9. Como usuário, quero ver a lista das minhas carreiras em cards, para escolher qual continuar.
10. Como usuário, quero ver em cada card o clube, o game, o manager, a data de início e o orçamento, para reconhecer a carreira.
11. Como usuário sem carreiras, quero um estado vazio com chamada para criar a primeira, para saber o próximo passo.
12. Como usuário, quero um botão de criar carreira sempre visível no Dashboard, para iniciar um novo save.
13. Como usuário, quero filtrar a lista de clubes por nome ao criar uma carreira, para achar meu time rapidamente.
14. Como usuário, quero escolher o game (EA FC 24, 25 ou 26), para registrar a versão correta.
15. Como usuário, quero informar meu nome de manager, para personalizar a carreira.
16. Como usuário, quero informar um orçamento opcional, para registrar a situação financeira inicial.
17. Como usuário, quero que nome e escudo do clube sejam preenchidos a partir do clube escolhido, para não digitar duas vezes.
18. Como usuário, quero poder digitar um nome de time quando o catálogo de clubes estiver vazio, para não ficar bloqueado.
19. Como usuário, quero ver erros de validação no formulário antes de enviar, para corrigir sem tentativa e erro.
20. Como usuário, quero ser levado ao Central Squad da carreira recém-criada, para começar a montar o elenco.
21. Como usuário, quero ver o elenco principal em lista com nome, posição, idade, overall, potential, role e valor, para avaliar o plantel.
22. Como usuário, quero buscar um jogador pelo nome dentro do elenco, para encontrá-lo rápido.
23. Como usuário, quero selecionar um jogador e ver seus detalhes completos, para decidir sobre renovação ou venda.
24. Como usuário, quero ver overall e potential em barras com cores por faixa, para comparar jogadores de relance.
25. Como usuário, quero ver nacionalidade e bandeira do jogador, para contextualizar o elenco.
26. Como usuário, quero ver "—" quando a posição de um jogador não existir no catálogo, para não exibir informação inventada.
27. Como usuário, quero adicionar um jogador ao elenco principal, para registrar uma contratação.
28. Como usuário, quero que o formulário de jogador mostre apenas campos que serão realmente salvos, para não perder dados silenciosamente.
29. Como usuário, quero ver uma confirmação após adicionar um jogador, para saber que a ação funcionou.
30. Como usuário, quero ver o elenco vazio com uma chamada para adicionar o primeiro jogador, para entender como começar.
31. Como usuário, quero ver os jovens da academia em lista, para acompanhar a base.
32. Como usuário, quero ver o total de prospectos e o potential médio da academia, para avaliar a qualidade da base.
33. Como usuário, quero ver o prospecto de maior potential em destaque, para priorizar o desenvolvimento.
34. Como usuário, quero adicionar um jovem à academia, para registrar uma nova promessa.
35. Como usuário, quero promover um jovem ao elenco principal com confirmação, para evitar promoção acidental.
36. Como usuário, quero ver o jovem desaparecer da academia e aparecer no elenco após a promoção, para confirmar a mudança.
37. Como usuário, quero navegar entre Dashboard, Central Squad e Youth Academy pela sidebar no desktop, para alternar de contexto.
38. Como usuário, quero navegar por bottom tabs no mobile, para usar o app com uma mão.
39. Como usuário, quero trocar de carreira pelo cabeçalho, para voltar à seleção sem perder o contexto.
40. Como usuário, quero ver Transferências, Estatísticas e Configurações desabilitadas com "Em breve", para saber que existirão.
41. Como usuário, quero que a interface se adapte de desktop para celular, para usar o app em qualquer tela.
42. Como usuário, quero instalar o app na tela inicial, para abri-lo como um aplicativo.
43. Como usuário, quero que o shell do app abra offline, para não ver a tela em branco sem conexão.
44. Como usuário, quero ver skeletons enquanto os dados carregam, para entender que algo está acontecendo.
45. Como usuário, quero tentar de novo quando uma requisição falhar, para me recuperar de erros temporários.
46. Como usuário, quero valores monetários e datas formatados em pt-BR, para ler os dados naturalmente.
47. Como usuário de teclado, quero navegar e fechar diálogos com Esc, para usar o app sem mouse.

## Implementation Decisions

**Stack e estrutura.** React 19 + TypeScript + Vite, Tailwind CSS v4 (tema CSS-first derivado do `frontend/example/DESIGN.md`), TanStack Router e TanStack Query, Radix/shadcn estilizados à mão, Material Symbols Outlined, Epilogue/Manrope self-hosted, React Hook Form + Zod, React Context para autenticação. Código em `frontend/app/`; `frontend/example/` permanece intocado como referência visual.

**Rotas.** `/login`, `/register`, `/` (Dashboard), `/careers/new`, `/careers/:careerId/squad`, `/careers/:careerId/youth`. Não há tela de visão geral da carreira nesta fase; após criar uma carreira o usuário vai para o Central Squad, e o item "Dashboard" retorna à seleção.

**Módulos.** `lib/api` (client `fetch` tipado e tipos espelhando os DTOs), `features/auth`, `features/careers`, `features/squad`, `features/youth`, `components/ui`, `components/layout`, `i18n` (strings pt-BR centralizadas), `lib/format` (moeda/data).

**Contratos consumidos.** `POST /auth/login` recebe `{ login, password }` e devolve `{ token }`; `POST /auth/register` recebe `{ username, email, password }` e devolve texto; `GET /api/careers`; `POST /api/careers`; `GET /api/careers/:id/dashboard`; `GET /api/clubs`; `GET /api/countries`; `GET /api/catalog/players?fullName=`; `POST /api/squad/players`; `POST /api/squad/youth-players`; `POST /api/squad/youth-players/:id/promote`.

**Backend.** Duas mudanças apenas: (1) configuração de CORS com origens controladas por ambiente, default `http://localhost:5173`, métodos `GET/POST/PATCH/DELETE/OPTIONS` e headers `Authorization`/`Content-Type`, integrada à cadeia do Spring Security; (2) novo campo `careerSquadId` no topo de `CareerDashboardDTO`, retrocompatível, para permitir adicionar o primeiro jogador de uma carreira nova.

**Autenticação.** Token em `localStorage` sob chave própria; `sub` e `exp` decodificados no cliente; logout agendado para o `exp`; 401/403 tratados como sessão expirada; logout é limpeza local. Username da conta vem do `sub`; o nome exibido dentro da carreira vem de `careerInfo.manager`. Cadastro cria sempre USER; não há UI de admin.

**Central Squad e enriquecimento.** Lista e detalhe na mesma tela a partir de `lg`; no mobile, lista em tela cheia e detalhe com botão voltar. A posição vem de `GET /api/catalog/players?fullName=`, com match exato case-insensitive, desempate pelo menor delta entre `overall` do catálogo e `currentOverall` do elenco, fallback "—", cache por nome e concorrência máxima de 4. País e bandeira vêm de `GET /api/countries` em cache. `kitNumber` 0 é exibido como "—" porque o backend o ignora na criação.

**Formulários.** Novo save: game, manager, clube (busca client-side em `/api/clubs`) e budget opcional; sem difficulty; nome e escudo derivados do clube; fallback de nome livre se o catálogo estiver vazio. Adicionar jogador/youth: apenas `fullName`, `age`, `yearJoinedClub`, `currentOverall`, `potentialOverall`, `currentMarketValue`, `preferredFoot`, `role`, `countryId` e o `careerSquadId` oculto. Campos ignorados pelo backend não aparecem. Validação client-side porque o backend não valida.

**Layout.** Desktop com sidebar fixa, top bar com clube, trocador de carreira e conta. Mobile com bottom tabs (Dashboard, Elenco, Academia), top bar compacta; itens desabilitados não aparecem nas tabs. Login esconde o hero abaixo de `lg`; formulários viram bottom sheet no mobile.

**PWA e entrega.** Manifest, ícones e shell offline via `vite-plugin-pwa`, sem cache de dados da API. Build estático com `VITE_API_URL`; CORS no backend. `npm` e Node 20+.

**Vocabulário.** Career, Career Squad, Principal Squad, Squad Player, Youth Player, Manager, User, Game Title, Club, Season, Trophy, Transfer, Dashboard, Central Squad, Youth Academy — conforme `GLOSSARY.md`.

## Testing Decisions

Um teste bom verifica comportamento externo: o que o usuário vê e faz, e qual contrato HTTP o app envia. Nunca classes CSS, hooks internos ou formato de estado.

O seam é único: a fronteira HTTP. Testes de integração renderizam rotas reais com TanStack Router (memória) e TanStack Query, servindo contratos via MSW. O smoke de Playwright usa o mesmo contrato contra o backend real.

Módulos testados:

- `lib/api` — montagem de URL/headers, tratamento de erro JSON e texto, 401/403.
- `features/auth` — login, cadastro com auto-login, persistência, expiração, logout.
- `lib/enrichment` — matcher por nome (unidade pura): nome exato, homônimos, ausência, normalização.
- Telas — Dashboard (lista, vazio, erro), Novo save (validação, busca de clube, submit), Central Squad (lista, busca, detalhe, enriquecimento com fallback, adicionar jogador), Youth Academy (métricas, destaque, adicionar, promover).
- Layout — navegação desktop e bottom tabs mobile em viewports distintos.
- Playwright — login → Dashboard → novo save → Central Squad → adicionar jogador → Youth Academy → promover.

Pré-art: não existe suíte frontend; a única referência é o teste de contexto do Spring. Este spec estabelece a convenção de um seam só. Fixtures MSW são derivadas dos DTOs do backend.

## Out of Scope

- Transferências, Estatísticas de jogador, Configurações e "Advance Calendar" (apenas desabilitados).
- Telas de Season, Trophy e Transfer.
- UI administrativa, papéis e permissões além de USER.
- Correções nos bugs de ownership (`email` vs `username`) e no `POST /api/transfer`.
- Importação de jogadores/ligas e gestão do catálogo.
- Editar ou excluir carreiras e jogadores (não há endpoints).
- Apps nativos iOS/Android.
- Cache offline de dados, sincronização e multiusuário em tempo real.
- i18n além do pt-BR (strings centralizadas para permitir depois).

## Further Notes

**Quirks do backend que o app precisa absorver.** Login usa o campo `login`; login devolve só `token`; cadastro devolve texto puro e 400 em duplicidade; token inválido pode gerar 500, mitigado pela checagem de `exp`; chamadas sem token tendem a 403; `GET /api/clubs` traz jogadores aninhados e é pesado; `POST /api/squad/players` ignora `startingOverall`, `currentWage`, `image` e `kitNumber`; youth ignora também `heightCm` e `weightKg`; não há `GET /api/careers/:id` nem listagem de squad fora do dashboard.

**Decisões registradas em ADR.** Stack React SPA + Vite; adaptação ao backend existente com apenas CORS e `careerSquadId`; JWT em `localStorage` com expiração no cliente.

**Tracker.** Este spec vive no tracker local em markdown, em `.scratch/frontend-app/spec.md`, com status `ready-for-agent`.
