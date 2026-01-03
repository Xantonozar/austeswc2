'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Leaf, KeyRound, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            toast.error('Please enter both username and password');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Login successful!');
                setTimeout(() => router.push('/admin/dashboard'), 500);
            } else {
                toast.error(data.error || 'Invalid credentials');
                setLoading(false);
            }
        } catch (error) {
            toast.error('Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center p-4">
            <Toaster position="top-center" />

            {/* Decorative background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
                <Leaf className="absolute top-20 left-10 w-32 h-32 text-white rotate-45 animate-pulse" />
                <Leaf className="absolute bottom-20 right-10 w-40 h-40 text-white -rotate-12 animate-bounce" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/40">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-emerald-900 mb-2">Admin Portal</h1>
                        <p className="text-slate-600">ESWC Member Dashboard</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-emerald-900 ml-1">Username</label>
                            <div className="relative group">
                                <User className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
                                    placeholder="Enter username"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-emerald-900 ml-1">Password</label>
                            <div className="relative group">
                                <KeyRound className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
                                    placeholder="Enter password"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-slate-500">
                        <p>© 2025 AUST Environmental & Social Welfare Club</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
