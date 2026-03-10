"use client";

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../../components/PanelDashboardProvider';
import { canEvaluate, canViewScore } from '../../data/permissions';
import Avatar from '../../components/Avatar';
import DeptBadge from '../../components/DeptBadge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EvaluationDetail({ params }) {
    // Access resolved params in Next 15+ using the new `use` hook, or standard props 
    // Next 14 handles simple params fine, but unwrapping here avoids potential future warnings.
    const resolvedParams = typeof params?.then === 'function' ? use(params) : params;
    const targetId = resolvedParams.id;

    const router = useRouter();
    const { currentUser, getUserById, submitEvaluation } = useDashboard();

    const [points, setPoints] = useState(0);
    const [note, setNote] = useState('');

    const member = getUserById(targetId);

    if (!member) {
        return (
            <div className="p-8 text-center text-[#7A9080]">Member not found.</div>
        );
    }

    const isEvalAllowed = canEvaluate(currentUser, member);
    const showScore = canViewScore(currentUser, member);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!note.trim()) return;
        await submitEvaluation(member._id, points, note);
        // Reset form after submission
        setPoints(0);
        setNote('');
    };

    const isGlobal = !member.department;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500 pb-20">

            {/* Back Link */}
            <Link
                href="/panel/evaluation"
                className="inline-flex items-center text-sm font-bold text-[#7A9080] hover:text-[#2E5940] transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Evaluation List
            </Link>

            {/* Profile Header */}
            <div className="bg-gradient-to-br from-[#1E3A28] to-[#2E5940] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                {/* Decorative leaf shapes */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#6BA583] opacity-20 rounded-full blur-2xl"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                    <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-24 h-24 text-4xl shadow-[0_0_0_4px_rgba(255,255,255,0.1)]" />

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-yeseva mb-2 tracking-wide">{member.name}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-[#C8DDD0] font-medium mb-4">
                            <span className="bg-[#4A7C59]/40 px-3 py-1 rounded-lg text-white">{member.designation}</span>
                            <span>&middot;</span>
                            <DeptBadge department={member.department} />
                            <span>&middot;</span>
                            <span>Global Scope: {isGlobal ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 min-w-[140px]">
                        <p className="text-[#C8DDD0] text-xs font-bold uppercase tracking-widest mb-1">Current Score</p>
                        <p className="text-3xl font-yeseva text-white">
                            {showScore ? member.score : '——'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Evaluation Form */}
            {isEvalAllowed && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EBF4E6] relative z-20 -mt-4">
                    <h2 className="text-xl font-yeseva text-[#1A2B1E] mb-6 flex items-center gap-2">
                        <span className="bg-[#6BA583]/20 p-2 rounded-xl"><CheckCircle2 className="w-5 h-5 text-[#4A7C59]" /></span>
                        Evaluate this Member
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Points input */}
                        <div>
                            <label className="block text-sm font-bold text-[#7A9080] uppercase tracking-wide mb-2">Points</label>
                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-fit border border-[#D6E4D8]">
                                <button
                                    type="button"
                                    onClick={() => setPoints(p => p - 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-[#C62828] font-bold text-xl hover:bg-[#FDECEA] shadow-sm transition-colors border border-gray-100"
                                >
                                    &minus;
                                </button>
                                <input
                                    type="number"
                                    value={points}
                                    onChange={(e) => setPoints(Number(e.target.value))}
                                    className="w-20 text-center bg-transparent text-2xl font-bold text-[#1A2B1E] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPoints(p => p + 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-[#2E7D32] font-bold text-xl hover:bg-[#EBF4E6] shadow-sm transition-colors border border-gray-100"
                                >
                                    &#43;
                                </button>
                            </div>
                        </div>

                        {/* Note input */}
                        <div>
                            <label className="block text-sm font-bold text-[#7A9080] uppercase tracking-wide mb-2">Reason / Note <span className="text-red-500">*</span></label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                                rows="3"
                                placeholder="Write a mandatory reason for this evaluation..."
                                className="w-full bg-white border border-[#D6E4D8] rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent text-[#1A2B1E] placeholder:text-gray-300 resize-none shadow-sm"
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={!note.trim()}
                                className="w-full sm:w-auto px-8 py-4 bg-[#4A7C59] text-white font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(74,124,89,0.39)] hover:shadow-[0_6px_20px_rgba(74,124,89,0.23)] hover:bg-[#2E5940] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-95"
                            >
                                Submit Evaluation
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Evaluation History */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-yeseva text-[#1A2B1E]">📋 Evaluation History</h2>
                </div>

                {member.evaluationHistory.length === 0 ? (
                    <div className="p-12 text-center text-[#7A9080]">
                        No evaluation history available for this member.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-8 text-xs font-bold text-[#7A9080] uppercase tracking-wider bg-white">Date</th>
                                    <th className="py-4 px-8 text-xs font-bold text-[#7A9080] uppercase tracking-wider bg-white">Evaluator</th>
                                    <th className="py-4 px-8 text-xs font-bold text-[#7A9080] uppercase tracking-wider bg-white">Designation</th>
                                    <th className="py-4 px-8 text-xs font-bold text-[#7A9080] uppercase tracking-wider bg-white">Points</th>
                                    <th className="py-4 px-8 text-xs font-bold text-[#7A9080] uppercase tracking-wider bg-white">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {member.evaluationHistory.map((hist, idx) => {
                                    const evaluator = getUserById(hist.evaluatorId) || { name: 'Unknown', designation: 'Unknown' };
                                    const isPositive = hist.points >= 0;

                                    return (
                                        <tr key={idx} className={`transition-colors ${isPositive ? 'bg-[#EBF4E6]/30 hover:bg-[#EBF4E6]/60' : 'bg-[#FDECEA]/40 hover:bg-[#FDECEA]/70'}`}>
                                            <td className="py-4 px-8 whitespace-nowrap text-sm text-[#7A9080] font-medium">{hist.date}</td>
                                            <td className="py-4 px-8 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={evaluator.name} rankLevel={evaluator.rankLevel} imageUrl={evaluator.imageUrl} className="w-8 h-8 text-[10px]" />
                                                    <span className="font-bold text-[#1A2B1E]">{evaluator.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-8 whitespace-nowrap text-sm text-[#4A7C59] font-medium">{evaluator.designation}</td>
                                            <td className="py-4 px-8 whitespace-nowrap">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-[#EBF4E6] text-[#2E7D32]' : 'bg-[#FDECEA] text-[#C62828]'}`}>
                                                    {isPositive ? '+' : ''}{hist.points} {isPositive ? '🟢' : '🔴'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-8 text-sm text-[#1A2B1E] italic">"{hist.note}"</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
