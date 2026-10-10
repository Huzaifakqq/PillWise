"use client";

const CATEGORY_STYLE: Record<string, { color1: string; color2: string; kind: "capsule" | "tablet" | "liquid" | "softgel" }> = {
  Painkillers: { color1: "#38bdf8", color2: "#e2e8f0", kind: "capsule" },
  Antibiotics: { color1: "#a78bfa", color2: "#f5d0fe", kind: "capsule" },
  Allergy: { color1: "#34d399", color2: "#d1fae5", kind: "tablet" },
  "Blood Pressure": { color1: "#f87171", color2: "#fee2e2", kind: "tablet" },
  Diabetes: { color1: "#fbbf24", color2: "#fef3c7", kind: "softgel" },
  Stomach: { color1: "#22d3ee", color2: "#cffafe", kind: "tablet" },
  Vitamins: { color1: "#f472b6", color2: "#fce7f3", kind: "softgel" },
  "Cold & Flu": { color1: "#fb923c", color2: "#ffedd5", kind: "liquid" },
};

export default function PillVisual({
  name,
  category,
  size = 48,
  className = "",
}: {
  name: string;
  category?: string;
  size?: number;
  className?: string;
}) {
  const style = CATEGORY_STYLE[category ?? ""] ?? {
    color1: "#60a5fa",
    color2: "#dbeafe",
    kind: "capsule" as const,
  };

  const id = `pill-${name.replace(/\W/g, "")}`;

  if (style.kind === "capsule") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={`${name} capsule`}>
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={style.color1} />
            <stop offset="100%" stopColor={style.color2} />
          </linearGradient>
          <linearGradient id={`${id}-h`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <g transform="rotate(-40 32 32)">
          <clipPath id={`${id}-clip`}>
            <rect x="12" y="22" width="40" height="20" rx="10" />
          </clipPath>
          <rect x="12" y="22" width="20" height="20" rx="10" fill={style.color1} />
          <rect x="32" y="22" width="20" height="20" rx="10" fill={style.color2} />
          <rect x="12" y="22" width="40" height="20" rx="10" fill={`url(#${id}-h)`} clipPath={`url(#${id}-clip)`} />
          <rect x="30" y="22" width="4" height="20" fill="rgba(15,23,42,0.18)" />
        </g>
      </svg>
    );
  }

  if (style.kind === "softgel") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={`${name} softgel`}>
        <defs>
          <radialGradient id={`${id}-sg`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="35%" stopColor={style.color1} />
            <stop offset="100%" stopColor={style.color2} />
          </radialGradient>
        </defs>
        <ellipse cx="32" cy="32" rx="17" ry="22" fill={`url(#${id}-sg)`} transform="rotate(18 32 32)" />
        <ellipse cx="26" cy="22" rx="5" ry="7" fill="rgba(255,255,255,0.5)" transform="rotate(18 26 22)" />
      </svg>
    );
  }

  if (style.kind === "liquid") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={`${name} syrup`}>
        <rect x="22" y="8" width="20" height="8" rx="2" fill="#475569" />
        <path d="M20 18 h24 a4 4 0 0 1 4 4 v28 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 v-28 a4 4 0 0 1 4 -4 z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        <path d="M22 34 h20 v16 a4 4 0 0 1 -4 4 h-12 a4 4 0 0 1 -4 -4 z" fill={style.color1} opacity="0.9" />
        <rect x="24" y="22" width="6" height="10" rx="2" fill="rgba(255,255,255,0.25)" />
        <circle cx="30" cy="42" r="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="36" cy="46" r="1.5" fill="rgba(255,255,255,0.35)" />
      </svg>
    );
  }

  // tablet
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={`${name} tablet`}>
      <defs>
        <radialGradient id={`${id}-t`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="40%" stopColor={style.color2} />
          <stop offset="100%" stopColor={style.color1} />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="21" fill={`url(#${id}-t)`} stroke="rgba(15,23,42,0.15)" strokeWidth="1.5" />
      <line x1="32" y1="14" x2="32" y2="50" stroke="rgba(15,23,42,0.22)" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="24" cy="22" rx="6" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-30 24 22)" />
    </svg>
  );
}
