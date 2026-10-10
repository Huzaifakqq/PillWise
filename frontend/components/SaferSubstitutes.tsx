"use client";
import { useEffect, useState } from "react";
import { api, Medicine } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import PillVisual from "@/components/PillVisual";

interface ClashingPair {
  medicine1: { id: number; name: string };
  medicine2: { id: number; name: string };
}

/**
 * For each clashing pair, suggests same-category medicines that are not
 * involved in a Dangerous/Major interaction with either drug.
 */
export default function SaferSubstitutes({ clashing }: { clashing: ClashingPair[] }) {
  const { t } = useI18n();
  const [substitutes, setSubstitutes] = useState<Record<number, Medicine[]>>({});

  useEffect(() => {
    let cancelled = false;

    const ids = [...new Set(clashing.flatMap((c) => [c.medicine1.id, c.medicine2.id]))];

    Promise.all(
      ids.map(async (id) => {
        try {
          const alts = await api.getAlternatives(id);
          return [id, alts] as const;
        } catch {
          return [id, [] as Medicine[]] as const;
        }
      })
    ).then((entries) => {
      if (!cancelled) setSubstitutes(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [clashing]);

  if (clashing.length === 0) return null;

  return (
    <div className="glass-card p-5 border border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
        <span className="text-xl">💚</span> {t("saferSubstitutes")}
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        Same-category medicines with no known clash with the drugs below
      </p>

      <div className="space-y-5">
        {clashing.map((pair, i) => {
          const alts = [...(substitutes[pair.medicine1.id] || []), ...(substitutes[pair.medicine2.id] || [])]
            .filter((a, idx, arr) => arr.findIndex((x) => x.id === a.id) === idx)
            .slice(0, 5);

          return (
            <div key={i}>
              <p className="text-sm font-semibold text-red-300 mb-2">
                Instead of {pair.medicine1.name} + {pair.medicine2.name}:
              </p>
              {alts.length === 0 ? (
                <p className="text-sm text-slate-500 italic">{t("noSubstitutes")}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alts.map((alt) => (
                    <div
                      key={alt.id}
                      className="flex items-center gap-3 bg-slate-900/50 border border-emerald-500/20 rounded-xl px-3 py-2"
                    >
                      <PillVisual name={alt.name} size={26} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{alt.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {alt.genericName || alt.categoryName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
