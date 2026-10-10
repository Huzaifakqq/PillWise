"use client";
import { useState, useEffect } from "react";
import { api, getAuth, UserMedicine, Medicine } from "@/lib/api";

interface AllergyWarning {
  medicineName: string;
  allergen: string;
  severity: "high" | "medium" | "low";
  message: string;
}

const ALLERGEN_MAP: Record<string, string[]> = {
  "penicillin": ["amoxicillin", "augmentin", "penicillin", "ampicillin", "nafcillin"],
  "sulfa": ["sulfamethoxazole", "bactrim", "septra", "sulfadiazine"],
  "aspirin": ["aspirin", "ecosprin", "acetylsalicylic"],
  "nsaid": ["brufen", "ibuprofen", "advil", "motrin", "naproxen", "diclofenac", "nurofen"],
  "codeine": ["codeine", "co-codamol", "tylenol-3"],
  "eggs": ["some vaccines"],
};

export default function AllergyChecker() {
  const [userAllergies, setUserAllergies] = useState<string>("");
  const [medicines, setMedicines] = useState<UserMedicine[]>([]);
  const [warnings, setWarnings] = useState<AllergyWarning[]>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) return;
    loadAllergies(auth.id);
  }, []);

  const loadAllergies = async (userId: number) => {
    setLoading(true);
    try {
      const profile = (await api.getProfile(userId)) as any;
      if (profile?.allergies) setUserAllergies(profile.allergies);
      const meds = (await api.getUserMedicines(userId)) as UserMedicine[];
      setMedicines(meds);
      checkAllergies(profile?.allergies || "", meds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAllergies = (allergies: string, meds: UserMedicine[]) => {
    if (!allergies.trim()) {
      setWarnings([]);
      return;
    }

    const userAllergyList = allergies.toLowerCase().split(",").map((a) => a.trim()).filter(Boolean);
    const foundWarnings: AllergyWarning[] = [];

    meds.forEach((med) => {
      const medLower = med.medicineName.toLowerCase();

      userAllergyList.forEach((allergen) => {
        // Direct match
        if (medLower.includes(allergen)) {
          foundWarnings.push({
            medicineName: med.medicineName,
            allergen,
            severity: "high",
            message: `This medicine contains or is related to your ${allergen} allergy!`,
          });
          return;
        }

        // Check allergen map
        const relatedMeds = ALLERGEN_MAP[allergen] || [];
        relatedMeds.forEach((related) => {
          if (medLower.includes(related)) {
            foundWarnings.push({
              medicineName: med.medicineName,
              allergen,
              severity: "high",
              message: `Related to your ${allergen} allergy - may cause reaction!`,
            });
          }
        });

        // NSAID cross-reactivity
        if (allergen === "aspirin" && (medLower.includes("brufen") || medLower.includes("ibuprofen") || medLower.includes("naproxen"))) {
          foundWarnings.push({
            medicineName: med.medicineName,
            allergen: "aspirin",
            severity: "medium",
            message: "Cross-reactivity risk with aspirin allergy (NSAID sensitivity)",
          });
        }
      });
    });

    // Deduplicate
    const unique = foundWarnings.filter(
      (w, i, arr) => arr.findIndex((x) => x.medicineName === w.medicineName && x.allergen === w.allergen) === i
    );
    setWarnings(unique);
  };

  const handleCheck = () => {
    checkAllergies(userAllergies, medicines);
    setShow(true);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setShow(!show)}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-2xl ${
            warnings.length > 0
              ? "bg-red-500/10 border-red-500/20"
              : "bg-purple-500/10 border-purple-500/20"
          }`}>
            🤧
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white">Allergy Cross-Check</h3>
            <p className="text-sm text-slate-400">
              {warnings.length > 0
                ? `${warnings.length} warning${warnings.length > 1 ? "s" : ""} found!`
                : "Check medicines against your allergies"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {warnings.length > 0 && (
            <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 font-bold animate-pulse">
              {warnings.length}
            </span>
          )}
          <span className={`text-slate-500 transition-transform ${show ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {show && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50 pt-4">
          {/* Allergies Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> Your Allergies
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userAllergies}
                onChange={(e) => setUserAllergies(e.target.value)}
                placeholder="e.g., penicillin, sulfa, aspirin..."
                className="input-field flex-1 px-4 py-3 rounded-xl text-white text-sm"
              />
              <button
                onClick={handleCheck}
                disabled={loading}
                className="btn-primary px-5 py-3 text-white text-sm font-medium rounded-xl disabled:opacity-50"
              >
                {loading ? "..." : "Check"}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Separate multiple allergies with commas
            </p>
          </div>

          {/* Quick Allergy Tags */}
          <div className="flex flex-wrap gap-2">
            {["Penicillin", "Sulfa", "Aspirin", "NSAIDs", "Codeine"].map((allergy) => (
              <button
                key={allergy}
                onClick={() => {
                  const current = userAllergies ? userAllergies + ", " : "";
                  if (!userAllergies.toLowerCase().includes(allergy.toLowerCase())) {
                    setUserAllergies(current + allergy);
                  }
                }}
                className="text-xs glass-card px-3 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                + {allergy}
              </button>
            ))}
          </div>

          {/* Warnings */}
          {warnings.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                ⚠️ Allergy Warnings ({warnings.length})
              </h4>
              {warnings.map((warning, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 ${
                    warning.severity === "high"
                      ? "severity-dangerous"
                      : warning.severity === "medium"
                      ? "severity-mild"
                      : "severity-safe"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">
                      💊 {warning.medicineName}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      warning.severity === "high"
                        ? "bg-red-500 text-white"
                        : warning.severity === "medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-white"
                    }`}>
                      {warning.severity === "high" ? "HIGH RISK" : warning.severity === "medium" ? "CAUTION" : "LOW"}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{warning.message}</p>
                </div>
              ))}
            </div>
          ) : userAllergies && show ? (
            <div className="severity-safe rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-green-400 font-semibold">No allergy conflicts found!</p>
              <p className="text-slate-400 text-sm mt-1">Your medicines are safe with your allergies</p>
            </div>
          ) : null}

          <p className="text-xs text-slate-500 text-center">
            ⚠️ Always inform your doctor about all known allergies
          </p>
        </div>
      )}
    </div>
  );
}
