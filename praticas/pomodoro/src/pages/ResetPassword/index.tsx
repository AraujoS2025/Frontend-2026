import { useState, FormEvent } from 'react'
import { resetPassword } from '../../services/authService'
import styles from '../auth.module.css'

type Props = {
  token: string
  onGoToLogin: () => void
}

export function ResetPasswordPage({ token, onGoToLogin }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!newPassword || !confirm) {
      setError('Preencha todos os campos.')
      return
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (newPassword !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(token, newPassword)
      setMessage('Senha redefinida com sucesso!')
      setTimeout(() => onGoToLogin(), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>⏱ Chronos</h1>
          <p>Nova senha</p>
        </div>

        {error && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>
        )}

        {message && (
          <div className={`${styles.feedback} ${styles.feedbackSuccess}`}>{message}</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="newPassword">Nova senha</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm">Confirmar senha</label>
            <input
              id="confirm"
              type="password"
              placeholder="Repita a nova senha"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
