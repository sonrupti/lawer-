import Link from "next/link";
import { Home, Shield, Award, Users, ChevronRight } from "lucide-react";

export default function PracticeAreas() {
  const specialties = [
    {
      title: "Property Specialist",
      tagline: "Land title suits, acquisitions, partitions",
      icon: Home,
      color: "text-accent border-accent/20 hover:border-accent/40",
      query: "Property",
      badge: "🔥 Hot",
      stats: "540 Cases Tracked"
    },
    {
      title: "Criminal Defense",
      tagline: "Bail petitions, appellate defense, trials",
      icon: Shield,
      color: "text-primary border-primary/20 hover:border-primary/40",
      query: "Criminal",
      badge: "⚖️ Active",
      stats: "310 Cases Tracked"
    },
    {
      title: "Constitutional Law",
      tagline: "Writ jurisdiction, statutory challenges",
      icon: Award,
      color: "text-success border-success/20 hover:border-success/40",
      query: "Constitutional",
      badge: "🏆 Premium",
      stats: "185 Cases Tracked"
    },
    {
      title: "Service Matters",
      tagline: "Employment disputes, pensions, tenure",
      icon: Users,
      color: "text-primary border-primary/20 hover:border-primary/40",
      query: "Service",
      badge: "📈 Rising",
      stats: "212 Cases Tracked"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
      
      {/* Section Title */}
      <div className="mx-auto max-w-2xl text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Trending Specializations
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Browse Odisha High Court advocates categorized by verified practice area volume.
        </p>
      </div>

      {/* Specialty Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {specialties.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              href={`/lawyers?practiceArea=${item.query}`}
              className="glass-card glass-card-hover p-6 flex flex-col justify-between group cursor-pointer border border-border"
            >
              <div>
                
                {/* Header Row with Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`rounded-lg bg-surface-2 p-2.5 ${item.color.split(" ")[0]}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-text-muted">
                    {item.badge}
                  </span>
                </div>

                {/* Card Title & Tagline */}
                <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-text-muted leading-relaxed">
                  {item.tagline}
                </p>

              </div>

              {/* Card Footer with Quick Stats & Arrow */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50 text-xs text-text-muted">
                <span>{item.stats}</span>
                <div className="flex items-center gap-0.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Explore</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>

            </Link>
          );
        })}
      </div>

    </div>
  );
}
