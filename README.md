# Parthos - Transforme seus problemas em solução

[![GitHub repo size](https://img.shields.io/github/repo-size/Gaiteiro2025/parthos-task-api)](https://github.com/Gaiteiro2025/parthos-task-api)
[![GitHub last commit](https://img.shields.io/github/last-commit/Gaiteiro2025/parthos-task-api)](https://github.com/Gaiteiro2025/parthos-task-api/commits/main)
[![GitHub Release](https://img.shields.io/github/v/release/Gaiteiro2025/parthos-task-api)](https://github.com/Gaiteiro2025/parthos-task-api/releases)
[![GitHub issues](https://img.shields.io/github/issues/Gaiteiro2025/parthos-task-api)](https://github.com/Gaiteiro2025/parthos-task-api/issues)
[![GitHub license](https://img.shields.io/github/license/Gaiteiro2025/parthos-task-api)](https://github.com/Gaiteiro2025/parthos-task-api/blob/main/LICENSE)

O **Parthos Task API** é o microserviço responsável pelo gerenciamento de tarefas dentro do ecossistema Parthos.

## Estrutura do Projeto

- **src/**: Código-fonte principal.
- **.env**: Arquivo de variáveis de ambiente.
- **docker-compose.yml**: Configuração para rodar via Docker.
- **tests/**: Testes unitários e de integração.

---

## Como Rodar o Projeto

### 1. Clone o Repositório
```sh
git clone git@github.com:Gaiteiro2025/parthos-task-api.git
cd parthos-task-api
```

### 2. Instale as Dependências
```sh
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e defina as variáveis:
```sh
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=nestdb
JWT_SECRET=default_secret
JWT_EXPIRATION=1h
```

### 4. Execute a Aplicação
```sh
npm run start:dev
```
A API estará disponível em: [http://localhost:3002](http://localhost:3002)

A documentação Swagger estará em: [http://localhost:3002/api](http://localhost:3002/api)

---

## Docker

### Subir o ambiente
```sh
docker-compose up --build
```

### Aplicar Migrations
```sh
docker exec -it parthos-task-api sh -c "npm run typeorm:migrate src/migrations/CreateTaskTable"
```

### Acessar o Container
```sh
docker exec -it parthos-task-api sh
```

---

## Testes

### Rodar Testes Unitários
```sh
npm run test
```

### Cobertura de Testes
```sh
npm run test:cov
```

### Testes End-to-End (E2E)
```sh
npm run test:e2e
```

---

## CI/CD

O projeto utiliza **GitHub Actions** para testes automáticos.

---

## Licença

Este projeto está sob a **licença MIT**. Veja o arquivo [LICENSE](https://github.com/Gaiteiro2025/parthos-task-api/blob/main/LICENSE) para mais detalhes.

