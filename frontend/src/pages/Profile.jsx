import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [teaches, setTeaches] = useState([])
  const [wants, setWants] = useState([])
  const [city, setCity] = useState('')
  const [teachInput, setTeachInput] = useState('')
  const [wantInput, setWantInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    client.get('/users/me').then((res) => {
      setTeaches(res.data.teaches || [])
      setWants(res.data.wants || [])
      setCity(res.data.city || '')
    })
  }, [])

  useEffect(() => {
    setSaving(true)
    const delay = setTimeout(() => {
      client.put('/users/me', { teaches, wants, city }).finally(() => setSaving(false))
    }, 500)
    return () => clearTimeout(delay)
  }, [teaches, wants, city])

  const addTeach = () => {
    if (!teachInput.trim()) return
    setTeaches([...teaches, teachInput.trim()])
    setTeachInput('')
  }

  const addWant = () => {
    if (!wantInput.trim()) return
    setWants([...wants, wantInput.trim()])
    setWantInput('')
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-dill/15 text-dill flex items-center justify-center font-display text-2xl">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-3xl text-ink">{user?.name}</h1>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city"
              className="font-body text-muted text-sm bg-transparent border-b border-dashed border-muted/40 focus:outline-none focus:border-cherry mt-1"
            />
          </div>
        </div>
        {saving && <span className="font-body text-xs text-muted">Saving...</span>}
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-xl text-ink mb-4">I can teach</h2>
          <div className="space-y-2">
            {teaches.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between bg-card border border-muted/25 rounded-sm px-4 py-2.5"
              >
                <span className="font-body text-ink text-sm">{skill}</span>
                <button
                  onClick={() => setTeaches(teaches.filter((s) => s !== skill))}
                  className="text-muted hover:text-cherry"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              value={teachInput}
              onChange={(e) => setTeachInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTeach()}
              placeholder="Add a skill"
              className="flex-1 bg-card border border-muted/30 rounded-sm px-3 py-2 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
            />
            <button
              onClick={addTeach}
              className="bg-cherry text-oat px-3 rounded-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink mb-4">I want to learn</h2>
          <div className="space-y-2">
            {wants.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between bg-card border border-muted/25 rounded-sm px-4 py-2.5"
              >
                <span className="font-body text-ink text-sm">{skill}</span>
                <button
                  onClick={() => setWants(wants.filter((s) => s !== skill))}
                  className="text-muted hover:text-cherry"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              value={wantInput}
              onChange={(e) => setWantInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addWant()}
              placeholder="Add a skill"
              className="flex-1 bg-card border border-muted/30 rounded-sm px-3 py-2 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
            />
            <button
              onClick={addWant}
              className="bg-cherry text-oat px-3 rounded-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
