"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FileText, ChevronLeft, Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ApplicationsAdmin() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState("All");
    const router = useRouter();

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/admin/applications');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setApplications(data.applications || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load applications");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success(`Application marked as ${status}`);
                fetchApplications();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status");
        }
    };

    const deleteApplication = async (id) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("Application deleted");
                fetchApplications();
            } else {
                toast.error("Failed to delete application");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting application");
        }
    };

    const filteredApps = filterRole === "All" 
        ? applications 
        : applications.filter(app => app.role === filterRole);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <Toaster position="top-right" />

            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Application Management</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Total Applications: {applications.length}</h2>
                        <p className="text-slate-500 text-sm">Review applications for Batch Ambassador, Junior Exec, and Sub Exec roles.</p>
                    </div>

                    <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        {["All", "Batch Ambassador", "Junior Executive", "Sub Executive"].map(role => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterRole === role ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Applicant</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Role & Dept</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Motivation</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Experience</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredApps.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{app.name}</p>
                                            <p className="text-xs text-slate-500">{app.email}</p>
                                            <p className="text-xs text-slate-500">{app.phone}</p>
                                            <p className="text-xs font-medium mt-1 text-indigo-600">ID: {app.studentId}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100 mb-1">
                                                {app.role}
                                            </span>
                                            <p className="text-xs font-medium text-slate-600">{app.department} • {app.semester}</p>
                                        </td>
                                        <td className="px-6 py-4 max-w-[250px]">
                                            <div className="text-xs text-slate-600 space-y-2">
                                                <div>
                                                    <strong className="text-slate-800">Motivation:</strong>
                                                    <p className="line-clamp-2" title={app.motivation}>{app.motivation}</p>
                                                </div>
                                                <div>
                                                    <strong className="text-slate-800">Strategy:</strong>
                                                    <p className="line-clamp-2" title={app.convinceStrategy}>{app.convinceStrategy}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[250px]">
                                            <div className="text-xs text-slate-600 space-y-2">
                                                <div>
                                                    <strong className="text-slate-800">Experience:</strong>
                                                    <p className="line-clamp-2" title={app.experience}>{app.experience || "None"}</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <p><strong className="text-slate-800">Other Club:</strong> {app.isOtherClubAmbassador}</p>
                                                    <a href={app.fbLink} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">FB Link</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.status === 'Pending' && <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold text-xs rounded-full border border-amber-100">Pending</span>}
                                            {app.status === 'Accepted' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-full border border-emerald-100">Accepted</span>}
                                            {app.status === 'Rejected' && <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-full border border-rose-100">Rejected</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {app.status !== 'Accepted' && (
                                                    <button onClick={() => updateStatus(app._id, 'Accepted')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Accept">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {app.status !== 'Rejected' && (
                                                    <button onClick={() => updateStatus(app._id, 'Rejected')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Reject">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button onClick={() => deleteApplication(app._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApps.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
