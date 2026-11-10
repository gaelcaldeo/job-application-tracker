
import {
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Application } from "@/types/application";
import {
  StatusBadge,
  EmploymentBadge,
} from "@/components/ApplicationBadges";

type ApplicationTableProps = {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  deletingId: string | null;
};

export default function ApplicationTable({
  applications,
  onEdit,
  onDelete,
  deletingId,
}: ApplicationTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[950px] text-left text-sm">
        <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-5 py-4 font-medium">Company / Role</th>
            <th className="px-5 py-4 font-medium">Date Applied</th>
            <th className="px-5 py-4 font-medium">CV Version</th>
            <th className="px-5 py-4 font-medium">Salary</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 font-medium">Employment</th>
            <th className="px-5 py-4 font-medium">Job Link / Notes</th>
            <th className="px-5 py-4 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="transition-colors hover:bg-zinc-900/70"
            >
              <td className="px-5 py-4">
                <p className="font-medium text-white">{app.company}</p>
                <p className="mt-1 text-xs text-zinc-500">{app.role}</p>
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-zinc-400">
                {app.date || "—"}
              </td>

              <td className="px-5 py-4 text-zinc-400">
                {app.cvVersion || "—"}
              </td>

              <td className="px-5 py-4 text-zinc-400">
                {app.salary || "—"}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={app.status} />
              </td>

              <td className="px-5 py-4">
                <EmploymentBadge type={app.employmentType} />
              </td>

              <td className="max-w-[220px] px-5 py-4">
                {app.jobLink ? (
                  <a
                    href={app.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1.5 truncate text-zinc-200 transition hover:text-accent"
                  >
                    <span className="truncate">Open job posting</span>
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                ) : (
                  <span className="text-zinc-600">No link</span>
                )}

                {app.notes && (
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {app.notes}
                  </p>
                )}
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(app)}
                    aria-label={`Edit ${app.company} application`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(app)}
                    disabled={deletingId === app.id}
                    aria-label={`Delete ${app.company} application`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {deletingId === app.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
