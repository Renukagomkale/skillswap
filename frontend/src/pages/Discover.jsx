import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import client from '../api/client'
import SkillCard from '../components/SkillCard'

export default function Discover() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const delay = setTimeout(() => {
      client
        .get('/users', { params: query ? { skill: query } : {} })
        .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(delay)
  }, [query])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Discover skills</h1>
      <p className="font-body text-muted mt-2">
        {loading ? 'Loading...' : `${users.length} people are offering something right now.`}
      </p>

      <div className="mt-8 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a skill..."
          className="w-full bg-card border border-muted/30 rounded-sm pl-9 pr-3 py-2 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
        />
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((user) => (
          <SkillCard key={user._id} user={user} />
        ))}
      </div>

      {!loading && users.length === 0 && (
        <p className="font-body text-muted mt-10">
          Nobody is teaching that yet. Try another search.
        </p>
      )}
    </div>
  )
}
