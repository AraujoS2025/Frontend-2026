import { useState } from 'react'
import { LoginPage } from './Login'
import { RegisterPage } from './Register'
import { ForgotPasswordPage } from './ForgotPassword'
import { ResetPasswordPage } from './ResetPassword'

type View = 'login' | 'register' | 'forgot' | 'reset'

export function AuthPage() {
  const [view, setView] = useState<View>('login')
  const [resetToken, setResetToken] = useState('')

  function handleGoToReset(token: string) {
    setResetToken(token)
    setView('reset')
  }

  if (view === 'register') {
    return <RegisterPage onGoToLogin={() => setView('login')} />
  }

  if (view === 'forgot') {
    return (
      <ForgotPasswordPage
        onGoToLogin={() => setView('login')}
        onGoToReset={handleGoToReset}
      />
    )
  }

  if (view === 'reset') {
    return (
      <ResetPasswordPage
        token={resetToken}
        onGoToLogin={() => setView('login')}
      />
    )
  }

  return (
    <LoginPage
      onGoToRegister={() => setView('register')}
      onGoToForgot={() => setView('forgot')}
    />
  )
}
