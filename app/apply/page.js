"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle, Briefcase, Upload, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function ApplyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        studentId: "",
        department: "CSE",
        semester: "1-1",
        section: "",
        role: "Junior Executive",
        experience: "",
        fbLink: "",
        isOtherClubExecutive: "No",
        teamPreferences: ["", "", ""],
        skillHelp: ""
    });

    const yearOptions = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2", "5-1", "5-2"];
    const labGroups = ["A-1", "A-2", "B-1", "B-2", "C-1", "C-2", "D-1", "D-2"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            
            if (name === 'department' && value !== 'EEE' && ['D-1', 'D-2'].includes(next.section)) {
                next.section = '';
            }
            return next;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be smaller than 5MB.');
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const uploadToCloudinary = async (file) => {
        const signRes = await fetch('/api/cloudinary/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder: 'eswc_applications' })
        });
        const { timestamp, signature, folder, apiKey, cloudName } = await signRes.json();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
        );
        const uploadData = await uploadRes.json();
        if (!uploadData.secure_url) throw new Error('Image upload failed');
        return uploadData.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = null;
            if (!imageFile) {
                toast.error("Please upload a photo.", { id: "img-upload" });
                setLoading(false);
                return;
            }
            if (imageFile) {
                setImageUploading(true);
                toast.loading('Uploading photo...', { id: 'img-upload' });
                try {
                    imageUrl = await uploadToCloudinary(imageFile);
                    toast.success('Photo uploaded!', { id: 'img-upload' });
                } catch (err) {
                    toast.error('Failed to upload photo. Please try again.', { id: 'img-upload' });
                    setLoading(false);
                    setImageUploading(false);
                    return;
                }
                setImageUploading(false);
            }

            const res = await fetch("/api/applications/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, teamPreferences: formData.teamPreferences.filter(t => t.trim() !== ""), imageUrl }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                toast.success(data.message || "Application submitted successfully!");
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#059669', '#10B981', '#34D399', '#A7F3D0'] // Emerald shades
                });
            } else {
                toast.error(data.message || "Failed to submit application.");
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 rounded-[2rem] shadow-xl max-w-lg w-full text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Application Received!</h2>
                    <p className="text-slate-600 mb-8">
                        Thank you for applying. Our team will review your application and get back to you soon.
                    </p>
                    <Link href="/">
                        <button className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                            Return Home <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <Toaster position="top-center" />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-emerald-700 tracking-tight mb-1">Apply Now</h1>
                    <p className="text-sm text-slate-500">Fill in the details to submit your application.</p>
                </div>

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="bg-white rounded-[2rem] shadow-xl overflow-hidden"
                >
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                                    <input 
                                        type="text" name="name" required
                                        value={formData.name} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                                    <input 
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                                    <input 
                                        type="tel" name="phone" required
                                        value={formData.phone} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Student ID *</label>
                                    <input 
                                        type="text" name="studentId" required
                                        value={formData.studentId} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="e.g. 21010XXXX"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
                                    <select 
                                        name="department" required
                                        value={formData.department} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="CSE">CSE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="CE">CE</option>
                                        <option value="ME">ME</option>
                                        <option value="IPE">IPE</option>
                                        <option value="TE">TE</option>
                                        <option value="Architecture">Architecture</option>
                                        <option value="BBA">BBA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Semester *</label>
                                    <select 
                                        name="semester" required
                                        value={formData.semester} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="">Select Semester</option>
                                        {yearOptions.map(opt => {
                                            return <option key={opt} value={opt}>{opt}</option>;
                                        })}
                                    </select>
                                </div>
                            </motion.div>

                            {formData.department !== 'BBA' && (
                                <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Lab Group / Section *</label>
                                    <select 
                                        name="section" required
                                        value={formData.section} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="">Select Lab Group</option>
                                        {labGroups.map(grp => {
                                            const isDisabled = ['D-1', 'D-2'].includes(grp) && formData.department !== 'EEE';
                                            if (isDisabled) return null;
                                            return <option key={grp} value={grp}>{grp}</option>;
                                        })}
                                    </select>
                                </motion.div>
                            )}

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Role Applying For *</label>
                                <select 
                                    name="role" required
                                    value={formData.role} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50 font-semibold"
                                >

                                    <option value="Junior Executive">Junior Executive</option>
                                    <option value="Sub Executive" disabled>Sub Executive (Closed)</option>
                                </select>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Facebook ID Link</label>
                                    <input 
                                        type="url" name="fbLink" required
                                        value={formData.fbLink} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="https://facebook.com/your.profile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Executive of Any Other Club?</label>
                                    <select 
                                        name="isOtherClubExecutive" required
                                        value={formData.isOtherClubExecutive} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                              <label className="block text-sm font-bold text-slate-700 mb-2">How will your skill help in your preferred team? *</label>
                                <textarea 
                                    name="skillHelp" required rows="4"
                                    value={formData.skillHelp} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Explain how your skills will be beneficial..."
                                ></textarea>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select 3 to 7 Teams (in order of preference) *</label>
                                <div>
                                    {formData.teamPreferences.map((pref, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <span className="font-bold py-3 text-slate-500">#{index + 1}</span>
                                            <select
                                                value={pref}
                                                onChange={(e) => {
                                                    const newPrefs = [...formData.teamPreferences];
                                                    newPrefs[index] = e.target.value;
                                                    setFormData({ ...formData, teamPreferences: newPrefs });
                                                }}
                                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                required={index < 3}
                                            >
                                                <option value="">-- Select Team --</option>
                                                {["Event Management", "Logistics", "Research & Development", "Public Relationship", "Content Writing", "Graphics", "Web Development"].filter(t => !formData.teamPreferences.includes(t) || t === pref).map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                            {index >= 3 && (
                                                <button
                                                    type="button"
                                                    className="text-red-500 font-bold px-2"
                                                    onClick={() => {
                                                        const newPrefs = [...formData.teamPreferences];
                                                        newPrefs.splice(index, 1);
                                                        setFormData({ ...formData, teamPreferences: newPrefs });
                                                    }}
                                                >
                                                    X
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {formData.teamPreferences.length < 7 && (
                                        <button
                                            type="button"
                                            className="text-sm text-emerald-600 font-bold mt-2"
                                            onClick={() => setFormData({ ...formData, teamPreferences: [...formData.teamPreferences, ""] })}
                                        >
                                            + Add Another Preference
                                        </button>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Previous Experience (Optional)</label>
                                <textarea 
                                    name="experience" rows="2"
                                    value={formData.experience} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Any previous experience in volunteering, clubs, etc."
                                ></textarea>
                            </motion.div>

                            {/* Photo Upload */}
                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Your Photo *</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {!imagePreview ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl py-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-emerald-600 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold">Click to upload a photo</p>
                                            <p className="text-xs">PNG, JPG, WEBP ΓÇö max 5MB</p>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                        <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 p-1.5 rounded-full shadow transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-4 py-3">
                                            <p className="text-white text-xs font-bold truncate flex items-center gap-1.5">
                                                <Upload className="w-3 h-3" /> {imageFile?.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <motion.button 
                                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                type="submit" 
                                disabled={loading || imageUploading}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {(loading || imageUploading) ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Application"}
                            </motion.button>

                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
