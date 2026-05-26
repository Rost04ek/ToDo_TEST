import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import api from '../api/axios'
import type { TodoItem, TodoStatus } from '../components/ToDoModel'
import ToDoCard from '../components/ToDoCard'

interface ToDoBoardProps {
	onSessionExpired: () => void
}


const statuses: Array<'all' | TodoStatus> = ['all', 'todo', 'in progress', 'done']

function ToDoBoard({ onSessionExpired }: ToDoBoardProps) {
	const [filter, setFilter] = useState<'all' | TodoStatus>('all')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState<TodoStatus>('todo')
	const queryClient = useQueryClient()

	const todosQuery = useQuery({
		queryKey: ['todos', filter],
		queryFn: async () => {
			const { data } = await api.get<TodoItem[]>('/todos', {
				params: filter === 'all' ? {} : { status: filter },
			})

			return data
		},
	})

	const createMutation = useMutation({
		mutationFn: async () => {
			const { data } = await api.post<TodoItem>('/todos', {
				title,
				description,
				status,
			})

			return data
		},
		onSuccess: async () => {
			setTitle('')
			setDescription('')
			setStatus('todo')
			await queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: (error) => {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				onSessionExpired()
			}
		},
	})

	const updateMutation = useMutation({
		mutationFn: async ({ id, nextStatus }: { id: number; nextStatus: TodoStatus }) => {
			const { data } = await api.put<TodoItem>(`/todos/${id}`, { status: nextStatus })
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: (error) => {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				onSessionExpired()
			}
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: number) => {
			await api.delete(`/todos/${id}`)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: (error) => {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				onSessionExpired()
			}
		},
	})



	const prettyLabel = (item: string) => {
		if (item === 'all') return 'All tasks'
		if (item === 'todo') return 'To Do'
		return item
			.split(' ')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ')
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		await createMutation.mutateAsync()
	}

	return (
		<section className="board-shell board-shell--stacked">
			<div className="board-panel board-panel--form">
				<div className="board-panel__header">
					<div>
						<h2>Add a task</h2>
					</div>
				</div>

				<form className="todo-form" onSubmit={handleSubmit}>
					<label>
						Title
						<input className="form-input" value={title} onChange={(event) => setTitle(event.target.value)} />
					</label>

					<label>
						Description
						<textarea
							className="form-input"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							rows={4}
						/>
					</label>

					<label>
						Status
						<select className="form-input" value={status} onChange={(event) => setStatus(event.target.value as TodoStatus)}>
							<option value="todo">To Do</option>
							<option value="in progress">In Progress</option>
							<option value="done">Done</option>
						</select>
					</label>

					<button className="primary-button full-width" type="submit" disabled={createMutation.isPending}>
						{createMutation.isPending ? 'Saving...' : 'Create task'}
					</button>
				</form>
			</div>

			<div className="board-panel">
				<div className="board-panel__header">
					<div>
						<h2>Tasks</h2>
					</div>

					<div className="filter-group">
						<span className="filter-label muted-copy">Filter:</span>
						<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
							{statuses.map((item) => (
								<option key={item} value={item}>
									{prettyLabel(item)}
								</option>
							))}
						</select>
					</div>
				</div>

				{todosQuery.isLoading ? <p className="muted-copy">Loading tasks...</p> : null}
				{todosQuery.isError ? <p className="form-error">Unable to load tasks.</p> : null}

				<div className="todo-list">
					{(todosQuery.data ?? []).map((todo) => (
						<ToDoCard
							key={todo.id}
							todo={todo}
							onStatusChange={(id, nextStatus) => updateMutation.mutate({ id, nextStatus })}
							onDelete={(id) => deleteMutation.mutate(id)}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default ToDoBoard
