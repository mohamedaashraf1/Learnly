import { createContext, useContext, useEffect, useState } from 'react'
import { Code2, Palette, BarChart3, Megaphone, Database, Smartphone } from 'lucide-react'

export const CATEGORIES = [
  { id: 'dev', name: 'Web Development', icon: Code2 },
  { id: 'design', name: 'UI/UX Design', icon: Palette },
  { id: 'data', name: 'Data Analysis', icon: BarChart3 },
  { id: 'marketing', name: 'Digital Marketing', icon: Megaphone },
  { id: 'backend', name: 'Backend & Databases', icon: Database },
  { id: 'mobile', name: 'Mobile Apps', icon: Smartphone },
]

const mk = (titles) => titles.map((t, i) => ({ id: i + 1, title: t, mins: 6 + ((i * 7) % 15) }))

export const COURSES = [
  { id: 'js-foundations', cat: 'dev', title: 'JavaScript Foundations', tagline: 'From variables to async/await, with small projects in every module.', level: 'Beginner', instructor: 'Nadia Kamel', price: 0, art: ['#ffd36e', '#e2a12a'], motif: 'brackets', icon: Code2,
    modules: [{ title: 'Getting started', lessons: mk(['How JavaScript runs in the browser', 'Variables and types', 'Operators and expressions']) }, { title: 'Logic & functions', lessons: mk(['Conditions', 'Loops', 'Functions and scope', 'Arrow functions']) }, { title: 'Working with data', lessons: mk(['Arrays', 'Objects', 'Array methods: map, filter, reduce']) }, { title: 'The DOM & async', lessons: mk(['Selecting and changing elements', 'Events', 'Fetch and async/await', 'Project: weather widget']) }] },
  { id: 'react-real-apps', cat: 'dev', title: 'React for Real Apps', tagline: 'Components, state, routing and data fetching by building a full dashboard.', level: 'Intermediate', instructor: 'Omar Farouk', price: 29, art: ['#9cc9f0', '#3f78b5'], motif: 'orbits', icon: Code2,
    modules: [{ title: 'Thinking in components', lessons: mk(['JSX and props', 'State with useState', 'Lists and keys']) }, { title: 'Side effects & data', lessons: mk(['useEffect the right way', 'Fetching data', 'Loading and error states']) }, { title: 'Routing & structure', lessons: mk(['React Router basics', 'Layouts and nested routes', 'Project: admin dashboard']) }] },
  { id: 'node-apis', cat: 'backend', title: 'Build REST APIs with Node.js', tagline: 'Express, routing, validation, auth with bcrypt and a SQL database.', level: 'Intermediate', instructor: 'Omar Farouk', price: 35, art: ['#9fd8bf', '#2c8463'], motif: 'stack', icon: Database,
    modules: [{ title: 'Node & Express', lessons: mk(['Node.js runtime basics', 'Your first Express server', 'Routing and controllers']) }, { title: 'Data', lessons: mk(['SQL in 20 minutes', 'Connecting a database', 'CRUD endpoints']) }, { title: 'Security', lessons: mk(['Hashing passwords with bcrypt', 'Sessions vs JWT', 'Environment variables']) }] },
  { id: 'ui-design', cat: 'design', title: 'UI Design Essentials', tagline: 'Layout, type, color and spacing rules that make interfaces feel clean.', level: 'Beginner', instructor: 'Lina Youssef', price: 19, art: ['#f5b8c9', '#b8476a'], motif: 'grid', icon: Palette,
    modules: [{ title: 'Foundations', lessons: mk(['Visual hierarchy', 'Grids and spacing', 'Typography']) }, { title: 'Color & components', lessons: mk(['Building a palette', 'Buttons, inputs, cards', 'Design review checklist']) }] },
  { id: 'excel-data', cat: 'data', title: 'Data Analysis with Spreadsheets', tagline: 'Clean data, build pivot tables and turn numbers into clear charts.', level: 'Beginner', instructor: 'Hany Saad', price: 15, art: ['#d6e58a', '#6f8a1f'], motif: 'bars', icon: BarChart3,
    modules: [{ title: 'Clean data', lessons: mk(['Importing data', 'Removing duplicates', 'Text and date functions']) }, { title: 'Analyze', lessons: mk(['Pivot tables', 'Lookups', 'Charts that explain']) }] },
  { id: 'mobile-first', cat: 'mobile', title: 'Mobile-First Web Apps', tagline: 'Responsive layouts, touch-friendly UI and installable PWAs.', level: 'Advanced', instructor: 'Nadia Kamel', price: 39, art: ['#c9b9ef', '#6a4bb3'], motif: 'phone', icon: Smartphone,
    modules: [{ title: 'Responsive', lessons: mk(['Mobile-first CSS', 'Fluid type and spacing', 'Touch targets']) }, { title: 'PWA', lessons: mk(['Web app manifest', 'Service workers', 'Offline caching']) }] },
]

export const lessonsOf = (c) => c.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, key: `${m.title}::${l.id}` })))
export const minutesOf = (c) => lessonsOf(c).reduce((a, l) => a + l.mins, 0)

const KEY = 'learnly_state_v1'
const initial = { enrolled: { 'js-foundations': 7, 'node-apis': 3 }, done: {} }
// seed completed lessons for the demo
for (const [cid, n] of Object.entries(initial.enrolled)) {
  const c = COURSES.find((x) => x.id === cid)
  initial.done[cid] = lessonsOf(c).slice(0, n).map((l) => l.key)
}
const Ctx = createContext(null)
export function LearnProvider({ children }) {
  const [st, setSt] = useState(() => { try { const v = JSON.parse(localStorage.getItem(KEY)); if (v?.done) return v } catch {} return initial })
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch {} }, [st])
  const api = {
    isEnrolled: (cid) => cid in st.enrolled,
    enroll: (cid) => setSt((s) => ({ enrolled: { ...s.enrolled, [cid]: 0 }, done: { ...s.done, [cid]: s.done[cid] || [] } })),
    isDone: (cid, key) => (st.done[cid] || []).includes(key),
    toggle: (cid, key) => setSt((s) => { const cur = s.done[cid] || []; return { ...s, done: { ...s.done, [cid]: cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key] } } }),
    progress: (c) => { const all = lessonsOf(c).length; return all ? Math.round(((st.done[c.id] || []).length / all) * 100) : 0 },
    enrolledCourses: () => COURSES.filter((c) => c.id in st.enrolled),
    doneCount: () => Object.values(st.done).reduce((a, l) => a + l.length, 0),
  }
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export const useLearn = () => useContext(Ctx)
