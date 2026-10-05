import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/discover', label: 'Discover' },
  { to: '/matches', label: 'Matches' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-dashed border-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <NavLink to="/" className="font-display text-2xl text-ink tracking-tight">
          Skill<span className="text-cherry">Swap</span>
        </NavLink>
        {user && (
          <nav className="hidden sm:flex items-center gap-8 font-body text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-cherry' : 'text-muted hover:text-ink'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="font-body text-sm text-muted hover:text-cherry transition-colors"
          >
            Log out
          </button>
        ) : (
          <NavLink
            to="/login"
            className="font-body text-sm bg-cherry text-oat px-4 py-2 rounded-sm font-medium hover:opacity-90 transition-opacity"
          >
            Join a swap
          </NavLink>
        )}
      </div>
    </header>
  )
}
