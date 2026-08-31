"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2, Search, Download, Trash2, CheckCircle2, XCircle, Eye, ExternalLink,
    Mail, Phone, Store, Receipt, ShoppingBag, ChevronDown, X, ArrowLeft, Filter
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import Link from "next/link";

export default function StallAdmin() {
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const exportDropdownRef = useRef(null);
    const [photoSelectionLoading, setPhotoSelectionLoading] = useState(null);

    useEffect(() => {
        fetchStalls();
        const handleClickOutside = (e) => {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) setExportDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchStalls = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/competition?type=eco-fair-stall`);
            const data = await res.json();
            if (data.result === 'success') setStalls(data.data);
            else toast.error("Failed to load stall applications");
        } catch {
            toast.error("Error connecting to server");
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status, paymentVerified = null) => {
        const loadingToast = toast.loading("Updating...");
        try {
            const payload = { id, status };
            if (paymentVerified !== null) payload.paymentVerified = paymentVerified;
            const res = await fetch('/api/admin/competition', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.result === 'success') {
                toast.success(`Updated to ${status}`, { id: loadingToast });
                setStalls(prev => prev.map(c => c._id === id ? { ...c, ...payload } : c));
                if (selectedEntry?._id === id) setSelectedEntry(prev => ({ ...prev, ...payload }));
            } else throw new Error(data.message);
        } catch {
            toast.error("Failed to update", { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this stall application?")) return;
        const loadingToast = toast.loading("Deleting...");
        try {
            const res = await fetch(`/api/admin/competition?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.result === 'success') {
                toast.success("Deleted", { id: loadingToast });
                setStalls(stalls.filter(c => c._id !== id));
                if (selectedEntry?._id === id) setSelectedEntry(null);
            } else throw new Error(data.message);
        } catch {
            toast.error("Failed to delete", { id: loadingToast });
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            registered: "bg-slate-100 text-slate-600 border-slate-200",
            selected: "bg-blue-50 text-blue-700 border-blue-100",
            paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
            eliminated: "bg-rose-50 text-rose-700 border-rose-100",
            rejected: "bg-amber-50 text-amber-700 border-amber-100"
        };
        return <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border ${styles[status]}`}>{status}</span>;
    };

    const handleExportXLSX = () => {
        const exportData = filtered.map(c => ({
            "Brand / Vendor": c.details?.brandName || c.teamName,
            "Designation": c.details?.designation || "",
            "Stall Size": c.details?.stallSize || "",
            "Primary Rep": c.details?.primaryRep ? `${c.details.primaryRep.name} (${c.details.primaryRep.phone})` : "",
            "Secondary Rep": c.details?.secondaryRep ? `${c.details.secondaryRep.name} (${c.details.secondaryRep.phone})` : "",
            "Additional Reps": c.details?.additionalReps || "",
            "Email": c.email,
            "Phone": c.phone,
            "Product Categories": (c.details?.productCategories || []).join("; "),
            "Description": c.details?.productDescription || "",
            "Status": c.status.toUpperCase(),
            "Payment Verified": c.paymentVerified ? "YES" : "NO",
            "Trx ID": c.bkashTxId || "",
            "Sender Number": c.paymentSenderNumber || "",
            "Date": new Date(c.createdAt).toLocaleDateString()
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stalls");
        XLSX.writeFile(wb, `eswc_eco_fair_stalls_${Date.now()}.xlsx`);
        setExportDropdownOpen(false);
    };

    const handleExportJSON = () => {
        const jsonString = JSON.stringify({ exportedAt: new Date().toISOString(), count: filtered.length, stalls: filtered }, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `eswc_eco_fair_stalls_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${filtered.length} stalls`);
        setExportDropdownOpen(false);
    };

    const filtered = stalls.filter(c => {
        const q = searchQuery.toLowerCase();
        const brand = (c.details?.brandName || c.teamName || '').toLowerCase();
        return brand.includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q);
    });

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#F8FAFC] font-sans">
            <Toaster position="top-right" />

            <div className="mb-6">
                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <ShoppingBag className="w-7 h-7 text-emerald-600" /> Eco Fair Stall Applications
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Review and manage stall registrations for Eco Champions 4.0.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                            type="text" placeholder="Search brand, email, phone..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                        />
                    </div>

                    <button onClick={handleExportXLSX} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg active:scale-95" disabled={loading || filtered.length === 0}>
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export XLSX</span>
                    </button>

                    <div className="relative" ref={exportDropdownRef}>
                        <button onClick={() => setExportDropdownOpen(!exportDropdownOpen)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg active:scale-95" disabled={loading || filtered.length === 0}>
                            <Receipt className="w-4 h-4" /> <span className="hidden sm:inline">Export JSON</span> <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {exportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                                <button onClick={handleExportJSON} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 transition-colors">
                                    <Download className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-bold text-slate-800">Export All ({filtered.length})</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[900px]">
                        <thead className="bg-slate-50/50 text-slate-400 uppercase font-black text-[9px] tracking-[0.2em] border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-5">Brand</th>
                                <th className="px-6 py-5">Stall</th>
                                <th className="px-6 py-5">Contact</th>
                                <th className="px-6 py-5">Status & Payment</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-32 text-center bg-white">
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                                        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Stalls...</p>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="py-32 text-center text-slate-400 bg-white">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center"><Store className="w-8 h-8 text-slate-300" /></div>
                                        <p className="text-slate-500 font-bold text-lg">No stall applications yet</p>
                                    </div>
                                </td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50/80 transition-all border-l-4 border-l-transparent hover:border-l-emerald-500">
                                        <td className="px-6 py-6">
                                            <p className="font-extrabold text-slate-900 leading-tight mb-1">{c.details?.brandName || c.teamName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><Store className="w-3 h-3" /> {c.details?.designation || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-sm font-bold text-slate-700">{c.details?.stallSize || 'N/A'} Sq. Ft.</span>
                                            <p className="text-[10px] text-emerald-600 font-bold mt-1">{(c.details?.productCategories || []).length} categories</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5"><Mail className="w-3 h-3" /> {c.email}</p>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1"><Phone className="w-3 h-3" /> {c.phone || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(c.status)}
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${c.paymentVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{c.paymentVerified ? 'Paid' : 'Unpaid'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setSelectedEntry(c)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="View"><Eye className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(c._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEntry(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">{selectedEntry.details?.brandName || selectedEntry.teamName}</h2>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Eco Fair Stall • {selectedEntry.details?.stallSize} Sq. Ft.</p>
                                </div>
                                <button onClick={() => setSelectedEntry(null)} className="p-3 bg-slate-50 hover:bg-slate-100 hover:rotate-90 rounded-full transition-all text-slate-400 hover:text-slate-600 border border-slate-100"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                                <section className="grid sm:grid-cols-2 gap-3">
                                    <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="font-black text-slate-900">{selectedEntry.email}</p></div>
                                    <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p><p className="font-black text-slate-900">{selectedEntry.phone}</p></div>
                                    <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-[10px] font-bold text-slate-400 uppercase">Designation</p><p className="font-black text-slate-900">{selectedEntry.details?.designation || 'N/A'}</p></div>
                                    <div className="bg-white border border-slate-100 rounded-2xl p-4"><p className="text-[10px] font-bold text-slate-400 uppercase">Payment</p><p className="font-black text-slate-900">bKash • {selectedEntry.bkashTxId || 'N/A'} {selectedEntry.paymentVerified ? '✓' : ''}</p></div>
                                </section>

                                {selectedEntry.details?.logoUrl && (
                                    <section>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Brand Logo</p>
                                        <img src={selectedEntry.details.logoUrl} alt="Brand Logo" className="h-32 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setFullscreenImage(selectedEntry.details.logoUrl)} />
                                    </section>
                                )}

                                {selectedEntry.details?.primaryRep && (
                                    <section>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Representatives</p>
                                        <div className="space-y-2">
                                            <div className="bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold text-slate-700">Primary: {selectedEntry.details.primaryRep.name} <span className="text-slate-400">({selectedEntry.details.primaryRep.phone})</span></div>
                                            {selectedEntry.details.secondaryRep && <div className="bg-white border border-slate-100 rounded-xl p-3 text-sm font-semibold text-slate-700">Secondary: {selectedEntry.details.secondaryRep.name} <span className="text-slate-400">({selectedEntry.details.secondaryRep.phone})</span></div>}
                                            {selectedEntry.details.additionalReps && <div className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-500 whitespace-pre-line">Additional: {selectedEntry.details.additionalReps}</div>}
                                        </div>
                                    </section>
                                )}

                                {selectedEntry.details?.productCategories?.length > 0 && (
                                    <section>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Declared Product Categories</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEntry.details.productCategories.map((cat, i) => (
                                                <span key={i} className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{cat}</span>
                                            ))}
                                        </div>
                                        {selectedEntry.details.productDescription && <p className="text-sm text-slate-600 mt-3 italic">"{selectedEntry.details.productDescription}"</p>}
                                    </section>
                                )}

                                {selectedEntry.paymentScreenshotUrl && (
                                    <section>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Payment Screenshot</p>
                                        <img src={selectedEntry.paymentScreenshotUrl} alt="Payment" className="max-w-sm w-full rounded-xl border-4 border-white shadow-md cursor-pointer" onClick={() => setFullscreenImage(selectedEntry.paymentScreenshotUrl)} />
                                    </section>
                                )}

                                {selectedEntry.details?.terms && (
                                    <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">Terms & Conditions</p>
                                        {[
                                            { label: 'Single-Use Plastic Ban', val: selectedEntry.details.terms.plasticBan },
                                            { label: 'Advance Payment & Non-Refundable', val: selectedEntry.details.terms.advancePayment },
                                            { label: 'Approved Merchandise & Prohibited Items', val: selectedEntry.details.terms.approvedMerch },
                                            { label: 'Setup Schedule & Property Safety', val: selectedEntry.details.terms.setupSchedule },
                                            { label: 'Campus Decorum & Final Authority', val: selectedEntry.details.terms.decorum }
                                        ].map((d, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600 font-medium">{d.label}</span>
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${d.val ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{d.val ? 'Agreed' : 'Not Agreed'}</span>
                                            </div>
                                        ))}
                                    </section>
                                )}
                            </div>

                            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    {selectedEntry.status === 'registered' && (
                                        <button onClick={() => handleStatusUpdate(selectedEntry._id, 'selected')} className="px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-emerald-100">Allocate Stall</button>
                                    )}
                                    <button onClick={() => handleStatusUpdate(selectedEntry._id, 'eliminated')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedEntry.status === 'eliminated' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-500 hover:text-rose-600'}`}>Eliminate</button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!selectedEntry.paymentVerified && selectedEntry.bkashTxId && (
                                        <button onClick={() => handleStatusUpdate(selectedEntry._id, selectedEntry.status, true)} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Verify Payment</button>
                                    )}
                                    <button onClick={() => handleDelete(selectedEntry._id)} className="px-4 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullscreenImage(null)} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out">
                        <motion.button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/20" onClick={() => setFullscreenImage(null)}><X className="w-6 h-6" /></motion.button>
                        <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} src={fullscreenImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Preview" />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}</style>
        </div>
    );
}
