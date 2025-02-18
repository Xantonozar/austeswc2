import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Link from "next/link"; 
import { SpotlightCard } from "./spotlightcard";
const spotlightData = [
  {
    id: 1,
    title: "Dhaka’s air is unbearable during the holidays",
    date: "February 16, 2025",
    image: "https://www.dailymessenger.net/media/imgAll/2024February/en/6-2501100750.jpg",
    link:"https://thegreenpagebd.com/dhakas-air-is-unbearable-during-the-holidays/"
  },
  {
    id: 2,
    title: "Plastic pollution and responsible waste disposal",
    date: "February 3, 2025",
    image: "https://res.cloudinary.com/chirkut/image/upload/v1739902228/prothomalo-english_2025-02-03_jn3jq3ws_pollution_px6yix.avif",
  },
  {
    id: 3,
    title: "Can vertical gardening be the solution to Dhaka’s air pollution crisis?",
    date: "February 13, 2025",
    image: "https://cdn.shortpixel.ai/spai/w_640+q_lossy+ret_img+to_webp/thegreenpagebd.com/wp-content/uploads/2025/02/Can-vertical-gardening-be-the-solution-to-Dhakas-air-pollution-crisis.jpg",
    link:"https://thegreenpagebd.com/can-vertical-gardening-be-the-solution-to-dhakas-air-pollution-crisis"
  },
  {
    id: 4,
    title: "Birds are dying from pesticides, and environmental balance is being destroyed",
    date: "Februrary 14, 2025",
    image: "https://cdn.shortpixel.ai/spai/w_760+q_lossy+ret_img+to_webp/thegreenpagebd.com/wp-content/uploads/2025/02/Birds-are-dying-from-pesticides-and-environmental-balance-is-being-destroyed.jpg",
    link:"https://thegreenpagebd.com/birds-are-dying-from-pesticides-and-environmental-balance-is-being-destroyed/"
  },
];



export const Spotlight = () => {
  return (
    <div className="bg-gradient-to-tr w-3/4 mx-auto from-gray-50 to-gray-100 rounded-xl shadow-lg p-8">
      <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
          In the Spotlight: Stories That Matter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spotlightData.map((story, index) => (
            <SpotlightCard
              key={story.id}
              title={story.title}
              date={story.date}
              image={story.image}
              newsLink={story.link}
              className={cn(
                "transform transition-all duration-300 hover:scale-[1.02]",
                index % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"
              )}
            />
          ))}
        </div>
      </section>
    </div>
  );
};