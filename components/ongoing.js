"use client";

import Image from "next/image";

export default function Ongoing() {
  return (
    <section className="w-full px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Ongoing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-emerald-800 sm:text-4xl md:text-5xl">
            Something is Coming
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-600 sm:text-lg">
            We&apos;re working on something exciting. Stay tuned for our next
            big environmental initiative!
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-emerald-100">
          <Image
            src="https://res.cloudinary.com/chirkut/image/upload/v1787418954/Gemini_Generated_Image_b1vw1db1vw1db1vw_nj34jj.jpg"
            alt="Something is coming"
            width={1200}
            height={500}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
