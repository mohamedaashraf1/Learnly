import { Link } from 'react-router-dom'
import { Flame, BookOpen, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts'
import { COURSES, lessonsOf, useLearn } from '../data/learn.jsx'
import { CourseArt } from '../components/Nav.jsx'

export default function Dashboard() {
  const L = useLearn()
  const mine = L.enrolledCourses()
  const done = L.doneCount()
  // Weekly activity: illustrative pattern scaled by real completed lessons
  const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ d, m: [20, 35, 0, 45, 25, 60, 30][i] + done * 2 }))
  const today = (new Date().getDay() + 6) % 7
  const stats = [
    [BookOpen, 'Enrolled courses', mine.length, 'bg-sky-100 text-sky-600'],
    [CheckCircle2, 'Lessons completed', done, 'bg-emerald-100 text-emerald-600'],
    [Clock, 'Minutes this week', week.reduce((a, b) => a + b.m, 0), 'bg-violet-100 text-violet-600'],
    [Flame, 'Day streak', 4, 'bg-orange-100 text-coral-600'],
  ]
  const suggest = COURSES.filter((c) => !L.isEnrolled(c.id)).slice(0, 3)

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My learning</h1>
      <p className="mt-2 text-ink/60">Pick up where you left off.</p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(([Icon, l, v, cls]) => (
          <div key={l} className="bg-white rounded-2xl p-5">
            <span className={`w-10 h-10 rounded-xl grid place-items-center ${cls}`}><Icon size={20} /></span>
            <b className="block mt-4 text-3xl font-extrabold">{v}</b>
            <span className="text-sm text-ink/50 font-semibold">{l}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6">
        <section className="space-y-4">
          {mine.map((c) => {
            const pct = L.progress(c); const left = lessonsOf(c).filter((l) => !L.isDone(c.id, l.key)).length
            return (
              <article key={c.id} className="bg-white rounded-3xl p-3 flex flex-col sm:flex-row gap-4">
                <CourseArt course={c} className="h-36 sm:h-auto sm:w-52 rounded-2xl shrink-0" />
                <div className="flex-1 p-2">
                  <h2 className="text-lg font-extrabold">{c.title}</h2>
                  <p className="text-sm text-ink/50 font-semibold">{c.instructor} · {left} lessons left</p>
                  <div className="mt-4 flex items-center gap-3"><div className="flex-1 h-2.5 rounded-full bg-ink/5"><div className="h-full rounded-full bg-coral" style={{ width: pct + '%' }} /></div><b className="text-sm w-10 text-right">{pct}%</b></div>
                  <Link to={`/course/${c.id}`} className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold">{pct === 100 ? 'Review course' : 'Continue'} <ArrowRight size={16} /></Link>
                </div>
              </article>
            )
          })}
          {!mine.length && <p className="bg-white rounded-3xl p-8 text-center text-ink/60">You haven't enrolled in any course yet. <Link to="/" className="font-bold text-coral-600">Browse courses</Link></p>}
        </section>

        <aside className="space-y-6">
          <section className="bg-white rounded-3xl p-5">
            <h2 className="font-extrabold">This week</h2>
            <p className="text-sm text-ink/50">Minutes of learning per day</p>
            <div className="h-44 mt-3">
              <ResponsiveContainer>
                <BarChart data={week}><XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#14213d88' }} /><Tooltip cursor={{ fill: '#ff6b4a14' }} formatter={(v) => [v + ' min', 'Learning']} contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="m" radius={[8, 8, 8, 8]} maxBarSize={28}>{week.map((_, i) => <Cell key={i} fill={i === today ? '#ff6b4a' : '#14213d1a'} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="bg-white rounded-3xl p-5">
            <h2 className="font-extrabold">Recommended next</h2>
            <ul className="mt-3 space-y-3">
              {suggest.map((c) => (
                <li key={c.id}><Link to={`/course/${c.id}`} className="flex items-center gap-3 group"><CourseArt course={{ ...c, level: '' }} className="w-14 h-14 rounded-xl shrink-0" /><div><b className="text-sm group-hover:text-coral-600">{c.title}</b><p className="text-xs text-ink/50">{c.level} · {c.price ? '$' + c.price : 'Free'}</p></div></Link></li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}
