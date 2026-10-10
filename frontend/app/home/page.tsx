"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, getAuth, DashboardStats } from "@/lib/api";
import HealthChatbot from "@/components/HealthChatbot";
import DosageCalculator from "@/components/DosageCalculator";
import AllergyChecker from "@/components/AllergyChecker";
import ExpiryTracker from "@/components/ExpiryTracker";
import HealthJournal from "@/components/HealthJournal";
import InteractionTimeline from "@/components/InteractionTimeline";
import { MedicineReminders, PrintMedicineCard, DoctorMode } from "@/components/MedicineTools";
import { StatisticsDashboard } from "@/components/DemoStats";
import ThemeToggle from "@/components/ThemeToggle";
import { LanguageToggle, useI18n } from "@/lib/i18n";
import { useToast } from "@/components/Toast";
import { SkeletonStats } from "@/components/Skeletons";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [search, setSearch] = useState("");
  const [userMeds, setUserMeds] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const { t } = useI18n();
  const { toast } = useToast();

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.push("/login");
      return;
    }
    setUser(auth);
    api.getDashboardStats(auth.id).then((s) => {
      setStats(s);
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
    api.getUserMedicines(auth.id).then(setUserMeds).catch(console.error);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-slow" />
        <p className="text-slate-400">Loading your dashboard...</p>
      </div>
    );

  const safeScore = stats ? (stats.activeWarnings === 0 ? 100 : Math.max(0, 100 - stats.activeWarnings * 25)) : 100;

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="min-h-screen bg-gradient-to-b from-blue-950/30 via-transparent to-slate-950">
        {/* Header */}
        <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-medical rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-xl">💊</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">PillWise</h1>
                <p className="text-[10px] text-blue-400 font-medium tracking-wider">BE WISE BEFORE YOU TAKE</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Link href="/search" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800/60 transition-all">
                🔍 <span>Search</span>
              </Link>
              <Link href="/checker" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800/60 transition-all">
                ⚡ <span>Checker</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 glass-card px-3 py-2 hover:bg-slate-800/60 transition-all">
                <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{user.name[0].toUpperCase()}</span>
                </div>
                <span className="text-sm text-slate-300 hidden sm:block font-medium">{user.name.split(" ")[0]}</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Hero Greeting */}
          <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-blue-400 font-medium mb-1">Welcome back 👋</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Hello, <span className="gradient-text">{user.name.split(" ")[0]}</span>
                </h2>
                <p className="text-slate-400 mt-2">Let&apos;s make sure your medicines are safe today</p>
              </div>

              {/* Safety Score Badge */}
              <div className={`glass-card px-6 py-4 flex items-center gap-4 ${safeScore >= 80 ? "border-green-500/30" : safeScore >= 50 ? "border-yellow-500/30" : "border-red-500/30 animate-pulse-glow"}`}>
                <div className={`text-3xl font-bold ${safeScore >= 80 ? "text-green-400" : safeScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {safeScore}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Safety Score</div>
                  <div className="text-xs text-slate-400">{safeScore >= 80 ? "Great condition!" : safeScore >= 50 ? "Needs attention" : "Action required"}</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch}>
              <div className="glass-card p-2 flex items-center gap-3 focus-within:border-blue-500/50 transition-all">
                <span className="pl-4 text-slate-500 text-xl">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search any medicine... (e.g., Panadol, Brufen)"
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none py-3 text-lg"
                />
                <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-white font-semibold text-sm">
                  Search →
                </button>
              </div>
            </form>
          </div>

          {/* Stats */}
          {loadingStats ? (
            <SkeletonStats />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="💊" label="My Medicines" value={stats?.totalMedicines ?? 0} color="blue" delay="100" />
              <StatCard icon="⚠️" label="Warnings" value={stats?.activeWarnings ?? 0} color={stats?.activeWarnings ? "red" : "green"} delay="200" />
              <StatCard icon="👨‍👩‍👧" label="Family" value={stats?.familyMembers ?? 0} color="purple" delay="300" />
              <StatCard icon="✅" label="Safe Score" value={safeScore} color="green" delay="400" />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              href="/checker"
              icon="⚡"
              title="Check Interactions"
              desc="Select medicines and check if they're safe together"
              gradient="from-red-500/10 to-red-900/10"
              borderColor="border-red-500/20 hover:border-red-500/50"
              delay="100"
            />
            <ActionCard
              href="/my-medicines"
              icon="📋"
              title="My Medicines"
              desc="Manage your current medicines list"
              gradient="from-green-500/10 to-green-900/10"
              borderColor="border-green-500/20 hover:border-green-500/50"
              delay="200"
            />
            <ActionCard
              href="/family"
              icon="👨‍👩‍👧"
              title="Family Members"
              desc="Track medicines for your loved ones"
              gradient="from-purple-500/10 to-purple-900/10"
              borderColor="border-purple-500/20 hover:border-purple-500/50"
              delay="300"
            />
            <ActionCard
              href="/search"
              icon="🔍"
              title="Browse Medicines"
              desc="Search 50+ medicines in our database"
              gradient="from-blue-500/10 to-blue-900/10"
              borderColor="border-blue-500/20 hover:border-blue-500/50"
              delay="400"
            />
          </div>

          {/* Health Tip */}
          <div className="glass-card p-6 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 animate-fade-in-up delay-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Health Tip</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Always inform your doctor about <span className="text-blue-400">all medicines</span> you&apos;re taking, including over-the-counter drugs and supplements. Many dangerous interactions can be prevented with proper communication.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tools Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up delay-500">
            <MedicineReminders medicines={userMeds.map((m: any) => ({ name: m.medicineName, timing: m.timing, dosage: m.dosage }))} />
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-2xl">🖨️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">Emergency Card</h4>
                <p className="text-xs text-slate-400">Print wallet-size medicine card</p>
              </div>
              <PrintMedicineCard
                userName={user.name}
                medicines={userMeds.map((m: any) => ({ name: m.medicineName, dosage: m.dosage }))}
              />
            </div>
          </div>

          {/* Doctor Mode + Share */}
          <div className="flex flex-wrap gap-3 animate-fade-in-up delay-500">
            <DoctorMode
              userName={user.name}
              userEmail={user.email}
              medicines={userMeds.map((m: any) => ({ name: m.medicineName, dosage: m.dosage, timing: m.timing }))}
              warnings={stats?.activeWarnings || 0}
            />
          </div>

          {/* Timeline */}
          {userMeds.length > 0 && (
            <div className="animate-fade-in-up delay-500">
              <InteractionTimeline medicines={userMeds.map((m: any) => ({ name: m.medicineName, timing: m.timing, dosage: m.dosage }))} />
            </div>
          )}

          {/* Dosage Calculator */}
          <div className="animate-fade-in-up delay-500">
            <DosageCalculator />
          </div>

          {/* Allergy Checker */}
          <div className="animate-fade-in-up delay-500">
            <AllergyChecker />
          </div>

          {/* Expiry Tracker */}
          <div className="animate-fade-in-up delay-500">
            <ExpiryTracker />
          </div>

          {/* Health Journal */}
          <div className="animate-fade-in-up delay-500">
            <HealthJournal medicines={userMeds.map((m: any) => m.medicineName)} />
          </div>

          {/* Statistics */}
          <div className="animate-fade-in-up delay-500">
            <StatisticsDashboard />
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-4 py-8 mt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-lg">💊</span>
              <span>PillWise © 2026</span>
            </div>
            <p className="text-center">Built with ❤️ at Islamabad Hack 2026</p>
          </div>
        </footer>
      </div>

      {/* Health Chatbot */}
      <HealthChatbot />
    </div>
  );
}

function StatCard({ icon, label, value, color, delay }: { icon: string; label: string; value: number; color: string; delay: string }) {
  const colors: Record<string, { bg: string; icon: string; value: string }> = {
    blue: { bg: "from-blue-500/10 to-blue-900/5 border-blue-500/20", icon: "bg-blue-500/10 border-blue-500/20", value: "text-blue-400" },
    red: { bg: "from-red-500/10 to-red-900/5 border-red-500/20", icon: "bg-red-500/10 border-red-500/20", value: "text-red-400" },
    green: { bg: "from-green-500/10 to-green-900/5 border-green-500/20", icon: "bg-green-500/10 border-green-500/20", value: "text-green-400" },
    purple: { bg: "from-purple-500/10 to-purple-900/5 border-purple-500/20", icon: "bg-purple-500/10 border-purple-500/20", value: "text-purple-400" },
  };
  const c = colors[color];
  return (
    <div className={`glass-card bg-gradient-to-br ${c.bg} p-5 animate-fade-in-up delay-${delay}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.icon}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${c.value}`}>{value}</div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc, gradient, borderColor, delay }: {
  href: string; icon: string; title: string; desc: string; gradient: string; borderColor: string; delay: string;
}) {
  return (
    <Link
      href={href}
      className={`glass-card bg-gradient-to-br ${gradient} border ${borderColor} p-6 group animate-fade-in-up delay-${delay} transition-all hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          <div className="mt-3 text-sm font-medium text-blue-400 flex items-center gap-1">
            Get Started <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
