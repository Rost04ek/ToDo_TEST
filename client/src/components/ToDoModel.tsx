export type TodoStatus = 'Todo' | 'In Progress' | 'Done'

export interface AuthUser {
	id: number
	username: string
	email: string
}

export interface AuthResponse {
	token: string
	user: AuthUser
}

export interface TodoItem {
	id: number
	title: string
	description: string
	status: TodoStatus
	userId: number
	createdAt: string
	updatedAt: string
}
