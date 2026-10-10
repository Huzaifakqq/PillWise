"use client";

interface TimelineEntry {
  time: string;
  medicine: string;
  withFood: boolean;
}

const TIMELINE_SLOTS = [
  { time: "06:00 AM", label: "Morning", icon: "🌅" },
  { time: "08:00 AM", label: "Breakfast", icon: "🥣" },
  { time: "12:00 PM", label: "Lunch", icon: "🍚" },
  { time: "02:00 PM", label: "Afternoon", icon: "☀️" },
  { time: "06:00 PM", label: "Evening", icon: "🌆" },
  { time: "08:00 PM", label: "Dinner", icon: "🍽️" },
  { time: "10:00 PM", label: "Bedtime", icon: "🌙" },
];

const MEDICINE_SCHEDULE: Record<string, string[]> = {
  "morning": ["06:00 AM", "08:00 AM"],
  "night": ["10:00 PM"],
  "afternoon": ["02:00 PM"],
  "evening": ["06:00 PM"],
  "breakfast": ["08:00 AM"],
  "lunch": ["12:00 PM"],
  "dinner": ["08:00 PM"],
  "daily": ["08:00 AM"],
  "before meal": ["08:00 AM", "12:00 PM", "08:00 PM"],
  "after meal": ["08:00 AM", "12:00 PM", "08:00 PM"],
};

function getSchedule(medicineName: string, timing?: string): string[] {
  const timingLower = (timing || "").toLowerCase();
  const nameLower = medicineName.toLowerCase();

  // Check timing first
  for (const [key, slots] of Object.entries(MEDICINE_SCHEDULE)) {
    if (timingLower.includes(key)) return slots;
  }

  // Default schedules based on medicine type
  if (nameLower.includes("blood pressure") || nameLower.includes("amlodipine") || nameLower.includes("atenolol") || nameLower.includes("metoprolol"))
    return ["06:00 AM"];
  if (nameLower.includes("statin") || nameLower.includes("atorvastatin"))
    return ["10:00 PM"];
  if (nameLower.includes("omeprazole") || nameLower.includes("pantoprazole"))
    return ["06:00 AM"];
  if (nameLower.includes("antibiotic"))
    return ["08:00 AM", "02:00 PM", "10:00 PM"];
  if (nameLower.includes("metformin"))
    return ["08:00 AM", "08:00 PM"];

  return ["08:00 AM"];
}

export default function InteractionTimeline({ medicines }: { medicines: { name: string; timing?: string; dosage?: string }[] }) {
  if (medicines.length === 0) return null;

  const schedule = medicines.map((med) => ({
    ...med,
    slots: getSchedule(med.name, med.timing),
  }));

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">⏰</span> Daily Medicine Timeline
        </h3>
        <p className="text-sm text-slate-400">When to take each medicine throughout the day</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[70px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-indigo-500/50" />

        <div className="space-y-4">
          {TIMELINE_SLOTS.map((slot, slotIdx) => {
            const slotMeds = schedule.filter((m) => m.slots.includes(slot.time));
            if (slotMeds.length === 0) return null;

            return (
              <div key={slot.time} className="flex gap-4 animate-fade-in-up" style={{ animationDelay: `${slotIdx * 100}ms` }}>
                {/* Time */}
                <div className="w-[60px] text-right flex-shrink-0 pt-1">
                  <span className="text-xs font-mono text-slate-500">{slot.time}</span>
                </div>

                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-gradient-medical border-2 border-slate-950 shadow-lg shadow-blue-500/30 mt-1" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{slot.icon}</span>
                    <span className="text-sm font-medium text-slate-400">{slot.label}</span>
                  </div>
                  <div className="space-y-2">
                    {slotMeds.map((med, idx) => (
                      <div
                        key={`${med.name}-${idx}`}
                        className="glass-card p-3 flex items-center gap-3 border-l-2 border-blue-500/50"
                      >
                        <span className="text-lg">💊</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{med.name}</p>
                          {med.dosage && <p className="text-xs text-slate-400">{med.dosage}</p>}
                        </div>
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                          {slot.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-3">
        <span className="text-lg">💡</span>
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-blue-400 font-medium">Tip:</span> Space out medicines by at least 2 hours when possible.
          Take antibiotics at evenly spaced intervals for maximum effectiveness.
        </p>
      </div>
    </div>
  );
}
