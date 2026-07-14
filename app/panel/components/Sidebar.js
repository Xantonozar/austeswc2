"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, BarChart3, Trophy, Leaf, LogOut, LayoutGrid, GraduationCap } from 'lucide-react';
import { useDashboard } from './PanelDashboardProvider';
import Avatar from './Avatar';
import DeptBadge from './DeptBadge';

const navItems = [
    { href: '/panel', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/panel/members', label: 'Panel Members', icon: Users },
    { href: '/panel/all-panel', label: 'All Panel', icon: LayoutGrid },
    { href: '/panel/alumni', label: 'Alumni', icon: GraduationCap },
    { href: '/panel/evaluation', label: 'Evaluation', icon: BarChart3 },
    { href: '/panel/rankings', label: 'Rankings', icon: Trophy },
    { href: '/panel/general-members', label: 'General Members', icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, logout } = useDashboard();

    const handleLogout = async () => {
        await logout();
        router.push('/panel/login');
    };

    return (
        <aside className="w-[270px] bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white h-screen fixed left-0 top-0 flex flex-col shrink-0 font-jakarta border-r border-blue-900/50 shadow-2xl z-50">

            {/* Brand Header */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-400/20 group-hover:bg-blue-500/30 transition-colors">
                        <Leaf className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-wide text-white">EcoClub</h1>
                        <p className="text-xs text-blue-300/60 font-medium tracking-wider uppercase mt-0.5">Panel Management</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-200' : 'text-slate-500'}`} />
                            <span className="tracking-wide text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info + Logout */}
            {currentUser && (
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar name={currentUser.name} rankLevel={currentUser.rankLevel} imageUrl={currentUser.imageUrl} className="w-10 h-10 text-sm shadow-md" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-blue-300/60 font-medium">{currentUser.designation}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">
                                {currentUser.department ? (
                                    <DeptBadge department={currentUser.department} />
                                ) : (
                                    <span className="text-blue-400 font-medium">Global Scope</span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
