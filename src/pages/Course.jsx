import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Circle, PlayCircle, Lock, ChevronRight, ChevronLeft, Clock, BookOpen, User } from 'lucide-react'
import { COURSES, lessonsOf, minutesOf, useLearn } from '../data/learn.jsx'
import { CourseArt } from '../components/Nav.jsx'

export default function Course() {
  const { id } = useParams()
  const c = COURSES.find((x) => x.id === id)
  const L = useLearn()
  const all = c ? lessonsOf(c) : []
  const firstOpen = c ? all.find((l) => !L.isDone(c.id, l.key)) || all[0] : null
  const [curKey, setCurKey] = useState(firstOpen?.key)
  if (!c) return <p className="max-w-6xl mx-auto p-10">Course not found. <Link to="/" className="text-coral-600 font-bold">Back to courses</Link></p>

  const enrolled = L.isEnrolled(c.id)
  const idx = all.findIndex((l) => l.key === curKey)
  const cur = all[idx] || all[0]
  const pct = L.progress(c)

  return (
    <main className="max-w-6xl mx-auto px-5 py-8">
      <nav className="text-sm font-semibold text-ink/50 flex items-center gap-1"><Link to="/" className="hover:text-ink">Courses</Link><ChevronRight size={14} /><span className="text-ink">{c.title}</span></nav>

      <div className="mt-5 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <section>
          {/* Player */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-ink">
            <div className="absolute inset-0"><CourseArt course={{ ...c, level: '' }} className="h-full" big /></div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-ink/85" />
            {enrolled ? (
              <>
                <button className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/95 grid place-items-center shadow-2xl hover:scale-105 transition" aria-label="Play lesson"><PlayCircle size={44} className="text-coral" /></button>
                <div className="absolute left-6 right-6 bottom-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">Lesson {idx + 1} of {all.length}</p>
                  <h2 className="text-xl sm:text-2xl font-extrabold">{cur.title}</h2>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center text-white p-6">
                <div><Lock size={36} className="mx-auto" /><p className="mt-3 font-bold">Enroll to unlock {all.length} lessons</p></div>
              </div>
            )}
          </div>

          {enrolled && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button disabled={idx <= 0} onClick={() => setCurKey(all[idx - 1].key)} className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white font-bold text-sm disabled:opacity-40"><ChevronLeft size={16} />Previous</button>
              <button onClick={() => { if (!L.isDone(c.id, cur.key)) L.toggle(c.id, cur.key); if (idx < all.length - 1) setCurKey(all[idx + 1].key) }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral text-white font-bold text-sm hover:bg-coral-600">
                <CheckCircle2 size={16} />{L.isDone(c.id, cur.key) ? 'Next lesson' : 'Mark complete & continue'}
              </button>
              <span className="ml-auto text-sm font-bold text-ink/60">{pct}% complete</span>
            </div>
          )}

          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{c.title}</h1>
            <p className="mt-3 text-lg text-ink/70 leading-8">{c.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white"><User size={16} />{c.instructor}</span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white"><BookOpen size={16} />{all.length} lessons</span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white"><Clock size={16} />{minutesOf(c)} min</span>
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white">{c.level}</span>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <aside className="bg-white rounded-3xl p-5 lg:sticky lg:top-24">
          {!enrolled ? (
            <div className="pb-5 mb-5 border-b border-ink/5">
              <b className="text-3xl font-extrabold">{c.price ? '$' + c.price : 'Free'}</b>
              <button onClick={() => L.enroll(c.id)} className="mt-4 w-full py-3.5 rounded-xl bg-coral text-white font-extrabold hover:bg-coral-600">Enroll now</button>
              <p className="mt-2 text-xs text-center text-ink/50">Demo checkout · no payment is taken</p>
            </div>
          ) : (
            <div className="pb-5 mb-5 border-b border-ink/5">
              <div className="flex justify-between text-sm font-bold"><span>Your progress</span><span>{pct}%</span></div>
              <div className="mt-2 h-2.5 rounded-full bg-ink/5"><div className="h-full rounded-full bg-coral transition-all" style={{ width: pct + '%' }} /></div>
            </div>
          )}
          <h2 className="font-extrabold">Curriculum</h2>
          <div className="mt-3 space-y-4 max-h-[28rem] overflow-y-auto pr-1">
            {c.modules.map((m, mi) => (
              <div key={m.title}>
                <p className="text-xs font-extrabold uppercase tracking-wider text-ink/40">Module {mi + 1} · {m.title}</p>
                <ul className="mt-2 space-y-1">
                  {m.lessons.map((l) => {
                    const key = `${m.title}::${l.id}`; const done = L.isDone(c.id, key); const on = key === cur.key
                    return (
                      <li key={key}>
                        <button disabled={!enrolled} onClick={() => setCurKey(key)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-sm ${on && enrolled ? 'bg-coral/10' : 'hover:bg-ink/5'} disabled:cursor-not-allowed`}>
                          {!enrolled ? <Lock size={16} className="text-ink/30 shrink-0" /> : done ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> : <Circle size={18} className="text-ink/20 shrink-0" />}
                          <span className={`flex-1 ${on && enrolled ? 'font-bold' : ''}`}>{l.title}</span>
                          <span className="text-xs text-ink/40">{l.mins}m</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
