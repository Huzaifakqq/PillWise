"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, getAuth, UserMedicine, Medicine } from "@/lib/api";

export default function MyMedicinesPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<UserMedicine[]>([]);
  const [allMeds, setAllMeds] = useState<Medicine[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMed, setSelectedMed] = useState<number>(0);
  const [dosage, setDosage] = useState("");
  const [timing, setTiming] = useState("");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  const loadMedicines = () => {
    const auth = getAuth();
    if (!auth) return router.push("/");
    api.getUserMedicines(auth.id).then(setMedicines).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedicines();
    api.getMedicines().then(setAllMeds).catch(console.error);
  }, []);

  const handleAdd = async () => {
    const auth = getAuth();
    if (!auth || !selectedMed) return;
    try {
      await api.addUserMedicine({ userId: auth.id, medicineId: selectedMed, dosage, timing });
      setShowAdd(false);
      setSelectedMed(0);
      setDosage("");
      setTiming("");
      loadMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id: number) => {
    setRemoving(id);
    try {
      await api.removeUserMedicine(id);
      setMedicines(medicines.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="min-h-screen bg-gradient-to-b from-green-950/20 via-transparent to-slate-950">
        {/* Header */}
        <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all">
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">📋 My Medicines</h1>
              <p className="text-xs text-slate-500">{medicines.length} medicine{medicines.length !== 1 ? "s" : ""} in your list</p>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-primary px-5 py-2.5 text-white font-medium rounded-xl text-sm flex items-center gap-2">
              <span className="text-lg leading-none">+</span> Add
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Add Modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-card p-6 w-full max-w-md animate-fade-in-up border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>💊</span> Add Medicine
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Select from our database</p>
                  </div>
                  <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    ✕
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <span className="text-blue-400">📋</span> Select Medicine
                    </label>
                    <select
                      value={selectedMed}
                      onChange={(e) => setSelectedMed(Number(e.target.value))}
                      className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                    >
                      <option value={0}>Choose a medicine...</option>
                      {allMeds.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="text-blue-400">💊</span> Dosage
                      </label>
                      <input
                        type="text"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="500mg"
                        className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="text-blue-400">⏰</span> Timing
                      </label>
                      <input
                        type="text"
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                        placeholder="Morning, Night"
                        className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowAdd(false)} className="flex-1 py-3 glass-card text-slate-300 rounded-xl hover:bg-slate-800/60 transition font-medium">
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      disabled={!selectedMed}
                      className="btn-primary flex-1 py-3 text-white rounded-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Medicine
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medicine List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-800 rounded-xl shimmer" />
                    <div className="flex-1 space-y-3">
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
              <h3 className="text-xl font-bold text-white mb-2">No medicines added yet</h3>
              <p className="text-slate-400 mb-6">Add your medicines to check interactions</p>
              <button onClick={() => setShowAdd(true)} className="btn-primary px-8 py-3 text-white font-semibold rounded-xl">
                + Add Your First Medicine
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {medicines.map((med, index) => (
                  <div
                    key={med.id}
                    className="glass-card glass-card-hover p-5 flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-14 h-14 bg-gradient-medical rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg truncate">{med.medicineName}</h3>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {med.dosage && (
                          <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                            💊 {med.dosage}
                          </span>
                        )}
                        {med.timing && (
                          <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                            ⏰ {med.timing}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(med.id)}
                      disabled={removing === med.id}
                      className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50 flex-shrink-0"
                      title="Remove"
                    >
                      {removing === med.id ? (
                        <span className="animate-spin-slow inline-block w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full" />
                      ) : (
                        "✕"
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Check Interactions Button */}
              <Link
                href="/checker"
                className="btn-danger block w-full py-4 text-white font-bold rounded-xl text-center text-lg shadow-xl"
              >
                ⚡ Check All Interactions ({medicines.length} medicines)
              </Link>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
