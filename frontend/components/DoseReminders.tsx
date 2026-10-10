"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface ReminderMed {
  name: string;
  timing?: string;
  dosage?: string;
}

interface Dose {
  name: string;
  time: string;
  hour: number;
  icon: string;
}

const TIMING_PRESETS: { match: RegExp; hour: number; label: string }[] = [
  { match: /morning|breakfast|subah|صبح/i, hour: 8, label: "Morning" },
  { match: /lunch|after lunch|dopahar|دوپہر/i, hour: 14, label: "Afternoon" },
  { match: /night|dinner|raat|رات|bedtime/i, hour: 21, label: "Night" },
  { match: /every\s*8|every 8|8 hours|8 گھنٹے/i, hour: 8, label: "Every 8h (first dose)" },
  { match: /every\s*6|6 hours/i, hour: 9, label: "Every 6h (first dose)" },
  { match: /once/i, hour: 9, label: "Once daily" },
];

function buildSchedule(meds: ReminderMed[]): Dose[] {
  const doses: Dose[] = [];
  meds.forEach((m) => {
    const timing = m.timing || "";
    const preset = TIMING_PRESETS.find((p) => p.match.test(timing)) ?? { hour: 9, label: "Daily" };
    doses.push({ name: m.name, time: `${String(preset.hour).padStart(2, "0")}:00`, hour: preset.hour, icon: "💊" });
  });
  return doses.sort((a, b) => a.hour - b.hour);
}

export default function DoseReminders({ medicines }: { medicines: ReminderMed[] }) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = useMemo(() => buildSchedule(medicines), [medicines]);

  useEffect(() => {
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const enable = async () => {
    if (typeof Notification === "undefined") {
      alert("Notifications are not supported in this browser.");
      return;
    }
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;

    setEnabled(true);
    timers.current.forEach(clearTimeout);
    timers.current = schedule.map((dose) => {
      const now = new Date();
      const next = new Date();
      next.setHours(dose.hour, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      const delay = next.getTime() - now.getTime();
      return setTimeout(() => {
        new Notification("💊 PillWise — Time for your medicine", {
          body: `${dose.name} scheduled for ${dose.time}. Be wise before you take.`,
          icon: "/icon.svg",
        });
      }, delay);
    });
  };

  const disable = () => {
    setEnabled(false);
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  if (!medicines.length) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="text-xl">⏰</span> Dose Reminders
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Get a notification when it&apos;s time for each medicine
          </p>
        </div>
        {permission === "granted" ? (
          <button
            onClick={enabled ? disable : enable}
            aria-pressed={enabled}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              enabled
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "btn-primary text-white"
            }`}
          >
            {enabled ? "🔔 On" : "🔕 Off"}
          </button>
        ) : (
          <button
            onClick={enable}
            className="btn-primary px-4 py-2 rounded-xl text-sm text-white font-semibold"
          >
            Enable
          </button>
        )}
      </div>

      <div className="space-y-2">
        {schedule.slice(0, 6).map((dose, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-slate-800/30 rounded-xl px-4 py-3 border border-slate-700/30 hover:border-blue-500/30 transition-colors"
          >
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
              {dose.time}
            </span>
            <span className="flex-1 text-sm text-slate-300 font-medium">{dose.name}</span>
            {enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Reminder active" />
            )}
          </div>
        ))}
        {schedule.length > 6 && (
          <p className="text-xs text-slate-600 text-center pt-1">+{schedule.length - 6} more doses scheduled</p>
        )}
      </div>
    </div>
  );
}
