"use client";

import { motion } from "framer-motion";
import { Mic2, Calendar, Users, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ThreePitchDetails() {
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
                        <Mic2 className="w-10 h-10 text-[#1B4B43]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1B4B43] mb-4 relative z-10">Eco Pitch 180</h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto relative z-10 mb-8">
                        3-Minute Thesis competition on environmental innovations.
                    </p>
                    <div className="flex justify-center gap-4 relative z-10">
                        <a
                            href="https://drive.google.com/file/d/1MdMP0de98jlhLm1yWCA1n2xADBLyeZ1K/view?usp=drivesdk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1B4B43] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                            <FileText className="w-5 h-5" /> View Rulebook
                        </a>
                    </div>
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
                                    <p>Teams must consist of <strong>minimum 1 and maximum 3 members</strong>.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Participants must pitch their original environmental thesis or research idea in exactly <strong>3 minutes</strong>.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>An abstract of your research or thesis (PDF or DOC format) must be uploaded during registration.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Registration and initial proposal submission for Round 1 requires an entry fee of <strong>300 BDT</strong>.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2 shrink-0"></div>
                                    <p>Teams qualifying for the Final Pitch round will need to pay an additional fee.</p>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Sidebar info */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#B7E9FF]" /> Key Dates
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Registration Fee (Round 1)</p>
                                    <p className="font-bold text-xl">300 BDT</p>
                                </div>
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Team Size</p>
                                    <p className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> 1 - 3 Members</p>
                                </div>
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Proposal Deadline</p>
                                    <p className="font-bold">March 15, 2025</p>
                                </div>
                                <div>
                                    <p className="text-[#B7E9FF] text-sm">Final Pitch Event</p>
                                    <p className="font-bold">March 28, 2025</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/competetion/eco-pitch/register" className="block w-full">
                            <button className="w-full bg-[#B7E9FF] hover:bg-[#95DFFF] text-[#1B4B43] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-1 shadow-md">
                                Submit Proposal <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
