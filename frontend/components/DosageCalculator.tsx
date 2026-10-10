"use client";
import { useState } from "react";

interface DoseResult {
  medicine: string;
  dose: string;
  frequency: string;
  maxDaily: string;
  notes: string;
}

export default function DosageCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedMed, setSelectedMed] = useState("");
  const [result, setResult] = useState<DoseResult | null>(null);
  const [show, setShow] = useState(false);

  const medicines = [
    { name: "Panadol (Paracetamol)", adultDose: 500, unit: "mg", perKg: 10, maxPerKg: 60, frequency: "Every 4-6 hours", maxDailyAdult: "4000mg" },
    { name: "Brufen (Ibuprofen)", adultDose: 200, unit: "mg", perKg: 5, maxPerKg: 30, frequency: "Every 6-8 hours", maxDailyAdult: "1200mg" },
    { name: "Aspirin", adultDose: 75, unit: "mg", perKg: 0, maxPerKg: 0, frequency: "Once daily", maxDailyAdult: "300mg" },
    { name: "Cetirizine (Antihistamine)", adultDose: 10, unit: "mg", perKg: 0.25, maxPerKg: 10, frequency: "Once daily", maxDailyAdult: "10mg" },
    { name: "Azithromycin (Antibiotic)", adultDose: 500, unit: "mg", perKg: 10, maxPerKg: 500, frequency: "Once daily", maxDailyAdult: "500mg" },
  ];

  const calculate = () => {
    if (!age || !weight || !selectedMed) return;

    const med = medicines.find((m) => m.name === selectedMed);
    if (!med) return;

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const isChild = ageNum < 18;

    let dose: number;
    let maxDose: number;

    if (isChild && weightNum > 0) {
      dose = Math.round(med.perKg * weightNum);
      maxDose = Math.round(med.maxPerKg * weightNum);
    } else {
      dose = med.adultDose;
      maxDose = parseInt(med.maxDailyAdult);
    }

    // Cap at adult max
    if (dose > med.adultDose && ageNum >= 12) dose = med.adultDose;

    let notes = "";
    if (ageNum < 2) notes = "⚠️ Consult a pediatrician before giving any medicine to children under 2.";
    else if (ageNum < 12) notes = "💡 Weight-based dosing recommended for children. Always verify with a doctor.";
    else if (ageNum >= 65) notes = "⚠️ Elderly patients may need lower doses. Consult your doctor.";
    else notes = "✅ Standard adult dosing. Follow package instructions.";

    if (med.name.includes("Brufen")) notes += "\n🍽️ Take with food to reduce stomach irritation.";
    if (med.name.includes("Panadol")) notes += "\n⏱️ Do not exceed 4g (8 tablets) in 24 hours.";
    if (med.name.includes("Aspirin")) notes += "\n⚠️ Take with food. Do not crush enteric-coated tablets.";

    setResult({
      medicine: med.name,
      dose: `${dose}${med.unit}`,
      frequency: med.frequency,
      maxDaily: isChild ? `${maxDose}${med.unit}/day` : med.maxDailyAdult + "/day",
      notes,
    });
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setShow(!show)}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-2xl">
            📏
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white">Dosage Calculator</h3>
            <p className="text-sm text-slate-400">Get dosage based on age & weight</p>
          </div>
        </div>
        <span className={`text-slate-500 transition-transform ${show ? "rotate-180" : ""}`}>▼</span>
      </button>

      {show && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">🎂 Age (years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="input-field w-full px-4 py-3 rounded-xl text-white text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">⚖️ Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="input-field w-full px-4 py-3 rounded-xl text-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">💊 Select Medicine</label>
            <select
              value={selectedMed}
              onChange={(e) => setSelectedMed(e.target.value)}
              className="input-field w-full px-4 py-3 rounded-xl text-white text-sm"
            >
              <option value="">Choose medicine...</option>
              {medicines.map((m) => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={calculate}
            disabled={!age || !weight || !selectedMed}
            className="btn-primary w-full py-3 text-white font-semibold rounded-xl disabled:opacity-50"
          >
            Calculate Dosage
          </button>

          {result && (
            <div className="severity-safe rounded-xl p-5 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💊</span>
                <div>
                  <div className="font-bold text-white">{result.medicine}</div>
                  <div className="text-xs text-slate-400">Recommended dosage</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-400">{result.dose}</div>
                  <div className="text-xs text-slate-400 mt-1">Per Dose</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-400 text-sm">{result.frequency}</div>
                  <div className="text-xs text-slate-400 mt-1">Frequency</div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 text-center mb-4">
                <div className="text-sm font-semibold text-yellow-400">Max Daily: {result.maxDaily}</div>
              </div>

              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {result.notes}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center">
            ⚠️ General guidance only. Always follow your doctor&apos;s prescription.
          </p>
        </div>
      )}
    </div>
  );
}
