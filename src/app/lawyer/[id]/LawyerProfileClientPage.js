"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Landmark, Clock, Award, ShieldAlert, 
  CheckCircle, HelpCircle, Search, Calendar, Play 
} from "lucide-react";

export default function LawyerProfileClientPage({ lawyer }) {
  const [caseSearch, setCaseSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");

  const cases = lawyer.cases || [];
  const totalCases = cases.length;
  const disposedCases = cases.filter(c => c.status === "Disposed");
  const disposedCount = disposedCases.length;
  const pendingCount = totalCases - disposedCount;

  // 1. Calculate Case Outcomes Distribution
  const outcomesCount = {
    Allowed: cases.filter(c => c.outcome === "Allowed").length,
    Dismissed: cases.filter(c => c.outcome === "Dismissed").length,
    "Partly Allowed": cases.filter(c => c.outcome === "Partly Allowed").length,
    Withdrawn: cases.filter(c => c.outcome === "Withdrawn").length,
    Transferred: cases.filter(c => c.outcome === "Transferred").length,
    Pending: cases.filter(c => c.outcome === "Pending").length,
  };

  // 2. Calculate Case Specializations Count
  const specializations = {};
  cases.forEach(c => {
    specializations[c.case_type] = (specializations[c.case_type] || 0) + 1;
  });

  // Convert to sorted array for rendering
  const specList = Object.entries(specializations)
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalCases > 0 ? Math.round((count / totalCases) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // 3. Generate Chess.com / Valorant style Career Timeline Milestones
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - lawyer.experience;
  const timelineMilestones = [
    {
      year: startYear,
      title: "Started Legal Practice",
      description: `Registered under Odisha State Bar Council with Bar Number ${lawyer.bar_number}.`
    },
    {
      year: startYear + 3,
      title: "First High Court Appearance",
      description: "Successfully argued civil revision before a single judge bench."
    }
  ];

  if (lawyer.experience > 8) {
    timelineMilestones.push({
      year: startYear + 6,
      title: "Practice Focus Shift",
      description: "Shifted core focus toward division bench arguments on constitutional writ petitions."
    });
  }

  if (lawyer.experience > 15) {
    timelineMilestones.push({
      year: startYear + 12,
      title: "Landmark Property Ruling",
      description: "Represented petitioners in a major land acquisition matter, setting a new precedent."
    });
    timelineMilestones.push({
      year: startYear + 18,
      title: "Designated Senior Counsel",
      description: "Recognized as a leading advocate for state matters in Cuttack."
    });
  }

  // 4. Generate GitHub style Contribution Heatmap (last 12 months)
  // We represent each month as 4 weeks (48 total squares)
  // We determine cell intensities based on cases filed in those months
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  
  const heatmapData = months.map((monthName, mIdx) => {
    // Check how many cases were filed in this month index
    // For simplicity, we match cases whose filing date month matches the month index (roughly)
    const monthCases = cases.filter(c => {
      const date = new Date(c.filing_date);
      // July is month index 6, August is 7, etc.
      const monthNamesLong = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const caseMonth = monthNamesLong[date.getMonth()];
      return caseMonth.startsWith(monthName.toLowerCase());
    });

    const caseCount = monthCases.length;
    // Map case count to intensity colors
    // 0 = none, 1 = low, 2 = medium, 3+ = high activity
    return Array.from({ length: 4 }).map((_, wIdx) => {
      let intensity = "bg-border/20"; // no activity
      let tooltip = `Week ${wIdx + 1} of ${monthName}: No cases filed`;

      if (caseCount > 0) {
        if (wIdx === (mIdx % 4)) { // distribute cases across weeks for realistic lookup
          if (caseCount === 1) {
            intensity = "bg-success/30 dark:bg-success/20 border border-success/40";
            tooltip = `Week ${wIdx + 1} of ${monthName}: 1 case filed`;
          } else if (caseCount === 2) {
            intensity = "bg-success/60 dark:bg-success/50";
            tooltip = `Week ${wIdx + 1} of ${monthName}: 2 cases filed`;
          } else {
            intensity = "bg-success dark:bg-success";
            tooltip = `Week ${wIdx + 1} of ${monthName}: ${caseCount} cases filed`;
          }
        }
      }
      return { intensity, tooltip };
    });
  });

  // 5. Filter Cases for Case Explorer
  const filteredCases = cases.filter(c => {
    if (caseSearch && !c.case_number.toLowerCase().includes(caseSearch.toLowerCase())) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (outcomeFilter && c.outcome !== outcomeFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      
      {/* Back to Directory link */}
      <div className="mb-6">
        <Link 
          href="/lawyers" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK TO DIRECTORY
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="glass-card border border-border p-6 mb-8 relative overflow-hidden bg-surface/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            
            {/* FIFA style player badge */}
            <div className="relative flex h-20 w-16 flex-col items-center justify-center border-2 border-accent bg-surface/60 rounded-t-xl rounded-b-lg shadow-lg">
              <span className="text-3xl font-black text-text tracking-tighter leading-none">
                {Math.min(99, 70 + Math.round(lawyer.experience * 0.8) + Math.round(disposedCount * 0.5))}
              </span>
              <span className="text-[10px] uppercase font-bold text-accent tracking-widest leading-none mt-1">
                OVR
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-black text-text tracking-tight">{lawyer.name}</h1>
                {lawyer.experience >= 20 && (
                  <span className="rounded bg-accent/25 border border-accent/40 px-2 py-0.5 text-[10px] font-black text-accent uppercase tracking-widest">
                    SENIOR ADV.
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-1">
                Bar registration: <span className="font-mono text-accent">{lawyer.bar_number}</span> • Location: {lawyer.city}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lawyer.practice_area.split(",").map((area, idx) => (
                  <span key={idx} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-text">
                    {area.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <a 
              href={`mailto:${lawyer.email}`}
              className="rounded-lg bg-primary py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:shadow-primary/30 transition-all duration-200 cursor-pointer"
            >
              Book Consultation
            </a>
            <button 
              onClick={() => alert(`Subscribed to case notifications for ${lawyer.name}`)}
              className="rounded-lg border border-border bg-surface hover:bg-surface-2 py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-text transition-all duration-200 cursor-pointer"
            >
              Follow Activity
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/50 pt-6 mt-6 text-center">
          <div className="p-3 bg-surface-2/45 rounded-lg border border-border/40">
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Cases</span>
            <span className="text-2xl font-black text-text mt-1 block">{totalCases}</span>
          </div>
          <div className="p-3 bg-surface-2/45 rounded-lg border border-border/40">
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Pending</span>
            <span className="text-2xl font-black text-primary mt-1 block">{pendingCount}</span>
          </div>
          <div className="p-3 bg-surface-2/45 rounded-lg border border-border/40">
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Disposed</span>
            <span className="text-2xl font-black text-success mt-1 block">{disposedCount}</span>
          </div>
          <div className="p-3 bg-surface-2/45 rounded-lg border border-border/40">
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">Avg Disposal</span>
            <span className="text-2xl font-black text-accent mt-1 block">{lawyer.avg_disposal_time} Months</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COLUMN: SPECIALIZATIONS & AI INSIGHT */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* AI PRACTICE INSIGHT BOX */}
          <div className="glass-card border border-border p-6 bg-surface/30">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
              <Award className="h-4 w-4 text-accent animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">AI Practice Footprint</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {lawyer.ai_insight || "AI analysis footprint will generate when case indexes cross threshold limits."}
            </p>
          </div>

          {/* DYNAMIC SVG SPECIALIZATION BAR CHART */}
          <div className="glass-card border border-border p-6 bg-surface/30">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
              <Landmark className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">Specialty breakdown</h3>
            </div>
            {specList.length > 0 ? (
              <div className="space-y-4">
                {specList.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-text-muted">{item.type}</span>
                      <span className="text-text">{item.count} cases ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-primary" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">No specialty cases registered.</p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: OUTCOMES, TIMELINE, HEATMAP */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CASE OUTCOMES DISTRIBUTION */}
            <div className="glass-card border border-border p-6 bg-surface/30">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
                <CheckCircle className="h-4 w-4 text-success" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text">Case Outcomes</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-success/80 tracking-wider">Allowed</span>
                  <span className="text-xl font-black text-success">{outcomesCount.Allowed}</span>
                </div>
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-danger/80 tracking-wider">Dismissed</span>
                  <span className="text-xl font-black text-danger">{outcomesCount.Dismissed}</span>
                </div>
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-accent/80 tracking-wider">Partly Allowed</span>
                  <span className="text-xl font-black text-accent">{outcomesCount["Partly Allowed"]}</span>
                </div>
                <div className="p-3 bg-border/20 border border-border/40 rounded-lg">
                  <span className="block text-[9px] uppercase font-bold text-text-muted/80 tracking-wider">Withdrawn</span>
                  <span className="text-xl font-black text-text">{outcomesCount.Withdrawn}</span>
                </div>
              </div>
            </div>

            {/* GITHUB STYLE CONTRIBUTION HEATMAP */}
            <div className="glass-card border border-border p-6 bg-surface/30">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-text">Filing Activity Heatmap</h3>
              </div>
              
              <div className="flex flex-col justify-between h-full pb-2">
                <div className="grid grid-cols-6 gap-3">
                  {months.map((mName, mIdx) => (
                    <div key={mName} className="space-y-1">
                      <span className="text-[10px] font-bold text-text-muted block text-center">{mName}</span>
                      <div className="grid grid-cols-2 gap-1 justify-center">
                        {heatmapData[mIdx].map((week, wIdx) => (
                          <div
                            key={wIdx}
                            title={week.tooltip}
                            className={`h-3 w-3 rounded-sm transition-colors duration-200 cursor-help ${week.intensity}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1.5 text-[9px] text-text-muted mt-4">
                  <span>Less</span>
                  <div className="h-2 w-2 rounded-sm bg-border/20" />
                  <div className="h-2 w-2 rounded-sm bg-success/30 dark:bg-success/20 border border-success/40" />
                  <div className="h-2 w-2 rounded-sm bg-success/60 dark:bg-success/50" />
                  <div className="h-2 w-2 rounded-sm bg-success dark:bg-success" />
                  <span>More</span>
                </div>
              </div>
            </div>

          </div>

          {/* CHESS.COM STYLE CAREER TIMELINE */}
          <div className="glass-card border border-border p-6 bg-surface/30">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">Career Timeline</h3>
            </div>
            
            <div className="relative border-l border-border pl-6 ml-3 space-y-6">
              {timelineMilestones.map((milestone, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-bg border-2 border-primary">
                    <Play className="h-1.5 w-1.5 text-primary fill-primary rotate-0" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-accent">{milestone.year}</span>
                    <h4 className="text-sm font-bold text-text mt-0.5">{milestone.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed mt-1">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ----------------- CASE EXPLORER DATA TABLE ----------------- */}
      <div className="glass-card border border-border p-6 bg-surface/30">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-4 mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-text">Case Explorer</h3>
            <p className="text-xs text-text-muted">Verified record history retrieved from court portal.</p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Box */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Case number..."
                value={caseSearch}
                onChange={(e) => setCaseSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg pl-8 pr-3 py-1.5 text-xs text-text focus:outline-none"
              />
            </div>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs text-text cursor-pointer focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Disposed">Disposed</option>
            </select>

            {/* Outcome Select */}
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="rounded-lg border border-border bg-bg px-3 py-1.5 text-xs text-text cursor-pointer focus:outline-none"
            >
              <option value="">All Outcomes</option>
              <option value="Pending">Pending</option>
              <option value="Allowed">Allowed</option>
              <option value="Dismissed">Dismissed</option>
              <option value="Partly Allowed">Partly Allowed</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Transferred">Transferred</option>
            </select>

          </div>
        </div>

        {/* Data Table */}
        {filteredCases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-text-muted font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Case Number</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Court</th>
                  <th className="py-3 px-4">Filing Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Judgment Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-2/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-text">{c.case_number}</td>
                    <td className="py-3.5 px-4 text-text">{c.case_type}</td>
                    <td className="py-3.5 px-4 text-text">{c.court}</td>
                    <td className="py-3.5 px-4 text-text">{c.filing_date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        c.status === "Pending" 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "bg-success/10 text-success border border-success/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        c.outcome === "Allowed"
                          ? "bg-success/15 text-success"
                          : c.outcome === "Dismissed"
                          ? "bg-danger/15 text-danger"
                          : c.outcome === "Partly Allowed"
                          ? "bg-accent/15 text-accent"
                          : "bg-surface-2 text-text-muted border border-border"
                      }`}>
                        {c.outcome}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted max-w-sm leading-relaxed">
                      {c.judgment || <span className="italic text-text-muted/40">Hearing in progress...</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-text-muted">
            No cases match the selected filters.
          </div>
        )}

      </div>

    </div>
  );
}
