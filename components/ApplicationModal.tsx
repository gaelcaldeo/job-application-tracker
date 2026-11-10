
import type { FormEvent } from "react";
import {
  X,
  Save,
  LoaderCircle,
  BriefcaseBusiness,
} from "lucide-react";

type ApplicationModalProps = {
  editingId: string | null;
  saving: boolean;
  databaseError: string;

  company: string;
  setCompany: (value: string) => void;

  role: string;
  setRole: (value: string) => void;

  jobLink: string;
  setJobLink: (value: string) => void;

  cvVersion: string;
  setCvVersion: (value: string) => void;

  employmentType: string;
  setEmploymentType: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  salary: string;
  setSalary: (value: string) => void;

  notes: string;
  setNotes: (value: string) => void;

  statusOptions: string[];

  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const FIELD =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 hover:border-zinc-600 focus:border-accent focus:ring-2 focus:ring-accent/20";

const LABEL = "mb-2 block text-sm font-medium text-zinc-300";

export default function ApplicationModal({
  editingId,
  saving,
  databaseError,
  company,
  setCompany,
  role,
  setRole,
  jobLink,
  setJobLink,
  cvVersion,
  setCvVersion,
  employmentType,
  setEmploymentType,
  status,
  setStatus,
  salary,
  setSalary,
  notes,
  setNotes,
  statusOptions,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-modal-title"
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-zinc-700 bg-surface shadow-2xl sm:rounded-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border p-5 sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <BriefcaseBusiness size={14} />
              {editingId ? "Update application" : "New opportunity"}
            </div>

            <h3
              id="application-modal-title"
              className="mt-2 text-xl font-semibold text-white"
            >
              {editingId ? "Edit Application" : "Add Application"}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              Enter the details of your job application.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-accent/10 hover:text-accent disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="overflow-y-auto p-5 sm:p-6">
          {databaseError && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300"
            >
              {databaseError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className={LABEL}>
                Company *
              </label>
              <input
                id="company"
                required
                autoFocus
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Accenture"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="role" className={LABEL}>
                Job Title *
              </label>
              <input
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Developer"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="jobLink" className={LABEL}>
                Job Link
              </label>
              <input
                id="jobLink"
                type="url"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                placeholder="https://..."
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="cvVersion" className={LABEL}>
                CV Version
              </label>
              <input
                id="cvVersion"
                value={cvVersion}
                onChange={(e) => setCvVersion(e.target.value)}
                placeholder="e.g. Healthcare CV"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="employmentType" className={LABEL}>
                Employment Type *
              </label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className={FIELD}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className={LABEL}>
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={FIELD}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="salary" className={LABEL}>
                Salary Range
              </label>
              <input
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₱25,000–₱35,000"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="notes" className={LABEL}>
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Recruiter details, interview notes, or other information..."
                rows={3}
                className={`${FIELD} resize-y`}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingId ? "Save Changes" : "Save Application"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
