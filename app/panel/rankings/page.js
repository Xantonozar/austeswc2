"use client";

import { useState } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';
import { Trophy, ArrowDownToLine, Users, Target } from 'lucide-react';

export default function RankingsPage() {
    const { members, DEPARTMENTS } = useDashboard();
    const [topTab, setTopTab] = useState('Members'); // 'Members' | 'Designations'
    const [deptFilter, setDeptFilter] = useState('All');

    // Filter and sort members
    const rankedMembers = members
        .filter(m => m._id !== 'env-admin')
        .filter(m => deptFilter === 'All' || m.department === deptFilter || (deptFilter === 'Core' && !m.department))
        .sort((a, b) => b.score - a.score);

    // Group by designation
    const displayMembers = members.filter(m => m._id !== 'env-admin');
    const designationStats = [...new Set(displayMembers.map(m => m.designation))].map(desig => {
        const desigMembers = displayMembers.filter(m => m.designation === desig);
        const totalScore = desigMembers.reduce((sum, m) => sum + m.score, 0);
        const avgScore = Math.round(totalScore / desigMembers.length);
        // Arbitrarily pick the rank level of the first member to sort the designations by hierarchy
        const rankLevel = desigMembers[0]?.rankLevel || 0;
        return { designation: desig, count: desigMembers.length, totalScore, avgScore, rankLevel };
    }).sort((a, b) => b.avgScore - a.avgScore); // Sort by avg score descending

    const maxScore = rankedMembers[0]?.score || 1;
    const maxDesigScore = designationStats[0]?.avgScore || 1;

    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

            <header className="border-b border-[#D6E4D8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-yeseva text-[#1A2B1E] flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" /> Leaderboard Rankings
                    </h1>
                    <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                        Global and designation-wise performance metrics
                    </p>
                </div>
            </header>

            {/* Top Level Tabs */}
            <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-[#EBF4E6] w-fit">
                <button
                    onClick={() => setTopTab('Members')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${topTab === 'Members'
                        ? 'bg-[#EBF4E6] text-[#2E5940] shadow-sm'
                        : 'text-[#7A9080] hover:bg-gray-50'
                        }`}
                >
                    <Users className="w-5 h-5" /> Member Rankings
                </button>
                <button
                    onClick={() => setTopTab('Designations')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${topTab === 'Designations'
                        ? 'bg-[#EBF4E6] text-[#2E5940] shadow-sm'
                        : 'text-[#7A9080] hover:bg-gray-50'
                        }`}
                >
                    <Target className="w-5 h-5" /> Designation Averages
                </button>
            </div>

            {topTab === 'Members' ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">

                    {/* Department Filters */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                        <button
                            onClick={() => setDeptFilter('All')}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm ${deptFilter === 'All'
                                ? 'bg-[#1E3A28] text-white border border-[#2E5940]'
                                : 'bg-white text-[#7A9080] hover:bg-[#EBF4E6] border border-[#D6E4D8]'
                                }`}
                        >
                            Globe (All)
                        </button>
                        <button
                            onClick={() => setDeptFilter('Core')}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm ${deptFilter === 'Core'
                                ? 'bg-[#1E3A28] text-white border border-[#2E5940]'
                                : 'bg-white text-[#7A9080] hover:bg-[#EBF4E6] border border-[#D6E4D8]'
                                }`}
                        >
                            Core Council
                        </button>
                        {DEPARTMENTS.map(dept => (
                            <button
                                key={dept.id}
                                onClick={() => setDeptFilter(dept.id)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm ${deptFilter === dept.id
                                    ? 'bg-[#1E3A28] text-white border border-[#2E5940]'
                                    : 'bg-white text-[#7A9080] hover:bg-[#EBF4E6] border border-[#D6E4D8]'
                                    }`}
                            >
                                {dept.name}
                            </button>
                        ))}
                    </div>

                    {/* Members Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-[#D6E4D8]">
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider w-16 text-center">Rank</th>
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider">Member</th>
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider">Designation</th>
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider w-1/3">Score Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rankedMembers.map((member, index) => {
                                        const isGold = index === 0;
                                        const isSilver = index === 1;
                                        const isBronze = index === 2;
                                        const top3Class = isGold ? 'bg-amber-50/60' : isSilver ? 'bg-slate-50/60' : isBronze ? 'bg-orange-50/40' : '';

                                        const barWidth = Math.max(5, (member.score / maxScore) * 100);

                                        return (
                                            <tr key={member._id} className={`hover:bg-gray-50/50 transition-colors group ${top3Class}`}>
                                                <td className="py-4 px-6 text-center">
                                                    {isGold ? <span className="text-2xl" title="Rank 1">🥇</span> :
                                                        isSilver ? <span className="text-2xl" title="Rank 2">🥈</span> :
                                                            isBronze ? <span className="text-2xl" title="Rank 3">🥉</span> :
                                                                <span className="font-yeseva text-lg text-[#7A9080]">{index + 1}</span>}
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-12 h-12 text-sm shadow-sm" />
                                                        <div>
                                                            <p className={`font-bold text-[#1A2B1E] text-base group-hover:text-[#4A7C59] transition-colors ${isGold ? 'text-xl' : ''}`}>{member.name}</p>
                                                            <DeptBadge department={member.department} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-[#4A7C59]">{member.designation}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 text-right font-bold text-[#2E5940] tabular-nums">{member.score}</div>
                                                        <div className="flex-1 h-3 bg-[#EBF4E6] rounded-full overflow-hidden border border-[#D6E4D8]/50 shadow-inner">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isGold ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : isSilver ? 'bg-gradient-to-r from-slate-300 to-slate-400' : isBronze ? 'bg-gradient-to-r from-orange-300 to-orange-400' : 'bg-gradient-to-r from-[#6BA583] to-[#4A7C59]'}`}
                                                                style={{ width: `${barWidth}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    {/* Designations Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-[#D6E4D8]">
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider">Designation Tier</th>
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider text-center">Headcount</th>
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider text-right">Total Pts</th>
                                        <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider w-1/3">Avg Score Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {designationStats.map((stat, index) => {
                                        const barWidth = Math.max(5, (stat.avgScore / maxDesigScore) * 100);

                                        return (
                                            <tr key={stat.designation} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-5 px-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {/* Using the logic from Avatar to get the designation color dot */}
                                                        <span className="w-3 h-3 rounded-full bg-[#4A7C59] shadow-sm"></span>
                                                        <span className="font-bold text-[#1A2B1E] text-lg">{stat.designation}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-[#7A9080] font-bold text-sm">
                                                        {stat.count}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 whitespace-nowrap text-right text-[#7A9080] font-medium tabular-nums">
                                                    {stat.totalScore}
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-end justify-between text-xs font-bold text-[#2E5940] mb-1">
                                                            <span>Avg</span>
                                                            <span className="text-base">{stat.avgScore} pts</span>
                                                        </div>
                                                        <div className="w-full h-4 bg-[#EBF4E6] rounded-full overflow-hidden shadow-inner border border-[#D6E4D8]/50">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#6BA583] to-[#2E5940] rounded-full transition-all duration-1000 ease-out"
                                                                style={{ width: `${barWidth}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
