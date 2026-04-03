"use client";

import { motion } from "framer-motion";
import { Camera, Calendar, Trophy, FileText, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function EcoCaptureDetails() {
    // Standard Google Drive viewer link - opens in preview mode
    const rulebookUrl = "https://drive.google.com/file/d/12HqONq4LjPMm-_Sk5FTzrQCFPVKy8fdZ/view?usp=sharing";

    return (
        <div className="min-h-screen pt-24 pb-16 bg-white font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#F3F9F1] rounded-3xl p-8 md:p-12 text-center mb-8 relative overflow-hidden"
                >
                    <div className="w-96 h-96 absolute -bottom-20 -right-20 rounded-full border-[16px] border-white/40 bg-white/20 z-0"></div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                        <Camera className="w-10 h-10 text-[#1B4B43]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1B4B43] mb-4 relative z-10">Eco Capture</h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto relative z-10">
                        Photography Contest focusing on environmental awareness and action.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-8">
                        {/* Details */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#1B4B43]/70" /> Competition Rules
                            </h2>
                            <ul className="space-y-4 text-gray-600 leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Participants must submit exactly <strong>5 photographs</strong> related to environmental themes (e.g., pollution, conservation, nature's beauty).</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Each photograph must be accompanied by a short <strong>story or description</strong> explaining its significance.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Photos must be original and taken by the participant. Plagiarism will lead to immediate disqualification.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Initial registration and submission for Round 1 is <strong>Free</strong>.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>If selected for Round 2, a participation fee of <strong>300 BDT per selected photo</strong> will apply to cover printing and display costs.</p>
                                </li>
                                {/* Rulebook Link Item */}
                                <li className="flex items-start gap-3 pt-2">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <a 
                                        href={rulebookUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#1B4B43] font-semibold flex items-center gap-1 hover:underline underline-offset-4"
                                    >
                                        View the full Rulebook <ExternalLink className="w-4 h-4" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Sidebar info */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#D9F2D6]" /> Key Dates
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#D9F2D6] text-sm">Registration Deadline</p>
                                    <p className="font-bold">March 15, 2025</p>
                                </div>
                                <div>
                                    <p className="text-[#D9F2D6] text-sm">Round 1 Result</p>
                                    <p className="font-bold">March 25, 2025</p>
                                </div>
                                <div>
                                    <p className="text-[#D9F2D6] text-sm">Final Exhibition</p>
                                    <p className="font-bold">April 5, 2025</p>
                                </div>
                            </div>
                            
                            {/* Rulebook Button in Sidebar */}
                            <hr className="my-6 border-white/20" />
                            <a 
                                href={rulebookUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-xl border border-white/10"
                            >
                                <ExternalLink className="w-4 h-4 text-[#D9F2D6]" /> View Rulebook (PDF)
                            </a>
                        </div>

                        <Link href="/competetion/eco-capture/register" className="w-full">
                            <button className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#D9F2D6] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]">
                                Register Now <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
