import { Search, Scale, TrendingUp, Shield, ChevronRight, Star, BadgeCheck, ArrowRight, Building2, FileText, Users, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import type { Page } from '../App'
import LawyerCard from '../components/LawyerCard'
import { lawyers } from '../data/lawyers'
import Hero from '../components/Hero'
import IndiaMap from '../components/IndiaMap'

interface Props {
  navigate: (page: Page, query?: string) => void
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-[var(--color-navy-900)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
      <div className="text-sm text-[var(--color-muted-foreground)]">{label}</div>
    </div>
  )
}

function HowItWorksStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-navy-900)] text-white flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[var(--color-navy-900)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function LandingPage({ navigate }: Props) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    navigate('search', query)
  }

  return (
    <div className="bg-[var(--bg)] transition-colors duration-300">
      {/* Hero */}
      <Hero navigate={navigate} />
      <IndiaMap navigate={navigate} />

      {/* How Performance Score Works */}
      <section className="py-16 lg:py-20 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-semibold tracking-widest text-[var(--color-gold-600)] uppercase mb-4">
                The Performance Score
              </div>
              <h2
                className="text-3xl lg:text-4xl font-bold text-[var(--color-navy-900)] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Beyond Win/Loss — A Nuanced Measure of Legal Excellence
              </h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-8">
                Legal outcomes depend on far more than a lawyer's skill alone. Our Lawyer Performance Score analyses multiple signals from court records to give you a fair, data-driven picture.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Scale size={16} />, label: 'Cases Handled', desc: 'Depth of courtroom experience across all case types' },
                  { icon: <TrendingUp size={16} />, label: 'Success Rate', desc: 'Verified outcomes where judgment can be determined' },
                  { icon: <Shield size={16} />, label: 'Verified Profile', desc: 'Bar Council cross-checked credentials' },
                  { icon: <BarChart3 size={16} />, label: 'Recent Activity', desc: 'Cases filed and argued in the last 24 months' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[var(--color-navy-50)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-navy-600)] flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-navy-800)]">{item.label}</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score visualization */}
            <div className="bg-[var(--color-navy-950)] rounded-2xl p-8 text-white">
              <div className="text-sm text-[var(--color-navy-300)] mb-6 font-medium">Sample Performance Score</div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-navy-700)]">
                  <img
                    src={lawyers[0].photo}
                    alt={lawyers[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{lawyers[0].name}</div>
                  <div className="text-sm text-[var(--color-navy-300)]">Constitutional Law · 15 yrs</div>
                </div>
                <div className="ml-auto text-4xl font-bold text-[var(--color-gold-400)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {lawyers[0].performanceScore}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Case Volume', value: 82, color: 'bg-[var(--color-navy-500)]' },
                  { label: 'Success Rate', value: 71, color: 'bg-emerald-500' },
                  { label: 'Landmark Cases', value: 90, color: 'bg-[var(--color-gold-500)]' },
                  { label: 'Recent Activity', value: 95, color: 'bg-blue-400' },
                  { label: 'Profile Verified', value: 100, color: 'bg-violet-400' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-navy-300)]">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-navy-800)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="py-16 lg:py-20 bg-[var(--color-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-semibold tracking-widest text-[var(--color-gold-600)] uppercase mb-2">
                Top Rated
              </div>
              <h2
                className="text-2xl lg:text-3xl font-bold text-[var(--color-navy-900)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Featured Lawyers in Odisha
              </h2>
            </div>
            <button
              onClick={() => navigate('search')}
              className="hidden sm:flex items-center gap-1 text-sm text-[var(--color-navy-600)] font-medium hover:text-[var(--color-navy-800)] transition-colors"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {lawyers.slice(0, 6).map(lawyer => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} navigate={navigate} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => navigate('search')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-navy-600)] hover:text-[var(--color-navy-800)] transition-colors"
            >
              View all lawyers <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-20 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-semibold tracking-widest text-[var(--color-gold-600)] uppercase mb-3">
              How It Works
            </div>
            <h2
              className="text-2xl lg:text-3xl font-bold text-[var(--color-navy-900)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Data-Driven Legal Discovery in 3 Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <HowItWorksStep
              number={1}
              title="Search by Need"
              description="Enter your case type, location, or court. Our search engine finds lawyers whose track records match your specific legal situation."
            />
            <HowItWorksStep
              number={2}
              title="Compare Performance"
              description="Review data-backed performance scores, win rates, landmark judgments, and client ratings — all sourced from public court records."
            />
            <HowItWorksStep
              number={3}
              title="Connect Directly"
              description="Contact your chosen advocate, request an appointment, and share case details securely through CourtCounsel's encrypted portal."
            />
          </div>
        </div>
      </section>

      {/* Courts covered */}
      <section className="py-16 lg:py-20 bg-[var(--color-navy-950)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-semibold tracking-widest text-[var(--color-gold-500)] uppercase mb-2">
                Coverage
              </div>
              <h2
                className="text-2xl lg:text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Courts We Cover
              </h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--color-navy-400)] uppercase tracking-wide">MVP</div>
              <div className="text-sm text-[var(--color-navy-200)] font-medium">Odisha · Expanding to all states</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Odisha High Court', status: 'Live', cases: '28,400+', icon: <Building2 size={18} /> },
              { name: 'Bhubaneswar District Court', status: 'Live', cases: '11,200+', icon: <Building2 size={18} /> },
              { name: 'Cuttack District Court', status: 'Live', cases: '8,900+', icon: <Building2 size={18} /> },
              { name: 'Sambalpur District Court', status: 'Indexing', cases: 'In progress', icon: <Building2 size={18} /> },
              { name: 'NCLT Cuttack', status: 'Live', cases: '2,100+', icon: <Building2 size={18} /> },
              { name: 'More Courts', status: 'Coming Soon', cases: 'Q3 2025', icon: <ArrowRight size={18} /> },
            ].map(court => (
              <div
                key={court.name}
                className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-navy-800)] bg-[var(--color-navy-900)]/50"
              >
                <div className="text-[var(--color-gold-400)] mt-0.5">{court.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{court.name}</div>
                  <div className="text-xs text-[var(--color-navy-400)] mt-0.5">{court.cases} judgments</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  court.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400' :
                  court.status === 'Indexing' ? 'bg-[var(--color-gold-500)]/20 text-[var(--color-gold-400)]' :
                  'bg-[var(--color-navy-700)] text-[var(--color-navy-300)]'
                }`}>
                  {court.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-navy-50)] border border-[var(--color-border)] mb-6">
            <Scale size={24} className="text-[var(--color-navy-600)]" />
          </div>
          <h2
            className="text-3xl lg:text-4xl font-bold text-[var(--color-navy-900)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Find Your Advocate Today
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-8 max-w-xl mx-auto">
            Search through 2,400+ verified lawyers indexed from Odisha court records. Free to browse — no registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('search')}
              className="px-6 py-3 bg-[var(--color-navy-900)] text-white rounded-lg font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
            >
              Search Lawyers
            </button>
            <button
              onClick={() => navigate('analytics')}
              className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-navy-700)] rounded-lg font-semibold hover:bg-[var(--color-muted)] transition-colors"
            >
              View Case Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-navy-950)] text-[var(--color-navy-300)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[var(--color-navy-800)] rounded flex items-center justify-center">
                  <Scale size={14} className="text-[var(--color-gold-400)]" />
                </div>
                <span className="font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  CourtCounsel
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-navy-400)]">
                India's first court-performance lawyer database. Powered by publicly available court records.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-navy-500)] mb-4">Product</div>
              <ul className="space-y-2 text-sm">
                {['Search Lawyers', 'Case Analytics', 'Court Dashboard', 'API Access'].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-navy-500)] mb-4">Legal</div>
              <ul className="space-y-2 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Data Sources', 'Disclaimer'].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-navy-500)] mb-4">Company</div>
              <ul className="space-y-2 text-sm">
                {['About Us', 'Blog', 'Contact', 'Careers'].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[var(--color-navy-800)] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--color-navy-500)]">
            <span>© 2025 CourtCounsel India. Data sourced from public court records.</span>
            <span>Status: <span className="text-emerald-400 font-medium">Odisha High Court live</span></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
