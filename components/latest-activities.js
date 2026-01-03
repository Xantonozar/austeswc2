import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { environmentalActivities, welfareActivities, campusActivities } from "@/app/data/activities";

export default function LatestActivities() {
    // Combine all activities
    const allActivities = [
        ...environmentalActivities.upcoming,
        ...environmentalActivities.past,
        ...welfareActivities.upcoming,
        ...welfareActivities.past,
        ...campusActivities.upcoming,
        ...campusActivities.past,
    ];

    // Check valid date
    const parseDate = (dateString) => {
        // Try parsing flexible date formats
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date(0) : date;
    };

    // Sort by date descending (newest first)
    const sortedActivities = allActivities.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Simple heuristic: if simple Date parse fails, look for year.
        const getYear = (d) => {
            const match = d.match(/\d{4}/);
            return match ? parseInt(match[0]) : 0;
        }

        const timeA = isNaN(dateA.getTime()) ? getYear(a.date) * 100000 : dateA.getTime();
        const timeB = isNaN(dateB.getTime()) ? getYear(b.date) * 100000 : dateB.getTime();

        return timeB - timeA;
    });

    // Take top 3
    const latestActivities = sortedActivities.slice(0, 3);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 text-[#023015]">Latest Activities</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Stay updated with our most recent events and initiatives.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestActivities.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                        >
                            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                                <div className="h-48 relative rounded-t-lg overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="cursor-pointer hover:text-green-600 transition-colors line-clamp-2">
                                        <Link href={`/activities`}>
                                            {event.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {event.date}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        )}
                                        <Link href="/activities" className="w-full block">
                                            <Button variant="outline" className="w-full mt-4 rounded-full border-green-600 text-green-600 hover:bg-green-50">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/activities">
                        <Button size="lg" className="rounded-full bg-[#198042] text-white hover:bg-[#146634]">
                            View All Activities
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
