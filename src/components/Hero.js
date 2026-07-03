import { Scale, Zap } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24 transition-colors duration-300">
      {/* Decorative background glow (Valorant-style neon effect in dark mode) */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
      <div className="absolute top-10 left-1/3 -z-10 h-[300px] w-[500px] rounded-full bg-accent/10 blur-[100px] dark:bg-accent/5" />

      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        
        {/* Gaming Arena Style Badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 dark:border-accent/30 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-text transition-all duration-300 shadow-[0_0_15px_rgba(79,140,255,0.1)] dark:shadow-[0_0_15px_rgba(245,197,66,0.1)]">
          <Zap className="h-3.5 w-3.5 text-accent animate-pulse" />
          <span>Odisha High Court Database — Phase 1 MVP</span>
        </div>

        {/* Main Header */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-text">
          NyayaIntel: The{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-pulse bg-clip-text text-transparent">
            Moneyball
          </span>{" "}
          for Litigants
        </h1>

        {/* Sub-text */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-muted">
          Analyze courtroom activity, verified case histories, and resolution profiles.
          Discover advocates based on quantitative data rather than simple directories.
        </p>

        {/* Quick Stats Panel (Valorant Lobby Vibe) */}
        <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-b border-border/50 py-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary dark:text-primary">1,247</p>
            <p className="text-xs text-text-muted uppercase tracking-wider">Cases Tracked</p>
          </div>
          <div className="border-l border-r border-border/50">
            <p className="text-2xl font-bold text-accent">7.2m</p>
            <p className="text-xs text-text-muted uppercase tracking-wider">Avg Disposal</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">92%</p>
            <p className="text-xs text-text-muted uppercase tracking-wider">Resolution rate</p>
          </div>
        </div>

      </div>
    </div>
  );
}
