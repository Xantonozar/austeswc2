"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Camera, User, ArrowLeft, Loader2, Upload, CheckCircle2, FileText, GraduationCap, Star, Image as ImageIcon, Smartphone, Receipt, Plus, Trash2, Eye, X } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

const THEMES = ['Echoes of Change', 'The Human Element', 'Hidden Waste', 'Nature vs. Concrete', 'Shades of Hope', 'Open Wild'];
const DEPARTMENTS = ['CSE', 'EEE', 'CE', 'ME', 'IPE', 'TE', 'Arch', 'BBA'];
const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
const SEMESTER_OPTIONS = ['1st Semester', '2nd Semester'];

const emptyPhoto = () => ({ base64: '', file: null, url: '', publicId: '', uploading: false, theme: '', title: '', caption: '' });

export default function EcoFrameRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [photoCount, setPhotoCount] = useState(1);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [screenshotUploading, setScreenshotUploading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        studentId: '',
        email: '',
        department: '',
        year: '',
        semester: '',
        phone: '',
        caReference: '',
        bkashTxId: '',
        paymentSenderNumber: '',
        paymentMethod: 'bkash',
        paymentScreenshotBase64: '',
        paymentScreenshotUrl: '',
        paymentScreenshotPublicId: '',
        confirmOriginal: false,
        confirmAi: false,
        confirmRaw: false,
        confirmRules: false
    });

    const [photos, setPhotos] = useState([emptyPhoto()]);
    const fileInputRefs = useRef([]);
    const screenshotInputRef = useRef(null);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handlePhotoChange = (index, field, value) => {
        setPhotos(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addPhoto = () => {
        setPhotos(prev => {
            if (prev.length >= 3) return prev;
            setPhotoCount(prev.length + 1);
            return [...prev, emptyPhoto()];
        });
    };

    const removePhoto = (index) => {
        setPhotos(prev => {
            if (prev.length <= 1) return prev;
            const next = prev.filter((_, i) => i !== index);
            setPhotoCount(next.length);
            return next;
        });
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

    const handleImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.error('Only JPEG/PNG images allowed');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error(`Photo ${index + 1} must be under 10MB`);
            return;
        }
        // Show preview immediately from the original file (reliable, no dependency on compression)
        const previewReader = new FileReader();
        previewReader.onload = (ev) => setPhotos(prev => {
            const next = [...prev];
            next[index] = { ...next[index], base64: ev.target.result, uploading: true };
            return next;
        });
        previewReader.readAsDataURL(file);

        const loadingToast = toast.loading(`Uploading photo ${index + 1} to secure storage...`);
        try {
            const compressed = await compress(file, 9.5);
            const r = await uploadToCloudinary(compressed, 'eswc_competition/eco_frame');
            setPhotos(prev => {
                const next = [...prev];
                next[index] = { ...next[index], url: r.url, publicId: r.publicId, uploading: false };
                return next;
            });
            toast.success(`Photo ${index + 1} uploaded`, { id: loadingToast });
        } catch (err) {
            setPhotos(prev => {
                const next = [...prev];
                next[index] = { ...next[index], uploading: false };
                return next;
            });
            toast.error(err.message || 'Failed to upload image', { id: loadingToast });
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
            const reader = new FileReader();
            reader.onload = (ev) => setForm(prev => ({ ...prev, paymentScreenshotBase64: ev.target.result }));
            reader.readAsDataURL(compressed);
            const r = await uploadToCloudinary(compressed, 'eswc_competition/eco_frame_payments');
            setForm(prev => ({ ...prev, paymentScreenshotUrl: r.url, paymentScreenshotPublicId: r.publicId }));
            toast.success('Screenshot uploaded', { id: loadingToast });
        } catch (err) {
            toast.error(err.message || 'Failed to upload screenshot', { id: loadingToast });
        } finally {
            setScreenshotUploading(false);
        }
    };

    const validate = () => {
        if (!form.name.trim()) { toast.error('Full Name is required'); return false; }
        if (!form.studentId.trim()) { toast.error('AUST Student ID is required'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim().toLowerCase())) { toast.error('Please enter a valid email address'); return false; }
        if (!form.department) { toast.error('Please select Department'); return false; }
        if (!form.year || !form.semester) { toast.error('Please select Year & Semester'); return false; }
        if (!form.phone.trim()) { toast.error('Phone Number is required'); return false; }
        if (!form.bkashTxId.trim()) { toast.error('bKash Transaction ID is required'); return false; }
        if (!form.paymentSenderNumber.trim()) { toast.error('Sender Mobile Number is required'); return false; }
        if (!form.paymentScreenshotUrl) { toast.error('Payment screenshot is required'); return false; }

        for (let i = 0; i < photos.length; i++) {
            const p = photos[i];
            if (!p.url) { toast.error(`Please upload Photo ${i + 1}`); return false; }
            if (!p.theme) { toast.error(`Please select a theme for Photo ${i + 1}`); return false; }
            if (!p.title.trim()) { toast.error(`Please enter a title for Photo ${i + 1}`); return false; }
            if (!p.caption.trim()) { toast.error(`Please enter a caption for Photo ${i + 1}`); return false; }
        }
        if (!form.confirmOriginal) { toast.error('Please confirm originality guarantee'); return false; }
        if (!form.confirmAi) { toast.error('Please confirm AI & editing policy'); return false; }
        if (!form.confirmRaw) { toast.error('Please agree to RAW file verification'); return false; }
        if (!form.confirmRules) { toast.error('Please agree to the rulebook'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!validate()) return;
        setLoading(true);
        const toastId = toast.loading('Finalizing registration...');

        try {
            const uploadedPhotos = photos.map(p => ({
                url: p.url,
                publicId: p.publicId,
                theme: p.theme,
                title: p.title.trim(),
                caption: p.caption.trim()
            }));

            const payload = {
                type: 'eco-frame',
                name: form.name.trim(),
                studentId: form.studentId.trim(),
                email: form.email.trim().toLowerCase(),
                department: form.department,
                semester: `${form.year}-${form.semester}`,
                phone: form.phone.trim(),
                caReference: form.caReference.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
                paymentMethod: form.paymentMethod,
                paymentSenderNumber: form.paymentSenderNumber.trim(),
                paymentScreenshot: { url: form.paymentScreenshotUrl, publicId: form.paymentScreenshotPublicId },
                photosReady: uploadedPhotos
            };

            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');
            toast.success('Registration Successful!', { id: toastId });
            setTimeout(() => router.push('/congratulations/eco-frame'), 1500);
        } catch (err) {
            toast.error(err.message || 'Something went wrong', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans">
            <Toaster position="top-center" />

            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/competetion/eco-frame" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Eco Frame Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B4B43] px-4 -mt-[1px] relative overflow-hidden">
                <img src="https://res.cloudinary.com/chirkut/image/upload/v1788013635/Segment_Announcement_Posts_eyslrh.svg" alt="Eco Frame Contest Poster" className="w-full max-w-2xl mx-auto block" />
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Participant Identification */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><User className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Participant Identification</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name <span className="text-red-500">*</span></label>
                                <input name="name" value={form.name} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">AUST Student ID <span className="text-red-500">*</span></label>
                                <input name="studentId" value={form.studentId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none" placeholder="210104001" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">AUST Institutional Email <span className="text-red-500">*</span></label>
                                <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Department <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select name="department" value={form.department} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none appearance-none pr-10">
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <select name="year" value={form.year} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none appearance-none pr-8 text-sm">
                                        <option value="">Year *</option>
                                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <select name="semester" value={form.semester} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none appearance-none pr-8 text-sm">
                                        <option value="">Semester *</option>
                                        {SEMESTER_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Phone Number <span className="text-red-500">*</span></label>
                                <input name="phone" value={form.phone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none" placeholder="01XXXXXXXXX" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" /> Reference <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                                </label>
                                <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none" placeholder="Name of referrer" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Payment Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><Receipt className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Payment Details</h3>
                        </div>
                        <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 flex items-start gap-4">
                            <Smartphone className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-yellow-900 border-b border-yellow-200/50 pb-2 mb-2">Send Money (bKash)</p>
                                <p className="font-medium text-yellow-800">No: <span className="font-bold select-all">01639802823</span></p>
                                <p className="font-medium text-yellow-800">Total: <span className="font-bold text-xl ml-1">149 BDT</span> <span className="text-xs font-normal">(covers up to 3 photos)</span></p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Payment Method <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="py-3 rounded-xl border-2 font-bold transition-all text-sm border-[#1B4B43] bg-[#F3F9F1] text-[#1B4B43] text-center">bKash</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Sender Mobile Number <span className="text-red-500">*</span></label>
                                <input name="paymentSenderNumber" value={form.paymentSenderNumber} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none" placeholder="01XXXXXXXXX" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Transaction ID (TrxID) <span className="text-red-500">*</span></label>
                                <input name="bkashTxId" value={form.bkashTxId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none font-mono uppercase" placeholder="TRX123456" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Payment Screenshot <span className="text-red-500">*</span></label>
                            <div onClick={() => screenshotInputRef.current?.click()} className={`w-full py-6 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 text-center ${form.paymentScreenshotUrl ? 'border-[#1B4B43] bg-[#F3F9F1]' : 'border-gray-300 hover:border-[#1B4B43] bg-white'}`}>
                                {screenshotUploading ? (
                                    <><Loader2 className="w-5 h-5 text-[#1B4B43] animate-spin" /><span className="text-sm text-[#1B4B43] font-semibold">Uploading...</span></>
                                ) : form.paymentScreenshotUrl ? (
                                    <><CheckCircle2 className="w-5 h-5 text-[#1B4B43]" /><span className="font-semibold text-[#1B4B43] text-sm">Screenshot ready</span></>
                                ) : (
                                    <><Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-500">Tap to upload (JPG/PNG, Max 5MB)</span></>
                                )}
                            </div>
                            <input ref={screenshotInputRef} type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleScreenshotUpload} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Photo Submission */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#F3F9F1] rounded-lg"><Camera className="w-5 h-5 text-[#1B4B43]" /></div>
                                <h3 className="font-bold text-[#1B4B43] text-lg">Photo Submissions</h3>
                            </div>
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{photos.length}/3 photos</span>
                        </div>

                        {photos.map((photo, index) => (
                            <div key={index} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-[#1B4B43]/60 uppercase tracking-wider">Photo {index + 1} {index === 0 ? '(Mandatory)' : '(Optional)'}</h4>
                                    {index > 0 && (
                                        <button type="button" onClick={() => removePhoto(index)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Remove photo">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/3 shrink-0 space-y-2">
                                        <div onClick={() => fileInputRefs.current[index]?.click()} className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${photo.base64 ? 'border-[#1B4B43] bg-[#F3F9F1]' : 'border-gray-300 hover:border-[#1B4B43] bg-white'}`}>
                                            {photo.uploading ? (
                                                <div className="flex flex-col items-center justify-center text-center p-4"><Loader2 className="w-8 h-8 text-[#1B4B43] animate-spin mx-auto mb-2" /><span className="text-xs text-gray-500 font-medium">Uploading...</span></div>
                                            ) : photo.base64 ? (
                                                <div className="relative w-full h-full p-2 bg-slate-100">
                                                    <img src={photo.base64} className="w-full h-full object-contain rounded-lg shadow-sm" alt={`Photo ${index + 1}`} />
                                                    <div className="absolute top-4 right-4 bg-[#1B4B43] p-1.5 rounded-full shadow-md"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-4"><Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" /><span className="text-xs text-gray-500 font-medium">Tap to upload</span></div>
                                            )}
                                        </div>
                                        <input ref={el => fileInputRefs.current[index] = el} type="file" className="hidden" accept="image/jpeg,image/png" onChange={(e) => handleImageUpload(index, e)} />
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => fileInputRefs.current[index]?.click()} className="flex-1 py-2.5 rounded-xl bg-[#1B4B43] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#12332D] transition-colors">
                                                <Upload className="w-3.5 h-3.5" /> {photo.base64 ? 'Change' : 'Upload Image'}
                                            </button>
                                            {photo.base64 && (
                                                <button type="button" onClick={() => setPreviewIndex(index)} className="py-2.5 px-3 rounded-xl bg-white border border-[#1B4B43]/20 text-[#1B4B43] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F3F9F1] transition-colors" title="Preview">
                                                    <Eye className="w-3.5 h-3.5" /> Preview
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-2/3 space-y-3">
                                        <div className="relative">
                                            <select value={photo.theme} onChange={(e) => handlePhotoChange(index, 'theme', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm appearance-none pr-10">
                                                <option value="">Select Theme *</option>
                                                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <input value={photo.title} onChange={(e) => handlePhotoChange(index, 'title', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm" placeholder="Photo Title" />
                                        <textarea value={photo.caption} onChange={(e) => handlePhotoChange(index, 'caption', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm resize-none min-h-[80px]" placeholder="One-line caption" />
                                        <p className="text-[10px] text-gray-400">Naming: ParticipantName_AUSTID_Photo{index + 1}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {photos.length < 3 && (
                            <button type="button" onClick={addPhoto} className="w-full py-4 border-2 border-dashed border-[#1B4B43]/20 rounded-2xl flex items-center justify-center gap-2 text-[#1B4B43] font-bold hover:border-[#1B4B43] hover:bg-[#F3F9F1] transition-all active:scale-[0.98]">
                                <Plus className="w-5 h-5" /> Add Photo ({photos.length + 1} of 3)
                            </button>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Declarations */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-[#1B4B43] text-lg">Declarations & Policy Agreement</h3>
                        {[
                            { key: 'confirmOriginal', label: 'I confirm that all submitted photographs are my original work (no plagiarism or copyright infringement).' },
                            { key: 'confirmAi', label: 'I confirm photos are NOT AI-generated/enhanced, and only basic global edits (color, contrast, exposure, crop, B&W) are used — no compositing, cloning, or manipulation.' },
                            { key: 'confirmRaw', label: 'I agree to provide original RAW/unedited files if requested by the jury for verification.' },
                            { key: 'confirmRules', label: "I agree to abide by all official rules of Eco Frame." }
                        ].map(d => (
                            <label key={d.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <input type="checkbox" name={d.key} checked={form[d.key]} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                                <span className="text-sm text-gray-600 font-medium">{d.label} <span className="text-red-500">*</span></span>
                            </label>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#D9F2D6] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Registration (149 BDT)'}
                    </button>
                </form>

                {/* Photo Preview Modal */}
                {previewIndex !== null && photos[previewIndex]?.base64 && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewIndex(null)}>
                        <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                                <h3 className="font-bold text-[#1B4B43] text-sm">Photo {previewIndex + 1} Preview</h3>
                                <button type="button" onClick={() => setPreviewIndex(null)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4">
                                <img src={photos[previewIndex].base64} alt={`Photo ${previewIndex + 1}`} className="w-full max-h-[55vh] object-contain rounded-xl mx-auto" />
                            </div>
                            <div className="p-5 space-y-2">
                                <span className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black text-emerald-700 uppercase">{photos[previewIndex].theme || 'No theme'}</span>
                                <p className="font-bold text-[#1B4B43]">{photos[previewIndex].title || '—'}</p>
                                <p className="text-xs text-gray-500 italic">{photos[previewIndex].caption || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
