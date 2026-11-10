
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

type ApplicationCardProps = {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  isDeleting: boolean;
};

export default function ApplicationCard({
  app,
  onEdit,
  onDelete,
  isDeleting,
}: ApplicationCardProps) {
  return (
    <article className="rounded-xl border border-border bg-zinc-900/50 p-4 transition-colors hover:border-zinc-600">
      {/* Company and Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="break-words font-semibold text-white">
            {app.company}
          </h4>

          <p className="mt-1 break-words text-sm text-zinc-400">
            {app.role}
          </p>
        </div>

        <StatusBadge status={app.status} />
      </div>

      {/* Application Details */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-zinc-500">Employment</p>
          <div className="mt-1">
            <EmploymentBadge type={app.employmentType} />
          </div>
        </div>

        <div>
          <p className="text-xs text-zinc-500">Date Applied</p>
          <p className="mt-1 text-zinc-300">
            {app.date || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">CV Version</p>
          <p className="mt-1 break-words text-zinc-300">
            {app.cvVersion || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500">Salary</p>
          <p className="mt-1 break-words text-zinc-300">
            {app.salary || "—"}
          </p>
        </div>
      </div>

      {/* Notes */}
      {app.notes && (
        <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
          {app.notes}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {app.jobLink && (
          <a
            href={app.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-auto inline-flex items-center gap-1.5 text-xs font-medium text-accent transition hover:text-accent-hover"
          >
            Open job posting
            <ExternalLink size={13} />
          </a>
        )}

        <button
          type="button"
          onClick={() => onEdit(app)}
          aria-label={`Edit ${app.company} application`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(app)}
          disabled={isDeleting}
          aria-label={`Delete ${app.company} application`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={14} />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
