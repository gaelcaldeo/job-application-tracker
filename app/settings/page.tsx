"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setEmail(data.user.email ?? "");
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading settings...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GAEL<span className="text-accent">.</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2 text-sm text-zinc-300 transition hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
          >
            Back to Dashboard
          </Link>
        </header>

        {/* Page Heading */}
        <section className="mb-8">
          <p className="mb-2 text-sm text-muted">Account</p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage your account and preferences.
          </p>
        </section>

        {/* Account Information */}
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-medium">Account information</h2>

            <p className="mt-1 text-sm text-muted">
              Your signed-in account details.
            </p>
          </div>

          <div className="px-6 py-6">
            <label className="mb-2 block text-sm text-muted">
              Email address
            </label>

            <div className="rounded-lg border border-border bg-zinc-900 px-4 py-3 text-sm text-white">
              {email}
            </div>

            <p className="mt-2 text-xs text-muted">
              Your email is managed through your authentication provider.
            </p>
          </div>
        </section>

        {/* Session */}
        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-medium">Session</h2>

            <p className="mt-1 text-sm text-muted">
              Sign out of your GAEL account on this device.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="text-sm font-medium">Log out</p>

              <p className="mt-1 text-xs text-muted">
                You can sign in again anytime.
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-zinc-600">
          GAEL · Your job search, organized.
        </footer>
      </div>
    </main>
  );
}