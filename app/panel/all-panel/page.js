"use client";

import { useState } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import SemesterTabs, { getSemesterFromDate, getSemestersFromItems } from '@/components/dashboard/SemesterTabs';
import { Search, Globe, Users, Calendar } from 'lucide-react';

export default function AllPanelPage() {
    const { members, currentUser, DEPARTMENTS } = useDashboard();
    const [search, setSearch] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [deptFilter, setDeptFilter] = useState('All');

    const activeMembers = members.filter(m => m._id !== 'env-admin' && m.status !== 'alumni');

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
        <div className="bg-white rounded-2xl border border-[#EBF4E6] p-5 hover:shadow-lg hover:border-[#4A7C59]/20 transition-all group">
            <div className="flex items-center gap-4">
                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-14 h-14 text-base shadow-md" />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1A2B1E] group-hover:text-[#4A7C59] transition-colors truncate">{member.name}</p>
                    <p className="text-sm text-[#4A7C59] font-semibold">{member.designation}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <DeptBadge department={member.department} />
                        {member.semesterJoined && (
                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {member.semesterJoined}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-lg font-black text-[#2E5940]">{member.score}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Score</p>
                </div>
            </div>
        </div>
    );

    const Section = ({ title, icon: Icon, membersList }) => {
        if (membersList.length === 0) return null;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1A2B1E] uppercase tracking-widest flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#4A7C59]" /> {title}
                    </h3>
                    <span className="text-xs font-bold text-[#7A9080] bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        {membersList.length}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {membersList.map(m => <MemberCard key={m._id} member={m} />)}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-[#D6E4D8] pb-6">
                <h1 className="text-3xl font-yeseva text-[#1A2B1E]">All Panel Members</h1>
                <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                    Browse all panel members organized by semester and department
                </p>
            </header>

            {/* Semester Tabs */}
            <section>
                <SemesterTabs
                    semesters={availableSemesters}
                    activeTab={semesterFilter}
                    onTabChange={setSemesterFilter}
                    counts={semesterCounts}
                />
            </section>

            {/* Search + Dept Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5" />
                    <input type="text" placeholder="Search by name or designation..."
                        className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] shadow-sm"
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 bg-white border border-[#D6E4D8] rounded-xl p-1.5 shadow-sm flex-wrap">
                    {['All', 'Core', ...DEPARTMENTS.map(d => d.id)].map(dept => (
                        <button key={dept} onClick={() => setDeptFilter(dept)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${deptFilter === dept ? 'bg-[#1E3A28] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                            {dept === 'Core' ? 'Core Council' : dept === 'All' ? 'All' : DEPARTMENTS.find(d => d.id === dept)?.name || dept}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#7A9080]">
                <Users className="w-4 h-4" />
                Showing <span className="text-[#1A2B1E]">{filtered.length}</span> of {activeMembers.length} active members
                {semesterFilter !== 'all' && <span className="text-[#4A7C59]">in {semesterFilter}</span>}
            </div>

            {/* Members */}
            <div className="space-y-10">
                {coreCouncil.length > 0 && (
                    <Section title="Core Council" icon={Globe} membersList={coreCouncil} />
                )}
                {byDept.map(dept => (
                    <Section key={dept.id} title={`${dept.id} — ${dept.name}`}
                        icon={() => <span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span>}
                        membersList={dept.members} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center text-[#7A9080]">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No members found.</p>
                </div>
            )}
        </div>
    );
}
