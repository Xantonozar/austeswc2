"use client";

import { useState, useEffect } from 'react';
import { useDashboard } from './components/PanelDashboardProvider';
import { Users, Building2, Medal, FileText, ArrowRight, Trophy, GraduationCap, LogOut, TrendingUp, Clock, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from './components/Avatar';

export default function DashboardHome() {
    const { members, alumni, currentUser, isLoggedIn, DEPARTMENTS, fetchAlumni, selfRetire } = useDashboard();
    const router = useRouter();
    const [showRetireConfirm, setShowRetireConfirm] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) router.push('/panel/login');
        fetchAlumni();
    }, [isLoggedIn, router, fetchAlumni]);

    if (!isLoggedIn) return null;

    const displayMembers = members.filter(m => m._id !== 'env-admin');
    const totalMembers = displayMembers.length;
    const totalDepartments = new Set(displayMembers.filter(m => m.department).map(m => m.department)).size + 1;
    const sortedMembers = [...displayMembers].sort((a, b) => b.score - a.score);
    const topScorer = sortedMembers[0];
    const top5 = sortedMembers.slice(0, 5);

    const allActivities = displayMembers.flatMap(m =>
        m.evaluationHistory.map(h => ({
            ...h,
            targetMember: m,
            evaluator: members.find(u => u._id === h.evaluatorId) || { name: 'Unknown', designation: 'N/A' }
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const currentMonth = new Date().getMonth();
    const evalsThisMonth = allActivities.filter(a => new Date(a.date).getMonth() === currentMonth).length;
    const alumniCount = alumni.length;
    const avgScore = totalMembers > 0 ? Math.round(displayMembers.reduce((sum, m) => sum + m.score, 0) / totalMembers) : 0;

    const getTodayDate = () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const handleSelfRetire = async () => {
        await selfRetire();
        router.push('/panel/login');
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-24 lg:pb-8">

            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/15 rounded-full blur-[80px]"></div>
                </div>
                <div className="relative z-10 px-6 lg:px-12 py-10 lg:py-14">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <p className="text-blue-300/60 text-sm font-medium mb-2">{getTodayDate()}</p>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{currentUser?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-blue-200/50 text-lg mt-2">{currentUser?.designation} · {currentUser?.department || 'All Departments'}</p>
                        </div>
                        <button onClick={() => setShowRetireConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all w-fit">
                            <LogOut className="w-4 h-4" /> Leave Panel
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="px-6 lg:px-12 -mt-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                        { label: 'Active', value: totalMembers, icon: Users, color: 'from-blue-500 to-blue-600' },
                        { label: 'Departments', value: totalDepartments, icon: Building2, color: 'from-violet-500 to-violet-600' },
                        { label: 'Avg Score', value: avgScore, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
                        { label: 'Evals', value: evalsThisMonth, icon: Zap, color: 'from-amber-500 to-amber-600' },
                        { label: 'Alumni', value: alumniCount, icon: GraduationCap, color: 'from-rose-500 to-rose-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow">
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div className="px-6 lg:px-12 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Top Scorer - Hero Card */}
                <div className="lg:col-span-4 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                    <div className="relative z-10">
                        <p className="text-blue-200/60 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Medal className="w-4 h-4" /> Top Performer
                        </p>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar name={topScorer?.name} rankLevel={topScorer?.rankLevel} imageUrl={topScorer?.imageUrl} className="w-20 h-20 text-2xl border-2 border-white/20 shadow-xl" />
                            <div>
                                <p className="text-2xl font-bold">{topScorer?.name}</p>
                                <p className="text-blue-200/60 text-sm">{topScorer?.designation}</p>
                                <p className="text-blue-200/40 text-xs mt-1">{topScorer?.department || 'Core Council'}</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                            <p className="text-5xl font-black">{topScorer?.score}</p>
                            <p className="text-blue-200/40 text-xs font-medium uppercase tracking-wider mt-1">Total Points</p>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard
                        </h2>
                        <Link href="/panel/rankings" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All →</Link>
                    </div>
                    <div className="p-3 space-y-1">
                        {top5.map((member, index) => (
                            <div key={member._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 bg-slate-50">
                                    {index < 3 ? <span className="text-lg">{['🥇', '🥈', '🥉'][index]}</span> : <span className="text-slate-400 text-xs">{index + 1}</span>}
                                </div>
                                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-9 h-9 text-xs shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{member.designation}</p>
                                </div>
                                <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm">{member.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> Recent
                        </h2>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{allActivities.length}</span>
                    </div>
                    <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
                        {allActivities.length === 0 ? (
                            <div className="py-12 text-center text-slate-300 text-sm">No activity yet</div>
                        ) : allActivities.slice(0, 10).map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Avatar name={activity.evaluator.name} rankLevel={activity.evaluator.rankLevel} imageUrl={activity.evaluator.imageUrl} className="w-8 h-8 text-[10px] shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-600 truncate">
                                        <span className="font-bold text-slate-900">{activity.evaluator.name}</span>
                                        {' → '}
                                        <span className="font-semibold text-slate-900">{activity.targetMember.name}</span>
                                    </p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${activity.points > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                                    {activity.points > 0 ? '+' : ''}{activity.points}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="px-6 lg:px-12 mt-6">
                <Link href="/panel/alumni" className="block bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden hover:shadow-2xl transition-all group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-black">{alumniCount}</p>
                            <p className="text-slate-400 text-sm font-medium mt-1">Alumni & Former Members</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-8 h-8 text-amber-400" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Modal */}
            {showRetireConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><LogOut className="w-7 h-7 text-red-500" /></div>
                        <h3 className="text-lg font-bold text-slate-900">Leave Panel?</h3>
                        <p className="text-slate-400 text-sm mt-2">You will be moved to Alumni.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowRetireConfirm(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                            <button onClick={handleSelfRetire} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700">Leave</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
