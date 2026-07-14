"use client";

import { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { canViewScore } from '../data/permissions';
import { Search, Filter, Plus, X, ArrowLeft, GraduationCap, ChevronRight } from 'lucide-react';
import { ROLE_HIERARCHY } from '../data/panelData';
import { useRouter } from 'next/navigation';

export default function MembersPage() {
    const { members, alumni, currentUser, DEPARTMENTS, addMember } = useDashboard();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [activeTab, setActiveTab] = useState('active');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const fileInputRef = useRef(null);
    const [alumniList, setAlumniList] = useState([]);
    const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);

    const isAdmin = currentUser?.isAdmin === true || (currentUser?.rankLevel >= 6);

    useEffect(() => {
        if (activeTab === 'alumni') {
            setIsLoadingAlumni(true);
            fetch('/api/panel/members?status=all', { cache: 'no-store' })
                .then(res => res.json())
                .then(data => setAlumniList((data.members || []).filter(m => m.status === 'alumni' || m.status === 'kicked')))
                .catch(console.error)
                .finally(() => setIsLoadingAlumni(false));
        }
    }, [activeTab]);

    const displayMembers = activeTab === 'active' ? members : alumniList;
    const filteredMembers = displayMembers.filter(m => {
        if (m._id === 'env-admin') return false;
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.designation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || m.department === filterDept;
        if (filterDept !== 'All' && !m.department && filterDept !== 'Core') return false;
        if (filterDept === 'Core' && m.department) return false;
        return matchesSearch && matchesDept;
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const response = await fetch('/api/panel/upload-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: reader.result }) });
            const data = await response.json();
            if (data.url) setUploadedImageUrl(data.url);
            setIsUploading(false);
        };
    };

    const coreCouncil = filteredMembers.filter(m => !m.department).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0));
    const byDept = DEPARTMENTS.map(dept => ({
        ...dept,
        members: filteredMembers.filter(m => m.department === dept.id).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0))
    })).filter(d => d.members.length > 0);

    const MemberCard = ({ member }) => {
        const showScore = canViewScore(currentUser, member);
        return (
            <div onClick={() => router.push(`/panel/members/${member._id}`)}
                className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                    <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-12 h-12 text-sm shadow-md" />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm">{member.name}</p>
                        <p className="text-xs text-blue-600 font-semibold">{member.designation}</p>
                        <div className="mt-1.5"><DeptBadge department={member.department} /></div>
                    </div>
                    {showScore && <div className="text-right shrink-0"><p className="text-lg font-black text-slate-900">{member.score}</p></div>}
                </div>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-24 lg:pb-8">

            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 lg:px-12 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <button onClick={() => router.push('/panel')} className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors mb-2">
                            <ArrowLeft className="w-3 h-3" /> Dashboard
                        </button>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Panel Members</h1>
                        <p className="text-slate-400 text-sm mt-1">{filteredMembers.length} members</p>
                    </div>
                    {isAdmin && activeTab === 'active' && (
                        <button onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm">
                            <Plus className="w-4 h-4" /> Add Member
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mt-4">
                    {[
                        { id: 'active', label: 'Active', count: members.length },
                        { id: 'alumni', label: 'Alumni', count: alumniList.length },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                            {tab.label} <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="px-6 lg:px-12 py-4 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text" placeholder="Search members..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <select className="bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium shadow-sm appearance-none"
                        value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Core">Core</option>
                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 lg:px-12 space-y-8">
                {activeTab === 'active' ? (
                    <>
                        {coreCouncil.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"></span> Core Council ({coreCouncil.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                    {coreCouncil.map(m => <MemberCard key={m._id} member={m} />)}
                                </div>
                            </div>
                        )}
                        {byDept.map(dept => (
                            <div key={dept.id} className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${dept.color.split(' ')[0]}`}></span> {dept.name} ({dept.members.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                    {dept.members.map(m => <MemberCard key={m._id} member={m} />)}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    isLoadingAlumni ? (
                        <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="py-20 text-center"><GraduationCap className="w-12 h-12 mx-auto mb-4 text-slate-200" /><p className="text-slate-400">No alumni found.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                            {filteredMembers.map(m => <MemberCard key={m._id} member={m} />)}
                        </div>
                    )
                )}
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900">Add Member</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault(); const fd = new FormData(e.target);
                            await addMember({ name: fd.get('name'), designation: fd.get('designation'), department: fd.get('department') || null, rankLevel: parseInt(fd.get('rankLevel')), username: fd.get('username').toLowerCase(), password: fd.get('password'), imageUrl: uploadedImageUrl || fd.get('imageUrl') });
                            setIsAddModalOpen(false); setUploadedImageUrl('');
                        }} className="p-5 space-y-3">
                            <input required name="name" placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input name="imageUrl" type="url" placeholder="Profile URL" value={uploadedImageUrl} onChange={(e) => setUploadedImageUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            <div className="grid grid-cols-2 gap-3">
                                <select required name="designation" className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">{Object.keys(ROLE_HIERARCHY).map(r => <option key={r} value={r}>{r}</option>)}</select>
                                <select name="department" className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"><option value="">Global</option>{DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                            </div>
                            <select required name="rankLevel" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">{Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]).map(([r, l]) => <option key={r} value={l}>{r} ({l})</option>)}</select>
                            <div className="grid grid-cols-2 gap-3">
                                <input required name="username" placeholder="Username" className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                <input required name="password" type="password" placeholder="Password" className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 text-sm">Cancel</button>
                                <button type="submit" className="flex-[2] py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm shadow-lg shadow-blue-500/20">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
