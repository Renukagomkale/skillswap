import { useState, useEffect, useRef } from 'react'
import { Send, Check, X } from 'lucide-react'
import { io } from 'socket.io-client'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Matches() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [matches, setMatches] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const socketRef = useRef(null)

  const loadMatches = () => {
    client.get('/matches/requests').then((res) => setRequests(res.data))
    client.get('/matches').then((res) => {
      setMatches(res.data)
      setActiveId((current) => current || res.data[0]?._id || null)
    })
  }

  useEffect(() => {
    loadMatches()

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
    })

    socketRef.current.on('new-message', (message) => {
      setMessages((prev) => (message.match === activeId ? [...prev, message] : prev))
    })

    return () => socketRef.current.disconnect()
  }, [])

  useEffect(() => {
    if (!activeId) return
    client.get(`/matches/${activeId}/messages`).then((res) => setMessages(res.data))
    socketRef.current?.emit('join-match', activeId)
  }, [activeId])

  const respond = async (id, status) => {
    await client.patch(`/matches/${id}`, { status })
    loadMatches()
  }

  const sendMessage = () => {
    if (!draft.trim()) return
    socketRef.current.emit('send-message', { matchId: activeId, text: draft.trim() })
    setDraft('')
  }

  const otherPerson = (match) => (match.requester._id === user.id ? match.recipient : match.requester)

  const active = matches.find((m) => m._id === activeId)

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink mb-6">Your matches</h1>

      {requests.length > 0 && (
        <div className="mb-10 space-y-3">
          <h2 className="font-body text-sm text-muted uppercase tracking-wide">
            Swap requests waiting for you
          </h2>
          {requests.map((r) => (
            <div
              key={r._id}
              className="flex items-center justify-between bg-card border border-muted/25 rounded-sm px-5 py-3"
            >
              <div>
                <p className="font-body text-ink text-sm font-medium">{r.requester.name}</p>
                <p className="font-body text-muted text-xs">{r.requester.city}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => respond(r._id, 'accepted')}
                  className="bg-dill text-oat p-2 rounded-sm hover:opacity-90 transition-opacity"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => respond(r._id, 'declined')}
                  className="bg-card border border-muted/40 text-muted p-2 rounded-sm hover:text-cherry hover:border-cherry/50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {matches.length === 0 ? (
        <p className="font-body text-muted">
          No accepted matches yet. Request a swap from the Discover page to get started.
        </p>
      ) : (
        <div className="grid sm:grid-cols-3 border border-muted/25 rounded-sm overflow-hidden min-h-[480px]">
          <div className="border-r border-muted/25 bg-card">
            {matches.map((m) => (
              <button
                key={m._id}
                onClick={() => setActiveId(m._id)}
                className={`w-full text-left px-5 py-4 border-b border-muted/15 transition-colors ${
                  m._id === activeId ? 'bg-butter/40' : 'hover:bg-oat'
                }`}
              >
                <p className="font-body text-ink text-sm font-medium">{otherPerson(m).name}</p>
                <p className="font-body text-muted text-xs mt-1">{otherPerson(m).city}</p>
              </button>
            ))}
          </div>

          <div className="sm:col-span-2 flex flex-col bg-oat">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-xs font-body text-sm px-4 py-2.5 rounded-sm ${
                    msg.sender === user.id
                      ? 'bg-cherry text-oat ml-auto'
                      : 'bg-card text-ink border border-muted/25'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-muted/25 p-4 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Write a message..."
                className="flex-1 bg-card border border-muted/30 rounded-sm px-3 py-2 text-ink font-body text-sm placeholder:text-muted focus:outline-none focus:border-cherry"
              />
              <button
                onClick={sendMessage}
                className="bg-cherry text-oat px-3 rounded-sm hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
