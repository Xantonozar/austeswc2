import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#E8F0EC] p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Branding */}
   

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About AUSTESWC</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="/mission" className="hover:underline hover:text-green-700 transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="/story" className="hover:underline hover:text-green-700 transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/team" className="hover:underline hover:text-green-700 transition-colors">
                  Team
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Events</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="/upcoming-events" className="hover:underline hover:text-green-700 transition-colors">
                  Upcoming Events
                </a>
              </li>
              <li>
                <a href="/past-events" className="hover:underline hover:text-green-700 transition-colors">
                  Past Events
                </a>
              </li>
              <li>
                <a href="/schedule" className="hover:underline hover:text-green-700 transition-colors">
                  Event Schedule
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="/blog" className="hover:underline hover:text-green-700 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/news" className="hover:underline hover:text-green-700 transition-colors">
                  News
                </a>
              </li>
              <li>
                <a href="/gallery" className="hover:underline hover:text-green-700 transition-colors">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2">
           
                <span>141 & 142, Love Road, Tejgaon Industrial Area, Dhaka-1208</span>
              </li>
              <li className="flex items-center gap-2">
                
                <a
                  href="austeswc@aust.edu"
                  className="hover:underline hover:text-green-700 transition-colors"
                >
                  austeswc@aust.edu
                </a>
              </li>
              <li className="flex items-center gap-2">
        
                <span>+880 2 8870422</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mt-8">
          <a
            href="https://www.facebook.com/austeswc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 013.5-3.5h2v3h-2a1 1 0 00-1 1V12H18l-.5 3h-3v7A10 10 0 0022 12z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/austeswc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 001.88-2.36 8.49 8.49 0 01-2.7 1.03A4.24 4.24 0 0015.5 4a4.26 4.26 0 00-4.19 5.25A12.07 12.07 0 013 5.1a4.26 4.26 0 001.32 5.68 4.2 4.2 0 01-1.93-.53v.05a4.26 4.26 0 003.41 4.17 4.28 4.28 0 01-1.92.07 4.26 4.26 0 003.98 2.96A8.54 8.54 0 012 19.54a12.06 12.06 0 006.54 1.92c7.85 0 12.14-6.5 12.14-12.14 0-.19 0-.38-.01-.57A8.7 8.7 0 0024 4.56a8.46 8.46 0 01-2.54.7z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/austeswc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/austeswc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47s-1.75 1.17-1.75 2.38v4.59h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
