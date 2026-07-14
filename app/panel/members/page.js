"use client";

import { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { canViewScore } from '../data/permissions';
import { Search, Filter, Globe, Users, Plus, X, Trash2, Key, Edit3, ArrowUpCircle, UserMinus, UserX, GraduationCap, ArrowLeft } from 'lucide-react';
import { ROLE_HIERARCHY } from '../data/panelData';
import { useRouter } from 'next/navigation';

export default function MembersPage() {
    const { members, alumni, currentUser, DEPARTMENTS, addMember, removeMember, updatePassword, updateMember, retireMember, kickMember } = useDashboard();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'alumni'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resettingMember, setResettingMember] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const fileInputRef = useRef(null);
    const [alumniList, setAlumniList] = useState([]);
    const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);

    const isAdmin = currentUser?.isAdmin === true;

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

    const openEditModal = (member) => {
        setEditingMember(member);
        setUploadedImageUrl(member.imageUrl || '');
        setIsEditModalOpen(true);
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
            <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
                <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                        <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-10 h-10 text-xs shadow-sm" />
                        <div>
                            <p className="font-bold text-[#1A2B1E] group-hover:text-[#4A7C59] transition-colors">{member.name}</p>
                            <div className="md:hidden mt-1">
                                <DeptBadge department={member.department} />
                            </div>
                            {isAlumniOrKicked && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    member.status === 'kicked'
                                        ? 'text-red-600 bg-red-50 border-red-100'
                                        : 'text-[#4A7C59] bg-[#EBF4E6] border-[#D6E4D8]'
                                }`}>
                                    {member.status === 'kicked' ? 'Removed' : 'Alumni'}
                                </span>
                            )}
                        </div>
                    </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#4A7C59]">{member.designation}</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell">
                    <DeptBadge department={member.department} />
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right flex items-center justify-end gap-3">
                    <span className={`font-bold tabular-nums px-3 py-1 rounded-lg ${showScore ? 'text-[#2E5940] bg-[#EBF4E6]' : 'text-gray-300'}`}>
                        {showScore ? member.score : '——'}
                    </span>
                    {isAdmin && member._id !== 'env-admin' && (
                        <div className="flex items-center gap-1">
                            {activeTab === 'active' && (
                                <>
                                    <button
                                        onClick={() => openEditModal(member)}
                                        className="p-2 hover:bg-blue-50 text-gray-300 hover:text-blue-500 rounded-lg transition-all"
                                        title="Edit / Promote"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setResettingMember(member);
                                            setIsResetModalOpen(true);
                                        }}
                                        className="p-2 hover:bg-[#EBF4E6] text-gray-300 hover:text-[#4A7C59] rounded-lg transition-all"
                                        title="Reset Password"
                                    >
                                        <Key className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm(`Retire ${member.name} to alumni?`)) {
                                                await retireMember(member._id, 'retired');
                                            }
                                        }}
                                        className="p-2 hover:bg-amber-50 text-gray-300 hover:text-amber-600 rounded-lg transition-all"
                                        title="Retire to Alumni"
                                    >
                                        <GraduationCap className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm(`Remove ${member.name} from the club? This is different from retirement.`)) {
                                                await kickMember(member._id);
                                            }
                                        }}
                                        className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"
                                        title="Remove from Club"
                                    >
                                        <UserX className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </td>
            </tr>
        );
    };

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
                    <h1 className="text-3xl font-yeseva text-[#1A2B1E]">Panel Members</h1>
                    <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                        Directory of all panel members, hierarchy, and lifecycle management
                    </p>
                </div>
                {isAdmin && activeTab === 'active' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#1E3A28] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#2E5940] transition-all shadow-md active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Add Panel Member
                    </button>
                )}
            </header>

            {/* Active / Alumni Tabs */}
            <div className="flex gap-2 bg-white border border-[#D6E4D8] rounded-xl p-1.5 shadow-sm w-fit">
                {[
                    { id: 'active', label: 'Active Members', icon: Users },
                    { id: 'alumni', label: 'Alumni & Former', icon: GraduationCap },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === tab.id
                                ? 'bg-[#1E3A28] text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or designation..."
                        className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] shadow-[0_2px_12px_rgba(46,89,64,0.04)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative shrink-0">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5 pointer-events-none" />
                    <select
                        className="bg-white border border-[#D6E4D8] rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-[#1A2B1E] font-medium shadow-[0_2px_12px_rgba(46,89,64,0.04)] appearance-none"
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
                        <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-[#1A2B1E] uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-[#4A7C59]" /> Core Council
                                </h2>
                                <span className="text-xs font-bold text-[#7A9080] bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    {coreCouncil.length} Members
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Member</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Designation</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest hidden md:table-cell">Dept Scope</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coreCouncil.map(m => <MemberRow key={m._id} member={m} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="space-y-12">
                        {byDept.map(dept => {
                            if (dept.members.length === 0) return null;
                            return (
                                <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                                        <h2 className="text-sm font-bold text-[#1A2B1E] uppercase tracking-widest flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span>
                                            {dept.id} — {dept.name}
                                        </h2>
                                        <span className="text-xs font-bold text-[#7A9080] bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                            {dept.members.length} Members
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="bg-gray-50/50">
                                                    <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest w-1/3">Member</th>
                                                    <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Designation</th>
                                                    <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest hidden md:table-cell">Dept</th>
                                                    <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest text-right">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
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
                        <div className="py-20 text-center text-[#7A9080]">
                            <div className="w-8 h-8 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm font-medium">Loading alumni...</p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="py-20 text-center text-[#7A9080]">
                            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">No alumni found.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Member</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Designation</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest hidden md:table-cell">Dept</th>
                                            <th className="py-3 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest text-right">Score</th>
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
                <div className="py-20 text-center text-[#7A9080]">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No panel members found.</p>
                </div>
            )}

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#F7F3EE] w-full max-w-lg rounded-3xl shadow-2xl border border-[#D6E4D8] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-[#D6E4D8] flex justify-between items-center bg-white/50">
                            <h2 className="text-xl font-yeseva text-[#1A2B1E]">Add New Panel Member</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-6 h-6" />
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
                            className="p-8 space-y-5"
                        >
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Full Name</label>
                                    <input required name="name" type="text" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                name="imageUrl"
                                                type="url"
                                                className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm"
                                                placeholder="https://example.com/photo.jpg"
                                                value={uploadedImageUrl}
                                                onChange={(e) => setUploadedImageUrl(e.target.value)}
                                            />
                                        </div>
                                        <div className="shrink-0">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                disabled={isUploading}
                                                className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${isUploading
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : 'bg-[#EBF4E6] text-[#2E5940] border-[#D6E4D8] hover:bg-[#D6E4D8]'
                                                    }`}
                                            >
                                                {isUploading ? (
                                                    <span className="w-4 h-4 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-[#7A9080] ml-1 mt-1 font-medium">Upload an image to Cloudinary or paste a direct URL</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Designation</label>
                                        <select required name="designation" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                            {Object.keys(ROLE_HIERARCHY).map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Department</label>
                                        <select name="department" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                            <option value="">Global / None</option>
                                            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Rank Level (Hierarchy)</label>
                                    <select required name="rankLevel" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                        {Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]).map(([role, level]) => (
                                            <option key={role} value={level}>{role} (Level {level})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Username</label>
                                        <input required name="username" type="text" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" placeholder="Login username" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Password</label>
                                        <input required name="password" type="password" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" placeholder="Login password" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-[0.98]">
                                    Create Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit / Promote Modal */}
            {isEditModalOpen && editingMember && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#F7F3EE] w-full max-w-lg rounded-3xl shadow-2xl border border-[#D6E4D8] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-[#D6E4D8] flex justify-between items-center bg-white/50">
                            <div>
                                <h2 className="text-xl font-yeseva text-[#1A2B1E]">Edit / Promote Member</h2>
                                <p className="text-sm text-[#7A9080] mt-1">{editingMember.name}</p>
                            </div>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingMember(null); setUploadedImageUrl(''); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const newRank = parseInt(formData.get('rankLevel'));
                                const updates = {
                                    name: formData.get('name'),
                                    designation: formData.get('designation'),
                                    department: formData.get('department') || null,
                                    rankLevel: newRank,
                                    imageUrl: uploadedImageUrl || formData.get('imageUrl'),
                                };
                                await updateMember(editingMember._id, updates);
                                setIsEditModalOpen(false);
                                setEditingMember(null);
                                setUploadedImageUrl('');
                            }}
                            className="p-8 space-y-5"
                        >
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Full Name</label>
                                    <input required name="name" type="text" defaultValue={editingMember.name} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Profile Picture URL</label>
                                    <input
                                        name="imageUrl"
                                        type="url"
                                        className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm"
                                        value={uploadedImageUrl}
                                        onChange={(e) => setUploadedImageUrl(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Designation</label>
                                        <select required name="designation" defaultValue={editingMember.designation} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                            {Object.keys(ROLE_HIERARCHY).map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Department</label>
                                        <select name="department" defaultValue={editingMember.department || ''} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                            <option value="">Global / None</option>
                                            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Rank Level (Hierarchy)</label>
                                    <select required name="rankLevel" defaultValue={editingMember.rankLevel} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                        {Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]).map(([role, level]) => (
                                            <option key={role} value={level}>{role} (Level {level})</option>
                                        ))}
                                    </select>
                                </div>
                                {editingMember.roleHistory && editingMember.roleHistory.length > 0 && (
                                    <div className="bg-white border border-[#D6E4D8] rounded-xl p-4">
                                        <p className="text-xs font-bold text-[#7A9080] uppercase tracking-wider mb-2">Role History</p>
                                        <div className="space-y-1">
                                            {editingMember.roleHistory.map((rh, i) => (
                                                <p key={i} className="text-sm text-[#1A2B1E]">
                                                    {rh.designation} ({rh.semester || 'N/A'})
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingMember(null); setUploadedImageUrl(''); }} className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
                                    <ArrowUpCircle className="w-5 h-5" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetModalOpen && resettingMember && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#F7F3EE] w-full max-w-md rounded-3xl shadow-2xl border border-[#D6E4D8] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-[#D6E4D8] flex justify-between items-center bg-white/50">
                            <h2 className="text-xl font-yeseva text-[#1A2B1E]">Reset Password</h2>
                            <button onClick={() => setIsResetModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="text-center">
                                <p className="text-[#7A9080] font-medium">Set a new password for</p>
                                <p className="text-lg font-bold text-[#1A2B1E]">{resettingMember.name}</p>
                            </div>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    await updatePassword(resettingMember._id, formData.get('newPassword'));
                                    setIsResetModalOpen(false);
                                    setResettingMember(null);
                                }}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">New Password</label>
                                    <input required name="newPassword" type="text" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" placeholder="Enter new password" />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsResetModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-[0.98]">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
