import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { Page } from '../App'
import LawyerCard from '../components/LawyerCard'
import { lawyers, practiceAreas, courts } from '../data/lawyers'

interface Props {
  query: string
  navigate: (page: Page, query?: string) => void
}

interface Filters {
  court: string
  practiceArea: string
  minScore: number
  city: string
  verified: boolean | null
  minYears: number
}

function FilterSection({ label, children, defaultOpen = true }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[var(--color-border)] pb-4 mb-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-[var(--color-navy-900)] mb-3"
      >
        {label}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

export default function SearchResults({ query, navigate }: Props) {
  const [searchText, setSearchText] = useState(query)
  const [filters, setFilters] = useState<Filters>({
    court: '',
    practiceArea: query && practiceAreas.includes(query) ? query : '',
    minScore: 0,
    city: '',
    verified: null,
    minYears: 0,
  })
  const [sortBy, setSortBy] = useState<'score' | 'cases' | 'winRate' | 'rating'>('score')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const results = useMemo(() => {
    let out = lawyers.filter(l => {
      const q = searchText.toLowerCase()
      const matchesText = !q || l.name.toLowerCase().includes(q) ||
        l.practiceAreas.some(a => a.toLowerCase().includes(q)) ||
        l.courts.some(c => c.toLowerCase().includes(q)) ||
        l.city.toLowerCase().includes(q)
      const matchesCourt = !filters.court || l.courts.includes(filters.court)
      const matchesArea = !filters.practiceArea || l.practiceAreas.includes(filters.practiceArea)
      const matchesScore = l.performanceScore >= filters.minScore
      const matchesCity = !filters.city || l.city.toLowerCase().includes(filters.city.toLowerCase())
      const matchesVerified = filters.verified === null || l.verified === filters.verified
      const matchesYears = l.yearsOfPractice >= filters.minYears
      return matchesText && matchesCourt && matchesArea && matchesScore && matchesCity && matchesVerified && matchesYears
    })

    out.sort((a, b) => {
      if (sortBy === 'score') return b.performanceScore - a.performanceScore
      if (sortBy === 'cases') return b.totalCases - a.totalCases
      if (sortBy === 'winRate') return b.winRate - a.winRate
      return b.clientRating - a.clientRating
    })
    return out
  }, [searchText, filters, sortBy])

  const activeFilterCount = [
    filters.court, filters.practiceArea, filters.city,
    filters.minScore > 0, filters.verified !== null, filters.minYears > 0,
  ].filter(Boolean).length

  const FiltersPanel = () => (
    <div className="space-y-0">
      <FilterSection label="Court">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] cursor-pointer">
            <input type="radio" name="court" checked={!filters.court} onChange={() => setFilter('court', '')} className="accent-[var(--color-navy-700)]" />
            All Courts
          </label>
          {courts.slice(0, 5).map(c => (
            <label key={c} className="flex items-center gap-2 text-sm text-[var(--color-navy-800)] cursor-pointer">
              <input type="radio" name="court" checked={filters.court === c} onChange={() => setFilter('court', c)} className="accent-[var(--color-navy-700)]" />
              {c}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection label="Practice Area">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] cursor-pointer">
            <input type="radio" name="area" checked={!filters.practiceArea} onChange={() => setFilter('practiceArea', '')} className="accent-[var(--color-navy-700)]" />
            All Areas
          </label>
          {practiceAreas.map(a => (
            <label key={a} className="flex items-center gap-2 text-sm text-[var(--color-navy-800)] cursor-pointer">
              <input type="radio" name="area" checked={filters.practiceArea === a} onChange={() => setFilter('practiceArea', a)} className="accent-[var(--color-navy-700)]" />
              {a}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection label="Minimum Performance Score" defaultOpen={false}>
        <input
          type="range" min={0} max={95} step={5}
          value={filters.minScore}
          onChange={e => setFilter('minScore', +e.target.value)}
          className="w-full accent-[var(--color-navy-700)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mt-1">
          <span>Any</span>
          <span className="font-medium text-[var(--color-navy-700)]">{filters.minScore > 0 ? `${filters.minScore}+` : 'No min'}</span>
          <span>95</span>
        </div>
      </FilterSection>

      <FilterSection label="Experience" defaultOpen={false}>
        <input
          type="range" min={0} max={20} step={2}
          value={filters.minYears}
          onChange={e => setFilter('minYears', +e.target.value)}
          className="w-full accent-[var(--color-navy-700)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mt-1">
          <span>Any</span>
          <span className="font-medium text-[var(--color-navy-700)]">{filters.minYears > 0 ? `${filters.minYears}+ yrs` : 'No min'}</span>
          <span>20+</span>
        </div>
      </FilterSection>

      <FilterSection label="Verified Only" defaultOpen={false}>
        <div className="flex gap-3">
          {([null, true, false] as const).map((v, i) => (
            <label key={i} className="flex items-center gap-1.5 text-sm text-[var(--color-navy-800)] cursor-pointer">
              <input
                type="radio" name="verified"
                checked={filters.verified === v}
                onChange={() => setFilter('verified', v)}
                className="accent-[var(--color-navy-700)]"
              />
              {v === null ? 'All' : v ? 'Verified' : 'Unverified'}
            </label>
          ))}
        </div>
      </FilterSection>

      {activeFilterCount > 0 && (
        <button
          onClick={() => setFilters({ court: '', practiceArea: '', minScore: 0, city: '', verified: null, minYears: 0 })}
          className="w-full text-sm text-[var(--color-navy-600)] hover:text-[var(--color-navy-800)] font-medium flex items-center justify-center gap-1 py-2"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Search header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5">
              <Search size={16} className="text-[var(--color-muted-foreground)] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, practice area, court, or city..."
                className="flex-1 text-sm bg-transparent outline-none text-[var(--color-navy-900)] placeholder:text-[var(--color-muted-foreground)]"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              {searchText && (
                <button onClick={() => setSearchText('')} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-navy-800)]">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[var(--color-navy-900)] text-white rounded-lg text-sm font-medium"
            >
              <SlidersHorizontal size={15} />
              Filters {activeFilterCount > 0 && <span className="bg-[var(--color-gold-500)] text-[var(--color-navy-900)] text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-[var(--color-navy-900)]">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-[var(--color-navy-100)] text-[var(--color-navy-700)] px-2 py-0.5 rounded-full font-medium">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <FiltersPanel />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-semibold text-[var(--color-navy-900)]">Filters</span>
                  <button onClick={() => setMobileFiltersOpen(false)}><X size={18} /></button>
                </div>
                <FiltersPanel />
              </div>
            </div>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[var(--color-muted-foreground)]">
                <span className="font-semibold text-[var(--color-navy-900)]">{results.length}</span> lawyers found
                {searchText && ` for "${searchText}"`}
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-1.5 bg-white text-[var(--color-navy-800)] outline-none"
              >
                <option value="score">Sort: Performance Score</option>
                <option value="cases">Sort: Most Cases</option>
                <option value="winRate">Sort: Win Rate</option>
                <option value="rating">Sort: Client Rating</option>
              </select>
            </div>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map(lawyer => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} navigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search size={40} className="text-[var(--color-border)] mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--color-navy-900)] mb-2">No lawyers found</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">Try adjusting your filters or search query.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
