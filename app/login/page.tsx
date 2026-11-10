
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.replace("/");
          router.refresh();
        } else {
          setMessage(
            "Your account has been created. Please check your email to verify your address."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Left Branding Panel */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border bg-[#111114] p-12 lg:flex xl:p-16">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-violet-500/10 blur-[100px]" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-lg font-bold text-violet-300">
              G
            </div>
            <span className="text-xl font-bold tracking-[0.18em]">
              GAEL
            </span>
          </div>
        </div>

        {/* Main Message */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            YOUR CAREER WORKSPACE
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Make your next
            <br />
            career move
            <br />
            <span className="text-violet-400">with clarity.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
            Keep every application organized, follow your progress, and stay
            focused on the opportunities ahead.
          </p>

          {/* Feature List */}
          <div className="mt-12 space-y-5">
            {[
              ["01", "One place for every application"],
              ["02", "Track your application progress"],
              ["03", "Stay organized throughout your search"],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-4">
                <span className="font-mono text-xs text-violet-400">
                  {number}
                </span>
                <span className="text-sm text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-zinc-600">
          © 2026 GAEL. Built for your next opportunity.
        </div>
      </section>

      {/* Right Login Panel */}
      <section className="flex min-h-screen w-full items-center justify-center px-5 py-12 sm:px-10 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          {/* Mobile Branding */}
          <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-lg font-bold text-violet-300">
              G
            </div>
            <span className="text-xl font-bold tracking-[0.18em]">
              GAEL
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-violet-400">
              {isSignup ? "GET STARTED" : "WELCOME BACK"}
            </p>

            <h2 className="text-3xl font-semibold tracking-tight">
              {isSignup ? "Create your account" : "Sign in to GAEL"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {isSignup
                ? "Create an account to start organizing your job search."
                : "Sign in to continue managing your job applications."}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.85 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium tracking-wider text-zinc-500">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-border bg-[#111114] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border bg-[#111114] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />

              {isSignup && (
                <p className="mt-2 text-xs text-zinc-500">
                  Use at least 6 characters.
                </p>
              )}
            </div>

            {/* Feedback */}
            {message && (
              <div
                role="status"
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-zinc-300"
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/10 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          {/* Signup / Login Toggle */}
          <p className="mt-8 text-center text-sm text-zinc-400">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="font-semibold text-violet-400 transition hover:text-violet-300"
            >
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </p>

          <p className="mt-12 text-center text-xs text-zinc-600">
            GAEL · Your career workspace.
          </p>
        </div>
      </section>
    </main>
  );
}
