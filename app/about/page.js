"use client"; // Required for Framer Motion with Next.js App Router

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-0">
      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/eswclogo.png" // Assuming the logo file is named 'logo.png'
                alt="Logo"
                width={200}
                height={200}
              />
            </div>
            <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AUSTESWC is dedicated to fostering environmental awareness and taking concrete action to protect our planet through research, education, and community engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Heart className="w-8 h-8" />, title: "Passion", description: "Driven by love for our environment" },
              { icon: <Globe className="w-8 h-8" />, title: "Impact", description: "Creating Broad environmental change" },
              { icon: <Users className="w-8 h-8" />, title: "Community", description: "Building a network of change-makers" },
              { icon: <Award className="w-8 h-8" />, title: "Excellence", description: "Committed to quality research" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="text-primary mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Our History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                The AUST Environmental and Social Welfare Club (AUSTESWC) was founded by a group of passionate students at Ahsanullah University of Science and Technology (AUST) who believed in the power of collective action to address environmental and social issues. The club was established with the vision of creating a more sustainable and compassionate society, starting within the university and expanding to the broader community..
                </p>
                <p className="text-gray-600 mb-4">
                AUSTESWC was initiated by a group of environmentally conscious students and faculty members who recognized the need for structured initiatives to combat pollution, promote sustainability, and support social causes. These founding members came from various engineering and science disciplines, bringing a diverse set of skills and perspectives. They saw the university as the perfect place to foster awareness, inspire action, and create a lasting impact
                </p>
                <p className="text-gray-600">
                AUSTESWC aims to become a driving force for positive change, inspiring students to be responsible citizens. The club is continuously expanding its activities and partnerships to make a bigger impact on society. With an increasing number of student volunteers and successful initiatives, the club envisions a future where AUST students play a leading role in building a greener and more equitable world.
                </p>
              </div>
              <div className="relative w-full h-64 md:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f"
                  alt="Environmental Action"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: "1000+", label: "People Helped" },
                { number: "500+", label: "Active Members" },
                { number: "25+", label: "Event Organized" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="p-6 bg-white rounded-lg shadow-sm"
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of our journey to create a more sustainable future. Join AUSTESWC today and make a difference.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="rounded-full">Join Now</Button>
              </Link>
              <Link href="/donate">
                <Button size="lg" variant="outline" className="rounded-full">Support Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}