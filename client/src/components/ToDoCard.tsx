import type { TodoItem, TodoStatus } from './ToDoModel'

interface ToDoCardProps {
	todo: TodoItem
	onStatusChange: (id: number, status: TodoStatus) => void
	onDelete: (id: number) => void
}

function ToDoCard({ todo, onStatusChange, onDelete }: ToDoCardProps) {
	const statusClassName = todo.status.replace(/\s+/g, '-')

	return (
		<article className="todo-card">
			<div className="todo-card__header">
				<div>
					<p className="eyebrow">Task #{todo.id}</p>
					<h3>{todo.title}</h3>
				</div>

				<select
					className={`status-pill status-pill--${statusClassName}`}
					value={todo.status}
					onChange={(event) => onStatusChange(todo.id, event.target.value as TodoStatus)}
				>
					<option value="todo">todo</option>
					<option value="in progress">in progress</option>
					<option value="done">done</option>
				</select>
			</div>

			<p className="todo-card__description">{todo.description || 'No description added.'}</p>

			<div className="todo-card__footer">
				<span>Updated {new Date(todo.updatedAt).toLocaleDateString()}</span>
				<button className="danger-button" type="button" onClick={() => onDelete(todo.id)}>
					Delete
				</button>
			</div>
		</article>
	)
}

export default ToDoCard
