import { Scale, Zap, Sparkles, Search, ArrowRight } from "lucide-react";

export default function Hero() {
  const popularSearches = [
    "Constitutional Law in Delhi",
    "Property Disputes in Mumbai",
    "Bail Petitions in Odisha",
    "Corporate Structuring",
  ];

  return (
    <div className="relative overflow-hidden py-16 sm:py-24 transition-colors duration-300">
      {/* Decorative animated background mesh */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] h-[60%] w-[50%] rounded-full bg-secondary/20 blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8 relative z-10">
        
        {/* Top Badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/50 backdrop-blur-md px-5 py-2 text-xs font-semibold uppercase tracking-wider text-text transition-all duration-300 hover:border-primary/50 cursor-pointer">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>India's First Legal Intelligence Platform</span>
        </div>

        {/* Main Header */}
        <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight sm:text-7xl text-text leading-tight">
          Find India's Best Lawyers Through{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Real Court Performance.
          </span>
        </h1>

        {/* Sub-text */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
          Make data-driven legal decisions. We analyze millions of court judgments to rank advocates based on actual win rates, disposal times, and specialization.
        </p>

        {/* AI Powered Search Bar */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="glass-card flex items-center p-2 pl-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
            <Search className="h-5 w-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Ask anything... e.g. 'Who is the best criminal lawyer in High Court?'"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-text outline-none placeholder:text-text-muted"
            />
            <button className="flex items-center gap-2 rounded-lg bg-text text-bg hover:bg-text/90 px-5 py-3 text-sm font-bold transition-all">
              <Sparkles className="h-4 w-4" />
              Search AI
            </button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider mr-2">
            Trending:
          </span>
          {popularSearches.map((search, idx) => (
            <button
              key={idx}
              className="group flex items-center gap-1.5 rounded-full border border-border/50 bg-surface/50 px-4 py-1.5 text-xs font-medium text-text-muted hover:border-primary/50 hover:text-text transition-all duration-200"
            >
              {search}
              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
