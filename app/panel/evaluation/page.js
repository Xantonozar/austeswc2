"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '../components/PanelDashboardProvider';
import { canEvaluate, canViewScore } from '../data/permissions';
import Avatar from '../components/Avatar';
import DeptBadge from '../components/DeptBadge';

export default function EvaluationList() {
    const { members, currentUser, DEPARTMENTS } = useDashboard();
    const [activeTab, setActiveTab] = useState('All');

    // Filter members based on selected tab and whether current user has any visibility
    // If the user cannot view score AND cannot evaluate, they likely shouldn't even see the person 
    // in the evaluation list (except if they are lower rank overall, which is covered by score visibility).
    // The prompt says: "Table/card grid of all members the currently logged-in user can evaluate".
    // Actually, we show people they can evaluate (Evaluate ->), or people they can just view (View).
    // "row absent from Eval list" if member is higher rank, not shown at all.
    const visibleMembers = members.filter(m => {
        // Hide admin from evaluation list
        if (m._id === 'env-admin') return false;

        // Only show members strictly lower rank than current user
        if (m.rankLevel >= currentUser.rankLevel) return false;

        if (activeTab === 'All') return true;
        return m.department === activeTab;
    }).sort((a, b) => b.rankLevel - a.rankLevel);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

            <header className="border-b border-[#D6E4D8] pb-6">
                <h1 className="text-3xl font-yeseva text-[#1A2B1E]">Evaluation Panel</h1>
                <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                    Select a member to evaluate or view their history.
                </p>
            </header>

            {/* Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                <button
                    onClick={() => setActiveTab('All')}
                    className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm ${activeTab === 'All'
                        ? 'bg-[#4A7C59] text-white hover:bg-[#2E5940] border border-[#2E5940]'
                        : 'bg-white text-[#7A9080] hover:bg-[#EBF4E6] border border-[#D6E4D8]'
                        }`}
                >
                    All Departments
                </button>
                {DEPARTMENTS.map(dept => (
                    <button
                        key={dept.id}
                        onClick={() => setActiveTab(dept.id)}
                        className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm ${activeTab === dept.id
                            ? 'bg-[#4A7C59] text-white hover:bg-[#2E5940] border border-[#2E5940]'
                            : 'bg-white text-[#7A9080] hover:bg-[#EBF4E6] border border-[#D6E4D8]'
                            }`}
                    >
                        {dept.name}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-[#D6E4D8]">
                                <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider">Member</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider">Designation</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider">Dept</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider text-center">Score</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#7A9080] uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {visibleMembers.map(member => {
                                const canEval = canEvaluate(currentUser, member);
                                const showScore = canViewScore(currentUser, member);

                                return (
                                    <tr key={member._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-10 h-10 text-xs shadow-sm" />
                                                <div>
                                                    <p className="font-bold text-[#1A2B1E] group-hover:text-[#4A7C59] transition-colors">{member.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            <span className="text-sm font-medium text-[#4A7C59]">{member.designation}</span>
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            <DeptBadge department={member.department} />
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap text-center">
                                            <span className={`font-bold tabular-nums ${showScore ? 'text-[#2E5940] bg-[#EBF4E6] px-3 py-1 rounded-lg' : 'text-gray-300'}`}>
                                                {showScore ? member.score : '——'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap text-right">
                                            {canEval ? (
                                                <Link
                                                    href={`/panel/evaluation/${member._id}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-[#4A7C59] text-white text-sm font-bold rounded-xl hover:bg-[#2E5940] hover:shadow-md transition-all active:scale-95"
                                                >
                                                    Evaluate &rarr;
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/panel/evaluation/${member._id}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#7A9080] border border-[#D6E4D8] text-sm font-bold rounded-xl hover:bg-gray-50 hover:text-[#1A2B1E] transition-all active:scale-95"
                                                >
                                                    View
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {visibleMembers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#7A9080]">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-lg font-medium mb-1">No members found</p>
                                            <p className="text-sm">You do not have permission to view or evaluate members in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
