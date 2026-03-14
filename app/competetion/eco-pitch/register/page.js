"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mic2, Users, ArrowLeft, Loader2, Plus, Trash2, FileText, Upload, CheckCircle2, CreditCard, Smartphone, GraduationCap, Star } from 'lucide-react';
import Link from 'next/link';

export default function ThreePitchRegister() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        teamName: '',
        caReference: '',
        bkashTxId: '',
        pdfBase64: '',
        agreeToTerms: false,
        paymentMethod: 'bkash'
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
        if (members.length < 3) {
            setMembers([...members, { name: '', email: '', phone: '', universityName: '' }]);
        }
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const newMembers = [...members];
            newMembers.splice(index, 1);
            setMembers(newMembers);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Allow PDF and DOCX
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PDF or DOCX files are allowed');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            setForm(prev => ({ ...prev, pdfBase64: ev.target.result }));
            toast.success('Abstract attached successfully');
        };
        reader.onerror = () => toast.error('Failed to read file');
        reader.readAsDataURL(file);
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
        if (!form.pdfBase64) {
            toast.error('Please upload your abstract');
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
        const toastId = toast.loading('Submitting proposal...');
        try {
            const payload = {
                type: 'eco-pitch',
                teamName: form.teamName.trim(),
                caReference: form.caReference.trim(),
                email: members[0].email.trim().toLowerCase(),
                phone: members[0].phone.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
                paymentMethod: form.paymentMethod,
                pdfBase64: form.pdfBase64,
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
            toast.success('Proposal Submitted Successfully!', { id: toastId });
            setTimeout(() => router.push('/congratulations/eco-pitch'), 1500);
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
                    <Link href="/competetion/eco-pitch" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Abstract Submission</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B4B43] text-[#E8F9FF] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#E8F9FF]/10 rounded-full blur-3xl"></div>
                <div className="w-64 h-64 absolute -bottom-20 -right-20 border-[8px] border-[#E8F9FF]/10 rounded-full"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <Mic2 className="w-12 h-12 mx-auto mb-4 text-[#B7E9FF]" />
                    <h2 className="text-3xl font-bold mb-2">Register for Eco Pitch 180</h2>
                    <p className="text-[#B7E9FF] text-sm opacity-90">
                        Register your team (1-3 members) and ensure each member provides their university name.
                    </p>
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
                            <input name="teamName" value={form.teamName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Eco Innovators" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                Campus Ambassador Reference <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                            </label>
                            <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Name of the Campus Ambassador who referred you" />
                        </div>
                    </div>

                    {members.length < 3 && (
                        <button
                            type="button"
                            onClick={addMember}
                            className="w-full py-4 border-2 border-dashed border-[#1B4B43]/20 rounded-2xl flex items-center justify-center gap-2 text-[#1B4B43] font-bold hover:border-[#1B4B43] hover:bg-[#E8F9FF]/20 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" /> Add Team Member
                        </button>
                    )}

                    <hr className="border-gray-100" />

                    {/* Members Segment */}
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

                    {/* PDF Upload */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><FileText className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Upload Your Abstract</h3>
                        </div>

                        <div onClick={() => fileInputRef.current?.click()} className={`w-full py-8 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${form.pdfBase64 ? 'border-[#1B4B43] bg-[#E8F9FF]' : 'border-gray-300 hover:border-[#1B4B43] bg-white'}`}>
                            {form.pdfBase64 ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#1B4B43] flex items-center justify-center mb-3 text-white shadow-md">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <p className="font-bold text-[#1B4B43]">File Attached</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Ready for submission</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="font-medium text-gray-700">Tap to upload your abstract</p>
                                    <p className="text-xs text-gray-400 mt-1">Abstract in PDF/DOCX format (Max 10MB)</p>
                                </>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Payment */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Registration Fee (Round 1)</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'bkash' }))}
                                className={`py-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${form.paymentMethod === 'bkash' ? 'border-[#1B4B43] bg-[#E8F9FF] text-[#1B4B43]' : 'border-gray-200 bg-white text-gray-500 hover:border-[#1B4B43]/30'}`}
                            >
                                <span className="text-xl">bKash</span>
                                <span className="text-[10px] uppercase tracking-wider opacity-60">Send Money</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'nagad' }))}
                                className={`py-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${form.paymentMethod === 'nagad' ? 'border-[#1B4B43] bg-[#E8F9FF] text-[#1B4B43]' : 'border-gray-200 bg-white text-gray-500 hover:border-[#1B4B43]/30'}`}
                            >
                                <span className="text-xl">Nagad</span>
                                <span className="text-[10px] uppercase tracking-wider opacity-60">Send Money</span>
                            </button>
                        </div>

                        <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 flex items-start gap-4">
                            <Smartphone className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-yellow-900 border-b border-yellow-200/50 pb-2 mb-2">Send Money ({form.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'})</p>
                                <p className="font-medium text-yellow-800">No: <span className="font-bold select-all">01853259598</span></p>
                                <p className="font-medium text-yellow-800">Total: <span className="font-bold text-xl ml-1">300 BDT</span></p>
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1.5 ml-1">Transaction ID ({form.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'})</label>
                            <input name="bkashTxId" value={form.bkashTxId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none font-mono uppercase transition-all" placeholder="TRX123456" />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Submit */}
                    <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg hover:bg-gray-50 mb-6 transition-colors">
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">We agree to the competition rules and confirm the payment details are accurate.</span>
                        </label>

                        <button type="submit" disabled={loading} className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#B7E9FF] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Abstract'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
