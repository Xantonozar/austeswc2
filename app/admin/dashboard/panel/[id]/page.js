"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Star, TrendingUp, Pencil, X, Check,
    Trophy, Mail, User, AtSign, Calendar, Phone,
    Zap, Hash, BookOpen, Users, Loader2, Camera
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

const ROLE_LABELS = {
    'superadmin': 'Super Admin', 'advisor': 'Advisor', 'treasurer': 'Treasurer',
    'president': 'President', 'vp': 'Vice President', 'gs': 'General Secretary',
    'js': 'Joint Secretary', 'os': 'Organizing Secretary',
    'executive': 'Executive', 'senior sub executive': 'Senior Sub Exec',
    'sub executive': 'Sub Exec', 'junior executive': 'Junior Exec',
};

function relativeTime(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminProfilePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [profile, setProfile] = useState(null);
    const [evolutions, setEvolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [myId, setMyId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        Promise.all([
            fetch(`/api/admin/panel/${id}`).then(r => r.json()),
            fetch('/api/admin/panel/my-role').then(r => r.json()),
        ]).then(([d, me]) => {
            setProfile(d.profile);
            setEvolutions(d.evolutions || []);
            setMyId(me.id);
            setForm({
                name: d.profile.name || '',
                email: d.profile.email || '',
                phone: d.profile.phone || '',
                department: d.profile.department || '',
                studentId: d.profile.studentId || '',
                yearSemester: d.profile.yearSemester || '',
                labGroup: d.profile.labGroup || '',
            });
        }).catch(() => toast.error("Failed to load profile"))
          .finally(() => setLoading(false));
    }, [id]);

    const isOwn = myId === id;

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/panel/${id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(p => ({ ...p, ...form }));
                setEditOpen(false);
                toast.success('Profile updated');
            } else {
                toast.error(data.error || 'Failed');
            }
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC' }}>
                <div className="relative">
                    <div className="w-10 h-10 rounded-2xl animate-spin" style={{ border: '2.5px solid #E2E8F0', borderTopColor: '#6366F1' }} />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#F8FAFC' }}>
                <p className="text-xs font-semibold" style={{ color: '#64748B' }}>Profile not found</p>
                <button onClick={() => router.back()} className="px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-indigo-500">Go Back</button>
            </div>
        );
    }

    const pts = profile.totalPoints;

    return (
        <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
            <Toaster position="top-center" toastOptions={{
                style: { background: '#1E293B', color: '#FFF', borderRadius: '12px', fontWeight: 600, fontSize: '11px', padding: '10px 16px' },
            }} />

            {/* ── Mobile ── */}
            <div className="md:hidden">
                <MobileProfile
                    profile={profile} evolutions={evolutions} pts={pts}
                    isOwn={isOwn} onEdit={() => setEditOpen(true)} onBack={() => router.back()}
                />
            </div>

            {/* ── Desktop ── */}
            <div className="hidden md:block">
                <DesktopProfile
                    profile={profile} evolutions={evolutions} pts={pts}
                    isOwn={isOwn} onEdit={() => setEditOpen(true)} onBack={() => router.back()}
                />
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editOpen && (
                    <EditModal form={form} setForm={setForm} saving={saving} onSave={handleSave} onClose={() => setEditOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MOBILE
   ═══════════════════════════════════════════════════════════════════════════════ */
function MobileProfile({ profile, evolutions, pts, isOwn, onEdit, onBack }) {
    return (
        <div className="px-4 pb-8 space-y-3 max-w-lg mx-auto">
            {/* Top bar */}
            <div className="sticky top-0 z-50 py-3 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.85)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={onBack}
                        className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                        style={{ background: '#FFF', border: '1px solid #E2E8F0', color: '#64748B' }}>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>Profile</p>
                </div>
                {isOwn && (
                    <button onClick={onEdit}
                        className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                        style={{ background: '#6366F1', color: '#FFF' }}>
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] p-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #312E81 0%, #4338CA 40%, #6366F1 100%)' }}>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full" style={{ background: 'rgba(129,140,248,0.15)' }} />
                <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full" style={{ background: 'rgba(99,102,241,0.1)' }} />
                <div className="absolute top-6 right-12 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />

                <div className="relative z-10 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-[76px] h-[76px] rounded-[22px] overflow-hidden" style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.2)' }}>
                            {profile.imageUrl ? (
                                <img src={profile.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-2xl" style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF' }}>
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-lg flex items-center justify-center font-black text-[9px]"
                            style={{ background: '#F59E0B', color: '#FFF', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
                            {profile.rank}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-[15px] font-extrabold text-white truncate">{profile.name}</h1>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="px-2 py-[3px] rounded-md text-[8px] font-bold uppercase tracking-widest"
                                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                                {ROLE_LABELS[profile.role] || profile.role}
                            </span>
                            {profile.team && (
                                <span className="px-2 py-[3px] rounded-md text-[8px] font-bold"
                                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                                    {profile.team}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>@{profile.username}</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
                className="grid grid-cols-4 gap-2">
                {[
                    { v: pts >= 0 ? `+${pts}` : pts, l: 'Points', c: pts >= 0 ? '#10B981' : '#EF4444' },
                    { v: `#${profile.rank}`, l: 'Rank', c: '#F59E0B' },
                    { v: profile.evolutionCount, l: 'Events', c: '#8B5CF6' },
                    { v: profile.positiveCount, l: 'Up', c: '#3B82F6' },
                ].map((s, i) => (
                    <motion.div key={s.l} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 + i * 0.03 }}
                        className="rounded-[14px] py-3 text-center" style={{ background: '#FFF', border: '1px solid #F1F5F9' }}>
                        <p className="text-[14px] font-extrabold leading-none" style={{ color: s.c }}>{s.v}</p>
                        <p className="text-[7px] font-bold tracking-widest uppercase mt-1" style={{ color: '#CBD5E1' }}>{s.l}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="rounded-[18px] p-4" style={{ background: '#FFF', border: '1px solid #F1F5F9' }}>
                <InfoGrid profile={profile} />
            </motion.div>

            {/* Timeline */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-[18px] p-4" style={{ background: '#FFF', border: '1px solid #F1F5F9' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-extrabold tracking-wide" style={{ color: '#1E293B' }}>ACTIVITY</h3>
                    <span className="text-[8px] font-bold px-2 py-[2px] rounded-md" style={{ background: '#F1F5F9', color: '#64748B' }}>{evolutions.length}</span>
                </div>
                <Timeline items={evolutions.slice(0, 10)} />
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DESKTOP
   ═══════════════════════════════════════════════════════════════════════════════ */
function DesktopProfile({ profile, evolutions, pts, isOwn, onEdit, onBack }) {
    return (
        <div className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
            {/* Top bar */}
            <div className="sticky top-0 z-50 py-4 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.85)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={onBack}
                        className="w-9 h-9 rounded-xl flex items-center justify-center hover:shadow-md transition-all active:scale-95"
                        style={{ background: '#FFF', border: '1px solid #E2E8F0', color: '#64748B' }}>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>Profile</p>
                </div>
                {isOwn && (
                    <button onClick={onEdit}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-white hover:shadow-lg transition-all active:scale-[0.97]"
                        style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                        <Pencil className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                )}
            </div>

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[28px] p-7 lg:p-8 relative overflow-hidden mt-1"
                style={{ background: 'linear-gradient(135deg, #312E81 0%, #4338CA 35%, #6366F1 70%, #818CF8 100%)', boxShadow: '0 16px 48px rgba(67,56,202,0.25)' }}>
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full" style={{ background: 'rgba(129,140,248,0.12)' }} />
                <div className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full" style={{ background: 'rgba(99,102,241,0.08)' }} />
                <div className="absolute top-8 right-1/4 w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />

                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-[28px] overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15), 0 12px 32px rgba(0,0,0,0.2)' }}>
                            {profile.imageUrl ? (
                                <img src={profile.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-3xl lg:text-4xl" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF' }}>
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-[12px] flex items-center justify-center font-black text-[11px]"
                            style={{ background: '#F59E0B', color: '#FFF', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>
                            {profile.rank}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-white truncate">{profile.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}>
                                {ROLE_LABELS[profile.role] || profile.role}
                            </span>
                            {profile.team && (
                                <span className="px-3 py-1 rounded-lg text-[10px] font-bold"
                                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>
                                    {profile.team}
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-medium mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>@{profile.username}</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats + Info */}
            <div className="grid lg:grid-cols-5 gap-4 mt-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-2 grid grid-cols-2 gap-3">
                    {[
                        { v: pts >= 0 ? `+${pts}` : pts, l: 'Total Points', c: pts >= 0 ? '#10B981' : '#EF4444', bg: pts >= 0 ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)' },
                        { v: `#${profile.rank}`, l: 'Rank', c: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
                        { v: profile.evolutionCount, l: 'Evolutions', c: '#8B5CF6', bg: 'rgba(139,92,246,0.06)' },
                        { v: profile.positiveCount, l: 'Positive', c: '#3B82F6', bg: 'rgba(59,130,246,0.06)' },
                    ].map((s, i) => (
                        <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 + i * 0.04 }}
                            className="rounded-2xl p-4" style={{ background: '#FFF', border: '1px solid #F1F5F9' }}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5" style={{ background: s.bg }}>
                                <div className="w-2 h-2 rounded-full" style={{ background: s.c }} />
                            </div>
                            <p className="text-xl font-extrabold leading-none" style={{ color: s.c }}>{s.v}</p>
                            <p className="text-[9px] font-bold tracking-widest uppercase mt-1.5" style={{ color: '#94A3B8' }}>{s.l}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-3 rounded-2xl p-5" style={{ background: '#FFF', border: '1px solid #F1F5F9' }}>
                    <h3 className="text-[10px] font-extrabold tracking-widest mb-4" style={{ color: '#94A3B8' }}>INFORMATION</h3>
                    <InfoGrid profile={profile} wide />
                </motion.div>
            </div>

            {/* Timeline */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                className="rounded-2xl p-5 lg:p-6 mt-4" style={{ background: '#FFF', border: '1px solid #F1F5F9' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-extrabold tracking-widest" style={{ color: '#94A3B8' }}>ACTIVITY</h3>
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-lg" style={{ background: '#F1F5F9', color: '#64748B' }}>{evolutions.length} events</span>
                </div>
                <Timeline items={evolutions.slice(0, 12)} columns />
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: Info Grid
   ═══════════════════════════════════════════════════════════════════════════════ */
function InfoGrid({ profile, wide }) {
    const items = [
        { icon: Mail, label: 'Email', value: profile.email },
        { icon: AtSign, label: 'Username', value: `@${profile.username}` },
        { icon: Phone, label: 'Phone', value: profile.phone || '—' },
        { icon: Hash, label: 'Student ID', value: profile.studentId || '—' },
        { icon: BookOpen, label: 'Department', value: profile.department || '—' },
        { icon: Calendar, label: 'Joined', value: new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
    ];

    return (
        <div className={`grid ${wide ? 'sm:grid-cols-2' : 'grid-cols-2'} gap-3`}>
            {items.map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                    <div className={`w-${wide ? '9' : '7'} h-${wide ? '9' : '7'} rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: '#F1F5F9' }}>
                        <item.icon className={`w-${wide ? '4' : '3'} h-${wide ? '4' : '3'}`} style={{ color: '#6366F1' }} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[7px] font-bold tracking-widest uppercase" style={{ color: '#CBD5E1' }}>{item.label}</p>
                        <p className={`text-${wide ? '[11px]' : '[10px]'} font-semibold truncate`} style={{ color: '#334155' }}>{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED: Timeline
   ═══════════════════════════════════════════════════════════════════════════════ */
function Timeline({ items, columns }) {
    if (!items.length) {
        return <p className="py-6 text-center text-[10px] font-medium" style={{ color: '#94A3B8' }}>No activity yet</p>;
    }

    const render = (list) => list.map((e, i) => {
        const isLast = i === list.length - 1;
        return (
            <motion.div key={e._id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.02 * i }}
                className={`flex gap-2.5 relative ${!isLast ? 'pb-3' : 'pb-0'}`}>
                <div className="flex flex-col items-center flex-shrink-0 w-4">
                    <div className="w-2 h-2 rounded-full mt-[4px] flex-shrink-0" style={{
                        background: e.points >= 0 ? '#10B981' : '#EF4444',
                        boxShadow: `0 0 0 2.5px ${e.points >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}`,
                    }} />
                    <div className="w-[1.5px] flex-1 my-0.5" style={{ background: '#F1F5F9' }} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                            <p className="text-[10px] font-bold truncate" style={{ color: '#334155' }}>{e.grantorId?.name || 'System'}</p>
                            <span className="text-[7px]" style={{ color: '#CBD5E1' }}>·</span>
                            <span className="text-[7px] font-medium" style={{ color: '#94A3B8' }}>{relativeTime(e.createdAt)}</span>
                        </div>
                        <span className="text-[10px] font-extrabold flex-shrink-0" style={{ color: e.points >= 0 ? '#10B981' : '#EF4444' }}>
                            {e.points >= 0 ? '+' : ''}{e.points}
                        </span>
                    </div>
                    {e.reason && <p className="text-[9px] font-medium mt-0.5 truncate" style={{ color: '#94A3B8' }}>{e.reason}</p>}
                </div>
            </motion.div>
        );
    });

    if (columns) {
        return (
            <div className="grid sm:grid-cols-2 gap-x-6">
                {render(items)}
            </div>
        );
    }
    return <div className="space-y-0">{render(items)}</div>;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EDIT MODAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function EditModal({ form, setForm, saving, onSave, onClose }) {
    const fields = [
        { key: 'name', label: 'Full Name', placeholder: 'Your name', icon: User },
        { key: 'email', label: 'Email', placeholder: 'email@example.com', icon: Mail, type: 'email' },
        { key: 'phone', label: 'Phone', placeholder: '+880...', icon: Phone },
        { key: 'studentId', label: 'Student ID', placeholder: 'e.g. 22-XX-XXXX', icon: Hash },
        { key: 'department', label: 'Department', placeholder: 'e.g. CSE', icon: BookOpen },
        { key: 'yearSemester', label: 'Year / Semester', placeholder: 'e.g. 4th Year, 2nd Sem', icon: BookOpen },
        { key: 'labGroup', label: 'Lab Group', placeholder: 'e.g. A1', icon: Users },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="w-full sm:max-w-md sm:rounded-[24px] rounded-t-[24px] shadow-2xl max-h-[88vh] overflow-y-auto relative"
                style={{ background: '#FFF' }}>

                {/* Top accent */}
                <div className="h-1 rounded-t-[24px]" style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />

                <div className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-sm font-extrabold" style={{ color: '#1E293B' }}>Edit Profile</h2>
                            <p className="text-[9px] font-bold tracking-wider uppercase mt-0.5" style={{ color: '#94A3B8' }}>Update your information</p>
                        </div>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all"
                            style={{ color: '#94A3B8' }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Fields */}
                    <div className="space-y-3">
                        {fields.map(f => (
                            <div key={f.key}>
                                <label className="text-[8px] font-bold tracking-widest uppercase mb-1 block" style={{ color: '#CBD5E1' }}>{f.label}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                                        <f.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <input
                                        type={f.type || 'text'}
                                        value={form[f.key] || ''}
                                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        placeholder={f.placeholder}
                                        className="w-full rounded-xl py-2.5 pl-9 pr-3 text-[11px] font-medium outline-none transition-all focus:ring-2"
                                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', '--tw-ring-color': 'rgba(99,102,241,0.2)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Read-only notice */}
                    <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: '#FEF3C7' }}>
                        <p className="text-[9px] font-bold" style={{ color: '#92400E' }}>
                            Team and Position cannot be edited. Contact superadmin to change them.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-5">
                        <button onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all active:scale-[0.97]"
                            style={{ background: '#F1F5F9', color: '#64748B' }}>
                            Cancel
                        </button>
                        <button onClick={onSave} disabled={saving}
                            className="flex-1 py-2.5 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
