import { useState, useEffect, useRef } from 'react'
import { Sparkles, ArrowRight, Scale, Shield, Users, Landmark, BookOpen, ChevronRight, Zap, AlertCircle } from 'lucide-react'
import type { Page } from '../App'

interface Props {
  navigate: (page: Page, query?: string) => void
}

const EXAMPLE_QUERIES = [
  "My employer hasn't paid my salary for three months.",
  "My landlord is refusing to return my security deposit.",
  "I received a legal notice for a cheque bounce case.",
  "My neighbour encroached on my property boundary.",
  "My husband wants a divorce and I don't know my rights.",
  "I want to file an FIR but the police are refusing.",
]

function LiveCounter({ target, suffix = '', decimal = false }: { target: number; suffix?: string; decimal?: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1800
    const step = Math.ceil(target / (duration / 20))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { clearInterval(timer); setCount(target) }
      else setCount(start)
    }, 20)
    return () => clearInterval(timer)
  }, [target])
  const display = decimal ? count.toFixed(1) : count
  return <span>{display}{suffix}</span>
}

const judgments = [
  "SC: Right to bail is the rule, jail is the exception under BNSS.",
  "Odisha HC: Tribal land rights cannot be acquired without Gram Sabha approval.",
  "SC: Digital privacy falls under Article 21 of the Constitution.",
  "Delhi HC: Corporate entities must comply with updated digital intermediary rules.",
  "Bombay HC: Simplifies GST refund guidelines for MSME service exporters.",
  "SC: Right to bail is the rule, jail is the exception under BNSS.",
  "Odisha HC: Tribal land rights cannot be acquired without Gram Sabha approval.",
]

export default function Hero({ navigate }: Props) {
  const [query, setQuery] = useState('')
  const [placeholder, setPlaceholder] = useState(EXAMPLE_QUERIES[0])
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Cycle placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => {
        const next = (prev + 1) % EXAMPLE_QUERIES.length
        setPlaceholder(EXAMPLE_QUERIES[next])
        return next
      })
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Mouse glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleAnalyze = () => {
    const text = query.trim()
    if (!text) {
      textareaRef.current?.focus()
      return
    }
    navigate('analyze', text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  return (
    <div ref={heroRef} className="relative overflow-hidden gradient-bg-hero border-b border-[var(--border)]">

      {/* Mouse Glow */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 transition-all duration-500"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          background: 'radial-gradient(circle, rgba(67,97,238,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--primary)] opacity-5 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-violet-500 opacity-5 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-12 right-1/3 w-64 h-64 rounded-full bg-[var(--primary)] opacity-4 blur-3xl animate-blob animation-delay-4000" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Scrolling judgments ticker */}
      <div className="relative border-b border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm h-9 overflow-hidden flex items-center">
        <div className="shrink-0 px-4 bg-[var(--primary)] text-white text-[10px] font-bold uppercase tracking-widest h-full flex items-center gap-1.5 shadow-md z-10">
          <AlertCircle size={12} className="animate-pulse" />
          Live Judgments
        </div>
        <div className="relative overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-14 text-xs font-medium text-[var(--text-muted)] pl-6">
            {judgments.map((item, i) => (
              <span key={i} className="flex items-center gap-2 hover:text-[var(--text)] cursor-pointer transition-colors shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-max py-20 sm:py-28 relative z-10">
        {/* AI Badge */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('chat')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all duration-300 shadow-sm"
          >
            <Sparkles size={14} className="text-[var(--primary)] animate-pulse" />
            India's Most Intelligent AI-Powered Legal Platform
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
          </button>
        </div>

        {/* Headline */}
        <h1
          className="text-center text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-[var(--text)]">Understand Your</span>
          <br />
          <span className="gradient-text">Legal Situation</span>
          <br />
          <span className="text-[var(--text)]">Before You Hire a Lawyer.</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
          Describe your legal issue in one sentence. Our AI provides general legal guidance, identifies the likely practice area, lists the documents you may need, and helps you connect with the right lawyer.
        </p>

        {/* AI Input Box */}
        <div className="max-w-3xl mx-auto">
          <div
            className={`relative rounded-2xl border-2 transition-all duration-300 shadow-xl ${
              isFocused
                ? 'border-[var(--primary)] shadow-[0_0_0_4px_rgba(67,97,238,0.12)]'
                : 'border-[var(--border)] hover:border-[var(--primary)]/30'
            } bg-[var(--surface)] backdrop-blur-sm overflow-hidden`}
          >
            <div className="p-4">
              <textarea
                ref={textareaRef}
                rows={3}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={`Example: ${placeholder}`}
                className="w-full bg-transparent resize-none text-[var(--text)] text-base leading-relaxed outline-none placeholder:text-[var(--text-faint)] font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>

            <div className="flex items-center justify-between px-4 pb-3 gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                <Zap size={12} className="text-[var(--primary)]" />
                <span>AI analysis in seconds · No sign-up required</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('booking')}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Book Consultation
                </button>
                <button
                  onClick={handleAnalyze}
                  className="btn-primary text-sm py-2 px-5"
                >
                  <Sparkles size={15} />
                  Analyze My Case
                </button>
              </div>
            </div>
          </div>

          {/* Quick example pills */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-xs text-[var(--text-faint)] font-medium mr-1 self-center">Try:</span>
            {[
              "Salary not paid for 3 months",
              "Landlord won't return deposit",
              "Cheque bounce legal notice",
            ].map((ex, i) => (
              <button
                key={i}
                onClick={() => { setQuery(ex); navigate('analyze', ex) }}
                className="group flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all"
              >
                {ex}
                <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Scale size={20} />, value: 8.5, suffix: 'M+', label: 'Cases Indexed', decimal: true },
            { icon: <Users size={20} />, value: 450, suffix: 'K+', label: 'Verified Lawyers', decimal: false },
            { icon: <Landmark size={20} />, value: 28, suffix: '', label: 'States & UTs', decimal: false },
            { icon: <Shield size={20} />, value: 800, suffix: '+', label: 'Active Courts', decimal: false },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-premium flex flex-col items-center gap-2 p-5 text-center card-hover"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                <LiveCounter target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
              </div>
              <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: <Shield size={13} />, text: 'Bar Council Verified' },
            { icon: <BookOpen size={13} />, text: 'Grounded in Indian Law' },
            { icon: <Scale size={13} />, text: 'Not Legal Advice' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
              <span className="text-[var(--primary)]">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
