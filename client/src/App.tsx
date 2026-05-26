import { useState } from 'react'

import './App.css'

import NavBar from './components/NavBar'
import type { AuthUser } from './components/ToDoModel'
import Login from './pages/Login'
import Register from './pages/Register'
import ToDoBoard from './pages/ToDoBoard'
import { clearSession, getStoredUser, saveSession } from './api/axios'

function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<AuthUser | null>(getStoredUser())

  const handleAuthSuccess = (token: string, authenticatedUser: AuthUser) => {
    saveSession(token, authenticatedUser)
    setUser(authenticatedUser)
  }

  const handleLogout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <main className="app-shell">
      {user ? (
        <>
          <NavBar user={user} onLogout={handleLogout} />
          <ToDoBoard onSessionExpired={handleLogout} />
        </>
      ) : (
        <section className="auth-layout auth-center">
          <div className="auth-switcher card">
            <div className="auth-tabs">
              <button
                className={authView === 'login' ? 'tab-button tab-button--active' : 'tab-button'}
                type="button"
                onClick={() => setAuthView('login')}
              >
                Login
              </button>
              <button
                className={authView === 'register' ? 'tab-button tab-button--active' : 'tab-button'}
                type="button"
                onClick={() => setAuthView('register')}
              >
                Register
              </button>
            </div>

            {authView === 'login' ? (
              <Login onSuccess={handleAuthSuccess} />
            ) : (
              <Register onSuccess={handleAuthSuccess} />
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
