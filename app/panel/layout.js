"use client";

import { Plus_Jakarta_Sans } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { DashboardProvider, useDashboard } from './components/PanelDashboardProvider';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import { Toaster } from 'react-hot-toast';

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta'
});

function DashboardShell({ children }) {
    const { isLoggedIn } = useDashboard();
    const pathname = usePathname();
    const isLoginPage = pathname === '/panel/login';

    if (isLoginPage || !isLoggedIn) {
        return (
            <div className={`fixed inset-0 z-[100] bg-slate-50 overflow-hidden ${jakarta.variable} font-jakarta`}>
                {children}
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 z-[100] bg-slate-50 flex overflow-hidden ${jakarta.variable} font-jakarta`}>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main Content - Full Width */}
            <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <div className="lg:hidden">
                <MobileNav />
            </div>
        </div>
    );
}

export default function PanelDashboardLayout({ children }) {
    return (
        <DashboardProvider>
            <DashboardShell>
                {children}
            </DashboardShell>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#0f172a',
                        color: '#fff',
                        borderRadius: '16px',
                        fontFamily: 'var(--font-jakarta)',
                        fontSize: '14px',
                        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.3)',
                    },
                    success: {
                        iconTheme: { primary: '#3b82f6', secondary: '#0f172a' },
                    },
                }}
            />
        </DashboardProvider>
    );
}
