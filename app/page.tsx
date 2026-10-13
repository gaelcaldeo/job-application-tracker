
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  company: string;
  role: string;
  jobLink: string;
  cvVersion: string;
  date: string;
  status: string;
  type: string;
  salary: string;
  followUpDate: string;
  notes: string;
};

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Applied: "bg-blue-50 text-blue-700",
    Interview: "bg-purple-50 text-purple-700",
    "Under Review": "bg-amber-50 text-amber-700",
    Rejected: "bg-red-50 text-red-700",
    Offer: "bg-emerald-50 text-emerald-700",
    Withdrawn: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function Home() {
  const router = useRouter();

  // Authentication state
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Application data
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [databaseError, setDatabaseError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [cvVersion, setCvVersion] = useState("");
  const [status, setStatus] = useState("Applied");
  const [salary, setSalary] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");


  // Load only the applications accessible to the logged-in user.
  const loadApplications = useCallback(async () => {
    setLoadingApplications(true);
    setDatabaseError("");

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("date_applied", { ascending: false });

    if (error) {
      setDatabaseError(error.message);
      setLoadingApplications(false);
      return;
    }

    const records: Application[] = (data ?? []).map((row) => ({
      id: row.id,
      company: row.company,
      role: row.job_title,
      jobLink: row.job_link ?? "",
      cvVersion: row.cv_version ?? "",
      date: row.date_applied,
      status: row.status,
      type: "Other",
      salary: row.salary_range ?? "",
      followUpDate: row.follow_up_date ?? "",
      notes: row.interview_notes ?? "",
    }));

    setApplications(records);
    setLoadingApplications(false);
  }, []);

  // Check authentication before showing the dashboard.
  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
      await loadApplications();
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, loadApplications]);

  // Calculate dashboard statistics from actual records.
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: "↗",
      note: "All applications",
    },
    {
      label: "Interviews",
      value: applications.filter((app) => app.status === "Interview").length,
      icon: "◷",
      note: "Interview stage",
    },
    {
      label: "Awaiting Response",
      value: applications.filter((app) =>
        ["Applied", "Under Review"].includes(app.status)
      ).length,
      icon: "◉",
      note: "Pending updates",
    },
    {
      label: "Offers",
      value: applications.filter((app) => app.status === "Offer").length,
      icon: "✦",
      note: "Offers received",
    },
  ];

  // Save an application to Supabase.
  
function resetForm() {
  setCompany("");
  setRole("");
  setJobLink("");
  setCvVersion("");
  setStatus("Applied");
  setSalary("");
  setFollowUpDate("");
  setNotes("");
  setEditingId(null);
  setShowForm(false);
}

function startEditing(app: Application) {
  setEditingId(app.id);
  setCompany(app.company);
  setRole(app.role);
  setJobLink(app.jobLink);
  setCvVersion(app.cvVersion);
  setStatus(app.status);
  setSalary(app.salary);
  setFollowUpDate(app.followUpDate);
  setNotes(app.notes);
  setDatabaseError("");
  setShowForm(true);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

const filteredApplications = applications.filter((app) => {
  const search = searchTerm.trim().toLowerCase();

  const matchesSearch =
    app.company.toLowerCase().includes(search) ||
    app.role.toLowerCase().includes(search);

  const matchesStatus =
    statusFilter === "All" || app.status === statusFilter;

  return matchesSearch && matchesStatus;
});

async function handleSaveApplication(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();
  setDatabaseError("");

  if (!company.trim() || !role.trim()) {
    setDatabaseError("Company and job title are required.");
    return;
  }

  setSaving(true);

  try {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      router.replace("/login");
      return;
    }

    const applicationData = {
      company: company.trim(),
      job_title: role.trim(),
      job_link: jobLink.trim() || null,
      cv_version: cvVersion.trim() || null,
      salary_range: salary.trim() || null,
      status,
      follow_up_date: followUpDate || null,
      interview_notes: notes.trim() || null,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from("applications")
        .update(applicationData)
        .eq("id", editingId)
        .select()
        .single();

      if (error) throw error;

      const updatedApplication: Application = {
        id: data.id,
        company: data.company,
        role: data.job_title,
        jobLink: data.job_link ?? "",
        cvVersion: data.cv_version ?? "",
        date: data.date_applied,
        status: data.status,
        type: "Other",
        salary: data.salary_range ?? "",
        followUpDate: data.follow_up_date ?? "",
        notes: data.interview_notes ?? "",
      };

      setApplications((current) =>
        current.map((app) =>
          app.id === editingId ? updatedApplication : app
        )
      );
    } else {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          ...applicationData,
          user_id: userData.user.id,
          date_applied: new Date().toISOString().slice(0, 10),
        })
        .select()
        .single();

      if (error) throw error;

      const savedApplication: Application = {
        id: data.id,
        company: data.company,
        role: data.job_title,
        jobLink: data.job_link ?? "",
        cvVersion: data.cv_version ?? "",
        date: data.date_applied,
        status: data.status,
        type: "Other",
        salary: data.salary_range ?? "",
        followUpDate: data.follow_up_date ?? "",
        notes: data.interview_notes ?? "",
      };

      setApplications((current) => [
        savedApplication,
        ...current,
      ]);
    }

    resetForm();
  } catch (error) {
    setDatabaseError(
      error instanceof Error
        ? error.message
        : "Unable to save the application. Please try again."
    );
  } finally {
    setSaving(false);
  }
}

async function handleDeleteApplication(app: Application) {
  const confirmed = window.confirm(
    `Delete the application for ${app.company} — ${app.role}?\n\nThis action cannot be undone.`
  );

  if (!confirmed) return;

  setDeletingId(app.id);
  setDatabaseError("");

  try {
    const { data, error } = await supabase
      .from("applications")
      .delete()
      .eq("id", app.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error(
        "Application was not deleted. You may not have permission to delete it."
      );
    }

    setApplications((current) =>
      current.filter((item) => item.id !== app.id)
    );

    if (editingId === app.id) {
      resetForm();
    }
  } catch (error) {
    setDatabaseError(
      error instanceof Error
        ? error.message
        : "Unable to delete the application. Please try again."
    );
  } finally {
    setDeletingId(null);
  }
}


async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    setDatabaseError(error.message);
    return;
  }

  router.replace("/login");
}

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Checking your session...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-6 md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              J
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">JobTrack</h1>
              <p className="text-xs text-slate-500">
                Your career workspace
              </p>
            </div>
          </div>

          <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            <a
              href="#dashboard"
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
            >
              <span>▦</span> Dashboard
            </a>
            <a
              href="#applications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <span>▤</span> Applications
            </a>
            <a
              href="#follow-ups"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <span>◷</span> Follow-ups
            </a>
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
            <p className="text-sm font-semibold">Stay on track</p>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              Small steps today can lead to your next big opportunity.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <section id="dashboard" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">
                Your personal workspace
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Job Search Dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep your applications organized and your next move clear.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowForm((current) => !current)}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                {showForm ? "Close Form" : "+ Add Application"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100"
              >
                Log Out
              </button>
            </div>
          </header>

          {/* Error message */}
          {databaseError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {databaseError}
            </div>
          )}

          {/* Add application form */}
          {showForm && (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-bold">
  {editingId ? "Edit Job Application" : "Add Job Application"}
</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Record the details of a job you applied for.
                </p>
              </div>

              <form
  onSubmit={handleSaveApplication}
  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
>
                <div>
                  <label htmlFor="company" className="mb-1 block text-sm font-medium">
                    Company *
                  </label>
                  <input
                    id="company"
                    required
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="e.g. Accenture"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="mb-1 block text-sm font-medium">
                    Job Title *
                  </label>
                  <input
                    id="role"
                    required
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="e.g. Healthcare Associate"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="jobLink" className="mb-1 block text-sm font-medium">
                    Job Link
                  </label>
                  <input
                    id="jobLink"
                    type="url"
                    value={jobLink}
                    onChange={(event) => setJobLink(event.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="cvVersion" className="mb-1 block text-sm font-medium">
                    CV Version
                  </label>
                  <input
                    id="cvVersion"
                    value={cvVersion}
                    onChange={(event) => setCvVersion(event.target.value)}
                    placeholder="e.g. Healthcare CV v1"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="salary" className="mb-1 block text-sm font-medium">
                    Salary Range
                  </label>
                  <input
                    id="salary"
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    placeholder="e.g. ₱25,000–₱35,000"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="mb-1 block text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="followUpDate" className="mb-1 block text-sm font-medium">
                    Follow-up Date
                  </label>
                  <input
                    id="followUpDate"
                    type="date"
                    value={followUpDate}
                    onChange={(event) => setFollowUpDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="mb-1 block text-sm font-medium">
                    Interview Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Interview schedule, recruiter details, reminders..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
  ? "Saving..."
  : editingId
    ? "Save Changes"
    : "Save Application"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                    {stat.icon}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
              </article>
            ))}
          </div>

          {/* Applications table */}
          <section
            id="applications"
            className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
              <div>
                <h3 className="font-bold">Your Applications</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Applications saved to your account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadApplications()}
                disabled={loadingApplications}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

<div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row">
  <div className="flex-1">
    <label
      htmlFor="application-search"
      className="mb-1 block text-sm font-medium text-slate-700"
    >
      Search applications
    </label>

    <input
      id="application-search"
      type="search"
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      placeholder="Search company or job title..."
      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    />
  </div>

  <div className="sm:w-56">
    <label
      htmlFor="status-filter"
      className="mb-1 block text-sm font-medium text-slate-700"
    >
      Filter by status
    </label>

    <select
      id="status-filter"
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500"
    >
      <option value="All">All statuses</option>

      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
</div>

            {loadingApplications ? (
              <p className="p-8 text-center text-sm text-slate-500">
                Loading applications...
              </p>
            ) : filteredApplications.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">
                {applications.length === 0
  ? "No applications yet. Click Add Application to get started."
  : "No matching applications. Try a different search or filter."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Company / Role</th>
                      <th className="px-5 py-4 font-semibold">Date Applied</th>
                      <th className="px-5 py-4 font-semibold">CV Version</th>
                      <th className="px-5 py-4 font-semibold">Salary</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Follow-up</th>
                      <th className="px-5 py-4 font-semibold">Job Link / Notes</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {app.company}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {app.role}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {app.date}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {app.cvVersion || "—"}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {app.salary || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={app.status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {app.followUpDate || "—"}
                        </td>

                        <td className="max-w-[220px] px-5 py-4">
                          {app.jobLink ? (
                            <a
                              href={app.jobLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate text-indigo-600 hover:underline"
                            >
                              Open job posting
                            </a>
                          ) : (
                            <span className="text-slate-400">No link</span>
                          )}

                          {app.notes && (
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {app.notes}
                            </p>
                          )}
                        </td>
                        
<td className="px-5 py-4">
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => startEditing(app)}
      className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => void handleDeleteApplication(app)}
      disabled={deletingId === app.id}
      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deletingId === app.id ? "Deleting..." : "Delete"}
    </button>
  </div>
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Follow-up reminder */}
          <section
            id="follow-ups"
            className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-indigo-600">
                ◷
              </div>
              <div>
                <h3 className="font-semibold text-indigo-950">
                  Your next step
                </h3>
                <p className="mt-1 text-sm leading-6 text-indigo-800">
                  Follow up on applications when appropriate. Keep your interview
                  notes and follow-up dates updated.
                </p>
              </div>
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-slate-400">
            JobTrack · Your next opportunity starts here.
          </footer>
        </section>
      </div>
    </main>
  );
}
