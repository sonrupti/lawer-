import Link from "next/link";
import { User, ShieldAlert, Award, Calendar, BarChart2 } from "lucide-react";

export default function LawyerCard({ lawyer, searchQuery, searchPracticeArea }) {
  // 1. Calculate statistics
  const cases = lawyer.cases || [];
  const totalCases = cases.length;
  const disposedCases = cases.filter(c => c.status === "Disposed");
  const disposedCount = disposedCases.length;
  const pendingCount = totalCases - disposedCount;

  // Level: 60 + experience (capped at 99)
  const level = Math.min(99, 60 + lawyer.experience);

  // Overall Rating: 70 + experience * 0.8 + disposed cases * 0.5 (capped at 99)
  const overallRating = Math.min(
    99,
    70 + Math.round(lawyer.experience * 0.8) + Math.round(disposedCount * 0.5)
  );

  // Match Score calculation (Relevance to user search)
  // If user searched for a practice area or query, we calculate how well this lawyer matches it.
  let matchScore = 90; // default baseline match
  if (searchPracticeArea) {
    const hasArea = lawyer.practice_area.toLowerCase().includes(searchPracticeArea.toLowerCase());
    if (hasArea) {
      matchScore = 95;
    } else {
      matchScore = 70;
    }
  } else if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const matchesName = lawyer.name.toLowerCase().includes(query);
    const matchesArea = lawyer.practice_area.toLowerCase().includes(query);
    if (matchesName) {
      matchScore = 98;
    } else if (matchesArea) {
      matchScore = 95;
    }
  }

  // 2. Extract recent form (outcomes of last 5 resolved cases)
  // Allowed / Partly Allowed -> W (Win / Green)
  // Dismissed -> L (Loss / Red)
  // Withdrawn / Transferred -> D (Draw / Grey)
  const sortedDisposed = [...disposedCases].sort(
    (a, b) => new Date(b.filing_date) - new Date(a.filing_date)
  );
  
  const recentForm = sortedDisposed.slice(0, 5).map(c => {
    if (c.outcome === "Allowed" || c.outcome === "Partly Allowed") {
      return { label: "W", color: "bg-success text-white border-success" };
    } else if (c.outcome === "Dismissed") {
      return { label: "L", color: "bg-danger text-white border-danger" };
    } else {
      return { label: "D", color: "bg-border text-text-muted border-border" };
    }
  });

  // Pad form array to 5 if they have fewer than 5 disposed cases
  while (recentForm.length < 5) {
    recentForm.push({ label: "-", color: "bg-surface-2 text-text-muted/40 border-border/50" });
  }

  return (
    <div className="glass-card glass-card-hover border border-border p-6 flex flex-col justify-between relative overflow-hidden bg-surface/30">
      
      {/* Glow highlight for high-performing lawyers */}
      {overallRating >= 90 && (
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-accent/10 blur-xl dark:bg-accent/5 pointer-events-none" />
      )}

      {/* Top Card Section: Player Stats Header */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* FIFA-style player shield outline */}
            <div className="relative flex h-14 w-12 flex-col items-center justify-center border-2 border-accent/60 dark:border-accent bg-surface/60 rounded-t-lg rounded-b-md shadow-md">
              <span className="text-xl font-black text-text tracking-tighter leading-none">
                {overallRating}
              </span>
              <span className="text-[9px] uppercase font-bold text-accent tracking-widest leading-none mt-1">
                OVR
              </span>
            </div>
            
            {/* Name and Bar Registration */}
            <div>
              <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-1">
                {lawyer.name}
              </h3>
              <p className="text-xs text-accent font-mono tracking-wider">
                BAR: {lawyer.bar_number}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">
                Level {level} • {lawyer.city}
              </p>
            </div>
          </div>

          {/* Dynamic Match Score Badge */}
          <div className="text-right">
            <span className="inline-block rounded bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/40 px-2 py-0.5 text-xs font-bold text-primary">
              {matchScore}% Match
            </span>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="mt-4">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Practice Specialities
          </span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {lawyer.practice_area.split(",").map((area, idx) => (
              <span
                key={idx}
                className="rounded bg-surface-2 border border-border/40 px-2 py-0.5 text-[10px] font-medium text-text"
              >
                {area.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Lawyer Metrics grid */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border/40 pt-4 text-center">
          <div>
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
              Experience
            </span>
            <span className="text-sm font-bold text-text">{lawyer.experience} Yrs</span>
          </div>
          <div className="border-l border-r border-border/40">
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
              Cases
            </span>
            <span className="text-sm font-bold text-text">{totalCases}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
              Disposed
            </span>
            <span className="text-sm font-bold text-text">{disposedCount}</span>
          </div>
        </div>

        {/* Recent Form (W/L/D Badges) */}
        <div className="mt-5">
          <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider mb-2">
            Recent Form (Last 5 Resolved)
          </span>
          <div className="flex items-center gap-2">
            {recentForm.map((item, idx) => (
              <div
                key={idx}
                title={
                  item.label === "W"
                    ? "Case Allowed (Win)"
                    : item.label === "L"
                    ? "Case Dismissed (Loss)"
                    : item.label === "D"
                    ? "Case Withdrawn/Transferred"
                    : "No records"
                }
                className={`h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-black tracking-tight ${item.color}`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Button */}
      <div className="mt-6 border-t border-border/40 pt-4">
        <Link
          href={`/lawyer/${lawyer.id}`}
          className="block w-full text-center rounded-lg border border-primary/50 hover:bg-primary py-2 text-xs font-bold uppercase tracking-wider text-text hover:text-white transition-all duration-200 cursor-pointer"
        >
          VIEW PLAYER PROFILE
        </Link>
      </div>

    </div>
  );
}
