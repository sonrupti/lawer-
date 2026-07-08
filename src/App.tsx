import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import SearchResults from './pages/SearchResults'
import LawyerProfile from './pages/LawyerProfile'
import CaseAnalytics from './pages/CaseAnalytics'
import CourtDashboard from './pages/CourtDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Navigation from './components/Navigation'
import StateDashboard from './pages/StateDashboard'

export type Page = 'landing' | 'search' | 'profile' | 'analytics' | 'court' | 'admin' | 'state'

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [searchQuery, setSearchQuery] = useState('')
  const [stateId, setStateId] = useState('')

  const navigate = (p: Page, query?: string) => {
    if (p === 'state' && query) setStateId(query)
    else if (query) setSearchQuery(query)
    setPage(p)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      <Navigation currentPage={page} navigate={navigate} />
      {page === 'landing' && <LandingPage navigate={navigate} />}
      {page === 'search' && <SearchResults query={searchQuery} navigate={navigate} />}
      {page === 'profile' && <LawyerProfile navigate={navigate} />}
      {page === 'analytics' && <CaseAnalytics />}
      {page === 'court' && <CourtDashboard />}
      {page === 'admin' && <AdminDashboard />}
      {page === 'state' && <StateDashboard stateId={stateId} navigate={navigate} />}
    </div>
  )
}
