import { useState } from 'react'
import { MapPin, Users, Scale, Clock, TrendingUp } from 'lucide-react'
import type { Page } from '../App'

interface StateData {
  id: string
  name: string
  cx: number
  cy: number
  isUT?: boolean
  cases: string
  lawyers: string
  disposal: string
  winRate: string
}

const STATES: StateData[] = [
  { id: "AP", name: "Andhra Pradesh", cx: 400, cy: 580, cases: "1.2M", lawyers: "8,500", disposal: "2.4 yrs", winRate: "66%" },
  { id: "AR", name: "Arunachal Pradesh", cx: 750, cy: 220, cases: "12K", lawyers: "180", disposal: "1.8 yrs", winRate: "72%" },
  { id: "AS", name: "Assam", cx: 700, cy: 260, cases: "240K", lawyers: "1,200", disposal: "2.1 yrs", winRate: "68%" },
  { id: "BR", name: "Bihar", cx: 500, cy: 280, cases: "2.4M", lawyers: "12,000", disposal: "3.5 yrs", winRate: "59%" },
  { id: "CT", name: "Chhattisgarh", cx: 420, cy: 420, cases: "450K", lawyers: "2,800", disposal: "2.3 yrs", winRate: "65%" },
  { id: "GA", name: "Goa", cx: 220, cy: 620, cases: "35K", lawyers: "450", disposal: "1.5 yrs", winRate: "70%" },
  { id: "GJ", name: "Gujarat", cx: 160, cy: 370, cases: "1.8M", lawyers: "9,200", disposal: "2.2 yrs", winRate: "67%" },
  { id: "HR", name: "Haryana", cx: 270, cy: 170, cases: "850K", lawyers: "4,600", disposal: "1.9 yrs", winRate: "69%" },
  { id: "HP", name: "Himachal Pradesh", cx: 270, cy: 90, cases: "120K", lawyers: "950", disposal: "1.7 yrs", winRate: "71%" },
  { id: "JH", name: "Jharkhand", cx: 510, cy: 360, cases: "580K", lawyers: "3,100", disposal: "2.8 yrs", winRate: "62%" },
  { id: "KA", name: "Karnataka", cx: 270, cy: 660, cases: "2.1M", lawyers: "11,500", disposal: "2.0 yrs", winRate: "68%" },
  { id: "KL", name: "Kerala", cx: 270, cy: 800, cases: "950K", lawyers: "6,200", disposal: "1.6 yrs", winRate: "74%" },
  { id: "MP", name: "Madhya Pradesh", cx: 320, cy: 370, cases: "1.9M", lawyers: "8,900", disposal: "2.5 yrs", winRate: "64%" },
  { id: "MH", name: "Maharashtra", cx: 260, cy: 510, cases: "3.8M", lawyers: "22,000", disposal: "2.7 yrs", winRate: "65%" },
  { id: "MN", name: "Manipur", cx: 760, cy: 310, cases: "18K", lawyers: "220", disposal: "2.0 yrs", winRate: "68%" },
  { id: "ML", name: "Meghalaya", cx: 660, cy: 290, cases: "15K", lawyers: "190", disposal: "1.9 yrs", winRate: "70%" },
  { id: "MZ", name: "Mizoram", cx: 730, cy: 360, cases: "8K", lawyers: "110", disposal: "1.4 yrs", winRate: "75%" },
  { id: "NL", name: "Nagaland", cx: 780, cy: 270, cases: "10K", lawyers: "140", disposal: "2.2 yrs", winRate: "67%" },
  { id: "OR", name: "Odisha", cx: 480, cy: 450, cases: "8.5M", lawyers: "45K", disposal: "2.4 Yrs", winRate: "71%" }, // Focus state
  { id: "PB", name: "Punjab", cx: 220, cy: 120, cases: "920K", lawyers: "5,100", disposal: "2.1 yrs", winRate: "68%" },
  { id: "RJ", name: "Rajasthan", cx: 170, cy: 240, cases: "1.6M", lawyers: "7,800", disposal: "2.6 yrs", winRate: "63%" },
  { id: "SK", name: "Sikkim", cx: 610, cy: 220, cases: "14K", lawyers: "150", disposal: "1.6 yrs", winRate: "73%" },
  { id: "TN", name: "Tamil Nadu", cx: 330, cy: 760, cases: "2.5M", lawyers: "14,000", disposal: "2.2 yrs", winRate: "69%" },
  { id: "TG", name: "Telangana", cx: 370, cy: 570, cases: "1.1M", lawyers: "7,200", disposal: "2.3 yrs", winRate: "67%" },
  { id: "TR", name: "Tripura", cx: 660, cy: 360, cases: "22K", lawyers: "240", disposal: "1.8 yrs", winRate: "71%" },
  { id: "UP", name: "Uttar Pradesh", cx: 410, cy: 220, cases: "5.4M", lawyers: "28,000", disposal: "3.2 yrs", winRate: "60%" },
  { id: "UT", name: "Uttarakhand", cx: 360, cy: 160, cases: "180K", lawyers: "1,100", disposal: "2.0 yrs", winRate: "68%" },
  { id: "WB", name: "West Bengal", cx: 580, cy: 360, cases: "2.8M", lawyers: "13,500", disposal: "2.9 yrs", winRate: "63%" },
  // UTs
  { id: "AN", name: "Andaman & Nicobar", cx: 700, cy: 720, isUT: true, cases: "8K", lawyers: "95", disposal: "1.4 yrs", winRate: "73%" },
  { id: "DL", name: "Delhi", cx: 310, cy: 190, isUT: true, cases: "2.2M", lawyers: "18,000", disposal: "1.8 yrs", winRate: "72%" },
  { id: "JK", name: "Jammu & Kashmir", cx: 210, cy: 40, isUT: true, cases: "340K", lawyers: "1,800", disposal: "2.4 yrs", winRate: "67%" },
  { id: "LA", name: "Ladakh", cx: 290, cy: 30, isUT: true, cases: "5K", lawyers: "45", disposal: "2.1 yrs", winRate: "69%" },
];

interface Props {
  navigate: (page: Page, query?: string) => void
}

export default function IndiaMap({ navigate }: Props) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  const handleStateClick = (state: StateData) => {
    // Navigate to state dashboard
    navigate('state', state.id)
  }

  const activeState = STATES.find(s => s.id === hoveredState)

  return (
    <div className="relative mx-auto w-full max-w-4xl py-12 px-4 transition-colors duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Explore Legal Analytics by Region
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Select a State or Union Territory to view localized case duration, success rates, and lawyer performance.
        </p>
      </div>
      
      {/* SVG Map Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-sm p-6 sm:p-10 shadow-xl transition-all duration-300">
        
        {/* Dynamic Map Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-primary)]/5 via-transparent to-transparent pointer-events-none" />
        
        <svg 
          viewBox="0 0 900 900" 
          className="h-full w-full drop-shadow-md transition-transform duration-700 ease-out hover:scale-[1.01]"
        >
          {STATES.map((state) => {
            const isHovered = hoveredState === state.id
            const isSpecial = state.id === 'OR' // Highlight Odisha
            return (
              <g
                key={state.id}
                transform={`translate(${state.cx}, ${state.cy})`}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(state)}
                className="cursor-pointer"
                style={{
                  transformOrigin: `${state.cx}px ${state.cy}px`
                }}
              >
                {/* Outer Ring Pulse */}
                {isHovered && (
                  <circle 
                    r="22"
                    className="fill-none stroke-[var(--color-primary)]/60 stroke-[3px] animate-ping"
                  />
                )}
                
                {/* State Circle Node */}
                <circle 
                  r={isHovered ? 18 : isSpecial ? 14 : 11} 
                  className={`
                    transition-all duration-300 stroke-2
                    ${isHovered 
                      ? "fill-[var(--color-primary)] stroke-[var(--color-primary)]" 
                      : isSpecial
                        ? "fill-[var(--color-primary)]/20 stroke-[var(--color-primary)] animate-pulse"
                        : state.isUT 
                          ? "fill-[var(--color-surface-2)] stroke-[var(--color-text-muted)]/40" 
                          : "fill-[var(--color-surface)] stroke-[var(--color-border)] hover:stroke-[var(--color-primary)]/70"}
                  `}
                />
                
                {/* Label text */}
                <text
                  y={isHovered ? 34 : 26}
                  textAnchor="middle"
                  className={`
                    text-[10px] font-bold tracking-wider select-none pointer-events-none transition-all duration-300
                    ${isHovered 
                      ? "fill-[var(--color-text)] opacity-100 scale-105" 
                      : isSpecial
                        ? "fill-[var(--color-primary)] opacity-100 font-extrabold"
                        : "fill-[var(--color-text-muted)] opacity-60"}
                  `}
                >
                  {state.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Floating Info panel for hovered state */}
        <div className={`
          absolute bottom-6 right-6 glass-card border border-[var(--color-border)] bg-[var(--color-card)]/90 backdrop-blur-md p-5 w-72 transition-all duration-300 transform shadow-2xl rounded-xl
          ${activeState ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}
        `}>
          {activeState && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  <h3 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                    {activeState.name}
                  </h3>
                </div>
                <span className="text-[10px] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] font-semibold px-2 py-0.5 rounded">
                  {activeState.id}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] flex items-center gap-1">
                    <Scale size={11} /> Cases
                  </span>
                  <div className="font-extrabold text-[var(--color-text)]">{activeState.cases}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] flex items-center gap-1">
                    <Users size={11} /> Lawyers
                  </span>
                  <div className="font-extrabold text-[var(--color-text)]">{activeState.lawyers}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] flex items-center gap-1">
                    <Clock size={11} /> Avg Disposal
                  </span>
                  <div className="font-extrabold text-[var(--color-text)]">{activeState.disposal}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] flex items-center gap-1">
                    <TrendingUp size={11} className="text-emerald-500" /> Win Rate
                  </span>
                  <div className="font-extrabold text-emerald-500">{activeState.winRate}</div>
                </div>
              </div>

              <div className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] leading-relaxed italic">
                * Click on state to explore localized advocates database and court filings breakdown.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
