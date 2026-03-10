'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Unused router can be removed if not needed, but keeping as per original code
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white bg-opacity-70 backdrop-blur-md sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo */}
          <div className="flex-1">
            <Link href="/">
              <Image src="/eswclogo.png" alt="ESWC Logo" width={70} height={70} className="w-12 h-12 lg:w-[70px] lg:h-[70px]" />
            </Link>
          </div>

          {/* Middle Section: Links - Visible on MD+ with Responsive Sizing */}
          <div className="hidden md:flex flex-1 justify-center">
            {/* Reduced spacing on MD, normal on LG */}
            <ul className="flex space-x-3 lg:space-x-6 items-center">
              <li>
                <Link href="/about" className="text-light-green text-sm lg:text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500 whitespace-nowrap">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-light-green text-sm lg:text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500 whitespace-nowrap">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-light-green text-sm lg:text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500 whitespace-nowrap">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-light-green text-sm lg:text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500 whitespace-nowrap">
                  Panel
                </Link>
              </li>
              <li>
                <Link href="/competetion" className="text-light-green text-sm lg:text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500 whitespace-nowrap">
                  Competition
                </Link>
              </li>
              <li className="relative group">
                <button onClick={toggleDropdown} className="text-light-green text-sm lg:text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500 flex items-center whitespace-nowrap">
                  More
                  <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block transition ease-in-out duration-300">
                    <Link href="/research" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm lg:text-base">
                      Research
                    </Link>
                    <Link href="/sponsors" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm lg:text-base">
                      Sponsors
                    </Link>
                    <Link href="/gallery" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm lg:text-base">
                      Gallery
                    </Link>
                    <Link href="/annual-report" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm lg:text-base">
                      Annual Report
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* Right Section: Buttons - Visible on MD+ with Responsive Sizing */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex space-x-2 lg:space-x-4">
              <Link href="/greenova" className="flex flex-col items-center justify-center hover:scale-105 hover:opacity-80 transition-all">
               
                <Image
                  src="/greenova.png"
                  alt="Greenova"
                  width={150}
                  height={45}
                  className="h-8 w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button - Visible Only on Small Screens */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* SVG path changes based on menu open/close state */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-screen bg-green-50 backdrop-blur-3xl z-50">
          <div className="px-6 pt-20 pb-6 flex flex-col items-start">
            {/* Close button for mobile menu */}
            <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-800 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ul className="flex flex-col space-y-6">
              <li>
                <Link href="/about" className="hover:underline flex items-center space-x-2" onClick={toggleMenu}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 112 0v4a1 1 0 11-2 0V8zm1 8a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline flex items-center space-x-2" onClick={toggleMenu}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 10.882l7.997-4.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 5-8-5V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:underline flex items-center space-x-2" onClick={toggleMenu}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 112 0v4a1 1 0 11-2 0V8zm1 8a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  <span>Activities</span>
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:underline flex items-center space-x-2" onClick={toggleMenu}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 112 0v4a1 1 0 11-2 0V8zm1 8a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  <span>Panel</span>
                </Link>
              </li>
              <li>
                <Link href="/competetion" className="hover:underline flex items-center space-x-2" onClick={toggleMenu}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 112 0v4a1 1 0 11-2 0V8zm1 8a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  <span>Competition</span>
                </Link>
              </li>
              <li>
                <button onClick={toggleDropdown} className="hover:underline flex items-center space-x-2">
                  <span>More</span>
                  <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link href="/research" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                      Research
                    </Link>
                    <Link href="/sponsors" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                      Sponsors
                    </Link>
                    <Link href="/gallery" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                      Gallery
                    </Link>
                    <Link href="/annual-report" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                      Annual Report
                    </Link>
                  </div>
                )}
              </li>
            </ul>
            <div className="mt-8 flex flex-col items-center gap-6 w-full px-4">
              <Link href="/greenova" className="flex flex-col items-center justify-center hover:scale-105 hover:opacity-80 transition-all active:scale-95" onClick={toggleMenu}>
               
                <Image
                  src="/greenova.png"
                  alt="Greenova"
                  width={200}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


export default Navbar;
