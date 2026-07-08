import { BadgeCheck, Star, TrendingUp, Scale, MapPin, Clock } from 'lucide-react'
import type { Lawyer } from '../data/lawyers'
import type { Page } from '../App'

interface Props {
  lawyer: Lawyer
  navigate: (page: Page) => void
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : score >= 70 ? 'bg-[var(--color-gold-50)] text-[var(--color-gold-700)] border-[var(--color-gold-200)]'
    : 'bg-slate-50 text-slate-600 border-slate-200'
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-semibold ${color}`}>
      <TrendingUp size={11} />
      {score}
    </div>
  )
}

export default function LawyerCard({ lawyer, navigate }: Props) {
  return (
    <div
      className="bg-white border border-[var(--color-border)] rounded-xl p-5 hover:shadow-md hover:border-[var(--color-navy-200)] transition-all cursor-pointer group"
      onClick={() => navigate('profile')}
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-navy-100)]">
            <img src={lawyer.photo} alt={lawyer.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--color-navy-900)] text-[15px] group-hover:text-[var(--color-navy-600)] transition-colors">
                  {lawyer.name}
                </h3>
                {lawyer.verified && (
                  <BadgeCheck size={15} className="text-[var(--color-navy-500)] flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                <MapPin size={11} />
                {lawyer.city} · {lawyer.yearsOfPractice} yrs exp
              </div>
            </div>
            <ScoreBadge score={lawyer.performanceScore} />
          </div>

          {/* Practice areas */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {lawyer.practiceAreas.slice(0, 3).map(area => (
              <span
                key={area}
                className="text-[11px] px-2 py-0.5 bg-[var(--color-muted)] text-[var(--color-navy-700)] rounded font-medium"
              >
                {area}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
              <Scale size={11} className="text-[var(--color-navy-400)]" />
              <span className="font-semibold text-[var(--color-navy-800)]">{lawyer.totalCases}</span> cases
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
              <TrendingUp size={11} className="text-emerald-500" />
              <span className="font-semibold text-[var(--color-navy-800)]">{lawyer.winRate}%</span> success
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
              <Star size={11} className="text-[var(--color-gold-500)]" fill="currentColor" />
              <span className="font-semibold text-[var(--color-navy-800)]">{lawyer.clientRating}</span>
            </div>
            <div className="ml-auto">
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Active {lawyer.recentActivity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
