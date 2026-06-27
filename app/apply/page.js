"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-[2rem] shadow-xl max-w-lg w-full text-center"
            >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Applications Closed</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    The Batch Ambassador application period has ended.<br />
                    Thank you for your interest. Stay tuned for future opportunities!
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
