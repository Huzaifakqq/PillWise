"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getAuth, UserMedicine, Interaction } from "@/lib/api";

export default function CheckerPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<UserMedicine[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [results, setResults] = useState<Interaction[]>([]);
  const [checking, setChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) return router.push("/");
    api.getUserMedicines(auth.id)
      .then(setMedicines)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const toggleSelect = (id: number) => {
    setHasChecked(false);
    setResults([]);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheck = async () => {
    if (selected.length < 2) return;
    setChecking(true);
    try {
      const res = (await api.checkInteractions(selected)) as Interaction[];
      setResults(res);
      setHasChecked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Dangerous": return "text-red-400";
      case "Mild": return "text-yellow-400";
      default: return "text-green-400";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "Dangerous": return "severity-dangerous";
      case "Mild": return "severity-mild";
      default: return "severity-safe";
    }
  };

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case "Dangerous": return "🔴";
      case "Mild": return "🟡";
      default: return "🟢";
    }
  };

  const dangerCount = results.filter((r) => r.severity === "Dangerous").length;
  const mildCount = results.filter((r) => r.severity === "Mild").length;
  const safeCount = results.filter((r) => r.severity === "Safe").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-xl">←</button>
          <h1 className="text-xl font-bold text-white">Interaction Checker</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 animate-fade-in">
          <p className="text-blue-300 text-sm">
            💡 Select <strong>2 or more medicines</strong> from your list, then tap Check to see if they&apos;re safe to take together.
          </p>
        </div>

        {/* Medicine Selection */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading your medicines...</div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💊</div>
            <p className="text-slate-400 mb-4">No medicines in your list yet</p>
            <button onClick={() => router.push("/my-medicines")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              Add Medicines First
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {medicines.map((med) => (
                <button
                  key={med.id}
                  onClick={() => toggleSelect(med.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    selected.includes(med.id)
                      ? "bg-blue-900/40 border-blue-600 animate-fade-in"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selected.includes(med.id) ? "bg-blue-600 border-blue-600" : "border-slate-600"
                    }`}
                  >
                    {selected.includes(med.id) && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="text-2xl">💊</span>
                  <div>
                    <p className="font-semibold text-white">{med.medicineName}</p>
                    <p className="text-sm text-slate-400">{med.dosage || med.timing || "No dosage info"}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Check Button */}
            <button
              onClick={handleCheck}
              disabled={selected.length < 2 || checking}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selected.length >= 2
                  ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white animate-pulse-glow"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {checking ? "Checking..." : `Check ${selected.length} Medicines ⚡`}
            </button>

            {/* Results */}
            {hasChecked && (
              <div className="space-y-4 animate-fade-in">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-900/30 border border-green-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{safeCount}</div>
                    <div className="text-xs text-green-300">Safe</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{mildCount}</div>
                    <div className="text-xs text-yellow-300">Mild</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-red-400">{dangerCount}</div>
                    <div className="text-xs text-red-300">Dangerous</div>
                  </div>
                </div>

                {/* Overall Warning */}
                {dangerCount > 0 && (
                  <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 text-center animate-shake">
                    <div className="text-4xl mb-2">🚨</div>
                    <p className="text-red-400 font-bold text-xl">DANGEROUS INTERACTION FOUND!</p>
                    <p className="text-red-300 text-sm mt-1">Consult your doctor immediately</p>
                  </div>
                )}

                {/* Individual Results */}
                <div className="space-y-3">
                  {results.map((result, idx) => (
                    <div key={idx} className={`${getSeverityBg(result.severity)} rounded-xl p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white flex items-center gap-2">
                          {getSeverityEmoji(result.severity)}
                          {result.medicine1Name} + {result.medicine2Name}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${
                            result.severity === "Dangerous"
                              ? "bg-red-500 text-white"
                              : result.severity === "Mild"
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {result.severity}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-slate-200 text-sm">{result.description}</p>
                      )}
                      {result.advice && (
                        <p className="text-slate-300 text-sm mt-2 italic border-t border-white/10 pt-2">
                          💡 {result.advice}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
