import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import { TrendingUp, Scale, Clock, Award, Filter } from 'lucide-react'
import { useState } from 'react'

const yearlyData = [
  { year: '2018', filed: 3200, disposed: 2800, pending: 1400 },
  { year: '2019', filed: 3600, disposed: 3100, pending: 1700 },
  { year: '2020', filed: 2800, disposed: 2400, pending: 2100 },
  { year: '2021', filed: 3900, disposed: 3500, pending: 2500 },
  { year: '2022', filed: 4200, disposed: 4000, pending: 2700 },
  { year: '2023', filed: 4800, disposed: 4600, pending: 2900 },
  { year: '2024', filed: 5100, disposed: 4900, pending: 3100 },
]

const categoryData = [
  { name: 'Criminal', value: 28, color: '#0a1628' },
  { name: 'Civil', value: 22, color: '#2855a8' },
  { name: 'Constitutional', value: 15, color: '#d4a820' },
  { name: 'Family', value: 12, color: '#4472c4' },
  { name: 'Corporate', value: 10, color: '#7098d8' },
  { name: 'Revenue', value: 8, color: '#a8c0e8' },
  { name: 'Other', value: 5, color: '#d4e0f4' },
]

const courtData = [
  { court: 'Odisha HC', cases: 28400, avgDuration: 18, successRate: 68 },
  { court: 'Bhubaneswar DC', cases: 11200, avgDuration: 12, successRate: 71 },
  { court: 'Cuttack DC', cases: 8900, avgDuration: 14, successRate: 69 },
  { court: 'NCLT', cases: 2100, avgDuration: 8, successRate: 74 },
  { court: 'CAT', cases: 1800, avgDuration: 10, successRate: 72 },
]

const durationDistribution = [
  { range: '<3mo', count: 1200 },
  { range: '3-6mo', count: 2800 },
  { range: '6-12mo', count: 4200 },
  { range: '1-2yr', count: 5100 },
  { range: '2-5yr', count: 3800 },
  { range: '>5yr', count: 1600 },
]

function StatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-navy-50)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-navy-600)]">
          {icon}
        </div>
        <span className="text-sm text-[var(--color-muted-foreground)]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
      {sub && <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{sub}</div>}
    </div>
  )
}

export default function CaseAnalytics() {
  const [selectedCourt, setSelectedCourt] = useState('All Courts')

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--color-navy-900)]" style={{ fontFamily: 'var(--font-display)' }}>
                Case Analytics
              </h1>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                Insights from 48,000+ court records across Odisha
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCourt}
                onChange={e => setSelectedCourt(e.target.value)}
                className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-2 bg-white text-[var(--color-navy-800)] outline-none"
              >
                {['All Courts', 'Odisha High Court', 'Bhubaneswar DC', 'Cuttack DC'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Scale size={16} />} value="48,400" label="Total Cases" sub="Across all covered courts" />
          <StatCard icon={<TrendingUp size={16} />} value="69.4%" label="Avg Success Rate" sub="Lawyers with 20+ cases" />
          <StatCard icon={<Clock size={16} />} value="14.2mo" label="Avg Case Duration" sub="Odisha High Court" />
          <StatCard icon={<Award size={16} />} value="234" label="Landmark Judgments" sub="Cited 3+ times" />
        </div>

        {/* Yearly trends */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-5">Case Filing & Disposal Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef3fb" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dce6f4' }} />
                <Area type="monotone" dataKey="filed" fill="#eef3fb" stroke="#2855a8" strokeWidth={2} name="Filed" />
                <Area type="monotone" dataKey="disposed" fill="#d4e0f4" stroke="#0a1628" strokeWidth={2} name="Disposed" />
                <Legend iconType="line" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* By category */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-5">Cases by Category</h2>
            <div className="flex items-center gap-4">
              <div className="w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={40} outerRadius={68} dataKey="value" strokeWidth={2} stroke="#fff">
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val}%`, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {categoryData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-[var(--color-navy-800)]">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-navy-900)]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Duration distribution */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="text-base font-semibold text-[var(--color-navy-900)] mb-5">Case Duration Distribution</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationDistribution} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef3fb" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#5a6e8a' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #dce6f4' }} />
                  <Bar dataKey="count" name="Cases" radius={[4, 4, 0, 0]}>
                    {durationDistribution.map((_, index) => (
                      <Cell key={index} fill={index === 3 ? '#d4a820' : '#0a1628'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Court-wise performance table */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-base font-semibold text-[var(--color-navy-900)]">Court-Wise Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
                  {['Court', 'Total Cases', 'Avg Duration', 'Avg Success Rate', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courtData.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-navy-800)]">{row.court}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-navy-700)]">{row.cases.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-navy-700)]">{row.avgDuration} months</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--color-navy-100)] rounded-full overflow-hidden w-20">
                          <div
                            className="h-full bg-[var(--color-navy-700)] rounded-full"
                            style={{ width: `${row.successRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-navy-800)]">{row.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">Live</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
