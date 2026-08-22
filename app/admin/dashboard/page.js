"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Trophy, ArrowRight, TrendingUp,
    PieChart, Activity, Zap, Camera, Video, FileText, ChevronRight,
    Loader2, LogOut, Calendar, Building2, Check, AlertTriangle, Shield, Database, Clock,
    Crown, Flame
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getSemesterFromDate, getSemestersFromItems } from "@/components/dashboard/SemesterTabs";

const PANEL_ROLES = ['superadmin', 'advisor', 'treasurer', 'president', 'gs', 'vp', 'js', 'os', 'executive'];

export default function AdminDashboardOverview() {
    const [members, setMembers] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [applications, setApplications] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [adminRole, setAdminRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(getSemesterFromDate(new Date()));
    const router = useRouter();

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            const roleRes = await fetch('/api/admin/panel/my-role');
            if (roleRes.ok) {
                const roleData = await roleRes.json();
                setAdminRole(roleData.role);
            }

            const memRes = await fetch('/api/admin/members');
            if (memRes.status === 401) { router.push('/admin/login'); return; }
            const memData = await memRes.json();
            const m = memData.members || [];

            const compRes = await fetch('/api/admin/competition?type=all');
            const compData = await compRes.json();
            const c = compData.data || [];

            const appRes = await fetch('/api/admin/applications');
            if (appRes.ok) {
                const appData = await appRes.json();
                setApplications(appData.applications || []);
            }

            setMembers(m);
            setCompetitors(c);

            const lbRes = await fetch('/api/admin/panel/leaderboard');
            if (lbRes.ok) {
                const lbData = await lbRes.json();
                setLeaderboard(lbData.leaderboard || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const semesters = getSemestersFromItems(members);

    const filtered = activeTab === "all" ? members : members.filter(m => getSemesterFromDate(m.createdAt) === activeTab);
    const filteredCount = filtered.length;

    const filteredCompetitions = activeTab === "all" ? competitors : competitors.filter(c => getSemesterFromDate(c.createdAt) === activeTab);
    const compBreakdown = filteredCompetitions.reduce((acc, curr) => { acc[curr.type] = (acc[curr.type] || 0) + 1; return acc; }, {});

    const deptBreakdown = filtered.reduce((acc, m) => { acc[m.department] = (acc[m.department] || 0) + 1; return acc; }, {});
    const sortedDepts = Object.entries(deptBreakdown).sort((a, b) => b[1] - a[1]);
    const maxDept = sortedDepts[0] || ['N/A', 0];
    const minDept = sortedDepts[sortedDepts.length - 1] || ['N/A', 0];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Assembling Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <Toaster position="top-right" />

            {/* Top Bar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
                <div className="px-6 md:px-10 h-16 flex items-center justify-between">
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

            <div className="px-6 md:px-10 py-10 space-y-10">

                {/* Semester Tabs */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                                Semester Overview
                            </h2>
                            <p className="text-slate-500 font-medium text-sm">Select a semester to view its stats.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                                activeTab === "all"
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                            }`}
                        >
                            All Time ({members.length})
                        </button>
                        {semesters.map(sem => (
                            <button
                                key={sem}
                                onClick={() => setActiveTab(sem)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                                    activeTab === sem
                                        ? sem.includes("Fall")
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                                            : "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"
                                }`}
                            >
                                {sem} ({members.filter(m => getSemesterFromDate(m.createdAt) === sem).length})
                            </button>
                        ))}
                    </div>
                </section>

                {/* Stats Grid for selected semester */}
                <AnimatePresence mode="wait">
                    <motion.section
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Users}
                                title="Members"
                                count={filteredCount}
                                color="indigo"
                                sub={activeTab === "all" ? "All-time registrations" : `Joined in ${activeTab}`}
                            />
                            <StatCard
                                icon={Building2}
                                title="Top Dept"
                                count={maxDept[0]}
                                color="emerald"
                                sub={`${maxDept[1]} members`}
                            />
                            <StatCard
                                icon={Check}
                                title="Departments"
                                count={sortedDepts.length}
                                color="amber"
                                sub="Active departments"
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Growth"
                                count={`${Math.round((filteredCount / members.length) * 100)}%`}
                                color="rose"
                                sub="Of total members"
                            />
                        </div>
                    </motion.section>
                </AnimatePresence>

                {/* Navigation Cards */}
                <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <NavCard
                        title="Members"
                        href="/admin/dashboard/members"
                        icon={Users}
                        color="bg-indigo-600"
                    />
                    <NavCard
                        title="Competitions"
                        href="/admin/dashboard/competition"
                        icon={Trophy}
                        color="bg-emerald-600"
                    />
                    <NavCard
                        title="Applications"
                        href="/admin/dashboard/applications"
                        icon={FileText}
                        color="bg-sky-600"
                    />
                    <NavCard
                        title="Data Collection"
                        href="/admin/dashboard/datacollect"
                        icon={Database}
                        color="bg-blue-600"
                    />
                    <NavCard
                        title="Routine"
                        href="/admin/dashboard/routine"
                        icon={Clock}
                        color="bg-orange-600"
                    />
                    {adminRole && PANEL_ROLES.includes(adminRole) && (
                        <NavCard
                            title="Panel"
                            href="/admin/dashboard/panel"
                            icon={Shield}
                            color="bg-violet-600"
                        />
                    )}
                </section>

                {/* Bottom Grid: Dept Breakdown + Competition Mix */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Department Breakdown */}
                    <motion.div
                        key={`dept-${activeTab}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                                Department Breakdown
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                {activeTab === "all" ? "All Time" : activeTab}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {sortedDepts.length > 0 ? sortedDepts.map(([dept, count]) => {
                                const pct = filteredCount > 0 ? (count / filteredCount) * 100 : 0;
                                return (
                                    <div key={dept} className="flex items-center gap-3">
                                        <span className="w-12 text-xs font-black text-slate-500 uppercase">{dept}</span>
                                        <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className="h-full bg-indigo-500 rounded-full"
                                            />
                                        </div>
                                        <span className="w-8 text-xs font-black text-slate-700 text-right">{count}</span>
                                    </div>
                                );
                            }) : (
                                <div className="flex flex-col items-center gap-2 py-8">
                                    <Building2 className="w-8 h-8 text-slate-200" />
                                    <p className="text-slate-400 text-sm font-medium">No member data in {activeTab === 'all' ? 'any semester' : activeTab}</p>
                                </div>
                            )}
                        </div>

                        {sortedDepts.length > 0 && (
                            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-slate-500">Highest: <span className="font-bold text-slate-800">{maxDept[0]}</span> ({maxDept[1]})</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <span className="text-slate-500">Lowest: <span className="font-bold text-slate-800">{minDept[0]}</span> ({minDept[1]})</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Competition Mix */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-emerald-600" /> Competition Mix
                                </h3>
                            </div>
                            <div className="space-y-5">
                                <ProgBar label="Eco Capture" count={compBreakdown['eco-capture'] || 0} total={filteredCompetitions.length} color="bg-cyan-500" icon={Camera} />
                                <ProgBar label="Eco Buzzers" count={compBreakdown['eco-buzzers'] || 0} total={filteredCompetitions.length} color="bg-amber-500" icon={Zap} />
                                <ProgBar label="Green Story" count={compBreakdown['green-story'] || 0} total={filteredCompetitions.length} color="bg-green-500" icon={Video} />
                                <ProgBar label="Eco Pitch" count={compBreakdown['eco-pitch'] || 0} total={filteredCompetitions.length} color="bg-pink-500" icon={FileText} />
                            </div>
                        </div>
                        <Link href="/admin/dashboard/competition" className="w-full py-3 mt-6 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 group transition-all">
                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Open Competition Management</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Top Performers */}
                {leaderboard.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 shadow-xl shadow-indigo-200/50"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-300" /> Top Performers
                            </h3>
                            <Link href="/admin/dashboard/panel" className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-all">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {leaderboard.slice(0, 5).map((a, i) => (
                                <div key={a._id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all border border-white/10">
                                    <div className="relative mx-auto mb-3">
                                        <div className={`w-14 h-14 rounded-full mx-auto overflow-hidden border-2 ${i === 0 ? 'border-amber-400 shadow-lg shadow-amber-400/30' : i === 1 ? 'border-slate-300' : i === 2 ? 'border-amber-600' : 'border-white/30'}`}>
                                            {a.imageUrl ? (
                                                <img src={a.imageUrl} alt={a.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-white/60" />
                                                </div>
                                            )}
                                        </div>
                                        {i === 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"><Crown className="w-3 h-3 text-white" /></div>}
                                        {i === 1 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-[8px] font-black text-white">2</div>}
                                        {i === 2 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center text-[8px] font-black text-white">3</div>}
                                    </div>
                                    <p className="font-bold text-xs text-white truncate">{a.name}</p>
                                    <p className="text-[10px] text-white/50 truncate mb-2">{a.role}</p>
                                    <div className="flex items-center justify-center gap-1">
                                        {i === 0 && <Flame className="w-3 h-3 text-amber-300" />}
                                        <span className={`text-sm font-black ${a.totalPoints >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                            {a.totalPoints >= 0 ? '+' : ''}{a.totalPoints}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
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
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles[color]} mb-4 transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
            <p className="text-3xl font-black text-slate-900 mb-1">{count}</p>
            <p className="text-[10px] text-slate-500 font-bold italic">{sub}</p>
        </div>
    );
}

function NavCard({ title, href, icon: Icon, color }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-md shadow-slate-200/50 border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all group">
            <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 text-center group-hover:text-slate-900 transition-colors">{title}</span>
        </Link>
    );
}

function ProgBar({ label, count, total, color, icon: Icon }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{label}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{count} <span className="text-[10px] text-slate-400 font-bold">({percentage.toFixed(0)}%)</span></span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
