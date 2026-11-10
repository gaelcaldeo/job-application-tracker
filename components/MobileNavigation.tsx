
"use client";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
  Settings,
} from "lucide-react";

type MobileNavigationProps = {
  onAddApplication: () => void;
};

export default function MobileNavigation({
  onAddApplication,
}: MobileNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {/* Dashboard */}
        <a
          href="#dashboard"
          className="flex flex-col items-center gap-1 rounded-xl bg-accent/10 px-2 py-2 text-accent"
        >
          <LayoutDashboard size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </a>

        {/* Applications */}
        <a
          href="#applications"
          className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
        >
          <BriefcaseBusiness size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Applications</span>
        </a>

        {/* Add New */}
        <button
          type="button"
          onClick={onAddApplication}
          className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
        >
          <Plus size={21} strokeWidth={2} />
          <span className="text-[10px] font-medium">Add New</span>
        </button>

        {/* Settings */}
        <a
          href="/settings"
          className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-zinc-400 transition hover:bg-accent/10 hover:text-accent"
        >
          <Settings size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Settings</span>
        </a>
      </div>
    </nav>
  );
}
