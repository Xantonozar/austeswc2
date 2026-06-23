"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Loader2, CheckCircle, XCircle, Trash2,
    ImageIcon, ExternalLink, Users, Clock, ThumbsUp, ThumbsDown,
    X, Phone, Mail, Hash, BookOpen, Layers, Facebook,
    MessageSquare, Star, Search, Filter, Eye, Calendar, LayoutGrid
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            {status}
        </span>
    );
}

/* ─── Detail Modal ────────────────────────────── */
function ApplicationModal({ app, onClose, onAccept, onReject, onDelete }) {
    if (!app) return null;
    return (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.93, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 24 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Photo Header */}
                    <div className="relative">
                        {app.imageUrl ? (
                            <img src={app.imageUrl} alt={app.name} className="w-full h-52 object-cover rounded-t-[2rem]" />
                        ) : (
                            <div className="w-full h-52 bg-gradient-to-br from-indigo-100 via-sky-50 to-violet-100 rounded-t-[2rem] flex items-center justify-center">
                                <span className="text-6xl font-black text-indigo-300 select-none">{app.name?.[0]}</span>
                            </div>
                        )}
                        <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 backdrop-blur hover:bg-red-50 text-slate-500 hover:text-red-600 p-2 rounded-full shadow-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-6 pb-5 pt-10 rounded-b-none">
                            <h2 className="text-white text-2xl font-black">{app.name}</h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <StatusBadge status={app.status} />
                                {(() => { const m = ROLE_META[app.role] || ROLE_META["Batch Ambassador"]; return (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>{app.role}</span>
                                ); })()}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Identity grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Mail,     label: "Email",      val: app.email },
                                { icon: Phone,    label: "Phone",      val: app.phone },
                                { icon: Hash,     label: "Student ID", val: app.studentId },
                                { icon: BookOpen, label: "Dept / Sem", val: `${app.department} · ${app.semester}` },
                                { icon: Layers,   label: "Section",    val: app.section || "—" },
                                { icon: Star,     label: "Other Club", val: app.isOtherClubAmbassador },
                            ].map(({ icon: Icon, label, val }) => (
                                <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
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
                            className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors group">
                            <Facebook className="w-4 h-4" />
                            Facebook Profile
                            <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100" />
                        </a>

                        {/* Text blocks */}
                        {[
                            { icon: MessageSquare, label: "Motivation",        val: app.motivation },
                            { icon: Star,          label: "Convince Strategy", val: app.convinceStrategy },
                            { icon: BookOpen,      label: "Experience",        val: app.experience || "No experience mentioned." },
                        ].map(({ icon: Icon, label, val }) => (
                            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                    <Icon className="w-3.5 h-3.5" /> {label}
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed">{val}</p>
                            </div>
                        ))}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            {app.status !== "Accepted" && (
                                <button onClick={() => { onAccept(app._id); onClose(); }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-emerald-100">
                                    <CheckCircle className="w-4 h-4" /> Accept
                                </button>
                            )}
                            {app.status !== "Rejected" && (
                                <button onClick={() => { onReject(app._id); onClose(); }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-amber-100">
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            )}
                            <button onClick={() => { onDelete(app._id); onClose(); }}
                                className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 px-4 rounded-xl transition-colors text-sm border border-rose-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
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

    const counts = {
        All:      applications.length,
        Pending:  applications.filter(a => a.status === "Pending").length,
        Accepted: applications.filter(a => a.status === "Accepted").length,
        Rejected: applications.filter(a => a.status === "Rejected").length,
    };

    // Derive available semesters from application data
    const availableSemesters = getSemestersFromItems(applications);

    // Count applications per semester
    const semesterCounts = {
        'all': applications.length,
        ...availableSemesters.reduce((acc, sem) => {
            acc[sem] = applications.filter(a => getSemesterFromDate(a.createdAt) === sem).length;
            return acc;
        }, {})
    };

    const filtered = applications.filter(app => {
        const roleMatch   = filterRole   === "All" || app.role   === filterRole;
        const statusMatch = filterStatus === "All" || app.status === filterStatus;
        const q = search.toLowerCase();
        const searchMatch = !q
            || app.name.toLowerCase().includes(q)
            || app.email.toLowerCase().includes(q)
            || app.studentId.toLowerCase().includes(q)
            || app.department.toLowerCase().includes(q);
        const semesterMatch = semesterFilter === "all" || getSemesterFromDate(app.createdAt) === semesterFilter;
        return roleMatch && statusMatch && searchMatch && semesterMatch;
    });

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
            {selected && (
                <ApplicationModal
                    app={selected}
                    onClose={() => setSelected(null)}
                    onAccept={id => updateStatus(id, "Accepted")}
                    onReject={id => updateStatus(id, "Rejected")}
                    onDelete={deleteApplication}
                />
            )}

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow shadow-indigo-200">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Application Management</h1>
                    </div>
                    <span className="hidden sm:block text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 tracking-widest">
                        {applications.length} Total
                    </span>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-2 md:px-4 xl:px-8 py-10 space-y-7">

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
                        {["All","Batch Ambassador","Junior Executive","Sub Executive"].map(r => (
                            <button key={r} onClick={() => setFilterRole(r)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filterRole === r ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
                                {r === "All" ? "All Roles" : r}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 -mt-2">
                    <Filter className="w-3.5 h-3.5" />
                    Showing <span className="text-slate-700 mx-1">{filtered.length}</span> of {applications.length} applications
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
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        {["Photo","Applicant","Role & Dept","Motivation / Strategy","Experience & Links","Status","Actions"].map(h => (
                                            <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <AnimatePresence>
                                        {filtered.map((app, i) => {
                                            const rm = ROLE_META[app.role] || ROLE_META["Batch Ambassador"];
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
                                                    <td className="px-5 py-4">
                                                        {app.imageUrl ? (
                                                            <button onClick={() => setSelected(app)} className="block">
                                                                <img
                                                                    src={app.imageUrl} alt={app.name}
                                                                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-white shadow-md flex items-center justify-center text-xl font-black text-indigo-400">
                                                                {app.name?.[0]}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Applicant */}
                                                    <td className="px-5 py-4">
                                                        <p className="font-black text-slate-900 text-sm leading-tight">{app.name}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Mail className="w-3 h-3"/>{app.email}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3"/>{app.phone}</p>
                                                        <p className="text-xs font-bold text-indigo-600 mt-1">#{app.studentId}</p>
                                                    </td>

                                                    {/* Role & Dept */}
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-1.5 ${rm.bg} ${rm.text} ${rm.border}`}>
                                                            {app.role}
                                                        </span>
                                                        <p className="text-xs font-bold text-slate-600">{app.department}</p>
                                                        <p className="text-xs text-slate-400">{app.semester} {app.section && `· ${app.section}`}</p>
                                                    </td>

                                                    {/* Motivation / Strategy */}
                                                    <td className="px-5 py-4 max-w-[220px]">
                                                        <div className="space-y-2 text-xs text-slate-600">
                                                            <div>
                                                                <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-0.5">Motivation</p>
                                                                <p className="line-clamp-2 leading-relaxed" title={app.motivation}>{app.motivation}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-0.5">Strategy</p>
                                                                <p className="line-clamp-2 leading-relaxed" title={app.convinceStrategy}>{app.convinceStrategy}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Experience & Links */}
                                                    <td className="px-5 py-4 max-w-[180px]">
                                                        <div className="text-xs text-slate-600 space-y-2">
                                                            <div>
                                                                <p className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-0.5">Experience</p>
                                                                <p className="line-clamp-2 leading-relaxed">{app.experience || "None"}</p>
                                                            </div>
                                                            <div className="flex flex-col gap-1 mt-1">
                                                                <p className="text-[10px] font-bold text-slate-400">Other Club: <span className={`font-black ${app.isOtherClubAmbassador === "Yes" ? "text-rose-500" : "text-emerald-500"}`}>{app.isOtherClubAmbassador}</span></p>
                                                                <a href={app.fbLink} target="_blank" rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-100 transition-colors w-fit">
                                                                    <Facebook className="w-3 h-3" /> FB Link
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-5 py-4">
                                                        <StatusBadge status={app.status} />
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1">
                                                            {/* View */}
                                                            <button onClick={() => setSelected(app)}
                                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors" title="View Details">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {app.status !== "Accepted" && (
                                                                <button onClick={() => updateStatus(app._id, "Accepted")}
                                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Accept">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {app.status !== "Rejected" && (
                                                                <button onClick={() => updateStatus(app._id, "Rejected")}
                                                                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors" title="Reject">
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteApplication(app._id)}
                                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Delete">
                                                                <Trash2 className="w-4 h-4" />
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

            </main>
        </div>
    );
}
