"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDashboard } from '../../components/PanelDashboardProvider';
import Avatar from '../../components/Avatar';
import DeptBadge from '../../components/DeptBadge';
import { ROLE_HIERARCHY } from '../../data/panelData';
import { ArrowLeft, Edit3, ArrowUpCircle, GraduationCap, UserX, Key, Save, X, Calendar, Star, History } from 'lucide-react';

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
            <div className="p-8 max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-20">
                <button onClick={() => router.push('/panel/members')} className="flex items-center gap-2 text-sm font-medium text-[#7A9080] hover:text-[#4A7C59] transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Members
                </button>
                <div className="py-20 text-center text-[#7A9080]">
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
    const prevRole = currentIdx > 0 ? entries[currentIdx - 1] : null;

    return (
        <div className="p-8 max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

            <button onClick={() => router.push('/panel/members')} className="flex items-center gap-2 text-sm font-medium text-[#7A9080] hover:text-[#4A7C59] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Members
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                <div className="bg-gradient-to-r from-[#1E3A28] to-[#2E5940] p-8">
                    <div className="flex items-center gap-6">
                        <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-24 h-24 text-2xl shadow-xl border-4 border-white/20" />
                        <div className="text-white">
                            <h1 className="text-3xl font-yeseva">{member.name}</h1>
                            <p className="text-[#C8DDD0] text-lg font-semibold mt-1">{member.designation}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <DeptBadge department={member.department} />
                                <span className="text-xs text-[#C8DDD0] bg-white/10 px-3 py-1 rounded-full">Rank Level {member.rankLevel}</span>
                                {member.status === 'alumni' && (
                                    <span className="text-xs text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full font-bold">Alumni</span>
                                )}
                                {member.status === 'kicked' && (
                                    <span className="text-xs text-red-300 bg-red-500/20 px-3 py-1 rounded-full font-bold">Removed</span>
                                )}
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-5xl font-black text-white">{member.score}</p>
                            <p className="text-xs text-[#C8DDD0] font-medium uppercase tracking-wider mt-1">Score</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {isAdmin && member.status !== 'alumni' && member.status !== 'kicked' && (
                    <div className="p-6 border-b border-gray-100 flex flex-wrap gap-3">
                        {nextRole && (
                            <button onClick={() => setIsPromoting(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-[#4A7C59] text-white hover:bg-[#2E5940] transition-all shadow-md active:scale-95">
                                <ArrowUpCircle className="w-5 h-5" /> Promote to {nextRole[0]}
                            </button>
                        )}
                        <button onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md active:scale-95">
                            <Edit3 className="w-5 h-5" /> Edit Details
                        </button>
                        <button onClick={() => setIsResetPwd(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-md active:scale-95">
                            <Key className="w-5 h-5" /> Reset Password
                        </button>
                        <button onClick={async () => { if (window.confirm(`Retire ${member.name} to alumni?`)) { await retireMember(member._id, 'retired'); router.push('/panel/members'); } }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md active:scale-95">
                            <GraduationCap className="w-5 h-5" /> Retire to Alumni
                        </button>
                        <button onClick={async () => { if (window.confirm(`Remove ${member.name} from the club?`)) { await kickMember(member._id); router.push('/panel/members'); } }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-md active:scale-95">
                            <UserX className="w-5 h-5" /> Remove from Club
                        </button>
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] p-6">
                    <h2 className="text-sm font-bold text-[#7A9080] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#4A7C59]" /> Details
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Username</span><span className="font-semibold text-[#1A2B1E] text-sm">{member.username}</span></div>
                        <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Designation</span><span className="font-semibold text-[#4A7C59] text-sm">{member.designation}</span></div>
                        <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Rank Level</span><span className="font-semibold text-[#1A2B1E] text-sm">{member.rankLevel}</span></div>
                        <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Department</span><DeptBadge department={member.department} /></div>
                        <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Status</span><span className={`font-bold text-sm ${member.status === 'kicked' ? 'text-red-500' : member.status === 'alumni' ? 'text-amber-600' : 'text-[#4A7C59]'}`}>{member.status || 'active'}</span></div>
                        {member.semesterJoined && <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Joined</span><span className="font-semibold text-[#1A2B1E] text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {member.semesterJoined}</span></div>}
                        {member.semesterLeft && <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Left</span><span className="font-semibold text-[#1A2B1E] text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {member.semesterLeft}</span></div>}
                        {member.leftReason && <div className="flex justify-between"><span className="text-[#7A9080] text-sm">Reason</span><span className="font-semibold text-[#1A2B1E] text-sm">{member.leftReason}</span></div>}
                    </div>
                </div>

                {/* Role History */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] p-6">
                    <h2 className="text-sm font-bold text-[#7A9080] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History className="w-4 h-4 text-[#4A7C59]" /> Role History
                    </h2>
                    {member.roleHistory && member.roleHistory.length > 0 ? (
                        <div className="space-y-3">
                            {member.roleHistory.map((rh, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-[#4A7C59]"></div>
                                    <div>
                                        <p className="font-semibold text-[#1A2B1E] text-sm">{rh.designation}</p>
                                        <p className="text-xs text-[#7A9080]">{rh.semester} {rh.department ? `· ${rh.department}` : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[#7A9080] italic">No role changes yet.</p>
                    )}
                </div>
            </div>

            {/* Evaluation History */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] p-6">
                <h2 className="text-sm font-bold text-[#7A9080] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#4A7C59]" /> Evaluation History
                </h2>
                {member.evaluationHistory && member.evaluationHistory.length > 0 ? (
                    <div className="space-y-3">
                        {[...member.evaluationHistory].reverse().map((ev, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold text-sm px-2.5 py-1 rounded-lg ${ev.points > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                        {ev.points > 0 ? '+' : ''}{ev.points} pts
                                    </span>
                                    <span className="text-sm text-[#1A2B1E]">{ev.note}</span>
                                </div>
                                <span className="text-xs text-[#7A9080]">{ev.date}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-[#7A9080] italic">No evaluations yet.</p>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#F7F3EE] w-full max-w-lg rounded-3xl shadow-2xl border border-[#D6E4D8] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-[#D6E4D8] flex justify-between items-center bg-white/50">
                            <h2 className="text-xl font-yeseva text-[#1A2B1E]">Edit Member</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Full Name</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Profile Picture URL</label>
                                <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Designation</label>
                                    <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                        {Object.keys(ROLE_HIERARCHY).map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Department</label>
                                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                        <option value="">Global / None</option>
                                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider ml-1">Rank Level</label>
                                <select value={form.rankLevel} onChange={e => setForm({ ...form, rankLevel: parseInt(e.target.value) })} className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none shadow-sm appearance-none">
                                    {entries.map(([role, level]) => <option key={role} value={level}>{role} (Level {level})</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button onClick={handleSaveEdit} className="flex-[2] py-3 rounded-xl font-bold bg-[#1E3A28] text-white hover:bg-[#2E5940] transition-all shadow-md flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Promote Confirmation */}
            {isPromoting && nextRole && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-5">
                        <h3 className="text-xl font-bold text-gray-900">Promote {member.name}?</h3>
                        <p className="text-gray-600 text-sm">
                            This will change <strong>{member.designation}</strong> (Level {member.rankLevel}) to <strong className="text-[#4A7C59]">{nextRole[0]}</strong> (Level {nextRole[1]}).
                        </p>
                        <p className="text-gray-500 text-xs">Current role will be saved to their role history.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setIsPromoting(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handlePromote} className="flex-1 py-3 rounded-xl font-bold bg-[#4A7C59] text-white hover:bg-[#2E5940] transition-colors shadow-md flex items-center justify-center gap-2">
                                <ArrowUpCircle className="w-5 h-5" /> Promote
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetPwd && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-5">
                        <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                        <p className="text-gray-600 text-sm">Set a new password for <strong>{member.name}</strong>.</p>
                        <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4A7C59] outline-none" />
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => { setIsResetPwd(false); setNewPassword(''); }} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleResetPassword} className="flex-1 py-3 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md">Update Password</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
