import React from "react";
import Image from "next/image";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

// import "./style.css";

export const Highlight = () => {
  return (
    <div id="webcrumbs">
      <div className="w-full justify-center p-4 sm:p-8 md:pl-24 md:pr-24 lg:pl-48 lg:pr-48 bg-white">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-700 mb-2 sm:mb-4">
            Making an Impact,<br /> Inspiring a Better Tomorrow
          </h1>
          <p className="text-gray-600 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Empowering individuals and communities to create a more sustainable world. Together, we're building a better future, one step at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 sm:gap-x-16 md:gap-x-24 gap-y-8">
          {[
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1767465559/bannerEcoChampion_iam476.svg",
              alt: "Eco Champion",
              text: "Championing Green Initiatives",
              title: "Eco Champion 3.0",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1771661156/FB_IMG_1769234724125_s6uogi.jpg",
              alt: "Winter Cloth",
              text: "Spreading Warmth",
              title: "Winter Cloth Collection Spring 25",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1772103213/615395054_860158470152457_8608973001880448478_n_dbnhez.jpg",
              alt: "Mojar School",
              text: "Supporting Education",
              title: "Mojar School",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739914874/WhatsApp_Image_2025-02-19_at_03.19.31_19591f2b_jg2bnl.jpg",
              alt: "Eco Fair",
              text: "Sustainable Innovations",
              title: "Eco Fair",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.54.24_060daa2b_hhfyrm.jpg",
              alt: "Club Fair",
              text: "Inspiring a Better Tomorrow",
              title: "Club Fair",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_02.05.47_b155d6f9_pixxxw.jpg",
              alt: "Beat the Heat",
              text: " Sip Something Sweet Again",
              title: "Beat the Heat",
            },
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer perspective">
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform-gpu hover:rotate-y-12 hover:scale-105 hover:shadow-2xl h-48 sm:h-56 md:h-64">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.text}
                  </p>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mt-2 sm:mt-4 text-center group-hover:text-teal-700 transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

