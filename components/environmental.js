import React from 'react';
import { FlipWords } from './ui/flip';
import Link from 'next/link';
import Image from 'next/image';

const words = ["Environment", "People", "The Society"];

const Environmental = () => {
  return (
    <div className="flex flex-col lg:flex-row mt-10 lg:mt-20 gap-8 lg:gap-0 px-4 sm:px-8 md:px-14 lg:px-6 xl:px-28 py-10 lg:pb-24 justify-between w-full items-center">

      {/* Left Image - Visible on Desktop/Laptop */}
      <div className="hidden md:block relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[260px] lg:w-[240px] lg:min-w-[240px] xl:h-[440px] xl:w-[400px] xl:min-w-[400px]">
        <div className="absolute inset-0 overflow-hidden rounded-tl-[45%] rounded-br-[45%] rounded-tr-[5px] rounded-bl-[5px] bg-black">
          <Image
            src="/two.jpg"
            alt="Environmental Left"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center justify-center gap-6 lg:gap-6 xl:gap-10 px-4 sm:px-8 lg:px-2 xl:px-16 relative w-full lg:max-w-[500px] xl:max-w-[calc(100%-800px)]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-center mb-0 text-wrap text-[#023015] font-rubik font-bold leading-tight">
          Save <FlipWords className={"text-[#023015]"} words={words} />
        </h1>
        <p className="text-black text-lg sm:text-xl text-center text-wrap max-w-2xl lg:text-base xl:text-xl">
          Standing against injustice, supporting the vulnerable, and ensuring a green environment.
        </p>
        <div>
          <Link href='/about' className="bg-[#198042] text-white px-4 py-2 rounded-full hover:bg-[#146634] transition-colors">
            Learn More!
          </Link>
        </div>
      </div>

      {/* Right Image - Visible on Desktop/Laptop */}
      <div className="hidden md:block relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[260px] lg:w-[240px] lg:min-w-[240px] xl:h-[440px] xl:w-[400px] xl:min-w-[400px] mt-8 lg:mt-0">
        <div className="absolute inset-0 overflow-hidden rounded-tr-[45%] rounded-bl-[45%] rounded-tl-[5px] rounded-br-[5px] bg-black">
          <Image
            src="/one.jpg"
            alt="Environmental Right"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
};

export default Environmental;
