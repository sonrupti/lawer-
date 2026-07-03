"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Landmark } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [city, setCity] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // We construct the search query URL parameters
    const params = new URLSearchParams();
    if (name.trim()) params.append("name", name.trim());
    if (practiceArea) params.append("practiceArea", practiceArea);
    if (city) params.append("city", city);

    // Redirect to the lawyers list page with the selected filters
    router.push(`/lawyers?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <form
        onSubmit={handleSearchSubmit}
        className="glass-card p-6 shadow-xl border border-border bg-surface/50 transition-all duration-300"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          
          {/* 1. Name Search */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Advocate Name
            </label>
            <div className="relative">
              <Search className="absolute top-3 left-3 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-bg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted/60 focus:border-primary focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          {/* 2. Practice Area / Case Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Practice Area
            </label>
            <div className="relative">
              <Briefcase className="absolute top-3 left-3 h-4 w-4 text-text-muted" />
              <select
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-bg pl-9 pr-3 py-2 text-sm text-text appearance-none focus:border-primary focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                <option value="">All Specializations</option>
                <option value="Property">Property Law</option>
                <option value="Criminal">Criminal Defense</option>
                <option value="Constitutional">Constitutional Law</option>
                <option value="GST">GST & Tax</option>
                <option value="Service">Service Matters</option>
                <option value="Civil">Civil Appeals</option>
                <option value="Corporate">Corporate Law</option>
              </select>
            </div>
          </div>

          {/* 3. Court Selection (Locked to Odisha High Court for Phase 1) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Court Jurisdiction
            </label>
            <div className="relative">
              <Landmark className="absolute top-3 left-3 h-4 w-4 text-text-muted" />
              <select
                disabled
                className="w-full rounded-lg border border-border/70 bg-bg/50 pl-9 pr-3 py-2 text-sm text-text-muted opacity-80 cursor-not-allowed"
              >
                <option>Odisha High Court</option>
              </select>
            </div>
          </div>

          {/* 4. City Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              City Location
            </label>
            <div className="relative">
              <MapPin className="absolute top-3 left-3 h-4 w-4 text-text-muted" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-border/70 bg-bg pl-9 pr-3 py-2 text-sm text-text appearance-none focus:border-primary focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                <option value="">All Cities</option>
                <option value="Cuttack">Cuttack</option>
                <option value="Bhubaneswar">Bhubaneswar</option>
              </select>
            </div>
          </div>

        </div>

        {/* Search Submit Action Button (Valorant lobby launch button style) */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-64 rounded-lg bg-primary py-3 px-6 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 cursor-pointer text-center relative overflow-hidden group hover:brightness-110 active:scale-95"
          >
            <span className="relative z-10">SEARCH DATABASE</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-accent/25 to-transparent transition-transform duration-300" />
          </button>
        </div>
      </form>
    </div>
  );
}