"use client";

import { Plus_Jakarta_Sans } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { DashboardProvider, useDashboard } from './components/PanelDashboardProvider';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta'
});

function DashboardShell({ children }) {
    const { isLoggedIn } = useDashboard();
    const pathname = usePathname();
    const isLoginPage = pathname === '/panel/login';

    // If on login page or not logged in, show content without sidebar shell
    if (isLoginPage || !isLoggedIn) {
        return (
            <div className={`fixed inset-0 z-[100] bg-[#F7F3EE] overflow-hidden ${jakarta.variable} font-jakarta`}>
                {children}
            </div>
        );
    }

    // Authenticated: show full dashboard with sidebar
    return (
        <div className={`fixed inset-0 z-[100] bg-[#F7F3EE] flex overflow-hidden ${jakarta.variable} font-jakarta`}>
            <Sidebar />
            <main className="flex-1 ml-[270px] h-screen overflow-y-auto bg-[#F7F3EE] text-[#1A2B1E] relative scroll-smooth selection:bg-[#4A7C59]/30">
                <div className="max-w-[1400px] mx-auto min-h-full">
                    {children}
                </div>
            </main>
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
                        background: '#1E3A28',
                        color: '#fff',
                        borderRadius: '12px',
                        fontFamily: 'var(--font-jakarta)',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#6BA583',
                            secondary: '#1E3A28',
                        },
                    },
                }}
            />
        </DashboardProvider>
    );
}
