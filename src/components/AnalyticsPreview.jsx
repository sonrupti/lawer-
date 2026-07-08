import { Landmark, Clock, CheckCircle, BarChart3 } from "lucide-react";

export default function AnalyticsPreview() {
  const bars = [
    { label: "Property Disputes", count: 540, percentage: "85%", color: "bg-accent" },
    { label: "Criminal Appeals", count: 310, percentage: "60%", color: "bg-primary" },
    { label: "Civil Appeals", count: 221, percentage: "45%", color: "bg-primary/70" },
    { label: "Service Matters", count: 212, percentage: "42%", color: "bg-success" },
    { label: "Constitutional Writs", count: 61, percentage: "15%", color: "bg-danger" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 bg-surface/10 border-t border-b border-border/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Descriptions and Highlights */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1 text-xs font-semibold text-primary uppercase">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Court Intelligence Preview</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Real-time court records database tracking
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Our platform aggregates public filings directly from the Odisha High Court. By indexing case types, filings, and outcomes, we build an objective performance footprint for active legal practitioners.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-surface-2 p-2 text-primary">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Odisha High Court</h4>
                <p className="text-xs text-text-muted">Direct feed integration enabled.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-surface-2 p-2 text-accent">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">7.2 Month Resolution</h4>
                <p className="text-xs text-text-muted">Average lifespan of property cases.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Valorant-style Stats Bar Chart Widget */}
        <div className="glass-card p-6 border border-border shadow-2xl relative overflow-hidden bg-surface/30">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Database breakdown</span>
              <h3 className="text-lg font-bold text-text">Overall Court Activity</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tight text-primary">1,247</span>
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Cases</p>
            </div>
          </div>

          {/* Stats Bar List */}
          <div className="space-y-4">
            {bars.map((bar, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-text-muted">{bar.label}</span>
                  <span className="text-text">{bar.count} cases</span>
                </div>
                
                {/* Custom bar track */}
                <div className="h-3 w-full rounded-full bg-border/40 overflow-hidden">
                  {/* Glowing progress bar */}
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-1000 ease-out`}
                    style={{ width: bar.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Glowing border accents */}
          <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-l from-primary to-transparent" />
          <div className="absolute bottom-0 left-0 w-16 h-[1px] bg-gradient-to-r from-accent to-transparent" />

        </div>

      </div>
    </div>
  );
}
