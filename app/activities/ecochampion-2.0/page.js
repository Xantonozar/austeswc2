'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Award, TreePine, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EcoChampionArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-4"
            >
              EcoChampion 2.0
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl max-w-2xl mx-auto"
            >
              Celebrating Green Initiatives and Tree Planting for a Sustainable Future
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Event</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                EcoChampion 2.0 is our flagship environmental initiative that brings together students, faculty, 
                and community members to celebrate sustainability and take concrete action for our planet. This 
                year's event focuses on tree planting and green campus development, with special emphasis on 
                affordable tree distribution to encourage widespread participation.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TreePine className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Tree Planting Ceremony</h4>
                    <p className="text-gray-600">Participate in our ceremonial tree planting with university officials and environmental experts</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Leaf className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Affordable Tree Distribution</h4>
                    <p className="text-gray-600">Get your own tree for only 30 Taka! Choose from various native species perfect for your home or garden</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Recognition Ceremony</h4>
                    <p className="text-gray-600">Celebrate outstanding environmental contributions and award certificates to active participants</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Schedule</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">9:00 AM - Registration & Welcome</p>
                    <p className="text-gray-600">Check-in and receive your event materials</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">9:30 AM - Opening Ceremony</p>
                    <p className="text-gray-600">Welcome speeches and event overview</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">10:00 AM - Tree Planting</p>
                    <p className="text-gray-600">Group tree planting activities across campus</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">11:30 AM - Tree Distribution</p>
                    <p className="text-gray-600">Purchase and collect your trees (30 Taka each)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">12:00 PM - Closing & Refreshments</p>
                    <p className="text-gray-600">Light refreshments and networking</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">February 19, 2025</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">9:00 AM - 12:00 PM</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">AUST Campus</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Open Registration</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tree Species Available</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Mango Tree</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Jackfruit Tree</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Guava Tree</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Lemon Tree</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Neem Tree</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">All trees are 30 Taka each</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white text-center"
            >
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Join Us!</h3>
              <p className="text-green-100 mb-4">Be part of this meaningful environmental initiative</p>
              <Link href="/coming">
                <Button className="bg-white text-green-600 hover:bg-gray-100 w-full">
                  Register Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join us for EcoChampion 2.0 and help create a greener, more sustainable campus. 
            Every tree planted makes a difference for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coming">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Register for Event
              </Button>
            </Link>
            <Link href="/activities">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                Back to Activities
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
