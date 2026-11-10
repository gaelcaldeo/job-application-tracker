
"use client";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Settings,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

type SidebarProps = {
  onLogout: () => void;
};

export default function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface p-6 md:flex">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-lg font-bold text-violet-300">
          G
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-[0.12em]">GAEL</h1>
          <p className="text-[11px] text-zinc-500">
            Job Application Tracker
          </p>
        </div>
      </div>

      {/* Navigation Label */}
      <p className="mb-3 mt-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Workspace
      </p>

      {/* Navigation */}
      <nav className="space-y-1.5">
        <a
          href="#dashboard"
          className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm font-medium text-accent transition"
        >
          <LayoutDashboard size={18} strokeWidth={1.8} />
          Dashboard
        </a>

        <a
          href="#applications"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
        >
          <BriefcaseBusiness size={18} strokeWidth={1.8} />
          Applications
        </a>

        <a
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
        >
          <Settings size={18} strokeWidth={1.8} />
          Settings
        </a>
      </nav>

      {/* Encouragement Card */}
      <div className="mt-auto rounded-xl border border-border bg-zinc-900/70 p-4">
        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <ArrowUpRight size={17} strokeWidth={1.8} />
        </div>

        <p className="text-sm font-semibold text-white">
          Keep moving forward.
        </p>

        <p className="mt-2 text-xs leading-5 text-zinc-500">
          Every application is another step toward your next opportunity.
        </p>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut size={18} strokeWidth={1.8} />
        Log Out
      </button>
    </aside>
  );
}
