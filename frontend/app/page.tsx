"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, saveAuth } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = (await api.login({ email, password })) as any;
      saveAuth(res);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0.75s" }} />
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
              Your Medicine<br />
              <span className="gradient-text">Safety Companion</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Check dangerous interactions between medicines before you take them. 
              Protect yourself and your family from preventable adverse reactions.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300 animate-slide-in" style={{ animationDelay: "200ms" }}>
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                  <span className="text-green-400">✓</span>
                </div>
                <span>50+ medicines in database</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300 animate-slide-in" style={{ animationDelay: "300ms" }}>
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <span className="text-blue-400">⚡</span>
                </div>
                <span>Instant interaction detection</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300 animate-slide-in" style={{ animationDelay: "400ms" }}>
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <span className="text-purple-400">👥</span>
                </div>
                <span>Manage family members&apos; medicines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-glow lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-medical rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-4xl">💊</span>
            </div>
            <h1 className="text-3xl font-bold text-white">PillWise</h1>
            <p className="text-blue-400 text-sm mt-1">Be Wise Before You Take</p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 animate-fade-in-up delay-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Sign in to check your medicines</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm animate-shake flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">✉️</span> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">🔒</span> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-blue-500" />
                  Remember me
                </label>
                <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin-slow inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900/80 px-4 text-slate-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="input-field py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2">
                <span className="text-lg">📱</span> Phone
              </button>
              <button className="input-field py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2">
                <span className="text-lg">👨‍👩‍👧</span> Family
              </button>
            </div>
          </div>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create Account →
            </Link>
          </p>

          <p className="text-center text-slate-600 mt-8 text-xs">
            🔒 HIPAA Compliant • Your data stays private
          </p>
        </div>
      </div>
    </div>
  );
}
