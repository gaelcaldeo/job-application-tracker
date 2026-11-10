
"use client";
import {
  BriefcaseBusiness,
  CalendarCheck,
  Clock,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import StatCard from "@/components/StatCard";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationTable from "@/components/ApplicationTable";
import ApplicationModal from "@/components/ApplicationModal";

import type { Application } from "@/types/application";

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const FIELD =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-accent focus:ring-2 focus:ring-accent/20";

const LABEL = "mb-2 block text-sm font-medium text-zinc-300";

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Home() {
  const router = useRouter();
  const savingRef = useRef(false);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [databaseError, setDatabaseError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [cvVersion, setCvVersion] = useState("");
  const [status, setStatus] = useState("Applied");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");

  // Load applications from Supabase
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
      company: row.company ?? "",
      role: row.job_title ?? "",
      jobLink: row.job_link ?? "",
      cvVersion: row.cv_version ?? "",
      date: row.date_applied ?? "",
      status: row.status ?? "Applied",
      employmentType: row.employment_type ?? "",
      salary: row.salary_range ?? "",
      notes: row.interview_notes ?? "",
    }));

    setApplications(records);
    setLoadingApplications(false);
  }, []);

  // Authentication
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
      if (!session) router.replace("/login");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, loadApplications]);

  // Close modal with Escape and prevent background scrolling
  useEffect(() => {
    if (!showForm) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        resetForm();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showForm, saving]);

  // Dashboard statistics
  const stats = useMemo(
  () => [
    {
      label: "Total Applications",
      value: applications.length,
      note: "All saved applications",
      icon: BriefcaseBusiness,
    },
    {
      label: "Interviews",
      value: applications.filter((app) => app.status === "Interview").length,
      note: "Interview stage",
      icon: CalendarCheck,
    },
    {
      label: "Awaiting Response",
      value: applications.filter((app) =>
        ["Applied", "Under Review"].includes(app.status)
      ).length,
      note: "Pending updates",
      icon: Clock,
    },
    {
      label: "Offers",
      value: applications.filter((app) => app.status === "Offer").length,
      note: "Offers received",
      icon: Trophy,
    },
  ],
  [applications]
);

  // Reset form
  function resetForm() {
    setCompany("");
    setRole("");
    setJobLink("");
    setCvVersion("");
    setStatus("Applied");
    setEmploymentType("Full-Time");
    setSalary("");
    setNotes("");
    setEditingId(null);
    setShowForm(false);
  }

  // Open new application modal
  function openNewApplication() {
    setDatabaseError("");
    setEditingId(null);
    setCompany("");
    setRole("");
    setJobLink("");
    setCvVersion("");
    setStatus("Applied");
    setEmploymentType("Full-Time");
    setSalary("");
    setNotes("");
    setShowForm(true);
  }

  // Open edit modal
  function startEditing(app: Application) {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    setJobLink(app.jobLink);
    setCvVersion(app.cvVersion);
    setStatus(app.status);
    setEmploymentType(app.employmentType || "Full-Time");
    setSalary(app.salary);
    setNotes(app.notes);
    setDatabaseError("");
    setShowForm(true);
  }

  // Search and filters
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        app.company.toLowerCase().includes(search) ||
        app.role.toLowerCase().includes(search) ||
        app.notes.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      const matchesEmployment =
        employmentFilter === "All" ||
        app.employmentType === employmentFilter;

      return matchesSearch && matchesStatus && matchesEmployment;
    });
  }, [applications, searchTerm, statusFilter, employmentFilter]);

  // Save application
  async function handleSaveApplication(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setDatabaseError("");

    if (!company.trim() || !role.trim()) {
      setDatabaseError("Company and job title are required.");
      return;
    }

    if (savingRef.current) return;

    savingRef.current = true;
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
        employment_type: employmentType,
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

        const updated: Application = {
          id: data.id,
          company: data.company,
          role: data.job_title,
          jobLink: data.job_link ?? "",
          cvVersion: data.cv_version ?? "",
          date: data.date_applied,
          status: data.status,
          employmentType: data.employment_type ?? "",
          salary: data.salary_range ?? "",
          notes: data.interview_notes ?? "",
        };

        setApplications((current) =>
          current.map((app) => (app.id === editingId ? updated : app))
        );
      } else {
        const { data, error } = await supabase
          .from("applications")
          .insert({
            ...applicationData,
            user_id: userData.user.id,
            date_applied: getLocalDateString(),
          })
          .select()
          .single();

        if (error) throw error;

        const saved: Application = {
          id: data.id,
          company: data.company,
          role: data.job_title,
          jobLink: data.job_link ?? "",
          cvVersion: data.cv_version ?? "",
          date: data.date_applied,
          status: data.status,
          employmentType: data.employment_type ?? "",
          salary: data.salary_range ?? "",
          notes: data.interview_notes ?? "",
        };

        setApplications((current) => [saved, ...current]);
      }

      resetForm();
    } catch (error) {
      setDatabaseError(
        error instanceof Error
          ? error.message
          : "Unable to save the application. Please try again."
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  // Delete application
  async function handleDeleteApplication(app: Application) {
    if (
      !window.confirm(
        `Delete the application for ${app.company} — ${app.role}?\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

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

      if (editingId === app.id) resetForm();
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

  // Logout
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
      <main className="flex min-h-screen items-center justify-center bg-background text-zinc-400">
        <p className="text-sm">Checking your session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Desktop Sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Main Content */}
        <section
          id="dashboard"
          className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-9 lg:py-9"
        >
          {/* Header */}
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Workspace / Overview</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Dashboard
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Track your progress and manage your job applications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openNewApplication}
                className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                + Add Application
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 md:hidden"
              >
                Log Out
              </button>
            </div>
          </header>

          {/* Error Message */}
          {databaseError && !showForm && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300"
            >
              {databaseError}
            </div>
          )}

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                note={stat.note}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* Applications */}
          <section
            id="applications"
            className="scroll-mt-6 overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h3 className="text-lg font-semibold">Applications</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Manage and review your job opportunities.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadApplications()}
                disabled={loadingApplications}
                className="self-start rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
              >
                ↻ Refresh
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 gap-4 border-b border-border bg-zinc-900/40 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="application-search" className={LABEL}>
                  Search
                </label>
                <input
                  id="application-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Company, role, notes..."
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor="status-filter" className={LABEL}>
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={FIELD}
                >
                  <option value="All">All statuses</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="employment-filter" className={LABEL}>
                  Employment Type
                </label>
                <select
                  id="employment-filter"
                  value={employmentFilter}
                  onChange={(e) => setEmploymentFilter(e.target.value)}
                  className={FIELD}
                >
                  <option value="All">All employment types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loadingApplications ? (
              <p className="p-10 text-center text-sm text-zinc-400">
                Loading your applications...
              </p>
            ) : filteredApplications.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-xl text-zinc-400">
                  ▤
                </div>
                <p className="mt-4 font-medium text-white">
                  {applications.length === 0
                    ? "Your tracker is ready for its first application"
                    : "No matching applications"}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {applications.length === 0
                    ? "Add your first application to get started."
                    : "Try another search term or filter."}
                </p>
                {applications.length === 0 && (
                  <button
                    type="button"
                    onClick={openNewApplication}
                    className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                  >
                    + Add Application
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile Application Cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {filteredApplications.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onEdit={startEditing}
                      onDelete={handleDeleteApplication}
                      isDeleting={deletingId === app.id}
                    />
                  ))}
                </div>

                {/* Desktop Table */}
                <ApplicationTable
                  applications={filteredApplications}
                  onEdit={startEditing}
                  onDelete={handleDeleteApplication}
                  deletingId={deletingId}
                />

                <div className="border-t border-border px-5 py-4 text-xs text-zinc-500">
                  Showing {filteredApplications.length} of {applications.length} applications
                </div>
              </>
            )}
          </section>

          <footer className="py-8 text-center text-xs text-zinc-600">
            GAEL · Your job search, organized.
          </footer>
        </section>
      </div>

      {/* Add / Edit Application Modal */}
      {showForm && (
        <ApplicationModal
          editingId={editingId}
          saving={saving}
          databaseError={databaseError}
          company={company}
          setCompany={setCompany}
          role={role}
          setRole={setRole}
          jobLink={jobLink}
          setJobLink={setJobLink}
          cvVersion={cvVersion}
          setCvVersion={setCvVersion}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          status={status}
          setStatus={setStatus}
          salary={salary}
          setSalary={setSalary}
          notes={notes}
          setNotes={setNotes}
          statusOptions={STATUS_OPTIONS}
          onClose={resetForm}
          onSubmit={handleSaveApplication}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNavigation onAddApplication={openNewApplication} />
    </main>
  );
}
