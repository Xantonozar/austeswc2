"use client";

import { motion } from "framer-motion";
import { Zap, Calendar, Users, FileText, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function EcoBuzzersDetails() {
    const rulebookUrl = "https://drive.google.com/file/d/1bWe7r0FEO5JD2lxlb9zdqdqL1I14_5SY/view?fbclid=IwZXh0bgNhZW0DMTAwAHNydGMGYXBwX2lkDzI3NTI1NDY5MjU5ODI3OQABHosuEzfomwNyGfSiatOt4zbNxe5QReimms-rVBM0Bd-1knn9QKfvR0WB6JLh_aem_4Q0kPkQJODh0jzCrvsX36Q";

    return (
        <div className="min-h-screen pt-24 pb-16 bg-white font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#E8F9FF] rounded-3xl p-8 md:p-12 text-center mb-8 relative overflow-hidden"
                >
                    <div className="w-96 h-96 absolute -bottom-20 -right-20 rounded-full border-[16px] border-white/40 bg-white/20 z-0"></div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                        <Zap className="w-10 h-10 text-[#1B4B43]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1B4B43] mb-4 relative z-10">Green Buzzer Battle</h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto relative z-10">
                        Team-based fast-paced environmental quiz competition.
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
                                    <p>Teams must consist of <strong>minimum 1 and maximum 2 members</strong>. Each member must provide their university name.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>The competition includes multiple rounds: Written Screening and On-stage Buzzer rounds.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Topics cover Global Warming, Local Environmental Policies, Sustainability, and Ecology.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Registration fee is <strong>700 BDT per team</strong>, payable via bKash during registration.</p>
                                </li>
                                {/* New Rulebook List Item */}
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>
                                        Detailed instructions can be found in the 
                                        <a 
                                            href={rulebookUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-[#1B4B43] font-bold underline ml-1 hover:text-[#266359] inline-flex items-center gap-1"
                                        >
                                            Official Rulebook <ExternalLink className="w-3 h-3" />
                                        </a>.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Sidebar info */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#B7E9FF]" /> Event Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Registration Fee</p>
                                    <p className="font-bold text-xl">720 BDT</p>
                                </div>
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Team Size</p>
                                    <p className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> 1 - 2 Members</p>
                                </div>
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Event Date</p>
                                    <p className="font-bold">April 5, 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <Link 
                                href="/competetion/eco-buzzers/register" 
                                className="w-full bg-[#1B4B43] hover:bg-[#266359] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                            >
                                Register Now <ArrowRight className="w-5 h-5" />
                            </Link>

                            {/* New Rulebook Sidebar Button */}
                            <a 
                                href={rulebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-white border-2 border-[#1B4B43] text-[#1B4B43] hover:bg-gray-50 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-sm"
                            >
                                <FileText className="w-5 h-5" /> View Rulebook
                            </a>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}