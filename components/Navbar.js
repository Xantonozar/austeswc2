// components/Navbar.js

'use client'; // Indicates that this component is a client-side component

import React, { useState } from 'react';
import Link from 'next/link'; // Importing Link component from Next.js for navigation
import Image from 'next/image'; // Importing Image component from Next.js

function Navbar() {
  // State to manage the open/close status of the mobile menu
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the mobile menu open/close state
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-white bg-opacity-70 backdrop-blur-md sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo */}
          <div className="flex-1">
            <Link href="/">
              <Image src="/eswclogo.png" alt="ESWC Logo" width={70} height={70} />
            </Link>
          </div>
          {/* Middle Section: Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-6">
              <li>
                <Link href="/about" className="text-light-green text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-light-green text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-light-green text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-light-green text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500">
                 Panel
                </Link>
              </li>
              <li className="relative group">
                <button onClick={toggleDropdown} className="text-light-green text-lg hover:underline hover:text-black hover:scale-110 hover:font-bold hover:decoration-green-500">
                  More
                  <svg className="w-4 h-4 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block transition ease-in-out duration-300">
                    <Link href="/research" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Research
                    </Link>
                    <Link href="/sponsors" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Sponsors
                    </Link>
                    <Link href="/gallery" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Gallery
                    </Link>
                    <Link href="/competetion" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Competetion
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
          {/* Right Section: Buttons */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex space-x-4">
              <Link href="/coming" className="bg-green-200 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-full">
                Donate
              </Link>
              <Link href="/coming" className="bg-sky-200 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded-full">
                Join Us
              </Link>
            </div>
          </div>
          {/* Mobile Menu Button */}
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
              <Link href="/coming" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                Sponsors
              </Link>
              <Link href="/coming" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                Gallery
              </Link>
              <Link href="/competetion" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={toggleMenu}>
                Competetion
              </Link>
            </div>
          )}
        </li>
      </ul>
      <div className="mt-6 flex flex-col items-center gap-6">
        <Link href="/donate" className="bg-green-500 w-full hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 112 0v4a1 1 0 11-2 0V8zm1 8a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span>Donate</span>
        </Link>
        <Link href="/join" className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 112 0v4a1 1 0 11-2 0V8zm1 8a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span>Join Us</span>
        </Link>
      </div>
    </div>
  </div>
)}
    </nav>
  );
}

export default Navbar; // Exporting Navbar component as default