import { Scale, Menu, X, ChevronDown, Sun, Moon, Monitor } from 'lucide-react'
import { useState } from 'react'
import type { Page } from '../App'
import { useTheme } from '../contexts/ThemeContext'

interface Props {
  currentPage: Page
  navigate: (page: Page, query?: string) => void
}

export default function Navigation({ currentPage, navigate }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Ask AI', page: 'chat' },
    { label: 'Find a Lawyer', page: 'search' },
    { label: 'Case Analytics', page: 'analytics' },
    { label: 'Court Dashboard', page: 'court' },
  ]

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <nav className="sticky top-0 z-50 bg-[var(--card)] border-b border-[var(--color-border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[var(--color-text)] rounded flex items-center justify-center transition-colors">
              <Scale size={16} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-left">
              <span
                className="text-[var(--color-text)] font-bold text-lg leading-none block transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CourtCounsel
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] tracking-widest uppercase font-medium leading-none transition-colors">
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
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'text-[var(--color-text)] bg-[var(--color-surface-2)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="w-px h-5 bg-[var(--color-border)] mx-2" />
            <button
              onClick={() => navigate('admin')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                currentPage === adminPage()
                  ? 'text-[var(--color-text)] bg-[var(--color-surface-2)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              Admin
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={cycleTheme}
              className="p-2 ml-2 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all flex items-center justify-center"
              title={`Theme: ${theme.toUpperCase()}`}
            >
              {theme === 'light' && <Sun size={18} />}
              {theme === 'dark' && <Moon size={18} />}
              {theme === 'system' && <Monitor size={18} />}
            </button>

            <button
              onClick={() => navigate('search')}
              className="ml-3 px-4 py-2 rounded bg-[var(--color-text)] text-[var(--color-bg)] text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              Search Lawyers
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={cycleTheme}
              className="p-2 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-all flex items-center justify-center"
              title={`Theme: ${theme.toUpperCase()}`}
            >
              {theme === 'light' && <Sun size={18} />}
              {theme === 'dark' && <Moon size={18} />}
              {theme === 'system' && <Monitor size={18} />}
            </button>
            <button
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--card)] px-4 py-3 space-y-1 transition-colors duration-300">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMobileOpen(false) }}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { navigate('admin'); setMobileOpen(false) }}
            className="w-full text-left px-3 py-2 rounded text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Admin
          </button>
        </div>
      )}
    </nav>
  )

  function adminPage(): Page {
    return 'admin'
  }
}
