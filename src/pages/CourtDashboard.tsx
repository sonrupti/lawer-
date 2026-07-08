import {
  CheckCircle, AlertCircle, Clock, RefreshCw, Database, FileText, Users, AlertTriangle, Activity, Server
} from 'lucide-react'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ingestionHistory = [
  { date: 'Jul 1', judgments: 142 },
  { date: 'Jul 2', judgments: 218 },
  { date: 'Jul 3', judgments: 0 },
  { date: 'Jul 4', judgments: 196 },
  { date: 'Jul 5', judgments: 234 },
  { date: 'Jul 6', judgments: 178 },
  { date: 'Jul 7', judgments: 201 },
]

const errorLogs = [
  { time: '14:32:11', level: 'WARN', message: 'PDF parse failed: Judgment #OHC-2024-18294 (corrupt file)', source: 'ohc-scraper' },
  { time: '12:14:07', level: 'ERROR', message: 'Rate limit hit — Odisha HC portal returned 429', source: 'ohc-scraper' },
  { time: '11:58:44', level: 'INFO', message: 'Ingestion batch #448 completed: 196 judgments', source: 'pipeline' },
  { time: '10:22:03', level: 'WARN', message: 'Duplicate case detected: OHC/CRL/142/2024 — skipped', source: 'dedup' },
  { time: '09:01:18', level: 'INFO', message: 'Scraper restarted after nightly maintenance window', source: 'ohc-scraper' },
]

const courts = [
  {
    name: 'Odisha High Court',
    status: 'live',
    lastRun: '4 min ago',
    totalJudgments: 28412,
    profilesGenerated: 1847,
    errorsToday: 3,
    coverageDate: 'Jan 2018 – present',
  },
  {
    name: 'Bhubaneswar District Court',
    status: 'live',
    lastRun: '12 min ago',
    totalJudgments: 11248,
    profilesGenerated: 602,
    errorsToday: 1,
    coverageDate: 'Jun 2020 – present',
  },
  {
    name: 'Cuttack District Court',
    status: 'live',
    lastRun: '18 min ago',
    totalJudgments: 8921,
    profilesGenerated: 481,
    errorsToday: 0,
    coverageDate: 'Jun 2020 – present',
  },
  {
    name: 'Sambalpur District Court',
    status: 'indexing',
    lastRun: '2 hrs ago',
    totalJudgments: 2103,
    profilesGenerated: 89,
    errorsToday: 8,
    coverageDate: 'Jan 2022 – present',
  },
  {
    name: 'NCLT Cuttack',
    status: 'live',
    lastRun: '1 hr ago',
    totalJudgments: 2140,
    profilesGenerated: 94,
    errorsToday: 0,
    coverageDate: 'Mar 2021 – present',
  },
]

function StatusDot({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
      status === 'live' ? 'bg-emerald-50 text-emerald-700' :
      status === 'indexing' ? 'bg-[var(--color-gold-50)] text-[var(--color-gold-700)]' :
      'bg-red-50 text-red-600'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'live' ? 'bg-emerald-500 animate-pulse' :
        status === 'indexing' ? 'bg-[var(--color-gold-500)]' :
        'bg-red-500'
      }`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function CourtDashboard() {
  const [addingCourt, setAddingCourt] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>
              Court Dashboard
            </h1>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Odisha courts · data ingestion status</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-navy-700)] hover:bg-[var(--color-muted)] transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => setAddingCourt(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-navy-900)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
            >
              + Add Court
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FileText size={16} />, value: '52,824', label: 'Total Judgments', sub: '+178 today' },
            { icon: <Users size={16} />, value: '3,113', label: 'Lawyer Profiles', sub: 'Auto-generated' },
            { icon: <CheckCircle size={16} />, value: '4 / 5', label: 'Courts Live', sub: '1 indexing' },
            { icon: <AlertTriangle size={16} />, value: '12', label: 'Errors Today', sub: '3 need review' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-xl border border-[var(--color-border)] p-5">
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] mb-3">
                {m.icon}
                <span className="text-sm">{m.label}</span>
              </div>
              <div className="text-2xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>{m.value}</div>
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Ingestion chart */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[var(--color-navy-900)]">Daily Ingestion — Last 7 Days</h2>
            <span className="text-xs text-[var(--color-muted-foreground)]">Odisha High Court</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingestionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef3fb" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dce6f4' }} />
                <Line type="monotone" dataKey="judgments" stroke="#0a1628" strokeWidth={2} dot={{ fill: '#0a1628', r: 4 }} name="Judgments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Court status table */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--color-navy-900)]">Court Scraper Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
                  {['Court', 'Status', 'Last Run', 'Judgments', 'Profiles', 'Errors Today', 'Coverage'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courts.map((court, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)] transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[var(--color-navy-800)]">{court.name}</td>
                    <td className="px-5 py-4"><StatusDot status={court.status} /></td>
                    <td className="px-5 py-4 text-sm text-[var(--color-muted-foreground)]">{court.lastRun}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--color-navy-800)]">{court.totalJudgments.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-navy-700)]">{court.profilesGenerated.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${court.errorsToday > 5 ? 'text-red-600' : court.errorsToday > 0 ? 'text-[var(--color-gold-600)]' : 'text-emerald-600'}`}>
                        {court.errorsToday}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--color-muted-foreground)]">{court.coverageDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error logs */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-base font-semibold text-[var(--color-navy-900)]">Recent Log Entries</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {errorLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-3 hover:bg-[var(--color-muted)] transition-colors">
                <span className="text-xs font-mono text-[var(--color-muted-foreground)] w-16 flex-shrink-0 pt-0.5">{log.time}</span>
                <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded w-12 text-center ${
                  log.level === 'ERROR' ? 'bg-red-50 text-red-600' :
                  log.level === 'WARN' ? 'bg-[var(--color-gold-50)] text-[var(--color-gold-700)]' :
                  'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'
                }`}>
                  {log.level}
                </span>
                <span className="text-sm text-[var(--color-navy-800)] flex-1">{log.message}</span>
                <span className="text-xs font-mono text-[var(--color-muted-foreground)] flex-shrink-0">{log.source}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add court modal */}
        {addingCourt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-bold text-[var(--color-navy-900)] text-lg mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Add District Court
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Court Name', placeholder: 'e.g. Berhampur District Court' },
                  { label: 'Portal URL', placeholder: 'https://districts.ecourts.gov.in/...' },
                  { label: 'Coverage From', placeholder: 'YYYY-MM-DD' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-[var(--color-navy-700)] mb-1.5 uppercase tracking-wide">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-navy-800)] outline-none focus:border-[var(--color-navy-500)] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setAddingCourt(false)}
                  className="flex-1 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-navy-700)] hover:bg-[var(--color-muted)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setAddingCourt(false)}
                  className="flex-1 py-2.5 bg-[var(--color-navy-900)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
                >
                  Add & Start Indexing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
