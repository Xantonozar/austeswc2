"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import heroOne from '../public/hero-four.png';
import Image from "next/image";
export default function HeroHighlightDemo() {
  return (
    <div className="relative flex flex-row justify-between w-full m-auto">
<div className=" text-5xl ">
          Let's dream of a greener tomorrow, 
          <br/>
          <Highlight className="text-black dark:text-white" style={{ fontSize: 'larger', fontWeight: 'bold' }}>
            where nature thrives and the earth smiles.
          </Highlight>
          </div>
   
        <Image
                            src={heroOne}
                            alt="Hero Image"
                            layout="fill"
                            objectFit="contain"
                            className="absolute inset-0 z-30"
                          />

    </div>
  );
}

