'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Leaf, ShoppingBag, Lightbulb, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EcoFairStallArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-4"
            >
              Eco Fair Stall at Campus
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl max-w-2xl mx-auto"
            >
              Explore Interactive Displays on Sustainability and Eco-Friendly Products
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Eco Fair</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our Eco Fair Stall is a vibrant showcase of sustainable living and environmental innovation. 
                This interactive event brings together students, faculty, and local vendors to demonstrate 
                practical ways to live more sustainably while supporting eco-friendly businesses and initiatives.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What You'll Experience</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Leaf className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sustainable Product Showcase</h4>
                    <p className="text-gray-600">Discover eco-friendly alternatives to everyday products, from reusable items to organic goods</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Interactive Workshops</h4>
                    <p className="text-gray-600">Learn practical skills like composting, DIY cleaning products, and sustainable living tips</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Environmental Education</h4>
                    <p className="text-gray-600">Engage with informative displays about climate change, biodiversity, and conservation</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Featured Products & Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-emerald-600">♻️ Reusable Products</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Bamboo utensils and straws</li>
                    <li>• Reusable water bottles</li>
                    <li>• Cloth shopping bags</li>
                    <li>• Beeswax food wraps</li>
                    <li>• Stainless steel containers</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-emerald-600">🌱 Organic & Natural</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Organic skincare products</li>
                    <li>• Natural cleaning supplies</li>
                    <li>• Herbal teas and remedies</li>
                    <li>• Eco-friendly cosmetics</li>
                    <li>• Sustainable fashion items</li>
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
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">February 19, 2025</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">10:00 AM - 6:00 PM</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">Main Campus Plaza</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">150+ Students</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workshop Schedule</h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">11:00 AM</h4>
                  <p className="text-sm text-gray-600">DIY Natural Cleaners</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">2:00 PM</h4>
                  <p className="text-sm text-gray-600">Composting Basics</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">4:00 PM</h4>
                  <p className="text-sm text-gray-600">Sustainable Living Tips</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white text-center"
            >
              <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Special Offers</h3>
              <p className="text-emerald-100 mb-4">Student discounts available</p>
              <div className="text-3xl font-bold mb-2">20% OFF</div>
              <p className="text-emerald-100">For AUST Students</p>
            </motion.div>
          </div>
        </div>

        {/* Vendor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Vendors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-emerald-50 rounded-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Green Living Co.</h4>
              <p className="text-gray-600 mb-3">Eco-friendly household products</p>
              <div className="text-sm text-emerald-600">Featured Products</div>
            </div>
            <div className="text-center p-6 bg-emerald-50 rounded-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Nature's Touch</h4>
              <p className="text-gray-600 mb-3">Organic skincare and wellness</p>
              <div className="text-sm text-emerald-600">Featured Products</div>
            </div>
            <div className="text-center p-6 bg-emerald-50 rounded-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Sustainable Style</h4>
              <p className="text-gray-600 mb-3">Eco-conscious fashion items</p>
              <div className="text-sm text-emerald-600">Featured Products</div>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Go Green?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join us at the Eco Fair Stall to discover sustainable alternatives and learn how to make 
            environmentally conscious choices in your daily life. Every small change makes a big difference!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coming">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                Visit Stall
              </Button>
            </Link>
            <Link href="/activities">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3">
                Back to Activities
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
