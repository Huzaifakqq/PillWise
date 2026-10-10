"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, clearAuth } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) return router.push("/");
    setUser(auth);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white text-xl">←</button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-white">{user.name.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-blue-400">{user.email}</p>
        </div>

        {/* Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
          <div className="space-y-4">
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="User ID" value={`#${user.id}`} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 animate-fade-in">
          <button
            onClick={() => router.push("/my-medicines")}
            className="w-full py-4 bg-slate-900/60 border border-slate-800 rounded-xl text-left px-6 hover:border-blue-600/50 transition flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">💊</span>
              <span className="text-white font-medium">My Medicines</span>
            </span>
            <span className="text-slate-500">→</span>
          </button>

          <button
            onClick={() => router.push("/family")}
            className="w-full py-4 bg-slate-900/60 border border-slate-800 rounded-xl text-left px-6 hover:border-purple-600/50 transition flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">👨‍👩‍👧</span>
              <span className="text-white font-medium">Family Members</span>
            </span>
            <span className="text-slate-500">→</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-4 bg-red-900/30 border border-red-800/50 rounded-xl text-left px-6 hover:bg-red-900/50 transition flex items-center gap-3"
          >
            <span className="text-2xl">🚪</span>
            <span className="text-red-400 font-medium">Log Out</span>
          </button>
        </div>

        {/* About */}
        <div className="text-center text-slate-500 text-sm pt-4">
          <p>PillWise v1.0</p>
          <p className="mt-1">Built with ❤️ at Islamabad Hack 2026</p>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
