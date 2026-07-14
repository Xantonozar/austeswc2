"use client";

import { useState, useEffect } from 'react';
import { useDashboard } from '../components/PanelDashboardProvider';
import { useRouter } from 'next/navigation';
import { Leaf, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PanelLoginPage() {
    const { login, isLoggedIn } = useDashboard();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn) router.push('/panel');
    }, [isLoggedIn, router]);

    if (isLoggedIn) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(username, password);
        if (result.success) {
            router.push('/panel');
        } else {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-30%] left-[-15%] w-[500px] h-[500px] bg-indigo-500 opacity-15 rounded-full blur-[100px]"></div>
                <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-white opacity-[0.03] rounded-full blur-[60px]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMS0xOS44MTgsMS42MTgtMS4yNzZMMjUuNDE4IDExbC0xLjA0LTIuMjIyYS41LjUgMCAwMS40NDItLjY1OGwyLjQxNy4zNDYgMS4wNDEtMi4yMjNhLjUuNSAwIDAxLjkyNy4yMTRsLTEuMDQxIDIuMjIzIDIuNDE3LS4zNDZhLjUuNSAwIDAxLjQ0Mi42NThsLTEuMDQxIDIuMjIzTDM0LjM0NSA5LjgyMWEuNS41IDAgMDEtLjkyNy0uMjE0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-blue-500/20 backdrop-blur-md p-3 rounded-2xl border border-blue-400/20 shadow-lg">
                            <Leaf className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-wide mb-2">EcoClub</h1>
                    <p className="text-blue-300/60 text-sm font-medium tracking-widest uppercase">Panel Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 text-center">Sign in to your account</h2>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-400/30 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-sm text-red-300 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-blue-200/60 uppercase tracking-widest mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                placeholder="Enter your username"
                                required
                                autoFocus
                                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-blue-200/60 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer hint */}
                <p className="text-center text-blue-400/40 text-xs mt-6">
                    Use your assigned panel credentials to log in.
                </p>
            </div>
        </div>
    );
}
