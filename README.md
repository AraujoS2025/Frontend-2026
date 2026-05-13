# Chronos API

Backend da aplicação Pomodoro Chronos. Construído com Express, Prisma e MySQL.

## Pré-requisitos

- Node.js 18+
- MySQL rodando localmente (ou via Docker)

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo `.env.example` para `.env` e preencha com seus dados de conexão:

```bash
cp .env.example .env
```

Edite o `.env`:

```
DATABASE_URL="mysql://root:sua_senha@localhost:3306/chronos"
PORT=3333
```

## Banco de dados

Crie o banco `chronos` no MySQL, depois rode a migration:

```bash
npm run db:migrate
```

## Rodando em desenvolvimento

```bash
npm run dev
```

O servidor sobe em `http://localhost:3333`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /health | Verifica se a API está no ar |
| GET | /settings | Retorna as configurações do Pomodoro |
| PUT | /settings | Atualiza as configurações |
| GET | /tasks | Lista todas as tarefas |
| POST | /tasks | Cria uma nova tarefa |
| PATCH | /tasks/:id/complete | Marca tarefa como concluída |
| PATCH | /tasks/:id/interrupt | Marca tarefa como interrompida |
| DELETE | /tasks | Remove todo o histórico |

## Exemplo — PUT /settings

```json
{
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15
}
```

## Exemplo — POST /tasks

```json
{
  "id": "1718000000000",
  "name": "Estudar TypeScript",
  "duration": 25,
  "type": "workTime",
  "startDate": 1718000000000
}
```
