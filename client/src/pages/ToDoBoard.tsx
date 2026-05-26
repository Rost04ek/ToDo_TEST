import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '../api/axios'
import type { TodoItem, TodoStatus } from '../components/ToDoModel'
import ToDoCard from '../components/ToDoCard'

interface ToDoBoardProps {
	onSessionExpired: () => void
}

const statuses: Array<'All' | TodoStatus> = ['All', 'Todo', 'In Progress', 'Done']

function ToDoBoard({ onSessionExpired }: ToDoBoardProps) {
	const [filter, setFilter] = useState<'All' | TodoStatus>('All')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [status, setStatus] = useState<TodoStatus>('Todo')
	const queryClient = useQueryClient()

	const todosQuery = useQuery({
		queryKey: ['todos', filter],
		queryFn: async () => {
			const { data } = await api.get<TodoItem[]>('/todos', {
				params: filter === 'All' ? {} : { status: filter },
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
			setStatus('Todo')
			await queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: () => {
			onSessionExpired()
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
		onError: () => {
			onSessionExpired()
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: number) => {
			await api.delete(`/todos/${id}`)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['todos'] })
		},
		onError: () => {
			onSessionExpired()
		},
	})

	const taskCountText = useMemo(() => {
		const count = todosQuery.data?.length ?? 0
		return `${count} task${count === 1 ? '' : 's'}`
	}, [todosQuery.data])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		await createMutation.mutateAsync()
	}

	return (
		<section className="board-shell">
			<div className="board-panel board-panel--form">
				<div className="board-panel__header">
					<div>
						<p className="eyebrow">New task</p>
						<h2>Add a TODO</h2>
					</div>
					<span className="chip">{taskCountText}</span>
				</div>

				<form className="todo-form" onSubmit={handleSubmit}>
					<label>
						Title
						<input value={title} onChange={(event) => setTitle(event.target.value)} />
					</label>

					<label>
						Description
						<textarea
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							rows={4}
						/>
					</label>

					<label>
						Status
						<select value={status} onChange={(event) => setStatus(event.target.value as TodoStatus)}>
							<option value="Todo">To Do</option>
							<option value="In Progress">In Progress</option>
							<option value="Done">Done</option>
						</select>
					</label>

					<button className="primary-button" type="submit" disabled={createMutation.isPending}>
						{createMutation.isPending ? 'Saving...' : 'Create task'}
					</button>
				</form>
			</div>

			<div className="board-panel">
				<div className="board-panel__header">
					<div>
						<p className="eyebrow">Your list</p>
						<h2>Tasks</h2>
					</div>

					<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
						{statuses.map((item) => (
							<option key={item} value={item}>
								{item === 'All' ? 'All statuses' : item}
							</option>
						))}
					</select>
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
