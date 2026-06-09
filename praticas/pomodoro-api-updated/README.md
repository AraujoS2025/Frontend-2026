# 🍅 Pomodoro API

API REST com **Express + Prisma + MySQL** para o projeto Pomodoro.

---

## Pré-requisitos

- Node.js 18+
- MySQL rodando localmente (porta 3306)

---

## Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Criar o banco de dados no MySQL
# Abra o MySQL e rode:
# CREATE DATABASE pomodoro_db;

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais MySQL se necessário

# 4. Rodar a migration (cria as tabelas)
npx prisma migrate dev --name init

# 5. Subir o servidor em modo dev
npm run dev
```

O servidor sobe em: **http://localhost:3333**

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Verifica se a API está no ar |
| GET | `/settings` | Retorna configurações do Pomodoro |
| PUT | `/settings` | Atualiza configurações |
| GET | `/tasks` | Lista todas as tasks (ordem: mais recentes) |
| POST | `/tasks` | Cria uma nova task |
| PATCH | `/tasks/:id/complete` | Marca task como completa |
| PATCH | `/tasks/:id/interrupt` | Marca task como interrompida |
| DELETE | `/tasks` | Limpa todo o histórico |

---

## Exemplos de uso

### GET /health
```
GET http://localhost:3333/health
```
Resposta:
```json
{ "ok": true, "timestamp": "2024-01-01T00:00:00.000Z" }
```

### GET /settings
```
GET http://localhost:3333/settings
```
Resposta:
```json
{
  "id": 1,
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /settings
```
PUT http://localhost:3333/settings
Content-Type: application/json

{
  "workTime": 30,
  "shortBreakTime": 5,
  "longBreakTime": 20
}
```

### POST /tasks
```
POST http://localhost:3333/tasks
Content-Type: application/json

{
  "id": "uuid-aqui",
  "name": "Estudar TypeScript",
  "duration": 25,
  "type": "work",
  "startDate": 1704067200000
}
```

### PATCH /tasks/:id/complete
```
PATCH http://localhost:3333/tasks/uuid-aqui/complete
Content-Type: application/json

{
  "completeDate": 1704068700000
}
```

### PATCH /tasks/:id/interrupt
```
PATCH http://localhost:3333/tasks/uuid-aqui/interrupt
Content-Type: application/json

{
  "interruptDate": 1704068000000
}
```

### DELETE /tasks
```
DELETE http://localhost:3333/tasks
```
Resposta: `204 No Content`

---

## Scripts disponíveis

```bash
npm run dev          # Servidor em modo desenvolvimento (hot reload)
npm run build        # Compila TypeScript para dist/
npm start            # Roda a versão compilada
npm run prisma:migrate  # Roda migrations
npm run prisma:studio   # Abre o Prisma Studio (GUI do banco)
```

---

## Estrutura do projeto

```
pomodoro-api/
  prisma/
    schema.prisma       # Modelos do banco (Settings, Task)
  src/
    lib/
      prisma.ts         # Instância do PrismaClient
    routes/
      settings.routes.ts  # GET /settings, PUT /settings
      tasks.routes.ts     # CRUD de tasks
    app.ts              # Configuração do Express
    server.ts           # Entry point
  .env                  # Variáveis de ambiente
  .env.example          # Template do .env
  package.json
  tsconfig.json
```
