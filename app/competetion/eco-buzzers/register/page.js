"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, ArrowLeft, Loader2, CreditCard, Smartphone, Plus, Trash2, GraduationCap, Star, Check } from 'lucide-react';
import Link from 'next/link';

export default function EcoBuzzersRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        teamName: '',
        caReference: '',
        bkashTxId: '',
        paymentMethod: 'bkash',
        agreeToTerms: false
    });

    const [members, setMembers] = useState([{ name: '', email: '', phone: '', universityName: '' }]);

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
        if (members.length < 2) {
            setMembers([...members, { name: '', email: '', phone: '', universityName: '' }]);
        } else {
            toast.error('Maximum 2 members allowed');
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
        for (let i = 0; i < members.length; i++) {
            if (!members[i].name.trim() || !members[i].email.trim() || !members[i].phone.trim() || !members[i].universityName.trim()) {
                toast.error(`Please complete details for Member ${i + 1}`);
                return false;
            }
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
                caReference: form.caReference.trim(),
                email: members[0].email.trim().toLowerCase(),
                phone: members[0].phone.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
                paymentMethod: form.paymentMethod,
                members: members.map(m => ({
                    name: m.name.trim(),
                    email: m.email.trim().toLowerCase(),
                    phone: m.phone.trim(),
                    universityName: m.universityName.trim()
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

            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/competetion/eco-buzzers" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Team Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Banner */}
            <div className="bg-[#1B4B43] text-[#E8F9FF] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#E8F9FF]/10 rounded-full blur-3xl"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-[#B7E9FF]" />
                    <h2 className="text-3xl font-bold mb-2">Register for Green Buzzer Battle</h2>
                    <p className="text-[#B7E9FF] text-sm opacity-90">Form your team (1-2 members) and provide university details.</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Team Info Section */}
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
                                <Star className="w-4 h-4 text-amber-500" /> Campus Ambassador Reference
                            </label>
                            <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="Optional" />
                        </div>
                    </div>

                    {members.length < 2 && (
                        <button
                            type="button"
                            onClick={addMember}
                            className="w-full py-4 border-2 border-dashed border-[#1B4B43]/20 rounded-2xl flex items-center justify-center gap-2 text-[#1B4B43] font-bold hover:border-[#1B4B43] hover:bg-[#E8F9FF]/20 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" /> Add Team Member
                        </button>
                    )}

                    <hr className="border-gray-100" />

                    {/* Members Section */}
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <h3 className="font-bold text-[#1B4B43] text-lg shrink-0">Team Members</h3>
                        </div>
                        {members.map((member, idx) => (
                            <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 relative group hover:border-[#B7E9FF] transition-colors shadow-sm">
                                {members.length > 1 && (
                                    <button type="button" onClick={() => removeMember(idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <h4 className="text-xs font-bold text-[#1B4B43]/60 uppercase tracking-wider mb-3">Member {idx + 1} {idx === 0 && '(Leader)'}</h4>
                                <div className="space-y-3">
                                    <input value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all shadow-sm" placeholder="Full Name" />
                                    <input value={member.universityName} onChange={(e) => handleMemberChange(idx, 'universityName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all shadow-sm" placeholder="University Name" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all shadow-sm" placeholder="Email Address" />
                                        <input value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm transition-all shadow-sm" placeholder="Phone Number" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Payment Section */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Registration Fee</h3>
                        </div>

                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                            {['bkash', 'nagad'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: method }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold capitalize transition-all ${
                                        form.paymentMethod === method 
                                        ? 'bg-white text-[#1B4B43] shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {form.paymentMethod === method && <Check className="w-4 h-4" />}
                                    {method}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={form.paymentMethod}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className={`border rounded-2xl p-5 flex items-start gap-4 transition-colors ${
                                    form.paymentMethod === 'bkash' ? 'bg-pink-50/50 border-pink-100' : 'bg-orange-50/50 border-orange-100'
                                }`}
                            >
                                <Smartphone className={`w-6 h-6 shrink-0 mt-1 ${
                                    form.paymentMethod === 'bkash' ? 'text-pink-600' : 'text-orange-600'
                                }`} />
                                <div>
                                    <p className={`font-bold mb-1 text-base ${
                                        form.paymentMethod === 'bkash' ? 'text-pink-900' : 'text-orange-900'
                                    }`}>
                                        Send Money ({form.paymentMethod})
                                    </p>
                                    <p className="text-gray-700 font-medium mb-1">Number: <span className="font-bold select-all">01853259598</span></p>
                                    <p className="text-gray-700 font-medium">Total: <span className="font-bold text-xl text-[#1B4B43]">1000 BDT</span></p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1.5 ml-1 capitalize">
                                {form.paymentMethod} Transaction ID
                            </label>
                            <input 
                                name="bkashTxId" 
                                value={form.bkashTxId} 
                                onChange={handleFormChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none font-mono uppercase transition-all shadow-sm" 
                                placeholder="TRX123456" 
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Submit Section */}
                    <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg hover:bg-gray-50 mb-6 transition-colors font-medium text-gray-600">
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm">We agree to the competition rules and confirm the payment details are accurate.</span>
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
