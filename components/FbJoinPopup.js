"use client";

import { useEffect, useState } from "react";

export default function FbJoinPopup() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 200);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-w-lg md:max-w-2xl"
      >
        {/* Decorative gradient header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-10 text-center sm:px-12 sm:py-14">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30 sm:h-24 sm:w-24">
            <svg
              className="h-10 w-10 text-white sm:h-12 sm:w-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 013.5-3.5h2v3h-2a1 1 0 00-1 1V12H18l-.5 3h-3v7A10 10 0 0022 12z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            Join Our Community
          </h2>
        </div>

        {/* Body */}
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="px-8 py-10 text-center sm:px-14 sm:py-12">
          <p className="mx-auto mb-8 max-w-md text-base text-gray-600 sm:text-lg">
            Stay updated with our events, initiatives, and environmental
            movements. Like our official Facebook page and be part of the
            change!
          </p>
          <a
            href="https://www.facebook.com/aust.eswc#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1877F2] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-[#166FE5] hover:shadow-xl sm:text-lg"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 013.5-3.5h2v3h-2a1 1 0 00-1 1V12H18l-.5 3h-3v7A10 10 0 0022 12z" />
            </svg>
            Join Our Official FB Page
          </a>
          <button
            type="button"
            onClick={close}
            className="mt-4 text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
