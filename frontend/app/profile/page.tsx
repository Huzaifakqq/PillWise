"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, clearAuth } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) return router.push("/login");
    setUser(auth);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-slow" />
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="min-h-screen bg-gradient-to-b from-blue-950/30 via-transparent to-slate-950">
        {/* Header */}
        <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all">
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">👤 Profile</h1>
              <p className="text-xs text-slate-500">Manage your account</p>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Profile Card */}
          <div className="glass-card p-8 text-center animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-glow" />
            <div className="relative z-10">
              <div className="w-28 h-28 mx-auto mb-6 relative">
                <div className="w-full h-full bg-gradient-medical rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <span className="text-5xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-950">
                  <span className="text-sm">✓</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-blue-400 mb-4">{user.email}</p>
              <div className="flex justify-center gap-3">
                <span className="text-xs bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full border border-green-500/20">
                  Active
                </span>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20">
                  User #{user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-card p-6 animate-fade-in-up delay-100">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                <span className="text-sm">📋</span>
              </span>
              Account Information
            </h3>
            <div className="space-y-4">
              <InfoRow icon="👤" label="Full Name" value={user.name} />
              <InfoRow icon="✉️" label="Email" value={user.email} />
              <InfoRow icon="🔑" label="User ID" value={`#${user.id}`} />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 animate-fade-in-up delay-200">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                <span className="text-sm">⚙️</span>
              </span>
              Quick Actions
            </h3>

            <ActionLink
              onClick={() => router.push("/my-medicines")}
              icon="💊"
              title="My Medicines"
              desc="Manage your medicines list"
              color="blue"
            />

            <ActionLink
              onClick={() => router.push("/family")}
              icon="👨‍👩‍👧"
              title="Family Members"
              desc="Track your family's medicines"
              color="purple"
            />

            <ActionLink
              onClick={() => router.push("/checker")}
              icon="⚡"
              title="Interaction Checker"
              desc="Check medicine interactions"
              color="red"
            />

            <button
              onClick={handleLogout}
              className="w-full glass-card p-5 text-left flex items-center gap-4 hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
                <span className="text-xl">🚪</span>
              </div>
              <div className="flex-1">
                <div className="text-red-400 font-semibold">Log Out</div>
                <div className="text-sm text-slate-500">Sign out of your account</div>
              </div>
              <span className="text-red-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* About */}
          <div className="text-center py-8 border-t border-slate-800/50">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">💊</span>
              <span className="text-xl font-bold gradient-text">PillWise</span>
            </div>
            <p className="text-slate-500 text-sm">Version 1.0.0</p>
            <p className="text-slate-600 text-xs mt-1">Built with ❤️ at Islamabad Hack 2026</p>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-400 flex items-center gap-3">
        <span>{icon}</span> {label}
      </span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function ActionLink({ onClick, icon, title, desc, color }: {
  onClick: () => void; icon: string; title: string; desc: string; color: "blue" | "purple" | "red";
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    red: "bg-red-500/10 border-red-500/20",
  };

  return (
    <button
      onClick={onClick}
      className="w-full glass-card glass-card-hover p-5 text-left flex items-center gap-4 group"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${colors[color]}`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold">{title}</div>
        <div className="text-sm text-slate-500">{desc}</div>
      </div>
      <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">→</span>
    </button>
  );
}
