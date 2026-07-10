import { useState, useEffect, useRef } from 'react'
import { Search, Scale, FileText, User, ArrowRight, Mic, Sparkles, X } from 'lucide-react'
import { lawyers } from '../data/lawyers'
import type { Page } from '../App'

interface Props {
  isOpen: boolean
  onClose: () => void
  navigate: (page: Page, query?: string) => void
}

export default function CommandPalette({ isOpen, onClose, navigate }: Props) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      // Load recent searches from localStorage
      const history = localStorage.getItem('recent_searches')
      if (history) {
        setRecentSearches(JSON.parse(history))
      }
    }
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const handleSelectPage = (page: Page, param?: string) => {
    // Add to history
    saveSearchHistory(query || page)
    navigate(page, param)
    onClose()
  }

  const saveSearchHistory = (search: string) => {
    if (!search.trim()) return
    const cleanSearch = search.trim()
    const updated = [cleanSearch, ...recentSearches.filter(s => s !== cleanSearch)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }

  // Filter items based on query
  const filteredLawyers = lawyers.filter(l => 
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.practiceAreas.some(a => a.toLowerCase().includes(query.toLowerCase()))
  )

  const pages: { name: string; page: Page; desc: string }[] = [
    { name: "CourtCounsel AI Assistant", page: "chat", desc: "Ask legal questions in natural language" },
    { name: "Lawyer Discovery Board", page: "search", desc: "Find advocates based on verified win-rates" },
    { name: "State Analytics Dashboard", page: "state", desc: "View regional court backlogs and disposal times" },
    { name: "Case Analytics Reports", page: "analytics", desc: "Read statewide litigation statistics and trends" },
    { name: "Data Ingestion Pipeline", page: "court", desc: "Monitor live court scraping tasks" },
  ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()))

  const popularActs = [
    { name: "Bharatiya Nyaya Sanhita (BNS), 2023", desc: "IPC replacement detailing offences" },
    { name: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023", desc: "CrPC replacement outlining criminal process" },
    { name: "Bharatiya Sakshya Adhiniyam (BSA), 2023", desc: "Evidence Act replacement for legal proceedings" },
    { name: "Constitution of India, 1950", desc: "Fundamental rights and administrative layouts" },
  ].filter(a => a.name.toLowerCase().includes(query.toLowerCase()))

  const triggerVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const Recognition = (window as any).webkitSpeechRecognition
      const recognition = new Recognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      setIsListening(true)
      recognition.start()

      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript
        setQuery(resultText)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    } else {
      // Fallback: simulated speech parsing
      setIsListening(true)
      const simulatedSpeeches = [
        "Best property lawyer in Odisha",
        "Procedure to apply for anticipatory bail",
        "Section 173 BNSS details",
      ]
      setTimeout(() => {
        const randomSpeech = simulatedSpeeches[Math.floor(Math.random() * simulatedSpeeches.length)]
        setQuery(randomSpeech)
        setIsListening(false)
      }, 2000)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    // Default search routing to Ask AI chat with query
    handleSelectPage('chat', query)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[12vh]">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main command palette container */}
      <div className="relative w-full max-w-2xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh] transition-all duration-300 transform scale-100">
        
        {/* Search Input field */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <Search size={18} className="text-[var(--color-text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lawyers, pages, legal acts, or ask AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <button
            type="button"
            onClick={triggerVoiceSearch}
            className={`p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all ${isListening ? 'bg-red-500/20 text-red-500 border-red-500/40 animate-pulse' : ''}`}
            title="Voice Search"
          >
            <Mic size={15} />
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded"
          >
            <X size={16} />
          </button>
        </form>

        {/* Results Container */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          
          {isListening && (
            <div className="text-center py-6 text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span>Listening for voice input... Speak clearly in English/Hindi</span>
            </div>
          )}

          {/* 1. Quick Links */}
          {pages.length > 0 && (
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider px-2.5 py-1">Quick Links</span>
              {pages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPage(p.page)}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface)] group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                    <Scale size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{p.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] truncate">{p.desc}</div>
                  </div>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity self-center text-[var(--color-text-muted)]" />
                </button>
              ))}
            </div>
          )}

          {/* 2. Lawyers */}
          {filteredLawyers.length > 0 && (
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider px-2.5 py-1">Verified Lawyers</span>
              {filteredLawyers.slice(0, 3).map((lawyer) => (
                <button
                  key={lawyer.id}
                  onClick={() => handleSelectPage('profile', lawyer.id)}
                  className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface)] group transition-all"
                >
                  <img src={lawyer.photo} alt={lawyer.name} className="w-8 h-8 rounded-full object-cover shrink-0 bg-[var(--color-surface-2)]" />
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{lawyer.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] truncate">{lawyer.practiceAreas.join(', ')} • exp {lawyer.yearsOfPractice} yrs</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-[var(--color-primary)]">{lawyer.performanceScore}</div>
                    <div className="text-[9px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">OVR</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 3. Popular Acts */}
          {popularActs.length > 0 && (
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider px-2.5 py-1">Acts & Codes</span>
              {popularActs.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPage('chat', `Explain ${act.name}`)}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface)] group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{act.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] truncate">{act.desc}</div>
                  </div>
                  <Sparkles size={12} className="self-center text-[var(--color-primary)] shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* 4. Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider px-2.5 py-1">Recent Searches</span>
              <div className="flex flex-wrap gap-2 px-2.5 pt-1">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(search); inputRef.current?.focus() }}
                    className="text-xs px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-full hover:bg-[var(--color-surface)] transition-all cursor-pointer border border-transparent hover:border-[var(--color-border)]"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Command palette Footer */}
        <footer className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]/80 text-[10px] text-[var(--color-text-muted)] flex justify-between items-center px-4 shrink-0 select-none">
          <div>
            Press <kbd className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text)] font-semibold">Enter</kbd> to search AI, or click options to jump.
          </div>
          <div>
            <kbd className="bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text)] font-semibold">ESC</kbd> to close.
          </div>
        </footer>

      </div>
    </div>
  )
}
