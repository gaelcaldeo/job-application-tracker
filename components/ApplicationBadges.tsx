
type StatusBadgeProps = {
  status: string;
};

type EmploymentBadgeProps = {
  type: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    Applied: "border-blue-900 bg-blue-950/50 text-blue-300",
    "Under Review": "border-amber-900 bg-amber-950/50 text-amber-300",
    Interview: "border-violet-900 bg-violet-950/50 text-violet-300",
    Offer: "border-emerald-900 bg-emerald-950/50 text-emerald-300",
    Rejected: "border-red-900 bg-red-950/50 text-red-300",
    Withdrawn: "border-zinc-700 bg-zinc-800 text-zinc-400",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] || "border-zinc-700 bg-zinc-800 text-zinc-300"
      }`}
    >
      {status}
    </span>
  );
}

export function EmploymentBadge({ type }: EmploymentBadgeProps) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
      {type || "Not set"}
    </span>
  );
}
