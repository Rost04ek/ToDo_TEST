import { useState } from 'react'

import api from '../api/axios'
import type { AuthResponse } from '../components/ToDoModel'

interface RegisterProps {
	onSuccess: (token: string, user: AuthResponse['user']) => void
}

function Register({ onSuccess }: RegisterProps) {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setLoading(true)

		try {
			const { data } = await api.post<AuthResponse>('/auth/register', {
				username,
				email,
				password,
			})
			onSuccess(data.token, data.user)
		} catch (submitError) {
			setError('Could not create account with those details')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form className="auth-card" onSubmit={handleSubmit}>
			<p className="eyebrow">Start here</p>
			<h2>Create account</h2>

			<label>
				Name
				<input value={username} onChange={(event) => setUsername(event.target.value)} />
			</label>

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
				{loading ? 'Creating...' : 'Create account'}
			</button>
		</form>
	)
}

export default Register
