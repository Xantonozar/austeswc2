import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bell, Calendar, Star, Pin, MessageCircle, Heart, Award, Zap } from 'lucide-react';

const July = () => {
  // Floating icons data
  const floatingIcons = [
    { icon: Bell, delay: 0, x: 10, y: -20 },
    { icon: Calendar, delay: 0.5, x: -15, y: 15 },
    { icon: Star, delay: 1, x: 20, y: -10 },
    { icon: MessageCircle, delay: 1.5, x: -25, y: -15 },
    { icon: Heart, delay: 2, x: 15, y: 25 },
    { icon: Award, delay: 2.5, x: -20, y: 10 },
    { icon: Zap, delay: 3, x: 30, y: -5 },
  ];

     return (
          <div className="relative w-full p-8 md:p-16">
       {/* Main Announcement Board Container */}
       <motion.div 
         className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl shadow-2xl border-8 border-emerald-800 overflow-hidden max-w-7xl mx-auto"
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.8 }}
       >
         {/* Corkboard Texture Overlay */}
         <div 
           className="absolute inset-0 opacity-30"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='cork' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='1' fill='%2310b981' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23cork)'/%3E%3C/svg%3E")`
           }}
         ></div>
        
                 {/* Corner Pins */}
         <div className="absolute top-2 md:top-4 left-2 md:left-4 w-4 h-4 md:w-6 md:h-6 bg-emerald-500 rounded-full shadow-lg border-2 border-emerald-700 z-10"></div>
         <div className="absolute top-2 md:top-4 right-2 md:right-4 w-4 h-4 md:w-6 md:h-6 bg-emerald-500 rounded-full shadow-lg border-2 border-emerald-700 z-10"></div>
         <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 w-4 h-4 md:w-6 md:h-6 bg-emerald-500 rounded-full shadow-lg border-2 border-emerald-700 z-10"></div>
         <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 w-4 h-4 md:w-6 md:h-6 bg-emerald-500 rounded-full shadow-lg border-2 border-emerald-700 z-10"></div>
         
         {/* Additional Decorative Pins */}
         <div className="absolute top-1/4 left-4 md:left-8 w-3 h-3 md:w-4 md:h-4 bg-teal-500 rounded-full shadow-md border border-teal-700 z-10"></div>
         <div className="absolute top-1/3 right-6 md:right-12 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full shadow-md border border-green-700 z-10"></div>
         <div className="absolute bottom-1/3 left-6 md:left-12 w-3 h-3 md:w-4 md:h-4 bg-lime-500 rounded-full shadow-md border border-lime-700 z-10"></div>
         <div className="absolute bottom-1/4 right-4 md:right-8 w-3 h-3 md:w-4 md:h-4 bg-emerald-600 rounded-full shadow-md border border-emerald-800 z-10"></div>

        {/* Floating Icons */}
    

                 {/* Announcement Header */}
         <motion.div 
           className="relative z-10 text-center pt-4 md:pt-6 pb-2 md:pb-4"
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.3 }}
         >
           <div className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 md:px-6 py-1 md:py-2 rounded-full shadow-lg border-2 border-emerald-700">
             <h2 className="text-sm md:text-xl font-bold tracking-wide">🌱 Upcoming Event 🌱</h2>
           </div>
         </motion.div>

                 {/* July Image Container */}
         <motion.div 
           className="relative z-10 px-4 md:px-8 pb-4 md:pb-8"
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.5 }}
         >
           <div className="relative bg-white rounded-xl shadow-xl border-4 border-emerald-600 overflow-hidden">
             {/* Image Pins */}
             <div className="absolute top-1 md:top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-5 md:h-5 bg-emerald-500 rounded-full shadow-md border border-emerald-700 z-20"></div>
             <div className="absolute top-1 md:top-2 left-2 md:left-4 w-2 h-2 md:w-4 md:h-4 bg-teal-500 rounded-full shadow-md border border-teal-700 z-20"></div>
             <div className="absolute top-1 md:top-2 right-2 md:right-4 w-2 h-2 md:w-4 md:h-4 bg-green-500 rounded-full shadow-md border border-green-700 z-20"></div>
            
            <Image
              src="/bannerEcoChampion.svg"
              alt="July Landscape"
              layout="responsive"
              width={1920}
              height={1080}
              priority
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        </motion.div>

                 {/* Decorative Border Elements */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400"></div>
         <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400"></div>
         
         {/* Corner Decorations */}
         <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-emerald-600 rounded-tl-lg"></div>
         <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-emerald-600 rounded-tr-lg"></div>
         <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-emerald-600 rounded-bl-lg"></div>
         <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-emerald-600 rounded-br-lg"></div>

               {/* Floating Paper Notes */}
         <motion.div 
           className="hidden md:block absolute top-1/4 right-2 md:right-4 w-12 h-16 md:w-16 md:h-20 bg-emerald-100 border-2 border-emerald-300 rounded shadow-lg transform rotate-12 z-10"
           animate={{ 
             rotate: [12, -12, 12],
             y: [0, -5, 0]
           }}
           transition={{ 
             duration: 3, 
             repeat: Infinity,
             ease: "easeInOut"
           }}
         >
           <div className="p-1 text-xs text-emerald-800 font-bold text-center">SUSTAIN!</div>
         </motion.div>

         <motion.div 
           className="hidden md:block absolute bottom-1/4 left-2 md:left-4 w-12 h-16 md:w-16 md:h-20 bg-green-100 border-2 border-green-300 rounded shadow-lg transform -rotate-12 z-10"
           animate={{ 
             rotate: [-12, 12, -12],
             y: [0, -3, 0]
           }}
           transition={{ 
             duration: 4, 
             repeat: Infinity,
             ease: "easeInOut"
           }}
         >
           <div className="p-1 text-xs text-green-800 font-bold text-center">ECO!</div>
         </motion.div>
    </div>
  );
};

export default July;