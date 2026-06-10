import { BrowserRouter } from 'react-router-dom'
import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider'
import { MessagesContainer } from './components/MessagesContainer'
import { MainRouter } from './routers/MainRouter'
import { AuthContextProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import { AuthPage } from './pages/AuthPage'
import './styles/theme.css'
import './styles/global.css'

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <TaskContextProvider>
      <MessagesContainer />
      <MainRouter />
    </TaskContextProvider>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppContent />
      </AuthContextProvider>
    </BrowserRouter>
  )
}
