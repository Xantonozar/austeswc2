"use client";

import { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { canViewScore } from '../data/permissions';
import { Search, Filter, Globe, Users, Plus, X, ArrowLeft, GraduationCap } from 'lucide-react';
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
                .then(data => {
                    setAlumniList((data.members || []).filter(m => m.status === 'alumni' || m.status === 'kicked'));
                })
                .catch(console.error)
                .finally(() => setIsLoadingAlumni(false));
        }
    }, [activeTab]);

    const displayMembers = activeTab === 'active' ? members : alumniList;

    const filteredMembers = displayMembers.filter(m => {
        if (m._id === 'env-admin') return false;
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.designation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === 'All' || m.department === filterDept;
        if (filterDept !== 'All' && !m.department && filterDept !== 'Core') return false;
        if (filterDept === 'Core' && m.department) return false;
        return matchesSearch && matchesDept;
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64 = reader.result;
                const response = await fetch('/api/panel/upload-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64 }),
                });
                const data = await response.json();
                if (data.url) {
                    setUploadedImageUrl(data.url);
                } else {
                    alert('Upload failed: ' + (data.error || 'Unknown error'));
                }
                setIsUploading(false);
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
            setIsUploading(false);
        }
    };

    const coreCouncil = filteredMembers.filter(m => !m.department).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0));
    const byDept = DEPARTMENTS.map(dept => ({
        ...dept,
        members: filteredMembers.filter(m => m.department === dept.id).sort((a, b) => (b.rankLevel || 0) - (a.rankLevel || 0))
    }));

    const MemberRow = ({ member }) => {
        const showScore = canViewScore(currentUser, member);
        const isAlumniOrKicked = member.status === 'alumni' || member.status === 'kicked';
        return (
            <tr
                onClick={() => router.push(`/panel/members/${member._id}`)}
                className="hover:bg-blue-50/50 transition-all group border-b border-slate-100 last:border-0 cursor-pointer"
            >
                <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                        <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-10 h-10 text-xs shadow-sm" />
                        <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</p>
                            <div className="md:hidden mt-1">
                                <DeptBadge department={member.department} />
                            </div>
                            {isAlumniOrKicked && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${
                                    member.status === 'kicked'
                                        ? 'text-red-600 bg-red-50 border-red-100'
                                        : 'text-blue-600 bg-blue-50 border-blue-100'
                                }`}>
                                    {member.status === 'kicked' ? 'Removed' : 'Alumni'}
                                </span>
                            )}
                        </div>
                    </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">{member.designation}</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell">
                    <DeptBadge department={member.department} />
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right">
                    <span className={`font-bold tabular-nums px-3 py-1.5 rounded-lg text-sm ${showScore ? 'text-blue-700 bg-blue-50' : 'text-slate-300'}`}>
                        {showScore ? member.score : '——'}
                    </span>
                </td>
            </tr>
        );
    };

    return (
        <div className="p-6 lg:p-8 w-full space-y-6 animate-in fade-in duration-500 pb-20">

            <header className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <button
                        onClick={() => router.push('/panel')}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Panel Members</h1>
                    <p className="text-slate-500 font-medium tracking-wide mt-2">
                        Directory of all panel members, hierarchy, and lifecycle management
                    </p>
                </div>
                {isAdmin && activeTab === 'active' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Add Member
                    </button>
                )}
            </header>

            {/* Active / Alumni Tabs */}
            <div className="flex gap-2 bg-slate-100 rounded-xl p-1.5 w-fit">
                {[
                    { id: 'active', label: 'Active Members', icon: Users, count: members.length },
                    { id: 'alumni', label: 'Alumni & Former', icon: GraduationCap, count: alumniList.length },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or designation..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative shrink-0">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <select
                        className="bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 font-medium shadow-sm appearance-none transition-all"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        <option value="Core">Core Council</option>
                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Active Members View */}
            {activeTab === 'active' && (
                <>
                    {coreCouncil.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500" /> Core Council
                                </h2>
                                <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                    {coreCouncil.length} Members
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50/80">
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Dept Scope</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coreCouncil.map(m => <MemberRow key={m._id} member={m} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        {byDept.map(dept => {
                            if (dept.members.length === 0) return null;
                            return (
                                <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span>
                                            {dept.id} — {dept.name}
                                        </h2>
                                        <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                            {dept.members.length} Members
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="bg-slate-50/80">
                                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/3">Member</th>
                                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</th>
                                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Dept</th>
                                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {dept.members.map(m => <MemberRow key={m._id} member={m} />)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Alumni View */}
            {activeTab === 'alumni' && (
                <>
                    {isLoadingAlumni ? (
                        <div className="py-20 text-center text-slate-400">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm font-medium">Loading alumni...</p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="py-20 text-center text-slate-400">
                            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">No alumni found.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50/80">
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Dept</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMembers.map(m => <MemberRow key={m._id} member={m} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {filteredMembers.length === 0 && activeTab === 'active' && (
                <div className="py-20 text-center text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No panel members found.</p>
                </div>
            )}

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Add New Panel Member</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = {
                                    name: formData.get('name'),
                                    designation: formData.get('designation'),
                                    department: formData.get('department') || null,
                                    rankLevel: parseInt(formData.get('rankLevel')),
                                    username: formData.get('username').toLowerCase(),
                                    password: formData.get('password'),
                                    imageUrl: uploadedImageUrl || formData.get('imageUrl'),
                                };
                                await addMember(data);
                                setIsAddModalOpen(false);
                                setUploadedImageUrl('');
                            }}
                            className="p-6 space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <input required name="name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                name="imageUrl"
                                                type="url"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="https://example.com/photo.jpg"
                                                value={uploadedImageUrl}
                                                onChange={(e) => setUploadedImageUrl(e.target.value)}
                                            />
                                        </div>
                                        <div className="shrink-0">
                                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                disabled={isUploading}
                                                className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${isUploading ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}
                                            >
                                                {isUploading ? <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span> : <Plus className="w-4 h-4" />}
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</label>
                                        <select required name="designation" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all">
                                            {Object.keys(ROLE_HIERARCHY).map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                        <select name="department" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all">
                                            <option value="">Global / None</option>
                                            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rank Level</label>
                                    <select required name="rankLevel" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all">
                                        {Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]).map(([role, level]) => (
                                            <option key={role} value={level}>{role} (Level {level})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                                        <input required name="username" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Login username" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                        <input required name="password" type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Login password" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3 border-t border-slate-100">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]">
                                    Create Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
