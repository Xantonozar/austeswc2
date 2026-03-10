'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, Users, Search, Download, Filter,
    ChevronDown, FileSpreadsheet, FileText, FileJson,
    Smartphone, Trash2, AlertTriangle, X, Check,
    ExternalLink, CreditCard, User, Building2, MapPin, RefreshCw, Clock,
    ArrowLeft
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
    // State
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [deleteId, setDeleteId] = useState(null); // ID of member to delete
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(10000);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    // Refs & Hooks
    const exportMenuRef = useRef(null);
    const lastMutationTime = useRef(0); // Track when the last mutation occurred
    const abortControllerRef = useRef(null);
    const router = useRouter();

    // Keep members ref synced for polling comparison
    const membersRef = useRef(members);
    useEffect(() => { membersRef.current = members; }, [members]);

    // Initial Load & Event Listeners
    useEffect(() => {
        fetchMembers();

        const handleClickOutside = (e) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Polling Logic
    useEffect(() => {
        if (refreshInterval > 0) {
            const interval = setInterval(() => fetchMembers(true), refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    // Core Logic
    const fetchMembers = async (isBackgroundRefresh = false) => {
        // Cancel previous request if it's a background refresh or if we want to prioritize this one
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const fetchStartTime = Date.now();
        try {
            const res = await fetch('/api/admin/members', {
                cache: 'no-store',
                signal: controller.signal
            });

            if (res.status === 401) {
                if (!isBackgroundRefresh) {
                    toast.error('Please login first');
                    router.push('/admin/login');
                }
                return;
            }

            const data = await res.json();

            // Check if this fetch is stale (initiated before the last mutation finished)
            if (fetchStartTime < lastMutationTime.current) {
                return;
            }

            const newMembers = data.members || [];

            if (isBackgroundRefresh && membersRef.current.length > 0 && newMembers.length > membersRef.current.length) {
                const diff = newMembers.length - membersRef.current.length;
                toast.success(`${diff} new member${diff > 1 ? 's' : ''} joined!`, { duration: 3000 });
            }

            setMembers(newMembers);
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Fetch error:', error);
            // largely silence background errors to avoid annoying toasts during network blips
            if (!isBackgroundRefresh) toast.error('Failed to fetch members');
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        // 1. Optimistic Update
        const memberToDelete = members.find(m => m._id === deleteId);
        const originalMembers = [...members]; // Backup for rollback

        // Remove from UI immediately
        setMembers(prev => prev.filter(m => m._id !== deleteId));
        setDeleteId(null); // Close modal

        // 2. Background API Call
        const toastId = toast.loading('Syncing deletion...');
        try {
            const res = await fetch(`/api/admin/members?id=${deleteId}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Delete failed');

            lastMutationTime.current = Date.now(); // Mark mutation time
            toast.success('Member removed', { id: toastId });
        } catch (error) {
            // 3. Rollback on Error
            console.error(error);
            setMembers(originalMembers); // Revert UI
            toast.error(error.message || 'Could not delete member', { id: toastId });
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    // Export Logic
    const handleExport = (type) => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const exportData = filteredMembers.map(m => ({
            'Name': m.name,
            'Student ID': m.studentId,
            'Email': m.email,
            'Phone': m.phone,
            'Department': m.department,
            'Year': m.yearSemester,
            'Lab Group': m.labGroup || '-',
            'Transaction ID': m.bkashId || 'N/A',
            'Payment Method': m.paymentMethod || 'Online',
            'Image Link': m.imageUrl || 'No Photo',
            'Joined': new Date(m.createdAt).toLocaleString()
        }));

        const filename = `ESWC_Members_${new Date().toISOString().split('T')[0]}`;

        if (type === 'json') {
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${filename}.json`;
            document.body.appendChild(a); a.click(); URL.revokeObjectURL(url);
        } else {
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Members");
            XLSX.writeFile(wb, `${filename}.${type === 'csv' ? 'csv' : 'xlsx'}`);
        }
        setShowExportMenu(false);
        toast.success(`Exported ${exportData.length} records`);
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render Helpers
    const StatCard = ({ title, value, icon: Icon, color, sub }) => (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${color}-500`} />
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            </div>
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <Toaster position="top-center" toastOptions={{ className: 'font-medium text-sm' }} />

            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">E</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">ESWC Admin</span>
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">Back to Dashboard</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" /> Export
                            </button>
                            <AnimatePresence>
                                {showExportMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1"
                                    >
                                        {[
                                            { label: 'Excel', icon: FileSpreadsheet, type: 'xlsx', color: 'text-green-600' },
                                            { label: 'CSV', icon: FileText, type: 'csv', color: 'text-blue-600' },
                                            { label: 'JSON', icon: FileJson, type: 'json', color: 'text-orange-600' },
                                        ].map(opt => (
                                            <button
                                                key={opt.type}
                                                onClick={() => handleExport(opt.type)}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <opt.icon className={`w-4 h-4 ${opt.color}`} /> {opt.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-2 md:px-4 xl:px-8 py-8 space-y-8">

                {/* Toolbar */}
                <div className="flex gap-3">
                    <div className="flex-1 flex bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <Search className="w-5 h-5 text-slate-400 m-3" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="flex-1 outline-none text-slate-700 font-medium placeholder:text-slate-400 bg-transparent"
                        />
                    </div>

                    {/* Auto Refresh Config */}
                    <div className="flex items-center gap-2 bg-white px-3 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 font-medium hover:border-emerald-200 transition-colors">
                        <Clock className={`w-4 h-4 ${refreshInterval > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <select
                            value={refreshInterval}
                            onChange={e => setRefreshInterval(Number(e.target.value))}
                            className="bg-transparent outline-none cursor-pointer appearance-none pr-4 min-w-[60px] text-right font-bold"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value={5000}>5s</option>
                            <option value={10000}>10s</option>
                            <option value={30000}>30s</option>
                            <option value={60000}>1m</option>
                            <option value={0}>Off</option>
                        </select>
                        <span className="text-xs text-slate-400 -ml-2 pointer-events-none">Auto</span>
                    </div>

                    <button
                        onClick={async () => {
                            setIsRefreshing(true);
                            await fetchMembers(false);
                            setIsRefreshing(false);
                        }}
                        className="bg-white p-2 px-4 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-2 transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                        <span className="hidden md:inline">Refresh</span>
                    </button>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur shadow-sm text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-slate-100 px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Photo</th>
                                    <th className="sticky left-[50px] lg:left-[40px] xl:left-[70px] z-30 bg-slate-100 px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Name</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Student ID</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Contact</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Ref</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Dept</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Year</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Lab Group</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 border-b border-slate-200">Payment</th>
                                    <th className="px-3 py-3 lg:px-2 lg:py-2 xl:px-6 xl:py-4 text-right border-b border-slate-200">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs xl:text-sm">
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-10 h-10 rounded-full" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-32 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-24 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-40 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-16 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-20 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-12 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-12 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-24 h-4" /></td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-4"><Skeleton className="w-8 h-8 rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-20 text-center text-slate-400">
                                            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            No members found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map(member => (
                                        <tr key={member._id} className="hover:bg-blue-50/50 transition-colors group">
                                            {/* Photo */}
                                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/80 px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3">
                                                <div
                                                    onClick={() => member.imageUrl && setFullscreenImage(member.imageUrl)}
                                                    className="block w-8 h-8 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 transition-all cursor-zoom-in relative"
                                                >
                                                    {member.imageUrl ? (
                                                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400"><User className="w-4 h-4 xl:w-5 xl:h-5" /></div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td className="sticky left-[50px] lg:left-[40px] xl:left-[70px] z-10 bg-white group-hover:bg-blue-50/50 px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3 font-semibold text-slate-800 whitespace-nowrap">
                                                {member.name}
                                            </td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3 font-mono text-slate-600">{member.studentId}</td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3">
                                                <div className="flex flex-col">
                                                    <span>{member.email}</span>
                                                    <span className="text-xs text-slate-400">{member.phone}</span>
                                                </div>
                                            </td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3">
                                                {member.reference && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium shadow-sm truncate max-w-[100px]" title={member.reference}>
                                                        {member.reference}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3"><span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs shadow-sm">{member.department}</span></td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3 text-slate-600">{member.yearSemester}</td>
                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3"><span className="inline-flex items-center px-2.5 py-1 rounded-full font-medium text-purple-700 bg-purple-50 border border-purple-200 text-xs shadow-sm">{member.labGroup || '-'}</span></td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3">
                                                {member.paymentMethod === 'Online' ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 font-bold text-[10px] uppercase shadow-sm">bKash</span>
                                                        <span className="font-mono text-[10px] text-slate-500">{member.bkashId}</span>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold text-xs shadow-sm">CASH</span>
                                                )}
                                            </td>

                                            <td className="px-3 py-2 lg:px-2 lg:py-1.5 xl:px-6 xl:py-3 text-right">
                                                <button
                                                    onClick={() => setDeleteId(member._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500 font-medium flex justify-between">
                        <span>Showing {filteredMembers.length} records</span>
                        <span className="flex items-center gap-1">
                            {refreshInterval > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                            {refreshInterval > 0 ? `Auto-refresh: ${refreshInterval / 1000}s` : 'Auto-refresh: Off'}
                        </span>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Summary Stats */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Members</p>
                                <h4 className="text-2xl font-bold text-slate-900">{members.length}</h4>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>

                        {(() => {
                            const deptCounts = members.reduce((acc, m) => {
                                acc[m.department] = (acc[m.department] || 0) + 1;
                                return acc;
                            }, {});
                            const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
                            const loopDepts = sortedDepts.length > 0 ? sortedDepts : [['N/A', 0]];
                            const [maxDept, maxCount] = loopDepts[0];
                            const [minDept, minCount] = loopDepts[loopDepts.length - 1];

                            return (
                                <>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                        <div>
                                            <p className="text-slate-500 text-sm font-medium">Highest Participation</p>
                                            <h4 className="text-xl font-bold text-slate-900">{maxDept} <span className="text-sm font-medium text-emerald-600">({maxCount})</span></h4>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                                        <div>
                                            <p className="text-slate-500 text-sm font-medium">Lowest Participation</p>
                                            <h4 className="text-xl font-bold text-slate-900">{minDept} <span className="text-sm font-medium text-orange-600">({minCount})</span></h4>
                                        </div>
                                        <div className="p-3 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Department Breakdown */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-500" />
                            Department Breakdown
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {(() => {
                                const deptCounts = members.reduce((acc, m) => {
                                    acc[m.department] = (acc[m.department] || 0) + 1;
                                    return acc;
                                }, {});
                                return Object.entries(deptCounts)
                                    .sort((a, b) => b[1] - a[1]) // Sort by count descending
                                    .map(([dept, count]) => (
                                        <div key={dept} className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">DEPT</span>
                                            <span className="text-lg font-bold text-indigo-700">{dept}</span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mt-2">
                                                {count} Members
                                            </span>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
                        >
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Remove Member?</h3>
                            <p className="text-center text-slate-500 mb-6 font-medium">
                                Are you sure you want to delete this member? <br /> This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Image Lightbox */}
            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFullscreenImage(null)}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.button
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/20"
                            onClick={() => setFullscreenImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={fullscreenImage}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            alt="Fullscreen Preview"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
