import { useState, FormEvent } from 'react'
import { forgotPassword } from '../../services/authService'
import styles from '../auth.module.css'

type Props = {
  onGoToLogin: () => void
  onGoToReset: (token: string) => void
}

export function ForgotPasswordPage({ onGoToLogin, onGoToReset }: Props) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Preencha o e-mail.')
      return
    }

    setIsLoading(true)

    try {
      const data = await forgotPassword(email)
      setMessage(data.message)

      // Em ambiente de desenvolvimento, o token vem na resposta
      if (data.devToken) {
        setTimeout(() => onGoToReset(data.devToken!), 1500)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar recuperação.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>⏱ Chronos</h1>
          <p>Recuperar senha</p>
        </div>

        {error && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>
        )}

        {message && (
          <div className={`${styles.feedback} ${styles.feedbackSuccess}`}>{message}</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">E-mail cadastrado</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar instruções'}
          </button>

          <div className={styles.links}>
            <button type="button" className={styles.linkButton} onClick={onGoToLogin}>
              Voltar para o login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
