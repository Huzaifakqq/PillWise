"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth } from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setAuthenticated(true);
      router.push("/home");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-slate-800/50 rounded-none">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-medical rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl">💊</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">PillWise</span>
              <p className="text-[9px] text-blue-400 font-medium tracking-wider -mt-0.5">BE WISE BEFORE YOU TAKE</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
            <a href="#stats" className="text-sm text-slate-400 hover:text-white transition-colors">Statistics</a>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm text-white font-medium px-5 py-2.5 rounded-xl">
                Get Started Free
              </Link>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-0 border-t border-slate-800/50 rounded-none p-4 space-y-3">
            <a href="#features" className="block py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#stats" className="block py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>Statistics</a>
            <div className="flex gap-3 pt-2">
              <Link href="/" className="flex-1 text-center py-2.5 glass-card rounded-xl text-slate-300">Sign In</Link>
              <Link href="/register" className="flex-1 text-center py-2.5 btn-primary rounded-xl text-white font-medium">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-32 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Built for Islamabad Hack 2026</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up delay-100">
              Check Your
              <br />
              <span className="gradient-text">Medicines</span>
              <br />
              Before You Take
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed animate-fade-in-up delay-200">
              PillWise instantly checks dangerous interactions between your medicines.
              Protect yourself and your family from preventable adverse reactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up delay-300">
              <Link
                href="/register"
                className="btn-primary px-8 py-4 text-white font-bold rounded-xl text-center text-lg flex items-center justify-center gap-2"
              >
                Start Free <span>→</span>
              </Link>
              <a
                href="#how-it-works"
                className="glass-card px-8 py-4 text-slate-300 font-medium rounded-xl text-center hover:bg-slate-800/60 transition-all flex items-center justify-center gap-2"
              >
                <span>▶</span> See How It Works
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500 animate-fade-in-up delay-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Free to use
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> No signup needed for demo
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-fade-in-up delay-300">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-xs text-slate-500 ml-2">Interaction Checker</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl severity-safe">
                    <span className="text-3xl">💊</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Panadol + Paracetamol</span>
                        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">Safe</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Same active ingredient - safe to combine</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl severity-mild">
                    <span className="text-3xl">💊</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Panadol + Brufen</span>
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30">Mild</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">May cause stomach irritation - take with food</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl severity-dangerous">
                    <span className="text-3xl">💊</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Aspirin + Warfarin</span>
                        <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30">Dangerous</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Risk of internal bleeding - avoid combination</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 glass-card p-4 animate-float hidden md:block">
              <div className="text-2xl font-bold text-green-400">50+</div>
              <div className="text-xs text-slate-400">Medicines</div>
            </div>
            <div className="absolute -top-6 -right-6 glass-card p-4 animate-float hidden md:block" style={{ animationDelay: "1s" }}>
              <div className="text-2xl font-bold text-blue-400">30+</div>
              <div className="text-xs text-slate-400">Interactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 border-t border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Problem is <span className="gradient-text">Real</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Medicine interactions cause thousands of preventable deaths every year worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center animate-fade-in-up">
              <div className="text-4xl font-bold text-red-400 mb-2">30%</div>
              <div className="text-sm text-slate-400">of adverse drug events are preventable</div>
            </div>
            <div className="glass-card p-6 text-center animate-fade-in-up delay-100">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1 in 5</div>
              <div className="text-sm text-slate-400">Pakistan medicines are substandard</div>
            </div>
            <div className="glass-card p-6 text-center animate-fade-in-up delay-200">
              <div className="text-4xl font-bold text-blue-400 mb-2">5+</div>
              <div className="text-sm text-slate-400">medicines average elderly patient takes daily</div>
            </div>
            <div className="glass-card p-6 text-center animate-fade-in-up delay-300">
              <div className="text-4xl font-bold text-green-400 mb-2">100K+</div>
              <div className="text-sm text-slate-400">deaths yearly from drug interactions (US)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Everything You Need to Stay <span className="gradient-text">Safe</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powerful tools to manage medicines for you and your entire family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="⚡"
              title="Instant Interaction Check"
              desc="Select multiple medicines and see instant safety results with severity ratings and advice."
              color="red"
              delay="0"
            />
            <FeatureCard
              icon="🔍"
              title="Medicine Search"
              desc="Search 50+ medicines by name, category, or purpose. Complete details including side effects."
              color="blue"
              delay="100"
            />
            <FeatureCard
              icon="👨‍👩‍👧"
              title="Family Management"
              desc="Track medicines for each family member separately. Perfect for elderly parents and children."
              color="purple"
              delay="200"
            />
            <FeatureCard
              icon="📊"
              title="Safety Dashboard"
              desc="At-a-glance view of your medicine safety score, warnings, and family health overview."
              color="green"
              delay="300"
            />
            <FeatureCard
              icon="🤖"
              title="AI Health Assistant"
              desc="Ask any health question in natural language and get instant, accurate answers."
              color="blue"
              delay="400"
            />
            <FeatureCard
              icon="📄"
              title="PDF Export"
              desc="Export your medicine list as a professional PDF to share with your doctor."
              color="green"
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Three Steps to <span className="gradient-text">Medicine Safety</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 hidden md:block" />

            <StepCard number="1" icon="📝" title="Create Account" desc="Sign up in seconds with your email. Add your allergy information for personalized alerts." delay="0" />
            <StepCard number="2" icon="💊" title="Add Medicines" desc="Search and add all medicines you're currently taking. Include family members too." delay="200" />
            <StepCard number="3" icon="⚡" title="Check Interactions" desc="Select medicines and instantly see if they're safe together with detailed advice." delay="400" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-indigo-950/20 to-slate-950" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-6xl mb-6 animate-float">💊</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Be <span className="gradient-text">Wise</span>?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands who trust PillWise to keep their family safe from dangerous medicine interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary px-10 py-4 text-white font-bold rounded-xl text-lg">
              Get Started Free →
            </Link>
            <Link href="/" className="glass-card px-10 py-4 text-slate-300 font-medium rounded-xl text-lg hover:bg-slate-800/60 transition-all">
              Sign In
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-6">Free forever. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-medical rounded-xl flex items-center justify-center">
                <span className="text-xl">💊</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">PillWise</span>
                <p className="text-[10px] text-blue-400 -mt-0.5">BE WISE BEFORE YOU TAKE</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <Link href="/" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-slate-600">© 2026 PillWise. Built at Islamabad Hack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, delay }: {
  icon: string; title: string; desc: string; color: string; delay: string;
}) {
  const colors: Record<string, string> = {
    red: "from-red-500/10 border-red-500/20 hover:border-red-500/40",
    blue: "from-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
    green: "from-green-500/10 border-green-500/20 hover:border-green-500/40",
    purple: "from-purple-500/10 border-purple-500/20 hover:border-purple-500/40",
  };

  return (
    <div
      className={`glass-card bg-gradient-to-br ${colors[color]} p-6 animate-fade-in-up transition-all hover:-translate-y-1`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-4 text-3xl">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, icon, title, desc, delay }: {
  number: string; icon: string; title: string; desc: string; delay: string;
}) {
  return (
    <div className="text-center animate-fade-in-up relative" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-20 h-20 mx-auto mb-6 relative z-10">
        <div className="w-full h-full glass-card rounded-2xl flex items-center justify-center text-3xl border-blue-500/30">
          {icon}
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-medical rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/30">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
    </div>
  );
}
