# MyLeagueTracker

MyLeagueTracker e uma aplicacao para acompanhar suas gameplays de modo carreira e as informacoes dela como: temporadas, elencos, jogadores, transferencias e conquistas em ligas de futebol. O projeto inclui a API Spring Boot e uma interface web em React.

## Tecnologias

- Java 17
- Spring Boot 4.0.3
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Bean Validation
- PostgreSQL
- Maven Wrapper
- Docker e Docker Compose
- JWT com `java-jwt`
- OpenCSV
- Springdoc OpenAPI / Swagger UI
- Lombok

Frontend:

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- TanStack Router e TanStack Query
- vite-plugin-pwa / Workbox
- Vitest + Testing Library + MSW

## Estrutura do projeto

```bash
.
|-- AGENTS.md
|-- GLOSSARY.md
|-- README.md
|-- docs/
|   |-- adr/
|   `-- agents/
|-- frontend/
|   |-- app/        # aplicacao React
|   `-- example/    # mockups estaticos de referencia de design
`-- leaguetracker-backend/
    |-- Dockerfile
    |-- docker-compose.yml
    |-- mvnw
    |-- pom.xml
    `-- src/
```

## Pre-requisitos

Para executar com Docker:

- Docker
- Docker Compose

Para executar localmente sem Docker:

- Java 17
- PostgreSQL 15 ou superior
- Maven, ou apenas o Maven Wrapper que ja vem no projeto

Para executar o frontend:

- Node.js 20 ou superior
- npm

## Como executar com Docker

Entre na pasta do backend e crie o arquivo `.env` a partir do exemplo:

```bash
cd leaguetracker-backend
cp .env.example .env
```

Preencha as variaveis do banco usadas pelo Compose:

```bash
DB_USERNAME=leaguetracker_admin
DB_PASSWORD=leaguetracker_password
DB_NAME=league_tracker
```

Suba a API e o banco de dados:

```bash
docker compose up --build
```

A aplicacao ficara disponivel em:

```bash
http://localhost:8080
```

O PostgreSQL sera criado com as seguintes credenciais:

```bash
Host: localhost
Porta: 5433
Banco: league_tracker
Usuario: leaguetracker_admin
Senha: leaguetracker_password
```

O Compose expoe o banco na porta `5433` do host; dentro da rede do Compose a API usa `db:5432`.

Para parar os containers:

```bash
docker compose down
```

Para parar e remover tambem o volume do banco:

```bash
docker compose down -v
```

## Como executar localmente

Crie um banco PostgreSQL chamado `league_tracker` e configure as variaveis de ambiente, se quiser sobrescrever os valores padrao:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/league_tracker
export SPRING_DATASOURCE_USERNAME=leaguetracker_admin
export SPRING_DATASOURCE_PASSWORD=leaguetracker_password
export JWT_SECRET=sua_chave_secreta
export API_FOOTBALL_KEY=sua_chave_da_api_football
export CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Depois execute:

```bash
cd leaguetracker-backend
./mvnw spring-boot:run
```

No Windows, use:

```bash
mvnw.cmd spring-boot:run
```

## Como executar o frontend

Com o backend rodando em `http://localhost:8080`:

```bash
cd frontend/app
cp .env.example .env
npm install
npm run dev
```

Acesse:

```bash
http://localhost:5173
```

`VITE_API_URL` aponta para a API (default `http://localhost:8080`).

O build gera um PWA instalavel: manifest, icones e service worker. O shell e as fontes sao precacheados; chamadas para `/api` e `/auth` nao sao cacheadas e ficam fora do fallback de navegacao. O service worker nao roda no `npm run dev`; use o preview do build:

```bash
npm run test:pwa   # build + validacao do manifest e do service worker
npm run preview    # serve dist/ em http://localhost:4173
```

O backend libera por padrao a origem `http://localhost:5173`. Se o Vite usar outra porta (por exemplo `5174`), reinicie o backend com a origem extra. Rodando localmente, exporte antes de iniciar; no Compose, adicione `CORS_ALLOWED_ORIGINS` ao ambiente do servico `app`:

```bash
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

O cadastro publico cria usuarios `USER`. O login aceita username ou email.

## Variaveis de ambiente

| Variavel                     | Obrigatoria         | Valor padrao                                      | Descricao                                             |
| ---------------------------- | ------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `SPRING_DATASOURCE_URL`      | Nao                 | `jdbc:postgresql://localhost:5432/league_tracker` | URL de conexao com o PostgreSQL                       |
| `SPRING_DATASOURCE_USERNAME` | Nao                 | `leaguetracker_admin`                             | Usuario do banco                                      |
| `SPRING_DATASOURCE_PASSWORD` | Nao                 | `leaguetracker_password`                          | Senha do banco                                        |
| `JWT_SECRET`                 | Nao                 | `mysecretkey`                                     | Chave usada para assinar tokens JWT                   |
| `API_FOOTBALL_KEY`           | Para importar ligas | `your_api_key_here`                               | Chave da API Football usada no endpoint de importacao |
| `CORS_ALLOWED_ORIGINS`       | Nao                 | `http://localhost:5173`                           | Origens liberadas para o frontend, separadas por virgula |

No frontend, `VITE_API_URL` (default `http://localhost:8080`) e lida no momento do build.

## Documentacao da API

Com a aplicacao rodando, acesse:

```bash
http://localhost:8080/swagger-ui.html
```

Ou a especificacao OpenAPI:

```bash
http://localhost:8080/v3/api-docs
```

## Principais rotas

- `POST /auth/register`
- `POST /auth/login`
- `PATCH /auth/admin/update-role`
- `GET /api/countries`
- `GET /api/clubs`
- `GET /api/leagues`
- `GET /api/catalog/players`
- `POST /api/careers`
- `GET /api/careers`
- `GET /api/careers/{id}/dashboard`
- `POST /api/season`
- `GET /api/season/career/{careerId}`
- `POST /api/squad/players`
- `GET /api/squad/youth-players`
- `POST /api/squad/youth-players`
- `POST /api/transfer`
- `POST /api/trophies`
- `POST /api/import/players`
- `POST /api/import/leagues`

As rotas protegidas precisam do token JWT retornado no login:

```
Authorization: Bearer seu_token
```

### Rotas do frontend

- `/login`
- `/register`
- `/` - Dashboard (selecao de carreira)
- `/careers/new`
- `/careers/:careerId/squad` - Central Squad
- `/careers/:careerId/youth` - Youth Academy

## Dados de referencia

A tela de nova carreira consulta `GET /api/clubs`, e a posicao dos jogadores e enriquecida a partir de `GET /api/catalog/players`. Em um banco novo esses dados comecam vazios:

- sem clubes importados, o formulario de nova carreira aceita nome de time em texto livre;
- sem catalogo, a posicao aparece como "—";
- os paises vem de `GET /api/countries`.

Para popular:

- `POST /api/import/leagues` (requer `ROLE_ADMIN` e `API_FOOTBALL_KEY`) importa ligas, clubes e paises;
- `POST /api/import/players` (multipart, campo `file`, requer `ROLE_ADMIN`) importa o catalogo de jogadores via CSV.

O cadastro publico cria sempre `USER`. Para rodar imports, e necessario um usuario `ADMIN` (criado via banco ou promovido por `PATCH /auth/admin/update-role`). No Compose, adicione `API_FOOTBALL_KEY` ao ambiente do servico `app` para que o import de ligas funcione.

## Testes

### Backend

Com o PostgreSQL rodando:

```bash
cd leaguetracker-backend
./mvnw test
```

Os testes dos enablers de CORS e do dashboard nao precisam de banco:

```bash
./mvnw test -Dtest=CareerServiceTest,CorsConfigTest,CorsPreflightTest
```

### Frontend

```bash
cd frontend/app
npm test
npm run typecheck
npm run lint
npm run test:pwa
```

## Build

### Backend

Para gerar o build da aplicacao:

```bash
cd leaguetracker-backend
./mvnw clean package
```

O arquivo gerado ficara em:

```bash
leaguetracker-backend/target/
```

### Frontend

```bash
cd frontend/app
npm run build
```

O bundle fica em `frontend/app/dist` e usa o `VITE_API_URL` definido no momento do build. O mesmo build gera o manifest, os icones e o service worker do PWA.
