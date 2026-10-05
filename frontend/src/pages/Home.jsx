import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import client from '../api/client'
import SkillCard from '../components/SkillCard'

const steps = [
  {
    title: 'List what you can teach',
    detail: 'Guitar, Python, baking, yoga — anything you are good enough to pass on.',
  },
  {
    title: 'Find your match',
    detail: 'We pair you with someone who wants what you have, and has what you want.',
  },
  {
    title: 'Meet and exchange',
    detail: 'Hop on a call or meet up. Teach for an hour, learn for an hour.',
  },
]

export default function Home() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    client
      .get('/users')
      .then((res) => setUsers(Array.isArray(res.data) ? res.data.slice(0, 3) : []))
      .catch(() => setUsers([]))
  }, [])

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid sm:grid-cols-5 gap-10 items-end">
        <div className="sm:col-span-3">
          <h1 className="font-display text-5xl sm:text-6xl text-ink leading-[1.05]">
            Trade skills, not money.
          </h1>
          <p className="font-body text-muted mt-6 text-lg max-w-md">
            Every person here knows something worth teaching. Find someone who
            wants to learn it, and who can teach you something back.
          </p>
          <NavLink
            to="/discover"
            className="inline-block mt-8 bg-cherry text-oat font-body font-medium px-6 py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            Browse skills
          </NavLink>
        </div>
        <div className="sm:col-span-2 border-l border-dashed border-muted/40 pl-8">
          <p className="font-body text-muted text-sm leading-relaxed">
            Started as a trade between two neighbours — a guitar lesson for a
            Spanish class. Now it is a few hundred people across India doing
            the same thing, skill for skill.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-dashed border-muted/30">
        <div className="grid sm:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={step.title}>
              <span className="font-display text-cherry text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-xl text-ink mt-2">{step.title}</h3>
              <p className="font-body text-muted text-sm mt-2">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {users.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-dashed border-muted/30">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl text-ink">On the board right now</h2>
            <NavLink to="/discover" className="font-body text-sm text-cherry hover:text-ink">
              See all
            </NavLink>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user) => (
              <SkillCard key={user._id} user={user} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
