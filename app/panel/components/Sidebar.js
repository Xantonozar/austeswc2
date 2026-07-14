"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, Trophy, Leaf, LogOut, LayoutGrid, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from './PanelDashboardProvider';
import Avatar from './Avatar';

const navItems = [
    { href: '/panel', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/panel/members', label: 'Members', icon: Users },
    { href: '/panel/all-panel', label: 'All Panel', icon: LayoutGrid },
    { href: '/panel/alumni', label: 'Alumni', icon: GraduationCap },
    { href: '/panel/evaluation', label: 'Evaluation', icon: BarChart3 },
    { href: '/panel/rankings', label: 'Rankings', icon: Trophy },
    { href: '/panel/general-members', label: 'General', icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, logout } = useDashboard();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/panel/login');
    };

    return (
        <aside className={`${collapsed ? 'w-[72px]' : 'w-[260px]'} h-screen fixed left-0 top-0 flex flex-col shrink-0 z-50 transition-all duration-300 ease-in-out`}>

            {/* Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-indigo-950/95 backdrop-blur-xl border-r border-white/10"></div>

            {/* Decorative gradient orb */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">

                {/* Brand Header */}
                <div className={`p-4 border-b border-white/10 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 shrink-0">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="font-bold text-lg text-white tracking-tight">EcoClub</h1>
                            <p className="text-[10px] text-blue-300/50 font-medium tracking-widest uppercase">Panel</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={`flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${
                                    collapsed ? 'justify-center p-3' : 'px-3 py-2.5'
                                } ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>}
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="mx-3 mb-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* User Info + Logout */}
                {currentUser && (
                    <div className="p-3 border-t border-white/10">
                        <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 transition-all ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                            <div className={`${collapsed ? '' : 'flex items-center gap-3 mb-2'}`}>
                                <Avatar name={currentUser.name} rankLevel={currentUser.rankLevel} imageUrl={currentUser.imageUrl} className="w-9 h-9 text-xs shrink-0" />
                                {!collapsed && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                        <p className="text-[10px] text-blue-300/50 font-medium truncate">{currentUser.designation}</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`flex items-center gap-1.5 text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10 ${collapsed ? 'w-full justify-center' : ''}`}
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                {!collapsed && 'Logout'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
