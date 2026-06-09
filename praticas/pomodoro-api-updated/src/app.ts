import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.routes'
import { settingsRouter } from './routes/settings.routes'
import { tasksRouter } from './routes/tasks.routes'

export const app = express()

app.use(cors())
app.use(express.json())

// Rotas públicas
app.use('/auth', authRouter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() })
})

// Rotas protegidas (o middleware é aplicado dentro de cada router)
app.use('/settings', settingsRouter)
app.use('/tasks', tasksRouter)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' })
})
