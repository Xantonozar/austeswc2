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
        <aside className="w-[270px] bg-[#1E3A28] text-[#F7F3EE] h-screen fixed left-0 top-0 flex flex-col shrink-0 font-jakarta border-r border-[#2E5940]/50 shadow-2xl z-50">

            {/* Brand Header */}
            <div className="p-6 border-b border-[#2E5940]">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-[#4A7C59]/20 p-2 rounded-xl border border-[#4A7C59]/30 group-hover:bg-[#4A7C59]/40 transition-colors">
                        <Leaf className="w-6 h-6 text-[#6BA583]" />
                    </div>
                    <div>
                        <h1 className="font-yeseva text-xl tracking-wide text-white">EcoClub</h1>
                        <p className="text-xs text-[#7A9080] font-medium tracking-wider uppercase mt-0.5">Environmental Club</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-[#4A7C59]/20 text-white font-semibold backdrop-blur-sm border border-[#4A7C59]/30 shadow-inner'
                                : 'text-[#C8DDD0] hover:bg-[#2E5940]/50 hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-[#6BA583]' : 'text-[#7A9080]'}`} />
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info + Logout */}
            {currentUser && (
                <div className="p-4 border-t border-[#2E5940] bg-[#1A2B1E]/50">
                    <div className="bg-[#1E3A28] border border-[#2E5940] rounded-xl p-4 shadow-inner">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar name={currentUser.name} rankLevel={currentUser.rankLevel} imageUrl={currentUser.imageUrl} className="w-10 h-10 text-sm shadow-md" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-[#7A9080] font-medium">{currentUser.designation}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-[#7A9080]">
                                {currentUser.department ? (
                                    <DeptBadge department={currentUser.department} />
                                ) : (
                                    <span className="text-[#6BA583] font-medium">Global Scope</span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-xs font-bold text-red-400/80 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
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
