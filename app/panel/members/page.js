"use client";

import { useState, useRef } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { canViewScore } from '../data/permissions';
import { Search, Filter, Globe, Users, Plus, X, Trash2, Key, Pencil, UserCheck } from 'lucide-react';
import { ROLE_HIERARCHY } from '../data/panelData';

export default function MembersPage() {
    const { members, alumni, currentUser, DEPARTMENTS, addMember, updateMember, retireMember, removeMember, updatePassword, fetchAlumni } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [statusTab, setStatusTab] = useState('active');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resettingMember, setResettingMember] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const fileInputRef = useRef(null);

    const isAdmin = currentUser?.isAdmin === true;
    const displayList = statusTab === 'alumni' ? alumni : members;

    const filteredMembers = displayList.filter(m => {
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
        const isAlumni = member.status === 'alumni';
        return (
            <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
                <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                        <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-10 h-10 text-xs shadow-sm" />
                        <div>
                            <p className="font-bold text-[#1A2B1E] group-hover:text-[#4A7C59] transition-colors">{member.name}</p>
                            {isAlumni && member.semesterLeft && (
                                <p className="text-[10px] text-gray-400 font-medium">Left: {member.semesterLeft}</p>
                            )}
                            {member.semesterJoined && (
                                <p className="text-[10px] text-gray-400 font-medium">Joined: {member.semesterJoined}</p>
                            )}
                            <div className="md:hidden mt-1">
                                <DeptBadge department={member.department} />
                            </div>
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
                            {!isAlumni && (
                                <>
                                    <button
                                        onClick={() => { setEditingMember(member); setIsEditModalOpen(true); }}
                                        className="p-2 hover:bg-blue-50 text-gray-300 hover:text-blue-500 rounded-lg transition-all"
                                        title="Edit Member"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { setResettingMember(member); setIsResetModalOpen(true); }}
                                        className="p-2 hover:bg-[#EBF4E6] text-gray-300 hover:text-[#4A7C59] rounded-lg transition-all"
                                        title="Reset Password"
                                    >
                                        <Key className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Retire ${member.name}? They will be moved to Alumni and can no longer login.`)) {
                                                retireMember(member._id);
                                            }
                                        }}
                                        className="p-2 hover:bg-amber-50 text-gray-300 hover:text-amber-500 rounded-lg transition-all"
                                        title="Retire to Alumni"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                            {isAlumni && (
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Permanently delete ${member.name}? This cannot be undone.`)) {
                                            removeMember(member._id);
                                        }
                                    }}
                                    className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"
                                    title="Delete Permanently"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    const SectionTable = ({ title, icon: Icon, membersList, emptyMsg }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1A2B1E] uppercase tracking-widest flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#4A7C59]" /> {title}
                </h2>
                <span className="text-xs font-bold text-[#7A9080] bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    {membersList.length} Members
                </span>
            </div>
            {membersList.length > 0 ? (
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
                        <tbody className="divide-y divide-gray-50">
                            {membersList.map(m => <MemberRow key={m._id} member={m} />)}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-10 text-center text-gray-400 text-sm">{emptyMsg}</div>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-[#D6E4D8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-yeseva text-[#1A2B1E]">Panel Members</h1>
                    <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                        Directory of all panel members and hierarchy
                    </p>
                </div>
                {isAdmin && (
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-[#1E3A28] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#2E5940] transition-all shadow-md active:scale-95">
                        <Plus className="w-5 h-5" /> Add Panel Member
                    </button>
                )}
            </header>

            {/* Status Tabs */}
            <div className="flex gap-2 bg-white border border-[#D6E4D8] rounded-xl p-1.5 w-fit shadow-sm">
                {[{ key: 'active', label: 'Active', count: members.length }, { key: 'alumni', label: 'Alumni', count: alumni.length }].map(tab => (
                    <button key={tab.key} onClick={() => { setStatusTab(tab.key); if (tab.key === 'alumni') fetchAlumni(); }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusTab === tab.key ? 'bg-[#1E3A28] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                        {tab.label} <span className="opacity-60 text-xs">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5" />
                    <input type="text" placeholder="Search by name or designation..."
                        className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] shadow-[0_2px_12px_rgba(46,89,64,0.04)]"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative shrink-0">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5 pointer-events-none" />
                    <select className="bg-white border border-[#D6E4D8] rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-[#1A2B1E] font-medium shadow-[0_2px_12px_rgba(46,89,64,0.04)] appearance-none"
                        value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                        <option value="All">All Departments</option>
                        <option value="Core">Core Council</option>
                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Core Council Section */}
            {coreCouncil.length > 0 && (
                <SectionTable title="Core Council" icon={Globe} membersList={coreCouncil} emptyMsg="No core council members" />
            )}

            {/* Department Sections */}
            <div className="space-y-12">
                {byDept.map(dept => (
                    dept.members.length > 0 && (
                        <SectionTable key={dept.id} title={`${dept.id} — ${dept.name}`} icon={() => <span className={`w-2.5 h-2.5 rounded-full ${dept.color.split(' ')[0]}`}></span>}
                            membersList={dept.members} emptyMsg={`No ${dept.name} members`} />
                    )
                ))}
            </div>

            {filteredMembers.length === 0 && (
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
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={async (e) => {
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
                        }} className="p-8 space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Full Name</label>
                                    <input required name="name" type="text" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" placeholder="e.g. John Doe" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input name="imageUrl" type="url" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm"
                                                placeholder="https://example.com/photo.jpg" value={uploadedImageUrl} onChange={(e) => setUploadedImageUrl(e.target.value)} />
                                        </div>
                                        <div className="shrink-0">
                                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                            <button type="button" onClick={() => fileInputRef.current.click()} disabled={isUploading}
                                                className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${isUploading ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-[#EBF4E6] text-[#2E5940] border-[#D6E4D8] hover:bg-[#D6E4D8]'}`}>
                                                {isUploading ? <span className="w-4 h-4 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin"></span> : <Plus className="w-4 h-4" />}
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Designation</label>
                                        <select required name="designation" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                            {Object.keys(ROLE_HIERARCHY).map(role => <option key={role} value={role}>{role}</option>)}
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
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-[0.98]">Create Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {isEditModalOpen && editingMember && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#F7F3EE] w-full max-w-lg rounded-3xl shadow-2xl border border-[#D6E4D8] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-[#D6E4D8] flex justify-between items-center bg-white/50">
                            <h2 className="text-xl font-yeseva text-[#1A2B1E]">Edit Member — {editingMember.name}</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            await updateMember(editingMember._id, {
                                designation: formData.get('designation'),
                                rankLevel: parseInt(formData.get('rankLevel')),
                                department: formData.get('department') || null,
                            });
                            setIsEditModalOpen(false);
                            setEditingMember(null);
                        }} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Designation</label>
                                    <select required name="designation" defaultValue={editingMember.designation} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                        {Object.keys(ROLE_HIERARCHY).map(role => <option key={role} value={role}>{role}</option>)}
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
                                <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Rank Level</label>
                                <select required name="rankLevel" defaultValue={editingMember.rankLevel} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                    {Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]).map(([role, level]) => (
                                        <option key={role} value={level}>{role} (Level {level})</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-medium">
                                The old role will be saved in role history before updating.
                            </p>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-[0.98]">Update Member</button>
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
                            <button onClick={() => setIsResetModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="text-center">
                                <p className="text-[#7A9080] font-medium">Set a new password for</p>
                                <p className="text-lg font-bold text-[#1A2B1E]">{resettingMember.name}</p>
                            </div>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                await updatePassword(resettingMember._id, formData.get('newPassword'));
                                setIsResetModalOpen(false);
                                setResettingMember(null);
                            }} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">New Password</label>
                                    <input required name="newPassword" type="text" className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" placeholder="Enter new password" />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsResetModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-[2] py-3 px-6 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-[0.98]">Update Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
