"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDashboard } from '../../components/PanelDashboardProvider';
import Avatar from '../../components/Avatar';
import DeptBadge from '../../components/DeptBadge';
import { ROLE_HIERARCHY } from '../../data/panelData';
import { ArrowLeft, Edit3, ArrowUpCircle, GraduationCap, UserX, Key, Save, X, Calendar, Star, History, ChevronRight, Shield, Award, Clock } from 'lucide-react';

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

    const isAdmin = currentUser?.isAdmin === true || (currentUser?.rankLevel >= 6);

    useEffect(() => {
        const found = members.find(m => m._id === id) || alumni.find(m => m._id === id);
        if (found) {
            setMember(found);
            setForm({
                name: found.name,
                designation: found.designation,
                department: found.department || '',
                rankLevel: found.rankLevel,
                imageUrl: found.imageUrl || '',
            });
        }
    }, [id, members, alumni]);

    if (!member) {
        return (
            <div className="p-6 lg:p-8 w-full animate-in fade-in duration-500 pb-20">
                <button onClick={() => router.push('/panel/members')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Members
                </button>
                <div className="py-20 text-center text-slate-400">
                    <p className="text-lg font-medium">Member not found.</p>
                </div>
            </div>
        );
    }

    const handleSaveEdit = async () => {
        await updateMember(member._id, {
            name: form.name,
            designation: form.designation,
            department: form.department || null,
            rankLevel: parseInt(form.rankLevel),
            imageUrl: form.imageUrl,
        });
        setIsEditing(false);
    };

    const handlePromote = async () => {
        const entries = Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]);
        const currentIdx = entries.findIndex(([, lvl]) => lvl === member.rankLevel);
        if (currentIdx < entries.length - 1) {
            const [nextRole, nextLevel] = entries[currentIdx + 1];
            await updateMember(member._id, {
                designation: nextRole,
                rankLevel: nextLevel,
                roleHistory: [
                    ...(member.roleHistory || []),
                    { designation: member.designation, rankLevel: member.rankLevel, department: member.department, semester: getCurrentSemester() }
                ],
            });
            setIsPromoting(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.trim()) {
            await updatePassword(member._id, newPassword);
            setIsResetPwd(false);
            setNewPassword('');
        }
    };

    const getCurrentSemester = () => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        if (month >= 0 && month < 5) return `Spring ${year}`;
        return `Fall ${year}`;
    };

    const entries = Object.entries(ROLE_HIERARCHY).sort((a, b) => b[1] - a[1]);
    const currentIdx = entries.findIndex(([, lvl]) => lvl === member.rankLevel);
    const nextRole = currentIdx < entries.length - 1 ? entries[currentIdx + 1] : null;

    return (
        <div className="p-6 lg:p-8 w-full space-y-6 animate-in fade-in duration-500 pb-20">

            <button onClick={() => router.push('/panel/members')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Members
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMS0xOS44MTgsMS42MTgtMS4yNzZMMjUuNDE4IDExbC0xLjA0LTIuMjIyYS41LjUgMCAwMS40NDItLjY1OGwyLjQxNy4zNDYgMS4wNDEtMi4yMjNhLjUuNSAwIDAxLjkyNy4yMTRsLTEuMDQxIDIuMjIzIDIuNDE3LS4zNDZhLjUuNSAwIDAxLjQ0Mi42NThsLTEuMDQxIDIuMjIzTDM0LjM0NSA5LjgyMWEuNS41IDAgMDEtLjkyNy0uMjE0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-24 h-24 text-2xl shadow-xl border-4 border-white/20" />
                        <div className="text-white flex-1">
                            <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
                            <p className="text-blue-100 text-lg font-medium mt-1">{member.designation}</p>
                            <div className="flex items-center gap-3 mt-3">
                                <DeptBadge department={member.department} />
                                <span className="text-xs text-white/80 bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">Rank Level {member.rankLevel}</span>
                                {member.status === 'alumni' && (
                                    <span className="text-xs text-amber-200 bg-amber-500/20 px-3 py-1 rounded-full font-bold backdrop-blur-sm">Alumni</span>
                                )}
                                {member.status === 'kicked' && (
                                    <span className="text-xs text-red-200 bg-red-500/20 px-3 py-1 rounded-full font-bold backdrop-blur-sm">Removed</span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                                <p className="text-5xl font-black text-white">{member.score}</p>
                                <p className="text-xs text-blue-100 font-medium uppercase tracking-wider mt-1">Score</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {isAdmin && member.status !== 'alumni' && member.status !== 'kicked' && (
                    <div className="p-6 border-b border-slate-100 flex flex-wrap gap-3 bg-slate-50/50">
                        {nextRole && (
                            <button onClick={() => setIsPromoting(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95">
                                <ArrowUpCircle className="w-5 h-5" /> Promote to {nextRole[0]}
                            </button>
                        )}
                        <button onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all shadow-sm active:scale-95">
                            <Edit3 className="w-4 h-4" /> Edit Details
                        </button>
                        <button onClick={() => setIsResetPwd(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all shadow-sm active:scale-95">
                            <Key className="w-4 h-4" /> Reset Password
                        </button>
                        <div className="flex-1"></div>
                        <button onClick={async () => { if (window.confirm(`Retire ${member.name} to alumni?`)) { await retireMember(member._id, 'retired'); router.push('/panel/members'); } }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 active:scale-95">
                            <GraduationCap className="w-5 h-5" /> Retire
                        </button>
                        <button onClick={async () => { if (window.confirm(`Remove ${member.name} from the club?`)) { await kickMember(member._id); router.push('/panel/members'); } }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-md shadow-red-500/20 active:scale-95">
                            <UserX className="w-5 h-5" /> Remove
                        </button>
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" /> Details
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Username</span><span className="font-semibold text-slate-900 text-sm bg-slate-100 px-3 py-1 rounded-lg">{member.username}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Designation</span><span className="font-semibold text-blue-600 text-sm">{member.designation}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Rank Level</span><span className="font-semibold text-slate-900 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{member.rankLevel}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Department</span><DeptBadge department={member.department} /></div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Status</span>
                            <span className={`font-bold text-sm px-3 py-1 rounded-lg ${member.status === 'kicked' ? 'bg-red-50 text-red-600' : member.status === 'alumni' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {member.status || 'active'}
                            </span>
                        </div>
                        {member.semesterJoined && <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Joined</span><span className="font-semibold text-slate-900 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {member.semesterJoined}</span></div>}
                        {member.semesterLeft && <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Left</span><span className="font-semibold text-slate-900 text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {member.semesterLeft}</span></div>}
                        {member.leftReason && <div className="flex justify-between items-center"><span className="text-slate-500 text-sm">Reason</span><span className="font-semibold text-slate-900 text-sm">{member.leftReason}</span></div>}
                    </div>
                </div>

                {/* Role History */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-500" /> Role History
                    </h2>
                    {member.roleHistory && member.roleHistory.length > 0 ? (
                        <div className="space-y-3">
                            {member.roleHistory.map((rh, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{rh.rankLevel}</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 text-sm">{rh.designation}</p>
                                        <p className="text-xs text-slate-500">{rh.semester} {rh.department ? `· ${rh.department}` : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <History className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                            <p className="text-sm text-slate-400">No role changes yet.</p>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-500" /> Quick Stats
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-3xl font-black text-blue-700">{member.score}</p>
                            <p className="text-xs text-blue-500 font-medium uppercase tracking-wider mt-1">Total Score</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-3xl font-black text-slate-700">{member.evaluationHistory?.length || 0}</p>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Evaluations Received</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-3xl font-black text-slate-700">{member.roleHistory?.length || 0}</p>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Role Changes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Evaluation History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-500" /> Evaluation History
                </h2>
                {member.evaluationHistory && member.evaluationHistory.length > 0 ? (
                    <div className="space-y-3">
                        {[...member.evaluationHistory].reverse().map((ev, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold text-sm px-3 py-1.5 rounded-lg ${ev.points > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                        {ev.points > 0 ? '+' : ''}{ev.points} pts
                                    </span>
                                    <span className="text-sm text-slate-700 font-medium">{ev.note}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    {ev.date}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <Star className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                        <p className="text-sm text-slate-400">No evaluations yet.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Edit Member</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Picture URL</label>
                                <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</label>
                                    <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all">
                                        {Object.keys(ROLE_HIERARCHY).map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all">
                                        <option value="">Global / None</option>
                                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rank Level</label>
                                <select value={form.rankLevel} onChange={e => setForm({ ...form, rankLevel: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all">
                                    {entries.map(([role, level]) => <option key={role} value={level}>{role} (Level {level})</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button onClick={handleSaveEdit} className="flex-[2] py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Promote Confirmation */}
            {isPromoting && nextRole && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-5 border border-slate-200">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                            <ArrowUpCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center">Promote {member.name}?</h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center justify-center gap-3">
                                <div className="text-center">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Current</p>
                                    <p className="font-bold text-slate-700">{member.designation}</p>
                                    <p className="text-xs text-slate-400">Level {member.rankLevel}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                                <div className="text-center">
                                    <p className="text-xs text-blue-500 uppercase tracking-wider font-bold">New Role</p>
                                    <p className="font-bold text-blue-700">{nextRole[0]}</p>
                                    <p className="text-xs text-blue-500">Level {nextRole[1]}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs text-center">Current role will be saved to their role history.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setIsPromoting(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                            <button onClick={handlePromote} className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center justify-center gap-2">
                                <ArrowUpCircle className="w-5 h-5" /> Promote
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetPwd && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-5 border border-slate-200">
                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                            <Key className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center">Reset Password</h3>
                        <p className="text-slate-500 text-sm text-center">Set a new password for <strong className="text-slate-700">{member.name}</strong>.</p>
                        <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-50 transition-all" />
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => { setIsResetPwd(false); setNewPassword(''); }} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                            <button onClick={handleResetPassword} className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">Update Password</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
