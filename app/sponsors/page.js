'use client';

import React from 'react';
import Image from 'next/image';

const sponsors = [
  {
    name: "Al Arafah Bank PLC",
    logo: "https://www.aibl.com.bd/wp-content/themes/aiblTheme/images/aibplc-logo2.png",
    description: "Al-Arafah Islami Bank PLC is a leading Shariah-based commercial bank in Bangladesh, dedicated to providing modern banking services while upholding Islamic values. Since its establishment, the bank has focused on promoting ethical finance, social responsibility, and sustainable economic growth.",
    category: "Title Sponsor of Eco Champion 3.0",
    website: "https://www.aibl.com.bd/"
  },
    {
    name: "The Daily Campus",
    logo: "https://files.thedailycampus.com/images/logo.svg",
    description: "The Daily Campus is a trusted online news portal in Bangladesh, focusing on education, campus life, youth, and national updates. It provides timely and reliable news to students and the wider community.",
    category: "Media Partner Eco Champion 3.0",
    website: "https://thedailycampus.com/"
  },

];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Sponsors Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Section Header - Mobile Responsive */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block p-2 sm:p-3 bg-green-100 rounded-full mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
              Environmental Champions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Meet the organizations and institutions that share our vision for a greener planet
            </p>
          </div>

          {/* Enhanced Sponsors List - Mobile Responsive */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl lg:hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Enhanced Logo Section - Mobile Responsive */}
                  <div className="lg:w-1/3 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-emerald-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                      <Image
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Floating badge - Mobile Responsive */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6">
                      <div className="bg-green-500 text-white px-2 py-1 sm:px-3 text-xs sm:text-sm font-medium rounded-full shadow-lg">
                        Partner
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Content Section - Mobile Responsive */}
                  <div className="lg:w-2/3 p-6 sm:p-8 lg:p-10">
                    <div className="mb-4 sm:mb-6">
                      <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs sm:text-sm font-semibold rounded-full border border-green-200 shadow-sm">
                        {sponsor.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 group-hover:text-green-600 transition-colors duration-300">
                      {sponsor.name}
                    </h3>
                    
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                      {sponsor.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                      >
                        Visit Website
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      
                      <div className="flex items-center text-green-600">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Environmental Partner</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Call to Action - Mobile Responsive */}
          <div className="text-center mt-16 sm:mt-20 lg:mt-24">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl sm:rounded-3xl shadow-xl lg:shadow-2xl p-8 sm:p-12 lg:p-16 max-w-4xl mx-auto border border-green-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-emerald-100/20"></div>
              <div className="relative">
                <div className="mb-6 sm:mb-8">
                  <Image src="/tree.gif" alt="Tree" width={60} height={60} className="mx-auto sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
                  Join Our Mission
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                  Become part of our network of environmental champions and help create a sustainable future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <a
                    href="/contact"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/donate"
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                  >
                    Support Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
