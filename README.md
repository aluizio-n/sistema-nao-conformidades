# QualidadePIM - Sistema de Registro de Nao Conformidades

Sistema web para registro, acompanhamento e encerramento de nao conformidades de qualidade industrial. Projeto final do modulo Full Stack - INDT.

## Stack

- **Frontend:** Angular 21 + Tailwind CSS
- **Backend:** Node.js + Express 5 + TypeScript
- **Banco de dados:** PostgreSQL 15
- **ORM:** TypeORM

## Pre-requisitos

- Node.js 20+
- Docker e Docker Compose
- Angular CLI (`npm install -g @angular/cli`)

## Instalacao e execucao

### 1. Banco de dados

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
npm run seed    # popula o banco com dados de exemplo
npm run dev     # inicia o servidor na porta 3000
```

### 3. Frontend

```bash
cd frontend
npm install
ng serve        # inicia o frontend na porta 4200
```

Acesse `http://localhost:4200` no navegador.

## Credenciais de teste

| Email               | Senha  | Perfil      |
|---------------------|--------|-------------|
| carlos@qualidade.com | 123456 | Inspetor    |
| ana@qualidade.com    | 123456 | Gestor      |
| pedro@qualidade.com  | 123456 | Responsavel |

## Funcionalidades

- Login com JWT
- Dashboard com indicadores (NCs abertas, criticas, prazo vencido, encerradas no mes)
- Ranking dos 3 tipos de desvio mais recorrentes
- Abertura de NCs com titulo, descricao, tipo, gravidade, linha e setor
- Listagem com filtros por status, gravidade, tipo e busca
- Detalhe da NC com atribuicao de responsavel, prazo e causa raiz
- Ciclo de vida com transicoes controladas (aberta -> em_tratamento -> aguardando_verificacao -> encerrada)
- Tela "Minha Fila" com NCs atribuidas ao usuario logado, ordenadas por prazo
- Acoes corretivas vinculadas a NCs com responsavel, prazo e evidencia

## API Endpoints

| Metodo | Rota              | Descricao                    |
|--------|-------------------|------------------------------|
| POST   | /api/auth/login   | Autenticacao                 |
| GET    | /api/usuarios     | Lista usuarios ativos        |
| GET    | /api/ncs          | Lista NCs (com filtros)      |
| POST   | /api/ncs          | Cria nova NC                 |
| GET    | /api/ncs/:id      | Detalhe da NC                |
| PATCH  | /api/ncs/:id      | Atualiza NC                  |
| GET    | /api/minha-fila   | NCs do usuario logado        |
| GET    | /api/ncs/:id/acoes| Lista acoes corretivas       |
| POST   | /api/ncs/:id/acoes| Cria acao corretiva          |
| PATCH  | /api/acoes/:id    | Atualiza acao corretiva      |
| GET    | /api/dashboard    | Indicadores e ranking        |
