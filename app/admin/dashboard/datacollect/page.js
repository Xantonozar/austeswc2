'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Search, Download, RefreshCw, Trash2, AlertTriangle,
    X, Check, User, Clock, Calendar, Building2, ChevronDown,
    FileSpreadsheet, FileText, FileJson, Image as ImageIcon, Users
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function DataCollectAdmin() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [filterDept, setFilterDept] = useState('all');
    const [filterTeam, setFilterTeam] = useState('all');
    const exportMenuRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        fetchRecords();
        const handleClickOutside = (e) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
                setShowExportMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await fetch('/api/admin/datacollect');
            if (res.status === 401) {
                toast.error('Please login first');
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            setRecords(data.records || []);
        } catch {
            toast.error('Failed to fetch records');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        const original = [...records];
        setRecords(prev => prev.filter(r => r._id !== deleteId));
        setDeleteId(null);
        const toastId = toast.loading('Deleting...');
        try {
            const res = await fetch(`/api/admin/datacollect?id=${deleteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            toast.success('Record deleted', { id: toastId });
        } catch (err) {
            setRecords(original);
            toast.error(err.message || 'Delete failed', { id: toastId });
        }
    };

    const filteredRecords = records.filter(r => {
        const match = r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.phone?.includes(searchTerm);
        const deptMatch = filterDept === 'all' || r.department === filterDept;
        const teamMatch = filterTeam === 'all' || r.team === filterTeam;
        return match && deptMatch && teamMatch;
    });

    const departments = [...new Set(records.map(r => r.department).filter(Boolean))].sort();
    const teams = [...new Set(records.map(r => r.team).filter(Boolean))].sort();

    const handleExport = (type) => {
        const data = filteredRecords.map(r => ({
            'Name': r.name,
            'Student ID': r.studentId,
            'Email': r.email,
            'Phone': r.phone,
            'Department': r.department,
            'Year': r.yearSemester,
            'Lab Group': r.labGroup || '-',
            'Team': r.team || '-',
            'Position': r.position || '-',
            'Photo': r.imageUrl || '',
            'Routine': r.routineImageUrl || '',
            'Submitted': new Date(r.createdAt).toLocaleString(),
        }));

        const filename = `DataCollect_${new Date().toISOString().split('T')[0]}`;

        if (type === 'json') {
            const blob = new Blob([JSON.stringify({ records: data }, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${filename}.json`;
            document.body.appendChild(a); a.click(); URL.revokeObjectURL(url);
        } else {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'DataCollect');
            XLSX.writeFile(wb, `${filename}.${type === 'csv' ? 'csv' : 'xlsx'}`);
        }
        setShowExportMenu(false);
        toast.success(`Exported ${data.length} records`);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            <Toaster position="top-center" toastOptions={{ className: 'font-medium text-sm' }} />

            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <div className="h-5 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">D</span>
                            </div>
                            <span className="font-bold text-sm tracking-tight">Data Collection</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 hidden sm:block">
                            {filteredRecords.length} Records
                        </span>
                        <div className="relative" ref={exportMenuRef}>
                            <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <Download className="w-3.5 h-3.5" /> Export
                            </button>
                            <AnimatePresence>
                                {showExportMenu && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
                                        {[
                                            { label: 'Excel', icon: FileSpreadsheet, type: 'xlsx', color: 'text-green-600' },
                                            { label: 'CSV', icon: FileText, type: 'csv', color: 'text-blue-600' },
                                            { label: 'JSON', icon: FileJson, type: 'json', color: 'text-orange-600' },
                                        ].map(opt => (
                                            <button key={opt.type} onClick={() => handleExport(opt.type)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                                                <opt.icon className={`w-3.5 h-3.5 ${opt.color}`} /> {opt.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 space-y-5">

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <Search className="w-4 h-4 text-slate-400 m-2.5" />
                        <input type="text" placeholder="Search by name, ID, email, phone..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="flex-1 outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400 bg-transparent" />
                    </div>
                    <div className="relative">
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 pr-8 py-2 text-xs font-bold text-slate-600 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            <option value="all">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                    <div className="relative">
                        <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 pr-8 py-2 text-xs font-bold text-slate-600 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            <option value="all">All Teams</option>
                            {teams.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                    <button onClick={async () => { await fetchRecords(); toast.success('Refreshed'); }}
                        className="bg-white p-2 px-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-1.5 transition-all active:scale-95">
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs">Refresh</span>
                    </button>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-auto max-h-[70vh]">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 border-b border-slate-200">Photo</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Name</th>
                                    <th className="px-4 py-3 border-b border-slate-200">ID</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Contact</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Dept</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Year</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Team</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Position</th>
                                    <th className="px-4 py-3 border-b border-slate-200">Submitted</th>
                                    <th className="px-4 py-3 border-b border-slate-200 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {Array.from({ length: 10 }).map((_, j) => (
                                                <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                    <User className="w-7 h-7 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-bold">No records found</p>
                                                <p className="text-slate-400 text-xs">Data will appear here once submitted.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map(r => (
                                        <tr key={r._id} className="hover:bg-blue-50/40 transition-colors group">
                                            <td className="px-4 py-2.5">
                                                <div onClick={() => r.imageUrl && setFullscreenImage(r.imageUrl)}
                                                    className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-400 cursor-zoom-in">
                                                    {r.imageUrl ? (
                                                        <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center"><User className="w-4 h-4 text-slate-300" /></div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 font-semibold text-slate-800 whitespace-nowrap">{r.name}</td>
                                            <td className="px-4 py-2.5 font-mono text-slate-600">{r.studentId}</td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[150px]">{r.email}</span>
                                                    <span className="text-slate-400">{r.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-[10px]">{r.department}</span>
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600">{r.yearSemester}</td>
                                            <td className="px-4 py-2.5">
                                                {r.team && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-medium text-[10px]">{r.team}</span>}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600">{r.position || '-'}</td>
                                            <td className="px-4 py-2.5">
                                                {r.createdAt ? (() => {
                                                    const d = new Date(r.createdAt);
                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-700">{d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                            <span className="text-[10px] text-slate-400">{d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                        </div>
                                                    );
                                                })() : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {r.routineImageUrl && (
                                                        <button onClick={() => setFullscreenImage(r.routineImageUrl)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="View Routine">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => setDeleteId(r._id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 font-medium">
                        Showing {filteredRecords.length} of {records.length} records
                    </div>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden space-y-3">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredRecords.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-bold text-sm">No records found</p>
                        </div>
                    ) : (
                        filteredRecords.map(r => (
                            <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 hover:shadow-md transition-all">
                                <div className="flex items-start gap-3">
                                    <div onClick={() => r.imageUrl && setFullscreenImage(r.imageUrl)}
                                        className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 cursor-zoom-in">
                                        {r.imageUrl ? (
                                            <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center"><User className="w-5 h-5 text-slate-300" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-sm text-slate-800 truncate">{r.name}</h3>
                                            <button onClick={() => setDeleteId(r._id)} className="p-1 text-slate-300 hover:text-red-500 shrink-0">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-[11px] font-mono text-slate-500">{r.studentId}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{r.email}</p>
                                        <p className="text-[11px] text-slate-400">{r.phone}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">{r.department}</span>
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{r.yearSemester}</span>
                                            {r.team && <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold">{r.team}</span>}
                                            {r.position && <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">{r.position}</span>}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" />
                                                {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                            </span>
                                            <div className="flex gap-1">
                                                {r.routineImageUrl && (
                                                    <button onClick={() => setFullscreenImage(r.routineImageUrl)}
                                                        className="p-1 text-slate-400 hover:text-blue-500 rounded" title="View Routine">
                                                        <Calendar className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                            <div className="w-11 h-11 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-center text-slate-900 mb-1">Delete Record?</h3>
                            <p className="text-center text-slate-500 text-sm mb-5">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteId(null)} disabled={isDeleting}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 text-sm transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={isDeleting}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 text-sm transition-colors flex items-center justify-center gap-2">
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Lightbox */}
            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setFullscreenImage(null)}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out">
                        <button onClick={() => setFullscreenImage(null)}
                            className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/20">
                            <X className="w-5 h-5" />
                        </button>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            src={fullscreenImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Preview" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
