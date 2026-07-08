import { Scale, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  currentPage: Page
  navigate: (page: Page) => void
}

export default function Navigation({ currentPage, navigate }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Find a Lawyer', page: 'search' },
    { label: 'Case Analytics', page: 'analytics' },
    { label: 'Court Dashboard', page: 'court' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[var(--color-navy-900)] rounded flex items-center justify-center">
              <Scale size={16} className="text-[var(--color-gold-400)]" />
            </div>
            <div className="text-left">
              <span
                className="text-[var(--color-navy-900)] font-bold text-lg leading-none block"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CourtCounsel
              </span>
              <span className="text-[10px] text-[var(--color-muted-foreground)] tracking-widest uppercase font-medium leading-none">
                India
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'text-[var(--color-navy-800)] bg-[var(--color-navy-50)]'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-navy-800)] hover:bg-[var(--color-muted)]'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="w-px h-5 bg-[var(--color-border)] mx-2" />
            <button
              onClick={() => navigate('admin')}
              className="px-4 py-2 rounded text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-navy-800)] hover:bg-[var(--color-muted)] transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => navigate('search')}
              className="ml-2 px-4 py-2 rounded bg-[var(--color-navy-900)] text-white text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
            >
              Search Lawyers
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-muted-foreground)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMobileOpen(false) }}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium text-[var(--color-navy-800)] hover:bg-[var(--color-muted)] transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { navigate('admin'); setMobileOpen(false) }}
            className="w-full text-left px-3 py-2 rounded text-sm font-medium text-[var(--color-navy-800)] hover:bg-[var(--color-muted)] transition-colors"
          >
            Admin
          </button>
        </div>
      )}
    </nav>
  )
}
