import React, { useState, useContext, type FormEvent } from 'react';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'recover';

export default function Login() {
  const { login } = useContext(AuthContext);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  
  // NOVO: Estado para controlar a visualização da senha
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); 
    
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const success = login(cleanUsername, cleanPassword);
    
    if (success) {
      alert('Bem-vindo(a) ao Chronos Pomodoro!'); 
      setFeedback(''); 
    } else {
      setFeedback('Usuário ou senha incorretos.');
    }
  };

  if (viewMode === 'register') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Criar uma conta</h2>
          <p style={{ marginBottom: '1.5rem', color: '#c4c4cc', lineHeight: '1.5' }}>
            A funcionalidade de cadastro (simulação) será implementada em breve.
          </p>
          <button type="button" onClick={() => setViewMode('login')} className={styles.button} style={{ width: '100%' }}>
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'recover') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Recuperar senha</h2>
          <p style={{ marginBottom: '1.5rem', color: '#c4c4cc', lineHeight: '1.5' }}>
            A funcionalidade de recuperação de senha (simulação) será implementada em breve.
          </p>
          <button type="button" onClick={() => setViewMode('login')} className={styles.button} style={{ width: '100%' }}>
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Acessar Chronos</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Usuário</label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: admin"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            {/* NOVO: Div em volta do input e do botão para alinhá-los juntos */}
            <div className={styles.passwordWrapper}>
              <input 
                id="password"
                // A MÁGICA: Se showPassword for true, vira texto. Se false, vira bolinhas.
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex: 1234"
                required
              />
              <button 
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>

        {feedback && (
          <div className={`${styles.feedback} ${styles.error}`} style={{ marginTop: '1rem' }}>
            {feedback}
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.linkButton} onClick={() => setViewMode('recover')}>
            Esqueci minha senha
          </button>
          <button type="button" className={styles.linkButton} onClick={() => setViewMode('register')}>
            Criar uma conta
          </button>
        </div>
      </div>
    </div>
  );
}