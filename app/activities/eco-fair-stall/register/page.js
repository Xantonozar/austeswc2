"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, ArrowLeft, Loader2, CreditCard, Smartphone, Plus, Trash2, GraduationCap, Star, Check, CheckCircle2, Upload, Receipt, ShieldCheck, Store } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

const PRODUCT_CATEGORIES = [
    'Eco-Friendly Merchandise & Crafts',
    'Sustainable Apparel & Fabric Products',
    'Organic-Sustainable Foods & Snacks',
    'Plants & Gardening Supplies',
    'Innovative Eco-Tech-Green Projects',
    'Others'
];

const TERMS = [
    { key: 'plasticBan', label: 'Single-Use Plastic Ban: no plastic bags/polythene/cups/straws/non-biodegradable packaging; all packaging must be paper/fabric/jute/biodegradable.' },
    { key: 'advancePayment', label: '100% Advance Payment & Non-Refundable Policy: fees are non-refundable due to immediate pre-event costs.' },
    { key: 'approvedMerch', label: 'Approved Merchandise & Prohibited Items: only approved items may be sold; no tobacco, e-cigarettes, hazardous chemicals, or single-use plastic goods.' },
    { key: 'setupSchedule', label: 'Setup Schedule & Property Safety: stall setup completed ≥1 hour before event launch daily; vendor is responsible for their merchandise/equipment.' },
    { key: 'decorum', label: 'Campus Decorum & Final Authority: maintain professionalism, follow campus guidelines; AUSTESWC/AUST Authority decisions are final and binding.' }
];

export default function EcoFairStallRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);
    const [screenshotUploading, setScreenshotUploading] = useState(false);

    const [form, setForm] = useState({
        brandName: '',
        designation: '',
        contactName: '',
        contactPhone: '',
        email: '',
        secondaryName: '',
        secondaryPhone: '',
        additionalReps: false,
        additionalRepsText: '',
        stallSize: '8x8',
        productCategories: [],
        productDescription: '',
        bkashTxId: '',
        paymentSenderNumber: '',
        paymentScreenshotUrl: '',
        paymentScreenshotPublicId: '',
        logoUrl: '',
        logoPublicId: '',
        plasticBan: false,
        advancePayment: false,
        approvedMerch: false,
        setupSchedule: false,
        decorum: false
    });

    const logoInputRef = useRef(null);
    const screenshotInputRef = useRef(null);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleCategory = (cat) => {
        setForm(prev => ({
            ...prev,
            productCategories: prev.productCategories.includes(cat)
                ? prev.productCategories.filter(c => c !== cat)
                : [...prev.productCategories, cat]
        }));
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
            return await imageCompression(file, { maxSizeMB, maxWidthOrHeight: 4096, useWebWorker: true, initialQuality: 0.85 });
        } catch { return file; }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/svg+xml', 'application/postscript', 'application/illustrator', 'application/pdf'].includes(file.type) && !file.name.toLowerCase().endsWith('.ai')) {
            toast.error('Only PNG/JPG/AI (max 10MB) allowed for logo');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { toast.error('Logo must be under 10MB'); return; }
        const loadingToast = toast.loading('Uploading logo...');
        setLogoUploading(true);
        try {
            const compressed = file.type.startsWith('image/') ? await compress(file, 9.5) : file;
            const r = await uploadToCloudinary(compressed, 'eswc_competition/eco_fair_logos');
            setForm(prev => ({ ...prev, logoUrl: r.url, logoPublicId: r.publicId }));
            toast.success('Logo uploaded', { id: loadingToast });
        } catch (err) {
            toast.error(err.message || 'Failed to upload logo', { id: loadingToast });
        } finally { setLogoUploading(false); }
    };

    const handleScreenshotUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png'].includes(file.type)) { toast.error('Only JPEG/PNG allowed for screenshot'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Payment screenshot must be under 5MB'); return; }
        const loadingToast = toast.loading('Uploading payment screenshot...');
        setScreenshotUploading(true);
        try {
            const compressed = await compress(file, 4.8);
            const r = await uploadToCloudinary(compressed, 'eswc_competition/eco_fair_payments');
            setForm(prev => ({ ...prev, paymentScreenshotUrl: r.url, paymentScreenshotPublicId: r.publicId }));
            toast.success('Screenshot uploaded', { id: loadingToast });
        } catch (err) {
            toast.error(err.message || 'Failed to upload screenshot', { id: loadingToast });
        } finally { setScreenshotUploading(false); }
    };

    const validate = () => {
        if (!form.brandName.trim()) { toast.error('Brand / Vendor Name is required'); return false; }
        if (!form.logoUrl) { toast.error('Brand logo upload is required'); return false; }
        if (!form.contactName.trim()) { toast.error('Primary contact person name is required'); return false; }
        if (!form.designation.trim()) { toast.error('Designation / Role is required'); return false; }
        if (!form.contactPhone.trim()) { toast.error('Contact phone number is required'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim().toLowerCase())) { toast.error('Active email address is required'); return false; }
        if (!form.secondaryName.trim()) { toast.error('Secondary representative name is required'); return false; }
        if (!form.secondaryPhone.trim()) { toast.error('Secondary representative phone is required'); return false; }
        if (form.additionalReps && !form.additionalRepsText.trim()) { toast.error('Please provide additional representative details'); return false; }
        if (!form.productCategories.length) { toast.error('Select at least one product category'); return false; }
        if (!form.productDescription.trim()) { toast.error('Product description is required'); return false; }
        if (form.productDescription.trim().split(/\s+/).length > 20) { toast.error('Description must be within 20 words'); return false; }
        if (!form.bkashTxId.trim()) { toast.error('Transaction ID is required'); return false; }
        if (!form.paymentSenderNumber.trim()) { toast.error('Sender bKash number is required'); return false; }
        if (!form.paymentScreenshotUrl) { toast.error('Payment screenshot is required'); return false; }
        for (const t of TERMS) { if (!form[t.key]) { toast.error('Please agree to all terms & conditions'); return false; } }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!validate()) return;
        setLoading(true);
        const toastId = toast.loading('Registering Stall...');
        try {
            const payload = {
                type: 'eco-fair-stall',
                teamName: form.brandName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.contactPhone.trim(),
                bkashTxId: form.bkashTxId.trim().toUpperCase(),
                paymentMethod: 'bkash',
                paymentSenderNumber: form.paymentSenderNumber.trim(),
                paymentScreenshot: form.paymentScreenshotUrl ? { url: form.paymentScreenshotUrl, publicId: form.paymentScreenshotPublicId } : undefined,
                details: {
                    brandName: form.brandName.trim(),
                    logoUrl: form.logoUrl,
                    logoPublicId: form.logoPublicId,
                    designation: form.designation.trim(),
                    primaryRep: { name: form.contactName.trim(), phone: form.contactPhone.trim() },
                    secondaryRep: { name: form.secondaryName.trim(), phone: form.secondaryPhone.trim() },
                    additionalReps: form.additionalReps ? form.additionalRepsText.trim() : '',
                    stallSize: form.stallSize,
                    productCategories: form.productCategories,
                    productDescription: form.productDescription.trim(),
                    terms: {
                        plasticBan: form.plasticBan,
                        advancePayment: form.advancePayment,
                        approvedMerch: form.approvedMerch,
                        setupSchedule: form.setupSchedule,
                        decorum: form.decorum
                    }
                }
            };

            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');
            toast.success('Stall Registered!', { id: toastId });
            setTimeout(() => router.push('/congratulations/eco-fair-stall'), 1500);
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
                    <Link href="/activities/eco-fair-stall" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-emerald-600" />
                    </Link>
                    <h1 className="text-lg font-bold text-emerald-700">Eco Fair Stall Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-emerald-600 text-emerald-50 pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-emerald-400/20 rounded-full blur-3xl"></div>
                <div className="max-w-2xl mx-auto text-center relative z-10">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-white" />
                    <h2 className="text-3xl font-bold mb-2 text-white">Register Your Stall</h2>
                    <p className="text-emerald-100/90 text-sm opacity-90">Eco Champions 4.0 • Sept 20–21, 2026 • AUST Campus. 100% advance bKash registration.</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Brand & Contact */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg"><Store className="w-5 h-5 text-emerald-600" /></div>
                            <h3 className="font-bold text-emerald-700 text-lg">Brand & Contact Information</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Vendor / Brand Name <span className="text-red-500">*</span></label>
                                <input name="brandName" value={form.brandName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Printed on banner" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Designation / Role <span className="text-red-500">*</span></label>
                                <input name="designation" value={form.designation} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Owner / Representative" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Primary Contact Person <span className="text-red-500">*</span></label>
                                <input name="contactName" value={form.contactName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Contact Phone <span className="text-red-500">*</span></label>
                                <input name="contactPhone" value={form.contactPhone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="01XXXXXXXXX" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Active Email Address <span className="text-red-500">*</span></label>
                                <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="you@domain.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-emerald-600" /> High-Resolution Brand Logo <span className="text-red-500">*</span>
                            </label>
                            <div onClick={() => logoInputRef.current?.click()} className={`w-full py-6 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 text-center ${form.logoUrl ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-500 bg-white'}`}>
                                {logoUploading ? (
                                    <><Loader2 className="w-5 h-5 text-emerald-600 animate-spin" /><span className="text-sm text-emerald-700 font-semibold">Uploading...</span></>
                                ) : form.logoUrl ? (
                                    <><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="font-semibold text-emerald-700 text-sm">Logo ready</span></>
                                ) : (
                                    <><Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-500">Tap to upload (PNG/JPG/AI, Max 10MB)</span></>
                                )}
                            </div>
                            <input ref={logoInputRef} type="file" className="hidden" accept="image/png,image/jpeg,image/svg+xml,.ai,application/postscript" onChange={handleLogoUpload} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Representatives */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg"><User className="w-5 h-5 text-emerald-600" /></div>
                            <h3 className="font-bold text-emerald-700 text-lg">Representative / Member Details</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Primary Representative (Member 1) <span className="text-red-500">*</span></label>
                                <input name="contactName" value={form.contactName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Primary Phone <span className="text-red-500">*</span></label>
                                <input name="contactPhone" value={form.contactPhone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="01XXXXXXXXX" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Secondary Representative (Member 2) <span className="text-red-500">*</span></label>
                                <input name="secondaryName" value={form.secondaryName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Secondary Phone <span className="text-red-500">*</span></label>
                                <input name="secondaryPhone" value={form.secondaryPhone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="01XXXXXXXXX" />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                            <input type="checkbox" name="additionalReps" checked={form.additionalReps} onChange={handleFormChange} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">Add Additional Representatives (Optional)</span>
                        </label>
                        {form.additionalReps && (
                            <textarea name="additionalRepsText" value={form.additionalRepsText} onChange={handleFormChange} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Name(s) and Phone Number(s)" />
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Stall & Products */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg"><ShoppingBag className="w-5 h-5 text-emerald-600" /></div>
                            <h3 className="font-bold text-emerald-700 text-lg">Stall Selection & Product Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Stall Size <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-3">
                                {['8x8', '16x8'].map(size => (
                                    <button type="button" key={size} onClick={() => setForm(prev => ({ ...prev, stallSize: size }))}
                                        className={`py-4 rounded-xl border-2 font-bold transition-all text-sm ${form.stallSize === size ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-300 text-gray-500'}`}>
                                        {size} Sq. Ft. Stall
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Declared Product Categories <span className="text-red-500">*</span></label>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <label key={cat} className={`flex items-start gap-2 cursor-pointer p-3 rounded-xl border transition-colors ${form.productCategories.includes(cat) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}>
                                        <input type="checkbox" checked={form.productCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                                        <span className="text-sm text-gray-600 font-medium">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Detailed Description (Max 20 words) <span className="text-red-500">*</span></label>
                            <textarea name="productDescription" value={form.productDescription} onChange={handleFormChange} rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Briefly describe your products/services" />
                            <p className="text-[10px] text-gray-400 mt-1">{form.productDescription.trim() ? form.productDescription.trim().split(/\s+/).length : 0}/20 words</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Payment */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-emerald-700 text-lg">Payment Details (bKash Only)</h3>
                        </div>

                        <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 flex items-start gap-4">
                            <Smartphone className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-yellow-900 border-b border-yellow-200/50 pb-2 mb-2">Send Money (bKash)</p>
                                <p className="font-medium text-yellow-800">100% advance registration fee — payable before submitting.</p>
                                <p className="font-medium text-yellow-800 mt-1">To official Merchant/Personal Number: <span className="font-bold select-all">01639802823</span></p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1.5 ml-1">Sender bKash Number <span className="text-red-500">*</span></label>
                                <input name="paymentSenderNumber" value={form.paymentSenderNumber} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="01XXXXXXXXX" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1.5 ml-1">bKash Transaction ID <span className="text-red-500">*</span></label>
                                <input name="bkashTxId" value={form.bkashTxId} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-mono uppercase" placeholder="TRX123456" />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-emerald-600" /> Payment Screenshot <span className="text-red-500">*</span>
                            </label>
                            <div onClick={() => screenshotInputRef.current?.click()} className={`w-full py-6 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 text-center ${form.paymentScreenshotUrl ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-500 bg-white'}`}>
                                {screenshotUploading ? (
                                    <><Loader2 className="w-5 h-5 text-emerald-600 animate-spin" /><span className="text-sm text-emerald-700 font-semibold">Uploading...</span></>
                                ) : form.paymentScreenshotUrl ? (
                                    <><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="font-semibold text-emerald-700 text-sm">Screenshot ready</span></>
                                ) : (
                                    <><Upload className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-500">Tap to upload (JPG/PNG, Max 5MB)</span></>
                                )}
                            </div>
                            <input ref={screenshotInputRef} type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleScreenshotUpload} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Terms */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-emerald-700 text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /> Terms & Conditions</h3>
                        {TERMS.map(t => (
                            <label key={t.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <input type="checkbox" name={t.key} checked={form[t.key]} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                                <span className="text-sm text-gray-600 font-medium">{t.label} <span className="text-red-500">*</span></span>
                            </label>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Stall Registration'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
