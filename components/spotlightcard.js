import { MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const SpotlightCard = ({
  title,
  date,
  image,
  newsLink,
  className,

}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className="relative h-[280px] w-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        <Image
          src={image}
          alt={title}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/90">{date}</span>
            <a href={newsLink} target="_blank" className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors duration-200">
              <MoveRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};