'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">


      {/* Mission Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="inline-block p-3 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                We are dedicated to fostering environmental awareness, promoting sustainable practices, and building resilient communities that thrive in harmony with nature.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through education, research, and community engagement, we work to create a future where environmental protection and human development go hand in hand.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-xl">
                <Image 
                  src="/sustainability-illustration-set-esg-green-260nw-2130393830.webp" 
                  alt="Sustainability" 
                  width={500} 
                  height={400}
                  className="rounded-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-800 mb-16">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Sustainability</h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe in creating lasting solutions that benefit both current and future generations.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  We build strong partnerships and empower communities to take action for environmental protection.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Education</h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe knowledge is power and strive to educate communities about environmental issues.
                </p>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-16 mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Impact</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Together with our partners and community members, we've made significant strides in environmental protection and sustainability.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
                <div className="text-gray-600">Environmental Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">25+</div>
                <div className="text-gray-600">Partner Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Trees Planted</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-2xl p-16 max-w-4xl mx-auto border border-green-200">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Join Our Mission</h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Be part of the change. Together, we can create a sustainable future for generations to come.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/join"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Join Us
                </a>
                <a
                  href="/contact"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}