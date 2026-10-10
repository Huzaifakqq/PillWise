"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { api, getAuth } from "@/lib/api";
import {
  MedicineAlternatives,
  MealTimingGuide,
  PregnancySafety,
  KidneyLiverWarning,
} from "@/components/MedicineSafety";
import { ShareButton } from "@/components/ShareVoice";
import { getMedicineIcon } from "@/lib/medicine-icons";
import { useToast } from "@/components/Toast";

interface MedicineDetail {
  medicine: {
    id: number;
    name: string;
    genericName?: string;
    categoryName?: string;
    form?: string;
    manufacturer?: string;
    purpose?: string;
    sideEffects?: string;
    dosage?: string;
    priceRange?: string;
  };
  interactions: { severity: string; description?: string; advice?: string; otherMedicine: string }[];
}

function MedicineContent() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState<MedicineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.getMedicine(Number(id))
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    const auth = getAuth();
    if (!auth) return router.push("/login");
    try {
      await api.addUserMedicine({ userId: auth.id, medicineId: Number(id) });
      setAdded(true);
      toast("Added to My Medicines!", "success", "💊");
    } catch (err) {
      toast("Failed to add medicine", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-slow" />
        <p className="text-slate-400">Loading medicine details...</p>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="text-6xl">🔍</div>
        <p className="text-slate-400 text-lg">Medicine not found</p>
        <button onClick={() => router.back()} className="btn-primary px-6 py-3 text-white rounded-xl font-medium">
          ← Go Back
        </button>
      </div>
    );

  const { medicine, interactions } = data;
  const dangerCount = interactions.filter((i) => i.severity === "Dangerous").length;
  const mildCount = interactions.filter((i) => i.severity === "Mild").length;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Dangerous":
        return { bg: "severity-dangerous", badge: "bg-red-500/20 text-red-400 border-red-500/30", emoji: "🔴" };
      case "Mild":
        return { bg: "severity-mild", badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", emoji: "🟡" };
      default:
        return { bg: "severity-safe", badge: "bg-green-500/20 text-green-400 border-green-500/30", emoji: "🟢" };
    }
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
              <h1 className="text-xl font-bold text-white">Medicine Details</h1>
              <p className="text-xs text-slate-500">Complete information and interactions</p>
            </div>
            <ShareButton
              title={`PillWise: ${medicine?.name || "Medicine"}`}
              text={`Check ${medicine?.name} for interactions on PillWise!`}
            />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Medicine Info Card */}
          <div className="glass-card p-6 md:p-8 animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-medical rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-500/20">
                  <span className="text-4xl">💊</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">{medicine.name}</h2>
                    {medicine.priceRange && (
                      <span className="text-sm font-semibold text-green-400 bg-green-500/10 px-4 py-1.5 rounded-lg border border-green-500/20">
                        {medicine.priceRange}
                      </span>
                    )}
                  </div>
                  {medicine.genericName && (
                    <p className="text-blue-400 text-lg mb-3">Generic: {medicine.genericName}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {medicine.categoryName && (
                      <span className="text-xs bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20">
                        {medicine.categoryName}
                      </span>
                    )}
                    {medicine.form && (
                      <span className="text-xs bg-slate-800/80 text-slate-300 px-4 py-1.5 rounded-full border border-slate-700/50">
                        {medicine.form}
                      </span>
                    )}
                    {medicine.manufacturer && (
                      <span className="text-xs bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full border border-purple-500/20">
                        🏭 {medicine.manufacturer}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {medicine.purpose && (
                  <InfoBox icon="🎯" label="Purpose" value={medicine.purpose} />
                )}
                {medicine.dosage && (
                  <InfoBox icon="💊" label="Dosage" value={medicine.dosage} />
                )}
              </div>

              {/* Side Effects */}
              {medicine.sideEffects && (
                <div className="severity-mild rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-1">Side Effects</h4>
                      <p className="text-slate-300 text-sm">{medicine.sideEffects}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Button */}
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-3 ${
                  added
                    ? "bg-gradient-success text-white cursor-default"
                    : "btn-primary text-white"
                }`}
              >
                {added ? (
                  <>
                    <span>✓</span> Added to My Medicines
                  </>
                ) : (
                  <>
                    <span>+</span> Add to My Medicines
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Safety Features */}
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up delay-150">
            <MealTimingGuide medicineName={medicine.name} />
            <PregnancySafety medicineName={medicine.name} />
          </div>

          <div className="animate-fade-in-up delay-150">
            <KidneyLiverWarning medicineName={medicine.name} />
          </div>

          <div className="animate-fade-in-up delay-150">
            <MedicineAlternatives medicineName={medicine.name} />
          </div>

          {/* Interactions Section */}
          <div className="animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                  <span className="text-sm">⚡</span>
                </span>
                Known Interactions ({interactions.length})
              </h3>
              <div className="flex gap-2">
                {dangerCount > 0 && (
                  <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
                    {dangerCount} dangerous
                  </span>
                )}
                {mildCount > 0 && (
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/20">
                    {mildCount} mild
                  </span>
                )}
              </div>
            </div>

            {interactions.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-green-400 font-semibold text-lg mb-1">No Known Interactions</p>
                <p className="text-slate-400 text-sm">This medicine is generally safe to combine with others</p>
              </div>
            ) : (
              <div className="space-y-4">
                {interactions.map((interaction, idx) => {
                  const styles = getSeverityStyles(interaction.severity);
                  return (
                    <div
                      key={idx}
                      className={`glass-card rounded-xl p-5 ${styles.bg}`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white flex items-center gap-3 text-lg">
                          <span>{styles.emoji}</span>
                          With: {interaction.otherMedicine}
                        </span>
                        <span className={`text-xs px-4 py-1.5 rounded-full font-bold border ${styles.badge}`}>
                          {interaction.severity}
                        </span>
                      </div>
                      {interaction.description && (
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-slate-500">📋</span>
                          <p className="text-slate-300 text-sm leading-relaxed">{interaction.description}</p>
                        </div>
                      )}
                      {interaction.advice && (
                        <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                          <span className="text-blue-400">💡</span>
                          <p className="text-blue-300 text-sm italic leading-relaxed">{interaction.advice}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="glass-card p-4 text-center bg-slate-900/40 animate-fade-in delay-300">
            <p className="text-xs text-slate-500">
              ⚠️ This is not medical advice. Always consult a healthcare professional.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white">{value}</p>
    </div>
  );
}

export default function MedicineDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-slow" />
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <MedicineContent />
    </Suspense>
  );
}
