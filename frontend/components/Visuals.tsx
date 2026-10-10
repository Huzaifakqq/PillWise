"use client";
import { useMemo } from "react";

function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLE_COLORS = [
  "bg-blue-400",
  "bg-cyan-400",
  "bg-indigo-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-violet-400",
];

export function ParticleField({ count = 32, className = "" }: { count?: number; className?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: seeded(i * 4 + 1) * 100,
        top: seeded(i * 4 + 2) * 100,
        size: 2 + seeded(i * 4 + 3) * 5,
        delay: seeded(i * 4 + 4) * 4,
        duration: 3 + seeded(i * 7 + 5) * 5,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute rounded-full animate-twinkle ${p.color}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.25,
          }}
        />
      ))}
    </div>
  );
}

export function AuroraBg({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`} aria-hidden>
      <div
        className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-blue-600/20 blur-[110px] animate-morph"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-1/3 -right-24 w-[26rem] h-[26rem] bg-indigo-600/20 blur-[110px] animate-morph"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-[24rem] h-[24rem] bg-cyan-500/15 blur-[110px] animate-morph"
        style={{ animationDelay: "-6s" }}
      />
    </div>
  );
}

export function FloatingPill({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <div className={`absolute pointer-events-none select-none ${className}`} aria-hidden>
      <span
        className="text-3xl block animate-float-x"
        style={{ animationDelay: `${delay}s` }}
      >
        💊
      </span>
    </div>
  );
}

export function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden py-3" aria-hidden>
      <div className="flex gap-3 w-max" style={{ animation: `marquee ${speed}s linear infinite` }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="glass-card px-5 py-2.5 text-sm text-slate-300 whitespace-nowrap flex items-center gap-2 border border-slate-700/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RadarScanner({ label = "Scanning interactions..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
      <div className="relative w-36 h-36">
        {[0, 1, 2].map((ring) => (
          <div
            key={ring}
            className="absolute inset-0 rounded-full border border-blue-500/25"
            style={{ transform: `scale(${0.55 + ring * 0.225})` }}
          />
        ))}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(14,165,233,0.55), rgba(14,165,233,0) 28%)",
            animation: "radarSweep 1.6s linear infinite",
            maskImage: "radial-gradient(circle, black 68%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, black 68%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative">
            <span className="text-3xl animate-pop">💊</span>
            <span className="absolute inset-0 rounded-full border-2 border-blue-400/60 animate-[pulseRing_1.6s_ease-out_infinite]" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-blue-300">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        {label}
      </div>
    </div>
  );
}

const CONFETTI_COLORS = ["#10b981", "#34d399", "#0ea5e9", "#a78bfa", "#fbbf24", "#f472b6"];

export function Confetti({ pieceCount = 26 }: { pieceCount?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: pieceCount }, (_, i) => ({
        id: i,
        left: seeded(i * 5 + 11) * 100,
        delay: seeded(i * 5 + 12) * 0.9,
        duration: 1.6 + seeded(i * 5 + 13) * 1.4,
        size: 6 + seeded(i * 5 + 14) * 7,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: i % 3 === 0,
      })),
    [pieceCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={p.round ? "absolute rounded-full" : "absolute rounded-sm"}
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.6),
            background: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export function PulseShield({ danger = false }: { danger?: boolean }) {
  const color = danger ? "border-red-500/60 text-red-400" : "border-green-500/60 text-green-400";
  return (
    <div className="relative w-20 h-20 grid place-items-center" aria-hidden>
      <span className={`absolute inset-0 rounded-2xl border-2 ${color} animate-[pulseRing_1.8s_ease-out_infinite]`} />
      <div className={`w-16 h-16 rounded-2xl border-2 ${color} bg-slate-950/70 grid place-items-center text-3xl`}>
        {danger ? "⚠️" : "🛡️"}
      </div>
    </div>
  );
}
