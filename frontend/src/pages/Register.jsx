import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password, city)
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Join SkillSwap</h1>
      <p className="font-body text-muted text-sm mt-2">List a skill, find someone to trade with.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full bg-card border border-muted/30 rounded-sm px-3 py-2.5 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-card border border-muted/30 rounded-sm px-3 py-2.5 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-card border border-muted/30 rounded-sm px-3 py-2.5 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full bg-card border border-muted/30 rounded-sm px-3 py-2.5 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
        />

        {error && <p className="font-body text-cherry text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-cherry text-oat font-body font-medium py-2.5 rounded-sm hover:opacity-90 transition-opacity"
        >
          Create account
        </button>
      </form>

      <p className="font-body text-muted text-sm mt-6">
        Already have an account?{' '}
        <NavLink to="/login" className="text-cherry hover:text-ink">
          Log in
        </NavLink>
      </p>
    </div>
  )
}
