import type { AuthUser } from './ToDoModel'

interface NavBarProps {
	user: AuthUser
	onLogout: () => void
}

const maskEmail = (email: string) => {
	const parts = email.split('@')
	if (parts.length !== 2) return email

	const [local, domain] = parts

	if (local.length <= 2) {
		return `${local[0]}*@${domain}`
	}

	const first = local[0]
	const last = local[local.length - 1]
	const middle = '*'.repeat(Math.max(1, local.length - 2))

	return `${first}${middle}${last}@${domain}`
}

function NavBar({ user, onLogout }: NavBarProps) {
	return (
		<header className="nav-shell">
			<div>
				<h1>ToDo Dashboard</h1>
			</div>

			<div className="nav-user">
				<span>
					{user.username} · {maskEmail(user.email)}
				</span>
				<button className="ghost-button" type="button" onClick={onLogout}>
					Logout
				</button>
			</div>
		</header>
	)
}

export default NavBar

