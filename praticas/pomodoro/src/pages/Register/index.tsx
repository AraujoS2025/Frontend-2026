import { useState, FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { registerUser } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import styles from '../auth.module.css'

type Props = {
  onGoToLogin: () => void
}

export function RegisterPage({ onGoToLogin }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { saveSession } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      const { token, user } = await registerUser(name, email, password)
      saveSession(token, user)
      navigate('/home')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>⏱ Chronos</h1>
          <p>Crie sua conta</p>
        </div>

        {error && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Criar conta'}
          </button>

          <div className={styles.links}>
            <button type="button" className={styles.linkButton} onClick={onGoToLogin}>
              Já tem conta? Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
