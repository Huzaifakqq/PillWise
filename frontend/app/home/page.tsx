"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, getAuth, DashboardStats } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.push("/");
      return;
    }
    setUser(auth);
    api.getDashboardStats(auth.id).then(setStats).catch(console.error);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💊</span>
            <div>
              <h1 className="text-xl font-bold text-white">PillWise</h1>
              <p className="text-xs text-blue-400">Be Wise Before You Take</p>
            </div>
          </div>
          <Link href="/profile" className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl hover:bg-slate-700 transition">
            <span className="text-xl">👤</span>
            <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-white">Hello, {user.name.split(" ")[0]} 👋</h2>
          <p className="text-slate-400">Check if your medicines are safe together</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="animate-fade-in">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any medicine... (e.g., Panadol)"
              className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
        </form>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <StatCard icon="💊" label="My Medicines" value={stats?.totalMedicines ?? 0} color="blue" />
          <StatCard icon="⚠️" label="Warnings" value={stats?.activeWarnings ?? 0} color={stats?.activeWarnings ? "red" : "green"} />
          <StatCard icon="👨‍👩‍👧" label="Family" value={stats?.familyMembers ?? 0} color="purple" />
          <StatCard icon="✅" label="Safe Score" value={stats ? (stats.activeWarnings === 0 ? 100 : Math.max(0, 100 - stats.activeWarnings * 25)) : 100} color="green" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <Link href="/checker" className="group bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-800/50 rounded-2xl p-6 hover:border-red-600 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-white mb-1">Check Interactions</h3>
            <p className="text-slate-400 text-sm">Select medicines and check if they&apos;re safe together</p>
            <div className="mt-4 text-red-400 font-medium group-hover:translate-x-1 transition-transform">Start Checking →</div>
          </Link>

          <Link href="/my-medicines" className="group bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-800/50 rounded-2xl p-6 hover:border-green-600 transition-all">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-white mb-1">My Medicines</h3>
            <p className="text-slate-400 text-sm">Manage your current medicines list</p>
            <div className="mt-4 text-green-400 font-medium group-hover:translate-x-1 transition-transform">Manage →</div>
          </Link>

          <Link href="/family" className="group bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-800/50 rounded-2xl p-6 hover:border-purple-600 transition-all">
            <div className="text-4xl mb-3">👨‍👩‍👧</div>
            <h3 className="text-xl font-bold text-white mb-1">Family Members</h3>
            <p className="text-slate-400 text-sm">Track medicines for your loved ones</p>
            <div className="mt-4 text-purple-400 font-medium group-hover:translate-x-1 transition-transform">Manage →</div>
          </Link>

          <Link href="/search" className="group bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-800/50 rounded-2xl p-6 hover:border-blue-600 transition-all">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-white mb-1">Browse Medicines</h3>
            <p className="text-slate-400 text-sm">Search 50+ medicines in our database</p>
            <div className="mt-4 text-blue-400 font-medium group-hover:translate-x-1 transition-transform">Browse →</div>
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-900/40 to-blue-800/20 border-blue-800/50",
    red: "from-red-900/40 to-red-800/20 border-red-800/50",
    green: "from-green-900/40 to-green-800/20 border-green-800/50",
    purple: "from-purple-900/40 to-purple-800/20 border-purple-800/50",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-4`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
