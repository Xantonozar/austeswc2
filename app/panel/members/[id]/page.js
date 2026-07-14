"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDashboard } from '../../components/PanelDashboardProvider';
import Avatar from '../../components/Avatar';
import DeptBadge from '../../components/DeptBadge';
import { ROLE_HIERARCHY } from '../../data/panelData';
import { ArrowLeft, Edit3, ArrowUpCircle, GraduationCap, UserX, Key, Save, X, Calendar, Star, History, ChevronRight, Shield, Award, Clock, TrendingUp } from 'lucide-react';

export default function MemberDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { members, alumni, currentUser, DEPARTMENTS, updateMember, updatePassword, retireMember, kickMember } = useDashboard();
    const [member, setMember] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isPromoting, setIsPromoting] = useState(false);
    const [isResetPwd, setIsResetPwd] = useState(false);
    const [form, setForm] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const isAdmin = currentUser?.isAdmin === true || (currentUser?.rankLevel >= 6);

    useEffect(() => {
        const found = members.find(m => m._id === id) || alumni.find(m => m._id === id);
        if (found) {
            setMember(found);
            setForm({ name: found.name, designation: found.designation, department: found.department || '', rankLevel: found.rankLevel, imageUrl: found.imageUrl || '' });
        }
    }, [id, members, alumni]);

    if (!member) {
        return (
            <div className="p-6 lg:p-8 w-full animate-in fade-in duration-500 pb-20">
                <button onClick={() => router.push('/panel/members')} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Members
                </button>
                <div className="py-20 text-center text-slate-400">Member not found.</div>
            </div>
        );
    }

    const handleSaveEdit = async () => {
        await updateMember(member._id, { name: form.name, designation: form.designation, department: form.department || null, rankLevel: parseInt(form.rankLevel), imageUrl: form.imageUrl });
        setIsEditing(false);
    };

    const handlePromote = async () => {
        const entries = Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]);
        const currentIdx = entries.findIndex(([, lvl]) => lvl === member.rankLevel);
        if (currentIdx < entries.length - 1) {
            const [nextRole, nextLevel] = entries[currentIdx + 1];
            await updateMember(member._id, {
                designation: nextRole, rankLevel: nextLevel,
                roleHistory: [...(member.roleHistory || []), { designation: member.designation, rankLevel: member.rankLevel, department: member.department, semester: getCurrentSemester() }],
            });
            setIsPromoting(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.trim()) { await updatePassword(member._id, newPassword); setIsResetPwd(false); setNewPassword(''); }
    };

    const getCurrentSemester = () => {
        const now = new Date(); const month = now.getMonth(); const year = now.getFullYear();
        return month >= 0 && month < 5 ? `Spring ${year}` : `Fall ${year}`;
    };

    const entries = Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]);
    const currentIdx = entries.findIndex(([, lvl]) => lvl === member.rankLevel);
    const nextRole = currentIdx < entries.length - 1 ? entries[currentIdx + 1] : null;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'history', label: 'History' },
        { id: 'evaluations', label: 'Evaluations' },
    ];

    return (
        <div className="w-full animate-in fade-in duration-500 pb-20">

            {/* Profile Cover */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 via-blue-700 to-violet-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            </div>

            <div className="px-6 lg:px-8 -mt-16 relative z-10">
                <div className="max-w-6xl mx-auto">

                    {/* Profile Header Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                            <div className="relative">
                                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-28 h-28 text-3xl shadow-2xl border-4 border-white" />
                                {member.status === 'active' && (
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold text-slate-900">{member.name}</h1>
                                    {member.status === 'alumni' && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Alumni</span>}
                                    {member.status === 'kicked' && <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">Removed</span>}
                                </div>
                                <p className="text-blue-600 font-semibold mt-1">{member.designation}</p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    <DeptBadge department={member.department} />
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">Rank {member.rankLevel}</span>
                                    {member.semesterJoined && <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {member.semesterJoined}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-center bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl px-6 py-4 border border-blue-100">
                                    <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{member.score}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Points</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isAdmin && member.status !== 'alumni' && member.status !== 'kicked' && (
                            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                                {nextRole && (
                                    <button onClick={() => setIsPromoting(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/20 text-sm active:scale-95">
                                        <ArrowUpCircle className="w-4 h-4" /> Promote to {nextRole[0]}
                                    </button>
                                )}
                                <button onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-sm active:scale-95">
                                    <Edit3 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => setIsResetPwd(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-sm active:scale-95">
                                    <Key className="w-4 h-4" /> Password
                                </button>
                                <div className="flex-1"></div>
                                <button onClick={async () => { if (window.confirm(`Retire ${member.name} to alumni?`)) { await retireMember(member._id, 'retired'); router.push('/panel/members'); } }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 text-sm active:scale-95">
                                    <GraduationCap className="w-4 h-4" /> Retire
                                </button>
                                <button onClick={async () => { if (window.confirm(`Remove ${member.name}?`)) { await kickMember(member._id); router.push('/panel/members'); } }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-md shadow-red-500/20 text-sm active:scale-95">
                                    <UserX className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 w-fit mb-6">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Details</h3>
                                <div className="space-y-3">
                                    {[
                                        ['Username', member.username],
                                        ['Designation', member.designation],
                                        ['Rank Level', member.rankLevel],
                                        ['Department', member.department || 'Global'],
                                        ['Status', member.status || 'active'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                            <span className="text-sm text-slate-400">{label}</span>
                                            <span className="text-sm font-semibold text-slate-900">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Stats</h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-4 border border-blue-100">
                                        <p className="text-3xl font-black text-blue-700">{member.score}</p>
                                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mt-1">Total Score</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-3xl font-black text-slate-700">{member.evaluationHistory?.length || 0}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Evaluations</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Timeline</h3>
                                <div className="space-y-3">
                                    {member.semesterJoined && (
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <div><p className="text-sm font-bold text-slate-900">Joined</p><p className="text-xs text-slate-500">{member.semesterJoined}</p></div>
                                        </div>
                                    )}
                                    {member.semesterLeft && (
                                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            <div><p className="text-sm font-bold text-slate-900">Left</p><p className="text-xs text-slate-500">{member.semesterLeft}</p></div>
                                        </div>
                                    )}
                                    {!member.semesterJoined && !member.semesterLeft && <p className="text-sm text-slate-400 italic">No timeline data</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><History className="w-4 h-4 text-blue-500" /> Role History</h3>
                            {member.roleHistory && member.roleHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {member.roleHistory.map((rh, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">{rh.rankLevel}</div>
                                            <div className="flex-1"><p className="font-bold text-slate-900">{rh.designation}</p><p className="text-xs text-slate-500">{rh.semester} {rh.department ? `· ${rh.department}` : ''}</p></div>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="py-12 text-center"><History className="w-10 h-10 mx-auto text-slate-200 mb-2" /><p className="text-slate-400 text-sm">No role changes yet.</p></div>}
                        </div>
                    )}

                    {activeTab === 'evaluations' && (
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-blue-500" /> Evaluation History</h3>
                            {member.evaluationHistory && member.evaluationHistory.length > 0 ? (
                                <div className="space-y-2">
                                    {[...member.evaluationHistory].reverse().map((ev, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <span className={`font-bold text-sm px-3 py-1.5 rounded-xl ${ev.points > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                                    {ev.points > 0 ? '+' : ''}{ev.points}
                                                </span>
                                                <span className="text-sm text-slate-700 font-medium">{ev.note}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{ev.date}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <div className="py-12 text-center"><Star className="w-10 h-10 mx-auto text-slate-200 mb-2" /><p className="text-slate-400 text-sm">No evaluations yet.</p></div>}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Edit Member</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name" />
                            <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Profile Picture URL" />
                            <div className="grid grid-cols-2 gap-3">
                                <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                    {Object.keys(ROLE_HIERARCHY).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                    <option value="">Global / None</option>
                                    {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <select value={form.rankLevel} onChange={e => setForm({ ...form, rankLevel: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                                {entries.map(([r, l]) => <option key={r} value={l}>{r} (Level {l})</option>)}
                            </select>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                            <button onClick={handleSaveEdit} className="flex-[2] py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Promote Modal */}
            {isPromoting && nextRole && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                            <ArrowUpCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Promote {member.name}?</h3>
                        <div className="bg-slate-50 rounded-2xl p-4 mt-4 flex items-center justify-center gap-4 border border-slate-100">
                            <div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-bold">Current</p><p className="font-bold text-slate-700">{member.designation}</p></div>
                            <ChevronRight className="w-5 h-5 text-blue-500" />
                            <div className="text-center"><p className="text-[10px] text-blue-600 uppercase font-bold">New</p><p className="font-bold text-blue-700">{nextRole[0]}</p></div>
                        </div>
                        <p className="text-slate-400 text-xs mt-4">Current role saved to history.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsPromoting(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                            <button onClick={handlePromote} className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/20">Promote</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetPwd && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Key className="w-7 h-7 text-amber-600" /></div>
                        <h3 className="text-xl font-bold text-slate-900 text-center">Reset Password</h3>
                        <p className="text-slate-500 text-sm text-center mt-1">For <strong>{member.name}</strong></p>
                        <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="w-full border border-slate-200 rounded-xl py-3 px-4 mt-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setIsResetPwd(false); setNewPassword(''); }} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                            <button onClick={handleResetPassword} className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md">Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
