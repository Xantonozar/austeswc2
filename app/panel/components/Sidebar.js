"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, Trophy, Leaf, LogOut, LayoutGrid, GraduationCap, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useDashboard } from './PanelDashboardProvider';
import Avatar from './Avatar';

const navItems = [
    { href: '/panel', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/panel/members', label: 'Members', icon: Users },
    { href: '/panel/all-panel', label: 'All Panel', icon: LayoutGrid },
    { href: '/panel/alumni', label: 'Alumni', icon: GraduationCap },
    { href: '/panel/evaluation', label: 'Evaluation', icon: BarChart3 },
    { href: '/panel/rankings', label: 'Rankings', icon: Trophy },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, logout } = useDashboard();
    const [expanded, setExpanded] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/panel/login');
    };

    return (
        <aside
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            className={`${expanded ? 'w-[220px]' : 'w-[68px]'} h-screen fixed left-0 top-0 flex flex-col shrink-0 z-50 transition-all duration-300 ease-in-out`}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-r border-white/5"></div>
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">

                {/* Brand */}
                <div className={`h-16 flex items-center border-b border-white/5 ${expanded ? 'px-4 gap-3' : 'justify-center'}`}>
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    {expanded && <span className="font-bold text-white text-sm truncate">EcoClub</span>}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={!expanded ? item.label : undefined}
                                className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                                    expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-3'
                                } ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {isActive && !expanded && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full"></div>}
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'}`} />
                                {expanded && <span className="text-sm font-medium truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                {currentUser && (
                    <div className="p-2 border-t border-white/5">
                        <div className={`flex items-center rounded-xl p-2 ${expanded ? 'gap-3' : 'justify-center'}`}>
                            <Avatar name={currentUser.name} rankLevel={currentUser.rankLevel} imageUrl={currentUser.imageUrl} className="w-8 h-8 text-[10px] shrink-0" />
                            {expanded && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{currentUser.designation}</p>
                                </div>
                            )}
                            {expanded && (
                                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
