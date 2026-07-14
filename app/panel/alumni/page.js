"use client";

import { useState, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { Search, GraduationCap, Calendar, ArrowLeft, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AlumniPage() {
    const { currentUser, fetchAlumni, DEPARTMENTS } = useDashboard();
    const router = useRouter();
    const [alumniList, setAlumniList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'alumni', 'kicked'

    useEffect(() => {
        const loadAlumni = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/panel/members?status=all', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setAlumniList((data.members || []).filter(m => m.status === 'alumni' || m.status === 'kicked'));
            } catch (error) {
                console.error('Error fetching alumni:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAlumni();
    }, []);

    const filtered = alumniList.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.designation.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || m.status === filterType;
        return matchesSearch && matchesType;
    });

    const alumniOnly = alumniList.filter(m => m.status === 'alumni');
    const kickedOnly = alumniList.filter(m => m.status === 'kicked');

    const AlumniCard = ({ member }) => (
        <div className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-lg group ${
            member.status === 'kicked' ? 'border-red-200 hover:border-red-300' : 'border-[#EBF4E6] hover:border-[#4A7C59]/20'
        }`}>
            <div className="flex items-center gap-4">
                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-14 h-14 text-base shadow-md" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1A2B1E] group-hover:text-[#4A7C59] transition-colors truncate">{member.name}</p>
                        {member.status === 'kicked' && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Kicked</span>
                        )}
                        {member.status === 'alumni' && (
                            <span className="text-[10px] font-bold text-[#4A7C59] bg-[#EBF4E6] px-2 py-0.5 rounded-full border border-[#D6E4D8]">Alumni</span>
                        )}
                    </div>
                    <p className="text-sm text-[#4A7C59] font-semibold">{member.designation}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <DeptBadge department={member.department} />
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-lg font-black text-[#2E5940]">{member.score}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Final Score</p>
                </div>
            </div>
            {(member.semesterLeft || member.leftAt) && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-[#7A9080]">
                    {member.semesterJoined && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Joined: {member.semesterJoined}
                        </span>
                    )}
                    {member.semesterLeft && (
                        <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> Left: {member.semesterLeft}
                        </span>
                    )}
                    {member.leftReason && (
                        <span className={`font-medium ${member.status === 'kicked' ? 'text-red-500' : ''}`}>
                            {member.leftReason}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-[#D6E4D8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <button
                        onClick={() => router.push('/panel')}
                        className="flex items-center gap-2 text-sm font-medium text-[#7A9080] hover:text-[#4A7C59] transition-colors mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-yeseva text-[#1A2B1E]">Alumni & Former Members</h1>
                    <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                        Members who have left or been removed from the panel
                    </p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#EBF4E6] p-5">
                    <p className="text-xs font-bold text-[#7A9080] uppercase tracking-wider">Total Former Members</p>
                    <p className="text-3xl font-black text-[#1A2B1E] mt-1">{alumniList.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-[#EBF4E6] p-5">
                    <p className="text-xs font-bold text-[#7A9080] uppercase tracking-wider">Voluntarily Left</p>
                    <p className="text-3xl font-black text-[#4A7C59] mt-1">{alumniOnly.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                    <p className="text-xs font-bold text-[#7A9080] uppercase tracking-wider">Removed from Club</p>
                    <p className="text-3xl font-black text-red-500 mt-1">{kickedOnly.length}</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or designation..."
                        className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 bg-white border border-[#D6E4D8] rounded-xl p-1.5 shadow-sm">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'alumni', label: 'Alumni' },
                        { id: 'kicked', label: 'Removed' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterType(tab.id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                filterType === tab.id
                                    ? 'bg-[#1E3A28] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alumni List */}
            {isLoading ? (
                <div className="py-20 text-center text-[#7A9080]">
                    <div className="w-8 h-8 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-medium">Loading alumni...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-[#7A9080]">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No alumni found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(m => <AlumniCard key={m._id} member={m} />)}
                </div>
            )}
        </div>
    );
}
