"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, Medicine, Category } from "@/lib/api";

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedCat, setSelectedCat] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api.getMedicines(query || undefined, selectedCat)
        .then(setMedicines)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedCat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-xl">←</button>
          <h1 className="text-xl font-bold text-white">Search Medicines</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type medicine name..."
            className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            autoFocus
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <button
            onClick={() => setSelectedCat(undefined)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              !selectedCat ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                selectedCat === cat.id ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2 animate-pulse">💊</div>
            Searching...
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>No medicines found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medicines.map((med) => (
              <Link
                key={med.id}
                href={`/medicine/${med.id}`}
                className="block bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-blue-600/50 hover:bg-slate-800/50 transition-all animate-fade-in"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">💊 {med.name}</h3>
                    {med.genericName && <p className="text-sm text-blue-400">{med.genericName}</p>}
                    <p className="text-sm text-slate-400 mt-1">{med.purpose}</p>
                    <div className="flex gap-2 mt-2">
                      {med.categoryName && (
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{med.categoryName}</span>
                      )}
                      {med.form && (
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{med.form}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {med.priceRange && <p className="text-sm text-green-400">{med.priceRange}</p>}
                    <p className="text-slate-600 mt-2">→</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-slate-500 pt-4">{medicines.length} medicines found</p>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
