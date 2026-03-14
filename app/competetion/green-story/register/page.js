"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FileVideo, Users, ArrowLeft, Loader2, CreditCard, Smartphone, GraduationCap, Star, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function GreenStoryRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        teamName: '',
        caReference: '',
        email: '',
        phone: '',
        videoLink: '',
        bkashTxId: '',
        paymentMethod: 'bkash',
        agreeToTerms: false
    });

    const [members, setMembers] = useState([
        { name: '', email: '', phone: '', universityName: '' },
        { name: '', email: '', phone: '', universityName: '' },
    ]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMemberChange = (index, field, value) => {
        setMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    };

    const addMember = () => {
        if (members.length >= 3) {
            toast.error('Maximum 3 members allowed');
            return;
        }
        setMembers(prev => [...prev, { name: '', email: '', phone: '', universityName: '' }]);
    };

    const removeMember = (index) => {
        if (members.length <= 1) {
            toast.error('Minimum 1 member required');
            return;
        }
        setMembers(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        if (!form.teamName.trim()) {
            toast.error('Team name is required');
            return false;
        }
        if (!form.email.trim() || !form.phone.trim()) {
            toast.error('Please fill team leader contact details');
            return false;
        }
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name.trim()) {
                toast.error(`Member ${i + 1}: Name is required`);
                return false;
            }
            if (!members[i].universityName.trim()) {
                toast.error(`Member ${i + 1}: University name is required`);
                return false;
            }
            if (!members[i].email.trim()) {
                toast.error(`Member ${i + 1}: Email is required`);
                return false;
            }
            if (!members[i].phone.trim()) {
                toast.error(`Member ${i + 1}: Phone is required`);
                return false;
            }
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

    const isRegistrationOpen = true;

    if (!isRegistrationOpen) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <FileVideo className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1B4B43] mb-4">Registration Closed</h1>
                    <p className="text-gray-600 mb-8">
                        The registration period for <strong>Green Story</strong> has ended. We are no longer accepting new submissions.
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
        const toastId = toast.loading('Submitting registration...');
        try {
            const payload = {
                type: 'green-story',
                teamName: form.teamName.trim(),
                caReference: form.caReference.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                videoLink: form.videoLink.trim(),
                bkashTxId: form.bkashTxId.trim(),
                paymentMethod: form.paymentMethod,
                members: members.map(m => ({
                    name: m.name.trim(),
                    email: m.email.trim().toLowerCase(),
                    phone: m.phone.trim(),
                    universityName: m.universityName.trim(),
                })),
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
                    <h1 className="text-lg font-bold text-[#1B4B43]">Green Story — Team Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B4B43] text-[#F3F9F1] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#F3F9F1]/10 rounded-full blur-3xl"></div>
                <div className="w-64 h-64 absolute -bottom-20 -right-20 border-[8px] border-[#F3F9F1]/10 rounded-full"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <FileVideo className="w-12 h-12 mx-auto mb-4 text-[#D9F2D6]" />
                    <h2 className="text-3xl font-bold mb-2">Register Your Team</h2>
                    <p className="text-[#D9F2D6] text-sm opacity-90">Registration fee: 700 TK per team • 1-3 Members • 180-240s Video</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Team Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><Users className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Team Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Name</label>
                            <input name="teamName" value={form.teamName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="Your Team Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                Campus Ambassador Reference <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                            </label>
                            <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Name of the Campus Ambassador who referred you" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Leader Email</label>
                                <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="leader@domain.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Leader Phone</label>
                                <input name="phone" value={form.phone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="01XXXXXXXXX" />
                            </div>
                        </div>
                    </div>

                    {members.length < 3 && (
                        <button
                            type="button"
                            onClick={addMember}
                            className="w-full py-4 border-2 border-dashed border-[#1B4B43]/20 rounded-2xl flex items-center justify-center gap-2 text-[#1B4B43] font-bold hover:border-[#1B4B43] hover:bg-[#F3F9F1] transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" /> Add Team Member
                        </button>
                    )}

                    <hr className="border-gray-100" />

                    {/* Team Members */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><GraduationCap className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Team Members</h3>
                        </div>
                        <p className="text-xs text-gray-500 -mt-2 ml-1 font-medium">Each member must provide their university name for cross-platform participation.</p>

                        {members.map((member, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3 relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-black text-[#1B4B43] uppercase tracking-wider">Member {i + 1}</span>
                                    {members.length > 1 && (
                                        <button type="button" onClick={() => removeMember(i)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <input value={member.name} onChange={(e) => handleMemberChange(i, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all text-sm" placeholder="Full Name" />
                                    </div>
                                    <div className="col-span-2">
                                        <input value={member.universityName} onChange={(e) => handleMemberChange(i, 'universityName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all text-sm" placeholder="University Name (e.g. AUST, BUET, DU...)" />
                                    </div>
                                    <div>
                                        <input value={member.email} onChange={(e) => handleMemberChange(i, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all text-sm" placeholder="Email" />
                                    </div>
                                    <div>
                                        <input value={member.phone} onChange={(e) => handleMemberChange(i, 'phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all text-sm" placeholder="Phone" />
                                    </div>
                                </div>
                            </div>
                        ))}
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><CreditCard className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Payment — 700 TK</h3>
                        </div>

                        <div className="bg-[#F3F9F1] rounded-2xl p-5 border border-[#D9F2D6]">
                            <p className="text-sm text-[#1B4B43] font-semibold mb-3">Send 700 TK to the following number:</p>
                            <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">bKash / Nagad</p>
                                    <p className="text-xl font-bold text-[#1B4B43] tracking-wide">01853259598</p>
                                </div>
                                <Smartphone className="w-8 h-8 text-[#1B4B43]/50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Payment Method</label>
                            <div className="flex gap-3">
                                {['bkash', 'nagad'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, paymentMethod: method }))}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${form.paymentMethod === method ? 'border-[#1B4B43] bg-[#F3F9F1] text-[#1B4B43]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                    >
                                        {method.charAt(0).toUpperCase() + method.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Transaction ID</label>
                            <input name="bkashTxId" value={form.bkashTxId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all font-mono uppercase" placeholder="e.g. TRX123456789" />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Submit */}
                    <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg hover:bg-gray-50 mb-6 transition-colors">
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">I confirm the video is our original work and we agree to the competition rules.</span>
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
