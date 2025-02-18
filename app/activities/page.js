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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Environmental activities
const environmentalActivities = {
  upcoming: [
    {
      title: "EcoChampion 2.0 ",
      date: "February 19, 2025",
      location: "AUST Campus",
      participants: "Open Registration",
      description:
        "Join us for EcoChampion 2.0 to celebrate green initiatives and tree planting. Get trees for only 30 Taka!",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1739896661/eco-champ_uyir0n.jpg",
    },
  ],
  past: [
    {
      title: "Nature’s Canvas: Roof Garden Video Making Competition",
      date: "January 19, 2024",
      impact: "Creative video submissions showcasing a greener campus",
      description:
        "Showcase your creativity and contribute to our green campus through this exciting video competition.",
      image: "http://aust.edu/storage/files/Y5otl3bxRdBBSRBq85LC6jk6SGOi8aqAUhcVIRG7.jpg",
    },
    
    {
      title: "Sparkle & Shine Cleanup Campaign",
      date: "January 16, 2024",
      impact: "Collected 150kg of waste",
      description:
        "A campus and community cleanup drive aimed at keeping our surroundings free of waste.",
      image: "https://aust.edu/storage/files/WUZ5QVYPRXmAdFW7icfEfcNWUHTrNVcWmY5LdUa9.jpg",
    },

  
  ],
};

// Welfare activities
const welfareActivities = {
  upcoming: [
    {
      title: "4th Winter Clothes Drive",
      date: "December 17-22, 2025",
      location: "Campus",
      participants: "100+",
      description:
        "Support underprivileged communities by donating your winter clothes during our 4th drive.",
      image: "https://t3.ftcdn.net/jpg/03/13/59/78/360_F_313597831_Bv3LoRBJnZU7ggCQIPUtVDOdju2Ksqfu.jpg",
    },
  ],
  past: [
    {
      title: "Winter Clothes Distribution",
      date: "January 16, 2024",
      impact: "Distributed essential winter clothes ",
      description:
        "A dual initiative that provided warmth to those in need and maintained a clean campus environment.",
      image: "http://aust.edu/storage/files/9hsnWLAPJW9L1gTYPBp0dH4v8wowAoPDZRtjf3bv.jpg",
    },
    {
      title: "Winter Clothes Distribution and Cleanup Campaign",
      date: "December 17-22, 2024",
      impact: "Distributed essential winter clothes ",
      description:
        "A dual initiative that provided warmth to those in need and maintained a clean campus environment.",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.55.34_cca12ec4_jtl4lt.jpg",
    },
    {
      title: "Flood Relief",
      date: ", 2024",
      impact: "Distributed essential goods ",
      description:
        "Making a positive impact in the lives of those affected by the flood.",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_01.58.52_9fb16e7a_r6q9yg.jpg",
    },
    {
      title: "Blanket & Cloth Donation 2.0",
      date: "February 03, 2023",
      impact: "Provided blankets to over 150 families",
      description:
        "A heartwarming drive to donate blankets and cloths to local communities during the cold season.",
      image: "https://aust.edu/storage/files/IFeWlViuM7aUybce2sR1brrCKTI3A801r4qeGlAz.jpg",
    },
    {
      title: "General Member Recruitment - Club Fair",
      date: "December 22, 2023",
      impact: "Enlisted 69 enthusiastic new members",
      description:
        "At the AUST Club Fair, our booth welcomed both online and offline registrations, strengthening our community.",
      image: "https://aust.edu/storage/files/Em3z0yyhpkYZ0T26bWvtoluMBHfTwOhvELYPwSXM.jpg",
    },
  ],
};

// On Campus activities (club-related tasks)
const campusActivities = {
  upcoming: [
    {
      title: "Eco Fair Stall at Campus",
      date: "February 19, 2025",
      location: "Main Campus Plaza",
      participants: "150+",
      description:
        "Visit our Eco Fair Stall to explore interactive displays on sustainability and eco-friendly products.",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1739914874/WhatsApp_Image_2025-02-19_at_03.19.31_19591f2b_jg2bnl.jpg",
    },

  
  ],
  past: [
    {
      title: "Club Fair 2024: Member Recruitment Drive",
      date: "December 23-24, 2024",
      impact: " new members recruited",
      description:
        "Our Club Fair recruitment drive was a success, welcoming 69 enthusiastic members to join the club.",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.54.24_060daa2b_hhfyrm.jpg",
    },
    
    {
      title: "Club Fair 2023: Member Recruitment Drive",
      date: "December 22, 2023",
      impact: " new members recruited",
      description:
        "Our Club Fair recruitment drive was a success, welcoming 69 enthusiastic members to join the club.",
      image: "https://aust.edu/storage/files/Em3z0yyhpkYZ0T26bWvtoluMBHfTwOhvELYPwSXM.jpg",
    },
    {
      title: "Eco Fair Stall Showcase",
      date: "October 15, 2023",
      impact: "Engaged 120 students",
      description:
        "Our Eco Fair Stall attracted over 120 students, promoting sustainable practices and eco-friendly innovations on campus.",
      image: "https://img.freepik.com/free-photo/white-background_23-2147730801.jpg",
    },
    {
      title: "Seminar on Sustainability",
      date: "January 16, 2024",
      impact: "Enhanced knowledge on sustainable practices",
      description:
        "Join industry experts as they discuss innovative strategies and sustainable practices for a greener future.",
      image: "https://aust.edu/storage/files/At2ULZvxSDkGyoi8tnZDAJCCZ5eHDy5OkeAFygep.jpg",
    },
    {
      title: "World Environment Day Celebration - Green Today, Clean Tomorrow!",
      date: "June 05, 2023",
      impact: "Raised awareness and promoted sustainable practices",
      description:
        "Celebrated World Environment Day by gifting indoor plants to university officials and emphasizing environmental stewardship.",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_02.02.07_ebd89547_t3nfs9.jpg",
    },
    {
      title: "Environmental Quiz Competition",
      date: "January 15, 2024",
      impact: "Engaged over 50 students",
      description:
        "Test your knowledge on environmental issues and win exciting prizes in this fun quiz event.",
      image: "http://aust.edu/storage/files/KJiUnK6ewdj6gQauoaUa0qPuFClJ5s77Zn9oRIT3.jpg",
    },
    {
      title: "Beat the Heat",
      date: "May 4, 2024",
      location: "Campus Quad",
      participants: "30+",
      description:
        "Enjoy refreshing juices and healthy snacks while learning about sustainable living in our summer initiative.",
      image: "https://aust.edu/assets/images/austeswc_juicebar.jpg",
    },
  ],
};

export default function Activities() {
  return (
    <div className="min-h-screen pt-20 bg-green-50">
      <Tabs defaultValue="environmental" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="welfare">Welfare</TabsTrigger>
          <TabsTrigger value="campus">On Campus</TabsTrigger>
        </TabsList>

        {/* Environmental Activities */}
        <TabsContent value="environmental">
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl font-bold mb-4">Environmental Activities</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Join us in our environmental initiatives to promote sustainability and a greener future.
                </p>
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">Upcoming Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {environmentalActivities.upcoming.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Card className="h-full">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            {event.participants}
                          </div>
                          <Link href="/coming">
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

              <h2 className="text-3xl font-bold mb-4">Past Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {environmentalActivities.past.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="relative group"
                  >
                    <div
                      className="h-64 rounded-lg bg-cover bg-center group-hover:opacity-75 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${activity.image})` }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-1">{activity.date}</p>
                      <p className="text-sm opacity-90">{activity.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Welfare Activities */}
        <TabsContent value="welfare">
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl font-bold mb-4">Welfare Activities</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Join us in our welfare initiatives to support the community and improve lives.
                </p>
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">Upcoming Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {welfareActivities.upcoming.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Card className="h-full">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            {event.participants}
                          </div>
                          <Link href="/coming">
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

              <h2 className="text-3xl font-bold mb-4">Past Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {welfareActivities.past.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="relative group"
                  >
                    <div
                      className="h-64 rounded-lg bg-cover bg-center group-hover:opacity-75 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${activity.image})` }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-1">{activity.date}</p>
                      <p className="text-sm opacity-90">{activity.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </TabsContent>

        {/* On Campus Activities */}
        <TabsContent value="campus">
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl font-bold mb-4">On Campus Activities</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore our diverse club initiatives on campus—from interactive stalls to refreshing juice bars and engaging recruitment drives.
                </p>
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">Upcoming Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {campusActivities.upcoming.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Card className="h-full">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            {event.participants}
                          </div>
                          <Link href="/coming">
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

              <h2 className="text-3xl font-bold mb-4">Past Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {campusActivities.past.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="relative group"
                  >
                    <div
                      className="h-64 rounded-lg bg-cover bg-center group-hover:opacity-75 transition-opacity duration-300"
                      style={{ backgroundImage: `url(${activity.image})` }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-1">{activity.date}</p>
                      <p className="text-sm opacity-90">{activity.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Call-To-Action Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join us in our upcoming activities and help create a positive change.
            </p>
            <Link href="/coming">
              <Button size="lg" className="rounded-full">
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


