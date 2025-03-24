# Parthos Task API

Este repositório serve como um modelo para criação de APIs utilizando NestJS.

> **⚠ IMPORTANTE:** Ao iniciar um novo projeto, renomeie todas as instâncias de `parthos-task-api` para o nome desejado da sua API.

---

## Índice

1. [Instalação](#instalacao)
2. [Configuração do Ambiente](#configuracao-do-ambiente)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Uso](#uso)
5. [Docker](#docker)
6. [Testes](#testes)
7. [Integração Contínua](#integracao-continua)
8. [Contribuição](#contribuicao)
9. [Licença](#licenca)

---

## Instalação

Clone este repositório e renomeie-o para o nome do seu projeto:

```bash
$ git clone https://github.com/Gaiteiro2025/parthos-task-api.git meu-projeto-api
$ cd meu-projeto-api
```

Instale as dependências:

```bash
$ npm install
```

---

## Configuração do Ambiente

Antes de rodar o projeto, crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias.

Exemplo de `.env`:

```ini
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=nestdb
JWT_SECRET=default_secret
JWT_EXPIRATION=1h
```

---

## Estrutura do Projeto

O template inclui um exemplo de módulo de **usuários** como referência para organização de **módulos, serviços e repositórios**.

**Estrutura de diretórios:**

```
├── src
│   ├── users  # Exemplo de CRUD completo
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── users.module.ts
│   ├── auth   # Módulo de autenticação
│   ├── main.ts
│   ├── app.module.ts
├── test       # Testes unitários e e2e
├── .github    # CI/CD com GitHub Actions
├── docker-compose.yml
└── README.md
```

Você pode **remover** ou **modificar** o módulo `users` conforme sua necessidade.

Se quiser criar novos módulos, siga a mesma estrutura e registre-os no `AppModule`.

---

## Uso

Para iniciar a aplicação em modo de desenvolvimento:

```bash
$ npm run start:dev
```

A API estará disponível em: [http://localhost:3002](http://localhost:3002)

A documentação Swagger estará em: [http://localhost:3002/api](http://localhost:3002/api)

---

## Docker

O projeto inclui suporte ao Docker para facilitar a execução e os testes.

### Subir o ambiente de desenvolvimento

```bash
$ docker-compose up --build
```

Com o contêiner rodando, aplique as migrations:

```bash
$ docker exec -it meu-projeto-api sh -c "npm run typeorm:migrate src/migrations/CreateUserTable"
```

### Rodar os testes em um container

```bash
docker-compose -f docker-compose.test.yml up
```

### Acessar o container para execução manual

```bash
$ docker exec -it meu-projeto-api sh
```

Para o ambiente de testes:

```bash
$ docker exec -it meu-projeto-test-api sh
```

---

## Testes

### Testes Unitários

```bash
$ npm run test
```

### Testes de Cobertura

```bash
$ npm run test:cov
```

### Testes End-to-End (E2E)

```bash
$ npm run test:e2e
```

### Testes com Docker Compose

```bash
docker-compose -f docker-compose.test.yml up
```

---

## Integração Contínua

O projeto utiliza GitHub Actions para rodar os testes automaticamente nas PRs para `main`.

Arquivo `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  pull_request:
    branches:
      - main

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm run test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run E2E tests
        run: npm run test:e2e
```

---

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m 'Minha nova feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

---

## Licença

Este projeto está sob a licença [MIT](LICENSE).

