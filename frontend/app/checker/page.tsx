"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getAuth, UserMedicine, Interaction } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import InteractionHeatmap from "@/components/InteractionHeatmap";
import { RadarScanner, Confetti, PulseShield } from "@/components/Visuals";
import { ShareCardButton } from "@/components/ShareCard";
import PillVisual from "@/components/PillVisual";
import RedAlertOverlay from "@/components/RedAlertOverlay";
import PrintableMedicineCard from "@/components/PrintableMedicineCard";
import SaferSubstitutes from "@/components/SaferSubstitutes";
import { saveLastCheck, loadLastCheck } from "@/lib/offline";
import { classifyBodySystem } from "@/lib/body-system";

export default function CheckerPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [medicines, setMedicines] = useState<UserMedicine[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [results, setResults] = useState<Interaction[]>([]);
  const [checking, setChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRedAlert, setShowRedAlert] = useState(false);
  // navigator.onLine is read once in a lazy state-initialiser (runs at mount,
  // not in an effect). The effect below only subscribes to real network events.
  const [offline, setOffline] = useState<boolean>(
    () => typeof navigator !== "undefined" && navigator.onLine === false
  );
  const [restoredFromCache, setRestoredFromCache] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) return router.push("/login");

    const syncOnline = () => setOffline(typeof navigator !== "undefined" && navigator.onLine === false);
    window.addEventListener("offline", syncOnline);
    window.addEventListener("online", syncOnline);

    api.getUserMedicines(auth.id)
      .then(setMedicines)
      .catch(() => {
        // Fail-safe: if the API is unreachable, restore the last successful check.
        const cached = loadLastCheck();
        if (cached) {
          setResults(cached.results);
          setSelected(cached.medicines.map((m) => m.id));
          setHasChecked(true);
          setRestoredFromCache(true);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      window.removeEventListener("offline", syncOnline);
      window.removeEventListener("online", syncOnline);
    };
  }, [router]);

  const bodySystems = useMemo(
    () =>
      Object.fromEntries(
        medicines.map((m) => [m.medicineName, classifyBodySystem(m.medicineName)])
      ),
    [medicines]
  );

  const toggleSelect = (id: number) => {
    setHasChecked(false);
    setRestoredFromCache(false);
    setResults([]);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheck = async () => {
    if (selected.length < 2) return;
    setChecking(true);
    setRestoredFromCache(false);
    try {
      const res = (await api.checkInteractions(selected)) as Interaction[];
      setResults(res);
      setHasChecked(true);

      saveLastCheck({
        medicines: medicines
          .filter((m) => selected.includes(m.id))
          .map((m) => ({ id: m.id, name: m.medicineName, dosage: m.dosage })),
        results: res,
        checkedAt: new Date().toISOString(),
      });

      if (res.some((r) => r.severity === "Dangerous" || r.severity === "Major")) {
        setShowRedAlert(true);
      }
    } catch (err) {
      console.error(err);
      // Fail-safe: fall back to the last successful check when the API is down.
      const cached = loadLastCheck();
      if (cached) {
        setResults(cached.results);
        setHasChecked(true);
        setRestoredFromCache(true);
      }
    } finally {
      setChecking(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Dangerous":
      case "Major":
        return { bg: "severity-dangerous", text: "text-red-400", badge: "bg-red-500/20 text-red-400 border-red-500/30", emoji: "🔴" };
      case "Mild":
        return { bg: "severity-mild", text: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", emoji: "🟡" };
      default:
        return { bg: "severity-safe", text: "text-green-400", badge: "bg-green-500/20 text-green-400 border-green-500/30", emoji: "🟢" };
    }
  };

  const dangerCount = results.filter((r) => r.severity === "Dangerous" || r.severity === "Major").length;
  const mildCount = results.filter((r) => r.severity === "Mild").length;
  const safeCount = results.filter((r) => r.severity === "Safe").length;

  const warnings = results
    .filter((r) => r.severity === "Dangerous" || r.severity === "Major")
    .map((r) => ({
      medicine: `${r.medicine1Name} + ${r.medicine2Name}`,
      severity: r.severity,
      advice: r.advice || r.description || "",
    }));

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      {showRedAlert && (
        <RedAlertOverlay results={results} onClose={() => setShowRedAlert(false)} />
      )}

      <div className="min-h-screen bg-gradient-to-b from-red-950/20 via-transparent to-slate-950">
        {/* Header */}
        <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all">
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                ⚡ {t("interactionChecker")}
              </h1>
              <p className="text-xs text-slate-500">{t("selectMedicines")}</p>
            </div>
            {offline && (
              <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-1 rounded-full">
                {t("offlineMode")}
              </span>
            )}
            <div className="glass-card px-4 py-2 rounded-xl">
              <span className="text-sm text-slate-400">Selected: </span>
              <span className="text-sm font-bold text-blue-400">{selected.length}</span>
            </div>
            <PrintableMedicineCard
              userName={getAuth()?.name || ""}
              medicines={medicines.filter((m) => selected.includes(m.id))}
              warnings={warnings}
            />
          </div>
        </header>

        <main id="main-content" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Offline / cached banners */}
          {restoredFromCache && (
            <div className="glass-card p-4 bg-amber-500/10 border-amber-500/40 flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">📶</span>
              <div>
                <p className="text-amber-400 font-semibold text-sm">{t("offlineNotice")}</p>
                <p className="text-slate-500 text-xs">{t("cachedResult")}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="glass-card p-5 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-500/20 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Select <span className="text-blue-400 font-semibold">2 or more medicines</span> from your list below, then tap the Check button to see if they&apos;re safe to take together.
              </p>
            </div>
          </div>

          {/* Medicine Selection */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                    <div className="w-12 h-12 bg-slate-800 rounded-xl shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-800 rounded shimmer w-1/3" />
                      <div className="h-4 bg-slate-800 rounded shimmer w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : medicines.length === 0 ? (
            <div className="glass-card p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4 animate-float">💊</div>
              <h3 className="text-xl font-bold text-white mb-2">No medicines in your list</h3>
              <p className="text-slate-400 mb-6">Add medicines first to check interactions</p>
              <button onClick={() => router.push("/my-medicines")} className="btn-primary px-8 py-3 text-white font-semibold rounded-xl">
                + Add Medicines First
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between animate-fade-in-up">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t("myMedicines")}</h3>
                  <button
                    onClick={() => {
                      if (selected.length === medicines.length) {
                        setSelected([]);
                      } else {
                        setSelected(medicines.map((m) => m.id));
                      }
                      setHasChecked(false);
                      setRestoredFromCache(false);
                      setResults([]);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {selected.length === medicines.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                {medicines.map((med, index) => (
                  <button
                    key={med.id}
                    onClick={() => toggleSelect(med.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 animate-fade-in-up ${
                      selected.includes(med.id)
                        ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10"
                        : "glass-card glass-card-hover"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        selected.includes(med.id)
                          ? "bg-gradient-medical border-blue-500 shadow-lg shadow-blue-500/30"
                          : "border-slate-600"
                      }`}
                    >
                      {selected.includes(med.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selected.includes(med.id) ? "bg-blue-500/10 border border-blue-500/20" : "bg-slate-800/60"
                    }`}>
                      <PillVisual name={med.medicineName} size={34} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{med.medicineName}</p>
                      <p className="text-sm text-slate-400 truncate">
                        {med.dosage || med.timing ? `${med.dosage || ""} ${med.timing || ""}`.trim() : "No dosage info"}
                      </p>
                    </div>
                    {selected.includes(med.id) && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-medium flex-shrink-0">
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Interaction Heatmap */}
              {medicines.length >= 2 && (
                <div className="animate-fade-in-up">
                  <InteractionHeatmap
                    data={{
                      medicines: medicines.map((m) => ({
                        id: m.id,
                        name: m.medicineName,
                        bodySystem: m.bodySystem || bodySystems[m.medicineName],
                      })),
                      interactions: results.map((r) => ({
                        med1Id: medicines.find((m) => m.medicineName === r.medicine1Name)?.id || 0,
                        med2Id: medicines.find((m) => m.medicineName === r.medicine2Name)?.id || 0,
                        severity: r.severity,
                      })),
                    }}
                  />
                </div>
              )}

              {/* Check Button */}
              <button
                onClick={handleCheck}
                disabled={selected.length < 2 || checking}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  selected.length >= 2
                    ? "btn-danger text-white animate-pulse-glow"
                    : "glass-card text-slate-500 cursor-not-allowed"
                }`}
              >
                {checking ? (
                  <>
                    <span className="animate-spin-slow inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    Checking Interactions...
                  </>
                ) : (
                  <>
                    ⚡ {t("checkNow")} ({selected.length})
                  </>
                )}
              </button>

              {/* Scanning Radar */}
              {checking && (
                <RadarScanner label={`Scanning ${selected.length} medicines against 45 known interactions...`} />
              )}

              {/* Results */}
              {hasChecked && (
                <div className="space-y-4 animate-fade-in-up">
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card p-4 text-center severity-safe animate-bounce-in" style={{ animationDelay: "0ms" }}>
                      <div className="text-3xl font-bold text-green-400">{safeCount}</div>
                      <div className="text-xs text-green-400/80 font-medium mt-1">✓ {t("safe")}</div>
                    </div>
                    <div className="glass-card p-4 text-center severity-mild animate-bounce-in" style={{ animationDelay: "120ms" }}>
                      <div className="text-3xl font-bold text-yellow-400">{mildCount}</div>
                      <div className="text-xs text-yellow-400/80 font-medium mt-1">⚠ {t("mild")}</div>
                    </div>
                    <div className="glass-card p-4 text-center severity-dangerous animate-bounce-in" style={{ animationDelay: "240ms" }}>
                      <div className="text-3xl font-bold text-red-400">{dangerCount}</div>
                      <div className="text-xs text-red-400/80 font-medium mt-1">✕ {t("dangerous")}</div>
                    </div>
                  </div>

                  {/* Overall Warning */}
                  {dangerCount > 0 ? (
                    <div className="relative overflow-hidden glass-card p-6 text-center border-2 border-red-500/50 animate-shake bg-gradient-to-b from-red-500/10 to-transparent">
                      <div className="flex justify-center mb-3">
                        <PulseShield danger />
                      </div>
                      <p className="text-red-400 font-bold text-2xl mb-1 text-glow">{t("dangerousFound")}</p>
                      <p className="text-slate-400 text-sm">{t("consultDoctor")}</p>
                      <button
                        onClick={() => setShowRedAlert(true)}
                        className="mt-4 px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors"
                      >
                        🚨 {t("redAlert")}
                      </button>
                    </div>
                  ) : mildCount === 0 ? (
                    <div className="relative overflow-hidden glass-card p-6 text-center border border-green-500/30 bg-gradient-to-b from-green-500/5 to-transparent glow-ring">
                      <Confetti />
                      <div className="flex justify-center mb-3 relative z-10">
                        <PulseShield />
                      </div>
                      <p className="text-green-400 font-bold text-xl mb-1 text-glow-green relative z-10">All Safe!</p>
                      <p className="text-slate-400 text-sm relative z-10">These medicines are safe to take together</p>
                    </div>
                  ) : null}

                  {/* Safer Substitutes for clashing pairs */}
                  {dangerCount > 0 && (
                    <SaferSubstitutes
                      clashing={results
                        .filter((r) => r.severity === "Dangerous" || r.severity === "Major")
                        .map((r) => ({
                          medicine1: { id: r.medicine1Id, name: r.medicine1Name },
                          medicine2: { id: r.medicine2Id, name: r.medicine2Name },
                        }))}
                    />
                  )}

                  {/* Individual Results */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Detailed Results</h3>
                    {results.map((result, idx) => {
                      const styles = getSeverityStyles(result.severity);
                      return (
                        <div key={idx} className={`glass-card rounded-xl p-5 ${styles.bg} animate-bounce-in`} style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-white flex items-center gap-3 text-lg">
                              <span>{styles.emoji}</span>
                              {result.medicine1Name}
                              <span className="text-slate-500 text-sm">+</span>
                              {result.medicine2Name}
                            </span>
                            <span className={`text-xs px-4 py-1.5 rounded-full font-bold border ${styles.badge} animate-pop`} style={{ animationDelay: `${idx * 100 + 200}ms` }}>
                              {result.severity}
                            </span>
                          </div>
                          {result.description && (
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-slate-500 mt-0.5">📋</span>
                              <p className="text-slate-300 text-sm leading-relaxed">{result.description}</p>
                            </div>
                          )}
                          {result.advice && (
                            <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                              <span className="text-blue-400 mt-0.5">💡</span>
                              <p className="text-blue-300 text-sm italic leading-relaxed">{result.advice}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Share */}
                  <div className="flex justify-center pt-2">
                    <ShareCardButton results={results} userName={getAuth()?.name} />
                  </div>

                  {/* Disclaimer */}
                  <div className="glass-card p-4 text-center bg-slate-900/40">
                    <p className="text-xs text-slate-500">{t("disclaimer")}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
