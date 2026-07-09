# MyLeagueTracker

MyLeagueTracker e uma API para acompanhar suas gameplays de modo carreira e as informações dela como: temporadas, elencos, jogadores, transferencias e conquistas em ligas de futebol.

## Tecnologias

- Java 17
- Spring Boot 4.1.0
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

## Estrutura do projeto

```bash
.
|-- README.md
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

## Como executar com Docker

Entre na pasta do backend:

```bash
cd leaguetracker-backend
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
Porta: 5432
Banco: league_tracker
Usuario: leaguetracker_admin
Senha: leaguetracker_password
```

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

## Variaveis de ambiente

| Variavel                     | Obrigatoria         | Valor padrao                                      | Descricao                                             |
| ---------------------------- | ------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `SPRING_DATASOURCE_URL`      | Nao                 | `jdbc:postgresql://localhost:5432/league_tracker` | URL de conexao com o PostgreSQL                       |
| `SPRING_DATASOURCE_USERNAME` | Nao                 | `leaguetracker_admin`                             | Usuario do banco                                      |
| `SPRING_DATASOURCE_PASSWORD` | Nao                 | `leaguetracker_password`                          | Senha do banco                                        |
| `JWT_SECRET`                 | Nao                 | `mysecretkey`                                     | Chave usada para assinar tokens JWT                   |
| `API_FOOTBALL_KEY`           | Para importar ligas | `your_api_key_here`                               | Chave da API Football usada no endpoint de importacao |

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

## Testes

Para rodar os testes:

```bash
cd leaguetracker-backend
./mvnw test
```

## Build

Para gerar o build da aplicacao:

```bash
cd leaguetracker-backend
./mvnw clean package
```

O arquivo gerado ficara em:

```bash
leaguetracker-backend/target/
```
