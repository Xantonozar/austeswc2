"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BarChart3, Trophy, GraduationCap, LayoutGrid } from 'lucide-react';

const navItems = [
    { href: '/panel', label: 'Home', icon: LayoutDashboard },
    { href: '/panel/members', label: 'Members', icon: Users },
    { href: '/panel/all-panel', label: 'All Panel', icon: LayoutGrid },
    { href: '/panel/alumni', label: 'Alumni', icon: GraduationCap },
    { href: '/panel/evaluation', label: 'Eval', icon: BarChart3 },
    { href: '/panel/rankings', label: 'Ranks', icon: Trophy },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 safe-area-pb">
            <nav className="flex items-center justify-around px-2 py-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/panel');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all min-w-[56px] ${
                                isActive
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-slate-400 active:text-slate-600'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
