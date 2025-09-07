'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Award, Video, Camera, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NaturesCanvasArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-4"
            >
              Nature's Canvas: Roof Garden Video Making Competition
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl max-w-2xl mx-auto"
            >
              Showcasing Creativity and Environmental Awareness Through Video Art
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Competition</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nature's Canvas was an innovative video making competition that challenged students to showcase 
                their creativity while highlighting the importance of green spaces and environmental conservation. 
                Participants created compelling video content featuring our campus roof garden, demonstrating how 
                urban green spaces contribute to sustainability and community well-being.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Competition Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Video className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Creative Video Submissions</h4>
                    <p className="text-gray-600">Students submitted innovative videos showcasing the roof garden from unique perspectives</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Camera className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Environmental Storytelling</h4>
                    <p className="text-gray-600">Videos highlighted the ecological benefits and beauty of urban green spaces</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Recognition & Prizes</h4>
                    <p className="text-gray-600">Outstanding submissions were recognized with awards and certificates</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Competition Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Documentary Style</h4>
                  <p className="text-gray-600">Educational videos explaining the benefits of roof gardens</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Creative Storytelling</h4>
                  <p className="text-gray-600">Narrative videos with environmental themes</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Aerial & Cinematic</h4>
                  <p className="text-gray-600">Beautiful visual showcases of the garden</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Student Life</h4>
                  <p className="text-gray-600">Videos showing how students interact with the space</p>
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
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">January 19, 2024</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">All Day Event</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Campus Roof Garden</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Open to All Students</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Submission Guidelines</h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Video Length</h4>
                  <p className="text-sm text-gray-600">3-5 minutes maximum</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Format</h4>
                  <p className="text-sm text-gray-600">MP4, MOV, or AVI</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Resolution</h4>
                  <p className="text-sm text-gray-600">Minimum 1080p HD</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white text-center"
            >
              <Trophy className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Winners Announced</h3>
              <p className="text-purple-100 mb-4">Check out the winning submissions</p>
              <div className="text-3xl font-bold mb-2">🏆</div>
              <p className="text-purple-100">Creative Excellence</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Competition Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
              <p className="text-gray-600">Video Submissions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">150+</div>
              <p className="text-gray-600">Students Engaged</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-600">Environmental Focus</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Inspiring Environmental Creativity</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This competition demonstrated how creative expression can raise awareness about environmental 
            issues and inspire others to appreciate and protect our green spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/activities">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Back to Activities
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3">
                View Gallery
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
