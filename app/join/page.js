'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Leaf, User, BookOpen,
    CreditCard, ChevronRight, Upload,
    Loader2, ArrowLeft, Smartphone, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function JoinPage() {
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
        agreeToTerms: false
    });

    const [imageUrl, setImageUrl] = useState('');
    const [imagePublicId, setImagePublicId] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDuplicateStudentId, setIsDuplicateStudentId] = useState(false);
    const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
    const [checkingDuplicate, setCheckingDuplicate] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const fileInputRef = useRef(null);

    const departments = ["CSE", "EEE", "CE", "ME", "IPE", "TE", "Architecture", "BBA"];
    const yearOptions = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2", "5-1", "5-2"];
    const labGroups = ["A-1", "A-2", "B-1", "B-2", "C-1", "C-2", "D-1", "D-2"];

    const debouncedStudentId = useDebounce(form.studentId.trim().toUpperCase(), 500);
    const debouncedEmail = useDebounce(form.email.trim().toLowerCase(), 500);

    // Duplicate check for studentId
    useEffect(() => {
        if (!debouncedStudentId || debouncedStudentId.length < 3) {
            setIsDuplicateStudentId(false);
            return;
        }
        let cancelled = false;
        setCheckingDuplicate(true);
        fetch(`/api/check-duplicate?studentId=${encodeURIComponent(debouncedStudentId)}`)
            .then(r => r.json())
            .then(data => {
                if (!cancelled) setIsDuplicateStudentId(data.exists);
            })
            .catch(() => {})
            .finally(() => { if (!cancelled) setCheckingDuplicate(false); });
        return () => { cancelled = true; };
    }, [debouncedStudentId]);

    // Duplicate check for email
    useEffect(() => {
        if (!debouncedEmail || debouncedEmail.length < 5) {
            setIsDuplicateEmail(false);
            return;
        }
        let cancelled = false;
        fetch(`/api/check-duplicate?email=${encodeURIComponent(debouncedEmail)}`)
            .then(r => r.json())
            .then(data => {
                if (!cancelled) setIsDuplicateEmail(data.exists);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [debouncedEmail]);

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

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        setIsUploadingImage(true);
        setUploadError('');

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = await new Promise((resolve, reject) => {
                const i = new Image();
                i.onload = () => resolve(i);
                i.onerror = reject;
                i.src = URL.createObjectURL(file);
            });

            let { width, height } = img;
            const maxSize = 800;
            if (width > maxSize || height > maxSize) {
                if (width > height) { height = (height / width) * maxSize; width = maxSize; }
                else { width = (width / height) * maxSize; height = maxSize; }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(img.src);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

            const signRes = await fetch('/api/cloudinary/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'eswc_members' })
            });
            const signData = await signRes.json();

            const formData = new FormData();
            formData.append('file', compressedBase64);
            formData.append('folder', signData.folder);
            formData.append('timestamp', signData.timestamp);
            formData.append('api_key', signData.apiKey);
            formData.append('signature', signData.signature);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );

            if (!uploadRes.ok) throw new Error('Upload failed');

            const result = await uploadRes.json();
            setImageUrl(result.secure_url);
            setImagePublicId(result.public_id);
            setUploadError('');
        } catch (err) {
            setUploadError('Failed to upload photo. Please try again');
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Field-level validation
    const validateField = (name) => {
        switch (name) {
            case 'name': return !form.name.trim() ? 'Full name is required' : '';
            case 'phone': return form.phone.length !== 11 || !form.phone.startsWith('01') ? 'Enter a valid 11-digit phone starting with 01' : '';
            case 'email': {
                if (!form.email.trim()) return 'Email is required';
                const lower = form.email.toLowerCase();
                const isAust = lower.endsWith('@aust.edu');
                if (form.yearSemester === '1-1') {
                    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
                    if (!isAust && !domains.some(d => lower.includes(d))) return '1-1 students need @aust.edu or a valid provider';
                } else if (!isAust) {
                    return 'Please use your official @aust.edu email';
                }
                return '';
            }
            case 'studentId': {
                if (!form.studentId.trim()) return 'Student ID is required';
                if (isDuplicateStudentId) return 'This Student ID is already registered';
                return '';
            }
            case 'department': return !form.department ? 'Please select your department' : '';
            case 'yearSemester': return !form.yearSemester ? 'Please select year & semester' : '';
            case 'labGroup': return form.department !== 'BBA' && !form.labGroup ? 'Please select your lab group' : '';
            case 'bkashId': return form.paymentMethod === 'Online' && !form.bkashId.trim() ? 'Transaction ID is required' : '';
            case 'agreeToTerms': return !form.agreeToTerms ? 'You must agree to the terms' : '';
            default: return '';
        }
    };

    // Validate all fields
    const validateAll = () => {
        const newErrors = {};
        ['name', 'phone', 'email', 'studentId', 'department', 'yearSemester', 'labGroup', 'bkashId', 'agreeToTerms'].forEach(f => {
            const err = validateField(f);
            if (err) newErrors[f] = err;
        });
        if (!imageUrl) newErrors.photo = 'Profile photo is required';
        setErrors(newErrors);
        setTouched({
            name: true, phone: true, email: true, studentId: true,
            department: true, yearSemester: true, labGroup: true,
            bkashId: true, agreeToTerms: true, photo: true
        });
        return Object.keys(newErrors).length === 0;
    };

    // Compute errors for display
    const displayErrors = {};
    ['name', 'phone', 'email', 'studentId', 'department', 'yearSemester', 'labGroup', 'bkashId', 'agreeToTerms'].forEach(f => {
        if (touched[f]) displayErrors[f] = validateField(f);
    });
    if (touched.photo && !imageUrl && !isUploadingImage) displayErrors.photo = 'Profile photo is required';
    if (uploadError) displayErrors.photo = uploadError;
    if (isDuplicateEmail && touched.email) displayErrors.email = 'This email is already registered';

    const isFormValid =
        form.name.trim() &&
        form.phone.length === 11 && form.phone.startsWith('01') &&
        form.email.trim() &&
        form.studentId.trim() &&
        !isDuplicateStudentId &&
        !isDuplicateEmail &&
        form.department &&
        form.yearSemester &&
        (form.department === 'BBA' || form.labGroup) &&
        (form.paymentMethod === 'Cash' || form.bkashId.trim()) &&
        imageUrl &&
        !isUploadingImage &&
        form.agreeToTerms &&
        !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            const firstError = document.querySelector('.field-error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Submitting your registration...');

        try {
            const trimmedForm = {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                department: form.department,
                yearSemester: form.yearSemester,
                labGroup: form.labGroup,
                studentId: form.studentId.trim().toUpperCase(),
                bkashId: form.paymentMethod === 'Online' ? form.bkashId.trim() : '',
                paymentMethod: form.paymentMethod,
                reference: form.reference.trim(),
                imageUrl,
                publicId: imagePublicId
            };

            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trimmedForm)
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409 && data.error === 'already_exists') {
                    throw new Error('This Student ID or Email is already registered');
                } else if (res.status >= 500) {
                    throw new Error('Server error. Please try again later');
                }
                throw new Error(data.message || 'Submission failed. Please try again');
            }

            toast.success('Registration Successful!', { id: toastId });
            setTimeout(() => router.push('/congratulations'), 1500);

        } catch (err) {
            console.error(err);
            if (!navigator.onLine) {
                toast.error('No internet connection. Please check your network', { id: toastId });
            } else {
                toast.error(err.message || 'Something went wrong. Please try again', { id: toastId });
            }
            setLoading(false);
        }
    };

    const FieldError = ({ name }) => {
        const msg = displayErrors[name];
        if (!msg) return null;
        return (
            <p className="field-error flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {msg}
            </p>
        );
    };

    const inputClass = (name) =>
        `w-full bg-slate-50 border rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 ${
            displayErrors[name] ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-emerald-500'
        }`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
            <Toaster position="top-center" toastOptions={{
                style: { background: '#FFFFFF', color: '#0f172a', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '16px' }
            }} />

            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <h1 className="text-lg font-bold text-slate-900">Member Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

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

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto px-4 -mt-8 relative z-20"
            >
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8">

                    {/* Personal Info */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Personal Info</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} onBlur={() => handleBlur('name')}
                                    className={inputClass('name')} placeholder="e.g. Adnan Sami" />
                                <FieldError name="name" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Phone Number *</label>
                                <input name="phone" value={form.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} type="tel"
                                    className={inputClass('phone')} placeholder="01XXXXXXXXX" />
                                <FieldError name="phone" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address *</label>
                                <input name="email" value={form.email} onChange={handleChange} onBlur={() => handleBlur('email')} type="email"
                                    className={inputClass('email')} placeholder="aust.student@aust.edu" />
                                <FieldError name="email" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Academic Info */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Academic Info</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Student ID *</label>
                                <div className="relative">
                                    <input name="studentId" value={form.studentId} onChange={handleChange} onBlur={() => handleBlur('studentId')}
                                        className={inputClass('studentId') + ' font-mono tracking-wide'} placeholder="2X.XX.XX.XXX" />
                                    {checkingDuplicate && <Loader2 className="w-4 h-4 animate-spin text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />}
                                </div>
                                <FieldError name="studentId" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Department *</label>
                                <div className="relative">
                                    <select name="department" value={form.department} onChange={handleChange} onBlur={() => handleBlur('department')}
                                        className={inputClass('department') + ' appearance-none'}>
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronRight className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                                </div>
                                <FieldError name="department" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Year & Semester *</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {yearOptions.map(opt => {
                                        const isDisabled = ['5-1', '5-2'].includes(opt) && form.department !== 'Architecture';
                                        const isSelected = form.yearSemester === opt;
                                        return (
                                            <button key={opt} type="button"
                                                onClick={() => { if (!isDisabled) { setForm(p => ({ ...p, yearSemester: opt })); setTouched(p => ({ ...p, yearSemester: true })); setErrors(p => ({ ...p, yearSemester: '' })); } }}
                                                disabled={isDisabled}
                                                className={`py-2 rounded-lg text-sm font-semibold transition-all touch-manipulation border ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : isDisabled ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}>
                                                {opt}
                                            </button>
                                        )
                                    })}
                                </div>
                                <FieldError name="yearSemester" />
                            </div>

                            {form.department !== 'BBA' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Lab Group *</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {labGroups.map(grp => {
                                            const isDisabled = ['D-1', 'D-2'].includes(grp) && form.department !== 'EEE';
                                            const isSelected = form.labGroup === grp;
                                            return (
                                                <button key={grp} type="button" disabled={isDisabled}
                                                    onClick={() => { if (!isDisabled) { setForm(p => ({ ...p, labGroup: grp })); setTouched(p => ({ ...p, labGroup: true })); setErrors(p => ({ ...p, labGroup: '' })); } }}
                                                    className={`py-2 rounded-lg text-sm font-semibold transition-all touch-manipulation border ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : isDisabled ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}>
                                                    {grp}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <FieldError name="labGroup" />
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

                        <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full shadow-sm text-pink-600">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-pink-900 text-lg">Send Money (bKash)</h4>
                                    <div className="mt-1 space-y-1 text-pink-800">
                                        <p className="font-medium">Number: <span className="font-bold text-xl select-all">01639802823</span></p>
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
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">bKash Transaction ID *</label>
                                <input name="bkashId" value={form.bkashId} onChange={handleChange} onBlur={() => handleBlur('bkashId')}
                                    className={inputClass('bkashId') + ' font-mono uppercase'} placeholder="TRX123456" />
                                <FieldError name="bkashId" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Profile Photo *</label>
                                <div onClick={() => fileInputRef.current?.click()}
                                    className={`w-full py-4 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center group ${
                                        imageUrl ? 'border-emerald-500 bg-emerald-50/30' : isUploadingImage ? 'border-blue-400 bg-blue-50/30' : displayErrors.photo ? 'border-red-300 bg-red-50/30' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                                    }`}>
                                    {isUploadingImage ? (
                                        <>
                                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                                            <span className="text-sm font-medium text-blue-600">Uploading photo...</span>
                                        </>
                                    ) : imageUrl ? (
                                        <>
                                            <div className="relative">
                                                <img src={imageUrl} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto" alt="Preview" />
                                                <div className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full text-white">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-emerald-700">Photo uploaded successfully</span>
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
                                <FieldError name="photo" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Reference (Optional)</label>
                                <input name="reference" value={form.reference} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Did anyone refer you?" />
                            </div>
                        </div>
                    </div>

                    {/* Terms & Submit */}
                    <div className="pt-4">
                        <label className={`flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg transition-all mb-6 ${!form.agreeToTerms ? 'hover:bg-red-50 border-2 border-red-200' : 'hover:bg-slate-50 border-2 border-transparent'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${form.agreeToTerms ? 'bg-emerald-600 border-emerald-600' : 'border-red-400 bg-red-50'}`}>
                                {form.agreeToTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleChange} className="hidden" />
                            <div className="text-sm text-slate-600 leading-snug">
                                I agree to the <span className="text-emerald-700 font-bold">Terms & Conditions</span> and confirm that all provided information is accurate. *
                            </div>
                        </label>
                        <FieldError name="agreeToTerms" />

                        <button type="submit" disabled={!isFormValid}
                            className={`w-full text-white text-lg font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform mt-4 ${
                                isFormValid
                                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/30 hover:-translate-y-1 active:scale-[0.98]'
                                    : 'bg-slate-400 cursor-not-allowed opacity-70'
                            }`}>
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
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
