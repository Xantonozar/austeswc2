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

import { environmentalActivities, welfareActivities, campusActivities } from "../data/activities";

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
                        <CardTitle className="cursor-pointer hover:text-green-600 transition-colors">
                          <Link href={`/activities/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                            {event.title}
                          </Link>
                        </CardTitle>
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
                    className="relative group cursor-pointer"
                  >
                    <Link href={`/activities/${activity.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
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
                    </Link>
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
                        <CardTitle className="cursor-pointer hover:text-blue-600 transition-colors">
                          <Link href={`/activities/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                            {event.title}
                          </Link>
                        </CardTitle>
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
                    className="relative group cursor-pointer"
                  >
                    <Link href={`/activities/${activity.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
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
                    </Link>
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
                        <CardTitle className="cursor-pointer hover:text-emerald-600 transition-colors">
                          <Link href={`/activities/${event.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                            {event.title}
                          </Link>
                        </CardTitle>
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
                    className="relative group cursor-pointer"
                  >
                    <Link href={`/activities/${activity.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
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
                    </Link>
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

