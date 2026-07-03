"use client";

import { useState, useEffect } from "react";
import LawyerCard from "@/components/LawyerCard";
import { Search, SlidersHorizontal, Trash2, ShieldCheck } from "lucide-react";

export default function LawyersClientPage({ initialLawyers, searchParams }) {
  // 1. Initialize filter states based on the searchParams forwarded by the Next.js Server Component
  const [nameQuery, setNameQuery] = useState(searchParams?.name || "");
  const [selectedAreas, setSelectedAreas] = useState(
    searchParams?.practiceArea ? [searchParams.practiceArea] : []
  );
  const [selectedCities, setSelectedCities] = useState(
    searchParams?.city ? [searchParams.city] : []
  );
  const [experienceFilter, setExperienceFilter] = useState(""); // "", "5", "10", "20"

  // 2. Define filter values list
  const practiceAreasList = [
    "Property",
    "Criminal",
    "Constitutional",
    "GST",
    "Service",
    "Civil",
    "Corporate",
  ];

  const citiesList = ["Cuttack", "Bhubaneswar"];

  // 3. Clear all active filters helper
  const handleClearFilters = () => {
    setNameQuery("");
    setSelectedAreas([]);
    setSelectedCities([]);
    setExperienceFilter("");
  };

  // 4. Toggle practice area checkbox selection
  const handleAreaToggle = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // 5. Toggle city checkbox selection
  const handleCityToggle = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // 6. Filter lawyers list in real time
  const filteredLawyers = initialLawyers.filter((lawyer) => {
    // A. Filter by Advocate Name
    if (nameQuery && !lawyer.name.toLowerCase().includes(nameQuery.toLowerCase())) {
      return false;
    }

    // B. Filter by Practice Area
    if (selectedAreas.length > 0) {
      const matchesArea = selectedAreas.some((area) =>
        lawyer.practice_area.toLowerCase().includes(area.toLowerCase())
      );
      if (!matchesArea) return false;
    }

    // C. Filter by Location/City
    if (selectedCities.length > 0) {
      const matchesCity = selectedCities.some(
        (city) => lawyer.city.toLowerCase() === city.toLowerCase()
      );
      if (!matchesCity) return false;
    }

    // D. Filter by Experience threshold
    if (experienceFilter) {
      const years = parseInt(experienceFilter, 10);
      if (lawyer.experience < years) return false;
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="border-b border-border/50 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            Advocates Directory
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Odisha High Court jurisdiction listings with player statistical ratings.
          </p>
        </div>
        
        {/* Results Counter & Reset Action */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-text-muted">
            Showing {filteredLawyers.length} of {initialLawyers.length} Advocates
          </span>
          {(nameQuery || selectedAreas.length > 0 || selectedCities.length > 0 || experienceFilter) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs font-bold text-danger border border-danger/35 hover:bg-danger hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              CLEAR ALL
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ----------------- LEFT FILTER SIDEBAR (Steam Style) ----------------- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-5 border border-border bg-surface/20">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">Filters</h3>
            </div>

            {/* A. Practice / Case Area Checkboxes */}
            <div className="mb-6">
              <span className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Case Specialization
              </span>
              <div className="space-y-2">
                {practiceAreasList.map((area) => (
                  <label key={area} className="flex items-center gap-2.5 text-sm text-text cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedAreas.includes(area)}
                      onChange={() => handleAreaToggle(area)}
                      className="rounded border-border bg-bg text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{area} Law</span>
                  </label>
                ))}
              </div>
            </div>

            {/* B. Experience Threshold Radios */}
            <div className="mb-6 border-t border-border/40 pt-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Min Experience
              </span>
              <div className="space-y-2">
                {[
                  { value: "", label: "Any Experience" },
                  { value: "5", label: "5+ Years Practice" },
                  { value: "10", label: "10+ Years Practice" },
                  { value: "20", label: "20+ Years Practice" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2.5 text-sm text-text cursor-pointer select-none">
                    <input
                      type="radio"
                      name="experience"
                      checked={experienceFilter === option.value}
                      onChange={() => setExperienceFilter(option.value)}
                      className="border-border bg-bg text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* C. City Checkboxes */}
            <div className="border-t border-border/40 pt-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                City Jurisdiction
              </span>
              <div className="space-y-2">
                {citiesList.map((city) => (
                  <label key={city} className="flex items-center gap-2.5 text-sm text-text cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city)}
                      onChange={() => handleCityToggle(city)}
                      className="rounded border-border bg-bg text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{city}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ----------------- RIGHT ADVOCATES GRID ----------------- */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Inner Search Box */}
          <div className="relative">
            <Search className="absolute top-3.5 left-4 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search advocates by name..."
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-surface/30 pl-11 pr-4 py-3 text-sm text-text placeholder-text-muted/60 focus:border-primary focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Results Grid */}
          {filteredLawyers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer.id}
                  lawyer={lawyer}
                  searchQuery={nameQuery}
                  searchPracticeArea={selectedAreas[0]} // passes main active area filter
                />
              ))}
            </div>
          ) : (
            // No Results State
            <div className="glass-card p-12 text-center border border-border bg-surface/10">
              <ShieldCheck className="mx-auto h-12 w-12 text-text-muted/50 mb-4" />
              <h3 className="text-lg font-bold text-text mb-1">No Advocates Found</h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">
                {"We couldn't find any legal practitioners matching your active filters. Try adjusting checkboxes or clearing search queries."}
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary border border-primary/50 hover:bg-primary hover:text-white px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
