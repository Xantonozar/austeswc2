"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Image as ImageIcon, Users, FileText, Zap, ArrowRight } from "lucide-react";

const competitions = [
  {
    slug: "poster-presentation",
    title: "Poster Presentation",
    description: "Save Environment / Save People / Save Society. Abstract PDF max 300 words, 10MB. Round 2: 499 BDT per team.",
    icon: ImageIcon,
    banner: "https://res.cloudinary.com/chirkut/image/upload/v1787581792/poster_presentaion_2_s4tsji.png",
    meta: ["Free R1", "1-3 Members", "300 words", "R2 499 BDT"],
  },
  {
    slug: "eco-frame",
    title: "Eco Frame",
    description: "Environmental Photography Contest. Submit 1–3 photos (JPEG/PNG), 149 BDT fee. Themes: Nature, Waste, Hope & more.",
    icon: ImageIcon,
    banner: "https://res.cloudinary.com/chirkut/image/upload/v1788013635/Segment_Announcement_Posts_eyslrh.svg",
    meta: ["149 BDT", "Individual", "Up to 3 Photos", "JPEG/PNG"],
  },
  {
    slug: "buzzer-battle",
    title: "Buzzer Battle",
    description: "Environmental Quiz Showdown. Rapid-fire quiz on ecology, climate & sustainability. Teams of 1–3 AUST students. 499 BDT fee.",
    icon: Zap,
    banner: "https://res.cloudinary.com/chirkut/image/upload/v1788183640/6102763479962948768_121_xarflx.jpg",
    meta: ["499 BDT", "1-3 Members", "AUST Only", "bKash/Nagad"],
  },
];

export default function CompetitionsPage() {
  return (
    <div className="w-full relative flex flex-col items-center justify-center font-sans pt-24 pb-20 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4 w-full max-w-3xl"
      >
        <span className="inline-flex items-center justify-center bg-[#D9F2D6] text-[#1B4B43] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6">
          Competitions
          <span className="flex w-2.5 h-2.5 bg-[#1B4B43] rounded-full ml-2 animate-pulse"></span>
        </span>
        <h1 className="text-[#1B4B43] text-4xl md:text-6xl font-bold mb-4">
          Open for Registration
        </h1>
        <p className="text-gray-600 max-w-[600px] mx-auto text-lg mb-12">
          Browse our environmental competitions and secure your spot today.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
          {competitions.map((c) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.slug}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100"
              >
                {c.banner ? (
                  <div className="bg-gray-50 flex justify-center p-2">
                    <img src={c.banner} alt={c.title} className="w-full h-auto max-h-[480px] object-contain rounded-xl" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F9FF] flex items-center justify-center m-6 mb-4">
                    <Icon className="w-7 h-7 text-[#1B4B43]" />
                  </div>
                )}
                <div className="p-6 pt-4">
                <h2 className="text-xl font-bold text-[#1B4B43] mb-2">{c.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{c.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {c.meta.map((m) => (
                    <span key={m} className="text-xs font-semibold bg-[#D9F2D6] text-[#1B4B43] px-3 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
                <Link href={`/competetion/${c.slug}`} className="block">
                  <button className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
