"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, Medicine, Category } from "@/lib/api";
import { VoiceInput } from "@/components/ShareVoice";
import { MedicineComparison } from "@/components/MedicineTools";
import { getMedicineIcon } from "@/lib/medicine-icons";
import PillVisual from "@/components/PillVisual";
import { SkeletonMedicineCard } from "@/components/Skeletons";

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedCat, setSelectedCat] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "category">("name");
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
    const recent = localStorage.getItem("pillwise-recent");
    if (recent) setRecentlyViewed(JSON.parse(recent));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api.getMedicines(query || undefined, selectedCat)
        .then((data) => {
          if (sortBy === "name") {
            data.sort((a, b) => a.name.localeCompare(b.name));
          } else if (sortBy === "category") {
            data.sort((a, b) => (a.categoryName || "").localeCompare(b.categoryName || ""));
          }
          setMedicines(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedCat, sortBy]);

  // Track recently viewed
  const trackView = (med: Medicine) => {
    const recent = JSON.parse(localStorage.getItem("pillwise-recent") || "[]");
    const updated = [med, ...recent.filter((r: any) => r.id !== med.id)].slice(0, 5);
    localStorage.setItem("pillwise-recent", JSON.stringify(updated));
    setRecentlyViewed(updated);
    router.push(`/medicine/${med.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="min-h-screen bg-gradient-to-b from-blue-950/30 via-transparent to-slate-950">
        {/* Header */}
        <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all">
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Search Medicines</h1>
              <p className="text-xs text-slate-500">Find any medicine in our database</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/scan"
                aria-label="Scan medicine barcode"
                className="glass-card p-2.5 rounded-xl text-sm hover:bg-slate-800/60 transition-all"
              >
                📷
              </Link>
              <Link href="/checker" className="btn-primary px-4 py-2 rounded-xl text-sm text-white font-medium flex items-center gap-2">
                ⚡ Check
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Search Input with Voice */}
          <div className="flex gap-3 animate-fade-in-up">
            <div className="glass-card p-2 flex items-center gap-3 focus-within:border-blue-500/50 transition-all flex-1">
              <span className="pl-4 text-slate-500 text-xl">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type medicine name... (try 'panadl' — fuzzy search!)"
                aria-label="Search medicines by name"
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none py-3 text-lg"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery("")} className="pr-2 text-slate-500 hover:text-white transition-colors">
                  ✕
                </button>
              )}
            </div>
            <VoiceInput onResult={(text) => setQuery(text)} />
          </div>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && !query && (
            <div className="animate-fade-in-up delay-50">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recently Viewed</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {recentlyViewed.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => router.push(`/medicine/${med.id}`)}
                    className="glass-card px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white whitespace-nowrap flex items-center gap-2 transition-all"
                  >
                    <span>💊</span> {med.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort + Category Filter */}
          <div className="space-y-3 animate-fade-in-up delay-100">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("name")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                    sortBy === "name" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  A-Z
                </button>
                <button
                  onClick={() => setSortBy("category")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                    sortBy === "category" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  By Category
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                onClick={() => setSelectedCat(undefined)}
                className={`px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  !selectedCat
                    ? "bg-gradient-medical text-white shadow-lg shadow-blue-500/20"
                    : "glass-card text-slate-400 hover:bg-slate-800/60"
                }`}
              >
                <span>📋</span> All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCat === cat.id
                      ? "bg-gradient-medical text-white shadow-lg shadow-blue-500/20"
                      : "glass-card text-slate-400 hover:bg-slate-800/60"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between animate-fade-in-up delay-200">
            <p className="text-sm text-slate-500">
              Showing <span className="text-blue-400 font-semibold">{medicines.length}</span> results
            </p>
            {loading && <p className="text-sm text-slate-500 animate-pulse">Searching...</p>}
          </div>

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              <SkeletonMedicineCard />
              <SkeletonMedicineCard />
              <SkeletonMedicineCard />
            </div>
          ) : medicines.length === 0 ? (
            <div className="glass-card p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4 animate-float">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No medicines found</h3>
              <p className="text-slate-400 mb-6">Try a different search term or browse categories</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Panadol", "Brufen", "Augmentin"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="glass-card px-4 py-2 rounded-full text-sm text-slate-300 hover:bg-slate-800/60 transition-all"
                  >
                    Try &quot;{s}&quot;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {medicines.map((med, index) => {
                const medIcon = getMedicineIcon(med.name);
                return (
                  <button
                    key={med.id}
                    onClick={() => trackView(med)}
                    className="block w-full text-left glass-card glass-card-hover p-5 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${medIcon.gradient} rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10`}>
                        <PillVisual name={med.name} category={med.categoryName} size={40} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white truncate">{med.name}</h3>
                          {med.genericName && (
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 flex-shrink-0">
                              {med.genericName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-1">{med.purpose}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {med.categoryName && (
                            <span className="text-xs bg-slate-800/80 text-slate-300 px-3 py-1 rounded-full border border-slate-700/50">
                              {med.categoryName}
                            </span>
                          )}
                          {med.form && (
                            <span className="text-xs bg-slate-800/80 text-slate-300 px-3 py-1 rounded-full border border-slate-700/50">
                              {med.form}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {med.priceRange && (
                        <span className="text-sm font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                          {med.priceRange}
                        </span>
                      )}
                      <div className="w-8 h-8 bg-slate-800/60 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          )}

          {/* Compare Medicines */}
          {!loading && medicines.length >= 2 && (
            <div className="animate-fade-in-up delay-300">
              <MedicineComparison medicines={medicines} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-slow" />
          <p className="text-slate-400">Loading search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
