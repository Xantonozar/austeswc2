"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users, Trophy, ArrowRight, TrendingUp,
    PieChart, Activity, ShieldCheck, Mail,
    Zap, Camera, Video, FileText, ChevronRight,
    Loader2, LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboardOverview() {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalCompetitors: 0,
        compBreakdown: {},
        deptBreakdown: {},
        recentMembers: [],
        loading: true
    });
    const router = useRouter();

    const fetchAllStats = async () => {
        try {
            // Fetch Members
            const memRes = await fetch('/api/admin/members');
            if (memRes.status === 401) {
                router.push('/admin/login');
                return;
            }
            const memData = await memRes.json();
            const members = memData.members || [];

            // Fetch Competitors
            const compRes = await fetch('/api/admin/competition?type=all');
            const compData = await compRes.json();
            const competitors = compData.data || [];

            // Process Breakdown
            const compBreakdown = competitors.reduce((acc, curr) => {
                acc[curr.type] = (acc[curr.type] || 0) + 1;
                return acc;
            }, {});

            const deptBreakdown = members.reduce((acc, curr) => {
                acc[curr.department] = (acc[curr.department] || 0) + 1;
                return acc;
            }, {});

            setStats({
                totalMembers: members.length,
                totalCompetitors: competitors.length,
                compBreakdown,
                deptBreakdown,
                recentMembers: members.slice(0, 5),
                loading: false
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to sync dashboard stats");
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchAllStats();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    if (stats.loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Assembling Dashboard...</p>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <Toaster position="top-right" />

            {/* Top Bar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center text-white font-black text-lg">E</div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 italic tracking-widest">Authorized Access Only</span>
                        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto px-6 py-10 space-y-12"
            >
                {/* Hero Stats Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Executive Summary</h2>
                        <p className="text-slate-500 font-medium text-sm">Real-time engagement metrics across club verticals.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={Users}
                            title="Total Members"
                            count={stats.totalMembers}
                            color="indigo"
                            sub="Official club registrations"
                        />
                        <StatCard
                            icon={Trophy}
                            title="Competitors"
                            count={stats.totalCompetitors}
                            color="emerald"
                            sub="Event participants"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Active Events"
                            count={4}
                            color="amber"
                            sub="Current competitions"
                        />
                        <StatCard
                            icon={Activity}
                            title="Club Health"
                            count="Stable"
                            color="rose"
                            sub="System status: Operational"
                        />
                    </div>
                </section>

                {/* Primary Action Navigation */}
                <section className="grid md:grid-cols-2 gap-8">
                    <NavCard
                        title="Member Management"
                        description="View full list of registered club members, verify their payment IDs, export student data, and handle deletions."
                        href="/admin/dashboard/members"
                        icon={Users}
                        color="bg-indigo-600"
                        stats={`${stats.totalMembers} Records`}
                    />
                    <NavCard
                        title="Competition Control"
                        description="Review contest submissions, watch videos, browse galleries, and manage Round 1 & Round 2 selection status."
                        href="/admin/dashboard/competition"
                        icon={Trophy}
                        color="bg-emerald-600"
                        stats={`${stats.totalCompetitors} Entries`}
                    />
                </section>

                {/* Secondary Data Views */}
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Competition Mix */}
                    <motion.div variants={item} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-emerald-600" /> Event Participation Mix
                                </h3>
                                <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">Registrations Count</div>
                            </div>

                            <div className="space-y-6 mb-8">
                                <ProgBar label="Eco Capture" count={stats.compBreakdown['eco-capture'] || 0} total={stats.totalCompetitors} color="bg-cyan-500" icon={Camera} />
                                <ProgBar label="Eco Buzzers" count={stats.compBreakdown['eco-buzzers'] || 0} total={stats.totalCompetitors} color="bg-amber-500" icon={Zap} />
                                <ProgBar label="Green Story" count={stats.compBreakdown['green-story'] || 0} total={stats.totalCompetitors} color="bg-green-500" icon={Video} />
                                <ProgBar label="Eco Pitch" count={stats.compBreakdown['eco-pitch'] || 0} total={stats.totalCompetitors} color="bg-pink-500" icon={FileText} />
                            </div>
                        </div>

                        <Link href="/admin/dashboard/competition" className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center gap-2 group transition-all">
                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Open detailed competition management</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Recent Growth */}
                    <motion.div variants={item} className="lg:col-span-1 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-xl font-extrabold mb-6 tracking-tight flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-400" /> Recent Joinees
                        </h3>
                        <div className="space-y-4 mb-8">
                            {stats.recentMembers.length > 0 ? stats.recentMembers.map((m, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-default">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase border border-white/5 group-hover:bg-white/20 transition-colors">
                                        {m.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-none">{m.name}</p>
                                        <p className="text-[10px] text-white/40 font-medium mt-1">{m.department} • {m.studentId}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-white/30 text-sm font-medium italic">No recent members found.</p>
                            )}
                        </div>
                        <Link href="/admin/dashboard/members" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                            View All Members <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

            </motion.main>
        </div>
    );
}

function StatCard({ icon: Icon, title, count, color, sub }) {
    const colorStyles = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };

    return (
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles[color]} mb-4 transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
            <p className="text-3xl font-black text-slate-900 mb-1">{count}</p>
            <p className="text-[10px] text-slate-500 font-bold italic">{sub}</p>
        </motion.div>
    );
}

function NavCard({ title, description, href, icon: Icon, color, stats }) {
    return (
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
            <Link href={href} className="flex flex-col h-full bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-400/20 transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-48 h-48 ${color} opacity-[0.03] rounded-full -mr-24 -mt-24 pointer-events-none`}></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">{stats}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">{description}</p>
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Enter Platform <ArrowRight className="w-4 h-4" />
                </div>
            </Link>
        </motion.div>
    );
}

function ProgBar({ label, count, total, color, icon: Icon }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors border border-slate-100">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{label}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{count} <span className="text-[10px] text-slate-400 font-bold">({percentage.toFixed(0)}%)</span></span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}
