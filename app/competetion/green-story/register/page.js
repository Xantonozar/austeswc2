"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FileVideo, User, ArrowLeft, Loader2, CreditCard, Smartphone, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function GreenStoryRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        universityName: '',
        email: '',
        phone: '',
        videoLink: '',
        bkashTxId: '',
        agreeToTerms: false
    });

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const validate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            toast.error('Please fill all personal details');
            return false;
        }
        if (!form.universityName.trim()) {
            toast.error('University Name is required');
            return false;
        }
        if (!form.videoLink.trim() || !form.videoLink.includes('drive.google.com')) {
            toast.error('Please provide a valid Google Drive link');
            return false;
        }
        if (!form.bkashTxId.trim()) {
            toast.error('Transaction ID is required');
            return false;
        }
        if (!form.agreeToTerms) {
            toast.error('You must agree to the rules');
            return false;
        }
        return true;
    };

    const isRegistrationOpen = false; // Registration is closed

    if (!isRegistrationOpen) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <FileVideo className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1B4B43] mb-4">Registration Closed</h1>
                    <p className="text-gray-600 mb-8">
                        The registration period for <strong>Green Story</strong> has ended. We are no longer accepting new video submissions.
                    </p>
                    <Link href="/competetion">
                        <button className="w-full bg-[#1B4B43] text-white font-bold py-3.5 rounded-xl hover:bg-[#133630] transition-colors">
                            Return to Competitions
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!validate()) return;
        setLoading(true);
        const toastId = toast.loading('Submitting application...');
        try {
            const payload = {
                type: 'green-story',
                name: form.name.trim(),
                universityName: form.universityName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                videoLink: form.videoLink.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
            };
            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');
            toast.success('Registration Complete!', { id: toastId });
            setTimeout(() => router.push('/congratulations/green-story'), 1500);
        } catch (err) {
            toast.error(err.message || 'Something went wrong', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans">
            <Toaster position="top-center" />

            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/competetion/green-story" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Green Story Submission</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B4B43] text-[#F3F9F1] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#F3F9F1]/10 rounded-full blur-3xl"></div>
                <div className="w-64 h-64 absolute -bottom-20 -right-20 border-[8px] border-[#F3F9F1]/10 rounded-full"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <FileVideo className="w-12 h-12 mx-auto mb-4 text-[#D9F2D6]" />
                    <h2 className="text-3xl font-bold mb-2">Submit Your Ad Video</h2>
                    <p className="text-[#D9F2D6] text-sm opacity-90">Ensure your Google Drive link has "Anyone with the link" view access.</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><User className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Personal Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                            <input name="name" value={form.name} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                University Name
                            </label>
                            <input name="universityName" value={form.universityName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Ahsanullah University of Science and Technology" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                                <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="you@domain.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Phone</label>
                                <input name="phone" value={form.phone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="01XXXXXXXXX" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Submission */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                            <FileVideo className="w-4 h-4 text-[#1B4B43]/70" /> Google Drive Video Link
                        </label>
                        <input name="videoLink" value={form.videoLink} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none text-[#1B4B43] transition-all" placeholder="https://drive.google.com/..." />
                        <p className="text-xs text-gray-500 ml-1 font-medium">Remember to set access to 'Anyone with the link can view'.</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Payment */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Registration Fee</h3>
                        </div>

                        <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 flex items-start gap-4">
                            <Smartphone className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-yellow-900 border-b border-yellow-200/50 pb-2 mb-2">Send Money (bKash, Nagad)</p>
                                <p className="font-medium text-yellow-800">No: <span className="font-bold select-all">01853259598</span></p>
                                <p className="font-medium text-yellow-800">Total: <span className="font-bold text-xl ml-1">100 BDT</span></p>
                                <p className="text-xs text-yellow-700 mt-2 italic font-semibold">Requirement: Must put your Team name in the reference field during payment.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1.5 ml-1">Transaction ID (bKash/Nagad)</label>
                            <input name="bkashTxId" value={form.bkashTxId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none font-mono uppercase transition-all" placeholder="TRX123456" />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg hover:bg-gray-50 mb-6 transition-colors">
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">I confirm the video is my original work and I have provided the correct payment details.</span>
                        </label>

                        <button type="submit" disabled={loading} className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#D9F2D6] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Registration'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
