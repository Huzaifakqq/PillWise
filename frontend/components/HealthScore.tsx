"use client";
import { useEffect, useRef, useState } from "react";

function scoreColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function scoreGlow(score: number) {
  if (score >= 80) return "drop-shadow(0 0 10px rgba(16,185,129,0.55))";
  if (score >= 50) return "drop-shadow(0 0 10px rgba(245,158,11,0.55))";
  return "drop-shadow(0 0 12px rgba(239,68,68,0.65))";
}

export default function HealthScore({
  score,
  size = 132,
  stroke = 11,
  label = "Safety Score",
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [offset, setOffset] = useState(circumference);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setOffset(circumference * (1 - Math.min(Math.max(score, 0), 100) / 100));

          const start = performance.now();
          const duration = 1400;
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [score, circumference]);

  const color = scoreColor(score);
  const glow = scoreGlow(score);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.65} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(51,65,85,0.45)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
              filter: glow,
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center leading-none">
            <div
              className="font-extrabold tracking-tight"
              style={{ color, fontSize: size * 0.28, filter: glow }}
            >
              {animatedScore}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">/ 100</div>
          </div>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}
