"use client";

import { motion } from "framer-motion";

export default function CompetitionsPage() {
  return (
    <div className="w-full relative flex flex-col items-center justify-center font-sans pt-24 pb-20 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4"
      >
        <span className="inline-flex items-center justify-center bg-[#D9F2D6] text-[#1B4B43] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6">
          Competitions
          <span className="flex w-2.5 h-2.5 bg-[#1B4B43] rounded-full ml-2 animate-pulse"></span>
        </span>
        <h1 className="text-[#1B4B43] text-4xl md:text-6xl font-bold mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-600 max-w-[600px] mx-auto text-lg">
          Our exciting environmental competitions are being prepared. Stay
          tuned — something amazing is on the way!
        </p>
      </motion.div>
    </div>
  );
}
