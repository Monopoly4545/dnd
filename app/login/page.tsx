"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Swords, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim()) {
      setLocalError("Email is required.");
      return;
    }

    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    const success = await login({ email, password });

    if (success) {
      router.push("/characters");
    }
  };

  const displayError = localError || error;

  return (
    <main className="min-h-screen bg-[#0b0908] px-6 py-20 text-stone-100">
      <div className="mx-auto max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <Swords className="h-6 w-6 text-amber-400" />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold">Welcome Back</h1>

          <p className="mt-3 text-stone-500">
            Sign in to access your character vault.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {displayError && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {displayError}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-stone-300"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stone-800 bg-[#12100f] py-3 pl-11 pr-4 text-sm text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-stone-300"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-stone-800 bg-[#12100f] py-3 pl-11 pr-11 text-sm text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-amber-500/50"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 transition hover:text-stone-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-sm text-stone-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-amber-400 transition hover:text-amber-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
