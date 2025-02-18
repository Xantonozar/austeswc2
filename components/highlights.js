import React from "react";

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
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.55.34_cca12ec4_jtl4lt.jpg",
              alt: "Climate",
              text: "Single Step Matters",
              title: "Winter Cloth Distribution",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_02.00.34_1febd71d_d4nkc3.jpg",
              alt: "Ocean",
              text: "Clean Dhaka event ",
              title: "clean-up Campaing",
            },
            {
              src: "https://aust.edu/storage/files/8FYrdxoVGGMpl3kc3g3xfMYJnytQ42Bpdlrrs532.jpg",
              alt: "Wildlife",
              text: "Protecting endangered species",
              title: "Raising Fund for AUST Libaration",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_01.58.52_9fb16e7a_r6q9yg.jpg",
              alt: "Forest",
              text: "Every Contribution is Valuable",
              title: "Assist in Flood ",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.54.24_060daa2b_hhfyrm.jpg",
              alt: "Energy",
              text: "Inspiring a Better Tomorrow",
              title: "Club Fair",
            },
            {
              src: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_02.05.47_b155d6f9_pixxxw.jpg",
              alt: "Waste",
              text: " Sip Something Sweet Again",
              title: "Beat the Heat",
            },
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer perspective">
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform-gpu hover:rotate-y-12 hover:scale-105 hover:shadow-2xl">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
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

