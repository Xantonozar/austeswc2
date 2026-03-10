"use client";

import { motion } from "framer-motion";
import { FileVideo, Calendar, User, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GreenStoryDetails() {
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
                        <FileVideo className="w-10 h-10 text-[#1B4B43]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1B4B43] mb-4 relative z-10">Green Story</h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto relative z-10">
                        Ad-making contest focused on crafting compelling environmental narratives.
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
                                    <p>Participants must create a short advertisement video (30-90 seconds) promoting an eco-friendly product, habit, or awareness message.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Videos must be uploaded to Google Drive and the <strong>viewable link</strong> should be provided during registration.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Individual participation only. Plagiarized content will be disqualified.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Registration fee is <strong>100 BDT</strong>, payable via bKash during registration.</p>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Sidebar info */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#D9F2D6]" /> Event Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#D9F2D6] text-sm">Registration Fee</p>
                                    <p className="font-bold text-xl">100 BDT</p>
                                </div>
                                <div>
                                    <p className="text-[#D9F2D6] text-sm">Participation</p>
                                    <p className="font-bold flex items-center gap-2"><User className="w-4 h-4" /> Individual</p>
                                </div>
                                <div>
                                    <p className="text-[#D9F2D6] text-sm">Submission Deadline</p>
                                    <p className="font-bold">March 20, 2025</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200 shadow-none">
                                Registration Closed
                            </button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
