"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, ArrowLeft, Loader2, CreditCard, Smartphone, Plus, Trash2, GraduationCap, Star, Check, CheckCircle2, Upload, Receipt, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

const DEPARTMENTS = ['CSE', 'EEE', 'CE', 'ME', 'IPE', 'TE', 'Architecture', 'BBA'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
const SEMESTERS = ['1st Semester', '2nd Semester'];

const emptyMember = () => ({ name: '', studentId: '', department: '', semester: '', email: '', phone: '' });

export default function BuzzerBattleRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [screenshotUploading, setScreenshotUploading] = useState(false);

    const [form, setForm] = useState({
        teamName: '',
        caReference: '',
        bkashTxId: '',
        paymentMethod: 'bkash',
        paymentSenderNumber: '',
        paymentScreenshotUrl: '',
        paymentScreenshotPublicId: '',
        agreeTeamVerification: false,
        agreeSingleEntry: false,
        agreeConduct: false,
        agreeRulebook: false
    });

    const [leader, setLeader] = useState({ ...emptyMember(), isLeader: true });
    const [members, setMembers] = useState([]);

    const screenshotInputRef = useRef(null);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleLeaderChange = (field, value) => {
        setLeader(prev => ({ ...prev, [field]: value }));
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        if (members.length < 2) {
            setMembers([...members, emptyMember()]);
        } else {
            toast.error('Maximum 3 members (1 leader + 2 optional) allowed');
        }
    };

    const removeMember = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const uploadToCloudinary = async (file, folder) => {
        const signRes = await fetch('/api/cloudinary/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder })
        });
        const signData = await signRes.json();
        if (!signRes.ok) throw new Error('Failed to secure upload signature');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp);
        formData.append('signature', signData.signature);
        formData.append('folder', signData.folder);
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Upload failed');
        return { url: uploadData.secure_url, publicId: uploadData.public_id };
    };

    const compress = async (file, maxSizeMB) => {
        try {
            return await imageCompression(file, {
                maxSizeMB,
                maxWidthOrHeight: 4096,
                useWebWorker: true,
                initialQuality: 0.85
            });
        } catch {
            return file;
        }
    };

    const handleScreenshotUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.error('Only JPEG/PNG allowed for screenshot');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Payment screenshot must be under 5MB');
            return;
        }
        const loadingToast = toast.loading('Uploading payment screenshot...');
        setScreenshotUploading(true);
        try {
            const compressed = await compress(file, 4.8);
            const r = await uploadToCloudinary(compressed, 'eswc_competition/buzzer_battle_payments');
            setForm(prev => ({ ...prev, paymentScreenshotUrl: r.url, paymentScreenshotPublicId: r.publicId }));
            toast.success('Screenshot uploaded', { id: loadingToast });
        } catch (err) {
            toast.error(err.message || 'Failed to upload screenshot', { id: loadingToast });
        } finally {
            setScreenshotUploading(false);
        }
    };

    const validate = () => {
        if (!form.teamName.trim()) { toast.error('Team Name is required'); return false; }
        if (!leader.name.trim()) { toast.error('Team Leader Full Name is required'); return false; }
        if (!leader.studentId.trim()) { toast.error('Team Leader Student ID is required'); return false; }
        if (!leader.department) { toast.error('Team Leader Department is required'); return false; }
        if (!leader.semester) { toast.error('Team Leader Semester/Year is required'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leader.email.trim().toLowerCase())) { toast.error('Team Leader valid email is required'); return false; }
        if (!leader.phone.trim()) { toast.error('Team Leader Contact Number is required'); return false; }

        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.name.trim()) { toast.error(`Please enter Full Name for Member ${i + 2}`); return false; }
            if (!m.studentId.trim()) { toast.error(`Please enter Student ID for Member ${i + 2}`); return false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim().toLowerCase())) { toast.error(`Please enter a valid email for Member ${i + 2}`); return false; }
            if (!m.department) { toast.error(`Please select Department for Member ${i + 2}`); return false; }
            if (!m.semester) { toast.error(`Please select Semester/Year for Member ${i + 2}`); return false; }
            if (!m.phone.trim()) { toast.error(`Please enter Contact Number for Member ${i + 2}`); return false; }
        }

        if (!form.bkashTxId.trim()) { toast.error('Transaction ID is required'); return false; }
        if (!form.paymentSenderNumber.trim()) { toast.error('Sender Mobile Number is required'); return false; }
        if (!form.paymentScreenshotUrl) { toast.error('Payment screenshot is required'); return false; }

        if (!form.agreeTeamVerification) { toast.error('Please confirm team verification'); return false; }
        if (!form.agreeSingleEntry) { toast.error('Please confirm single entry policy'); return false; }
        if (!form.agreeConduct) { toast.error('Please agree to the conduct policy'); return false; }
        if (!form.agreeRulebook) { toast.error('Please agree to the rulebook'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!validate()) return;
        setLoading(true);
        const toastId = toast.loading('Registering Team...');
        try {
            const allMembers = [
                {
                    name: leader.name.trim(),
                    studentId: leader.studentId.trim(),
                    department: leader.department,
                    semester: leader.semester,
                    email: leader.email.trim().toLowerCase(),
                    phone: leader.phone.trim(),
                    isLeader: true
                },
                ...members.map(m => ({
                    name: m.name.trim(),
                    studentId: m.studentId.trim(),
                    department: m.department,
                    semester: m.semester || '',
                    email: m.email.trim().toLowerCase() || '',
                    phone: m.phone.trim(),
                    isLeader: false
                }))
            ];

            const payload = {
                type: 'buzzer-battle',
                teamName: form.teamName.trim(),
                caReference: form.caReference.trim(),
                email: leader.email.trim().toLowerCase(),
                phone: leader.phone.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
                paymentMethod: form.paymentMethod,
                paymentSenderNumber: form.paymentSenderNumber.trim(),
                paymentScreenshot: form.paymentScreenshotUrl ? { url: form.paymentScreenshotUrl, publicId: form.paymentScreenshotPublicId } : undefined,
                members: allMembers,
                declarations: {
                    teamVerification: form.agreeTeamVerification,
                    singleEntry: form.agreeSingleEntry,
                    conduct: form.agreeConduct,
                    rulebook: form.agreeRulebook
                }
            };

            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');
            toast.success('Team Registered!', { id: toastId });
            setTimeout(() => router.push('/congratulations/buzzer-battle'), 1500);
        } catch (err) {
            toast.error(err.message || 'Something went wrong', { id: toastId });
            setLoading(false);
        }
    };

    const declarations = [
        { key: 'agreeTeamVerification', label: 'I confirm that both members are currently enrolled students of AUST.' },
        { key: 'agreeSingleEntry', label: 'I confirm that neither member is registered under any other team for Buzzer Battle.' },
        { key: 'agreeConduct', label: 'We agree to strictly adhere to the no-electronic-device rule and venue guidelines during the quiz.' },
        { key: 'agreeRulebook', label: 'We agree to abide by all the official rules set by AUSTESWC and accept that the Quizmaster’s decision is final.' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans">
            <Toaster position="top-center" />

            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/competetion/buzzer-battle" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#A855F7]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B1230]">Team Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B1230] text-violet-100 pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#A855F7]/20 rounded-full blur-3xl"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-[#D8B4FE]" />
                    <h2 className="text-3xl font-bold mb-2 text-white">Register for Buzzer Battle</h2>
                    <p className="text-violet-200/90 text-sm opacity-90">Form your team (1–3 members) and pay 499 BDT via bKash to enter the quiz showdown.</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Team Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-violet-50 rounded-lg"><Users className="w-5 h-5 text-[#A855F7]" /></div>
                            <h3 className="font-bold text-[#1B1230] text-lg">Team Details</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Name <span className="text-red-500">*</span></label>
                            <input name="teamName" value={form.teamName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A855F7] outline-none transition-all" placeholder="e.g. Planet Saviors" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" /> Reference
                            </label>
                            <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A855F7] outline-none transition-all" placeholder="Optional" />
                        </div>
                    </div>

                    {/* Team Leader */}
                    <hr className="border-gray-100" />
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-violet-50 rounded-lg"><GraduationCap className="w-5 h-5 text-[#A855F7]" /></div>
                            <h3 className="font-bold text-[#1B1230] text-lg">Team Leader <span className="text-red-500">*</span></h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input value={leader.name} onChange={(e) => handleLeaderChange('name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Full Name" />
                            <input value={leader.studentId} onChange={(e) => handleLeaderChange('studentId', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Student ID" />
                            <input type="email" value={leader.email} onChange={(e) => handleLeaderChange('email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Active Email Address" />
                            <input value={leader.phone} onChange={(e) => handleLeaderChange('phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Contact Number" />
                            <div className="relative">
                                <select value={leader.department} onChange={(e) => handleLeaderChange('department', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm appearance-none pr-8">
                                    <option value="">Department *</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <select value={leader.semester} onChange={(e) => handleLeaderChange('semester', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm appearance-none pr-8">
                                    <option value="">Semester / Year *</option>
                                    {YEARS.map(y => SEMESTERS.map(s => {
                                        const val = `${y} - ${s}`;
                                        return <option key={val} value={val}>{val}</option>;
                                    }))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Optional Members */}
                    {members.length < 2 && (
                        <button
                            type="button"
                            onClick={addMember}
                            className="w-full py-4 border-2 border-dashed border-[#A855F7]/20 rounded-2xl flex items-center justify-center gap-2 text-[#A855F7] font-bold hover:border-[#A855F7] hover:bg-violet-50 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" /> Add Team Member ({members.length + 2} of 3)
                        </button>
                    )}

                    {members.map((member, idx) => (
                        <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 relative group hover:border-violet-200 transition-colors shadow-sm">
                            <button type="button" onClick={() => removeMember(idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <h4 className="text-xs font-bold text-[#A855F7]/60 uppercase tracking-wider mb-3">Member {idx + 2} <span className="text-gray-400 font-normal">(Optional)</span></h4>
                            <div className="space-y-3">
                                <input value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Full Name" />
                                <input value={member.studentId} onChange={(e) => handleMemberChange(idx, 'studentId', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Student ID" />
                                <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Active Email Address" />
                                <input value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm" placeholder="Contact Number" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="relative">
                                        <select value={member.department} onChange={(e) => handleMemberChange(idx, 'department', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm appearance-none pr-8">
                                            <option value="">Department *</option>
                                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <select value={member.semester} onChange={(e) => handleMemberChange(idx, 'semester', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#A855F7] outline-none text-sm appearance-none pr-8">
                                            <option value="">Semester / Year *</option>
                                            {YEARS.map(y => SEMESTERS.map(s => {
                                                const val = `${y} - ${s}`;
                                                return <option key={val} value={val}>{val}</option>;
                                            }))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <hr className="border-gray-100" />

                    {/* Payment */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B1230] text-lg">Payment Details (499 BDT)</h3>
                        </div>

                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                            {['bkash', 'nagad'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: method }))}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold capitalize transition-all ${form.paymentMethod === method ? 'bg-white text-[#1B1230] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
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
                                className={`border rounded-2xl p-5 flex items-start gap-4 transition-colors ${form.paymentMethod === 'bkash' ? 'bg-pink-50/50 border-pink-100' : 'bg-orange-50/50 border-orange-100'}`}
                            >
                                <Smartphone className={`w-6 h-6 shrink-0 mt-1 ${form.paymentMethod === 'bkash' ? 'text-pink-600' : 'text-orange-600'}`} />
                                <div>
                                    <p className={`font-bold mb-1 text-base ${form.paymentMethod === 'bkash' ? 'text-pink-900' : 'text-orange-900'}`}>
                                        Send Money ({form.paymentMethod})
                                    </p>
                                    <p className="text-gray-700 font-medium mb-1">Number: <span className="font-bold select-all">01639802823</span></p>
                                    <p className="text-gray-700 font-medium">Total: <span className="font-bold text-xl text-[#1B1230]">499 BDT</span></p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1.5 ml-1">Sender Mobile Number <span className="text-red-500">*</span></label>
                                <input name="paymentSenderNumber" value={form.paymentSenderNumber} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A855F7] outline-none transition-all" placeholder="01XXXXXXXXX" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1.5 ml-1 capitalize">{form.paymentMethod} Transaction ID <span className="text-red-500">*</span></label>
                                <input name="bkashTxId" value={form.bkashTxId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A855F7] outline-none font-mono uppercase transition-all" placeholder="TRX123456" />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-[#A855F7]" /> Payment Screenshot <span className="text-red-500">*</span>
                            </label>
                            <div onClick={() => screenshotInputRef.current?.click()} className={`w-full py-6 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 text-center ${form.paymentScreenshotUrl ? 'border-[#A855F7] bg-violet-50' : 'border-gray-300 hover:border-[#A855F7] bg-white'}`}>
                                {screenshotUploading ? (
                                    <><Loader2 className="w-5 h-5 text-[#A855F7] animate-spin" /><span className="text-sm text-[#A855F7] font-semibold">Uploading...</span></>
                                ) : form.paymentScreenshotUrl ? (
                                    <><CheckCircle2 className="w-5 h-5 text-[#A855F7]" /><span className="font-semibold text-[#1B1230] text-sm">Screenshot ready</span></>
                                ) : (
                                    <><Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-500">Tap to upload (JPG/PNG, Max 5MB)</span></>
                                )}
                            </div>
                            <input ref={screenshotInputRef} type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleScreenshotUpload} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Declarations */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-[#1B1230] text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#A855F7]" /> Declarations & Policy Agreement</h3>
                        {declarations.map(d => (
                            <label key={d.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <input type="checkbox" name={d.key} checked={form[d.key]} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#A855F7] focus:ring-[#A855F7] border-gray-300" />
                                <span className="text-sm text-gray-600 font-medium">{d.label} <span className="text-red-500">*</span></span>
                            </label>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Registration (499 BDT)'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
