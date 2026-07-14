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

    const semesterCounts = {
        'all': activeMembers.length,
        ...availableSemesters.reduce((acc, sem) => {
            acc[sem] = activeMembers.filter(m => getSemesterFromDate(new Date(m.createdAt)) === sem).length;
            return acc;
        }, {})
    };

    const filtered = activeMembers.filter(m => {
        const matchesSemester = semesterFilter === 'all' || getSemesterFromDate(new Date(m.createdAt)) === semesterFilter;
        const matchesDept = deptFilter === 'All' || m.department === deptFilter || (deptFilter === 'Core' && !m.department);
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.designation.toLowerCase().includes(search.toLowerCase());
        return matchesSemester && matchesDept && matchesSearch;
    });

    const coreCouncil = filtered.filter(m => !m.department).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0));
    const byDept = DEPARTMENTS.map(dept => ({
        ...dept,
        members: filtered.filter(m => m.department === dept.id).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0))
    })).filter(d => d.members.length > 0);

    const MemberCard = ({ member }) => (
        <div onClick={() => router.push(`/panel/members/${member._id}`)}
            className="bg-white rounded-3xl border border-slate-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-4">
                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-14 h-14 text-base shadow-md" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{member.name}</p>
                    <p className="text-sm text-blue-600 font-semibold">{member.designation}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <DeptBadge department={member.department} />
                        {member.semesterJoined && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {member.semesterJoined}</span>}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl px-3 py-2 border border-blue-100">
                        <p className="text-lg font-black text-blue-700">{member.score}</p>
                    </div>
                </div>
            </div>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );

    const Section = ({ title, icon, membersList }) => {
        if (membersList.length === 0) return null;
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">{icon} {title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{membersList.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {membersList.map(m => <MemberCard key={m._id} member={m} />)}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-8 w-full space-y-6 animate-in fade-in duration-500 pb-20">
            <header>
                <button onClick={() => router.push('/panel')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors mb-2">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </button>
                <h1 className="text-3xl font-bold text-slate-900">All Panel Members</h1>
                <p className="text-slate-400 text-sm mt-1">Browse by semester and department</p>
            </header>

            <section>
                <SemesterTabs semesters={availableSemesters} activeTab={semesterFilter} onTabChange={setSemesterFilter} counts={semesterCounts} />
            </section>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" placeholder="Search..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-wrap">
                    {['All', 'Core', ...DEPARTMENTS.map(d => d.id)].map(dept => (
                        <button key={dept} onClick={() => setDeptFilter(dept)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${deptFilter === dept ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {dept === 'Core' ? 'Core' : dept === 'All' ? 'All' : DEPARTMENTS.find(d => d.id === dept)?.name || dept}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Users className="w-4 h-4" />
                <span className="text-slate-700">{filtered.length}</span> of {activeMembers.length} members
                {semesterFilter !== 'all' && <span className="text-blue-600">· {semesterFilter}</span>}
            </div>

            <div className="space-y-8">
                {coreCouncil.length > 0 && <Section title="Core Council" icon={<Globe className="w-4 h-4 text-blue-500" />} membersList={coreCouncil} />}
                {byDept.map(dept => (
                    <Section key={dept.id} title={dept.name} icon={<span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span>} membersList={dept.members} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center"><Users className="w-12 h-12 mx-auto mb-4 text-slate-200" /><p className="text-slate-400">No members found.</p></div>
            )}
        </div>
    );
}
