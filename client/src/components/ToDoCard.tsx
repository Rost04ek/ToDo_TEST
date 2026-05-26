import type { TodoItem, TodoStatus } from './ToDoModel'

interface ToDoCardProps {
	todo: TodoItem
	onStatusChange: (id: number, status: TodoStatus) => void
	onDelete: (id: number) => void
}

function ToDoCard({ todo, onStatusChange, onDelete }: ToDoCardProps) {
	const statusClassName = todo.status.replace(/\s+/g, '-')
	const displayNumber = todo.seq && todo.seq > 0 ? todo.seq : todo.id

	return (
		<article className="todo-card card">
			<div className="todo-card__header">
				<div>
					<p className="eyebrow">Task #{displayNumber}</p>
					<h3>{todo.title}</h3>
				</div>

				<select
					className={`status-pill status-pill--${statusClassName}`}
					value={todo.status}
					onChange={(event) => onStatusChange(todo.id, event.target.value as TodoStatus)}
				>
					<option value="todo">To Do</option>
					<option value="in progress">In Progress</option>
					<option value="done">Done</option>
				</select>
			</div>

			<p className="todo-card__description">{todo.description || 'No description added.'}</p>

			<div className="todo-card__footer">
				<span>Updated {new Date(todo.updatedAt).toLocaleDateString()}</span>
				<div className="flex-right">
					<button className="danger-button" type="button" onClick={() => onDelete(todo.id)}>
						Delete
					</button>
				</div>
			</div>
		</article>
	)
}

export default ToDoCard
