"use client";
import { useState } from "react";

// Drug Alternatives
const ALTERNATIVES: Record<string, { name: string; reason: string }[]> = {
  "brufen": [
    { name: "Paracetamol (Panadol)", reason: "Gentler on stomach, same pain relief" },
    { name: "Naproxen", reason: "Longer-lasting, taken twice daily" },
  ],
  "ibuprofen": [
    { name: "Paracetamol (Panadol)", reason: "Gentler on stomach" },
    { name: "Diclofenac", reason: "Alternative NSAID with topical option" },
  ],
  "aspirin": [
    { name: "Clopidogrel", reason: "Alternative antiplatelet, less stomach irritation" },
  ],
  "augmentin": [
    { name: "Azithromycin", reason: "Shorter course (3 days vs 7)" },
    { name: "Amoxicillin", reason: "Same base without clavulanate" },
  ],
  "omeprazole": [
    { name: "Pantoprazole", reason: "Fewer drug interactions" },
    { name: "Rabeprazole", reason: "Alternative PPI option" },
  ],
  "cetirizine": [
    { name: "Loratadine (Claritin)", reason: "Less drowsiness" },
    { name: "Fexofenadine", reason: "Non-drowsy, once daily" },
  ],
};

// Meal timing
const MEAL_GUIDE: Record<string, { timing: string; icon: string; note: string }> = {
  "with food": {
    timing: "Take WITH food",
    icon: "🍽️",
    note: "Reduces stomach irritation and improves absorption",
  },
  "empty stomach": {
    timing: "Take on EMPTY stomach",
    icon: "🕐",
    note: "Take 30-60 minutes before meals for best effect",
  },
  "avoid food": {
    timing: "AVOID certain foods",
    icon: "🚫",
    note: "Dairy, grapefruit, or alcohol may reduce effectiveness",
  },
};

function getMealTiming(name: string): typeof MEAL_GUIDE[keyof typeof MEAL_GUIDE] | null {
  const lower = name.toLowerCase();
  if (lower.includes("brufen") || lower.includes("ibuprofen") || lower.includes("aspirin") || lower.includes("diclofenac") || lower.includes("naproxen"))
    return MEAL_GUIDE["with food"];
  if (lower.includes("omeprazole") || lower.includes("pantoprazole") || lower.includes("rabeprazole"))
    return MEAL_GUIDE["empty stomach"];
  if (lower.includes("azithromycin") || lower.includes("ciprofloxacin"))
    return MEAL_GUIDE["avoid food"];
  if (lower.includes("iron") || lower.includes("calcium"))
    return MEAL_GUIDE["avoid food"];
  if (lower.includes("antibiotic") || lower.includes("metformin"))
    return MEAL_GUIDE["with food"];
  return null;
}

// Pregnancy safety
const PREGNANCY_UNSAFE = ["aspirin", "ibuprofen", "brufen", "naproxen", "diclofenac", "warfarin", "lisinopril", "valproate", "tetracycline", "doxycycline", "ciprofloxacin"];
const PREGNANCY_CAUTION = ["omeprazole", "pantoprazole", "cetirizine", "loratadine", "metformin", "omeprazole"];

function getPregnancyStatus(name: string): { status: string; color: string; emoji: string } {
  const lower = name.toLowerCase();
  if (PREGNANCY_UNSAFE.some((d) => lower.includes(d)))
    return { status: "Not Recommended", color: "text-red-400 bg-red-500/10 border-red-500/20", emoji: "🔴" };
  if (PREGNANCY_CAUTION.some((d) => lower.includes(d)))
    return { status: "Use with Caution", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", emoji: "🟡" };
  if (lower.includes("paracetamol") || lower.includes("panadol"))
    return { status: "Generally Safe", color: "text-green-400 bg-green-500/10 border-green-500/20", emoji: "🟢" };
  return { status: "Consult Doctor", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", emoji: "🔵" };
}

// Kidney/Liver warnings
const KIDNEY_UNSAFE = ["ibuprofen", "brufen", "naproxen", "diclofenac", "metformin", "gentamicin", "vancomycin", "allopurinol"];
const LIVER_UNSAFE = ["acetaminophen high dose", "statin", "methotrexate", "isoniazid"];

function getKidneyLiverWarning(name: string): string | null {
  const lower = name.toLowerCase();
  if (KIDNEY_UNSAFE.some((d) => lower.includes(d)))
    return "⚠️ Use with caution in kidney disease - may affect kidney function";
  if (lower.includes("paracetamol") || lower.includes("panadol"))
    return "⚠️ High doses may affect liver - do not exceed 4g/day";
  if (LIVER_UNSAFE.some((d) => lower.includes(d)))
    return "⚠️ Monitor liver function - may affect liver";
  return null;
}

// Get alternatives
function getAlternatives(name: string): { name: string; reason: string }[] {
  const lower = name.toLowerCase();
  for (const [key, alts] of Object.entries(ALTERNATIVES)) {
    if (lower.includes(key)) return alts;
  }
  return [];
}

export function MedicineAlternatives({ medicineName }: { medicineName: string }) {
  const alternatives = getAlternatives(medicineName);
  if (alternatives.length === 0) return null;

  return (
    <div className="severity-safe rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <span className="font-semibold text-green-400 text-sm">Safer Alternatives</span>
      </div>
      <div className="space-y-2">
        {alternatives.map((alt, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
            <span className="text-green-400">→</span>
            <div>
              <p className="text-white text-sm font-medium">{alt.name}</p>
              <p className="text-slate-400 text-xs">{alt.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MealTimingGuide({ medicineName }: { medicineName: string }) {
  const guide = getMealTiming(medicineName);
  if (!guide) return null;

  return (
    <div className="severity-mild rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">{guide.icon}</span>
        <div>
          <p className="font-semibold text-yellow-400 text-sm">{guide.timing}</p>
          <p className="text-slate-400 text-xs mt-1">{guide.note}</p>
        </div>
      </div>
    </div>
  );
}

export function PregnancySafety({ medicineName }: { medicineName: string }) {
  const status = getPregnancyStatus(medicineName);
  return (
    <div className={`rounded-xl p-4 border ${status.color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{status.emoji}</span>
          <span className="text-sm font-medium">Pregnancy Safety</span>
        </div>
        <span className="text-xs font-bold">{status.status}</span>
      </div>
    </div>
  );
}

export function KidneyLiverWarning({ medicineName }: { medicineName: string }) {
  const warning = getKidneyLiverWarning(medicineName);
  if (!warning) return null;

  return (
    <div className="severity-dangerous rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-lg">🫘</span>
        <div>
          <p className="text-red-400 font-semibold text-sm">Organ Safety Warning</p>
          <p className="text-slate-300 text-xs mt-1">{warning}</p>
        </div>
      </div>
    </div>
  );
}
