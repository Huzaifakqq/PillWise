"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { api, getAuth } from "@/lib/api";

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

  useEffect(() => {
    api.getMedicine(Number(id))
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    const auth = getAuth();
    if (!auth) return router.push("/");
    try {
      await api.addUserMedicine({ userId: auth.id, medicineId: Number(id) });
      setAdded(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-400">Medicine not found</div>;

  const { medicine, interactions } = data;
  const dangerCount = interactions.filter((i) => i.severity === "Dangerous").length;
  const mildCount = interactions.filter((i) => i.severity === "Mild").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-xl">←</button>
          <h1 className="text-xl font-bold text-white">Medicine Details</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Medicine Info Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white">💊 {medicine.name}</h2>
              {medicine.genericName && <p className="text-blue-400 text-lg">{medicine.genericName}</p>}
            </div>
            {medicine.priceRange && (
              <div className="text-right">
                <p className="text-green-400 font-semibold">{medicine.priceRange}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            {medicine.categoryName && <span className="text-xs bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full">{medicine.categoryName}</span>}
            {medicine.form && <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">{medicine.form}</span>}
            {medicine.manufacturer && <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">{medicine.manufacturer}</span>}
          </div>

          <div className="space-y-4">
            {medicine.purpose && (
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-1">Purpose</h4>
                <p className="text-white">{medicine.purpose}</p>
              </div>
            )}
            {medicine.dosage && (
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-1">Dosage</h4>
                <p className="text-white">{medicine.dosage}</p>
              </div>
            )}
            {medicine.sideEffects && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-1">⚠️ Side Effects</h4>
                <p className="text-slate-300">{medicine.sideEffects}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={added}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white font-semibold rounded-xl transition-all"
          >
            {added ? "✓ Added to My Medicines" : "+ Add to My Medicines"}
          </button>
        </div>

        {/* Interactions */}
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-4">
            Interactions ({interactions.length})
            {dangerCount > 0 && <span className="ml-2 text-red-400 text-sm">({dangerCount} dangerous)</span>}
            {mildCount > 0 && <span className="ml-2 text-yellow-400 text-sm">({mildCount} mild)</span>}
          </h3>

          {interactions.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
              <div className="text-3xl mb-2">✅</div>
              No known interactions recorded for this medicine
            </div>
          ) : (
            <div className="space-y-3">
              {interactions.map((interaction, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 ${
                    interaction.severity === "Dangerous"
                      ? "severity-dangerous"
                      : interaction.severity === "Mild"
                      ? "severity-mild"
                      : "severity-safe"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">With: {interaction.otherMedicine}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        interaction.severity === "Dangerous"
                          ? "bg-red-500 text-white"
                          : interaction.severity === "Mild"
                          ? "bg-yellow-500 text-black"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {interaction.severity}
                    </span>
                  </div>
                  {interaction.description && <p className="text-slate-200 text-sm">{interaction.description}</p>}
                  {interaction.advice && (
                    <p className="text-slate-300 text-sm mt-2 italic">💡 {interaction.advice}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function MedicineDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
      <MedicineContent />
    </Suspense>
  );
}
