/**
 * Client-side mirror of the backend BodySystemClassifier.
 * Classifies a medicine into the body system most affected by its side effects,
 * powering the "interaction heatmap by body system" visual.
 */
export function classifyBodySystem(
  medicineName: string,
  sideEffects?: string | null
): string {
  const text = `${medicineName} ${sideEffects ?? ""}`.toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => text.includes(k));

  if (has("bleed", "ulcer", "gastric", "stomach", "nausea", "vomit", "diarrhea", "constipation", "reflux", "heartburn", "acid", "liver"))
    return "Gastrointestinal";

  if (has("kidney", "renal", "potassium", "dehydrat", "urinary"))
    return "Kidney & Urinary";

  if (has("tendon", "rash", "skin", "allerg", "itch"))
    return "Skin & Allergic";

  if (has("drowsi", "dizz", "tremor", "headache", "seizure", "nervous", "addiction", "sedat", "sleep"))
    return "Nervous System";

  if (has("blood", "inr", "clot", "bruise", "heart", "pressure", "cardio", "cardiac"))
    return "Cardiovascular & Blood";

  if (has("sugar", "glucose", "diabet", "insulin"))
    return "Metabolic";

  if (has("breath", "asthma", "lung", "cough", "inhal"))
    return "Respiratory";

  if (has("infect", "antibiotic", "bacteria", "fever"))
    return "Immune & Infection";

  return "General";
}

export const BODY_SYSTEM_META: Record<string, { icon: string; color: string; ring: string }> = {
  Gastrointestinal: { icon: "🫁", color: "text-amber-400", ring: "border-amber-400/40" },
  "Kidney & Urinary": { icon: "💧", color: "text-cyan-400", ring: "border-cyan-400/40" },
  "Skin & Allergic": { icon: "🧴", color: "text-orange-400", ring: "border-orange-400/40" },
  "Nervous System": { icon: "🧠", color: "text-purple-400", ring: "border-purple-400/40" },
  "Cardiovascular & Blood": { icon: "❤️", color: "text-red-400", ring: "border-red-400/40" },
  Metabolic: { icon: "🩸", color: "text-rose-400", ring: "border-rose-400/40" },
  Respiratory: { icon: "🌬️", color: "text-sky-400", ring: "border-sky-400/40" },
  "Immune & Infection": { icon: "🛡️", color: "text-green-400", ring: "border-green-400/40" },
  General: { icon: "💊", color: "text-slate-400", ring: "border-slate-400/40" },
};
