import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, PlayCircle, Clock, BookOpen, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { COURSES, CATEGORIES, lessonsOf, minutesOf, useLearn } from '../data/learn.jsx'
import { CourseArt } from '../components/Nav.jsx'

export default function Home() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const { enrolledCourses, progress } = useLearn()
  const list = COURSES.filter((c) => (cat === 'all' || c.cat === cat) && (!q || (c.title + c.tagline).toLowerCase().includes(q.toLowerCase())))
  const cont = enrolledCourses()[0]

  return (
    <main>
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-16 grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-sm font-bold text-coral-600 border border-coral/20"><Sparkles size={16} />Learn by building real projects</span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]">Skills you can use<br />at work <span className="relative text-coral">tomorrow<svg className="absolute left-0 -bottom-2 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 9c50-8 140-8 196 0" stroke="#ff6b4a" strokeWidth="4" strokeLinecap="round" /></svg></span>.</h1>
          <p className="mt-6 text-lg text-ink/70 max-w-lg leading-8">Short, practical courses in development, design and data. Watch a lesson, practice, and track every step of your progress.</p>
          <label className="mt-8 flex items-center gap-3 bg-white rounded-2xl p-2 pl-4 max-w-lg border-2 border-ink">
            <Search size={20} className="text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you want to learn?" className="flex-1 outline-none bg-transparent" />
            <a href="#catalog" className="px-5 py-3 rounded-xl bg-ink text-white font-bold text-sm">Search</a>
          </label>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/60">
            {['Self-paced lessons', 'Progress tracking', 'Hands-on projects'].map((t) => <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" />{t}</span>)}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-ink rounded-[2rem]" />
          {cont ? (
            <div className="relative bg-white rounded-[2rem] p-5 border-2 border-ink">
              <CourseArt course={cont} className="h-48 rounded-2xl" big />
              <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-coral-600">Continue learning</p>
              <h3 className="mt-1 text-xl font-extrabold">{cont.title}</h3>
              <div className="mt-4 flex items-center gap-3"><div className="flex-1 h-2.5 rounded-full bg-ink/5"><div className="h-full rounded-full bg-coral" style={{ width: progress(cont) + '%' }} /></div><b className="text-sm">{progress(cont)}%</b></div>
              <Link to={`/course/${cont.id}`} className="mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-ink text-white font-bold"><PlayCircle size={18} />Resume lesson</Link>
            </div>
          ) : null}
          <div className="absolute -left-6 -bottom-8 bg-white rounded-2xl border-2 border-ink px-4 py-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 grid place-items-center"><BookOpen size={20} /></span>
            <div><b className="block text-sm">{COURSES.length} courses</b><span className="text-xs text-ink/50">{CATEGORIES.length} categories</span></div>
          </div>
        </div>
      </section>

      <section id="catalog" className="max-w-6xl mx-auto px-5 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Explore courses</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setCat('all')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${cat === 'all' ? 'bg-ink text-white' : 'bg-white'}`}>All</button>
            {CATEGORIES.map(({ id, name, icon: Icon }) => <button key={id} onClick={() => setCat(id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${cat === id ? 'bg-ink text-white' : 'bg-white'}`}><Icon size={15} />{name}</button>)}
          </div>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((c) => (
            <Link key={c.id} to={`/course/${c.id}`} className="group bg-white rounded-3xl p-3 border border-ink/5 hover:border-ink hover:-translate-y-1 transition">
              <CourseArt course={c} className="h-44 rounded-2xl" />
              <div className="p-3">
                <p className="text-xs font-bold text-ink/50">{CATEGORIES.find((x) => x.id === c.cat).name}</p>
                <h3 className="mt-1 text-lg font-extrabold leading-snug group-hover:text-coral-600">{c.title}</h3>
                <p className="mt-2 text-sm text-ink/60 leading-6 line-clamp-2">{c.tagline}</p>
                <div className="mt-4 flex items-center gap-4 text-xs font-bold text-ink/60">
                  <span className="flex items-center gap-1"><BookOpen size={14} />{lessonsOf(c).length} lessons</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{Math.round(minutesOf(c) / 60 * 10) / 10} h</span>
                  <span className="ml-auto text-base font-extrabold text-ink">{c.price ? '$' + c.price : 'Free'}</span>
                </div>
              </div>
            </Link>
          ))}
          {!list.length && <p className="text-ink/50">No courses match “{q}”.</p>}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="rounded-[2rem] bg-ink text-white p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6">
          <div><h2 className="text-3xl font-extrabold">Start with a free course</h2><p className="mt-2 text-white/60">JavaScript Foundations is free. Enroll and start the first lesson now.</p></div>
          <Link to="/course/js-foundations" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-coral font-bold hover:bg-coral-600">Start learning <ArrowRight size={18} /></Link>
        </div>
        <p className="mt-8 text-center text-sm text-ink/40">Concept project · Designed and developed by Mohamed Ashraf</p>
      </section>
    </main>
  )
}
