"use client";

import { useState, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { Search, GraduationCap, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AlumniPage() {
    const router = useRouter();
    const [alumniList, setAlumniList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetch('/api/panel/members?status=all', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setAlumniList((data.members || []).filter(m => m.status === 'alumni' || m.status === 'kicked')))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = alumniList.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.designation.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || m.status === filterType;
        return matchesSearch && matchesType;
    });

    const alumniOnly = alumniList.filter(m => m.status === 'alumni');
    const kickedOnly = alumniList.filter(m => m.status === 'kicked');

    return (
        <div className="p-6 lg:p-8 w-full space-y-6 animate-in fade-in duration-500 pb-20">
            <header>
                <button onClick={() => router.push('/panel')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors mb-2">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Alumni & Former Members</h1>
                <p className="text-slate-400 text-sm mt-1">{alumniList.length} former members</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{alumniList.length}</p>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voluntarily Left</p>
                    <p className="text-3xl font-black text-blue-600 mt-1">{alumniOnly.length}</p>
                </div>
                <div className="bg-white rounded-3xl border border-red-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Removed</p>
                    <p className="text-3xl font-black text-red-500 mt-1">{kickedOnly.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" placeholder="Search..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                    {[{ id: 'all', label: 'All' }, { id: 'alumni', label: 'Alumni' }, { id: 'kicked', label: 'Removed' }].map(tab => (
                        <button key={tab.id} onClick={() => setFilterType(tab.id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            {isLoading ? (
                <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center"><GraduationCap className="w-12 h-12 mx-auto mb-4 text-slate-200" /><p className="text-slate-400">No alumni found.</p></div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {filtered.map(m => (
                        <div key={m._id} onClick={() => router.push(`/panel/members/${m._id}`)}
                            className="bg-white rounded-3xl border border-slate-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group break-inside-avoid relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-start gap-3">
                                <Avatar name={m.name} rankLevel={m.rankLevel} imageUrl={m.imageUrl} className="w-12 h-12 text-sm shadow-md" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm">{m.name}</p>
                                        {m.status === 'kicked' && <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">Kicked</span>}
                                        {m.status === 'alumni' && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Alumni</span>}
                                    </div>
                                    <p className="text-xs text-blue-600 font-semibold">{m.designation}</p>
                                    <div className="mt-1.5"><DeptBadge department={m.department} /></div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-lg font-black text-slate-900">{m.score}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">pts</p>
                                </div>
                            </div>
                            {(m.semesterLeft || m.leftReason) && (
                                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-3 text-[10px] text-slate-400">
                                    {m.semesterJoined && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {m.semesterJoined}</span>}
                                    {m.semesterLeft && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {m.semesterLeft}</span>}
                                    {m.leftReason && <span className={`font-medium ${m.status === 'kicked' ? 'text-red-500' : ''}`}>{m.leftReason}</span>}
                                </div>
                            )}
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
