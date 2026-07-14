"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Loader2, CheckCircle, XCircle, Trash2,
    ImageIcon, ExternalLink, Users, Clock, ThumbsUp, ThumbsDown,
    X, Phone, Mail, Hash, BookOpen, Layers, Facebook,
    Star, Search, Filter, Eye, Calendar, LayoutGrid, Download
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import SemesterTabs, { getSemesterFromDate, getSemestersFromItems } from "@/components/dashboard/SemesterTabs";

const currentSemester = getSemesterFromDate(new Date());

/* ─── Status & Role helpers ───────────────────── */
const STATUS_META = {
    Pending:  { bg: "bg-amber-50",   text: "text-amber-600",  border: "border-amber-200",  dot: "bg-amber-400" },
    Accepted: { bg: "bg-emerald-50", text: "text-emerald-600",border: "border-emerald-200",dot: "bg-emerald-500" },
    Rejected: { bg: "bg-rose-50",    text: "text-rose-600",   border: "border-rose-200",   dot: "bg-rose-500"  },
};
const ROLE_META = {
    "Batch Ambassador": { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-100" },
    "Junior Executive": { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-100"    },
    "Sub Executive":    { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-100" },
};

function StatusBadge({ status }) {
    const m = STATUS_META[status] || STATUS_META.Pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${m.bg} ${m.text} ${m.border}`}>
            <span className={`w-2 h-2 rounded-full ${m.dot}`} />
            {status}
        </span>
    );
}

/* ─── Detail Modal ────────────────────────────── */
function ApplicationModal({ app, onClose, onAccept, onReject, onDelete }) {
    if (!app) return null;

    const isBA = app.role === "Batch Ambassador";
    const teamPrefs = isBA
        ? app.convinceStrategy
        : app.teamPreferences?.filter(t => t?.trim()).map((t, i) => `${i + 1}. ${t}`).join(", ");
    const skills = isBA ? app.motivation : app.skillHelp;
    const rm = ROLE_META[app.role] || ROLE_META["Batch Ambassador"];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="bg-white sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Photo Header */}
                <div className="relative">
                    {app.imageUrl ? (
                        <img src={app.imageUrl} alt={app.name} className="w-full h-44 sm:h-56 object-cover sm:rounded-t-[2rem]" />
                    ) : (
                        <div className="w-full h-44 sm:h-56 bg-gradient-to-br from-indigo-100 via-sky-50 to-violet-100 sm:rounded-t-[2rem] flex items-center justify-center">
                            <span className="text-5xl sm:text-6xl font-black text-indigo-300 select-none">{app.name?.[0]}</span>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur hover:bg-red-50 text-slate-500 hover:text-red-600 p-2.5 rounded-full shadow-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 sm:px-6 pb-4 sm:pb-5 pt-12">
                        <h2 className="text-white text-xl sm:text-2xl font-black">{app.name}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <StatusBadge status={app.status} />
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${rm.bg} ${rm.text} ${rm.border}`}>{app.role}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* Identity grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {[
                            { icon: Mail,     label: "Email",      val: app.email },
                            { icon: Phone,    label: "Phone",      val: app.phone },
                            { icon: Hash,     label: "Student ID", val: app.studentId },
                            { icon: BookOpen, label: "Dept / Sem", val: `${app.department} · ${app.semester}` },
                            { icon: Layers,   label: "Section",    val: app.section || "—" },
                            { icon: Star,     label: "Other Club", val: app.isOtherClubExecutive || app.isOtherClubAmbassador || "No" },
                        ].map(({ icon: Icon, label, val }) => (
                            <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-slate-100">
                                <div className="w-8 h-8 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                    <Icon className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 break-all leading-snug mt-0.5">{val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Facebook */}
                    <a href={app.fbLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl px-4 py-3 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors group">
                        <Facebook className="w-4 h-4 shrink-0" />
                        Facebook Profile
                        <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 shrink-0" />
                    </a>

                    {/* Text blocks */}
                    {[
                        { icon: Layers,   label: "Team Preferences", val: teamPrefs || "N/A" },
                        { icon: Star,     label: "Skills & Help",     val: skills || "N/A" },
                        { icon: BookOpen, label: "Experience",        val: app.experience || "No experience mentioned." },
                    ].map(({ icon: Icon, label, val }) => (
                        <div key={label} className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50 p-3.5 sm:p-4">
                            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                <Icon className="w-3.5 h-3.5" /> {label}
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed">{val}</p>
                        </div>
                    ))}

                    {/* Actions */}
                    <div className="flex gap-2.5 sm:gap-3 pt-2 pb-2 sm:pb-0">
                        {app.status !== "Accepted" && (
                            <button onClick={() => { onAccept(app._id); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-emerald-100">
                                <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                        )}
                        {app.status !== "Rejected" && (
                            <button onClick={() => { onReject(app._id); onClose(); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-amber-100">
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                        )}
                        <button onClick={() => { onDelete(app._id); onClose(); }}
                            className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 sm:py-3.5 px-4 rounded-xl transition-colors text-sm border border-rose-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Page ─────────────────────────────────────── */
export default function ApplicationsAdmin() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [filterRole, setFilterRole]     = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch]             = useState("");
    const [selected, setSelected]         = useState(null);
    const [semesterFilter, setSemesterFilter] = useState(currentSemester);
    const router = useRouter();

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/admin/applications');
            if (res.status === 401) { router.push('/admin/login'); return; }
            const data = await res.json();
            setApplications(data.applications || []);
            setLoading(false);
        } catch {
            toast.error("Failed to load applications");
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) { toast.success(`Marked as ${status}`); fetchApplications(); }
            else toast.error("Failed to update status");
        } catch { toast.error("Error updating status"); }
    };

    const deleteApplication = async (id) => {
        if (!confirm("Delete this application?")) return;
        try {
            const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
            if (res.ok) { toast.success("Application deleted"); fetchApplications(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    // Derive available semesters from application data
    const availableSemesters = getSemestersFromItems(applications);

    // Pre-filter by role and semester for counts
    const roleSemesterFiltered = applications.filter(app => {
        const roleMatch = filterRole === "All" || app.role === filterRole;
        const semesterMatch = semesterFilter === "all" || getSemesterFromDate(app.createdAt) === semesterFilter;
        return roleMatch && semesterMatch;
    });

    const counts = {
        All:      roleSemesterFiltered.length,
        Pending:  roleSemesterFiltered.filter(a => a.status === "Pending").length,
        Accepted: roleSemesterFiltered.filter(a => a.status === "Accepted").length,
        Rejected: roleSemesterFiltered.filter(a => a.status === "Rejected").length,
    };

    // Count applications per semester
    const semesterCounts = {
        'all': roleSemesterFiltered.length,
        ...availableSemesters.reduce((acc, sem) => {
            acc[sem] = roleSemesterFiltered.filter(a => getSemesterFromDate(a.createdAt) === sem).length;
            return acc;
        }, {})
    };

    const filtered = roleSemesterFiltered.filter(app => {
        const statusMatch = filterStatus === "All" || app.status === filterStatus;
        const q = search.toLowerCase();
        const searchMatch = !q
            || app.name.toLowerCase().includes(q)
            || app.email.toLowerCase().includes(q)
            || app.studentId.toLowerCase().includes(q)
            || app.department.toLowerCase().includes(q);
        return statusMatch && searchMatch;
    });

    const handleExport = () => {
        if (filtered.length === 0) {
            toast.error("No data to export");
            return;
        }

        const exportData = filtered.map(app => {
            const isBatchAmbassador = app.role === "Batch Ambassador";
            const teamPrefs = isBatchAmbassador
                ? app.convinceStrategy || "—"
                : app.teamPreferences?.filter(t => t?.trim()).map((t, i) => `${i + 1}. ${t}`).join("\n") || "—";
            const skills = isBatchAmbassador
                ? app.motivation || "—"
                : app.skillHelp || "—";

            return {
                "Name": app.name,
                "Role": app.role,
                "Semester": app.semester,
                "Department": app.department,
                "Lab Group": app.section || "—",
                "Student ID": app.studentId,
                "Email": app.email,
                "Phone Number": app.phone,
                "Skills / Motivation": skills,
                "Team Preferences / Strategy": teamPrefs,
                "Experience": app.experience || "—",
                "Status": app.status,
                "Image Link": app.imageUrl || "No Image"
            };
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Add clickable hyperlinks to the 'Image Link' column (Column M = index 12)
        for (let i = 0; i < filtered.length; i++) {
            const cellAddress = `M${i + 2}`;
            const cell = ws[cellAddress];
            if (cell && cell.v !== "No Image") {
                cell.l = { Target: cell.v, Tooltip: "Click to open image" };
            }
        }
        
        // Professional spacing
        ws['!cols'] = [
            { wch: 28 }, // Name
            { wch: 18 }, // Role
            { wch: 12 }, // Semester
            { wch: 30 }, // Department
            { wch: 12 }, // Lab Group
            { wch: 20 }, // Student ID
            { wch: 32 }, // Email
            { wch: 18 }, // Phone Number
            { wch: 45 }, // Skills / Motivation
            { wch: 40 }, // Team Preferences / Strategy
            { wch: 45 }, // Experience
            { wch: 12 }, // Status
            { wch: 55 }  // Image Link
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Applications");
        XLSX.writeFile(wb, `Applications_${semesterFilter}_${Date.now()}.xlsx`);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 animate-pulse">
                <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Loading Applications…</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
            <Toaster position="top-right" />

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <ApplicationModal
                        key="app-modal"
                        app={selected}
                        onClose={() => setSelected(null)}
                        onAccept={id => updateStatus(id, "Accepted")}
                        onReject={id => updateStatus(id, "Rejected")}
                        onDelete={deleteApplication}
                    />
                )}
            </AnimatePresence>

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
                <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow shadow-indigo-200">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Application Management</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 tracking-widest">
                            {applications.length} Total
                        </span>
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl font-bold transition-all text-sm shadow-md active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Excel</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="w-full px-2 md:px-4 xl:px-8 py-10 space-y-7">

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total",    count: counts.All,      icon: Users,      palette: "bg-indigo-50  text-indigo-600  border-indigo-100"  },
                        { label: "Pending",  count: counts.Pending,  icon: Clock,      palette: "bg-amber-50   text-amber-600   border-amber-100"   },
                        { label: "Accepted", count: counts.Accepted, icon: ThumbsUp,   palette: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                        { label: "Rejected", count: counts.Rejected, icon: ThumbsDown, palette: "bg-rose-50    text-rose-600    border-rose-100"    },
                    ].map(({ label, count, icon: Icon, palette }, i) => (
                        <motion.div key={label}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 p-5 flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${palette}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                                <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{count}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Semester Tabs ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                Filter by Semester
                            </h2>
                            <p className="text-slate-500 font-medium text-xs">Select a semester to view its applications.</p>
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 tracking-widest">
                            {filtered.length} Shown
                        </span>
                    </div>
                    <SemesterTabs
                        semesters={availableSemesters}
                        activeTab={semesterFilter}
                        onTabChange={setSemesterFilter}
                        counts={semesterCounts}
                    />
                </section>

                {/* ── Search + Filters ── */}
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, email, student ID, or department…"
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all"
                        />
                    </div>
                    {/* Status */}
                    <div className="flex gap-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm self-start">
                        {["All","Pending","Accepted","Rejected"].map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${filterStatus === s ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                {s} <span className="opacity-60 text-[10px]">{counts[s] ?? counts.All}</span>
                            </button>
                        ))}
                    </div>
                    {/* Role */}
                    <div className="flex gap-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm self-start flex-wrap">
                        {["All","Batch Ambassador","Junior Executive","Sub Executive"].map(r => {
                            const roleCount = r === "All" ? applications.length : applications.filter(a => a.role === r).length;
                            return (
                                <button key={r} onClick={() => setFilterRole(r)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filterRole === r ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
                                    {r === "All" ? "All Roles" : r} <span className="opacity-60 text-[10px]">{roleCount}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 -mt-2">
                    <Filter className="w-3.5 h-3.5" />
                    Showing <span className="text-slate-700 mx-1">{filtered.length}</span> of {applications.length} applications
                    {filterRole !== "All" && <span className="text-indigo-600">({filterRole})</span>}
                </p>

                {/* ── Table ── */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
                                <Users className="w-9 h-9 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold text-lg">No applications in {semesterFilter === 'all' ? 'any semester' : semesterFilter}</p>
                            <p className="text-slate-400 text-sm">Applications will appear here once submitted for this semester.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1800px]">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        {["Photo","Name","Email","Phone","Student ID","Role","Department","Semester","Section","Team Preferences","Skills","Experience","Other Club","FB","Status","Actions"].map(h => (
                                            <th key={h} className="px-4 py-5 text-xs font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence>
                                        {filtered.map((app, i) => {
                                            const rm = ROLE_META[app.role] || ROLE_META["Batch Ambassador"];
                                            const isBA = app.role === "Batch Ambassador";
                                            const teamPrefs = isBA
                                                ? app.convinceStrategy
                                                : app.teamPreferences?.filter(t => t?.trim()).map((t, idx) => `${idx + 1}. ${t}`).join(", ");
                                            const skills = isBA ? app.motivation : app.skillHelp;
                                            return (
                                                <motion.tr
                                                    key={app._id}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="hover:bg-indigo-50/30 transition-colors group"
                                                >
                                                    {/* Photo */}
                                                    <td className="px-4 py-4">
                                                        {app.imageUrl ? (
                                                            <button onClick={() => setSelected(app)} className="block">
                                                                <img
                                                                    src={app.imageUrl} alt={app.name}
                                                                    className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-white shadow-md flex items-center justify-center text-xl font-black text-indigo-400">
                                                                {app.name?.[0]}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Name */}
                                                    <td className="px-4 py-4">
                                                        <p className="font-black text-slate-900 text-sm leading-tight">{app.name}</p>
                                                    </td>

                                                    {/* Email */}
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm text-slate-600 break-all">{app.email}</p>
                                                    </td>

                                                    {/* Phone */}
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm text-slate-600">{app.phone}</p>
                                                    </td>

                                                    {/* Student ID */}
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm font-bold text-indigo-600">#{app.studentId}</p>
                                                    </td>

                                                    {/* Role */}
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${rm.bg} ${rm.text} ${rm.border}`}>
                                                            {app.role}
                                                        </span>
                                                    </td>

                                                    {/* Department */}
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm font-bold text-slate-700">{app.department}</p>
                                                    </td>

                                                    {/* Semester */}
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm text-slate-600">{app.semester}</p>
                                                    </td>

                                                    {/* Section */}
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm text-slate-600">{app.section || "—"}</p>
                                                    </td>

                                                    {/* Team Preferences */}
                                                    <td className="px-4 py-4 max-w-[260px]">
                                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3" title={teamPrefs}>{teamPrefs || "—"}</p>
                                                    </td>

                                                    {/* Skills */}
                                                    <td className="px-4 py-4 max-w-[260px]">
                                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3" title={skills}>{skills || "—"}</p>
                                                    </td>

                                                    {/* Experience */}
                                                    <td className="px-4 py-4 max-w-[260px]">
                                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3" title={app.experience}>{app.experience || "—"}</p>
                                                    </td>

                                                    {/* Other Club */}
                                                    <td className="px-4 py-4">
                                                        <span className={`text-sm font-bold ${app.isOtherClubExecutive === "Yes" || app.isOtherClubAmbassador === "Yes" ? "text-rose-500" : "text-emerald-500"}`}>
                                                            {app.isOtherClubExecutive || app.isOtherClubAmbassador || "No"}
                                                        </span>
                                                    </td>

                                                    {/* FB Link */}
                                                    <td className="px-4 py-4">
                                                        <a href={app.fbLink} target="_blank" rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors">
                                                            <Facebook className="w-3.5 h-3.5" /> FB
                                                        </a>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-4">
                                                        <StatusBadge status={app.status} />
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <button onClick={() => setSelected(app)}
                                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors" title="View Details">
                                                                <Eye className="w-5 h-5" />
                                                            </button>
                                                            {app.status !== "Accepted" && (
                                                                <button onClick={() => updateStatus(app._id, "Accepted")}
                                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Accept">
                                                                    <CheckCircle className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                            {app.status !== "Rejected" && (
                                                                <button onClick={() => updateStatus(app._id, "Rejected")}
                                                                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors" title="Reject">
                                                                    <XCircle className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteApplication(app._id)}
                                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Delete">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── Application Overview ── */}
                <section className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-indigo-600" />
                        Application Overview
                    </h2>

                    {/* Role Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["Batch Ambassador", "Junior Executive", "Sub Executive"].map(role => {
                            const roleApps = applications.filter(a => a.role === role);
                            const accepted = roleApps.filter(a => a.status === "Accepted").length;
                            const pending = roleApps.filter(a => a.status === "Pending").length;
                            const rejected = roleApps.filter(a => a.status === "Rejected").length;
                            const total = roleApps.length;
                            const rm = ROLE_META[role];
                            return (
                                <motion.div key={role}
                                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white rounded-2xl border ${rm.border} shadow-md p-5 space-y-3`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${rm.bg} ${rm.text} ${rm.border}`}>
                                            {role}
                                        </span>
                                        <span className="text-2xl font-black text-slate-900">{total}</span>
                                    </div>
                                    <div className="flex gap-3 text-xs font-bold">
                                        <span className="text-emerald-600">✓ {accepted} Accepted</span>
                                        <span className="text-amber-500">◷ {pending} Pending</span>
                                        <span className="text-rose-500">✗ {rejected} Rejected</span>
                                    </div>
                                    {total > 0 && (
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                            {accepted > 0 && <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${(accepted / total) * 100}%` }} />}
                                            {pending > 0 && <div className="h-full bg-amber-400" style={{ width: `${(pending / total) * 100}%` }} />}
                                            {rejected > 0 && <div className="h-full bg-rose-400 rounded-r-full" style={{ width: `${(rejected / total) * 100}%` }} />}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Department Breakdown */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">By Department</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {(() => {
                                const deptMap = {};
                                filtered.forEach(app => {
                                    if (!deptMap[app.department]) deptMap[app.department] = { total: 0, accepted: 0, pending: 0, rejected: 0 };
                                    deptMap[app.department].total++;
                                    deptMap[app.department][app.status.toLowerCase()]++;
                                });
                                return Object.entries(deptMap).sort((a, b) => b[1].total - a[1].total).map(([dept, counts]) => (
                                    <div key={dept} className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-1.5">
                                        <p className="text-sm font-black text-slate-800">{dept}</p>
                                        <p className="text-xs text-slate-500">{counts.total} total</p>
                                        <div className="flex gap-2 text-[10px] font-bold">
                                            <span className="text-emerald-600">{counts.accepted}</span>
                                            <span className="text-amber-500">{counts.pending}</span>
                                            <span className="text-rose-500">{counts.rejected}</span>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Semester Breakdown */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">By Semester</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {(() => {
                                const semMap = {};
                                filtered.forEach(app => {
                                    const sem = app.semester || "Unknown";
                                    if (!semMap[sem]) semMap[sem] = { total: 0, accepted: 0, pending: 0, rejected: 0 };
                                    semMap[sem].total++;
                                    semMap[sem][app.status.toLowerCase()]++;
                                });
                                return Object.entries(semMap).sort((a, b) => b[1].total - a[1].total).map(([sem, counts]) => (
                                    <div key={sem} className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-1.5">
                                        <p className="text-sm font-black text-slate-800">{sem}</p>
                                        <p className="text-xs text-slate-500">{counts.total} total</p>
                                        <div className="flex gap-2 text-[10px] font-bold">
                                            <span className="text-emerald-600">{counts.accepted}</span>
                                            <span className="text-amber-500">{counts.pending}</span>
                                            <span className="text-rose-500">{counts.rejected}</span>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Skills & Team Preferences Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Top Team Preferences */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Most Chosen Teams</h3>
                            <div className="space-y-2.5">
                                {(() => {
                                    const teamCount = {};
                                    const teams = ["Event Management", "Logistics", "Research & Development", "Public Relationship", "Content Writing", "Graphics", "Web Development"];
                                    teams.forEach(t => teamCount[t] = 0);
                                    filtered.forEach(app => {
                                        const prefs = app.teamPreferences || [];
                                        prefs.forEach(p => { if (teamCount[p] !== undefined) teamCount[p]++; });
                                    });
                                    const sorted = Object.entries(teamCount).sort((a, b) => b[1] - a[1]);
                                    const max = sorted[0]?.[1] || 1;
                                    return sorted.map(([team, count]) => (
                                        <div key={team} className="flex items-center gap-3">
                                            <p className="text-xs font-bold text-slate-700 w-40 truncate" title={team}>{team}</p>
                                            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                                            </div>
                                            <span className="text-xs font-black text-slate-600 w-8 text-right">{count}</span>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>

                        {/* Top Skills Keywords */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Common Skills Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    const keywords = {};
                                    const stopWords = new Set(["i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "a", "an", "the", "and", "or", "but", "if", "in", "on", "at", "to", "for", "of", "with", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "out", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "that", "this", "these", "those", "which", "what", "who", "whom", "while", "about", "up", "also", "help", "will", "like", "know", "learn", "new", "things", "think", "make", "good", "well", "much", "many", "able"]);
                                    filtered.forEach(app => {
                                        const text = (app.skillHelp || app.motivation || "").toLowerCase();
                                        text.split(/[\s,.\-!?;:'"()]+/).forEach(w => {
                                            if (w.length > 3 && !stopWords.has(w)) keywords[w] = (keywords[w] || 0) + 1;
                                        });
                                    });
                                    return Object.entries(keywords).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([word, count]) => (
                                        <span key={word} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
                                            {word} <span className="text-[10px] text-indigo-400">×{count}</span>
                                        </span>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Other Club Participation */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Other Club Participation</h3>
                        <div className="flex gap-6">
                            {(() => {
                                const yes = filtered.filter(a => a.isOtherClubExecutive === "Yes" || a.isOtherClubAmbassador === "Yes").length;
                                const no = filtered.length - yes;
                                return (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                                                <span className="text-lg font-black text-rose-500">{yes}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500">In Other Club</p>
                                                <p className="text-sm font-black text-rose-600">{filtered.length ? ((yes / filtered.length) * 100).toFixed(1) : 0}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                                <span className="text-lg font-black text-emerald-500">{no}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500">Not in Other Club</p>
                                                <p className="text-sm font-black text-emerald-600">{filtered.length ? ((no / filtered.length) * 100).toFixed(1) : 0}%</p>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
