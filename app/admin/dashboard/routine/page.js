'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, RefreshCw, Loader2, AlertTriangle, Users, Clock,
    ChevronDown, Zap, Check, X, Eye, RotateCcw
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const TIME_SLOTS = [
    '8:00-8:50', '8:50-9:40', '9:40-10:30', '10:30-11:20',
    '11:20-12:10', '12:10-13:00', '13:00-13:50', '13:50-14:40',
    '14:40-15:30', '15:30-16:20', '16:20-17:10', '17:10-18:00',
];

export default function RoutinePage() {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [extracting, setExtracting] = useState(null);
    const [extractingAgain, setExtractingAgain] = useState(null);
    const [bulkExtracting, setBulkExtracting] = useState(false);
    const [bulkResult, setBulkResult] = useState(null);
    const [filterDept, setFilterDept] = useState('all');
    const [filterLab, setFilterLab] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [allRecords, setAllRecords] = useState([]);
    const router = useRouter();

    const fetchRoutines = useCallback(async () => {
        try {
            console.log('[Routine Page] Fetching routines...');
            const res = await fetch('/api/admin/routine');
            if (res.status === 401) {
                toast.error('Session expired. Please login again.');
                router.push('/admin/login');
                return;
            }
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error('[Routine Page] Non-JSON response from GET:', text.substring(0, 200));
                throw new Error('Server returned invalid response');
            }
            if (!res.ok) {
                throw new Error(data.error || `Server error: ${res.status}`);
            }
            console.log('[Routine Page] Routines loaded:', (data.routines || []).length);
            setRoutines(data.routines || []);
        } catch (err) {
            console.error('[Routine Page] Failed to fetch routines:', err.message);
            toast.error('Failed to load routines: ' + err.message);
        }
    }, [router]);

    const fetchRecords = useCallback(async () => {
        try {
            console.log('[Routine Page] Fetching data collection records...');
            const res = await fetch('/api/admin/datacollect');
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error('[Routine Page] Non-JSON response from datacollect:', text.substring(0, 200));
                throw new Error('Server returned invalid response');
            }
            if (!res.ok) {
                throw new Error(data.error || `Server error: ${res.status}`);
            }
            console.log('[Routine Page] Records loaded:', (data.records || []).length);
            setAllRecords(data.records || []);
        } catch (err) {
            console.error('[Routine Page] Failed to fetch records:', err.message);
            toast.error('Failed to load records: ' + err.message);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchRoutines(), fetchRecords()]).finally(() => setLoading(false));
    }, [fetchRoutines, fetchRecords]);

    const handleExtractOne = async (record) => {
        setExtracting(record._id);
        const toastId = toast.loading(`Extracting routine for ${record.name}...`);
        try {
            console.log('[Routine Page] Extracting for:', record.name, record.studentId);
            const res = await fetch('/api/admin/routine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataCollectId: record._id }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error('[Routine Page] Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned invalid response. Please try again.');
            }
            if (!res.ok) throw new Error(data.error || 'Extraction failed');
            console.log('[Routine Page] Extracted', data.routine.slots.length, 'slots for', record.name);
            toast.success(`Extracted ${data.routine.slots.length} slots for ${record.name}`, { id: toastId });
            await fetchRoutines();
        } catch (err) {
            console.error('[Routine Page] Extract failed for', record.name + ':', err.message);
            toast.error(`Failed for ${record.name}: ${err.message}`, { id: toastId });
        } finally {
            setExtracting(null);
        }
    };

    const handleExtractAgain = async (routine) => {
        setExtractingAgain(routine._id);
        const toastId = toast.loading(`Re-extracting routine for ${routine.name}...`);
        try {
            console.log('[Routine Page] Re-extracting for:', routine.name, routine.studentId);
            const res = await fetch('/api/admin/routine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataCollectId: routine.dataCollectId, reExtract: true }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error('[Routine Page] Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned invalid response. Please try again.');
            }
            if (!res.ok) throw new Error(data.error || 'Re-extraction failed');
            console.log('[Routine Page] Re-extracted', data.routine.slots.length, 'slots for', routine.name);
            toast.success(`Re-extracted ${data.routine.slots.length} slots for ${routine.name}`, { id: toastId });
            await fetchRoutines();
        } catch (err) {
            console.error('[Routine Page] Re-extract failed for', routine.name + ':', err.message);
            toast.error(`Failed for ${routine.name}: ${err.message}`, { id: toastId });
        } finally {
            setExtractingAgain(null);
        }
    };

    const handleBulkExtract = async () => {
        setBulkExtracting(true);
        setBulkResult(null);
        const toastId = toast.loading('Starting bulk extraction...');
        try {
            console.log('[Routine Page] Starting bulk extraction');
            const res = await fetch('/api/admin/routine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bulk: true }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error('[Routine Page] Non-JSON response:', text.substring(0, 200));
                throw new Error('Server returned invalid response. Please try again.');
            }
            if (!res.ok) throw new Error(data.error || 'Bulk extraction failed');
            setBulkResult(data);
            const msg = `Extracted ${data.successCount} routines (${data.failCount} failed)`;
            console.log('[Routine Page] Bulk complete:', data);
            if (data.failCount > 0) {
                toast.success(msg + '. Check failed list below.', { id: toastId, duration: 6000 });
            } else {
                toast.success(msg, { id: toastId });
            }
            await fetchRoutines();
        } catch (err) {
            console.error('[Routine Page] Bulk extraction failed:', err.message);
            toast.error('Bulk extraction failed: ' + err.message, { id: toastId });
        } finally {
            setBulkExtracting(false);
        }
    };

    const departments = [...new Set(allRecords.map(r => r.department).filter(Boolean))].sort();
    const labGroups = [...new Set(allRecords.map(r => r.labGroup).filter(Boolean))].sort();

    const filteredRoutines = routines.filter(r => {
        const deptMatch = filterDept === 'all' || r.department === filterDept;
        const labMatch = filterLab === 'all' || r.labGroup === filterLab;
        return deptMatch && labMatch;
    });

    const buildGrid = () => {
        const grid = {};
        for (const day of DAYS) {
            grid[day] = {};
            for (const slot of TIME_SLOTS) {
                grid[day][slot] = [];
            }
        }
        for (const routine of filteredRoutines) {
            for (const s of routine.slots) {
                const dayKey = DAYS.find(d => d.toLowerCase() === s.day.toLowerCase());
                const slotKey = TIME_SLOTS.find(t => s.time.includes(t.split('-')[0]) || t === s.time);
                if (dayKey && slotKey && grid[dayKey]?.[slotKey]) {
                    grid[dayKey][slotKey].push({
                        name: routine.name,
                        studentId: routine.studentId,
                        course: s.course,
                        courseTitle: s.courseTitle || '',
                        teacher: s.teacher || '',
                        section: s.section || '',
                    });
                }
            }
        }
        return grid;
    };

    const grid = buildGrid();
    const totalSlots = DAYS.length * TIME_SLOTS.length;
    let busySlots = 0;
    for (const day of DAYS) {
        for (const slot of TIME_SLOTS) {
            if (grid[day][slot].length > 0) busySlots++;
        }
    }
    const freeSlots = totalSlots - busySlots;

    const unextracted = allRecords.filter(r =>
        r.routineImageUrl && !routines.find(rt => rt.dataCollectId === r._id)
    );

    const [tooltip, setTooltip] = useState(null);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Routines...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            <Toaster position="top-center" toastOptions={{ className: 'font-medium text-sm' }} />

            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="px-6 md:px-10 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <div className="h-5 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">R</span>
                            </div>
                            <span className="font-bold text-sm tracking-tight">Overall Routine</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 hidden sm:block">
                            {freeSlots} Free
                        </span>
                        <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 hidden sm:block">
                            {busySlots} Busy
                        </span>
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 hidden sm:block">
                            {filteredRoutines.length} Students
                        </span>
                    </div>
                </div>
            </nav>

            <div className="px-6 md:px-10 py-6 space-y-5">

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                            className="appearance-none w-full bg-white border border-slate-200 rounded-xl px-3 pr-8 py-2 text-xs font-bold text-slate-600 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            <option value="all">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                    <div className="relative">
                        <select value={filterLab} onChange={e => setFilterLab(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 pr-8 py-2 text-xs font-bold text-slate-600 shadow-sm cursor-pointer hover:border-blue-300 transition-colors">
                            <option value="all">All Lab Groups</option>
                            {labGroups.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
                            className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            {viewMode === 'grid' ? 'List View' : 'Grid View'}
                        </button>
                        <button onClick={async () => { await Promise.all([fetchRoutines(), fetchRecords()]); toast.success('Refreshed'); }}
                            className="bg-white p-2 px-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-1.5 transition-all active:scale-95">
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline text-xs">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Extract Controls */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700">AI Extraction</span>
                    </div>
                    <div className="flex-1 text-[11px] text-slate-500">
                        {unextracted.length > 0 ? (
                            <span>{unextracted.length} records need extraction</span>
                        ) : (
                            <span className="text-green-600 font-bold">All records extracted</span>
                        )}
                    </div>
                    <button onClick={handleBulkExtract} disabled={bulkExtracting || unextracted.length === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95">
                        {bulkExtracting ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Extracting...</>
                        ) : (
                            <><Zap className="w-3.5 h-3.5" /> Extract All ({unextracted.length})</>
                        )}
                    </button>
                </div>

                {bulkResult && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-xl p-4 text-xs ${bulkResult.failCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            {bulkResult.failCount > 0 ? (
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                            ) : (
                                <Check className="w-4 h-4 text-green-600" />
                            )}
                            <span className={`font-bold ${bulkResult.failCount > 0 ? 'text-amber-800' : 'text-green-800'}`}>Bulk extraction complete</span>
                            <button onClick={() => setBulkResult(null)} className="ml-auto text-slate-500 hover:text-slate-700"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <p className={bulkResult.failCount > 0 ? 'text-amber-700' : 'text-green-700'}>
                            Processed: {bulkResult.processed} | Success: {bulkResult.successCount} | Failed: {bulkResult.failCount}
                        </p>
                        {bulkResult.errors?.length > 0 && (
                            <div className="mt-2 space-y-1">
                                <p className="font-bold text-amber-700 text-[10px] uppercase">Failed records:</p>
                                {bulkResult.errors.map((e, i) => (
                                    <p key={i} className="text-[10px] text-amber-600">- {e.name} ({e.studentId}): {e.error}</p>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Routine Grid */}
                {viewMode === 'grid' ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-auto max-h-[75vh]">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur">
                                    <tr>
                                        <th className="px-3 py-3 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500 w-[100px]">Time</th>
                                        {DAYS.map(day => (
                                            <th key={day} className="px-3 py-3 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">
                                                {day.slice(0, 3)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {TIME_SLOTS.map((slot, si) => (
                                        <tr key={slot} className={si % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                            <td className="px-3 py-2 border-b border-slate-100 font-mono text-[10px] font-bold text-slate-600 whitespace-nowrap">
                                                {slot}
                                            </td>
                                            {DAYS.map(day => {
                                                const cells = grid[day][slot];
                                                const count = cells.length;
                                                const cellKey = `${day}-${slot}`;
                                                return (
                                                    <td key={cellKey}
                                                        className={`px-2 py-2 border-b border-slate-100 text-center relative cursor-default ${
                                                            count === 0
                                                                ? 'bg-green-50/50'
                                                                : count <= 2
                                                                    ? 'bg-amber-50/60'
                                                                    : 'bg-red-50/60'
                                                        }`}
                                                        onMouseEnter={() => count > 0 && setTooltip({ key: cellKey, cells, day, slot })}
                                                        onMouseLeave={() => setTooltip(null)}
                                                    >
                                                        {count === 0 ? (
                                                            <span className="text-[10px] text-green-400 font-bold">Free</span>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <span className={`text-sm font-black ${
                                                                    count <= 2 ? 'text-amber-600' : 'text-red-600'
                                                                }`}>{count}</span>
                                                                <span className="text-[9px] text-slate-500 font-bold truncate max-w-full">{cells[0]?.course}</span>
                                                            </div>
                                                        )}
                                                        {tooltip?.key === cellKey && (
                                                            <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white rounded-xl p-3 shadow-xl text-left pointer-events-none">
                                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{day} {slot}</p>
                                                                {cells.map((c, i) => (
                                                                    <div key={i} className="py-1 border-t border-slate-700 first:border-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] font-bold text-white">{c.course}</span>
                                                                            {c.section && <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">{c.section}</span>}
                                                                        </div>
                                                                        {c.courseTitle && <p className="text-[9px] text-blue-400 font-medium">{c.courseTitle}</p>}
                                                                        {c.teacher && <p className="text-[9px] text-slate-500">{c.teacher}</p>}
                                                                    </div>
                                                                ))}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* List View - Student Routines */
                    <div className="space-y-3">
                        {filteredRoutines.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-bold text-sm">No extracted routines found</p>
                                <p className="text-slate-400 text-xs mt-1">Use AI Extraction to process routine images</p>
                            </div>
                        ) : (
                            filteredRoutines.map(r => (
                                <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => setSelectedStudent(selectedStudent === r._id ? null : r._id)}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-xs">{r.name?.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{r.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{r.studentId} · {r.department} · {r.labGroup || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {r.slots.length} slots
                                            </span>
                                            <button onClick={(e) => { e.stopPropagation(); handleExtractAgain(r); }} disabled={extractingAgain === r._id}
                                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Re-extract routine">
                                                {extractingAgain === r._id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Zap className="w-3 h-3" />
                                                )}
                                            </button>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${selectedStudent === r._id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {selectedStudent === r._id && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                                className="overflow-hidden">
                                                <div className="px-3.5 pb-3.5">
                                                    <table className="w-full text-left text-[11px]">
                                                        <thead>
                                                            <tr className="border-b border-slate-100">
                                                                <th className="py-1.5 font-bold text-slate-500">Day</th>
                                                                <th className="py-1.5 font-bold text-slate-500">Time</th>
                                                                <th className="py-1.5 font-bold text-slate-500">Code</th>
                                                                <th className="py-1.5 font-bold text-slate-500">Title</th>
                                                                <th className="py-1.5 font-bold text-slate-500">Section</th>
                                                                <th className="py-1.5 font-bold text-slate-500">Teacher</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {r.slots.map((s, i) => (
                                                                <tr key={i} className="border-b border-slate-50">
                                                                    <td className="py-1.5 font-medium text-slate-700">{s.day}</td>
                                                                    <td className="py-1.5 font-mono text-slate-600">{s.time}</td>
                                                                    <td className="py-1.5 font-bold text-slate-800">{s.course || '-'}</td>
                                                                    <td className="py-1.5 text-slate-600">{s.courseTitle || '-'}</td>
                                                                    <td className="py-1.5 text-slate-600">{s.section || '-'}</td>
                                                                    <td className="py-1.5 text-slate-600">{s.teacher || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Unextracted Records */}
                {unextracted.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-bold text-slate-700">Unextracted Records ({unextracted.length})</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[300px] overflow-auto">
                            {unextracted.map(r => (
                                <div key={r._id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <span className="text-slate-500 font-bold text-[10px]">{r.name?.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">{r.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{r.studentId}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleExtractOne(r)} disabled={extracting === r._id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95">
                                        {extracting === r._id ? (
                                            <><Loader2 className="w-3 h-3 animate-spin" /> Extracting...</>
                                        ) : (
                                            <><Zap className="w-3 h-3" /> Extract</>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
