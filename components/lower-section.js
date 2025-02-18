import { cn } from "@/lib/utils";
import Link from "next/link";
import Image  from "next/image";
import Banner from "../public/Banner.png"
const Initiative = ({ title, subtitle, imageSrc, colorClass,eventUrl }) => {
  return (
    <div className={cn(
      "rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg",
      colorClass || "bg-gray-50"
    )}>
      <div className="overflow-hidden rounded-2xl mb-6">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-64 object-cover transform transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-600 mb-6">{subtitle}</p>
     
      <a
  href={eventUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block"
>
  <button className="px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors duration-300">
    Learn More !!
  </button>
</a>

    </div>
  );
};

const LowSection = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            On Campus Activities
          </h1>
          <h2 className="text-xl text-slate-600 max-w-2xl mx-auto">
            for a Better Impact
          </h2>
          <p className="mt-4 text-slate-600 max-w-3xl mx-auto">
          Our initiatives that madee you think, act, and connect with us
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Initiative
            title="Club Fair"
            subtitle="Recruiting New Members"
            imageSrc="https://res.cloudinary.com/chirkut/image/upload/v1739896998/Banner_q7w5un.png"
            colorClass="bg-blue-50"
            eventUrl="https://facebook.com/events/s/austeswc-general-member-recrui/1144053617319053/"
          />
          <Initiative
            title="Eco Champion 2.0"
            subtitle="Journey Towards Knowledge"
            imageSrc="https://res.cloudinary.com/chirkut/image/upload/v1739896661/eco-champ_uyir0n.jpg"
            colorClass="bg-green-50"
            eventUrl="https://facebook.com/events/s/eco-champions-20/1799927074119266/"
          />
          <Initiative
            title="Environment Day Event"
            subtitle="Restore, Replenish, Revive Our Planet!"
            imageSrc="https://res.cloudinary.com/chirkut/image/upload/v1739896946/env-day_mv1uqi.jpg"
            colorClass="bg-cyan-50"
            eventUrl="https://www.facebook.com/share/p/14y1GQNiChy/"
          />
        </div>
      </div>
    </div>
  );
};

export default LowSection;