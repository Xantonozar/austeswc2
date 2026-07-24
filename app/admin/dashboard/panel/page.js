"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield, Star, TrendingUp, TrendingDown,
    Plus, Minus, X, Loader2, Search, Users, Trophy,
    UserPlus, Pencil, Trash2, Crown, Zap, User,
    Settings, Clock, LogOut, Sparkles, Target, Activity,
    BarChart3, ChevronDown, ArrowUpRight, ArrowDownRight,
    CircleDot, Flame, Award, Gem
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ROLE_LABELS = {
    'superadmin': 'Super Admin',
    'advisor': 'Advisor',
    'treasurer': 'Treasurer',
    'president': 'President',
    'gs': 'General Secretary',
    'vp': 'Vice President',
    'js': 'Joint Secretary',
    'os': 'Organizing Secretary',
    'executive': 'Executive',
    'senior sub executive': 'Senior Sub Exec',
    'sub executive': 'Sub Exec',
    'junior executive': 'Junior Exec',
};

const ROLE_OPTIONS = Object.keys(ROLE_LABELS);

const ROLE_COLORS = {
    'superadmin': { bg: '#1A5276', text: '#FFFFFF' },
    'advisor': { bg: '#1E8449', text: '#FFFFFF' },
    'treasurer': { bg: '#B7950B', text: '#FFFFFF' },
    'president': { bg: '#922B21', text: '#FFFFFF' },
    'gs': { bg: '#6C3483', text: '#FFFFFF' },
    'vp': { bg: '#2471A3', text: '#FFFFFF' },
    'js': { bg: '#1E8449', text: '#FFFFFF' },
    'os': { bg: '#CA6F1E', text: '#FFFFFF' },
    'executive': { bg: '#2874A6', text: '#FFFFFF' },
    'senior sub executive': { bg: '#148F77', text: '#FFFFFF' },
    'sub executive': { bg: '#B7950B', text: '#FFFFFF' },
    'junior executive': { bg: '#2E86C1', text: '#FFFFFF' },
};

const C = {
    primary: '#1565C0',
    primaryDark: '#0D47A1',
    primaryLight: '#BBDEFB',
    green: '#2E7D52',
    greenLight: '#C8E6C9',
    warmBlue: '#1976D2',
    warmBlueLight: '#BBDEFB',
    navy: '#1A237E',
    text: '#0D1117',
    textSecondary: '#495057',
    surface: '#F0F2F5',
    card: '#FFFFFF',
    border: '#D0D5DD',
    borderLight: '#E9ECEF',
    error: '#B71C1C',
    errorLight: '#FFCDD2',
    orange: '#E65100',
    orangeLight: '#FFE0B2',
    purple: '#4A148C',
    purpleLight: '#E1BEE7',
    primaryContainer: '#E3F2FD',
    textSecondaryVariant: '#6C757D',
    errorContainer: '#FFEBEE',
};

function relativeTime(dateStr) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ═══ Animated Background ═══ */
function AnimatedBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="mesh-overlay" />
        </div>
    );
}

export default function PanelPage() {
    const [admins, setAdmins] = useState([]);
    const [myRole, setMyRole] = useState(null);
    const [myName, setMyName] = useState(null);
    const [myId, setMyId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [search, setSearch] = useState("");
    const [evolveModal, setEvolveModal] = useState(null);
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const [roleRes, res] = await Promise.all([
                fetch("/api/admin/panel/my-role"),
                fetch("/api/admin/panel"),
            ]);
            if (roleRes.status === 401) { router.push("/admin/login"); return; }
            const rd = await roleRes.json();
            setMyRole(rd.role);
            setMyName(rd.name);
            setMyId(rd.id);
            const data = await res.json();
            setAdmins(data.admins || []);
        } catch { toast.error("Failed to load panel"); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const myIndex = ROLE_OPTIONS.indexOf(myRole);
    const me = admins.find(a => a._id === myId);
    const subordinates = admins.filter(a => {
        const aIndex = ROLE_OPTIONS.indexOf(a.role);
        return myRole === "superadmin" ? a.role !== "superadmin" : aIndex > myIndex;
    });

    const filtered = subordinates.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.username.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
    );

    const leaderboard = [...subordinates].sort((a, b) => b.totalPoints - a.totalPoints);
    const totalPointsGiven = subordinates.reduce((sum, a) => sum + Math.max(0, a.totalPoints), 0);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'panel-list', label: 'Members', icon: Users },
        { id: 'evolution', label: 'Evolve', icon: Sparkles },
        { id: 'leaderboard', label: 'Rankings', icon: Trophy },
        { id: 'history', label: 'History', icon: Clock },
        ...(myRole === "superadmin" ? [{ id: 'management', label: 'Manage', icon: Settings }] : []),
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: C.surface }}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl animate-spin" style={{ border: '3px solid #E6EAF2', borderTopColor: C.primary }} />
                    <Zap className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: C.primary }} />
                </div>
                <p className="text-[10px] font-semibold tracking-widest uppercase mt-4" style={{ color: C.textSecondary }}>Loading Panel</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans relative" style={{ background: C.surface }}>
            <AnimatedBackground />
            <Toaster position="top-center" toastOptions={{
                style: { background: '#FFFFFF', color: 'C.text', borderRadius: '14px', fontWeight: 600, fontSize: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
                success: { iconTheme: { primary: '#43e97b', secondary: '#FFFFFF' } },
            }} />

            {/* ═══ Header ═══ */}
            <header className="sticky top-0 z-40" style={{ background: 'rgba(240,242,248,0.75)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)' }}>
                <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: C.border }} />
                <div className="max-w-6xl mx-auto px-3 sm:px-6">
                    <div className="flex items-center justify-between h-12 sm:h-14">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-lg" style={{ background: C.primary, color: '#FFFFFF' }}>
                                <Shield className="w-4 h-4" />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-bold leading-tight" style={{ color: 'C.text' }}>Panel</p>
                                <p className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: C.primary }}>Management</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-0.5 p-0.5 overflow-x-auto scrollbar-hide max-w-[calc(100vw-140px)] sm:max-w-none" style={{ background: C.card, border: '1px solid ' + C.border }}>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className="relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                                    style={{
                                        background: activeTab === tab.id ? C.primary : 'transparent',
                                        color: activeTab === tab.id ? '#FFFFFF' : C.textSecondary,
                                        boxShadow: activeTab === tab.id ? '0 4px 15px rgba(21,101,192,0.25)' : 'none',
                                    }}>
                                    <tab.icon className="w-3.5 h-3.5" />
                                    <span className="hidden xs:inline">{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-1.5">
                            {myRole === "superadmin" && (
                                <button onClick={() => setCreateModal(true)}
                                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-all hover:shadow-lg active:scale-95"
                                    style={{ background: C.green, color: '#FFFFFF' }}>
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}

                            <div className="relative">
                                <button onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-1.5 px-1.5 py-1 rounded-xl transition-all hover:bg-white/60">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[10px] shadow-sm" style={{ background: ROLE_COLORS[myRole]?.bg || C.primaryContainer, color: ROLE_COLORS[myRole]?.text || C.primary }}>
                                        {myName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <ChevronDown className="w-3 h-3 hidden sm:block" style={{ color: C.textSecondary }} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                            <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-2 w-52 sm:w-56 rounded-2xl overflow-hidden z-50"
                                                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
                                                <div className="p-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                                    <p className="font-bold text-xs" style={{ color: 'C.text' }}>{myName}</p>
                                                    <p className="text-[10px] font-semibold" style={{ color: C.primary }}>{ROLE_LABELS[myRole] || myRole}</p>
                                                </div>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-all hover:bg-red-50" style={{ color: C.error }}>
                                                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══ Content ═══ */}
            <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
                {/* Tab Panels */}
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <OverviewPanel key="overview" subordinates={subordinates} leaderboard={leaderboard} totalPointsGiven={totalPointsGiven} me={me} myRole={myRole} setActiveTab={setActiveTab} setCreateModal={setCreateModal} setEvolveModal={setEvolveModal} />
                    )}
                    {activeTab === "panel-list" && (
                        <PanelList key="list" subordinates={subordinates} myRole={myRole} />
                    )}
                    {activeTab === "evolution" && (
                        <EvolutionPanel key="evo" subordinates={subordinates} setEvolveModal={setEvolveModal} />
                    )}
                    {activeTab === "leaderboard" && (
                        <LeaderboardPanel key="lb" leaderboard={leaderboard} />
                    )}
                    {activeTab === "history" && me && (
                        <HistoryPanel key="hist" myId={myId} />
                    )}
                    {activeTab === "management" && myRole === "superadmin" && (
                        <ManagementPanel key="mgmt" admins={admins} setEditModal={setEditModal} setCreateModal={setCreateModal} />
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {evolveModal && <EvolveModal admin={evolveModal} onClose={() => setEvolveModal(null)} onDone={() => { setEvolveModal(null); fetchData(); }} />}
                {createModal && <CreateAdminModal onClose={() => setCreateModal(false)} onDone={() => { setCreateModal(null); fetchData(); }} />}
                {editModal && <EditAdminModal admin={editModal} onClose={() => setEditModal(null)} onDone={() => { setEditModal(null); fetchData(); }} />}
            </AnimatePresence>
        </div>
    );
}

/* ═══════ Overview ═══════ */
function OverviewPanel({ subordinates, leaderboard, totalPointsGiven, me, myRole, setActiveTab, setCreateModal, setEvolveModal }) {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        fetch("/api/admin/panel/history")
            .then(r => r.json())
            .then(d => setHistory((d.history || []).slice(0, 8)))
            .catch(() => {})
            .finally(() => setLoadingHistory(false));
    }, []);

    const roleBreakdown = subordinates.reduce((acc, a) => {
        const label = ROLE_LABELS[a.role] || a.role;
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {});
    const sortedRoles = Object.entries(roleBreakdown).sort((a, b) => b[1] - a[1]);
    const maxRoleCount = Math.max(...sortedRoles.map(([, c]) => c), 1);

    const myRank = leaderboard.findIndex(a => a._id === me?._id) + 1;
    const avgPoints = subordinates.length > 0 ? Math.round(totalPointsGiven / subordinates.length) : 0;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-4 sm:space-y-5">

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {[
                    { label: 'Total Members', value: subordinates.length, icon: Users, bg: '#1565C0', text: '#FFFFFF', iconBg: 'rgba(255,255,255,0.15)' },
                    { label: 'Avg Points', value: avgPoints, icon: BarChart3, bg: '#2E7D52', text: '#FFFFFF', iconBg: 'rgba(255,255,255,0.15)' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="rounded-2xl p-3.5 sm:p-4 group hover:shadow-xl transition-all duration-300"
                        style={{ background: s.bg, boxShadow: `0 4px 20px ${s.bg}40` }}>
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                                <s.icon className="w-4.5 h-4.5" style={{ color: s.text }} />
                            </div>
                            <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black" style={{ color: s.text }}>{s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid: Role Distribution + Leaderboard Top 5 */}
            <div className="grid lg:grid-cols-5 gap-3 sm:gap-4">

                {/* Role Distribution */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-3 rounded-2xl p-4 sm:p-5"
                    style={{ background: '#1A237E', boxShadow: '0 4px 20px rgba(26,35,126,0.3)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-white">Role Distribution</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
                            {subordinates.length} total
                        </span>
                    </div>
                    {sortedRoles.length > 0 ? (
                        <div className="space-y-2.5">
                            {sortedRoles.map(([role, count]) => {
                                const pct = maxRoleCount > 0 ? (count / maxRoleCount) * 100 : 0;
                                const roleKey = Object.keys(ROLE_LABELS).find(k => ROLE_LABELS[k] === role);
                                const rColor = roleKey ? ROLE_COLORS[roleKey] : { bg: '#5C6BC0', text: '#FFFFFF' };
                                return (
                                    <div key={role} className="flex items-center gap-2.5">
                                        <span className="w-28 sm:w-32 text-[10px] sm:text-[11px] font-bold truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{role}</span>
                                        <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                                                className="h-full rounded-lg flex items-center justify-end pr-2"
                                                style={{ background: rColor.bg }}>
                                                <span className="text-[10px] font-black" style={{ color: rColor.text }}>{count}</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>No members yet</p>
                    )}
                </motion.div>

                {/* Leaderboard Top 5 */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-2 rounded-2xl p-4 sm:p-5"
                    style={{ background: '#0D47A1', boxShadow: '0 4px 20px rgba(13,71,161,0.3)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-white">Top Performers</h3>
                        <button onClick={() => setActiveTab('leaderboard')} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all hover:shadow-md" style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
                            View All
                        </button>
                    </div>
                    {leaderboard.length > 0 ? (
                        <div className="space-y-2">
                            {leaderboard.slice(0, 5).map((a, i) => {
                                return (
                                    <div key={a._id} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all hover:shadow-md"
                                        style={{ background: i === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', border: i === 0 ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)' }}>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
                                            style={{ background: i === 0 ? '#F59E0B' : i === 1 ? 'rgba(255,255,255,0.2)' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}>
                                            {i < 3 ? <Crown className="w-3.5 h-3.5" /> : `#${i + 1}`}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs truncate text-white">{a.name}</p>
                                            <p className="text-[9px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{ROLE_LABELS[a.role] || a.role}</p>
                                        </div>
                                        <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{
                                            background: a.totalPoints >= 0 ? 'rgba(76,175,80,0.25)' : 'rgba(244,67,54,0.25)',
                                            color: a.totalPoints >= 0 ? '#81C784' : '#EF9A9A',
                                        }}>
                                            {a.totalPoints >= 0 ? '+' : ''}{a.totalPoints}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>No data yet</p>
                    )}
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="rounded-2xl p-4 sm:p-5"
                style={{ background: '#1B2838', boxShadow: '0 4px 20px rgba(27,40,56,0.3)' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white">Recent Activity</h3>
                    <button onClick={() => setActiveTab('history')} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all hover:shadow-md" style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF' }}>
                        View All
                    </button>
                </div>
                {loadingHistory ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 rounded-lg animate-spin" style={{ border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#FFFFFF' }} />
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-1.5">
                        {history.map((h) => (
                            <div key={h._id} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all hover:bg-white/5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                    background: h.points >= 0 ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
                                    color: h.points >= 0 ? '#81C784' : '#EF9A9A',
                                }}>
                                    {h.points >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="font-bold text-xs truncate text-white">{h.grantorId?.name || 'Unknown'}</p>
                                        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>→</span>
                                        <p className="font-medium text-xs truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{h.targetId?.name || 'Unknown'}</p>
                                    </div>
                                    <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{h.reason}</p>
                                </div>
                                <span className="text-[11px] font-black flex-shrink-0" style={{ color: h.points >= 0 ? '#81C784' : '#EF9A9A' }}>
                                    {h.points >= 0 ? '+' : ''}{h.points}
                                </span>
                                <span className="text-[9px] flex-shrink-0 hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                    {relativeTime(h.createdAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>No activity yet</p>
                )}
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                    { label: 'Evolve Member', desc: 'Add or deduct points', icon: Sparkles, bg: '#1565C0', action: () => setActiveTab('evolution') },
                    { label: 'Rankings', desc: 'View full leaderboard', icon: Trophy, bg: '#E65100', action: () => setActiveTab('leaderboard') },
                    { label: 'View History', desc: 'All point changes', icon: Clock, bg: '#2E7D52', action: () => setActiveTab('history') },
                ].map((a, i) => (
                    <motion.button key={a.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                        onClick={a.action}
                        className="rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 hover:shadow-xl active:scale-[0.97] group"
                        style={{ background: a.bg, boxShadow: `0 4px 16px ${a.bg}40` }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform" style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <a.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-bold text-xs sm:text-sm text-white">{a.label}</p>
                        <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{a.desc}</p>
                    </motion.button>
                ))}
            </div>

            {myRole === "superadmin" && (
                <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    onClick={() => setCreateModal(true)}
                    className="w-full rounded-2xl py-3 sm:py-3.5 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
                    style={{ background: C.green, color: '#FFFFFF' }}>
                    <UserPlus className="w-4 h-4" />
                    Add New Admin
                </motion.button>
            )}
        </motion.div>
    );
}

/* ═══════ Panel List ═══════ */
function PanelList({ subordinates, myRole }) {
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterTeam, setFilterTeam] = useState("all");

    const uniqueRoles = [...new Set(subordinates.map(a => a.role))].sort();
    const uniqueTeams = [...new Set(subordinates.map(a => a.team).filter(Boolean))].sort();

    const filtered = subordinates.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.username.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "all" || a.role === filterRole;
        const matchTeam = filterTeam === "all" || a.team === filterTeam;
        return matchSearch && matchRole && matchTeam;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-3">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textSecondary }} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full rounded-2xl py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
                    style={{ background: C.card, border: '1px solid ' + C.border, color: C.text, boxShadow: '0 4px 24px rgba(0,0,0,0.03)', ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>Role:</span>
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        <button onClick={() => setFilterRole("all")}
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0"
                            style={{ background: filterRole === "all" ? C.primary : C.card, color: filterRole === "all" ? '#FFFFFF' : C.textSecondary, border: `1px solid ${filterRole === "all" ? C.primary : C.border}` }}>
                            All
                        </button>
                        {uniqueRoles.map(role => {
                            const rc = ROLE_COLORS[role] || { bg: C.primaryLight, text: C.primary };
                            return (
                                <button key={role} onClick={() => setFilterRole(role)}
                                    className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0"
                                    style={{ background: filterRole === role ? rc.bg : C.card, color: filterRole === role ? rc.text : C.textSecondary, border: `1px solid ${filterRole === role ? rc.bg : C.border}` }}>
                                    {ROLE_LABELS[role] || role}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {uniqueTeams.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>Team:</span>
                        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                            <button onClick={() => setFilterTeam("all")}
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0"
                                style={{ background: filterTeam === "all" ? C.primary : C.card, color: filterTeam === "all" ? '#FFFFFF' : C.textSecondary, border: `1px solid ${filterTeam === "all" ? C.primary : C.border}` }}>
                                All
                            </button>
                            {uniqueTeams.map(team => (
                                <button key={team} onClick={() => setFilterTeam(team)}
                                    className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0"
                                    style={{ background: filterTeam === team ? '#4A148C' : C.card, color: filterTeam === team ? '#FFFFFF' : C.textSecondary, border: `1px solid ${filterTeam === team ? '#4A148C' : C.border}` }}>
                                    {team}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-3xl p-12 sm:p-16 text-center" style={{ background: C.card, border: '1px solid ' + C.border }}>
                    <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: C.primaryLight }}>
                        <Users className="w-6 h-6" style={{ color: C.primary }} />
                    </div>
                    <p className="font-semibold text-xs" style={{ color: C.textSecondary }}>No members found</p>
                </div>
            ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: C.card, border: '1px solid ' + C.border, boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr style={{ background: C.primaryLight }}>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.primary }}>#</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.primary }}>Member</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.primary }}>Role</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.primary }}>Team</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: C.primary }}>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((a, i) => (
                                    <motion.tr key={a._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                                        className="border-t transition-all hover:bg-white/40" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                                        <td className="px-4 py-3">
                                            <span className="text-[11px] font-bold" style={{ color: C.textSecondary }}>{i + 1}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm"
                                                    style={{ background: ROLE_COLORS[a.role]?.bg || C.primaryLight, color: ROLE_COLORS[a.role]?.text || C.primary }}>
                                                    {a.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-xs whitespace-nowrap" style={{ color: C.text }}>{a.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap" style={{ background: ROLE_COLORS[a.role]?.bg || C.primaryLight, color: ROLE_COLORS[a.role]?.text || C.primary }}>
                                                {ROLE_LABELS[a.role] || a.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {a.team ? (
                                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap" style={{ background: '#F3E5F5', color: '#6A1B9A' }}>
                                                    {a.team}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-medium" style={{ color: C.textSecondaryVariant }}>—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black" style={{
                                                background: a.totalPoints >= 0 ? C.greenLight : C.errorLight,
                                                color: a.totalPoints >= 0 ? C.green : C.error,
                                            }}>
                                                {a.totalPoints >= 0 ? '+' : ''}{a.totalPoints}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-2.5 border-t text-[10px] font-medium" style={{ borderColor: 'rgba(0,0,0,0.04)', color: C.textSecondary }}>
                        Showing {filtered.length} of {subordinates.length} members
                    </div>
                </div>
            )}
        </motion.div>
    );
}

/* ═══════ Evolution ═══════ */
function EvolutionPanel({ subordinates, setEvolveModal }) {
    const [q, setQ] = useState("");
    const list = subordinates.filter(a => a.name.toLowerCase().includes(q.toLowerCase()) || a.role.toLowerCase().includes(q.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-3 sm:space-y-4">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textSecondary }} />
                <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Quick find..."
                    className="w-full rounded-2xl py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
                    style={{ background: C.card, border: '1px solid ' + C.border, color: 'C.text', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                {list.map((a, i) => (
                    <motion.div key={a._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02, type: 'spring', stiffness: 300 }}
                        onClick={() => setEvolveModal(a)}
                        className="rounded-2xl p-3 sm:p-3.5 cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-[0.97] group"
                        style={{ background: C.card, border: '1px solid ' + C.border, boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}>
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform duration-300 shadow-sm"
                                style={{ background: ROLE_COLORS[a.role]?.bg || C.primaryLight, color: ROLE_COLORS[a.role]?.text || C.primary }}>
                                {a.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-xs truncate" style={{ color: 'C.text' }}>{a.name}</p>
                                <p className="text-[9px] font-semibold uppercase tracking-wider truncate" style={{ color: C.textSecondary }}>{ROLE_LABELS[a.role] || a.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black" style={{ color: a.totalPoints >= 0 ? '#059669' : C.error }}>
                                {a.totalPoints >= 0 ? '+' : ''}{a.totalPoints}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg" style={{ background: C.primaryLight, color: C.primary }}>
                                Evolve
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ═══════ Leaderboard ═══════ */
function LeaderboardPanel({ leaderboard }) {
    const medals = [
        { bg: C.orangeLight, icon: Crown, color: C.orange },
        { bg: '#E5E9F0', icon: Award, color: C.textSecondary },
        { bg: '#FDEBD0', icon: Award, color: C.orange },
    ];

    if (!leaderboard.length) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-3xl p-12 sm:p-16 text-center" style={{ background: C.card, border: '1px solid ' + C.border }}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: C.primaryLight }}>
                    <Trophy className="w-6 h-6" style={{ color: C.textSecondaryVariant }} />
                </div>
                <p className="font-semibold text-xs" style={{ color: C.textSecondary }}>No rankings yet</p>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-2 sm:space-y-2.5 max-w-2xl">
            {leaderboard.map((a, i) => {
                const isFirst = i === 0;
                const medal = i < 3 ? medals[i] : null;
                return (
                    <motion.div key={a._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
                        className="rounded-2xl px-3 py-3 sm:px-4 sm:py-3.5 flex items-center gap-3 transition-all duration-300 hover:shadow-lg"
                        style={{
                            background: isFirst ? C.primaryLight : C.card,
                            border: '1px solid ' + (isFirst ? C.primary : C.border),
                            backgroundClip: 'padding-box',
                            boxShadow: isFirst ? '0 8px 32px rgba(245,175,25,0.12)' : '0 2px 16px rgba(0,0,0,0.03)',
                        }}>
                        {isFirst && <div className="absolute inset-0 rounded-2xl -z-10" style={{ background: C.orange, padding: '2px' }} />}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm"
                            style={{
                                background: medal ? medal.bg : i < 3 ? C.primaryLight : 'C.primaryLight',
                                color: medal ? '#FFFFFF' : i < 3 ? '#FFFFFF' : C.textSecondary,
                                boxShadow: medal ? `0 4px 12px ${medal?.bg?.includes('f5af19') ? 'rgba(245,175,25,0.3)' : 'rgba(0,0,0,0.1)'}` : 'none',
                            }}>
                            {medal ? <medal.icon className="w-5 h-5" /> : `#${i + 1}`}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs sm:text-sm truncate" style={{ color: 'C.text' }}>{a.name}</p>
                            <p className="text-[10px] font-medium truncate" style={{ color: C.textSecondary }}>{ROLE_LABELS[a.role] || a.role}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isFirst && <Flame className="w-4 h-4" style={{ color: C.orange }} />}
                            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-xs sm:text-sm" style={{
                                background: isFirst ? C.primary : a.totalPoints >= 0 ? C.greenLight : C.errorContainer,
                                color: isFirst ? '#FFFFFF' : a.totalPoints >= 0 ? '#059669' : C.error,
                                boxShadow: isFirst ? '0 4px 12px rgba(245,175,25,0.3)' : 'none',
                            }}>
                                {a.totalPoints >= 0 ? '+' : ''}{a.totalPoints}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

/* ═══════ History ═══════ */
function HistoryPanel({ myId }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/panel/history?targetId=${myId}`)
            .then(r => r.json())
            .then(d => setHistory(d.history || []))
            .catch(() => toast.error("Failed"))
            .finally(() => setLoading(false));
    }, [myId]);

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="relative">
                <div className="w-8 h-8 rounded-xl animate-spin" style={{ border: '2px solid #E6EAF2', borderTopColor: C.primary }} />
            </div>
        </div>
    );

    if (!history.length) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-3xl p-12 sm:p-16 text-center" style={{ background: C.card, border: '1px solid ' + C.border }}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: C.primaryLight }}>
                    <Clock className="w-6 h-6" style={{ color: C.textSecondaryVariant }} />
                </div>
                <p className="font-semibold text-xs" style={{ color: C.textSecondary }}>No history yet</p>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-2 sm:space-y-2.5 max-w-2xl">
            {history.map((h, i) => (
                <motion.div key={h._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    className="rounded-xl px-3 py-3 sm:px-4 sm:py-3 flex items-start gap-2.5 transition-all duration-300"
                    style={{ background: C.card, border: '1px solid ' + C.border, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm" style={{
                        background: h.points >= 0 ? C.greenLight : C.errorLight,
                        color: h.points >= 0 ? C.green : C.error,
                    }}>
                        {h.points >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-xs sm:text-sm truncate" style={{ color: 'C.text' }}>{h.grantorId?.name || "Unknown"}</p>
                            <span className="font-black text-[11px] sm:text-xs flex-shrink-0" style={{ color: h.points >= 0 ? '#059669' : C.error }}>
                                {h.points >= 0 ? '+' : ''}{h.points}
                            </span>
                        </div>
                        <p className="text-[11px] sm:text-xs mt-0.5 truncate" style={{ color: C.textSecondary }}>{h.reason}</p>
                        <p className="text-[9px] sm:text-[10px] mt-0.5" style={{ color: C.textSecondaryVariant }}>
                            <span className="sm:hidden">{relativeTime(h.createdAt)}</span>
                            <span className="hidden sm:inline">{new Date(h.createdAt).toLocaleString()}</span>
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

/* ═══════ Management ═══════ */
function ManagementPanel({ admins, setEditModal, setCreateModal }) {
    const [search, setSearch] = useState("");
    const filtered = admins.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.username.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-3 sm:space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textSecondary }} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admins..."
                        className="w-full rounded-2xl py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
                        style={{ background: C.card, border: '1px solid ' + C.border, color: 'C.text', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }} />
                </div>
                <button onClick={() => setCreateModal(true)}
                    className="flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                    style={{ background: C.green, color: '#FFFFFF' }}>
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Admin</span>
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-2xl overflow-hidden" style={{ background: C.card, border: '1px solid ' + C.border, boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: C.primaryLight }}>
                                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textSecondary }}>Admin</th>
                                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textSecondary }}>Role</th>
                                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textSecondary }}>Email</th>
                                <th className="text-right px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: C.textSecondary }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a._id} className="border-t transition-all hover:bg-white/40" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm" style={{ background: ROLE_COLORS[a.role]?.bg, color: ROLE_COLORS[a.role]?.text }}>
                                                {a.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm" style={{ color: 'C.text' }}>{a.name}</p>
                                                <p className="text-[10px] font-medium" style={{ color: C.textSecondary }}>@{a.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ background: ROLE_COLORS[a.role]?.bg, color: ROLE_COLORS[a.role]?.text }}>
                                            {ROLE_LABELS[a.role] || a.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-medium" style={{ color: C.textSecondary }}>{a.email}</td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setEditModal(a)} className="p-2 rounded-xl transition-all hover:bg-white/80" style={{ color: C.textSecondary }}>
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={async () => {
                                                if (!confirm(`Delete ${a.name}?`)) return;
                                                const res = await fetch(`/api/admin/panel/${a._id}`, { method: "DELETE" });
                                                if (res.ok) toast.success("Deleted");
                                                else { const d = await res.json(); toast.error(d.error || "Failed"); }
                                            }} className="p-2 rounded-xl transition-all hover:bg-red-50" style={{ color: C.error }}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-2">
                {filtered.map((a, i) => (
                    <motion.div key={a._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                        className="rounded-2xl px-3 py-3 flex items-center gap-2.5 transition-all duration-300"
                        style={{ background: C.card, border: '1px solid ' + C.border, boxShadow: '0 2px 16px rgba(0,0,0,0.03)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm" style={{ background: ROLE_COLORS[a.role]?.bg, color: ROLE_COLORS[a.role]?.text }}>
                            {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate" style={{ color: 'C.text' }}>{a.name}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0" style={{ background: ROLE_COLORS[a.role]?.bg, color: ROLE_COLORS[a.role]?.text }}>
                                    {ROLE_LABELS[a.role] || a.role}
                                </span>
                                <span className="text-[10px] font-medium truncate" style={{ color: C.textSecondary }}>{a.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => setEditModal(a)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-white/80" style={{ color: C.textSecondary }}>
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={async () => {
                                if (!confirm(`Delete ${a.name}?`)) return;
                                const res = await fetch(`/api/admin/panel/${a._id}`, { method: "DELETE" });
                                if (res.ok) toast.success("Deleted");
                                else { const d = await res.json(); toast.error(d.error || "Failed"); }
                            }} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-red-50" style={{ color: C.error }}>
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/* ═══════ Evolve Modal ═══════ */
function EvolveModal({ admin, onClose, onDone }) {
    const [points, setPoints] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const add = (n) => setPoints(p => String(parseInt(p || "0") + n));
    const sub = (n) => setPoints(p => String(parseInt(p || "0") - n));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const p = parseInt(points);
        if (!p || p === 0) { toast.error("Enter valid points"); return; }
        if (!reason.trim()) { toast.error("Enter a reason"); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/admin/panel/evolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: admin._id, points: p, reason }),
            });
            const data = await res.json();
            if (res.ok) { toast.success(p > 0 ? `+${p} points` : `${p} points`); onDone(); }
            else toast.error(data.error || "Failed");
        } catch { toast.error("Failed"); }
        finally { setLoading(false); }
    };

    const inputStyle = { background: 'rgba(242,245,251,0.8)', border: '1px solid rgba(255,255,255,0.9)', color: 'C.text' };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative" style={{ background: C.card }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: C.primary }} />
                <div className="flex items-center justify-between mb-5 mt-1">
                    <div>
                        <h2 className="text-base sm:text-lg font-black" style={{ color: 'C.text' }}>Evolve {admin.name}</h2>
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.primary }}>{ROLE_LABELS[admin.role] || admin.role}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-all" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-3 gap-1.5">
                        {[10, 5, 1].map(n => (
                            <button key={n} type="button" onClick={() => add(n)}
                                className="py-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:shadow-md active:scale-95"
                                style={{ background: C.greenLight, color: C.green, border: 'none' }}>
                                <Plus className="w-3 h-3 inline mr-0.5" />{n}
                            </button>
                        ))}
                    </div>
                    <input type="number" value={points} onChange={e => setPoints(e.target.value)}
                        className="w-full rounded-xl py-3 px-4 font-black text-2xl text-center outline-none transition-all focus:ring-2"
                        style={{ ...inputStyle, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} placeholder="0" />
                    <div className="grid grid-cols-3 gap-1.5">
                        {[10, 5, 1].map(n => (
                            <button key={n} type="button" onClick={() => sub(n)}
                                className="py-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:shadow-md active:scale-95"
                                style={{ background: C.errorLight, color: C.error, border: 'none' }}>
                                <Minus className="w-3 h-3 inline mr-0.5" />{n}
                            </button>
                        ))}
                    </div>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2}
                        placeholder="Reason for evolution..."
                        className="w-full rounded-xl py-2.5 sm:py-3 px-4 font-medium text-xs sm:text-sm outline-none resize-none transition-all focus:ring-2"
                        style={{ ...inputStyle, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} />
                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl disabled:opacity-60 active:scale-[0.98]"
                        style={{ background: C.primary, color: '#FFFFFF' }}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}

/* ═══════ Create Admin Modal ═══════ */
function CreateAdminModal({ onClose, onDone }) {
    const [form, setForm] = useState({ username: "", password: "", name: "", email: "", role: "junior executive", team: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/panel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            const data = await res.json();
            if (res.ok) { toast.success("Created!"); onDone(); }
            else toast.error(data.error || "Failed");
        } catch { toast.error("Failed"); }
        finally { setLoading(false); }
    };

    const s = { background: 'rgba(242,245,251,0.8)', border: '1px solid rgba(255,255,255,0.9)', color: 'C.text' };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative" style={{ background: C.card }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: C.green }} />
                <div className="flex items-center justify-between mb-5 mt-1">
                    <h2 className="text-base sm:text-lg font-black" style={{ color: 'C.text' }}>Create Admin</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-all" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-2.5">
                    {[
                        { label: "Name", key: "name", placeholder: "Full name" },
                        { label: "Username", key: "username", placeholder: "username" },
                        { label: "Email", key: "email", placeholder: "email", type: "email" },
                        { label: "Password", key: "password", placeholder: "Password", type: "password" },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>{f.label}</label>
                            <input type={f.type || "text"} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required={f.key !== "email"}
                                placeholder={f.placeholder} className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} />
                        </div>
                    ))}
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>Role</label>
                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                            className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }}>
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>Team</label>
                        <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })}
                            className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }}>
                            <option value="">No Team</option>
                            <option value="Event Management">Event Management</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Research & Development">Research & Development</option>
                            <option value="Public Relationship">Public Relationship</option>
                            <option value="Content Writing">Content Writing</option>
                            <option value="Graphics">Graphics</option>
                            <option value="Web Development">Web Development</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl disabled:opacity-60 active:scale-[0.98]"
                        style={{ background: C.green, color: '#FFFFFF' }}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        {loading ? "Creating..." : "Create Admin"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}

/* ═══════ Edit Admin Modal ═══════ */
function EditAdminModal({ admin, onClose, onDone }) {
    const [form, setForm] = useState({ name: admin.name, email: admin.email, role: admin.role, team: admin.team || "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const body = { name: form.name, email: form.email, role: form.role, team: form.team };
            if (form.password) body.password = form.password;
            const res = await fetch(`/api/admin/panel/${admin._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (res.ok) { toast.success("Updated!"); onDone(); }
            else toast.error(data.error || "Failed");
        } catch { toast.error("Failed"); }
        finally { setLoading(false); }
    };

    const s = { background: 'rgba(242,245,251,0.8)', border: '1px solid rgba(255,255,255,0.9)', color: 'C.text' };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-5 sm:p-6 shadow-2xl relative" style={{ background: C.card }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: C.orange }} />
                <div className="flex items-center justify-between mb-5 mt-1">
                    <h2 className="text-base sm:text-lg font-black" style={{ color: 'C.text' }}>Edit {admin.name}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-all" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-2.5">
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>Name</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} />
                    </div>
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} />
                    </div>
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>Role</label>
                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                            className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }}>
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>Team</label>
                        <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })}
                            className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }}>
                            <option value="">No Team</option>
                            <option value="Event Management">Event Management</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Research & Development">Research & Development</option>
                            <option value="Public Relationship">Public Relationship</option>
                            <option value="Content Writing">Content Writing</option>
                            <option value="Graphics">Graphics</option>
                            <option value="Web Development">Web Development</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] sm:text-[10px] font-bold mb-1 block uppercase tracking-wider" style={{ color: C.textSecondary }}>New Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                            placeholder="Leave blank to keep" className="w-full rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2" style={{ ...s, ['--tw-ring-color']: 'rgba(21,101,192,0.2)' }} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl disabled:opacity-60 active:scale-[0.98]"
                        style={{ background: C.orange, color: '#FFFFFF' }}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
