import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import SearchResults from './pages/SearchResults'
import LawyerProfile from './pages/LawyerProfile'
import CaseAnalytics from './pages/CaseAnalytics'
import CourtDashboard from './pages/CourtDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Navigation from './components/Navigation'
import StateDashboard from './pages/StateDashboard'
import ChatPage from './pages/ChatPage'
import CommandPalette from './components/CommandPalette'
import AnalyzePage from './pages/AnalyzePage'
import BookingPage from './pages/BookingPage'
import ClientDashboard from './pages/ClientDashboard'
import KnowledgeCenter from './pages/KnowledgeCenter'
import CommunityPage from './pages/CommunityPage'
import ContractReview from './pages/ContractReview'
import DocumentGenerator from './pages/DocumentGenerator'
import CostEstimator from './pages/CostEstimator'
import { ThemeProvider } from './contexts/ThemeContext'

export type Page =
  | 'landing'
  | 'search'
  | 'profile'
  | 'analytics'
  | 'court'
  | 'admin'
  | 'state'
  | 'chat'
  | 'analyze'
  | 'booking'
  | 'dashboard'
  | 'knowledge'
  | 'community'
  | 'contracts'
  | 'documents'
  | 'estimator'

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [searchQuery, setSearchQuery] = useState('')
  const [stateId, setStateId] = useState('')
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('1')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [legalIssue, setLegalIssue] = useState('')

  // Keyboard shortcut listener for Ctrl+K global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navigate = (p: Page, query?: string) => {
    if (p === 'state' && query) setStateId(query)
    else if (p === 'profile' && query) setSelectedLawyerId(query)
    else if (p === 'analyze' && query) setLegalIssue(query)
    else if (query) setSearchQuery(query)
    setPage(p)
    window.scrollTo(0, 0)
  }

  return (
    <ThemeProvider>
      <div
        className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 relative"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <Navigation currentPage={page} navigate={navigate} />

        {page === 'landing'    && <LandingPage navigate={navigate} />}
        {page === 'search'     && <SearchResults query={searchQuery} navigate={navigate} />}
        {page === 'profile'    && <LawyerProfile lawyerId={selectedLawyerId} navigate={navigate} />}
        {page === 'analytics'  && <CaseAnalytics />}
        {page === 'court'      && <CourtDashboard />}
        {page === 'admin'      && <AdminDashboard />}
        {page === 'state'      && <StateDashboard stateId={stateId} navigate={navigate} />}
        {page === 'chat'       && <ChatPage />}
        {page === 'analyze'    && <AnalyzePage issue={legalIssue} navigate={navigate} />}
        {page === 'booking'    && <BookingPage navigate={navigate} />}
        {page === 'dashboard'  && <ClientDashboard navigate={navigate} />}
        {page === 'knowledge'  && <KnowledgeCenter navigate={navigate} />}
        {page === 'community'  && <CommunityPage navigate={navigate} />}
        {page === 'contracts'  && <ContractReview navigate={navigate} />}
        {page === 'documents'  && <DocumentGenerator navigate={navigate} />}
        {page === 'estimator'  && <CostEstimator navigate={navigate} />}

        {/* Global Command Palette Search Overlay */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          navigate={navigate}
        />
      </div>
    </ThemeProvider>
  )
}
