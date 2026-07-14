"use client";

import { useState, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { Search, Users, Calendar, Award } from 'lucide-react';

export default function AlumniPage() {
    const { alumni, currentUser, DEPARTMENTS, fetchAlumni } = useDashboard();
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');

    useEffect(() => {
        fetchAlumni();
    }, [fetchAlumni]);

    const filtered = alumni.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.designation.toLowerCase().includes(search.toLowerCase());
        const matchesDept = deptFilter === 'All' || m.department === deptFilter || (deptFilter === 'Core' && !m.department);
        return matchesSearch && matchesDept;
    });

    const coreCouncil = filtered.filter(m => !m.department).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0));
    const byDept = DEPARTMENTS.map(dept => ({
        ...dept,
        members: filtered.filter(m => m.department === dept.id).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0))
    }));

    const AlumniCard = ({ member }) => (
        <div className="bg-white rounded-2xl border border-[#EBF4E6] p-5 hover:shadow-lg transition-all group opacity-80 hover:opacity-100">
            <div className="flex items-center gap-4">
                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-14 h-14 text-base shadow-md grayscale group-hover:grayscale-0 transition-all" />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1A2B1E] truncate">{member.name}</p>
                    <p className="text-sm text-[#4A7C59] font-semibold">{member.designation}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <DeptBadge department={member.department} />
                        {member.semesterJoined && (
                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Joined: {member.semesterJoined}
                            </span>
                        )}
                        {member.semesterLeft && (
                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                Left: {member.semesterLeft}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Award className="w-4 h-4" />
                        <p className="text-lg font-black">{member.score}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Final Score</p>
                </div>
            </div>
            {member.roleHistory && member.roleHistory.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Previous Roles</p>
                    <div className="flex flex-wrap gap-1">
                        {member.roleHistory.map((rh, i) => (
                            <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                                {rh.designation} ({rh.semester})
                            </span>
                        ))}
                    </div>
                </div>
            )}
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
                    {membersList.map(m => <AlumniCard key={m._id} member={m} />)}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-[#D6E4D8] pb-6">
                <h1 className="text-3xl font-yeseva text-[#1A2B1E]">Alumni</h1>
                <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                    Former panel members who have retired from active service
                </p>
            </header>

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
                <span className="text-[#1A2B1E]">{filtered.length}</span> alumni members
            </div>

            {/* Alumni */}
            <div className="space-y-10">
                {coreCouncil.length > 0 && (
                    <Section title="Core Council" icon={Users} membersList={coreCouncil} />
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
                    <p className="text-lg font-medium">No alumni found.</p>
                    <p className="text-sm mt-1">Retired panel members will appear here.</p>
                </div>
            )}
        </div>
    );
}
