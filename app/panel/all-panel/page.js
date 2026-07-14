"use client";

import { useState } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import SemesterTabs, { getSemesterFromDate, getSemestersFromItems } from '@/components/dashboard/SemesterTabs';
import { Search, Globe, Users, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AllPanelPage() {
    const { members, currentUser, DEPARTMENTS } = useDashboard();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [deptFilter, setDeptFilter] = useState('All');

    const activeMembers = members.filter(m => m._id !== 'env-admin' && m.status !== 'alumni' && m.status !== 'kicked');
    const availableSemesters = getSemestersFromItems(activeMembers);
    const semesterCounts = { 'all': activeMembers.length, ...availableSemesters.reduce((acc, sem) => { acc[sem] = activeMembers.filter(m => getSemesterFromDate(new Date(m.createdAt)) === sem).length; return acc; }, {}) };

    const filtered = activeMembers.filter(m => {
        const matchesSemester = semesterFilter === 'all' || getSemesterFromDate(new Date(m.createdAt)) === semesterFilter;
        const matchesDept = deptFilter === 'All' || m.department === deptFilter || (deptFilter === 'Core' && !m.department);
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.designation.toLowerCase().includes(search.toLowerCase());
        return matchesSemester && matchesDept && matchesSearch;
    });

    const coreCouncil = filtered.filter(m => !m.department).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0));
    const byDept = DEPARTMENTS.map(dept => ({ ...dept, members: filtered.filter(m => m.department === dept.id).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0)) })).filter(d => d.members.length > 0);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-24 lg:pb-8">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 lg:px-12 py-6">
                <button onClick={() => router.push('/panel')} className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors mb-2">
                    <ArrowLeft className="w-3 h-3" /> Dashboard
                </button>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">All Panel Members</h1>
                <p className="text-slate-400 text-sm mt-1">{filtered.length} of {activeMembers.length} members</p>
            </div>

            {/* Semester Tabs */}
            <div className="px-6 lg:px-12 py-4">
                <SemesterTabs semesters={availableSemesters} activeTab={semesterFilter} onTabChange={setSemesterFilter} counts={semesterCounts} />
            </div>

            {/* Search & Filter */}
            <div className="px-6 lg:px-12 pb-4 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" placeholder="Search..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-wrap">
                    {['All', 'Core', ...DEPARTMENTS.map(d => d.id)].map(dept => (
                        <button key={dept} onClick={() => setDeptFilter(dept)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${deptFilter === dept ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                            {dept === 'Core' ? 'Core' : dept === 'All' ? 'All' : DEPARTMENTS.find(d => d.id === dept)?.name || dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 lg:px-12 space-y-8">
                {coreCouncil.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Core Council ({coreCouncil.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                            {coreCouncil.map(m => (
                                <div key={m._id} onClick={() => router.push(`/panel/members/${m._id}`)} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer group">
                                    <div className="flex items-start gap-3">
                                        <Avatar name={m.name} rankLevel={m.rankLevel} imageUrl={m.imageUrl} className="w-12 h-12 text-sm shadow-md" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 truncate text-sm">{m.name}</p>
                                            <p className="text-xs text-blue-600 font-semibold">{m.designation}</p>
                                            <div className="mt-1"><DeptBadge department={m.department} /></div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg px-2 py-1 border border-blue-100 shrink-0"><p className="text-sm font-black text-blue-700">{m.score}</p></div>
                                    </div>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {byDept.map(dept => (
                    <div key={dept.id} className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span> {dept.name} ({dept.members.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                            {dept.members.map(m => (
                                <div key={m._id} onClick={() => router.push(`/panel/members/${m._id}`)} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer group">
                                    <div className="flex items-start gap-3">
                                        <Avatar name={m.name} rankLevel={m.rankLevel} imageUrl={m.imageUrl} className="w-12 h-12 text-sm shadow-md" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 truncate text-sm">{m.name}</p>
                                            <p className="text-xs text-blue-600 font-semibold">{m.designation}</p>
                                            <div className="mt-1"><DeptBadge department={m.department} /></div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-lg px-2 py-1 border border-blue-100 shrink-0"><p className="text-sm font-black text-blue-700">{m.score}</p></div>
                                    </div>
                                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <div className="px-6 lg:px-12 py-20 text-center"><Users className="w-12 h-12 mx-auto mb-4 text-slate-200" /><p className="text-slate-400">No members found.</p></div>}
        </div>
    );
}
