"use client";

import React from 'react';

import "../app/globals.css"
// import { FaWater, FaLeaf, FaGlobe } from 'react-icons/fa';
import heroOne from '../public/hero-six.svg';
import Image from 'next/image';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { BackgroundBeams } from './ui/beam';
 // Changed from .lottie to .json
import { BoxReveal } from './magicui/box-reveal';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Typed from 'typed.js';
import { InteractiveHoverButton } from './magicui/interactive-hover-button';

export function InteractiveGridPatternDemo() {
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
    const el = React.useRef(null);

    React.useEffect(() => {
      const typed = new Typed(el.current, {
        strings: ['Future','Path','Voice'],
        typeSpeed: 100,
      });
  
      return () => {
        // Destroy Typed instance during cleanup to stop animation
        typed.destroy();
      };
    }, []);

    useEffect(() => {
      const handleResize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      };

      if (typeof window !== 'undefined') {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
      }
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobileOrTablet = screenSize.width <= 768; // Assuming 768px as the breakpoint for mobile/tablet

    return (
      <div className="relative flex h-auto w-full flex-col overflow-hidden bg-background">
        <BackgroundBeams/>
        <div className="whitespace-pre-wrap text-center tracking-tighter text-black dark:text-white">
          <div className="relative w-full h-screen max-h-[800px] bg-cover justify-center items-center bg-center flex flex-col md:flex-row">
            <div className={`w-full ${isMobileOrTablet ? 'ml-2 mt-8 mb-4 ' : 'ml-4 md:mt-1 md:ml-6 '} md:w-1/2 flex flex-col text-left gap-2 text-green-700 px-4`}>
              <h1 className="text-6xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[75px] pt-10 sm:mb-2 font-bold md:mb-4" style={{ letterSpacing: "2px", lineHeight: "1.2", color: "#023015" }}>
                WELCOME!!
              </h1>
              <h1 className='text-2xl font-semibold sm:text-4xl md:text-3xl lg:text-4xl xl:text-[50px]   mb-6' style={{ letterSpacing: "2px", lineHeight: "1.2" }}>
                AUST Environmental & Social Welfare Club
              </h1>
              <div className="flex flex-col items-start mb-4 pr-10 mr-4 text-wrap">
                <BoxReveal boxColor='#35597d'>
                  <p className="text-xl sm:text-2xl md:text-3xle lg:text-4xl xl:text-5xl text-[#1f1a4f] mb-4">
                    Be The <span ref={el}/>
                  </p>
                </BoxReveal>
              </div>
              <BoxReveal boxColor='green'>
                <InteractiveHoverButton className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl">
                  <Link href="/activities" >Explore</Link>
                </InteractiveHoverButton>
              </BoxReveal>
            </div>
            <div className="w-full h-full md:w-1/2 z-30 relative">
              <Image
                src={heroOne}
                alt="Hero Image"
                layout="fill"
                objectFit="contain"
                className="absolute inset-0 md:pb-20 z-30"
              />
            </div>
          </div>
        </div>
      </div>
    );
}