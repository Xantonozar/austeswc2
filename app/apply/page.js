"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function ApplyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        studentId: "",
        department: "CSE",
        semester: "1-1",
        section: "",
        role: "Batch Ambassador",
        motivation: "",
        experience: "",
        fbLink: "",
        isOtherClubAmbassador: "No",
        convinceStrategy: ""
    });

    const yearOptions = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2", "5-1", "5-2"];
    const labGroups = ["A-1", "A-2", "B-1", "B-2", "C-1", "C-2", "D-1", "D-2"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'department' && value !== 'Architecture' && ['5-1', '5-2'].includes(next.semester)) {
                next.semester = '1-1';
            }
            if (name === 'department' && value !== 'EEE' && ['D-1', 'D-2'].includes(next.section)) {
                next.section = '';
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/applications/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
                                            const isDisabled = ['5-1', '5-2'].includes(opt) && formData.department !== 'Architecture';
                                            if (isDisabled) return null;
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
                                    <option value="Batch Ambassador">Batch Ambassador</option>
                                    <option value="Junior Executive" disabled>Junior Executive (Closed)</option>
                                    <option value="Sub Executive" disabled>Sub Executive (Closed)</option>
                                </select>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Why do you want to apply? *</label>
                                <textarea 
                                    name="motivation" required rows="4"
                                    value={formData.motivation} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Tell us about your motivation..."
                                ></textarea>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Facebook ID Link *</label>
                                    <input 
                                        type="url" name="fbLink" required
                                        value={formData.fbLink} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="https://facebook.com/your.profile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ambassador of Any Other Club?</label>
                                    <select 
                                        name="isOtherClubAmbassador" required
                                        value={formData.isOtherClubAmbassador} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">How will you convince others to join? *</label>
                                <textarea 
                                    name="convinceStrategy" required rows="3"
                                    value={formData.convinceStrategy} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Explain your strategy to convince others..."
                                ></textarea>
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

                            <motion.button 
                                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Application"}
                            </motion.button>

                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
