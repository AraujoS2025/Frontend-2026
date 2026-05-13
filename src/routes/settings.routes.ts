import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const settingsRouter = Router()

const SETTINGS_ID = 1

const DEFAULT_SETTINGS = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
}

settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: SETTINGS_ID },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: SETTINGS_ID, ...DEFAULT_SETTINGS },
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
      error: 'Payload inválido. workTime, shortBreakTime e longBreakTime devem ser números.',
    })
  }

  if (workTime <= 0 || shortBreakTime <= 0 || longBreakTime <= 0) {
    return res.status(400).json({
      error: 'Os tempos devem ser maiores que zero.',
    })
  }

  try {
    const settings = await prisma.settings.upsert({
      where: { id: SETTINGS_ID },
      update: { workTime, shortBreakTime, longBreakTime },
      create: { id: SETTINGS_ID, workTime, shortBreakTime, longBreakTime },
    })

    return res.json(settings)
  } catch (error) {
    console.error('[PUT /settings]', error)
    return res.status(500).json({ error: 'Erro interno ao salvar configurações.' })
  }
})
