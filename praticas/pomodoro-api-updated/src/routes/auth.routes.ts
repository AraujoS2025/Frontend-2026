import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from '../lib/prisma'

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'

// POST /auth/register — cadastro de novo usuário
authRouter.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' })
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' })
    }

    // Hash da senha com bcrypt (nunca salvar senha em texto puro)
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions)

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('[POST /auth/register]', error)
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' })
  }
})

// POST /auth/login — autenticação
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions)

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('[POST /auth/login]', error)
    return res.status(500).json({ error: 'Erro interno ao realizar login.' })
  }
})

// POST /auth/forgot-password — solicitar recuperação de senha
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    // Sempre retorna sucesso para não revelar se o e-mail existe
    if (!user) {
      return res.json({
        message: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
      })
    }

    // Gera token seguro com validade de 1 hora
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.passwordResetToken.create({
      data: { token, expiresAt, userId: user.id },
    })

    // Em produção: enviar por e-mail. Em laboratório: retorna o token na resposta.
    console.log(`[RESET TOKEN para ${email}]: ${token}`)

    return res.json({
      message: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
      // Apenas em ambiente de desenvolvimento — remover em produção
      devToken: process.env.NODE_ENV !== 'production' ? token : undefined,
    })
  } catch (error) {
    console.error('[POST /auth/forgot-password]', error)
    return res.status(500).json({ error: 'Erro interno.' })
  }
})

// POST /auth/reset-password — redefinir senha com token
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' })
  }

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido.' })
    }

    if (resetToken.used) {
      return res.status(400).json({ error: 'Token já utilizado.' })
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ error: 'Token expirado.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Atualiza a senha e marca o token como usado
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    })

    return res.json({ message: 'Senha redefinida com sucesso.' })
  } catch (error) {
    console.error('[POST /auth/reset-password]', error)
    return res.status(500).json({ error: 'Erro interno.' })
  }
})
