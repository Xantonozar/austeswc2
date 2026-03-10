"use client";

import { motion } from "framer-motion";
import { Calendar, Users, MapPin, ArrowLeft, Clock, Award, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Activity data - this would typically come from an API or database
const allActivities = {
  environmental: {
    upcoming: [
      {
        id: "ecochampion-2",
        title: "EcoChampion 2.0 ",
        date: "February 19, 2025",
        location: "AUST Campus",
        participants: "Open Registration",
        description: "Join us for EcoChampion 2.0 to celebrate green initiatives and tree planting. Get trees for only 30 Taka!",
        longDescription: "EcoChampion 2.0 is our flagship environmental event that brings together students, faculty, and community members to celebrate sustainability and environmental stewardship. This year's event features tree planting initiatives, environmental workshops, and interactive exhibits showcasing green technologies and sustainable practices.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1739896661/eco-champ_uyir0n.jpg",
        duration: "Full Day Event",
        requirements: "Open to all AUST students and faculty",
        highlights: [
          "Tree planting ceremony",
          "Environmental workshops",
          "Green technology exhibits",
          "Sustainable living demonstrations",
          "Community engagement activities"
        ],
        impact: "Expected to plant 500+ trees and engage 200+ participants",
        registrationDeadline: "February 15, 2025",
        contactPerson: "Environmental Committee",
        contactEmail: "environmental@austeswc.com"
      }
    ],
    past: [
      {
        id: "nature-canvas-competition",
        title: "Nature's Canvas: Roof Garden Video Making Competition",
        date: "January 19, 2024",
        impact: "Creative video submissions showcasing a greener campus",
        description: "Showcase your creativity and contribute to our green campus through this exciting video competition.",
        longDescription: "The Nature's Canvas competition challenged students to create compelling videos showcasing our campus roof garden and promoting environmental awareness. Participants submitted creative videos highlighting the beauty of nature and the importance of green spaces in urban environments.",
        image: "http://aust.edu/storage/files/Y5otl3bxRdBBSRBq85LC6jk6SGOi8aqAUhcVIRG7.jpg",
        duration: "3-week competition period",
        participants: "25+ students participated",
        highlights: [
          "Video creation workshops",
          "Expert judging panel",
          "Cash prizes for winners",
          "Exhibition of winning videos",
          "Environmental awareness campaign"
        ],
        results: "3 winners selected with prizes totaling 15,000 Taka",
        feedback: "Highly positive response from participants and viewers"
      },
      {
        id: "sparkle-shine-cleanup",
        title: "Sparkle & Shine Cleanup Campaign",
        date: "January 16, 2024",
        impact: "Collected 150kg of waste",
        description: "A campus and community cleanup drive aimed at keeping our surroundings free of waste.",
        longDescription: "The Sparkle & Shine Cleanup Campaign was a comprehensive campus and community cleanup initiative that brought together students, faculty, and local community members. The event focused on waste collection, recycling education, and promoting sustainable waste management practices.",
        image: "https://aust.edu/storage/files/WUZ5QVYPRXmAdFW7icfEfcNWUHTrNVcWmY5LdUa9.jpg",
        duration: "6-hour event",
        participants: "80+ volunteers",
        highlights: [
          "Campus-wide cleanup",
          "Community outreach",
          "Waste sorting and recycling",
          "Environmental education",
          "Team building activities"
        ],
        results: "150kg of waste collected and properly disposed",
        feedback: "Significant improvement in campus cleanliness and community awareness"
      }
    ]
  },
  welfare: {
    upcoming: [
      {
        id: "winter-clothes-drive-4",
        title: "4th Winter Clothes Drive",
        date: "December 17-22, 2025",
        location: "Campus",
        participants: "100+",
        description: "Support underprivileged communities by donating your winter clothes during our 4th drive.",
        longDescription: "Our 4th Annual Winter Clothes Drive continues our tradition of supporting underprivileged communities during the cold season. This year we aim to collect and distribute winter clothing to over 500 families in need, ensuring warmth and comfort for those who need it most.",
        image: "https://t3.ftcdn.net/jpg/03/13/59/78/360_F_313597831_Bv3LoRBJnZU7ggCQIPUtVDOdju2Ksqfu.jpg",
        duration: "6-day collection drive",
        requirements: "Clean, gently used winter clothing",
        highlights: [
          "Multiple collection points across campus",
          "Quality check and sorting",
          "Community distribution events",
          "Volunteer training sessions",
          "Impact measurement and reporting"
        ],
        impact: "Target: 500+ families to receive winter clothing",
        registrationDeadline: "Ongoing throughout the drive",
        contactPerson: "Welfare Committee",
        contactEmail: "welfare@austeswc.com"
      }
    ],
    past: [
      {
        id: "winter-clothes-distribution-2024",
        title: "Winter Clothes Distribution",
        date: "January 16, 2024",
        impact: "Distributed essential winter clothes",
        description: "A dual initiative that provided warmth to those in need and maintained a clean campus environment.",
        longDescription: "The Winter Clothes Distribution event successfully provided essential winter clothing to over 300 families in need. The event combined clothing distribution with environmental cleanup activities, demonstrating our commitment to both community welfare and environmental stewardship.",
        image: "http://aust.edu/storage/files/9hsnWLAPJW9L1gTYPBp0dH4v8wowAoPDZRtjf3bv.jpg",
        duration: "8-hour event",
        participants: "50+ volunteers",
        highlights: [
          "Clothing distribution to 300+ families",
          "Campus cleanup activities",
          "Community engagement",
          "Volunteer coordination",
          "Impact assessment"
        ],
        results: "300+ families received winter clothing, 100kg waste collected",
        feedback: "Overwhelming gratitude from recipients and community leaders"
      },
      {
        id: "winter-clothes-cleanup-2024",
        title: "Winter Clothes Distribution and Cleanup Campaign",
        date: "December 17-22, 2024",
        impact: "Distributed essential winter clothes",
        description: "A dual initiative that provided warmth to those in need and maintained a clean campus environment.",
        longDescription: "This comprehensive event combined winter clothing distribution with environmental cleanup, addressing both social welfare and environmental concerns. The initiative successfully reached multiple communities while promoting sustainable practices.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.55.34_cca12ec4_jtl4lt.jpg",
        duration: "6-day campaign",
        participants: "75+ volunteers",
        highlights: [
          "Extended clothing collection period",
          "Multiple community visits",
          "Environmental cleanup activities",
          "Volunteer training and coordination",
          "Community feedback collection"
        ],
        results: "400+ families served, 200kg waste collected",
        feedback: "Strong community partnerships established"
      },
      {
        id: "flood-relief-2024",
        title: "Flood Relief",
        date: "2024",
        impact: "Distributed essential goods",
        description: "Making a positive impact in the lives of those affected by the flood.",
        longDescription: "In response to devastating floods affecting our region, we organized a comprehensive relief effort to provide essential goods and support to affected families. The initiative focused on immediate relief and long-term recovery support.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1772103213/615395054_860158470152457_8608973001880448478_n_dbnhez.jpg",
        duration: "2-week relief operation",
        participants: "100+ volunteers",
        highlights: [
          "Emergency relief distribution",
          "Medical aid support",
          "Food and water distribution",
          "Shelter assistance",
          "Recovery planning support"
        ],
        results: "500+ families received emergency relief",
        feedback: "Critical support during crisis, strong community bonds formed"
      },
      {
        id: "blanket-cloth-donation-2",
        title: "Blanket & Cloth Donation 2.0",
        date: "February 03, 2023",
        impact: "Provided blankets to over 150 families",
        description: "A heartwarming drive to donate blankets and cloths to local communities during the cold season.",
        longDescription: "Blanket & Cloth Donation 2.0 was our second annual initiative to provide warmth and comfort to families in need during the cold season. The event successfully collected and distributed essential winter items to vulnerable communities.",
        image: "https://aust.edu/storage/files/IFeWlViuM7aUybce2sR1brrCKTI3A801r4qeGlAz.jpg",
        duration: "1-day distribution event",
        participants: "40+ volunteers",
        highlights: [
          "Blanket and clothing collection",
          "Quality assessment",
          "Community distribution",
          "Volunteer coordination",
          "Impact documentation"
        ],
        results: "150+ families received blankets and warm clothing",
        feedback: "Significant impact on community well-being during winter"
      },
      {
        id: "general-member-recruitment-2023",
        title: "General Member Recruitment - Club Fair",
        date: "December 22, 2023",
        impact: "Enlisted 69 enthusiastic new members",
        description: "At the AUST Club Fair, our booth welcomed both online and offline registrations, strengthening our community.",
        longDescription: "Our Club Fair recruitment drive was a resounding success, attracting 69 new members to join our environmental and social welfare initiatives. The event featured interactive displays, informative sessions, and engaging activities to showcase our club's mission and activities.",
        image: "https://aust.edu/storage/files/Em3z0yyhpkYZ0T26bWvtoluMBHfTwOhvELYPwXM.jpg",
        duration: "1-day recruitment fair",
        participants: "200+ students visited our booth",
        highlights: [
          "Interactive booth displays",
          "Member testimonials",
          "Activity showcases",
          "Online and offline registration",
          "Welcome packages for new members"
        ],
        results: "69 new members recruited",
        feedback: "Excellent response from students, strong interest in our initiatives"
      }
    ]
  },
  campus: {
    upcoming: [
      {
        id: "eco-fair-stall-2025",
        title: "Eco Fair Stall at Campus",
        date: "February 19, 2025",
        location: "Main Campus Plaza",
        participants: "150+",
        description: "Visit our Eco Fair Stall to explore interactive displays on sustainability and eco-friendly products.",
        longDescription: "Our Eco Fair Stall will showcase innovative sustainable products, interactive environmental displays, and educational materials about eco-friendly living. Visitors can learn about sustainable practices, participate in hands-on activities, and discover ways to reduce their environmental footprint.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1739914874/WhatsApp_Image_2025-02-19_at_03.19.31_19591f2b_jg2bnl.jpg",
        duration: "8-hour exhibition",
        requirements: "Open to all campus community",
        highlights: [
          "Sustainable product displays",
          "Interactive environmental games",
          "Eco-friendly living workshops",
          "Green technology demonstrations",
          "Student project showcases"
        ],
        impact: "Expected to educate 150+ students on sustainability",
        registrationDeadline: "No registration required",
        contactPerson: "Campus Activities Committee",
        contactEmail: "campus@austeswc.com"
      }
    ],
    past: [
      {
        id: "club-fair-2024",
        title: "Club Fair 2024: Member Recruitment Drive",
        date: "December 23-24, 2024",
        impact: "New members recruited",
        description: "Our Club Fair recruitment drive was a success, welcoming 69 enthusiastic members to join the club.",
        longDescription: "The 2024 Club Fair was a two-day event that successfully attracted new members through engaging displays, interactive activities, and comprehensive information about our club's mission and activities. The event strengthened our community and expanded our reach on campus.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1739911319/WhatsApp_Image_2025-02-19_at_01.54.24_060daa2b_hhfyrm.jpg",
        duration: "2-day recruitment fair",
        participants: "300+ students visited",
        highlights: [
          "Interactive booth activities",
          "Member success stories",
          "Activity demonstrations",
          "Online registration system",
          "Welcome orientation sessions"
        ],
        results: "69 new members recruited",
        feedback: "Strong student engagement and positive feedback"
      },
      {
        id: "club-fair-2023",
        title: "Club Fair 2023: Member Recruitment Drive",
        date: "December 22, 2023",
        impact: "New members recruited",
        description: "Our Club Fair recruitment drive was a success, welcoming 69 enthusiastic members to join the club.",
        longDescription: "The 2023 Club Fair marked our successful entry into campus recruitment events. We showcased our environmental and welfare initiatives through engaging displays and interactive activities, establishing our presence in the campus community.",
        image: "https://aust.edu/storage/files/Em3z0yyhpkYZ0T26bWvtoluMBHfTwOhvELYPwXM.jpg",
        duration: "1-day recruitment fair",
        participants: "250+ students visited",
        highlights: [
          "First-time club fair participation",
          "Environmental awareness displays",
          "Member testimonials",
          "Activity showcases",
          "Registration drive"
        ],
        results: "69 new members recruited",
        feedback: "Successful establishment of club presence on campus"
      },
      {
        id: "eco-fair-stall-2023",
        title: "Eco Fair Stall Showcase",
        date: "October 15, 2023",
        impact: "Engaged 120 students",
        description: "Our Eco Fair Stall attracted over 120 students, promoting sustainable practices and eco-friendly innovations on campus.",
        longDescription: "The Eco Fair Stall Showcase was our first major campus exhibition focused on environmental sustainability. The event featured student projects, sustainable product displays, and interactive workshops that educated participants about eco-friendly living practices.",
        image: "https://img.freepik.com/free-photo/white-background_23-2147730801.jpg",
        duration: "6-hour showcase",
        participants: "120+ students engaged",
        highlights: [
          "Student project exhibitions",
          "Sustainable product displays",
          "Interactive workshops",
          "Environmental education",
          "Community engagement"
        ],
        results: "120+ students educated on sustainability",
        feedback: "High student interest and engagement levels"
      },
      {
        id: "seminar-sustainability-2024",
        title: "Seminar on Sustainability",
        date: "January 16, 2024",
        impact: "Enhanced knowledge on sustainable practices",
        description: "Join industry experts as they discuss innovative strategies and sustainable practices for a greener future.",
        longDescription: "Our Seminar on Sustainability brought together industry experts, academics, and students to discuss innovative strategies for sustainable development. The event featured keynote speakers, panel discussions, and interactive sessions on environmental stewardship and sustainable practices.",
        image: "https://aust.edu/storage/files/At2ULZvxSDkGyoi8tnZDAJCCZ5eHDy5OkeAFygep.jpg",
        duration: "4-hour seminar",
        participants: "80+ attendees",
        highlights: [
          "Expert keynote speakers",
          "Panel discussions",
          "Interactive Q&A sessions",
          "Networking opportunities",
          "Resource materials distribution"
        ],
        results: "Enhanced understanding of sustainable practices among participants",
        feedback: "Valuable insights and practical knowledge gained"
      },
      {
        id: "world-environment-day-2023",
        title: "World Environment Day Celebration - Green Today, Clean Tomorrow!",
        date: "June 05, 2023",
        impact: "Raised awareness and promoted sustainable practices",
        description: "Celebrated World Environment Day by gifting indoor plants to university officials and emphasizing environmental stewardship.",
        longDescription: "Our World Environment Day celebration emphasized the importance of environmental stewardship through symbolic gestures and educational activities. We gifted indoor plants to university officials and organized awareness campaigns promoting sustainable practices and environmental responsibility.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1739911320/WhatsApp_Image_2025-02-19_at_02.02.07_ebd89547_t3nfs9.jpg",
        duration: "1-day celebration",
        participants: "100+ community members",
        highlights: [
          "Indoor plant distribution",
          "Environmental awareness campaigns",
          "Sustainable practice demonstrations",
          "Community engagement",
          "Symbolic environmental commitment"
        ],
        results: "Increased environmental awareness and symbolic commitment",
        feedback: "Positive response from university officials and community"
      },
      {
        id: "environmental-quiz-2024",
        title: "Environmental Quiz Competition",
        date: "January 15, 2024",
        impact: "Engaged over 50 students",
        description: "Test your knowledge on environmental issues and win exciting prizes in this fun quiz event.",
        longDescription: "The Environmental Quiz Competition was an engaging educational event that tested students' knowledge of environmental issues, climate change, and sustainable practices. The competition featured multiple rounds, exciting prizes, and valuable learning opportunities for all participants.",
        image: "http://aust.edu/storage/files/KJiUn6ewdj6gQauoaUa0qPuFClJ5s77Zn9oRIT3.jpg",
        duration: "3-hour competition",
        participants: "50+ students competed",
        highlights: [
          "Multiple quiz rounds",
          "Environmental knowledge testing",
          "Exciting prizes",
          "Educational content",
          "Competitive spirit"
        ],
        results: "3 winners selected, 50+ students educated",
        feedback: "High engagement and educational value"
      },
      {
        id: "beat-the-heat-2024",
        title: "Beat the Heat",
        date: "May 4, 2024",
        location: "Campus Quad",
        participants: "30+",
        description: "Enjoy refreshing juices and healthy snacks while learning about sustainable living in our summer initiative.",
        longDescription: "Beat the Heat was our summer initiative that combined refreshment with education. Students enjoyed healthy juices and snacks while learning about sustainable living practices, summer wellness, and environmental conservation during hot weather.",
        image: "https://aust.edu/assets/images/austeswc_juicebar.jpg",
        duration: "4-hour event",
        participants: "30+ students participated",
        highlights: [
          "Healthy juice bar",
          "Sustainable living workshops",
          "Summer wellness tips",
          "Environmental education",
          "Community refreshment"
        ],
        results: "30+ students educated on sustainable summer practices",
        feedback: "Refreshing and educational summer activity"
      }
    ]
  }
};

export default function ActivityDetail() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.category && params.id) {
      const categoryActivities = allActivities[params.category];
      if (categoryActivities) {
        const foundActivity = [
          ...(categoryActivities.upcoming || []),
          ...(categoryActivities.past || [])
        ].find(act => act.id === params.id);

        if (foundActivity) {
          setActivity(foundActivity);
        }
      }
      setLoading(false);
    }
  }, [params.category, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen pt-20 bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Activity Not Found</h1>
          <p className="text-gray-600 mb-6">The activity you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} className="rounded-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isUpcoming = allActivities[params.category]?.upcoming?.some(act => act.id === params.id);

  return (
    <div className="min-h-screen pt-20 bg-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </Button>
        </motion.div>

        {/* Activity Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${activity.image})` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isUpcoming ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                    {isUpcoming ? 'Upcoming' : 'Past Event'}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{activity.title}</h1>
                <div className="flex items-center gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {activity.date}
                  </div>
                  {activity.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {activity.location}
                    </div>
                  )}
                  {activity.participants && (
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {activity.participants}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Event</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {activity.longDescription || activity.description}
              </p>
            </div>

            {/* Highlights */}
            {activity.highlights && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Event Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results/Impact */}
            {activity.results && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Results & Impact</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{activity.results}</p>
              </div>
            )}

            {/* Feedback */}
            {activity.feedback && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Community Feedback</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{activity.feedback}</p>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Event Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Date</p>
                    <p className="text-gray-600">{activity.date}</p>
                  </div>
                </div>

                {activity.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Duration</p>
                      <p className="text-gray-600">{activity.duration}</p>
                    </div>
                  </div>
                )}

                {activity.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Location</p>
                      <p className="text-gray-600">{activity.location}</p>
                    </div>
                  </div>
                )}

                {activity.participants && (
                  <div className="flex items-center gap-3">
                    <Users2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Participants</p>
                      <p className="text-gray-600">{activity.participants}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration/Contact */}
            {isUpcoming && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Get Involved</h3>
                <div className="space-y-4">
                  {activity.requirements && (
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Requirements</p>
                      <p className="text-gray-600 text-sm">{activity.requirements}</p>
                    </div>
                  )}

                  {activity.registrationDeadline && (
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Registration Deadline</p>
                      <p className="text-gray-600 text-sm">{activity.registrationDeadline}</p>
                    </div>
                  )}

                  <Link href="/coming" className="w-full">
                    <Button className="w-full rounded-full">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {activity.contactPerson && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-800">Contact Person</p>
                    <p className="text-gray-600">{activity.contactPerson}</p>
                  </div>
                  {activity.contactEmail && (
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">{activity.contactEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Make a Difference?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join us in our upcoming activities and help create a positive change in our community and environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/activities">
                <Button variant="outline" className="rounded-full">
                  View All Activities
                </Button>
              </Link>
              <Link href="/coming">
                <Button className="rounded-full">
                  Get Involved
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


