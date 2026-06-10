import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middlewares/auth.middleware'

export const tasksRouter = Router()

tasksRouter.use(authMiddleware)

function serializeTask(task: any) {
  return {
    ...task,
    startDate: task.startDate?.toString(),
    completeDate: task.completeDate?.toString() ?? null,
    interruptDate: task.interruptDate?.toString() ?? null,
  }
}

tasksRouter.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { startDate: 'desc' },
    })
    return res.json(tasks.map(serializeTask))
  } catch (error) {
    console.error('[GET /tasks]', error)
    return res.status(500).json({ error: 'Erro interno ao buscar tarefas.' })
  }
})

tasksRouter.post('/', async (req: Request, res: Response) => {
  const { id, name, duration, type, startDate } = req.body

  if (!id || !name || typeof duration !== 'number' || !type || !startDate) {
    return res.status(400).json({ error: 'Payload inválido.' })
  }

  const validTypes = ['workTime', 'shortBreakTime', 'longBreakTime']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `type deve ser: ${validTypes.join(', ')}.` })
  }

  try {
    const task = await prisma.task.create({
      data: { id, name, duration, type, startDate: BigInt(startDate), userId: req.userId! },
    })
    return res.status(201).json(serializeTask(task))
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe uma task com esse id.' })
    }
    console.error('[POST /tasks]', error)
    return res.status(500).json({ error: 'Erro interno ao criar tarefa.' })
  }
})

tasksRouter.patch('/:id/complete', async (req: Request, res: Response) => {
  const { id } = req.params
  const { completeDate } = req.body

  if (typeof completeDate !== 'number') {
    return res.status(400).json({ error: 'completeDate deve ser um número.' })
  }

  try {
    const task = await prisma.task.findFirst({ where: { id, userId: req.userId } })
    if (!task) return res.status(404).json({ error: 'Task não encontrada.' })

    const updated = await prisma.task.update({
      where: { id },
      data: { completeDate: BigInt(completeDate) },
    })
    return res.json(serializeTask(updated))
  } catch (error) {
    console.error('[PATCH /tasks/:id/complete]', error)
    return res.status(500).json({ error: 'Erro interno.' })
  }
})

tasksRouter.patch('/:id/interrupt', async (req: Request, res: Response) => {
  const { id } = req.params
  const { interruptDate } = req.body

  if (typeof interruptDate !== 'number') {
    return res.status(400).json({ error: 'interruptDate deve ser um número.' })
  }

  try {
    const task = await prisma.task.findFirst({ where: { id, userId: req.userId } })
    if (!task) return res.status(404).json({ error: 'Task não encontrada.' })

    const updated = await prisma.task.update({
      where: { id },
      data: { interruptDate: BigInt(interruptDate) },
    })
    return res.json(serializeTask(updated))
  } catch (error) {
    console.error('[PATCH /tasks/:id/interrupt]', error)
    return res.status(500).json({ error: 'Erro interno.' })
  }
})

tasksRouter.delete('/', async (req: Request, res: Response) => {
  try {
    await prisma.task.deleteMany({ where: { userId: req.userId } })
    return res.status(204).send()
  } catch (error) {
    console.error('[DELETE /tasks]', error)
    return res.status(500).json({ error: 'Erro interno.' })
  }
})
