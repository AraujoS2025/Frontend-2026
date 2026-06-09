import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret'

// Extende o tipo Request do Express para incluir o userId
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }

  const [, token] = authorization.split(' ')

  if (!token) {
    return res.status(401).json({ error: 'Token malformado.' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = payload.userId
    return next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}
