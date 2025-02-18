import React, { useState, useEffect } from 'react';
import { FlipWords } from './ui/flip';import Link from 'next/link';
const words = ["Environment", "People","The Society"];
const Environmental = () => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      };

      handleResize(); // Set initial size
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const renderDeviceComponent = () => {
    const { width } = screenSize;
    if (width >= 1024) {
      return <Pc />;
    } else if (width >= 768) {
      return <Laptop />;
    } else if (width >= 600) {
      return <Tablet />;
    } else {
      return <Mobile />;
    }
  };

  return renderDeviceComponent();
};

const Pc = () => {
  return (
    <div className="flex mt-20 gap-0 pl-28 pr-28 pt-10 pb-24 flex-row justify-between w-full ">
      <div
        className="bg-black h-[440px] min-w-[400px] w-[400px] rounded-tl-[45%] rounded-br-[45%] rounded-tr-[5px] rounded-bl-[5px]"
        style={{
          backgroundImage: "url('/two.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="flex pl-16 pr-16 items-center text-center justify-center gap-10 pt-10 pb-8 flex-col relative h-[440px] ">
        <h1 className="text-6xl text-center mb-0 text-wrap text-[#023015] font-rubik font-bold">
          Save <FlipWords className={"text-[#023015]"} words={words}/> 
        </h1>
        <p className="text-black text-xl text-center text-wrap">
        Our vision is to stand against injustice, demoralization and other black spots of the society, to reach out the people in disaster-prone areas and to ensure green environment in local national level.
        </p>
        <div>
        <Link href='/about' className="bg-[#198042] text-white px-4 py-2 rounded-full">Learn More!</Link>
       
        </div>
      </div>
      <div
        className="bg-black min-w-[400px] h-[440px] w-[400px] rounded-tr-[45%] rounded-bl-[45%] rounded-tl-[5px] rounded-br-[5px]"
        style={{
          backgroundImage: "url('/one.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
};

const Laptop = () => {
  return (
    <div className="flex mt-10 gap-0 pl-14 pr-14 pt-5 pb-12 flex-row justify-between w-full ">
      <div
        className="bg-black h-[220px] min-w-[200px] w-[200px] rounded-tl-[45%] rounded-br-[45%] rounded-tr-[5px] rounded-bl-[5px]"
        style={{
          backgroundImage: "url('/hero-five.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="flex pl-8 pr-8 items-center justify-between pt-5 pb-4 flex-col relative h-[220px] ">
        <h1 className="text-2xl text-center mb-8 text-wrap text-[#023015] font-rubik font-bold">
                  Save <FlipWords className={"text-[#023015]"} words={words}/> 
        </h1>
        <p className="text-black text-lg text-center text-wrap">
          We are passionate environment lover committed to protecting our planet and promoting sustainable living
        </p>
        <button className="bg-[#198042] text-white px-2 py-1 rounded-full">Learn More!</button>
      </div>
      <div
        className="bg-black min-w-[200px] h-[220px] w-[200px] rounded-tr-[45%] rounded-bl-[45%] rounded-tl-[5px] rounded-br-[5px]"
        style={{
          backgroundImage: "url('/hero-five.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
};

const Mobile = () => {
  return (
    <div className="flex mt-10 gap-0 pl-4 pr-4 pt-5 pb-12 flex-col justify-center w-full">
      <div className="flex pl-8 pr-8 items-center justify-center pt-5 pb-4 flex-col relative h-auto">
        <h1 className="text-3xl text-center mb-8 text-wrap text-[#023015] font-rubik font-bold">
        Save <FlipWords className={"text-[#023015]"} words={words}/> 
        </h1>
        <p className="text-black text-lg text-center text-wrap">
          We are passionate environment lover committed to protecting our planet and promoting sustainable living
        </p>
        <button className="bg-[#198042] text-white px-3 py-1.5 rounded-full mt-4">Learn More!</button>
      </div>
    </div>
  );
}

const Tablet = () => {
  return (
    <div className="flex mt-10 gap-0 pl-6 pr-6 pt-7 pb-14 flex-col justify-center w-full">
      <div className="flex pl-10 pr-10 items-center justify-center pt-7 pb-6 flex-col relative h-auto">
        <h1 className="text-4xl text-center mb-10 text-wrap text-[#023015] font-rubik font-bold">
                  Save <FlipWords className={"text-[#023015]"} words={words}/> 
        </h1>
        <p className="text-black text-xl text-center text-wrap">
          We are passionate environment lover committed to protecting our planet and promoting sustainable living
        </p>
        <button className="bg-[#198042] text-white px-4 py-2 rounded-full mt-5">Learn More!</button>
      </div>
    </div>
  );
}

export default Environmental;
