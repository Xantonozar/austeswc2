"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Camera, User, ArrowLeft, Loader2, Upload, CheckCircle2, FileText, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

export default function EcoCaptureRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        universityName: '',
        email: '',
        phone: '',
        agreeToTerms: false
    });

    // Added file property to store the actual compressed File object for direct upload later
    const [photos, setPhotos] = useState(Array(5).fill({ base64: '', file: null, story: '' }));
    const fileInputRefs = useRef([]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePhotoStoryChange = (index, value) => {
        const newPhotos = [...photos];
        newPhotos[index] = { ...newPhotos[index], story: value };
        setPhotos(newPhotos);
    };

    const handleImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            return;
        }

        const loadingToast = toast.loading('Compressing image (this may take a moment)...');

        try {
            // Compress the image preserving very high quality but significantly reducing size
            const options = {
                maxSizeMB: 9.5, // Just under the 10MB Cloudinary limit
                maxWidthOrHeight: 4096, // Very high resolution 4K
                useWebWorker: true,
                initialQuality: 0.85
            };

            const compressedFile = await imageCompression(file, options);
            console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

            // Read as base64 purely for frontend preview
            const reader = new FileReader();
            reader.onload = (ev) => {
                const newPhotos = [...photos];
                newPhotos[index] = {
                    ...newPhotos[index],
                    base64: ev.target.result,
                    file: compressedFile // Store the compressed file for direct upload
                };
                setPhotos(newPhotos);
                toast.success(`Image ${index + 1} attached and optimized`, { id: loadingToast });
            };
            reader.readAsDataURL(compressedFile);

        } catch (error) {
            console.error("Compression error:", error);
            toast.error('Failed to process image', { id: loadingToast });
        }
    };

    const validate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            toast.error('Please fill all personal details');
            return false;
        }
        if (!form.universityName.trim()) {
            toast.error('University Name is required');
            return false;
        }
        for (let i = 0; i < 5; i++) {
            if (!photos[i].base64) {
                toast.error(`Please upload Photo ${i + 1}`);
                return false;
            }
            if (!photos[i].story.trim()) {
                toast.error(`Please provide a story for Photo ${i + 1}`);
                return false;
            }
        }
        if (!form.agreeToTerms) {
            toast.error('Please agree to the terms');
            return false;
        }
        return true;
    };

    const isRegistrationOpen = false; // Registration is closed

    if (!isRegistrationOpen) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Camera className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1B4B43] mb-4">Registration Closed</h1>
                    <p className="text-gray-600 mb-8">
                        The registration period for <strong>Eco Capture</strong> has ended. We are no longer accepting new submissions.
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
        if (!validate()) return;

        setLoading(true);
        const toastId = toast.loading('Preparing upload...');

        try {
            // STEP 1: Get Cloudinary upload signature
            const signRes = await fetch('/api/cloudinary/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'eswc_competition_photos' })
            });
            const signData = await signRes.json();

            if (!signRes.ok) throw new Error('Failed to secure upload signature');

            toast.loading('Uploading heavy photos to secure storage...', { id: toastId });

            // STEP 2: Upload all photos directly to Cloudinary
            const uploadedPhotos = [];
            const uploadPromises = photos.map(async (photo, idx) => {
                const formData = new FormData();
                formData.append('file', photo.file);
                formData.append('api_key', signData.apiKey);
                formData.append('timestamp', signData.timestamp);
                formData.append('signature', signData.signature);
                formData.append('folder', signData.folder);

                const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.error?.message || `Failed to upload photo ${idx + 1}`);

                return {
                    url: uploadData.secure_url,
                    publicId: uploadData.public_id,
                    story: photo.story
                };
            });

            const uploadedResults = await Promise.all(uploadPromises);

            toast.loading('Finalizing registration...', { id: toastId });

            // STEP 3: Submit the form data with the new Cloudinary URLs instead of heavy Base64
            const payload = {
                type: 'eco-capture',
                name: form.name.trim(),
                universityName: form.universityName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                photosReady: uploadedResults // Use a new key to distinguish from photosBase64
            };

            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');

            toast.success('Registration Successful!', { id: toastId });
            setTimeout(() => router.push('/congratulations/eco-capture'), 1500);

        } catch (err) {
            toast.error(err.message || 'Something went wrong', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans">
            <Toaster position="top-center" />

            {/* Header Nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/competetion/eco-capture" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Eco Capture Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Club Theme Header Box */}
            <div className="bg-[#1B4B43] text-[#F3F9F1] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#F3F9F1]/10 rounded-full blur-3xl"></div>
                <div className="w-64 h-64 absolute -bottom-20 -right-20 border-[8px] border-[#F3F9F1]/10 rounded-full"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Submit Your Portfolio</h2>
                    <p className="text-[#D9F2D6] text-sm opacity-90 max-w-md mx-auto">
                        Provide your details and upload exactly 5 photos with their stories. Round 1 is free.
                    </p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-3xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><User className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Personal Info</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                                <input name="name" value={form.name} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent outline-none transition-all" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Phone Number</label>
                                <input name="phone" value={form.phone} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent outline-none transition-all" placeholder="01XXXXXXXXX" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                                <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent outline-none transition-all" placeholder="you@domain.com" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-gray-500" />
                                    University Name
                                </label>
                                <input name="universityName" value={form.universityName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent outline-none transition-all" placeholder="e.g. Ahsanullah University of Science and Technology" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Photos */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#F3F9F1] rounded-lg"><Camera className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Photographs & Stories</h3>
                        </div>

                        {photos.map((photo, index) => (
                            <div key={index} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 flex flex-col md:flex-row gap-6 hover:border-[#D9F2D6] transition-colors">
                                {/* Upload Box */}
                                <div className="w-full md:w-1/3 shrink-0">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Photo {index + 1}</label>
                                    <div onClick={() => fileInputRefs.current[index]?.click()} className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${photo.base64 ? 'border-[#1B4B43] bg-[#F3F9F1]' : 'border-gray-300 hover:border-[#1B4B43] bg-white'}`}>
                                        {photo.base64 ? (
                                            <div className="relative w-full h-full p-2">
                                                <img src={photo.base64} className="w-full h-full object-cover rounded-lg shadow-sm" alt={`Upload ${index + 1}`} />
                                                <div className="absolute top-4 right-4 bg-[#1B4B43] p-1.5 rounded-full shadow-md"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                                            </div>
                                        ) : (
                                            <div className="text-center p-4">
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <span className="text-xs text-gray-500 font-medium">Tap to upload</span>
                                            </div>
                                        )}
                                    </div>
                                    <input ref={el => fileInputRefs.current[index] = el} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                </div>

                                {/* Story Box */}
                                <div className="w-full md:w-2/3 flex flex-col">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                        <FileText className="w-4 h-4 text-[#1B4B43]/70" /> Story behind Photo {index + 1}
                                    </label>
                                    <textarea
                                        value={photo.story}
                                        onChange={(e) => handlePhotoStoryChange(index, e.target.value)}
                                        className="w-full h-full min-h-[120px] bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent outline-none resize-none text-sm leading-relaxed transition-all"
                                        placeholder="Describe the environmental significance of this photograph..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer p-3 -mx-3 rounded-lg hover:bg-gray-50 mb-6 transition-colors">
                            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">I confirm these photos are my original work and agree to the competition rules.</span>
                        </label>

                        <button type="submit" disabled={loading} className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#D9F2D6] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Portfolio'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
