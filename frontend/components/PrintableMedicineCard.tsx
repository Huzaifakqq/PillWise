"use client";
import { UserMedicine } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

interface Props {
  userName: string;
  medicines: UserMedicine[];
  warnings?: { medicine: string; severity: string; advice: string }[];
}

/**
 * Large-print A4 medicine card for the fridge or a wallet.
 * Uses the browser print dialog (works offline, no PDF library font-subset
 * issues with Nastaliq). A dedicated print stylesheet strips all app chrome.
 */
export default function PrintableMedicineCard({ userName, medicines, warnings = [] }: Props) {
  const { t } = useI18n();

  return (
    <>
      <button
        onClick={() => window.print()}
        className="glass-card px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white transition-all flex items-center gap-2"
      >
        🖨 {t("printCard")}
      </button>

      {/* Everything inside .print-card is what lands on the A4 sheet. */}
      <div className="print-card fixed -left-[9999px] top-0 w-[210mm] bg-white text-slate-900 p-10">
        <div className="flex items-baseline justify-between border-b-4 border-sky-600 pb-3 mb-6">
          <h1 className="text-5xl font-black text-sky-700">PillWise</h1>
          <p className="text-lg text-slate-600">{t("largePrintCard")}</p>
        </div>

        <p className="text-2xl font-bold mb-1">{userName}</p>
        <p className="text-lg text-slate-500 mb-8">{t("printInstructions")}</p>

        {warnings.length > 0 && (
          <div className="mb-8 border-4 border-red-600 bg-red-50 rounded-xl p-5">
            <h2 className="text-3xl font-black text-red-700 mb-3">
              ⚠ {t("redAlertTitle")}
            </h2>
            {warnings.map((w, i) => (
              <p key={i} className="text-xl leading-relaxed mb-2">
                <span className="font-black">{w.medicine}</span> — {w.advice}
              </p>
            ))}
          </div>
        )}

        <h2 className="text-3xl font-black mb-4">{t("myMedicines")}</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left text-xl font-bold p-3 border-2 border-slate-300">
                Medicine
              </th>
              <th className="text-left text-xl font-bold p-3 border-2 border-slate-300">
                {t("dosage")}
              </th>
              <th className="text-left text-xl font-bold p-3 border-2 border-slate-300">
                {t("checkInteractions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id}>
                <td className="text-2xl font-bold p-3 border-2 border-slate-300">
                  {m.medicineName}
                </td>
                <td className="text-2xl p-3 border-2 border-slate-300">
                  {m.dosage || "—"}
                </td>
                <td className="text-xl p-3 border-2 border-slate-300 text-slate-500">
                  {m.timing || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-base text-slate-500 mt-8 italic">{t("disclaimer")}</p>
      </div>
    </>
  );
}
