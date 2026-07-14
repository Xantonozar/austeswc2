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
        <div className="min-h-screen bg-gradient-to-br from-[#1E3A28] via-[#2E5940] to-[#1A2B1E] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#6BA583] opacity-10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-30%] left-[-15%] w-[500px] h-[500px] bg-[#4A7C59] opacity-15 rounded-full blur-[100px]"></div>
                <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-white opacity-[0.03] rounded-full blur-[60px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
                            <Leaf className="w-8 h-8 text-[#6BA583]" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-yeseva text-white tracking-wide mb-2">EcoClub</h1>
                    <p className="text-[#C8DDD0] text-sm font-medium tracking-widest uppercase">Panel Management System</p>
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
                            <label className="block text-xs font-bold text-[#C8DDD0] uppercase tracking-widest mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                placeholder="Enter your username"
                                required
                                autoFocus
                                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6BA583] focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#C8DDD0] uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6BA583] focus:border-transparent transition-all text-sm"
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
                            className="w-full bg-[#4A7C59] hover:bg-[#3D6A4B] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#4A7C59]/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
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
                <p className="text-center text-[#7A9080] text-xs mt-6">
                    Use your assigned panel credentials to log in.
                </p>
            </div>
        </div>
    );
}
