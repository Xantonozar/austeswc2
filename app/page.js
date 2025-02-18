"use client";
import Image from "next/image";
import HeroSection from "@/components/hero";
import { Spotlight } from "@/components/spotlight";
import { Highlight } from "@/components/highlights";
import { Footer } from "@/components/footer";
import LowSection from "@/components/lower-section";
import Testimonial from "@/components/testimonial";
import Environmental from "@/components/environmental";
import PanelMembers from "@/components/panel";

import { Cards } from "@/components/card";
import { InteractiveGridPatternDemo } from "@/components/grid";
export default function Home() {
  return (
    <div className="w-full relative flex flex-col">
      <InteractiveGridPatternDemo />
      <br />
      {/* <HeroSection /> */}
    <Environmental />
    <Highlight />
    <Cards />
    <LowSection />
    <Spotlight />
    {/* <PanelMembers /> */}
    {/* <Testimonial /> */}
    <Footer />
    
    </div>
  );
}
