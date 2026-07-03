"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Globe, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", native: "অসমীয়া", flag: "🇮🇳" },
  { code: "mai", name: "Maithili", native: "मैथिली", flag: "🇮🇳" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्", flag: "🇮🇳" },
  { code: "kok", name: "Konkani", native: "कोंकणी", flag: "🇮🇳" },
  { code: "doi", name: "Dogri", native: "डोगरी", flag: "🇮🇳" },
  { code: "ks", name: "Kashmiri", native: "कश्मीरी", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", native: "नेपाली", flag: "🇮🇳" },
  { code: "sat", name: "Santali", native: "संथाली", flag: "🇮🇳" },
  { code: "sd", name: "Sindhi", native: "सिंधी", flag: "🇮🇳" },
  { code: "brx", name: "Bodo", native: "बोडो", flag: "🇮🇳" },
  { code: "mni", name: "Meitei", native: "মেইতেইলোন / Meitei", flag: "🇮🇳" },
];

export default function SelectLanguagePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredLanguages = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.native.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (lang) => {
    setSelected(lang);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selected) {
      setError("Please select a language to continue.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/update-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selected.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save language. Please try again.");
        return;
      }

      // Redirect to the home page
      router.push("/");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="glass-card border border-border p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Globe className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">
            Choose Your Preferred Language
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Select the language you&apos;d like to use for NyayaIntel. You can change this later in Settings.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface/30 pl-10 pr-4 py-2.5 text-sm text-text placeholder-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
          />
        </div>

        {/* Selected Language Banner */}
        {selected && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm text-primary font-medium">
              Selected:{" "}
              <span className="font-bold">
                {selected.flag} {selected.native} ({selected.name})
              </span>
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1 mb-6">
          {filteredLanguages.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-sm text-text-muted">
              No languages found for &quot;{search}&quot;
            </div>
          ) : (
            filteredLanguages.map((lang) => {
              const isSelected = selected?.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition-all duration-200 cursor-pointer group
                    ${isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border bg-surface/20 hover:border-primary/40 hover:bg-surface-2"
                    }
                  `}
                >
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-text"}`}>
                      {lang.native}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">{lang.name}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-xl border border-border bg-surface/20 hover:bg-surface-2 text-text-muted hover:text-text font-semibold py-3 text-sm transition-all duration-200 cursor-pointer"
          >
            Skip for now
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selected}
            className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 text-sm tracking-wide transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
