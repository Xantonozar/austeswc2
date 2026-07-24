'use client';

import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Upload, Loader2, Camera,
    BookOpen, Users, Hash, ChevronDown, X, CheckCircle, AlertCircle,
    Briefcase, Calendar
} from 'lucide-react';

export default function DataCollectPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        yearSemester: '',
        labGroup: '',
        department: '',
        team: '',
        position: '',
        studentId: '',
    });

    const [imageUrl, setImageUrl] = useState('');
    const [imagePublicId, setImagePublicId] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [routineImageUrl, setRoutineImageUrl] = useState('');
    const [routinePublicId, setRoutinePublicId] = useState('');
    const [isUploadingRoutine, setIsUploadingRoutine] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef(null);
    const routineFileInputRef = useRef(null);

    const departments = ['CSE', 'EEE', 'CE', 'ME', 'IPE', 'TE', 'Architecture', 'BBA'];
    const yearOptions = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2'];
    const labGroups = ['A-1', 'A-2', 'B-1', 'B-2', 'C-1', 'C-2', 'D-1', 'D-2'];
    const teams = ['Event Management', 'Logistics', 'Research & Development', 'Public Relationship', 'Content Writing', 'Graphics', 'Web Development'];
    const positions = ['Advisor', 'President', 'Vice President', 'General Secretary', 'Treasurer', 'Organizing Secretary', 'Joint Secretary', 'Executive', 'Senior Sub Executive', 'Sub Executive', 'Junior Executive'];
    const teamPositions = ['Executive', 'Senior Sub Executive', 'Sub Executive', 'Junior Executive'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (name === 'position') {
            if (!teamPositions.includes(value)) {
                setForm(prev => ({ ...prev, team: '' }));
            }
            setTimeout(() => {
                const teamErr = validateField('team');
                setErrors(prev => ({ ...prev, team: teamErr }));
            }, 0);
        }
        if (name === 'department') {
            if (value !== 'EEE') {
                setForm(prev => ({ ...prev, labGroup: '' }));
            }
        }
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const err = validateField(name);
        if (err) setErrors(prev => ({ ...prev, [name]: err }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
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
                body: JSON.stringify({ folder: 'eswc_datacollect' })
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
            if (errors.photo) setErrors(prev => ({ ...prev, photo: '' }));
            toast.success('Photo uploaded!');
        } catch {
            setUploadError('Failed to upload photo. Please try again');
            toast.error('Upload failed');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const removeImage = () => {
        setImageUrl('');
        setImagePublicId('');
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRoutineChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }

        setIsUploadingRoutine(true);
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
            const maxSize = 1200;
            if (width > maxSize || height > maxSize) {
                if (width > height) { height = (height / width) * maxSize; width = maxSize; }
                else { width = (width / height) * maxSize; height = maxSize; }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(img.src);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

            const signRes = await fetch('/api/cloudinary/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'eswc_datacollect' })
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
            setRoutineImageUrl(result.secure_url);
            setRoutinePublicId(result.public_id);
            setUploadError('');
            toast.success('Routine uploaded!');
        } catch {
            setUploadError('Failed to upload routine. Please try again');
            toast.error('Upload failed');
        } finally {
            setIsUploadingRoutine(false);
        }
    };

    const removeRoutine = () => {
        setRoutineImageUrl('');
        setRoutinePublicId('');
        if (routineFileInputRef.current) routineFileInputRef.current.value = '';
    };

    const validateField = (name) => {
        switch (name) {
            case 'name': return !form.name.trim() ? 'Name is required' : '';
            case 'email': return !form.email.trim() ? 'Email is required' : '';
            case 'phone': return form.phone.length !== 11 || !form.phone.startsWith('01') ? 'Enter a valid 11-digit phone starting with 01' : '';
            case 'studentId': return !form.studentId.trim() ? 'Student ID is required' : '';
            case 'department': return !form.department ? 'Department is required' : '';
            case 'yearSemester': return !form.yearSemester ? 'Year & semester is required' : '';
            case 'position': return !form.position ? 'Position is required' : '';
            case 'team': return teamPositions.includes(form.position) && !form.team ? 'Team is required for this position' : '';
            case 'labGroup': return form.department === 'EEE' && !form.labGroup ? 'Lab group is required for EEE' : '';
            default: return '';
        }
    };

    const validateAll = () => {
        const newErrors = {};
        ['name', 'email', 'phone', 'studentId', 'department', 'yearSemester', 'position', 'team', 'labGroup'].forEach(f => {
            const err = validateField(f);
            if (err) newErrors[f] = err;
        });
        if (!imageUrl) newErrors.photo = 'Profile image is required';
        if (!routineImageUrl) newErrors.routine = 'Routine is required';
        setErrors(newErrors);
        setTouched({
            name: true, email: true, phone: true, studentId: true,
            department: true, yearSemester: true, position: true, team: true,
            labGroup: true, photo: true, routine: true
        });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) {
            toast.error('Please fix the errors below');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/datacollect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    imageUrl,
                    publicId: imagePublicId,
                    routineImageUrl,
                    routinePublicId,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setSubmitted(true);
                toast.success('Data submitted successfully!');
            } else {
                toast.error(data.error || 'Submission failed');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F4F6FA' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md w-full shadow-xl"
                >
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#D4EFDF' }}>
                        <CheckCircle className="w-8 h-8" style={{ color: '#4CA88C' }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#1C1B1F' }}>Submitted!</h2>
                    <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Your data has been collected successfully.</p>
                    <button
                        onClick={() => {
                            setForm({ name: '', email: '', phone: '', yearSemester: '', labGroup: '', department: '', team: '', position: '', studentId: '' });
                            setImageUrl('');
                            setImagePublicId('');
                            setRoutineImageUrl('');
                            setRoutinePublicId('');
                            setSubmitted(false);
                            setErrors({});
                            setTouched({});
                        }}
                        className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg"
                        style={{ background: '#3B82C4' }}
                    >
                        Submit Another
                    </button>
                </motion.div>
            </div>
        );
    }

    const inputClass = (field) =>
        `w-full bg-slate-50 border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 ${
            errors[field] && touched[field]
                ? 'border-red-300 focus:ring-2 focus:ring-red-400'
                : 'border-slate-200 focus:ring-2 focus:ring-blue-400'
        }`;

    return (
        <div className="min-h-screen py-6 px-4" style={{ background: '#F4F6FA' }}>
            <Toaster position="top-center" toastOptions={{
                style: { borderRadius: '12px', fontWeight: 600, fontSize: '13px' },
            }} />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: '#D6EEFF' }}>
                        <Hash className="w-6 h-6" style={{ color: '#3B82C4' }} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#2C3E50' }}>Data Collection</h1>
                    <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Fill in your details below</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">

                    {/* Personal Info */}
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-lg" style={{ background: '#D4EFDF' }}>
                                <User className="w-4 h-4" style={{ color: '#4CA88C' }} />
                            </div>
                            <h2 className="text-sm font-bold" style={{ color: '#1C1B1F' }}>Personal Info</h2>
                        </div>

                        <div className="space-y-3">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="Enter your full name"
                                    className={inputClass('name')}
                                />
                                {errors.name && touched.name && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="your@email.com"
                                    className={inputClass('email')}
                                />
                                {errors.email && touched.email && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('phone')}
                                    placeholder="01XXXXXXXXX"
                                    className={inputClass('phone')}
                                />
                                {errors.phone && touched.phone && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Student ID *</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('studentId')}
                                    placeholder="e.g. 211-15-XXXX"
                                    className={inputClass('studentId')}
                                />
                                {errors.studentId && touched.studentId && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.studentId}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-lg" style={{ background: '#D6EAF8' }}>
                                <BookOpen className="w-4 h-4" style={{ color: '#2874A6' }} />
                            </div>
                            <h2 className="text-sm font-bold" style={{ color: '#1C1B1F' }}>Academic Info</h2>
                        </div>

                        <div className="space-y-3">
                            {/* Department */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Department *</label>
                                <div className="relative">
                                    <select
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('department')}
                                        className={`${inputClass('department')} appearance-none pr-10`}
                                    >
                                        <option value="">Select department</option>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                                </div>
                                {errors.department && touched.department && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.department}
                                    </p>
                                )}
                            </div>

                            {/* Year & Semester */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Year & Semester *</label>
                                <div className="relative">
                                    <select
                                        name="yearSemester"
                                        value={form.yearSemester}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('yearSemester')}
                                        className={`${inputClass('yearSemester')} appearance-none pr-10`}
                                    >
                                        <option value="">Select year-semester</option>
                                        {yearOptions
                                            .filter(y => form.department === 'Architecture' || !y.startsWith('5'))
                                            .map(y => <option key={y} value={y}>Year {y.split('-')[0]}, Semester {y.split('-')[1]}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                                </div>
                                {errors.yearSemester && touched.yearSemester && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.yearSemester}
                                    </p>
                                )}
                            </div>

                            {/* Lab Group - EEE only */}
                            {form.department === 'EEE' && (
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Lab Group *</label>
                                <div className="relative">
                                    <select
                                        name="labGroup"
                                        value={form.labGroup}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('labGroup')}
                                        className={`${inputClass('labGroup')} appearance-none pr-10`}
                                    >
                                        <option value="">Select lab group</option>
                                        {labGroups.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                                </div>
                                {errors.labGroup && touched.labGroup && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.labGroup}
                                    </p>
                                )}
                            </div>
                            )}

                            {/* Routine Upload */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Class Routine *</label>
                                {routineImageUrl ? (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={routineImageUrl}
                                                alt="Routine"
                                                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeRoutine}
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#1C1B1F' }}>Routine uploaded</p>
                                            <p className="text-xs" style={{ color: '#6B7280' }}>Click remove to change</p>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/30"
                                        style={{ borderColor: '#E2E8F0' }}
                                    >
                                        <div className="flex flex-col items-center gap-1.5">
                                            {isUploadingRoutine ? (
                                                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#3B82C4' }} />
                                            ) : (
                                                <Calendar className="w-6 h-6" style={{ color: '#94A3B8' }} />
                                            )}
                                            <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                                                {isUploadingRoutine ? 'Uploading...' : 'Upload routine'}
                                            </span>
                                        </div>
                                        <input
                                            ref={routineFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleRoutineChange}
                                            className="hidden"
                                            disabled={isUploadingRoutine}
                                        />
                                    </label>
                                )}
                                {errors.routine && touched.routine && (
                                    <p className="flex items-center gap-1 mt-2 text-xs font-medium text-red-500">
                                        <AlertCircle className="w-3 h-3" /> {errors.routine}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Team Info */}
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-lg" style={{ background: '#E8DAEF' }}>
                                <Users className="w-4 h-4" style={{ color: '#6C3483' }} />
                            </div>
                            <h2 className="text-sm font-bold" style={{ color: '#1C1B1F' }}>Team Info</h2>
                        </div>

                        <div className="space-y-3">
                            {/* Position */}
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Position *</label>
                                <div className="relative">
                                    <select
                                        name="position"
                                        value={form.position}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('position')}
                                        className={`${inputClass('position')} appearance-none pr-10`}
                                    >
                                        <option value="">Select position</option>
                                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                                </div>
                                {errors.position && touched.position && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.position}
                                    </p>
                                )}
                            </div>

                            {/* Team - only for executive positions */}
                            {teamPositions.includes(form.position) && (
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 ml-1" style={{ color: '#475569' }}>Team *</label>
                                <div className="relative">
                                    <select
                                        name="team"
                                        value={form.team}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('team')}
                                        className={`${inputClass('team')} appearance-none pr-10`}
                                    >
                                        <option value="">Select team</option>
                                        {teams.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                                </div>
                                {errors.team && touched.team && (
                                    <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 ml-1">
                                        <AlertCircle className="w-3 h-3" /> {errors.team}
                                    </p>
                                )}
                            </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Image */}
                    <div className="p-5 sm:p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-lg" style={{ background: '#D6EEFF' }}>
                                <Camera className="w-4 h-4" style={{ color: '#3B82C4' }} />
                            </div>
                            <h2 className="text-sm font-bold" style={{ color: '#1C1B1F' }}>Profile Image *</h2>
                        </div>

                        {imageUrl ? (
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: '#1C1B1F' }}>Image uploaded</p>
                                    <p className="text-xs" style={{ color: '#6B7280' }}>Click remove to change</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/30"
                                    style={{ borderColor: '#E2E8F0' }}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        {isUploadingImage ? (
                                            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#3B82C4' }} />
                                        ) : (
                                            <Upload className="w-8 h-8" style={{ color: '#94A3B8' }} />
                                        )}
                                        <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                                            {isUploadingImage ? 'Uploading...' : 'Upload photo (max 5MB)'}
                                        </span>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isUploadingImage}
                                    />
                                </label>
                                {uploadError && (
                                    <p className="flex items-center gap-1 mt-2 text-xs font-medium text-red-500">
                                        <AlertCircle className="w-3 h-3" /> {uploadError}
                                    </p>
                                )}
                            </div>
                        )}
                        {errors.photo && touched.photo && (
                            <p className="flex items-center gap-1 mt-2 text-xs font-medium text-red-500">
                                <AlertCircle className="w-3 h-3" /> {errors.photo}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="p-5 sm:p-6 pt-0">
                        <button
                            type="submit"
                            disabled={loading || isUploadingImage}
                            className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                            style={{ background: '#3B82C4' }}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
