"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, ArrowRight, Camera, Zap, FileVideo, Mic2, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function CongratulationsPage({ params }) {
    // unwrap params using React.use() for Next 15+ 
    const resolvedParams = use(params);
    const type = resolvedParams.type;

    const getCompetitionDetails = (compType) => {
        switch (compType) {
            case "eco-capture":
                return {
                    title: "Eco Capture",
                    message: "Your portfolio of photographs and stories has been received.",
                    icon: Camera,
                    nextSteps: "Our judges will review your submissions. If selected for the final showcase, you will receive an email with payment instructions for Round 2.",
                    bgClass: "bg-[#F3F9F1]",
                    iconColor: "text-[#1B4B43]"
                };
            case "eco-buzzers":
                return {
                    title: "Eco Buzzers",
                    message: "Your team registration is complete and payment is pending verification.",
                    icon: Zap,
                    nextSteps: "We're verifying your bKash payment. You will receive a confirmation email shortly with the buzzer round schedule and rules.",
                    bgClass: "bg-[#E8F9FF]",
                    iconColor: "text-[#1B4B43]"
                };
            case "green-story":
                return {
                    title: "Green Story",
                    message: "Your team registration and video link have been submitted along with your payment.",
                    icon: FileVideo,
                    nextSteps: "Your payment of 700 TK is under verification. Once confirmed, your team's video will be reviewed by our panel. Keep an eye on your inbox!",
                    bgClass: "bg-[#F3F9F1]",
                    iconColor: "text-[#1B4B43]"
                };
            case "eco-pitch":
                return {
                    title: "Eco Pitch",
                    message: "Your research thesis PDF and payment have been submitted.",
                    icon: Mic2,
                    nextSteps: "Your payment is under verification. Our experts will review your thesis. If you make the cut for the live pitch, we will notify you via email with Round 2 payment instructions.",
                    bgClass: "bg-[#E8F9FF]",
                    iconColor: "text-[#1B4B43]"
                };
            default:
                return {
                    title: "Competition",
                    message: "Your registration was successful.",
                    icon: PartyPopper,
                    nextSteps: "You will receive an email confirmation shortly.",
                    bgClass: "bg-white",
                    iconColor: "text-[#1B4B43]"
                };
        }
    };

    const details = getCompetitionDetails(type);
    const Icon = details.icon;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans py-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full"
            >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">

                    {/* Top Banner Area */}
                    <div className="bg-[#1B4B43] px-8 pt-10 pb-16 text-center relative overflow-hidden">
                        {/* Background elements */}
                        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full mix-blend-overlay opacity-20 transform translate-x-1/2 -translate-y-1/2 ${details.bgClass}`}></div>
                        <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full mix-blend-overlay opacity-20 transform -translate-x-1/2 translate-y-1/2 ${details.bgClass}`}></div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10"
                        >
                            <PartyPopper className={`w-10 h-10 ${details.iconColor}`} />
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
                            Registration Successful!
                        </h1>
                        <p className="text-[#D9F2D6] font-medium relative z-10">
                            Welcome to the {details.title} competition
                        </p>
                    </div>

                    {/* Content Area */}
                    <div className="px-8 py-10 -mt-6 bg-white relative z-20 rounded-t-3xl text-center">

                        <div className="flex items-center justify-center gap-3 mb-6 bg-gray-50 py-3 px-4 rounded-xl border border-gray-100 inline-flex mx-auto">
                            <Icon className={`w-5 h-5 ${details.iconColor}`} />
                            <span className="text-gray-700 font-medium text-sm">{details.message}</span>
                        </div>

                        <div className="space-y-6 text-left max-w-sm mx-auto mb-10">
                            <div className="flex gap-4">
                                <div className="mt-1"><Mail className="w-5 h-5 text-gray-400" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Check your inbox</h4>
                                    <p className="text-sm text-gray-500 mt-1">We've sent a confirmation email to the address you provided.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1"><ShieldCheck className="w-5 h-5 text-[#1B4B43]" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Next Steps</h4>
                                    <p className="text-sm text-gray-500 mt-1">{details.nextSteps}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href={`/competetion/check-status`}>
                                <button className="w-full bg-white border-2 border-[#1B4B43] text-[#1B4B43] hover:bg-gray-50 px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm">
                                    Check Status Portal
                                </button>
                            </Link>
                            <Link href="/competetion">
                                <button className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                                    All Competitions <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
