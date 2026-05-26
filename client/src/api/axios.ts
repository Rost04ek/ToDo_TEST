import axios from 'axios'

import type { AuthUser } from '../components/ToDoModel'

export const TOKEN_KEY = 'todo_token'
export const USER_KEY = 'todo_user'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
})

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

export const getStoredUser = (): AuthUser | null => {
	const rawUser = localStorage.getItem(USER_KEY)

	if (!rawUser) {
		return null
	}

	try {
		return JSON.parse(rawUser) as AuthUser
	} catch {
		return null
	}
}

export const saveSession = (token: string, user: AuthUser) => {
	localStorage.setItem(TOKEN_KEY, token)
	localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearSession = () => {
	localStorage.removeItem(TOKEN_KEY)
	localStorage.removeItem(USER_KEY)
}

api.interceptors.request.use((config) => {
	const token = getStoredToken()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

export default api
