
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// type Application = {
//   id: string;
//   company: string;
//   role: string;
//   jobLink: string;
//   cvVersion: string;
//   date: string;
//   status: string;
//   employmentType: string;
//   salary: string;
//   notes: string;
// };

// const STATUS_OPTIONS = [
//   "Applied",
//   "Under Review",
//   "Interview",
//   "Offer",
//   "Rejected",
//   "Withdrawn",
// ];

// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     Applied: "bg-blue-50 text-blue-700",
//     Interview: "bg-purple-50 text-purple-700",
//     "Under Review": "bg-amber-50 text-amber-700",
//     Rejected: "bg-red-50 text-red-700",
//     Offer: "bg-emerald-50 text-emerald-700",
//     Withdrawn: "bg-slate-100 text-slate-600",
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
//         styles[status] ?? "bg-slate-100 text-slate-700"
//       }`}
//     >
//       {status}
//     </span>
//   );
// }

// export default function Home() {
//   const router = useRouter();

//   // Authentication state
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   // Application data
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loadingApplications, setLoadingApplications] = useState(true);
//   const [databaseError, setDatabaseError] = useState("");

//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [company, setCompany] = useState("");
//   const [role, setRole] = useState("");
//   const [jobLink, setJobLink] = useState("");
//   const [cvVersion, setCvVersion] = useState("");
//   const [status, setStatus] = useState("Applied");
//   const [salary, setSalary] = useState("");
//   const [employmentType, setEmploymentType] = useState("Full-Time");
//   const [notes, setNotes] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");


//   // Load only the applications accessible to the logged-in user.
//   const loadApplications = useCallback(async () => {
//     setLoadingApplications(true);
//     setDatabaseError("");

//     const { data, error } = await supabase
//       .from("applications")
//       .select("*")
//       .order("date_applied", { ascending: false });

//     if (error) {
//       setDatabaseError(error.message);
//       setLoadingApplications(false);
//       return;
//     }

//     const records: Application[] = (data ?? []).map((row) => ({
//       id: row.id,
//       company: row.company,
//       role: row.job_title,
//       jobLink: row.job_link ?? "",
//       cvVersion: row.cv_version ?? "",
//       date: row.date_applied,
//       status: row.status,
//       employmentType: row.employment_type ?? "",
//       salary: row.salary_range ?? "",
      
//       notes: row.interview_notes ?? "",
//     }));

//     setApplications(records);
//     setLoadingApplications(false);
//   }, []);

//   // Check authentication before showing the dashboard.
//   useEffect(() => {
//     let active = true;

//     async function checkSession() {
//       const { data, error } = await supabase.auth.getUser();

//       if (!active) return;

//       if (error || !data.user) {
//         router.replace("/login");
//         return;
//       }

//       setCheckingAuth(false);
//       await loadApplications();
//     }

//     void checkSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) {
//         router.replace("/login");
//       }
//     });

//     return () => {
//       active = false;
//       subscription.unsubscribe();
//     };
//   }, [router, loadApplications]);

//   // Calculate dashboard statistics from actual records.
//   const stats = [
//     {
//       label: "Total Applications",
//       value: applications.length,
//       icon: "↗",
//       note: "All applications",
//     },
//     {
//       label: "Interviews",
//       value: applications.filter((app) => app.status === "Interview").length,
//       icon: "◷",
//       note: "Interview stage",
//     },
//     {
//       label: "Awaiting Response",
//       value: applications.filter((app) =>
//         ["Applied", "Under Review"].includes(app.status)
//       ).length,
//       icon: "◉",
//       note: "Pending updates",
//     },
//     {
//       label: "Offers",
//       value: applications.filter((app) => app.status === "Offer").length,
//       icon: "✦",
//       note: "Offers received",
//     },
//   ];

//   // Save an application to Supabase.
  
// function resetForm() {
//   setCompany("");
//   setRole("");
//   setJobLink("");
//   setCvVersion("");
//   setStatus("Applied");
//   setSalary("");
//   setEmploymentType("Full-Time");
//   setNotes("");
//   setEditingId(null);
//   setShowForm(false);
// }

// function startEditing(app: Application) {
//   setEditingId(app.id);
//   setCompany(app.company);
//   setRole(app.role);
//   setJobLink(app.jobLink);
//   setCvVersion(app.cvVersion);
//   setStatus(app.status);
//   setSalary(app.salary);
//   setEmploymentType(app.employmentType || "Full-Time");
//   setNotes(app.notes);
//   setDatabaseError("");
//   setShowForm(true);

//   window.scrollTo({ top: 0, behavior: "smooth" });
// }

// const filteredApplications = applications.filter((app) => {
//   const search = searchTerm.trim().toLowerCase();

//   const matchesSearch =
//     app.company.toLowerCase().includes(search) ||
//     app.role.toLowerCase().includes(search);

//   const matchesStatus =
//     statusFilter === "All" || app.status === statusFilter;

//   return matchesSearch && matchesStatus;
// });

// async function handleSaveApplication(
//   event: React.FormEvent<HTMLFormElement>
// ) {
//   event.preventDefault();
//   setDatabaseError("");

//   if (!company.trim() || !role.trim()) {
//     setDatabaseError("Company and job title are required.");
//     return;
//   }

//   setSaving(true);

//   try {
//     const { data: userData, error: userError } =
//       await supabase.auth.getUser();

//     if (userError || !userData.user) {
//       router.replace("/login");
//       return;
//     }

//     const applicationData = {
//       company: company.trim(),
//       job_title: role.trim(),
//       job_link: jobLink.trim() || null,
//       cv_version: cvVersion.trim() || null,
//       salary_range: salary.trim() || null,
//       status,
//       employment_type: employmentType,
//       interview_notes: notes.trim() || null,
//     };

//     if (editingId) {
//       const { data, error } = await supabase
//         .from("applications")
//         .update(applicationData)
//         .eq("id", editingId)
//         .select()
//         .single();

//       if (error) throw error;

//       const updatedApplication: Application = {
//         id: data.id,
//         company: data.company,
//         role: data.job_title,
//         jobLink: data.job_link ?? "",
//         cvVersion: data.cv_version ?? "",
//         date: data.date_applied,
//         status: data.status,
//         employmentType: data.employment_type ?? "",
//         salary: data.salary_range ?? "",
//         notes: data.interview_notes ?? "",
//       };

//       setApplications((current) =>
//         current.map((app) =>
//           app.id === editingId ? updatedApplication : app
//         )
//       );
//     } else {
//       const { data, error } = await supabase
//         .from("applications")
//         .insert({
//           ...applicationData,
//           user_id: userData.user.id,
//           date_applied: new Date().toISOString().slice(0, 10),
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       const savedApplication: Application = {
//         id: data.id,
//         company: data.company,
//         role: data.job_title,
//         jobLink: data.job_link ?? "",
//         cvVersion: data.cv_version ?? "",
//         date: data.date_applied,
//         status: data.status,
//         employmentType: data.employment_type ?? "",
//         salary: data.salary_range ?? "",
//         notes: data.interview_notes ?? "",
//       };

//       setApplications((current) => [
//         savedApplication,
//         ...current,
//       ]);
//     }

//     resetForm();
//   } catch (error) {
//     setDatabaseError(
//       error instanceof Error
//         ? error.message
//         : "Unable to save the application. Please try again."
//     );
//   } finally {
//     setSaving(false);
//   }
// }

// async function handleDeleteApplication(app: Application) {
//   const confirmed = window.confirm(
//     `Delete the application for ${app.company} — ${app.role}?\n\nThis action cannot be undone.`
//   );

//   if (!confirmed) return;

//   setDeletingId(app.id);
//   setDatabaseError("");

//   try {
//     const { data, error } = await supabase
//       .from("applications")
//       .delete()
//       .eq("id", app.id)
//       .select("id");

//     if (error) throw error;

//     if (!data || data.length === 0) {
//       throw new Error(
//         "Application was not deleted. You may not have permission to delete it."
//       );
//     }

//     setApplications((current) =>
//       current.filter((item) => item.id !== app.id)
//     );

//     if (editingId === app.id) {
//       resetForm();
//     }
//   } catch (error) {
//     setDatabaseError(
//       error instanceof Error
//         ? error.message
//         : "Unable to delete the application. Please try again."
//     );
//   } finally {
//     setDeletingId(null);
//   }
// }


// async function handleLogout() {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     setDatabaseError(error.message);
//     return;
//   }

//   router.replace("/login");
// }

//   if (checkingAuth) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-50">
//         <p className="text-sm text-slate-500">
//           Checking your session...
//         </p>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="mx-auto flex min-h-screen max-w-[1440px]">
//         {/* Sidebar */}
//         <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-6 md:flex">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
//               J
//             </div>
//             <div>
//               <h1 className="text-lg font-bold tracking-tight">JobTrack</h1>
//               <p className="text-xs text-slate-500">
//                 Your career workspace
//               </p>
//             </div>
//           </div>

//           <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-slate-400">
//             Workspace
//           </p>

//           <nav className="space-y-2">
//             <a
//               href="#dashboard"
//               className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
//             >
//               <span>▦</span> Dashboard
//             </a>
//             <a
//               href="#applications"
//               className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
//             >
//               <span>▤</span> Applications
//             </a>
            
//           </nav>

//           <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
//             <p className="text-sm font-semibold">Stay on track</p>
//             <p className="mt-2 text-xs leading-5 text-slate-300">
//               Small steps today can lead to your next big opportunity.
//             </p>
//           </div>
//         </aside>

//         {/* Main content */}
//         <section id="dashboard" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
//           <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <p className="text-sm text-slate-500">
//                 Your personal workspace
//               </p>
//               <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
//                 Job Search Dashboard
//               </h2>
//               <p className="mt-2 text-sm text-slate-500">
//                 Keep your applications organized and your next move clear.
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowForm((current) => !current)}
//                 className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
//               >
//                 {showForm ? "Close Form" : "+ Add Application"}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100"
//               >
//                 Log Out
//               </button>
//             </div>
//           </header>

//           {/* Error message */}
//           {databaseError && (
//             <div
//               role="alert"
//               className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
//             >
//               {databaseError}
//             </div>
//           )}

//           {/* Add application form */}
//           {showForm && (
//             <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//               <div className="mb-5">
//                 <h3 className="text-lg font-bold">
//   {editingId ? "Edit Job Application" : "Add Job Application"}
// </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Record the details of a job you applied for.
//                 </p>
//               </div>

//               <form
//   onSubmit={handleSaveApplication}
//   className="grid grid-cols-1 gap-4 sm:grid-cols-2"
// >
//                 <div>
//                   <label htmlFor="company" className="mb-1 block text-sm font-medium">
//                     Company *
//                   </label>
//                   <input
//                     id="company"
//                     required
//                     value={company}
//                     onChange={(event) => setCompany(event.target.value)}
//                     placeholder="e.g. Accenture"
//                     className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="role" className="mb-1 block text-sm font-medium">
//                     Job Title *
//                   </label>
//                   <input
//                     id="role"
//                     required
//                     value={role}
//                     onChange={(event) => setRole(event.target.value)}
//                     placeholder="e.g. Healthcare Associate"
//                     className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="jobLink" className="mb-1 block text-sm font-medium">
//                     Job Link
//                   </label>
//                   <input
//                     id="jobLink"
//                     type="url"
//                     value={jobLink}
//                     onChange={(event) => setJobLink(event.target.value)}
//                     placeholder="https://..."
//                     className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="cvVersion" className="mb-1 block text-sm font-medium">
//                     CV Version
//                   </label>
//                   <input
//                     id="cvVersion"
//                     value={cvVersion}
//                     onChange={(event) => setCvVersion(event.target.value)}
//                     placeholder="e.g. Healthcare CV v1"
//                     className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="salary" className="mb-1 block text-sm font-medium">
//                     Salary Range
//                   </label>
//                   <input
//                     id="salary"
//                     value={salary}
//                     onChange={(event) => setSalary(event.target.value)}
//                     placeholder="e.g. ₱25,000–₱35,000"
//                     className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="status" className="mb-1 block text-sm font-medium">
//                     Status
//                   </label>
//                   <select
//                     id="status"
//                     value={status}
//                     onChange={(event) => setStatus(event.target.value)}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
//                   >
//                     {STATUS_OPTIONS.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

                
// <div>
//   <label
//     htmlFor="employmentType"
//     className="mb-1 block text-sm font-medium"
//   >
//     Employment Type
//   </label>
//   <select
//     id="employmentType"
//     value={employmentType}
//     onChange={(event) => setEmploymentType(event.target.value)}
//     className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
//   >
//     <option value="Full-Time">Full-Time</option>
//     <option value="Part-Time">Part-Time</option>
//   </select>
// </div>


//                 <div className="sm:col-span-2">
//                   <label htmlFor="notes" className="mb-1 block text-sm font-medium">
//                     Interview Notes
//                   </label>
//                   <textarea
//                     id="notes"
//                     value={notes}
//                     onChange={(event) => setNotes(event.target.value)}
//                     placeholder="Interview schedule, recruiter details, reminders..."
//                     rows={3}
//                     className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
//                   />
//                 </div>

//                 <div className="flex flex-wrap gap-3 sm:col-span-2">
//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {saving
//   ? "Saving..."
//   : editingId
//     ? "Save Changes"
//     : "Save Application"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-50"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </section>
//           )}

//           {/* Summary cards */}
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {stats.map((stat) => (
//               <article
//                 key={stat.label}
//                 className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
//               >
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-slate-500">{stat.label}</p>
//                   <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
//                     {stat.icon}
//                   </span>
//                 </div>
//                 <p className="mt-4 text-3xl font-bold">{stat.value}</p>
//                 <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
//               </article>
//             ))}
//           </div>

//           {/* Applications table */}
//           <section
//             id="applications"
//             className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
//           >
//             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
//               <div>
//                 <h3 className="font-bold">Your Applications</h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Applications saved to your account.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => void loadApplications()}
//                 disabled={loadingApplications}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
//               >
//                 Refresh
//               </button>
//             </div>

// <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row">
//   <div className="flex-1">
//     <label
//       htmlFor="application-search"
//       className="mb-1 block text-sm font-medium text-slate-700"
//     >
//       Search applications
//     </label>

//     <input
//       id="application-search"
//       type="search"
//       value={searchTerm}
//       onChange={(event) => setSearchTerm(event.target.value)}
//       placeholder="Search company or job title..."
//       className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//     />
//   </div>

//   <div className="sm:w-56">
//     <label
//       htmlFor="status-filter"
//       className="mb-1 block text-sm font-medium text-slate-700"
//     >
//       Filter by status
//     </label>

//     <select
//       id="status-filter"
//       value={statusFilter}
//       onChange={(event) => setStatusFilter(event.target.value)}
//       className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-indigo-500"
//     >
//       <option value="All">All statuses</option>

//       {STATUS_OPTIONS.map((option) => (
//         <option key={option} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   </div>
// </div>

//             {loadingApplications ? (
//               <p className="p-8 text-center text-sm text-slate-500">
//                 Loading applications...
//               </p>
//             ) : filteredApplications.length === 0 ? (
//               <p className="p-8 text-center text-sm text-slate-500">
//                 {applications.length === 0
//   ? "No applications yet. Click Add Application to get started."
//   : "No matching applications. Try a different search or filter."}
//               </p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[900px] text-left text-sm">
//                   <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                     <tr>
//                       <th className="px-5 py-4 font-semibold">Company / Role</th>
//                       <th className="px-5 py-4 font-semibold">Date Applied</th>
//                       <th className="px-5 py-4 font-semibold">CV Version</th>
//                       <th className="px-5 py-4 font-semibold">Salary</th>
//                       <th className="px-5 py-4 font-semibold">Status</th>
//                       <th className="px-5 py-4 font-semibold">Employment Type</th>
//                       <th className="px-5 py-4 font-semibold">Job Link / Notes</th>
//                       <th className="px-5 py-4 font-semibold">Actions</th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {filteredApplications.map((app) => (
//                       <tr key={app.id} className="transition hover:bg-slate-50">
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800">
//                             {app.company}
//                           </p>
//                           <p className="mt-1 text-xs text-slate-500">
//                             {app.role}
//                           </p>
//                         </td>

//                         <td className="whitespace-nowrap px-5 py-4 text-slate-600">
//                           {app.date}
//                         </td>

//                         <td className="px-5 py-4 text-slate-600">
//                           {app.cvVersion || "—"}
//                         </td>

//                         <td className="px-5 py-4 text-slate-600">
//                           {app.salary || "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           <StatusBadge status={app.status} />
//                         </td>

//                         <td className="whitespace-nowrap px-5 py-4 text-slate-600">
//                           {app.employmentType || "—"}
//                         </td>

//                         <td className="max-w-[220px] px-5 py-4">
//                           {app.jobLink ? (
//                             <a
//                               href={app.jobLink}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="block truncate text-indigo-600 hover:underline"
//                             >
//                               Open job posting
//                             </a>
//                           ) : (
//                             <span className="text-slate-400">No link</span>
//                           )}

//                           {app.notes && (
//                             <p className="mt-1 truncate text-xs text-slate-500">
//                               {app.notes}
//                             </p>
//                           )}
//                         </td>
                        
// <td className="px-5 py-4">
//   <div className="flex items-center gap-2">
//     <button
//       type="button"
//       onClick={() => startEditing(app)}
//       className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
//     >
//       Edit
//     </button>

//     <button
//       type="button"
//       onClick={() => void handleDeleteApplication(app)}
//       disabled={deletingId === app.id}
//       className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
//     >
//       {deletingId === app.id ? "Deleting..." : "Delete"}
//     </button>
//   </div>
// </td>

//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>

//           {/* Follow-up reminder */}
//           <section
//             id="follow-ups"
//             className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:p-6"
//           >
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-indigo-600">
//                 ◷
//               </div>
//               <div>
//                 <h3 className="font-semibold text-indigo-950">
//                   Your next step
//                 </h3>
//                 <p className="mt-1 text-sm leading-6 text-indigo-800">
//                   Follow up on applications when appropriate. Keep your interview
//                   notes and follow-up dates updated.
//                 </p>
//               </div>
//             </div>
//           </section>

//           <footer className="py-8 text-center text-xs text-slate-400">
//             JobTrack · Your next opportunity starts here.
//           </footer>
//         </section>
//       </div>
//     </main>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  employmentType: string;
  salary: string;
  notes: string;
};

const STATUS_OPTIONS = ["Applied", "Under Review", "Interview", "Offer", "Rejected", "Withdrawn"];
const FIELD = "w-full rounded-xl border border-violet-100 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100";
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Applied: "bg-sky-100 text-sky-700",
    "Under Review": "bg-amber-100 text-amber-700",
    Interview: "bg-violet-100 text-violet-700",
    Offer: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
    Withdrawn: "bg-slate-100 text-slate-600",
  };
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function EmploymentBadge({ type }: { type: string }) {
  const style = type === "Part-Time" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${style}`}>{type || "Not set"}</span>;
}

export default function Home() {
  const router = useRouter();
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

  const loadApplications = useCallback(async () => {
    setLoadingApplications(true);
    setDatabaseError("");
    const { data, error } = await supabase.from("applications").select("*").order("date_applied", { ascending: false });
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [router, loadApplications]);

  const stats = [
    { label: "Total Applications", value: applications.length, note: "All saved applications", icon: "▤", color: "bg-sky-100 text-sky-700" },
    { label: "Interviews", value: applications.filter((app) => app.status === "Interview").length, note: "Interview stage", icon: "✦", color: "bg-violet-100 text-violet-700" },
    { label: "Awaiting Response", value: applications.filter((app) => ["Applied", "Under Review"].includes(app.status)).length, note: "Pending updates", icon: "◷", color: "bg-amber-100 text-amber-700" },
    { label: "Offers", value: applications.filter((app) => app.status === "Offer").length, note: "Offers received", icon: "♡", color: "bg-emerald-100 text-emerald-700" },
  ];

  function resetForm() {
    setCompany(""); setRole(""); setJobLink(""); setCvVersion(""); setStatus("Applied");
    setEmploymentType("Full-Time"); setSalary(""); setNotes(""); setEditingId(null); setShowForm(false);
  }

  function startEditing(app: Application) {
    setEditingId(app.id); setCompany(app.company); setRole(app.role); setJobLink(app.jobLink);
    setCvVersion(app.cvVersion); setStatus(app.status); setEmploymentType(app.employmentType || "Full-Time");
    setSalary(app.salary); setNotes(app.notes); setDatabaseError(""); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredApplications = useMemo(() => applications.filter((app) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = app.company.toLowerCase().includes(search) || app.role.toLowerCase().includes(search) || app.notes.toLowerCase().includes(search);
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesEmployment = employmentFilter === "All" || app.employmentType === employmentFilter;
    return matchesSearch && matchesStatus && matchesEmployment;
  }), [applications, searchTerm, statusFilter, employmentFilter]);

  async function handleSaveApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setDatabaseError("");
    if (!company.trim() || !role.trim()) { setDatabaseError("Company and job title are required."); return; }
    setSaving(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) { router.replace("/login"); return; }
      const applicationData = {
        company: company.trim(), job_title: role.trim(), job_link: jobLink.trim() || null,
        cv_version: cvVersion.trim() || null, salary_range: salary.trim() || null,
        status, employment_type: employmentType, interview_notes: notes.trim() || null,
      };
      if (editingId) {
        const { data, error } = await supabase.from("applications").update(applicationData).eq("id", editingId).select().single();
        if (error) throw error;
        const updated: Application = { id: data.id, company: data.company, role: data.job_title, jobLink: data.job_link ?? "", cvVersion: data.cv_version ?? "", date: data.date_applied, status: data.status, employmentType: data.employment_type ?? "", salary: data.salary_range ?? "", notes: data.interview_notes ?? "" };
        setApplications((current) => current.map((app) => app.id === editingId ? updated : app));
      } else {
        const { data, error } = await supabase.from("applications").insert({ ...applicationData, user_id: userData.user.id, date_applied: new Date().toISOString().slice(0, 10) }).select().single();
        if (error) throw error;
        const saved: Application = { id: data.id, company: data.company, role: data.job_title, jobLink: data.job_link ?? "", cvVersion: data.cv_version ?? "", date: data.date_applied, status: data.status, employmentType: data.employment_type ?? "", salary: data.salary_range ?? "", notes: data.interview_notes ?? "" };
        setApplications((current) => [saved, ...current]);
      }
      resetForm();
    } catch (error) {
      setDatabaseError(error instanceof Error ? error.message : "Unable to save the application. Please try again.");
    } finally { setSaving(false); }
  }

  async function handleDeleteApplication(app: Application) {
    if (!window.confirm(`Delete the application for ${app.company} — ${app.role}?\n\nThis action cannot be undone.`)) return;
    setDeletingId(app.id); setDatabaseError("");
    try {
      const { data, error } = await supabase.from("applications").delete().eq("id", app.id).select("id");
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Application was not deleted. You may not have permission to delete it.");
      setApplications((current) => current.filter((item) => item.id !== app.id));
      if (editingId === app.id) resetForm();
    } catch (error) {
      setDatabaseError(error instanceof Error ? error.message : "Unable to delete the application. Please try again.");
    } finally { setDeletingId(null); }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) { setDatabaseError(error.message); return; }
    router.replace("/login");
  }

  if (checkingAuth) return <main className="flex min-h-screen items-center justify-center bg-[#faf8ff]"><p className="text-sm text-violet-500">Checking your session...</p></main>;

  return (
    <main className="min-h-screen bg-[#faf8ff] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-violet-100 bg-[#f2edff] p-6 md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 text-xl font-bold text-white shadow-md shadow-violet-200">J</div>
            <div><h1 className="text-lg font-bold tracking-tight text-slate-900">JobTrack</h1><p className="text-xs text-slate-500">Track. Apply. Grow.</p></div>
          </div>
          <p className="mb-3 mt-10 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">Workspace</p>
          <nav className="space-y-2">
            <a href="#dashboard" className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-700 shadow-sm ring-1 ring-violet-100"><span>⌂</span> Dashboard</a>
            <a href="#applications" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white/80"><span>▤</span> Applications</a>
          </nav>
          <div className="mt-auto rounded-2xl border border-violet-100 bg-white/80 p-4"><p className="text-sm font-semibold text-slate-800">One step at a time ✨</p><p className="mt-2 text-xs leading-5 text-slate-500">Keep your job search organized and celebrate every bit of progress.</p></div>
          <button type="button" onClick={handleLogout} className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-white hover:text-violet-700">↪ Log Out</button>
        </aside>

        <section id="dashboard" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-medium text-violet-500">Your personal workspace</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Job Search Dashboard <span aria-hidden="true">✦</span></h2><p className="mt-2 text-sm text-slate-500">Keep your applications organized and your next move clear.</p></div>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { if (showForm) resetForm(); else { setEditingId(null); setShowForm(true); } }} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700">{showForm ? "Close Form" : "+ Add Application"}</button><button type="button" onClick={handleLogout} className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 md:hidden">Log Out</button></div>
          </header>

          {databaseError && <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{databaseError}</div>}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => <article key={stat.label} className="rounded-2xl border border-violet-100/80 bg-white p-5 shadow-sm shadow-violet-100/50 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p></div><span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${stat.color}`}>{stat.icon}</span></div><p className="mt-3 text-xs text-slate-400">{stat.note}</p></article>)}
          </div>

          {showForm && <section className="mb-8 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm shadow-violet-100/60 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4"><div><span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{editingId ? "UPDATE DETAILS" : "NEW OPPORTUNITY"}</span><h3 className="mt-3 text-xl font-bold text-slate-900">{editingId ? "Edit Job Application" : "Add Job Application"}</h3><p className="mt-1 text-sm text-slate-500">Keep all your application details in one place.</p></div><button type="button" onClick={resetForm} aria-label="Close form" className="rounded-xl px-3 py-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-700">✕</button></div>
            <form onSubmit={handleSaveApplication} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div><label htmlFor="company" className={LABEL}>Company <span className="text-rose-500">*</span></label><input id="company" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Accenture" className={FIELD} /></div>
              <div><label htmlFor="role" className={LABEL}>Job Title <span className="text-rose-500">*</span></label><input id="role" required value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Healthcare Associate" className={FIELD} /></div>
              <div><label htmlFor="jobLink" className={LABEL}>Job Link</label><input id="jobLink" type="url" value={jobLink} onChange={(e) => setJobLink(e.target.value)} placeholder="https://..." className={FIELD} /></div>
              <div><label htmlFor="cvVersion" className={LABEL}>CV Version</label><input id="cvVersion" value={cvVersion} onChange={(e) => setCvVersion(e.target.value)} placeholder="e.g. Healthcare CV v1" className={FIELD} /></div>
              <div><label htmlFor="employmentType" className={LABEL}>Employment Type <span className="text-rose-500">*</span></label><select id="employmentType" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={FIELD}><option value="Full-Time">Full-Time</option><option value="Part-Time">Part-Time</option></select></div>
              <div><label htmlFor="status" className={LABEL}>Status</label><select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
              <div><label htmlFor="salary" className={LABEL}>Salary Range</label><input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. ₱25,000–₱35,000" className={FIELD} /></div>
              <div className="sm:col-span-2 lg:col-span-2"><label htmlFor="notes" className={LABEL}>Notes</label><textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Recruiter details, interview notes, or other important information..." rows={3} className={`${FIELD} resize-y`} /></div>
              <div className="flex flex-wrap items-end gap-3 sm:col-span-2 lg:col-span-3"><button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : editingId ? "Save Changes" : "Save Application"}</button><button type="button" onClick={resetForm} className="rounded-xl border border-violet-100 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-violet-50">Cancel</button></div>
            </form>
          </section>}

          <section id="applications" className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm shadow-violet-100/60">
            <div className="flex flex-col gap-4 border-b border-violet-50 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="text-lg font-bold text-slate-900">Your Applications</h3><p className="mt-1 text-sm text-slate-500">All the opportunities you are tracking.</p></div><button type="button" onClick={() => void loadApplications()} disabled={loadingApplications} className="self-start rounded-xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50">↻ Refresh</button></div>
            <div className="grid grid-cols-1 gap-4 border-b border-violet-50 bg-[#fdfcff] p-5 sm:grid-cols-2 lg:grid-cols-3">
              <div><label htmlFor="application-search" className={LABEL}>Search applications</label><input id="application-search" type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search company, role, notes..." className={FIELD} /></div>
              <div><label htmlFor="status-filter" className={LABEL}>Filter by status</label><select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={FIELD}><option value="All">All statuses</option>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
              <div><label htmlFor="employment-filter" className={LABEL}>Employment type</label><select id="employment-filter" value={employmentFilter} onChange={(e) => setEmploymentFilter(e.target.value)} className={FIELD}><option value="All">All employment types</option><option value="Full-Time">Full-Time</option><option value="Part-Time">Part-Time</option></select></div>
            </div>
            {loadingApplications ? <p className="p-10 text-center text-sm text-slate-500">Loading your applications...</p> : filteredApplications.length === 0 ? <div className="p-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-600">▤</div><p className="mt-4 font-semibold text-slate-800">{applications.length === 0 ? "Your tracker is ready for its first application" : "No matching applications"}</p><p className="mt-1 text-sm text-slate-500">{applications.length === 0 ? "Click Add Application to get started." : "Try another search term or filter."}</p></div> : <>
              <div className="space-y-3 p-4 md:hidden">{filteredApplications.map((app) => <article key={app.id} className="rounded-2xl border border-violet-100 bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h4 className="break-words font-semibold text-slate-900">{app.company}</h4><p className="mt-1 break-words text-sm text-slate-500">{app.role}</p></div><StatusBadge status={app.status} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-400">Employment</p><div className="mt-1"><EmploymentBadge type={app.employmentType} /></div></div><div><p className="text-xs text-slate-400">Date applied</p><p className="mt-1 text-slate-700">{app.date || "—"}</p></div><div><p className="text-xs text-slate-400">CV version</p><p className="mt-1 break-words text-slate-700">{app.cvVersion || "—"}</p></div><div><p className="text-xs text-slate-400">Salary range</p><p className="mt-1 break-words text-slate-700">{app.salary || "—"}</p></div></div>{app.notes && <p className="mt-3 line-clamp-2 text-sm text-slate-500">{app.notes}</p>}<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-violet-50 pt-3">{app.jobLink && <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="mr-auto text-sm font-semibold text-violet-700 hover:underline">Open job posting ↗</a>}<button type="button" onClick={() => startEditing(app)} className="rounded-lg border border-violet-100 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50">Edit</button><button type="button" onClick={() => void handleDeleteApplication(app)} disabled={deletingId === app.id} className="rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">{deletingId === app.id ? "Deleting..." : "Delete"}</button></div></article>)}</div>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[950px] text-left text-sm"><thead className="bg-[#f8f5ff] text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4 font-semibold">Company / Role</th><th className="px-5 py-4 font-semibold">Date Applied</th><th className="px-5 py-4 font-semibold">CV Version</th><th className="px-5 py-4 font-semibold">Salary</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Employment Type</th><th className="px-5 py-4 font-semibold">Job Link / Notes</th><th className="px-5 py-4 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-violet-50">{filteredApplications.map((app) => <tr key={app.id} className="transition hover:bg-[#fdfbff]"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{app.company}</p><p className="mt-1 text-xs text-slate-500">{app.role}</p></td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{app.date || "—"}</td><td className="px-5 py-4 text-slate-600">{app.cvVersion || "—"}</td><td className="px-5 py-4 text-slate-600">{app.salary || "—"}</td><td className="px-5 py-4"><StatusBadge status={app.status} /></td><td className="px-5 py-4"><EmploymentBadge type={app.employmentType} /></td><td className="max-w-[220px] px-5 py-4">{app.jobLink ? <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="block truncate font-medium text-violet-700 hover:underline">Open job posting ↗</a> : <span className="text-slate-400">No link</span>}{app.notes && <p className="mt-1 truncate text-xs text-slate-500">{app.notes}</p>}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => startEditing(app)} className="rounded-lg border border-violet-100 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50">Edit</button><button type="button" onClick={() => void handleDeleteApplication(app)} disabled={deletingId === app.id} className="rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50">{deletingId === app.id ? "Deleting..." : "Delete"}</button></div></td></tr>)}</tbody></table></div>
              <div className="border-t border-violet-50 px-5 py-4 text-xs text-slate-400">Showing {filteredApplications.length} of {applications.length} applications</div>
            </>}
          </section>
          <footer className="py-8 text-center text-xs text-slate-400">JobTrack · Your next opportunity starts here ✦</footer>
        </section>
      </div>
    </main>
  );
}
