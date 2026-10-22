import { Link, NavLink } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

const MOTIFS = {
  brackets: (c) => <g fill="none" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"><path d="M120 50 70 100l50 50" /><path d="M200 50l50 50-50 50" /><path d="M175 40 145 160" /></g>,
  orbits: (c) => <g fill="none" stroke={c} strokeWidth="9" strokeLinejoin="round"><rect x="70" y="40" width="120" height="84" rx="12" /><rect x="110" y="66" width="120" height="84" rx="12" fill={c} fillOpacity=".25" /><rect x="150" y="92" width="100" height="70" rx="12" fill={c} /></g>,
  stack: (c) => <g fill={c}><rect x="90" y="40" width="140" height="30" rx="15" /><rect x="90" y="85" width="140" height="30" rx="15" opacity=".75" /><rect x="90" y="130" width="140" height="30" rx="15" opacity=".5" /></g>,
  grid: (c) => <g fill={c}>{[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => <rect key={r + '' + k} x={84 + k * 40} y={40 + r * 42} width="30" height="30" rx={(r + k) % 2 ? 15 : 4} opacity={(r + k) % 3 ? 1 : 0.55} />))}</g>,
  bars: (c) => <g fill={c}><rect x="90" y="110" width="28" height="55" /><rect x="132" y="80" width="28" height="85" /><rect x="174" y="55" width="28" height="110" /><rect x="216" y="95" width="28" height="70" /><path d="M86 90 146 60l42 18 58-42" stroke={c} strokeWidth="6" fill="none" /></g>,
  phone: (c) => <g fill="none" stroke={c} strokeWidth="10"><rect x="122" y="28" width="76" height="144" rx="16" /><path d="M150 152h20" strokeLinecap="round" /><rect x="214" y="70" width="44" height="80" rx="10" opacity=".6" /></g>,
}

export function CourseArt({ course, className = '', big }) {
  const [bg, fg] = course.art
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <svg aria-hidden="true" viewBox="0 0 320 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">{MOTIFS[course.motif](fg)}</svg>
      {course.level && <span className="absolute top-4 left-4 text-[11px] font-extrabold uppercase tracking-wider bg-white text-ink px-2 py-1 rounded-md">{course.level}</span>}
    </div>
  )
}

export default function Nav() {
  const link = ({ isActive }) => `px-3 py-2 rounded-xl text-sm font-bold ${isActive ? 'bg-ink text-white' : 'text-ink/70 hover:text-ink'}`
  return (
    <header className="sticky top-0 z-40 bg-cream border-b border-ink/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight"><span className="w-9 h-9 rounded-xl bg-coral grid place-items-center text-white"><GraduationCap size={20} /></span>Learnly</Link>
        <nav className="ml-auto flex gap-1">
          <NavLink to="/" end className={link}>Courses</NavLink>
          <NavLink to="/my-learning" className={link}>My learning</NavLink>
        </nav>
      </div>
    </header>
  )
}
