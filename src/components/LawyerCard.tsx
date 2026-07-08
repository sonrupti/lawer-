import { BadgeCheck, Star, TrendingUp, Scale, MapPin, Clock } from 'lucide-react'
import type { Lawyer } from '../data/lawyers'
import type { Page } from '../App'

interface Props {
  lawyer: Lawyer
  navigate: (page: Page) => void
}

function getRankTier(score: number) {
  if (score >= 95) return { tier: 'DIAMOND', badgeStyle: 'bg-blue-500/10 text-blue-500 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]', glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' };
  if (score >= 90) return { tier: 'PLATINUM', badgeStyle: 'bg-slate-300/10 text-slate-400 border-slate-400/30 shadow-[0_0_10px_rgba(148,163,184,0.2)]', glow: 'group-hover:shadow-[0_0_20px_rgba(148,163,184,0.3)]' };
  if (score >= 80) return { tier: 'GOLD', badgeStyle: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]', glow: 'group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]' };
  if (score >= 70) return { tier: 'SILVER', badgeStyle: 'bg-gray-400/10 text-gray-400 border-gray-400/30', glow: 'group-hover:shadow-[0_0_15px_rgba(156,163,175,0.2)]' };
  return { tier: 'BRONZE', badgeStyle: 'bg-orange-700/10 text-orange-700 border-orange-700/30', glow: 'group-hover:shadow-[0_0_10px_rgba(194,65,12,0.1)]' };
}

function ScoreBadge({ score }: { score: number }) {
  const { tier, badgeStyle } = getRankTier(score);
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-widest uppercase transition-all ${badgeStyle}`}>
      <TrendingUp size={12} />
      {tier} RANK • {score}
    </div>
  )
}

export default function LawyerCard({ lawyer, navigate }: Props) {
  const rank = getRankTier(lawyer.performanceScore);

  return (
    <div
      className={`glass-card p-5 relative overflow-hidden cursor-pointer group border border-border transition-all duration-300 transform hover:-translate-y-1 ${rank.glow}`}
      onClick={() => navigate('profile')}
    >
      {/* Decorative rank glow in background */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
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
