"use client";
// Force recompile
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
import MojarSchool from "@/components/mojar-school";
import UsnotarHasi from "@/components/usnotar-hasi";
import LatestActivities from "@/components/latest-activities";
import { InteractiveGridPatternDemo } from "@/components/grid";
import LandingPopup from "@/components/landing-popup";
export default function Home() {
  return (
    <div className="w-full relative flex flex-col">
      <LandingPopup />
      <InteractiveGridPatternDemo />
      <br />
      <Environmental />
      <Highlight />
      <Cards />
      <MojarSchool />
      <UsnotarHasi />
      <LatestActivities />
      <LowSection />
      <Spotlight />
      {/* <PanelMembers /> */}
      {/* <Testimonial /> */}
      <Footer />

    </div>
  );
}
