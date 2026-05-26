import type { AuthUser } from './ToDoModel'

interface NavBarProps {
	user: AuthUser
	onLogout: () => void
}

function NavBar({ user, onLogout }: NavBarProps) {
	return (
		<header className="nav-shell">
			<div>
				<p className="eyebrow">Task control</p>
				<h1>TODO Desk</h1>
			</div>

			<div className="nav-user">
				<span>
					{user.username} · {user.email}
				</span>
				<button className="ghost-button" type="button" onClick={onLogout}>
					Logout
				</button>
			</div>
		</header>
	)
}

export default NavBar
