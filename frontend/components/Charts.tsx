"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useMemo } from "react";

const SEVERITY_COLORS = { safe: "#10b981", warning: "#ef4444", mild: "#f59e0b" };

function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 text-sm border border-slate-600/60 shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function SafetyDonut({ safe, warnings }: { safe: number; warnings: number }) {
  const data = useMemo(() => {
    const rows = [
      { name: "Safe", value: Math.max(safe, 0), color: SEVERITY_COLORS.safe },
      { name: "Warnings", value: Math.max(warnings, 0), color: SEVERITY_COLORS.warning },
    ];
    return rows.filter((r) => r.value > 0);
  }, [safe, warnings]);

  const total = Math.max(safe, 0) + Math.max(warnings, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white">Safety Overview</h3>
          <p className="text-xs text-slate-500">Your medicines at a glance</p>
        </div>
        <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
          Live
        </span>
      </div>

      <div className="h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="92%"
              paddingAngle={5}
              cornerRadius={8}
              stroke="none"
              isAnimationActive
              animationDuration={1100}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<GlassTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-white animate-bounce-in">{total}</div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider">medicines</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-5 mt-3 text-sm">
        <span className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: SEVERITY_COLORS.safe }} />
          {Math.max(safe, 0)} safe
        </span>
        <span className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: SEVERITY_COLORS.warning }} />
          {Math.max(warnings, 0)} warnings
        </span>
      </div>
    </div>
  );
}

const WEEKLY_DATA = [
  { day: "Mon", checks: 4 },
  { day: "Tue", checks: 7 },
  { day: "Wed", checks: 5 },
  { day: "Thu", checks: 11 },
  { day: "Fri", checks: 8 },
  { day: "Sat", checks: 14 },
  { day: "Sun", checks: 10 },
];

export function WeeklyActivityChart() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white">Weekly Activity</h3>
          <p className="text-xs text-slate-500">Interaction checks performed</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
          +28% ↑
        </span>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.35)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<GlassTooltip />} cursor={{ stroke: "rgba(14,165,233,0.4)" }} />
            <Area
              type="monotone"
              dataKey="checks"
              name="Checks"
              stroke="#38bdf8"
              strokeWidth={3}
              fill="url(#activityFill)"
              isAnimationActive
              animationDuration={1200}
              dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#0ea5e9" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryBars({ data }: { data: { name: string; count: number; color: string }[] }) {
  if (!data.length) return null;
  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <h3 className="font-bold text-white">Medicines by Type</h3>
        <p className="text-xs text-slate-500">Distribution of your medicine list</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.35)" horizontal={false} />
            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={92}
            />
            <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(14,165,233,0.06)" }} />
            <Bar dataKey="count" name="Medicines" radius={[0, 8, 8, 0]} isAnimationActive animationDuration={1000}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
