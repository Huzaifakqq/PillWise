"use client";
import { getSeverityConfig } from "@/lib/medicine-icons";

interface HeatmapData {
  medicines: { id: number; name: string }[];
  interactions: { med1Id: number; med2Id: number; severity: string }[];
}

export default function InteractionHeatmap({ data }: { data: HeatmapData }) {
  const { medicines, interactions } = data;

  if (medicines.length < 2) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-slate-400">Add 2+ medicines to see the interaction heatmap</p>
      </div>
    );
  }

  const getInteraction = (id1: number, id2: number) => {
    if (id1 === id2) return { severity: "Self" };
    return (
      interactions.find(
        (i) =>
          (i.med1Id === id1 && i.med2Id === id2) ||
          (i.med1Id === id2 && i.med2Id === id1)
      ) || { severity: "Safe" }
    );
  };

  const getCellColor = (severity: string) => {
    if (severity === "Self") return "bg-slate-800 text-slate-600";
    switch (severity) {
      case "Dangerous":
        return "bg-red-500/30 text-red-400 border border-red-500/40 hover:bg-red-500/50";
      case "Mild":
        return "bg-yellow-500/30 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/50";
      default:
        return "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40";
    }
  };

  const dangerCount = interactions.filter((i) => i.severity === "Dangerous").length;
  const mildCount = interactions.filter((i) => i.severity === "Mild").length;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">🗺️</span> Interaction Heatmap
          </h3>
          <p className="text-sm text-slate-400">Visual overview of all medicine combinations</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-green-500/40 rounded" /> Safe
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-yellow-500/40 rounded" /> Mild
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-500/40 rounded" /> Dangerous
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-green-400">
            {interactions.filter((i) => i.severity === "Safe").length}
          </div>
          <div className="text-xs text-green-400/80">Safe Pairs</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-yellow-400">{mildCount}</div>
          <div className="text-xs text-yellow-400/80">Mild Warnings</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-red-400">{dangerCount}</div>
          <div className="text-xs text-red-400/80">Dangerous</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-fit">
          {/* Column headers */}
          <div className="flex">
            <div className="w-24 flex-shrink-0" />
            {medicines.map((med) => (
              <div
                key={med.id}
                className="w-16 flex-shrink-0 text-center mb-2"
              >
                <span
                  className="text-[10px] text-slate-400 font-medium block transform -rotate-45 origin-center whitespace-nowrap"
                  style={{ minHeight: "40px" }}
                >
                  {med.name.substring(0, 10)}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {medicines.map((rowMed, rowIdx) => (
            <div key={rowMed.id} className="flex items-center mb-1">
              <div className="w-24 flex-shrink-0 text-right pr-3">
                <span className="text-xs text-slate-400 truncate block">{rowMed.name.substring(0, 12)}</span>
              </div>
              {medicines.map((colMed) => {
                const interaction = getInteraction(rowMed.id, colMed.id);
                const isSelf = rowMed.id === colMed.id;
                return (
                  <div
                    key={colMed.id}
                    className={`w-16 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mr-1 mb-1 text-sm font-bold cursor-default transition-all ${
                      isSelf ? getCellColor("Self") : getCellColor(interaction.severity)
                    }`}
                    title={
                      isSelf
                        ? rowMed.name
                        : `${rowMed.name} + ${colMed.name}: ${interaction.severity}`
                    }
                  >
                    {isSelf ? "💊" : interaction.severity === "Dangerous" ? "🔴" : interaction.severity === "Mild" ? "🟡" : "✓"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {dangerCount > 0 && (
        <div className="mt-6 severity-dangerous rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-red-400 font-semibold text-sm">
              {dangerCount} dangerous interaction{dangerCount > 1 ? "s" : ""} detected!
            </p>
            <p className="text-slate-400 text-xs">Consult your doctor immediately</p>
          </div>
        </div>
      )}
    </div>
  );
}
