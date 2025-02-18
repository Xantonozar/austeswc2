"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function EventCalendar() {
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

const activities = [
 { id: 1, name: "Running", duration: "30 mins", date: "2023-10-01", time: "07:00:00", place: "Park" },
{ id: 2, name: "Cycling", duration: "45 mins", date: "2023-10-02", time: "08:00:00", place: "Gym" },
{ id: 3, name: "Swimming", duration: "1 hour", date: "2023-10-03", time: "09:00:00", place: "Pool" },
];

  // Create a map of dates to events for easy lookup
  const eventMap = new Map();
  activities?.forEach((activity) => {
    const dateStr = format(new Date(activity.date), "yyyy-MM-dd");
    eventMap.set(dateStr, activity);
  });

  // Highlight dates that have events
  const eventDates = activities?.map(a => new Date(a.date)) || [];

  const handleSelect = (date) => {
    setDate(date);
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const event = eventMap.get(dateStr);
      setSelectedEvent(event || null);
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-block mb-6"
          >
            <CalendarIcon className="h-12 w-12 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Event Calendar</h1>
          <p className="text-gray-600">
            Stay updated with our upcoming events and activities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-4"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md"
              modifiers={{
                event: eventDates,
              }}
              modifiersStyles={{
                event: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                }
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>{selectedEvent.title}</CardTitle>
                      <time className="text-sm text-gray-500">
                        {format(new Date(selectedEvent.date), "MMMM d, yyyy")}
                      </time>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{selectedEvent.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <p className="text-gray-500 text-center">
                    Select a date to view event details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}