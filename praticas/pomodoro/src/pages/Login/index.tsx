import { useState, useEffect, useRef, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { loginUser } from '../../services/authService'
import styles from '../auth.module.css'

type Props = {
  onGoToRegister: () => void
  onGoToForgot: () => void
}

export function LoginPage({ onGoToRegister, onGoToForgot }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { saveSession } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.')
      return
    }

    setIsLoading(true)

    try {
      const { token, user } = await loginUser(email, password)
      saveSession(token, user)
      navigate('/home')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>⏱ Chronos</h1>
          <p>Gerencie seu tempo com foco</p>
        </div>

        {error && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className={styles.links}>
            <button type="button" className={styles.linkButton} onClick={onGoToForgot}>
              Esqueci minha senha
            </button>
            <button type="button" className={styles.linkButton} onClick={onGoToRegister}>
              Não tem conta? Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
