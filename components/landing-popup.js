"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';

export default function LandingPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if the popup has been shown in this session
        const hasSeenPopup = sessionStorage.getItem('hasSeenGreenovaPopup');
        if (!hasSeenPopup) {
            // Slight delay so the page loads first
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenGreenovaPopup', 'true');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-colors z-20 text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Top Banner Area with Logo */}
                        <div className="bg-[#1B4B43] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                            <Image
                                src="/greenova.png"
                                alt="Greenova"
                                width={200}
                                height={60}
                                className="relative z-10 object-contain drop-shadow-lg"
                            />
                        </div>

                        {/* Content Area */}
                        <div className="p-8 text-center space-y-4 bg-[#F3F9F1]">
                            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm text-[#1B4B43] mb-2">
                                <Camera className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-[#1B4B43]">Eco Capture is Live!</h2>
                            <p className="text-gray-600 font-medium pb-4">
                                Join our flagship photography contest. Showcase the beauty of nature and environmental awareness through your lens.
                            </p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Maybe Later
                                </button>
                                <Link
                                    href="/competetion/eco-capture"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-white bg-[#1B4B43] hover:bg-[#12332D] shadow-lg shadow-[#1B4B43]/30 transition-all flex items-center gap-2"
                                >
                                    Join Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
