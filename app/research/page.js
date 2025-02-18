"use client"
import { motion } from "framer-motion";
import { BookOpen, Download, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const researchPapers = {
  environmental: [
    {
      title: "Impact of Urban Green Spaces on Air Quality",
      authors: "Dr. Sarah Johnson, Dr. Michael Chen",
      date: "2024",
      abstract: "This study examines the relationship between urban green spaces and air quality improvements in metropolitan areas.",
      downloads: 234
    },
    {
      title: "Sustainable Water Management Practices",
      authors: "Prof. Emily Williams, Dr. David Lee",
      date: "2023",
      abstract: "An analysis of innovative water conservation methods and their implementation in urban settings.",
      downloads: 189
    }
  ],
  climate: [
    {
      title: "Local Climate Action Initiatives",
      authors: "Dr. Robert Brown, Prof. Lisa Garcia",
      date: "2024",
      abstract: "Evaluating the effectiveness of community-led climate change mitigation strategies.",
      downloads: 156
    },
    {
      title: "Carbon Footprint Reduction Strategies",
      authors: "Dr. Amanda Thompson, Dr. James Wilson",
      date: "2023",
      abstract: "A comprehensive study of successful carbon reduction programs in educational institutions.",
      downloads: 201
    }
  ]
};

export default function Research() {
  return (
    <div className="min-h-screen pt-0">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-6">Research & Publications</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our latest research findings and publications in environmental science and sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Papers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="environmental" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="environmental">Environmental Studies</TabsTrigger>
              <TabsTrigger value="climate">Climate Research</TabsTrigger>
            </TabsList>
            
            <TabsContent value="environmental">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {researchPapers.environmental.map((paper, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-start gap-4">
                          <BookOpen className="w-6 h-6 text-primary" />
                          {paper.title}
                        </CardTitle>
                        <CardDescription>
                          By {paper.authors} • {paper.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{paper.abstract}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {paper.downloads} downloads
                          </span>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="climate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {researchPapers.climate.map((paper, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-start gap-4">
                          <BookOpen className="w-6 h-6 text-primary" />
                          {paper.title}
                        </CardTitle>
                        <CardDescription>
                          By {paper.authors} • {paper.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{paper.abstract}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {paper.downloads} downloads
                          </span>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Research Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Research Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join our research team and contribute to environmental science and sustainability studies.
            </p>
            <Button className="rounded-full">
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

