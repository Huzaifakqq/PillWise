"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, saveAuth } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", allergies: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = (await api.register(form)) as any;
      saveAuth(res);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-3xl">💊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">PillWise</h1>
                <p className="text-blue-400 text-sm font-medium tracking-wider">BE WISE BEFORE YOU TAKE</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Start Your Journey to<br />
              <span className="gradient-text">Medicine Safety</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Join thousands who trust PillWise to keep their family safe from dangerous medicine interactions.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="glass-card p-4 animate-fade-in-up delay-200">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="text-2xl font-bold text-white">30+</div>
                <div className="text-sm text-slate-400">Interactions Database</div>
              </div>
              <div className="glass-card p-4 animate-fade-in-up delay-300">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-slate-400">Instant Results</div>
              </div>
              <div className="glass-card p-4 animate-fade-in-up delay-400">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-2xl font-bold text-white">Secure</div>
                <div className="text-sm text-slate-400">HIPAA Compliant</div>
              </div>
              <div className="glass-card p-4 animate-fade-in-up delay-500">
                <div className="text-3xl mb-2">👨‍👩‍👧</div>
                <div className="text-2xl font-bold text-white">Family</div>
                <div className="text-sm text-slate-400">Member Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-full bg-glow lg:hidden" />

        <div className="w-full max-w-md relative z-10 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-medical rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-4xl">💊</span>
            </div>
            <h1 className="text-3xl font-bold text-white">PillWise</h1>
          </div>

          <div className="glass-card p-8 animate-fade-in-up delay-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Start protecting your family today</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm animate-shake flex items-center gap-3">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">👤</span> Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="Ahmed Khan"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">✉️</span> Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <span className="text-blue-400">📱</span> Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                    placeholder="0300-1234567"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <span className="text-red-400">⚠️</span> Allergies
                  </label>
                  <input
                    type="text"
                    value={form.allergies}
                    onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                    className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                    placeholder="Penicillin..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">🔒</span> Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="flex items-start gap-3 text-sm">
                <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded accent-blue-500" />
                <span className="text-slate-400">
                  I agree to the <Link href="#" className="text-blue-400 hover:text-blue-300">Terms</Link> and <Link href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin-slow inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
