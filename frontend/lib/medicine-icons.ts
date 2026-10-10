export function getMedicineIcon(name: string): { emoji: string; gradient: string } {
  const lower = name.toLowerCase();

  if (lower.includes("cough") || lower.includes("syrup") || lower.includes("cheston"))
    return { emoji: "🍯", gradient: "from-amber-500/20 to-yellow-600/10" };

  if (lower.includes("capsule") || lower.includes("augmentin") || lower.includes("amoxicillin"))
    return { emoji: "💊", gradient: "from-blue-500/20 to-cyan-600/10" };

  if (lower.includes("panadol") || lower.includes("paracetamol") || lower.includes("acetaminophen"))
    return { emoji: "⚪", gradient: "from-slate-400/20 to-slate-600/10" };

  if (lower.includes("brufen") || lower.includes("ibuprofen") || lower.includes("advil") || lower.includes("motrin"))
    return { emoji: "🟠", gradient: "from-orange-500/20 to-amber-600/10" };

  if (lower.includes("aspirin") || lower.includes("ecosprin"))
    return { emoji: "🔴", gradient: "from-red-500/20 to-rose-600/10" };

  if (lower.includes("antibiotic") || lower.includes("penicillin") || lower.includes("azithromycin") || lower.includes("erythromycin"))
    return { emoji: "🧫", gradient: "from-green-500/20 to-emerald-600/10" };

  if (lower.includes("allergy") || lower.includes("cetirizine") || lower.includes("loratadine") || lower.includes("claritin") || lower.includes("zyrtec") || lower.includes("histacin"))
    return { emoji: "🤧", gradient: "from-purple-500/20 to-violet-600/10" };

  if (lower.includes("antacid") || lower.includes("omeprazole") || lower.includes("pantoprazole") || lower.includes("nexium") || lower.includes("rasagil") || lower.includes("gaviscon"))
    return { emoji: "🫁", gradient: "from-teal-500/20 to-cyan-600/10" };

  if (lower.includes("vitamin") || lower.includes("calcium") || lower.includes("iron") || lower.includes("folate") || lower.includes("supplement"))
    return { emoji: "🍊", gradient: "from-yellow-500/20 to-orange-600/10" };

  if (lower.includes("diabet") || lower.includes("metformin") || lower.includes("glucophage") || lower.includes("insulin"))
    return { emoji: "💉", gradient: "from-blue-500/20 to-indigo-600/10" };

  if (lower.includes("blood pressure") || lower.includes("hypertension") || lower.includes("amlodipine") || lower.includes("losartan") || lower.includes("enalapril") || lower.includes("atenolol") || lower.includes("metoprolol"))
    return { emoji: "❤️", gradient: "from-red-500/20 to-pink-600/10" };

  if (lower.includes("cholesterol") || lower.includes("atorvastatin") || lower.includes("simvastatin") || lower.includes("statin"))
    return { emoji: "🫀", gradient: "from-rose-500/20 to-red-600/10" };

  if (lower.includes("pain") || lower.includes("analgesic") || lower.includes("diclofenac") || lower.includes("naproxen") || lower.includes("mefenamic") || lower.includes("ponstan"))
    return { emoji: "😰", gradient: "from-orange-500/20 to-red-600/10" };

  if (lower.includes("sleep") || lower.includes("melatonin") || lower.includes("zolpidem") || lower.includes("sedative"))
    return { emoji: "😴", gradient: "from-indigo-500/20 to-blue-600/10" };

  if (lower.includes("antifungal") || lower.includes("fluconazole") || lower.includes("clotrimazole") || lower.includes("terbinafine"))
    return { emoji: "🦠", gradient: "from-emerald-500/20 to-green-600/10" };

  if (lower.includes("anti") || lower.includes("inflammatory"))
    return { emoji: "🔥", gradient: "from-red-500/20 to-orange-600/10" };

  if (lower.includes("syrup") || lower.includes("solution") || lower.includes("liquid"))
    return { emoji: "🧴", gradient: "from-cyan-500/20 to-blue-600/10" };

  if (lower.includes("injection") || lower.includes("vaccine") || lower.includes("shot"))
    return { emoji: "💉", gradient: "from-blue-500/20 to-purple-600/10" };

  if (lower.includes("tablet") || lower.includes("pill"))
    return { emoji: "💊", gradient: "from-blue-500/20 to-indigo-600/10" };

  return { emoji: "💊", gradient: "from-blue-500/20 to-indigo-600/10" };
}

export function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("pain") || lower.includes("analgesic")) return "😰";
  if (lower.includes("antibiotic")) return "🧫";
  if (lower.includes("cardio") || lower.includes("heart")) return "❤️";
  if (lower.includes("respiratory") || lower.includes("lung")) return "🫁";
  if (lower.includes("digest") || lower.includes("stomach")) return "🫃";
  if (lower.includes("allerg")) return "🤧";
  if (lower.includes("diabet")) return "💉";
  if (lower.includes("vitamin") || lower.includes("supplement")) return "🍊";
  if (lower.includes("mental") || lower.includes("brain")) return "🧠";
  if (lower.includes("skin")) return "🧴";
  if (lower.includes("anti")) return "⚡";
  return "💊";
}

export function getSeverityConfig(severity: string) {
  switch (severity) {
    case "Dangerous":
      return {
        emoji: "🔴",
        label: "Dangerous",
        badge: "bg-red-500/20 text-red-400 border-red-500/30",
        cardBg: "severity-dangerous",
        dot: "bg-red-500",
        text: "text-red-400",
      };
    case "Mild":
      return {
        emoji: "🟡",
        label: "Mild",
        badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        cardBg: "severity-mild",
        dot: "bg-yellow-500",
        text: "text-yellow-400",
      };
    default:
      return {
        emoji: "🟢",
        label: "Safe",
        badge: "bg-green-500/20 text-green-400 border-green-500/30",
        cardBg: "severity-safe",
        dot: "bg-green-500",
        text: "text-green-400",
      };
  }
}
