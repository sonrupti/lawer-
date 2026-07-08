import {
  Users, FileText, Shield, Activity, Settings, BadgeCheck, AlertCircle,
  Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, Download
} from 'lucide-react'
import { useState } from 'react'
import { lawyers } from '../data/lawyers'

type Tab = 'lawyers' | 'verify' | 'imports' | 'jobs'

const scrapingJobs = [
  { id: 'JOB-448', court: 'Odisha High Court', started: '14:28:00', status: 'running', processed: 178, total: 200, errors: 2 },
  { id: 'JOB-447', court: 'Bhubaneswar DC', started: '13:15:00', status: 'completed', processed: 96, total: 96, errors: 0 },
  { id: 'JOB-446', court: 'Cuttack DC', started: '12:00:00', status: 'completed', processed: 84, total: 84, errors: 1 },
  { id: 'JOB-445', court: 'Sambalpur DC', started: '11:30:00', status: 'failed', processed: 23, total: 140, errors: 18 },
  { id: 'JOB-444', court: 'NCLT Cuttack', started: '10:45:00', status: 'completed', processed: 42, total: 42, errors: 0 },
]

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    running: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    failed: 'bg-red-50 text-red-600',
    pending: 'bg-[var(--color-gold-50)] text-[var(--color-gold-700)]',
  }
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('lawyers')
  const [searchText, setSearchText] = useState('')

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'lawyers', label: 'Manage Lawyers', icon: <Users size={15} /> },
    { key: 'verify', label: 'Verify Profiles', icon: <Shield size={15} /> },
    { key: 'imports', label: 'Import Data', icon: <FileText size={15} /> },
    { key: 'jobs', label: 'Scraping Jobs', icon: <Activity size={15} /> },
  ]

  const filteredLawyers = lawyers.filter(l =>
    !searchText || l.name.toLowerCase().includes(searchText.toLowerCase()) ||
    l.practiceAreas.some(a => a.toLowerCase().includes(searchText.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>
                Admin Dashboard
              </h1>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Manage profiles, verify lawyers, and monitor data pipelines</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-gold-50)] border border-[var(--color-gold-200)] rounded-lg">
              <AlertCircle size={14} className="text-[var(--color-gold-600)]" />
              <span className="text-xs font-medium text-[var(--color-gold-700)]">3 profiles pending verification</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[var(--color-navy-900)] text-white'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-navy-800)] hover:bg-[var(--color-muted)]'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Users size={16} />, value: '2,413', label: 'Total Lawyers', sub: '89 added this month' },
            { icon: <BadgeCheck size={16} />, value: '1,847', label: 'Verified', sub: '76.5% verified' },
            { icon: <Clock size={16} />, value: '3', label: 'Pending Review', sub: 'Awaiting verification' },
            { icon: <Activity size={16} />, value: '5', label: 'Active Jobs', sub: '1 running now' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] mb-3 text-sm">
                {m.icon} {m.label}
              </div>
              <div className="text-2xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>{m.value}</div>
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        {activeTab === 'lawyers' && (
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-3 py-2">
                <Search size={14} className="text-[var(--color-muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  className="flex-1 text-sm bg-transparent outline-none text-[var(--color-navy-800)] placeholder:text-[var(--color-muted-foreground)]"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-navy-700)] hover:bg-[var(--color-muted)]">
                <Filter size={14} /> Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-navy-700)] hover:bg-[var(--color-muted)]">
                <Download size={14} /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
                    {['Name', 'Bar No.', 'City', 'Practice Areas', 'Cases', 'Score', 'Verified', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLawyers.map(lawyer => (
                    <tr key={lawyer.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={lawyer.photo} alt={lawyer.name} className="w-8 h-8 rounded-full object-cover bg-[var(--color-navy-100)]" />
                          <div>
                            <div className="text-sm font-medium text-[var(--color-navy-800)]">{lawyer.name}</div>
                            <div className="text-xs text-[var(--color-muted-foreground)]">{lawyer.yearsOfPractice} yrs exp</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-[var(--color-muted-foreground)]">{lawyer.barNumber}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-navy-700)]">{lawyer.city}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {lawyer.practiceAreas.slice(0, 2).map(a => (
                            <span key={a} className="text-[10px] px-1.5 py-0.5 bg-[var(--color-muted)] text-[var(--color-navy-700)] rounded">
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--color-navy-800)]">{lawyer.totalCases}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-[var(--color-navy-900)]">{lawyer.performanceScore}</span>
                      </td>
                      <td className="px-5 py-4">
                        {lawyer.verified
                          ? <BadgeCheck size={16} className="text-[var(--color-navy-500)]" />
                          : <span className="text-xs text-[var(--color-gold-600)] font-medium">Pending</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-navy-800)] transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="space-y-4">
            {lawyers.filter(l => !l.verified).concat(lawyers.slice(0, 2)).slice(0, 3).map(lawyer => (
              <div key={lawyer.id} className="bg-white rounded-xl border border-[var(--color-border)] p-5">
                <div className="flex items-start gap-4">
                  <img src={lawyer.photo} alt={lawyer.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--color-navy-900)]">{lawyer.name}</h3>
                      <span className="text-xs text-[var(--color-gold-600)] bg-[var(--color-gold-50)] px-2 py-0.5 rounded-full border border-[var(--color-gold-200)] font-medium">
                        Pending Review
                      </span>
                    </div>
                    <div className="text-sm text-[var(--color-muted-foreground)] mt-1">{lawyer.barNumber} · {lawyer.city}</div>
                    <div className="text-sm text-[var(--color-muted-foreground)] mt-0.5">
                      {lawyer.practiceAreas.join(', ')} · {lawyer.yearsOfPractice} years
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'imports' && (
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="font-semibold text-[var(--color-navy-900)] mb-5">Import Court Data</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Upload Judgment PDF Batch', desc: 'Upload a ZIP of PDF judgments for bulk processing', icon: <FileText size={20} /> },
                { label: 'Import from eCourts API', desc: 'Connect to the eCourts Data API for automated ingestion', icon: <Activity size={20} /> },
                { label: 'CSV Lawyer Import', desc: 'Import lawyer profiles from a structured CSV file', icon: <Download size={20} /> },
                { label: 'Manual Case Entry', desc: 'Enter individual cases and outcomes manually', icon: <Settings size={20} /> },
              ].map(option => (
                <button
                  key={option.label}
                  className="text-left flex items-start gap-4 p-4 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-navy-300)] hover:bg-[var(--color-navy-50)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-navy-600)] group-hover:bg-[var(--color-navy-100)] transition-colors flex-shrink-0">
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-[var(--color-navy-800)]">{option.label}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="font-semibold text-[var(--color-navy-900)]">Scraping Job History</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-navy-900)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors">
                + New Job
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
                    {['Job ID', 'Court', 'Started', 'Status', 'Progress', 'Errors'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scrapingJobs.map(job => (
                    <tr key={job.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)] transition-colors">
                      <td className="px-5 py-4 text-xs font-mono text-[var(--color-navy-600)]">{job.id}</td>
                      <td className="px-5 py-4 text-sm font-medium text-[var(--color-navy-800)]">{job.court}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-muted-foreground)]">{job.started}</td>
                      <td className="px-5 py-4"><StatusChip status={job.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-[var(--color-navy-100)] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${job.status === 'failed' ? 'bg-red-400' : job.status === 'running' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                              style={{ width: `${(job.processed / job.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--color-muted-foreground)]">{job.processed}/{job.total}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-semibold ${job.errors > 5 ? 'text-red-600' : job.errors > 0 ? 'text-[var(--color-gold-600)]' : 'text-emerald-600'}`}>
                          {job.errors}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
