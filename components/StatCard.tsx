
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-zinc-600 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-400 sm:text-sm">{label}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
          <Icon size={19} strokeWidth={1.8} className="text-accent" />
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-[11px] text-zinc-500 sm:text-xs">
        {note}
      </p>
    </article>
  );
}
