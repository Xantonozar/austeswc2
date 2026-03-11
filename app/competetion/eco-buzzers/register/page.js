"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Zap, Users, ArrowLeft, Loader2, CreditCard, Smartphone, Plus, Trash2, GraduationCap, Star } from 'lucide-react';
import Link from 'next/link';

export default function EcoBuzzersRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        teamName: '',
        universityName: '',
        caReference: '',
        bkashTxId: '',
        agreeToTerms: false
    });

    const [members, setMembers] = useState([{ name: '', email: '', phone: '' }]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        if (members.length < 3) {
            setMembers([...members, { name: '', email: '', phone: '' }]);
        }
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const newMembers = [...members];
            newMembers.splice(index, 1);
            setMembers(newMembers);
        }
    };

    const validate = () => {
        if (!form.teamName.trim()) {
            toast.error('Please fill team details');
            return false;
        }
        if (!form.universityName.trim()) {
            toast.error('University Name is required');
            return false;
        }
        if (!form.bkashTxId.trim()) {
            toast.error('Transaction ID is required');
            return false;
        }
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name.trim() || !members[i].email.trim() || !members[i].phone.trim()) {
                toast.error(`Please complete details for Member ${i + 1}`);
                return false;
            }
        }
        if (!form.agreeToTerms) {
            toast.error('You must agree to the rules');
            return false;
        }
        return true;
    };

    const isRegistrationOpen = true; // Registration is closed

    if (!isRegistrationOpen) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Zap className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1B4B43] mb-4">Registration Closed</h1>
                    <p className="text-gray-600 mb-8">
                        The registration period for <strong>Eco Buzzers</strong> has ended. We are no longer accepting new team registrations.
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
        const toastId = toast.loading('Registering Team...');
        try {
            const payload = {
                type: 'eco-buzzers',
                teamName: form.teamName.trim(),
                universityName: form.universityName.trim(),
                caReference: form.caReference.trim(),
                email: members[0].email.trim().toLowerCase(),
                phone: members[0].phone.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
                members: members.map(m => ({
                    name: m.name.trim(),
                    email: m.email.trim().toLowerCase(),
                    phone: m.phone.trim()
                }))
            };
            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');
            toast.success('Team Registered!', { id: toastId });
            setTimeout(() => router.push('/congratulations/eco-buzzers'), 1500);
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
                    <Link href="/competetion/eco-buzzers" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Team Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B4B43] text-[#E8F9FF] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#E8F9FF]/10 rounded-full blur-3xl"></div>
                <div className="w-64 h-64 absolute -bottom-20 -right-20 border-[8px] border-[#E8F9FF]/10 rounded-full"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-[#B7E9FF]" />
                    <h2 className="text-3xl font-bold mb-2">Register for Eco Buzzers</h2>
                    <p className="text-[#B7E9FF] text-sm opacity-90">Form your team (1-3 members) and secure your spot.</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Team Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#E8F9FF] rounded-lg"><Users className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Team Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Name</label>
                            <input name="teamName" value={form.teamName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Planet Saviors" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                University Name
                            </label>
                            <input name="universityName" value={form.universityName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Ahsanullah University of Science and Technology" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                Campus Ambassador Reference <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                            </label>
                            <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Name of the Campus Ambassador who referred you" />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Members Segment */}
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <h3 className="font-bold text-[#1B4B43] text-lg shrink-0">Team Members</h3>
                        </div>

                        {members.map((member, idx) => (
                            <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 relative group hover:border-[#B7E9FF] transition-colors">
                                {members.length > 1 && (
                                    <button type="button" onClick={() => removeMember(idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <h4 className="text-xs font-bold text-[#1B4B43]/60 uppercase tracking-wider mb-3">Member {idx + 1} {idx === 0 && '(Leader)'}</h4>
                                <div className="space-y-3">
                                    <input value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all" placeholder="Full Name" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all" placeholder="Email Address" />
                                        <input value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all" placeholder="Phone Number" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {members.length < 3 && (
                            <button
                                type="button"
                                onClick={addMember}
                                className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-[#1B4B43] font-bold hover:border-[#1B4B43] hover:bg-[#E8F9FF]/20 transition-all active:scale-[0.98]"
                            >
                                <Plus className="w-5 h-5" /> Add Another Team Member
                            </button>
                        )}
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
                            <span className="text-sm text-gray-600 font-medium">We agree to the competition rules and confirm the payment details are accurate.</span>
                        </label>

                        <button type="submit" disabled={loading} className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#B7E9FF] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Registration'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
