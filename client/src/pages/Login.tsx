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
		} catch (submitError) {
			setError('Invalid email or password')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form className="auth-card" onSubmit={handleSubmit}>
			<p className="eyebrow">Welcome back</p>
			<h2>Sign in</h2>

			<label>
				Email
				<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
			</label>

			<label>
				Password
				<input
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					type="password"
				/>
			</label>

			{error ? <p className="form-error">{error}</p> : null}

			<button className="primary-button" type="submit" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	)
}

export default Login
