"use client";

import { useState, useEffect } from 'react';
import { useDashboard } from './components/PanelDashboardProvider';
import { Users, Building2, Medal, FileText, ArrowRight, Trophy, GraduationCap, LogOut } from 'lucide-react';
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
    const kickedCount = alumni.filter(m => m.status === 'kicked').length;
    const retiredCount = alumni.filter(m => m.status === 'alumni').length;

    const getDaysAgo = (dateString) => {
        const diffTime = Math.abs(new Date() - new Date(dateString));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
    };

    const getTodayDate = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleSelfRetire = async () => {
        await selfRetire();
        router.push('/panel/login');
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D6E4D8] pb-6">
                <div>
                    <h1 className="text-3xl font-yeseva text-[#1A2B1E] mb-2">Good day, {currentUser?.name?.split(' ')[0]} 🌿</h1>
                    <p className="text-[#7A9080] font-medium tracking-wide">
                        {currentUser?.designation} &middot; {currentUser?.department ? currentUser.department : 'All Departments'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-[#EBF4E6] px-4 py-2 rounded-xl text-sm font-semibold text-[#4A7C59] border border-[#C8DDD0] shadow-sm">
                        Today: {getTodayDate()}
                    </div>
                    <button onClick={() => setShowRetireConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4" /> Leave Panel
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBF4E6] flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-3xl font-yeseva text-[#2E5940] mb-1">{totalMembers}</p>
                        <p className="text-xs text-[#7A9080] font-medium uppercase tracking-wider">Active Members</p>
                    </div>
                    <div className="bg-[#4A7C59]/10 p-3 rounded-xl text-[#4A7C59]"><Users className="w-7 h-7" /></div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBF4E6] flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-3xl font-yeseva text-[#2E5940] mb-1">{totalDepartments}</p>
                        <p className="text-xs text-[#7A9080] font-medium uppercase tracking-wider">Departments</p>
                    </div>
                    <div className="bg-[#4A7C59]/10 p-3 rounded-xl text-[#4A7C59]"><Building2 className="w-7 h-7" /></div>
                </div>

                <div className="bg-[#1E3A28] rounded-2xl p-5 shadow-md border border-[#2E5940] text-white hover:shadow-lg transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#4A7C59] rounded-full opacity-20 -mr-8 -mt-8 blur-xl"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-xl font-yeseva mb-1 truncate max-w-[120px]">{topScorer?.name}</p>
                            <p className="text-xs text-[#C8DDD0] font-medium uppercase tracking-wider">Top Scorer</p>
                            <p className="text-sm font-bold text-[#6BA583] mt-1">Score: {topScorer?.score}</p>
                        </div>
                        <div className="bg-[#4A7C59]/30 p-2 rounded-xl"><Medal className="w-6 h-6 text-yellow-500 fill-yellow-500/20" /></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBF4E6] flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-3xl font-yeseva text-[#2E5940] mb-1">{evalsThisMonth}</p>
                        <p className="text-xs text-[#7A9080] font-medium uppercase tracking-wider">Evals This Month</p>
                    </div>
                    <div className="bg-[#4A7C59]/10 p-3 rounded-xl text-[#4A7C59]"><FileText className="w-7 h-7" /></div>
                </div>

                {/* Alumni Card */}
                <Link href="/panel/alumni" className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-200 flex items-center justify-between hover:shadow-md transition-shadow group">
                    <div>
                        <p className="text-3xl font-yeseva text-amber-700 mb-1">{alumniCount}</p>
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Alumni & Left</p>
                        {kickedCount > 0 && <p className="text-[10px] text-red-400 font-bold mt-1">{kickedCount} kicked</p>}
                        {retiredCount > 0 && <p className="text-[10px] text-amber-500 font-bold mt-0.5">{retiredCount} retired</p>}
                    </div>
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">

                {/* Recent Activity Feed */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-[#EBF4E6] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-yeseva text-[#1A2B1E] flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#4A7C59]" /> Recent Activity
                        </h2>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto max-h-[460px] space-y-6">
                        {allActivities.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm">No evaluations yet</div>
                        ) : allActivities.slice(0, 6).map((activity, idx) => (
                            <div key={idx} className="flex gap-4 relative">
                                {idx !== 5 && <div className="absolute left-[1.125rem] top-10 bottom-[-1.5rem] w-px bg-gray-200 z-0 border-dashed"></div>}
                                <Avatar name={activity.evaluator.name} rankLevel={activity.evaluator.rankLevel} imageUrl={activity.evaluator.imageUrl} className="w-9 h-9 text-xs z-10" />
                                <div className="flex-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-sm relative z-10 transition-colors hover:bg-white">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <p className="text-sm text-gray-800 leading-snug">
                                            <span className="font-bold text-[#2E5940]">{activity.evaluator.name}</span>
                                            <span className="text-gray-500 mx-1">evaluated</span>
                                            <span className="font-semibold">{activity.targetMember.name}</span>
                                            <span className="text-xs text-gray-400 block sm:inline sm:ml-2">({activity.targetMember.department || 'Core'})</span>
                                        </p>
                                        <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold leading-none ring-1 tracking-wide ring-inset bg-[#EBF4E6] text-[#2E5940] ring-[#4A7C59]/20">
                                            {activity.points > 0 ? '+' : ''}{activity.points} pts
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic border-l-2 border-[#6BA583] pl-3 mt-3">&quot;{activity.note}&quot;</p>
                                    <p className="text-xs text-gray-400 font-medium mt-3 text-right tabular-nums">{getDaysAgo(activity.date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Leaderboard Widget */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#EBF4E6] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-yeseva text-[#1A2B1E] flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" /> Top 5 Leaderboard
                        </h2>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            {top5.map((member, index) => (
                                <div key={member._id} className="flex items-center gap-4 group p-2 -mx-2 rounded-xl hover:bg-[#F7F3EE] transition-colors">
                                    <div className="w-6 font-yeseva text-lg text-center font-bold">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-gray-400">{index + 1}</span>}
                                    </div>
                                    <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-10 h-10 text-xs shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#1A2B1E] truncate group-hover:text-[#4A7C59] transition-colors">{member.name}</p>
                                        <p className="text-xs text-[#7A9080] truncate">{member.designation} {member.department ? `· ${member.department}` : ''}</p>
                                    </div>
                                    <div className="font-bold text-[#2E5940] tabular-nums bg-[#EBF4E6] px-3 py-1 rounded-lg">{member.score}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <Link href="/panel/rankings" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-[#4A7C59] font-bold hover:bg-[#EBF4E6] transition-colors group">
                                View Full Rankings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Self-Retire Confirmation Modal */}
            {showRetireConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-5">
                        <h3 className="text-xl font-bold text-gray-900">Leave Panel?</h3>
                        <p className="text-gray-600 text-sm">You will be moved to Alumni and can no longer access the panel. This action cannot be undone by you.</p>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowRetireConfirm(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleSelfRetire} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md">Yes, Leave</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
