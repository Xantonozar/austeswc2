import React, { useState, useEffect } from "react";
import Link from "next/link";
const Mobile = () => {
  return (
    <div id="webcrumbs" className="mt-20">
      <div className="w-full h-auto relative flex flex-col items-center justify-center font-sans">
        <header className="text-center mb-8">
          <h1 className="text-[#1B4B43] text-4xl font-bold mb-2">Join Us in Healing the Earth</h1>
          <h2 className="text-[#1B4B43] text-4xl font-bold mb-4">Uplifting Lives</h2>
          <p className="text-sm text-gray-600 max-w-[500px] mx-auto">
          "Together, we can restore nature and create a brighter future for all. Join our club in making a lasting impact on both the environment and the lives of those in need."
          </p>
        </header>

        {/* Mobile Version */}
        <div className="flex flex-col items-center justify-center mt-10 md:hidden">
          <div className="w-full max-w-xs bg-[#F3F9F1] p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-[#1B4B43] text-xl font-bold mb-4 text-center">Achieve More,<br/>Together</h3>
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3"
              className="w-full h-[200px] object-cover rounded-2xl mb-4"
              alt="Hands holding plant"
            />
            <p className="text-sm text-gray-600 mb-4 text-center">
              Explore our projects that drive meaningful change and help protect the planet for future generations.
            </p>
            <Link href="/coming"><button className="bg-[#D9F2D6] text-[#1B4B43] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C5E8C1] transition-colors w-full">
              View More
            </button></Link>
            
          </div>

          <div className="w-full max-w-xs bg-[#E8F9FF] p-6 rounded-2xl shadow-lg">
            <h3 className="text-[#1B4B43] text-xl font-bold mb-4 text-center">One Vision,<br/>Many Hands</h3>
            <img
              src="https://res.cloudinary.com/chirkut/image/upload/v1739900232/A_classic_black_and_white_fine_art_photograph_a_young_Bangladeshi_boy_with_refined_features_and_warm_brown_skin_compassionately_engaged_in_social_work_helping_a_homeless_person_organizing_clothes_or_teaching_a_child._S_samkrs.jpg"
              className="w-full h-[200px] object-cover rounded-2xl mb-4"
              alt="Ocean turtle"
            />
            <p className="text-sm text-gray-600 mb-4 text-center">
              Our work is dedicated to protecting and restoring our oceans, from reducing plastic pollution.
            </p> <Link href="/coming">  <button className="bg-[#B7E9FF] text-[#1B4B43] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#95DFFF] transition-colors w-full">
              View More
            </button></Link>
          
          </div>
        </div>
      </div>
    </div>
  );
};

const Pc = () => {
  return (
    <div id="webcrumbs" className="mt-20">
      <div className="w-full h-[1250px] relative flex flex-col items-center justify-center font-sans">
        <header className="text-center mb-8">
          <h1 className="text-[#1B4B43] text-4xl font-bold mb-2">Join Us in Healing the Earth</h1>
          <h2 className="text-[#1B4B43] text-4xl font-bold mb-4"> Uplifting Lives</h2>
          <p className="text-sm text-gray-600 max-w-[500px] mx-auto">
          "Together, we can restore nature and create a brighter future for all. Join our club in making a lasting impact on both the environment and the lives of those in need."
          </p>
        </header>

        <div className="flex relative overflow-hidden flex-col justify-center h-[3200px] items-center w-[850px]">
          <div className="absolute left-0 top-[30px] w-[500px] group">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3"
              className="w-full absolute h-[300px] object-cover rounded-2xl"
              alt="Hands holding plant"
            />
            <div className="absolute overflow-hidden top-[200px] text-right right-0 transform translate-x-80 -translate-y-1/3 bg-[#F3F9F1] p-10 rounded-2xl shadow-lg transition-transform group-hover:translate-x-16 w-[400px]">
              <h3 className="text-[#1B4B43] text-2xl font-bold mb-14">Achieve More,<br/>Together</h3>
              <p className="text-sm text-gray-600 mb-8 max-w-[350px]">
                Explore our projects that drive meaningful change and help protect the planet for future generations.
              </p><Link href="/coming">
              <button className="bg-[#D9F2D6] text-[#1B4B43] px-6 py-2 rounded-full text-sm font-medium hover:bg-[#C5E8C1] transition-colors">
                View More
              </button></Link>
              <div className="w-96 h-96 absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 z-[-10] rounded-full border-[16px] bg-green-200 border-lime-200"></div>
              <div className="w-24 h-24 absolute top-[35%] left-[40%] transform translate-x-1/2 translate-y-1/4 z-[-20] rounded-full bg-green-400"></div>
            </div>
          </div>

          <div className="absolute right-0 top-[400px] w-[500px] mt-24 group">
            <div className="absolute overflow-hidden top-[200px] left-0 transform -translate-x-80 -translate-y-1/2 bg-[#E8F9FF] p-10 rounded-2xl shadow-lg z-10 transition-transform group-hover:-translate-x-16 w-[400px]">
              <h3 className="text-[#1B4B43] text-2xl font-bold mb-14">One Mission,<br/>Many Hearts</h3>
              <p className="text-sm text-gray-600 max-w-[350px] mb-10">
              Our efforts are focused on uplifting communities, providing care, and supporting those in need, ensuring no one is left behind
              </p><Link href="/coming">
              <button className="bg-[#B7E9FF] text-[#1B4B43] px-6 py-2 rounded-full text-xs font-medium hover:bg-[#95DFFF] transition-colors">
               View More
              </button></Link>
              <div className="w-96 h-96 absolute bottom-0 left-[-50%] transform translate-x translate-y-1/2 z-[-10] rounded-full border-[16px] bg-blue-200 border-sky-200"></div>
              <div className="w-24 h-24 absolute top-[35%] left-[20%] transform translate-x translate-y-1/4 z-[-20] rounded-full bg-blue-400"></div>
            </div>
            <img
              src="https://res.cloudinary.com/chirkut/image/upload/v1739900232/A_classic_black_and_white_fine_art_photograph_a_young_Bangladeshi_boy_with_refined_features_and_warm_brown_skin_compassionately_engaged_in_social_work_helping_a_homeless_person_organizing_clothes_or_teaching_a_child._S_samkrs.jpg"
              className="w-full h-[300px] absolute object-cover rounded-2xl"
              alt="Ocean turtle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Cards = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return isMobile ? <Mobile /> : <Pc />;
};