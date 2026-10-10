"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";

const DEMO_USER = {
  id: 999,
  name: "Demo User",
  email: "demo@pillwise.pk",
};

export function DemoModeButton() {
  const router = useRouter();
  const { toast } = useToast();

  const startDemo = () => {
    localStorage.setItem("pillwise-auth", JSON.stringify(DEMO_USER));
    toast("Demo mode activated! Explore PillWise freely.", "success", "🎮");
    router.push("/home");
  };

  return (
    <button
      onClick={startDemo}
      className="glass-card px-5 py-2.5 text-sm text-slate-300 hover:text-white rounded-xl flex items-center gap-2 transition-all border border-purple-500/20 hover:border-purple-500/40"
    >
      <span>🎮</span> Demo Mode
    </button>
  );
}

// Statistics Dashboard
export function StatisticsDashboard() {
  const stats = [
    { label: "Deaths from drug interactions (global)", value: "7,000+", icon: "🌍", source: "WHO" },
    { label: "Adverse drug events are preventable", value: "30%", icon: "⚠️", source: "CDC" },
    { label: "Pakistani medicines that are substandard", value: "1 in 5", icon: "🇵🇰", source: "WHO Pakistan" },
    { label: "Average medicines per elderly patient", value: "5+", icon: "👴", source: "BMJ" },
    { label: "Drug interactions found in our database", value: "30+", icon: "⚡", source: "PillWise" },
    { label: "Medicines in our database", value: "49", icon: "💊", source: "PillWise" },
  ];

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">📊</span> Why PillWise Matters
        </h3>
        <p className="text-sm text-slate-400">The real-world impact of medicine interactions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 animate-fade-in-up hover:border-blue-500/30 transition-all"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-blue-400 mb-1">{stat.value}</div>
            <div className="text-xs text-slate-400 leading-snug">{stat.label}</div>
            <div className="text-[10px] text-slate-600 mt-1">Source: {stat.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
