export type TodoStatus = 'todo' | 'in progress' | 'done'

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
	seq?: number
	createdAt: string
	updatedAt: string
}
