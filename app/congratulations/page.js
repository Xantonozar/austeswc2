'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SparklesCore } from '@/components/ui/sparkles';
import { ArrowLeft, Leaf, Check, ArrowRight } from 'lucide-react';

export default function CongratulationsPage() {
  const [mounted, setMounted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Hide animation after 5 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 5000);

    // Hide celebration animation after 4 seconds
    const celebrationTimer = setTimeout(() => {
      setShowCelebration(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(celebrationTimer);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.6,
      },
    },
  };

  const benefits = [
    'Access to exclusive environmental workshops and seminars',
    'Networking opportunities with like-minded individuals',
    'Participate in campus sustainability initiatives',
    'Develop leadership skills through club activities',
    'Make a positive impact on our environment',
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-white overflow-hidden relative">
      {/* Animated background sparkles */}
      <div className="w-full h-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={70}
          className="w-full h-full"
          particleColor="#15803d"
          speed={0.5}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          className="max-w-xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success icon */}
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            variants={iconVariants}
          >
            <Check className="text-white w-8 h-8 md:w-10 md:h-10" />
          </motion.div>

          {/* Heading */}
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-green-800 mb-3"
            variants={itemVariants}
          >
            Congratulations!
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-lg md:text-xl text-green-700 mb-6"
            variants={itemVariants}
          >
            Your application has been successfully submitted.
          </motion.p>

          {/* Card with benefits */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-5 md:p-8 mb-6"
            variants={itemVariants}
          >
            <h2 className="text-lg md:text-xl font-semibold text-green-700 mb-4 flex items-center">
              <Leaf className="mr-2 h-5 w-5" />
              Your ESWC Membership Benefits
            </h2>

            <ul className="space-y-3 text-left">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <span className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </span>
                  <span className="text-gray-700">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Next steps */}
          <motion.p 
            className="text-sm md:text-base text-green-700 mb-6 px-2"
            variants={itemVariants}
          >
            We'll review your application and get back to you soon. Meanwhile, explore our website to learn more about our activities.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-row gap-3 md:gap-4 justify-center items-center px-2"
          >
            <Link href="/join">
              <motion.button
                className="bg-green-600 text-white px-4 py-3 md:px-6 md:py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors duration-300 text-sm md:text-base font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                <span>Go Back</span>
              </motion.button>
            </Link>
            
            <Link href="/">
              <motion.button
                className="bg-green-600 text-white px-4 py-3 md:px-6 md:py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors duration-300 text-sm md:text-base font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Home</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated plant illustration */}
        <motion.div
          className="absolute bottom-0 left-0 w-40 md:w-64 opacity-70"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          transition={{ delay: 1, duration: 1, type: 'spring' }}
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40,160 Q60,110 30,70 Q0,30 40,10 Q80,-10 100,30 Q120,70 100,110 Q80,150 100,180 Q120,210 160,190 Q200,170 180,130 Q160,90 120,110 Q80,130 100,170 Q120,210 160,190" stroke="#15803d" strokeWidth="4" fill="none" />
            <path d="M100,180 L100,200" stroke="#15803d" strokeWidth="6" />
            <circle cx="40" cy="10" r="5" fill="#15803d" />
            <circle cx="30" cy="70" r="5" fill="#15803d" />
            <circle cx="100" cy="30" r="5" fill="#15803d" />
            <circle cx="100" cy="110" r="5" fill="#15803d" />
            <circle cx="160" cy="190" r="5" fill="#15803d" />
            <circle cx="180" cy="130" r="5" fill="#15803d" />
            <circle cx="120" cy="110" r="5" fill="#15803d" />
          </svg>
        </motion.div>

        {/* Animated leaf illustration */}
        <motion.div
          className="absolute top-20 right-10 w-20 md:w-32 opacity-70"
          initial={{ rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 0.7 }}
          transition={{ delay: 1.2, duration: 1, type: 'spring' }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,10 Q80,30 90,60 Q100,90 70,90 Q40,90 20,60 Q0,30 30,10 Q60,-10 50,10 Z" fill="#15803d" opacity="0.6" />
            <path d="M50,10 Q50,50 50,90" stroke="#15803d" strokeWidth="2" />
            <path d="M30,30 Q50,50 70,30" stroke="#15803d" strokeWidth="2" />
            <path d="M20,50 Q50,60 80,50" stroke="#15803d" strokeWidth="2" />
            <path d="M30,70 Q50,70 70,70" stroke="#15803d" strokeWidth="2" />
          </svg>
        </motion.div>
      </div>

      {/* Congratulations Animation Overlay */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Falling colorful confetti papers */}
            {[...Array(80)].map((_, i) => {
              const colors = ['#10b981', '#059669', '#047857', '#fbbf24', '#f59e0b', '#d97706', '#ef4444', '#dc2626', '#7c3aed', '#6366f1', '#3b82f6', '#06b6d4'];
              const shapes = ['w-2 h-2', 'w-3 h-1', 'w-1 h-3', 'w-2 h-3', 'w-3 h-2'];
              const selectedColor = colors[Math.floor(Math.random() * colors.length)];
              const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
              const isCircle = Math.random() > 0.7;
              
              // Generate random path points for smoother, more natural movement
              const pathPoints = [];
              const startX = Math.random() * 100;
              let currentX = startX;
              
              for (let j = 0; j <= 20; j++) {
                const y = j * 50; // 50px intervals
                currentX += (Math.random() - 0.5) * 30; // Random X movement
                pathPoints.push({ x: currentX, y });
              }
              
              return (
                <motion.div
                  key={i}
                  className={`absolute ${selectedShape} ${isCircle ? 'rounded-full' : 'rounded-sm'} shadow-sm`}
                  style={{
                    left: `${startX}%`,
                    backgroundColor: selectedColor,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  initial={{ 
                    y: -20, 
                    x: 0, 
                    rotate: Math.random() * 360,
                    opacity: 0 
                  }}
                  animate={{
                    y: pathPoints.map(p => p.y),
                    x: pathPoints.map(p => p.x - startX),
                    rotate: Array.from({ length: 21 }, (_, j) => j * 45 + Math.random() * 90),
                    opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 1.5,
                    delay: i * 0.02,
                    ease: "easeInOut",
                    times: Array.from({ length: 21 }, (_, j) => j / 20)
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Papers Animation Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Celebration papers falling from top */}
            {[...Array(60)].map((_, i) => {
              const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'];
              const shapes = ['w-3 h-4', 'w-4 h-3', 'w-3 h-3', 'w-4 h-4', 'w-2 h-5', 'w-5 h-2'];
              const selectedColor = colors[Math.floor(Math.random() * colors.length)];
              const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
              const isCircle = Math.random() > 0.8;
              
              // Generate celebration path with more dramatic movement
              const pathPoints = [];
              const startX = Math.random() * 100;
              let currentX = startX;
              
              for (let j = 0; j <= 15; j++) {
                const y = j * 60; // 60px intervals for faster fall
                currentX += (Math.random() - 0.5) * 40; // More dramatic X movement
                pathPoints.push({ x: currentX, y });
              }
              
              return (
                <motion.div
                  key={`celebration-${i}`}
                  className={`absolute ${selectedShape} ${isCircle ? 'rounded-full' : 'rounded-md'} shadow-md`}
                  style={{
                    left: `${startX}%`,
                    backgroundColor: selectedColor,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  initial={{ 
                    y: -50, 
                    x: 0, 
                    rotate: Math.random() * 360,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    y: pathPoints.map(p => p.y),
                    x: pathPoints.map(p => p.x - startX),
                    rotate: Array.from({ length: 16 }, (_, j) => j * 60 + Math.random() * 120),
                    opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0],
                    scale: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4],
                  }}
                  transition={{
                    duration: 1.5 + Math.random() * 1,
                    delay: i * 0.03,
                    ease: "easeInOut",
                    times: Array.from({ length: 16 }, (_, j) => j / 15)
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}