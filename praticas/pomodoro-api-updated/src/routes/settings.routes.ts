import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middlewares/auth.middleware'

export const settingsRouter = Router()

// Todas as rotas de settings exigem autenticação
settingsRouter.use(authMiddleware)

const DEFAULT_SETTINGS = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
}

settingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: req.userId },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: { ...DEFAULT_SETTINGS, userId: req.userId! },
      })
    }

    return res.json(settings)
  } catch (error) {
    console.error('[GET /settings]', error)
    return res.status(500).json({ error: 'Erro interno ao buscar configurações.' })
  }
})

settingsRouter.put('/', async (req: Request, res: Response) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body

  if (
    typeof workTime !== 'number' ||
    typeof shortBreakTime !== 'number' ||
    typeof longBreakTime !== 'number'
  ) {
    return res.status(400).json({
      error: 'workTime, shortBreakTime e longBreakTime devem ser números.',
    })
  }

  if (workTime <= 0 || shortBreakTime <= 0 || longBreakTime <= 0) {
    return res.status(400).json({ error: 'Os tempos devem ser maiores que zero.' })
  }

  try {
    const settings = await prisma.settings.upsert({
      where: { userId: req.userId },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { workTime, shortBreakTime, longBreakTime, userId: req.userId! },
    })

    return res.json(settings)
  } catch (error) {
    console.error('[PUT /settings]', error)
    return res.status(500).json({ error: 'Erro interno ao salvar configurações.' })
  }
})
