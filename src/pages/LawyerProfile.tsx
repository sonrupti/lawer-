import {
  BadgeCheck, Star, TrendingUp, Scale, MapPin, Phone, Mail, Calendar,
  BookOpen, Award, Clock, ChevronLeft, ExternalLink, MessageSquare
} from 'lucide-react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, Legend
} from 'recharts'
import { lawyers } from '../data/lawyers'
import type { Page } from '../App'

interface Props {
  navigate: (page: Page) => void
}

const lawyer = lawyers[0]

const caseTimeline = [
  { year: '2020', won: 28, lost: 12 },
  { year: '2021', won: 32, lost: 14 },
  { year: '2022', won: 35, lost: 10 },
  { year: '2023', won: 40, lost: 15 },
  { year: '2024', won: 38, lost: 11 },
]

const casesByType = [
  { name: 'Constitutional', value: 120, color: '#0a1628' },
  { name: 'Civil Rights', value: 95, color: '#2855a8' },
  { name: 'Public Interest', value: 80, color: '#d4a820' },
  { name: 'Other', value: 47, color: '#a8c0e8' },
]

const recentCases = [
  { date: 'Dec 2024', title: 'State of Odisha v. Tribal Land Rights Coalition', court: 'Odisha High Court', outcome: 'Won', type: 'Constitutional' },
  { date: 'Nov 2024', title: 'In Re: Fundamental Right to Education (PIL)', court: 'Odisha High Court', outcome: 'Won', type: 'Public Interest' },
  { date: 'Oct 2024', title: 'Raghunath Behera v. State', court: 'Supreme Court of India', outcome: 'Pending', type: 'Civil Rights' },
  { date: 'Sep 2024', title: 'Environmental Clearance Challenge — Vedanta', court: 'Odisha High Court', outcome: 'Won', type: 'Constitutional' },
  { date: 'Aug 2024', title: 'Gram Panchayat Elections Challenge', court: 'Odisha High Court', outcome: 'Lost', type: 'Constitutional' },
]

function ScoreRing({ score, label }: { score: number; label: string }) {
  const data = [{ value: score }, { value: 100 - score }]
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={28} outerRadius={36} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
              <Cell fill="#0a1628" />
              <Cell fill="#eef3fb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-[var(--color-navy-900)]">{score}</span>
        </div>
      </div>
      <span className="text-xs text-[var(--color-muted-foreground)] mt-1 text-center">{label}</span>
    </div>
  )
}

export default function LawyerProfile({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('search')}
            className="flex items-center gap-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-navy-800)] transition-colors"
          >
            <ChevronLeft size={15} /> Search Results
          </button>
          <span className="text-[var(--color-border)]">/</span>
          <span className="text-[var(--color-navy-800)] font-medium">{lawyer.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
              <div className="h-24 bg-[var(--color-navy-950)] relative">
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'linear-gradient(45deg, var(--color-navy-700) 25%, transparent 25%)', backgroundSize: '20px 20px' }} />
              </div>
              <div className="px-6 pb-6">
                <div className="-mt-12 mb-4">
                  <div className="w-20 h-20 rounded-xl border-4 border-white overflow-hidden bg-[var(--color-navy-100)] shadow-lg">
                    <img src={lawyer.photo} alt={lawyer.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold text-[var(--color-navy-900)]">{lawyer.name}</h1>
                      {lawyer.verified && <BadgeCheck size={18} className="text-[var(--color-navy-500)]" />}
                    </div>
                    <div className="text-sm text-[var(--color-muted-foreground)] mt-0.5">
                      {lawyer.yearsOfPractice} years · {lawyer.barNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>
                      {lawyer.performanceScore}
                    </div>
                    <div className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wide">Score</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-sm text-[var(--color-muted-foreground)]">
                  <MapPin size={13} /> {lawyer.city}, {lawyer.state}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-[var(--color-muted-foreground)]">
                  <Star size={13} className="text-[var(--color-gold-500)]" fill="currentColor" />
                  <span className="font-semibold text-[var(--color-navy-800)]">{lawyer.clientRating}</span> client rating
                </div>

                <div className="flex gap-2 mt-5">
                  <button className="flex-1 py-2.5 bg-[var(--color-navy-900)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors">
                    Book Consultation
                  </button>
                  <button className="px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-[var(--color-navy-600)] hover:bg-[var(--color-muted)] transition-colors">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--color-navy-900)] mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={14} className="text-[var(--color-muted-foreground)]" />
                  <a href={`mailto:${lawyer.email}`} className="text-[var(--color-navy-600)] hover:underline">{lawyer.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={14} className="text-[var(--color-muted-foreground)]" />
                  <span className="text-[var(--color-navy-800)]">{lawyer.phone}</span>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--color-navy-900)] mb-4 flex items-center gap-2">
                <BookOpen size={15} /> Education
              </h3>
              <div className="space-y-3">
                {lawyer.education.map((e, i) => (
                  <div key={i}>
                    <div className="text-sm font-medium text-[var(--color-navy-800)]">{e.degree}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)]">{e.institution} · {e.year}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--color-navy-900)] mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map(lang => (
                  <span key={lang} className="text-xs px-2.5 py-1 bg-[var(--color-muted)] text-[var(--color-navy-700)] rounded font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* AI Assistant Summary Box */}
            <div className="glass-card p-6 border-l-4 border-l-primary relative overflow-hidden bg-primary/5">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles size={100} />
              </div>
              <h2 className="text-sm font-bold text-primary flex items-center gap-2 mb-2 uppercase tracking-widest">
                <Sparkles size={16} className="animate-pulse" /> AI Analysis & Verdict
              </h2>
              <p className="text-sm text-text leading-relaxed">
                Based on court data from 2020-2024, {lawyer.name} demonstrates a high win-rate ({lawyer.winRate}%) particularly in Constitutional matters. The lawyer frequently appears before division benches and has secured landmark judgments. 
                <br/><br/>
                <strong>Recommendation:</strong> Highly suitable for complex writ petitions and high-stakes civil rights litigation.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-3">Professional Summary</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{lawyer.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {lawyer.practiceAreas.map(area => (
                  <span key={area} className="text-xs px-2.5 py-1 bg-[var(--color-navy-50)] border border-[var(--color-navy-200)] text-[var(--color-navy-700)] rounded-full font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Key metrics */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-5">Performance Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                {[
                  { label: 'Total Cases', value: lawyer.totalCases.toLocaleString(), icon: <Scale size={16} /> },
                  { label: 'Success Rate', value: `${lawyer.winRate}%`, icon: <TrendingUp size={16} /> },
                  { label: 'Avg Duration', value: `${lawyer.avgCaseDuration}mo`, icon: <Clock size={16} /> },
                  { label: 'Landmark', value: lawyer.landmarkJudgments.toString(), icon: <Award size={16} /> },
                ].map(m => (
                  <div key={m.label} className="text-center p-3 bg-[var(--color-muted)] rounded-lg">
                    <div className="flex items-center justify-center text-[var(--color-navy-500)] mb-2">{m.icon}</div>
                    <div className="text-xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>{m.value}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Win/Loss chart */}
              <h3 className="text-sm font-semibold text-[var(--color-navy-900)] mb-3">Yearly Performance</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caseTimeline} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef3fb" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dce6f4' }} />
                    <Bar dataKey="won" fill="#0a1628" radius={[3, 3, 0, 0]} name="Won" />
                    <Bar dataKey="lost" fill="#a8c0e8" radius={[3, 3, 0, 0]} name="Lost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cases by type */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-5">Cases by Practice Area</h2>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={casesByType} innerRadius={36} outerRadius={60} dataKey="value" strokeWidth={2} stroke="#fff">
                        {casesByType.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {casesByType.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-[var(--color-navy-800)]">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-navy-900)]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent cases */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-4">Recent Cases</h2>
              <div className="space-y-3">
                {recentCases.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--color-muted)] transition-colors cursor-pointer group"
                  >
                    <div className="flex-shrink-0 text-xs text-[var(--color-muted-foreground)] w-16 pt-0.5">{c.date}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-navy-800)] group-hover:text-[var(--color-navy-600)] line-clamp-1">
                        {c.title}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{c.court} · {c.type}</div>
                    </div>
                    <span className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded ${
                      c.outcome === 'Won' ? 'bg-emerald-50 text-emerald-700' :
                      c.outcome === 'Lost' ? 'bg-red-50 text-red-600' :
                      'bg-[var(--color-gold-50)] text-[var(--color-gold-700)]'
                    }`}>
                      {c.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courts */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-4">Courts Practised In</h2>
              <div className="flex flex-wrap gap-2">
                {lawyer.courts.map(court => (
                  <span key={court} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-[var(--color-navy-50)] border border-[var(--color-navy-200)] text-[var(--color-navy-700)] rounded-lg">
                    <Scale size={13} /> {court}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
