import { useState } from 'react'

import api from '../api/axios'
import type { AuthResponse } from '../components/ToDoModel'

interface LoginProps {
	onSuccess: (token: string, user: AuthResponse['user']) => void
}

function Login({ onSuccess }: LoginProps) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setLoading(true)

		try {
			const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
			onSuccess(data.token, data.user)
		} catch (err) {
			console.error(err)
			setError('Invalid email or password')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form className="auth-card card" onSubmit={handleSubmit}>
			<h2>Sign in</h2>

			<label>
				Email
				<input className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
			</label>

			<label>
				Password
				<input
					className="form-input"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					type="password"
				/>
			</label>

			{error ? <p className="form-error">{error}</p> : null}

			<button className="primary-button full-width" type="submit" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	)
}

export default Login
