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
    try {
      await api.removeUserMedicine(id);
      setMedicines(medicines.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-xl">←</button>
            <h1 className="text-xl font-bold text-white">My Medicines</h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            + Add
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-4">Add Medicine</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Select Medicine</label>
                  <select
                    value={selectedMed}
                    onChange={(e) => setSelectedMed(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Choose a medicine...</option>
                    {allMeds.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Dosage (optional)</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 500mg"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Timing (optional)</label>
                  <input
                    type="text"
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    placeholder="e.g., Morning, Night"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition">
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!selectedMed}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-xl transition"
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
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💊</div>
            <p className="text-slate-400 text-lg mb-2">No medicines added yet</p>
            <p className="text-slate-500 text-sm mb-4">Add your medicines to check interactions</p>
            <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              + Add Your First Medicine
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {medicines.map((med) => (
                <div key={med.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💊</span>
                    <div>
                      <h3 className="font-semibold text-white">{med.medicineName}</h3>
                      <p className="text-sm text-slate-400">
                        {med.dosage && `${med.dosage} · `}
                        {med.timing}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(med.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Check Interactions Button */}
            <Link
              href="/checker"
              className="block w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl text-center transition-all text-lg"
            >
              ⚡ Check All Interactions
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
