"use client";

import { motion } from "framer-motion";
import { Camera, Zap, FileVideo, Mic2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const competitions = [
  {
    id: "eco-capture",
    title: "Eco Capture",
    subtitle: "Photography Contest",
    icon: Camera,
    bgClass: "bg-[#F3F9F1]",
    btnClass: "bg-[#D9F2D6] hover:bg-[#C5E8C1] text-[#1B4B43]",
    description: "Capture the essence of nature and environmental impact in 5 stunning photographs along with their stories.",
    delay: 0.1,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isOpen: true
  },
  {
    // Logic/Path remains eco-buzzers, but front-end title is changed
    id: "eco-buzzers", 
    title: "Green Buzzer Battle",
    subtitle: "Buzzer Quiz Competition",
    icon: Zap,
    bgClass: "bg-[#E8F9FF]",
    btnClass: "bg-[#B7E9FF] hover:bg-[#95DFFF] text-[#1B4B43]",
    description: "Test your environmental knowledge in this fast-paced, team-based buzzer competition.",
    delay: 0.2,
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isOpen: true
  },
  {
    id: "green-story",
    title: "Green Story",
    subtitle: "Ad Making Contest",
    icon: FileVideo,
    bgClass: "bg-[#F3F9F1]",
    btnClass: "bg-[#D9F2D6] hover:bg-[#C5E8C1] text-[#1B4B43]",
    description: "Create a compelling video advertisement that promotes sustainability and green living.",
    delay: 0.3,
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isOpen: true
  },
  {
    id: "eco-pitch",
    title: "Eco Pitch 180",
    subtitle: "3-Minute Thesis",
    icon: Mic2,
    bgClass: "bg-[#E8F9FF]",
    btnClass: "bg-[#B7E9FF] hover:bg-[#95DFFF] text-[#1B4B43]",
    description: "Pitch your innovative environmental research or thesis in just 3 minutes to our panel of judges. Registration fee: 300 BDT.",
    delay: 0.4,
    image: "https://images.unsplash.com/photo-1475721025582-eb06b251ce72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isOpen: true
  },
];

export default function CompetitionsPage() {
  return (
    <div className="w-full relative flex flex-col font-sans pt-24 pb-20">
      <div className="w-full relative flex flex-col items-center justify-start md:justify-center">

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <span className="flex items-center justify-center bg-[#D9F2D6] text-[#1B4B43] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              Live Competitions
              <span className="flex w-2.5 h-2.5 bg-[#1B4B43] rounded-full ml-2 animate-pulse"></span>
            </span>
          </div>

          <h1 className="text-[#1B4B43] text-4xl md:text-5xl font-bold mb-4">Showcase Your Eco-Talent</h1>
          <p className="text-gray-600 max-w-[600px] mx-auto text-lg">
            Join our flagship environmental competitions. Whether you're a photographer,
            researcher, or creative thinker, there's a platform for you to shine.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto px-4 md:px-8">
          {competitions.map((comp) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: comp.delay }}
              className="flex w-full"
            >
              <div className={`w-full ${comp.bgClass} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col border border-gray-100`}>

                {/* Image Header */}
                <div className="w-full h-48 relative overflow-hidden bg-gray-200">
                  <Image
                    src={comp.image}
                    alt={comp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  {/* Icon floating on image */}
                  <div className="absolute bottom-4 left-6 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md shadow-black/10 transform -rotate-3 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-300">
                    <comp.icon className="w-6 h-6 text-[#1B4B43]" />
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-8 md:p-10 flex-1 flex flex-col relative z-10">
                  {/* Decorative faint circle */}
                  <div className="w-64 h-64 absolute -bottom-20 -right-20 rounded-full border-[12px] opacity-20 border-white mix-blend-overlay group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>

                  <h3 className="text-[#1B4B43] text-2xl font-bold mb-1">
                    {comp.title}
                  </h3>
                  <p className="text-[#1B4B43]/70 font-bold uppercase tracking-wider text-xs mb-4">
                    {comp.subtitle}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-8 flex-1">
                    {comp.description}
                  </p>

                  <div className="mt-auto">
                    {comp.isOpen ? (
                      <Link href={`/competetion/${comp.id}`}>
                        <button className={`${comp.btnClass} w-full md:w-auto px-6 py-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 group-hover:-translate-y-1 transform duration-300 shadow-sm hover:shadow`}>
                          View Details & Register <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    ) : (
                      <div className="w-full md:w-auto px-6 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
                        Registration Closed
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
