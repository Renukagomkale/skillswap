import { useState } from 'react'
import { MapPin, ArrowRight, Check } from 'lucide-react'
import client from '../api/client'

export default function SkillCard({ user }) {
  const [status, setStatus] = useState('idle')
  const initial = user.name.charAt(0)

  const requestSwap = async () => {
    setStatus('sending')
    try {
      await client.post('/matches', { recipientId: user._id })
      setStatus('sent')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="bg-card border border-muted/25 p-6 rounded-sm hover:border-cherry/50 hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-dill/15 text-dill flex items-center justify-center font-display text-lg">
          {initial}
        </div>
        <div>
          <p className="font-body text-ink text-sm font-medium">{user.name}</p>
          <p className="font-body text-muted text-xs flex items-center gap-1">
            <MapPin size={12} />
            {user.city || 'India'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="font-body text-xs text-muted uppercase tracking-wide">Teaches</p>
          <p className="font-display text-xl text-ink">{user.teaches?.[0] || 'Not listed yet'}</p>
        </div>
        <div className="flex items-center gap-2 text-dill">
          <ArrowRight size={16} />
          <div>
            <p className="font-body text-xs text-muted uppercase tracking-wide">Wants to learn</p>
            <p className="font-body text-ink text-sm">{user.wants?.[0] || 'Not listed yet'}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-dashed border-muted/25 flex items-center justify-end">
        <button
          onClick={requestSwap}
          disabled={status !== 'idle'}
          className="font-body text-xs text-cherry hover:text-ink transition-colors flex items-center gap-1 disabled:text-dill"
        >
          {status === 'sent' ? (
            <>
              <Check size={14} /> Request sent
            </>
          ) : status === 'sending' ? (
            'Sending...'
          ) : (
            'Request swap'
          )}
        </button>
      </div>
    </div>
  )
}
