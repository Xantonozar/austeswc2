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
    const topScorer = sortedMembers.length > 0 ? sortedMembers[0] : null;
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

    const getTodayDate = () => new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    const handleSelfRetire = async () => {
        await selfRetire();
        router.push('/panel/login');
    };

    return (
        <div className="p-6 lg:p-8 w-full space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome back, <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{currentUser?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">{currentUser?.designation} · {getTodayDate()}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100">
                        {totalMembers} Active
                    </div>
                    <button onClick={() => setShowRetireConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4" /> Leave
                    </button>
                </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">

                {/* Top Scorer — Large Card */}
                <div className="col-span-12 md:col-span-5 row-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Medal className="w-4 h-4" /> Top Performer
                            </p>
                            <div className="flex items-center gap-4">
                                <Avatar name={topScorer?.name} rankLevel={topScorer?.rankLevel} imageUrl={topScorer?.imageUrl} className="w-16 h-16 text-xl border-2 border-white/20 shadow-lg" />
                                <div>
                                    <p className="text-2xl font-bold">{topScorer?.name}</p>
                                    <p className="text-blue-200 text-sm">{topScorer?.designation}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-5xl font-black">{topScorer?.score}</p>
                                <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Points</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                <p className="text-sm font-bold">{topScorer?.department || 'Core Council'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="col-span-6 md:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{totalMembers}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Active Members</p>
                </div>

                <div className="col-span-6 md:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                            <Building2 className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{totalDepartments}</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{DEPARTMENTS.length}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Departments</p>
                </div>

                {/* Evals This Month */}
                <div className="col-span-6 md:col-span-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-cyan-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-5 -mt-5 blur-lg"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-3xl font-black">{evalsThisMonth}</p>
                        <p className="text-cyan-100 text-xs font-medium mt-1">Evals This Month</p>
                    </div>
                </div>

                {/* Avg Score */}
                <div className="col-span-6 md:col-span-3 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Star className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{avgScore}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Average Score</p>
                </div>

                {/* Alumni Link */}
                <Link href="/panel/alumni" className="col-span-12 md:col-span-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                    <div className="relative z-10 flex items-center justify-between h-full">
                        <div>
                            <p className="text-4xl font-black mb-1">{alumniCount}</p>
                            <p className="text-slate-400 text-sm font-medium">Alumni & Former Members</p>
                            <p className="text-xs text-slate-500 mt-1">Click to view all →</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-8 h-8 text-amber-400" />
                        </div>
                    </div>
                </Link>

                {/* Top 5 Leaderboard */}
                <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-500" /> Top 5 Leaderboard
                        </h2>
                        <Link href="/panel/rankings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-2">
                        {top5.map((member, index) => (
                            <div key={member._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                                    {index === 0 ? <span className="text-lg">🥇</span> : index === 1 ? <span className="text-lg">🥈</span> : index === 2 ? <span className="text-lg">🥉</span> : <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-500">{index + 1}</span>}
                                </div>
                                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-9 h-9 text-xs shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{member.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{member.designation}</p>
                                </div>
                                <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm tabular-nums">{member.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> Recent Activity
                        </h2>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{allActivities.length} total</span>
                    </div>
                    <div className="p-4 space-y-2 max-h-[360px] overflow-y-auto">
                        {allActivities.length === 0 ? (
                            <div className="py-12 text-center text-slate-300 text-sm">No evaluations yet</div>
                        ) : allActivities.slice(0, 8).map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Avatar name={activity.evaluator.name} rankLevel={activity.evaluator.rankLevel} imageUrl={activity.evaluator.imageUrl} className="w-8 h-8 text-[10px] shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-600 truncate">
                                        <span className="font-bold text-slate-900">{activity.evaluator.name}</span>
                                        {' evaluated '}
                                        <span className="font-semibold text-slate-900">{activity.targetMember.name}</span>
                                    </p>
                                </div>
                                <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg ${activity.points > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                                    {activity.points > 0 ? '+' : ''}{activity.points}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Self-Retire Modal */}
            {showRetireConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-5">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                            <LogOut className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center">Leave Panel?</h3>
                        <p className="text-slate-500 text-sm text-center">You will be moved to Alumni and can no longer access the panel.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowRetireConfirm(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                            <button onClick={handleSelfRetire} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md">Yes, Leave</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
