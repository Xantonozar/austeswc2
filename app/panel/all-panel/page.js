"use client";

import { useState } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import SemesterTabs, { getSemesterFromDate, getSemestersFromItems } from '@/components/dashboard/SemesterTabs';
import { Search, Globe, Users, Calendar, ArrowLeft } from 'lucide-react';
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
    }));

    const MemberCard = ({ member }) => (
        <div
            onClick={() => router.push(`/panel/members/${member._id}`)}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:border-blue-300 transition-all group cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-14 h-14 text-base shadow-md" />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{member.name}</p>
                    <p className="text-sm text-blue-600 font-semibold">{member.designation}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <DeptBadge department={member.department} />
                        {member.semesterJoined && (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {member.semesterJoined}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-lg font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">{member.score}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">Score</p>
                </div>
            </div>
        </div>
    );

    const Section = ({ title, icon, membersList }) => {
        if (membersList.length === 0) return null;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        {icon} {title}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{membersList.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {membersList.map(m => <MemberCard key={m._id} member={m} />)}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-8 w-full space-y-6 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-slate-200 pb-6">
                <button
                    onClick={() => router.push('/panel')}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-3"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-slate-900">All Panel Members</h1>
                <p className="text-slate-500 font-medium tracking-wide mt-2">Browse all panel members organized by semester and department</p>
            </header>

            <section>
                <SemesterTabs semesters={availableSemesters} activeTab={semesterFilter} onTabChange={setSemesterFilter} counts={semesterCounts} />
            </section>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Search by name or designation..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 bg-slate-100 rounded-xl p-1.5 shadow-sm flex-wrap">
                    {['All', 'Core', ...DEPARTMENTS.map(d => d.id)].map(dept => (
                        <button key={dept} onClick={() => setDeptFilter(dept)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${deptFilter === dept ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
                            {dept === 'Core' ? 'Core Council' : dept === 'All' ? 'All' : DEPARTMENTS.find(d => d.id === dept)?.name || dept}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Users className="w-4 h-4" />
                Showing <span className="text-slate-700">{filtered.length}</span> of {activeMembers.length} active members
                {semesterFilter !== 'all' && <span className="text-blue-600">in {semesterFilter}</span>}
            </div>

            <div className="space-y-10">
                {coreCouncil.length > 0 && <Section title="Core Council" icon={<Globe className="w-4 h-4 text-blue-500" />} membersList={coreCouncil} />}
                {byDept.map(dept => (
                    <Section key={dept.id} title={`${dept.name}`} icon={<span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span>} membersList={dept.members} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No members found.</p>
                </div>
            )}
        </div>
    );
}
