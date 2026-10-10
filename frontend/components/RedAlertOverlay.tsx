"use client";
import { Interaction } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

interface Props {
  results: Interaction[];
  onClose: () => void;
}

/**
 * Full-screen emergency view of every dangerous interaction.
 * Designed to be held up to a doctor or pharmacist — high contrast,
 * large type, no chrome, no navigation to get lost in.
 */
export default function RedAlertOverlay({ results, onClose }: Props) {
  const { t } = useI18n();
  const dangerous = results.filter((r) => r.severity === "Dangerous");
  const major = results.filter((r) => r.severity === "Major");
  const shown = [...dangerous, ...major];

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={t("redAlertTitle")}
      className="fixed inset-0 z-[200] bg-red-950/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl bg-slate-950 border-2 border-red-500 rounded-2xl p-6 md:p-10 animate-bounce-in shadow-2xl shadow-red-500/20">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-wiggle">🚨</div>
          <h2 className="text-2xl md:text-4xl font-black text-red-400 mb-2">
            {shown.length === 0 ? t("noDangerous") : t("redAlertTitle")}
          </h2>
          <p className="text-slate-400 text-sm md:text-base">{t("redAlertSubtitle")}</p>
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {shown.map((r, i) => (
            <div
              key={i}
              className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 font-black text-lg md:text-2xl">
                  {r.medicine1Name} + {r.medicine2Name}
                </span>
                <span className="ml-auto text-[10px] font-bold uppercase bg-red-500 text-white px-2 py-1 rounded">
                  {r.severity}
                </span>
              </div>
              {r.description && (
                <p className="text-slate-300 text-sm md:text-lg leading-relaxed">
                  {r.description}
                </p>
              )}
              {r.advice && (
                <p className="text-amber-300 text-sm md:text-lg font-semibold mt-2">
                  → {r.advice}
                </p>
              )}
            </div>
          ))}
          {shown.length === 0 && (
            <p className="text-green-400 text-center text-xl font-bold py-6">
              ✓ {t("noDangerous")}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-xl transition-colors"
        >
          ✕ {t("dismiss")}
        </button>
      </div>
    </div>
  );
}
