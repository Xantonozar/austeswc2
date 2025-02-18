"use client";

import { motion } from "framer-motion";
import { Calendar, Users, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Upcoming Competitions Data
const upcomingCompetitions = [
  {
    title: "Eco Champion: Reel Making Competition",
    date: "March 10, 2025",
    location: "AUST Campus Auditorium",
    participants: "Open for all",
    description:
      "Participate in our Eco Champion reel making competition and showcase your environmental creativity.",
    image: "https://res.cloudinary.com/chirkut/image/upload/v1739913621/WhatsApp_Image_2025-02-19_at_03.19.32_2e87fec5_lepm3s.jpg",
  },
  {
    title: "Eco Champion: Poster Presentation Competition",
    date: "March 15, 2025",
    location: "AUST Main Hall",
    participants: "Open for all",
    description:
      "Join our poster presentation competition to display innovative ideas on environmental conservation.",
    image: "https://res.cloudinary.com/chirkut/image/upload/v1739913631/WhatsApp_Image_2025-02-19_at_03.19.32_abaa43ee_ua5wyh.jpg",
  },
  {
    title: "Eco Champion: Photography Competition",
    date: "March 20, 2025",
    location: "AUST Online Platform",
    participants: "Free for all",
    description:
      "Test your photography skills  in our Eco Champion photography quiz competition.",
    image: "https://res.cloudinary.com/chirkut/image/upload/v1739913622/WhatsApp_Image_2025-02-19_at_03.19.32_9ac1ef3e_t0y5ne.jpg",
  },
  {
    title: "Eco Champion: Quiz Competition",
    date: "March 20, 2025",
    location: "AUST Online Platform",
    participants: "Free for all",
    description:
      "Test your knsowledge in our Eco Champion  quiz competition.",
    image: "https://res.cloudinary.com/chirkut/image/upload/v1739913631/WhatsApp_Image_2025-02-19_at_03.19.32_07523f07_s7sz6i.jpg",
  },
];

// Past Competitions Data
const pastCompetitions = [
  {
    title: "Nature’s Canvas: Roof Garden Video Making Competition",
    date: "January 19, 2024",
    impact: "Highlighted innovative green design ideas",
    description:
      "A successful competition showcasing creative video entries on roof gardening and sustainable campus design.",
    image: "http://aust.edu/storage/files/Y5otl3bxRdBBSRBq85LC6jk6SGOi8aqAUhcVIRG7.jpg",
  },
  {
    title: "Eco Quiz Competition",
    date: "December 10, 2023",
    impact: "Increasing the Knowledge of Environmental Issues",
    description:
      "A challenging quiz competition that tested participants' skills and environmental knowledge.",
    image: "https://aust.edu/storage/files/cVGGgmkfDgVa5xoYU947JA0xV4NxIvJmpLdAcsEV.jpg",
  },
];

export default function CompetitionsPage() {
  return (
    <div className="min-h-screen pt-20 bg-green-50">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Competitions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our past and upcoming competitions that foster creativity and promote environmental awareness.
            </p>
          </motion.div>

          {/* Upcoming Competitions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Upcoming Competitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingCompetitions.map((comp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="h-full flex flex-col">
                    <div
                      className="h-56  bg-center bg-cover "
                      style={{ backgroundImage: `url(${comp.image})` }}
                    />
                    <CardHeader>
                      <CardTitle>{comp.title}</CardTitle>
                      <CardDescription>{comp.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {comp.date}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {comp.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          {comp.participants}
                        </div>
                        <Link href="/contact">
                          <Button className="w-full mt-4 rounded-full">
                            Register Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Past Competitions */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Past Competitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastCompetitions.map((comp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative group h-full"
                >
                  <div
                    className="h-64 rounded-lg bg-cover bg-center group-hover:opacity-75 transition-opacity duration-300"
                    style={{ backgroundImage: `url(${comp.image})` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">{comp.title}</h3>
                    <p className="text-sm opacity-90 mb-1">{comp.date}</p>
                    <p className="text-sm opacity-90">{comp.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}