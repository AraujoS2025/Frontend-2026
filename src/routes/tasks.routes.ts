import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const tasksRouter = Router()

tasksRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { startDate: 'desc' },
    })

    return res.json(tasks)
  } catch (error) {
    console.error('[GET /tasks]', error)
    return res.status(500).json({ error: 'Erro interno ao buscar tarefas.' })
  }
})

tasksRouter.post('/', async (req: Request, res: Response) => {
  const { id, name, duration, type, startDate } = req.body

  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof duration !== 'number' ||
    typeof type !== 'string' ||
    typeof startDate !== 'number'
  ) {
    return res.status(400).json({
      error: 'Payload inválido. Verifique os campos: id (string), name (string), duration (number), type (string), startDate (number).',
    })
  }

  if (!name.trim()) {
    return res.status(400).json({ error: 'O campo name não pode ser vazio.' })
  }

  if (duration <= 0) {
    return res.status(400).json({ error: 'O campo duration deve ser maior que zero.' })
  }

  const validTypes = ['workTime', 'shortBreakTime', 'longBreakTime']
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: `O campo type deve ser um dos valores: ${validTypes.join(', ')}.`,
    })
  }

  try {
    const task = await prisma.task.create({
      data: { id, name, duration, type, startDate },
    })

    return res.status(201).json(task)
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
    return res.status(400).json({ error: 'O campo completeDate deve ser um número (timestamp).' })
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { completeDate },
    })

    return res.json(task)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: `Task com id "${id}" não encontrada.` })
    }
    console.error('[PATCH /tasks/:id/complete]', error)
    return res.status(500).json({ error: 'Erro interno ao concluir tarefa.' })
  }
})

tasksRouter.patch('/:id/interrupt', async (req: Request, res: Response) => {
  const { id } = req.params
  const { interruptDate } = req.body

  if (typeof interruptDate !== 'number') {
    return res.status(400).json({ error: 'O campo interruptDate deve ser um número (timestamp).' })
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { interruptDate },
    })

    return res.json(task)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: `Task com id "${id}" não encontrada.` })
    }
    console.error('[PATCH /tasks/:id/interrupt]', error)
    return res.status(500).json({ error: 'Erro interno ao interromper tarefa.' })
  }
})

tasksRouter.delete('/', async (_req: Request, res: Response) => {
  try {
    await prisma.task.deleteMany()
    return res.status(204).send()
  } catch (error) {
    console.error('[DELETE /tasks]', error)
    return res.status(500).json({ error: 'Erro interno ao limpar histórico.' })
  }
})
