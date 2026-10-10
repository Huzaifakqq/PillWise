"use client";
import { useState, useEffect } from "react";
import { useToast } from "./Toast";

interface JournalEntry {
  id: number;
  date: string;
  mood: string;
  symptoms: string[];
  notes: string;
  medicinesTaken: string[];
}

const MOODS = [
  { value: "great", label: "Great", emoji: "😊", color: "bg-green-500/20 border-green-500/40" },
  { value: "good", label: "Good", emoji: "🙂", color: "bg-blue-500/20 border-blue-500/40" },
  { value: "okay", label: "Okay", emoji: "😐", color: "bg-yellow-500/20 border-yellow-500/40" },
  { value: "poor", label: "Poor", emoji: "😟", color: "bg-orange-500/20 border-orange-500/40" },
  { value: "bad", label: "Bad", emoji: "😢", color: "bg-red-500/20 border-red-500/40" },
];

const COMMON_SYMPTOMS = [
  "Headache", "Nausea", "Dizziness", "Fatigue", "Stomach pain",
  "Rash", "Fever", "Cough", "Body ache", "Insomnia", "None",
];

export default function HealthJournal({ medicines = [] }: { medicines?: string[] }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: "good",
    symptoms: [] as string[],
    customSymptom: "",
    notes: "",
    medicinesTaken: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("pillwise-journal");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const save = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem("pillwise-journal", JSON.stringify(updated));
  };

  const addEntry = () => {
    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      mood: newEntry.mood,
      symptoms: newEntry.customSymptom
        ? [...newEntry.symptoms, newEntry.customSymptom]
        : newEntry.symptoms,
      notes: newEntry.notes,
      medicinesTaken: newEntry.medicinesTaken,
    };
    save([entry, ...entries]);
    setNewEntry({ mood: "good", symptoms: [], customSymptom: "", notes: "", medicinesTaken: [] });
    setShowAdd(false);
    toast("Journal entry added!", "success", "📝");
  };

  const toggleSymptom = (symptom: string) => {
    setNewEntry((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const toggleMedicine = (med: string) => {
    setNewEntry((prev) => ({
      ...prev,
      medicinesTaken: prev.medicinesTaken.includes(med)
        ? prev.medicinesTaken.filter((m) => m !== med)
        : [...prev.medicinesTaken, med],
    }));
  };

  const getMood = (value: string) => MOODS.find((m) => m.value === value) || MOODS[1];

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setShow(!show)}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-2xl">
            📓
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white">Health Journal</h3>
            <p className="text-sm text-slate-400">{entries.length} entr{entries.length !== 1 ? "ies" : "y"}</p>
          </div>
        </div>
        <span className={`text-slate-500 transition-transform ${show ? "rotate-180" : ""}`}>▼</span>
      </button>

      {show && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50 pt-4">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="btn-primary w-full py-3 text-white font-medium rounded-xl text-sm"
          >
            {showAdd ? "Cancel" : "+ New Entry"}
          </button>

          {showAdd && (
            <div className="space-y-4 animate-fade-in-up glass-card p-4">
              {/* Mood */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">How are you feeling?</label>
                <div className="flex gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                      className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                        newEntry.mood === mood.value
                          ? mood.color
                          : "border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        newEntry.symptoms.includes(symptom)
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                          : "border-slate-700/50 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newEntry.customSymptom}
                  onChange={(e) => setNewEntry({ ...newEntry, customSymptom: e.target.value })}
                  placeholder="Or type a custom symptom..."
                  className="input-field w-full px-4 py-2.5 rounded-xl text-white text-sm mt-2"
                />
              </div>

              {/* Medicines Taken */}
              {medicines.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Medicines Taken Today</label>
                  <div className="flex flex-wrap gap-2">
                    {medicines.map((med) => (
                      <button
                        key={med}
                        onClick={() => toggleMedicine(med)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          newEntry.medicinesTaken.includes(med)
                            ? "bg-green-500/20 text-green-400 border-green-500/40"
                            : "border-slate-700/50 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        💊 {med}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Notes</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="input-field w-full px-4 py-3 rounded-xl text-white text-sm resize-none"
                />
              </div>

              <button onClick={addEntry} className="btn-primary w-full py-3 text-white font-medium rounded-xl">
                Save Entry
              </button>
            </div>
          )}

          {/* Entries */}
          {entries.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <div className="text-4xl mb-2">📓</div>
              <p className="text-sm">No entries yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.map((entry) => {
                const mood = getMood(entry.mood);
                return (
                  <div key={entry.id} className="glass-card p-4 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{mood.emoji}</span>
                        <span className="text-sm font-medium text-slate-300">{mood.label}</span>
                      </div>
                      <span className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>

                    {entry.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {entry.symptoms.map((s, i) => (
                          <span key={i} className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {entry.medicinesTaken.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {entry.medicinesTaken.map((m, i) => (
                          <span key={i} className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                            💊 {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {entry.notes && (
                      <p className="text-xs text-slate-400 mt-2 italic">"{entry.notes}"</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
