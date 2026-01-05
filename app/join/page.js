'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Leaf, User, BookOpen,
    CreditCard, ChevronRight, Upload,
    Loader2, ArrowLeft, Smartphone
} from 'lucide-react';
import Link from 'next/link';

export default function JoinPage() {
    // Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        yearSemester: '',
        labGroup: '',
        studentId: '',
        bkashId: '',
        paymentMethod: 'Online',
        reference: '',
        imageBase64: '',
        imageName: '',
        imageType: '',
        agreeToTerms: false
    });

    // UI State
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const fileInputRef = useRef(null);

    // Constants
    const departments = ["CSE", "EEE", "CE", "ME", "IPE", "TE", "Architecture", "BBA"];
    const yearOptions = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2", "5-1", "5-2"];
    const labGroups = ["A-1", "A-2", "B-1", "B-2", "C-1", "C-2", "D-1", "D-2"];
    const renownedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

    // Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
            setForm(prev => ({ ...prev, [name]: digitsOnly }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        if (name === 'department' && value !== 'Architecture' && ['5-1', '5-2'].includes(form.yearSemester)) {
            setForm(prev => ({ ...prev, yearSemester: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB max for source file
            toast.error('File size must be less than 10MB');
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading('Optimizing image...');

        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions (max 800x800, maintain aspect ratio)
                let width = img.width;
                let height = img.height;
                const maxSize = 800;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression (0.8 quality JPEG)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                // Calculate size reduction
                const originalSize = (file.size / 1024).toFixed(0);
                const compressedSize = ((compressedBase64.length * 0.75) / 1024).toFixed(0);

                setForm(prev => ({
                    ...prev,
                    imageBase64: compressedBase64
                }));

                toast.success(`Optimized: ${originalSize}KB → ${compressedSize}KB`, { id: loadingToast });
            };
            img.onerror = () => {
                toast.error('Failed to process image', { id: loadingToast });
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    const validate = () => {
        const emailLower = form.email.toLowerCase();
        const isAustEmail = emailLower.endsWith('@aust.edu');

        if (!form.name.trim()) return toast.error('Full Name is required');
        if (!form.email.trim()) return toast.error('Email is required');

        if (form.yearSemester === '1-1') {
            if (!isAustEmail && !renownedDomains.some(d => emailLower.includes(d))) {
                return toast.error('1-1 students need @aust.edu or a valid email provider');
            }
        } else if (!isAustEmail) {
            return toast.error('Please use your official @aust.edu email');
        }

        if (form.phone.length !== 11 || !form.phone.startsWith('01')) return toast.error('Phone number must be 11 digits and start with 01');
        if (!form.department) return toast.error('Select your Department');
        if (!form.yearSemester) return toast.error('Select Year & Semester');
        if (form.department !== 'BBA' && !form.labGroup) return toast.error('Select your Lab Group');
        if (!form.studentId.trim()) return toast.error('Student ID is required');

        // Conditional validation for Online payment
        if (form.paymentMethod === 'Online') {
            if (!form.bkashId.trim()) return toast.error('bKash Transaction ID is required');
        }

        if (!form.imageBase64) return toast.error('Profile Photo is required');
        if (!form.agreeToTerms) return toast.error('You must agree to the terms');

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const toastId = toast.loading('Uploading your photo...');

        try {
            const trimmedForm = {
                ...form,
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                studentId: form.studentId.trim().toUpperCase(),
                bkashId: form.paymentMethod === 'Online' ? form.bkashId.trim() : '',
                reference: form.reference.trim()
            };

            toast.loading('Creating your account...', { id: toastId });

            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trimmedForm)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            toast.success('Registration Successful!', { id: toastId });
            setTimeout(() => router.push('/congratulations'), 1500);

        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Something went wrong', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#FFFFFF',
                    color: '#0f172a',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                }
            }} />

            {/* Header / Nav */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <h1 className="text-lg font-bold text-slate-900">Member Registration</h1>
                    <div className="w-10"></div> {/* Spacer for center alignment */}
                </div>
            </div>

            {/* Hero / Intro */}
            <div className="bg-emerald-600 text-white pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Leaf className="w-32 h-32 rotate-12" />
                </div>
                <div className="max-w-xl mx-auto relative z-10 text-center">
                    <h2 className="text-2xl font-bold mb-2">Join ESWC Family</h2>
                    <p className="text-emerald-50 text-sm opacity-90 max-w-sm mx-auto">
                        Become a part of the change. Join 500+ students making a difference at AUST.
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto px-4 -mt-8 relative z-20"
            >
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8">

                    {/* Personal Info Section */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Personal Info</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="e.g. Adnan Sami"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    type="tel"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    type="email"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="aust.student@aust.edu"
                                />
                                <p className="text-xs text-slate-500 mt-1.5 ml-1">Use your official AUST email if available.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Academic Info Section */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Academic Info</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Student ID</label>
                                <input
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono tracking-wide"
                                    placeholder="2X.XX.XX.XXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Department</label>
                                <div className="relative">
                                    <select
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronRight className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Year & Semester</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {yearOptions.map(opt => {
                                        const isDisabled = ['5-1', '5-2'].includes(opt) && form.department !== 'Architecture';
                                        const isSelected = form.yearSemester === opt;
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => !isDisabled && setForm(p => ({ ...p, yearSemester: opt }))}
                                                disabled={isDisabled}
                                                className={`py-2 rounded-lg text-sm font-semibold transition-all touch-manipulation border ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                                    : isDisabled
                                                        ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {form.department !== 'BBA' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Lab Group</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {labGroups.map(grp => {
                                            const isDisabled = ['D-1', 'D-2'].includes(grp) && form.department !== 'EEE';
                                            const isSelected = form.labGroup === grp;
                                            return (
                                                <button
                                                    key={grp}
                                                    type="button"
                                                    disabled={isDisabled}
                                                    onClick={() => !isDisabled && setForm(p => ({ ...p, labGroup: grp }))}
                                                    className={`py-2 rounded-lg text-sm font-semibold transition-all touch-manipulation border ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                                        : isDisabled
                                                            ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                                                        }`}
                                                >
                                                    {grp}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Payment & Upload */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <CreditCard className="w-5 h-5 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Payment Method</h3>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full shadow-sm text-pink-600">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-pink-900 text-lg">Send Money (bKash)</h4>
                                    <div className="mt-1 space-y-1 text-pink-800">
                                        <p className="font-medium">Number: <span className="font-bold text-xl select-all">01853259598</span></p>
                                        <p className="font-medium">Amount: <span className="font-bold text-xl">102 TK</span></p>
                                    </div>
                                    <p className="text-xs text-pink-600 mt-2">
                                        *Please use "Send Money" option from your bKash app.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">bKash Transaction ID</label>
                                <input
                                    name="bkashId"
                                    value={form.bkashId}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all placeholder:text-slate-400 font-mono uppercase"
                                    placeholder="TRX123456"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Profile Photo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-full py-4 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center group
                                ${form.imageBase64 ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'}
                            `}
                                >
                                    {form.imageBase64 ? (
                                        <>
                                            <div className="relative">
                                                <img
                                                    src={form.imageBase64}
                                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                                                    alt="Preview"
                                                />
                                                <div className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full text-white">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-emerald-700 truncate max-w-[200px]">
                                                Image Selected
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                                                <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-700">Click to upload photo</p>
                                                <p className="text-xs text-slate-400">JPG, PNG usually work best</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Reference (Optional)</label>
                                <input
                                    name="reference"
                                    value={form.reference}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Did anyone refer you?"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms & Submit */}
                    <div className="pt-4">
                        <label className={`flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg transition-all mb-6 ${!form.agreeToTerms ? 'hover:bg-red-50 border-2 border-red-200' : 'hover:bg-slate-50 border-2 border-transparent'
                            }`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${form.agreeToTerms ? 'bg-emerald-600 border-emerald-600' : 'border-red-400 bg-red-50'
                                }`}>
                                {form.agreeToTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleChange} className="hidden" />
                            <div className="text-sm text-slate-600 leading-snug">
                                I agree to the <span className="text-emerald-700 font-bold">Terms & Conditions</span> and confirm that all provided information is accurate.
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={loading || !form.agreeToTerms}
                            onClick={(e) => {
                                if (!form.agreeToTerms) {
                                    e.preventDefault();
                                    toast.error('Please agree to the Terms & Conditions');
                                }
                            }}
                            className={`w-full text-white text-lg font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform ${!form.agreeToTerms
                                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/30 hover:-translate-y-1 active:scale-[0.98]'
                                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : !form.agreeToTerms ? (
                                <>Please Agree to Terms <ChevronRight className="w-5 h-5" /></>
                            ) : (
                                <>Complete Registration <ChevronRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
