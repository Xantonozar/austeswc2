'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Heart, Gift, Users2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WinterClothesDriveArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-4"
            >
              4th Winter Clothes Drive
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl max-w-2xl mx-auto"
            >
              Supporting Underprivileged Communities Through Warmth and Compassion
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Initiative</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our 4th Winter Clothes Drive is a heartwarming initiative that brings together the AUST community 
                to support underprivileged families during the cold winter months. This year, we aim to collect 
                and distribute essential winter clothing to over 100 families, ensuring that no one suffers from 
                the cold weather.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Gift className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Donation Collection</h4>
                    <p className="text-gray-600">Students, faculty, and staff donate clean, gently-used winter clothing items</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sorting & Organization</h4>
                    <p className="text-gray-600">Volunteers sort and organize donations by size, type, and condition</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Distribution</h4>
                    <p className="text-gray-600">Organized distribution to families in need across local communities</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Donation Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-green-600">✓ Acceptable Items</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Winter jackets and coats</li>
                    <li>• Sweaters and warm shirts</li>
                    <li>• Winter pants and jeans</li>
                    <li>• Scarves, gloves, and hats</li>
                    <li>• Warm socks and shoes</li>
                    <li>• Blankets and quilts</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-red-600">✗ Not Acceptable</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Damaged or torn clothing</li>
                    <li>• Stained or dirty items</li>
                    <li>• Summer clothing</li>
                    <li>• Undergarments</li>
                    <li>• Items with strong odors</li>
                    <li>• Broken or unsafe items</li>
                  </ul>
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
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">December 17-22, 2025</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">9:00 AM - 5:00 PM Daily</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Campus Collection Points</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">100+ Families</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collection Points</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Main Campus</h4>
                  <p className="text-sm text-gray-600">Student Center Lobby</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Library</h4>
                  <p className="text-sm text-gray-600">Ground Floor Entrance</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Cafeteria</h4>
                  <p className="text-sm text-gray-600">Main Dining Area</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">ESWC Office</h4>
                  <p className="text-sm text-gray-600">Room 205, Admin Building</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white text-center"
            >
              <Target className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Our Goal</h3>
              <p className="text-blue-100 mb-4">Help 100+ families stay warm this winter</p>
              <div className="text-3xl font-bold mb-2">100+</div>
              <p className="text-blue-100">Families to Support</p>
            </motion.div>
          </div>
        </div>

        {/* Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Previous Drives Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3rd Drive</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">150+</div>
              <p className="text-gray-600">Families Supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2nd Drive</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">120+</div>
              <p className="text-gray-600">Families Supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1st Drive</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">80+</div>
              <p className="text-gray-600">Families Supported</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Help?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your donation can make a significant difference in someone's life this winter. 
            Every piece of warm clothing brings comfort and hope to families in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coming">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Donate Now
              </Button>
            </Link>
            <Link href="/activities">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                Back to Activities
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
