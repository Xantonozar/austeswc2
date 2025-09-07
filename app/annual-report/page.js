'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, FileText, TrendingUp, Users, Award, ChevronRight } from 'lucide-react';

export default function AnnualReport() {
  const [selectedSemester, setSelectedSemester] = useState('spring2024');

  const reports = {
    spring2024: {
      title: 'Spring 2024 Annual Report',
      description: 'Comprehensive overview of ESWC activities, achievements, and impact during Spring 2024 semester',
      highlights: [
        'Organized 15+ environmental awareness events',
        'Reached 500+ students through various programs',
        'Launched new sustainability research initiative',
        'Partnership with 3 local environmental organizations',
        'Increased membership by 40% compared to previous semester'
      ],
      stats: {
        events: 15,
        participants: 500,
        partnerships: 3,
        growth: '40%'
      },
      pdfUrl: '/reports/spring2024-report.pdf',
      available: true
    },
    fall2023: {
      title: 'Fall 2023 Annual Report',
      description: 'Detailed report covering ESWC achievements and community impact during Fall 2023',
      highlights: [
        'Successfully hosted annual sustainability conference',
        'Implemented campus-wide recycling program',
        'Collaborated with faculty on research projects',
        'Organized tree planting campaign',
        'Achieved 95% member satisfaction rate'
      ],
      stats: {
        events: 12,
        participants: 450,
        partnerships: 2,
        growth: '25%'
      },
      pdfUrl: '/reports/fall2023-report.pdf',
      available: true
    },
    spring2023: {
      title: 'Spring 2023 Annual Report',
      description: 'ESWC activities and accomplishments during Spring 2023 semester',
      highlights: [
        'Launched environmental education workshops',
        'Participated in national sustainability competition',
        'Established mentorship program for new members',
        'Organized beach cleanup initiative',
        'Received recognition for community service'
      ],
      stats: {
        events: 10,
        participants: 380,
        partnerships: 1,
        growth: '15%'
      },
      pdfUrl: '/reports/spring2023-report.pdf',
      available: true
    }
  };

  const handleDownload = (pdfUrl) => {
    // In a real application, this would trigger a download
    // For now, we'll just show an alert
    alert('Download started! In production, this would download the PDF file.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Section */}
      <div className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-emerald-900 mb-4 tracking-tight">
              Annual Reports
            </h1>
            <p className="text-lg text-emerald-700 leading-relaxed">
              Discover the impact and achievements of the Environmental Science and Wildlife Conservation Club 
              through our comprehensive semester reports.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-bold text-emerald-900 mb-2">37+</h3>
            <p className="text-emerald-700 font-medium">Total Events</p>
          </div>
          
          <div className="text-center group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-teal-200/50 transition-all duration-300">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-3xl font-bold text-teal-900 mb-2">1,330+</h3>
            <p className="text-teal-700 font-medium">Total Participants</p>
          </div>
          
          <div className="text-center group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-200/50 transition-all duration-300">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-green-900 mb-2">6</h3>
            <p className="text-green-700 font-medium">Partnerships</p>
          </div>
          
          <div className="text-center group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-200/50 transition-all duration-300">
              <FileText className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-3xl font-bold text-cyan-900 mb-2">3</h3>
            <p className="text-cyan-700 font-medium">Reports Available</p>
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Semester Reports</h2>
            <p className="text-emerald-700 max-w-2xl mx-auto">
              Access detailed reports for each semester, including comprehensive data on our activities, 
              achievements, and community impact.
            </p>
          </div>
          
          <Tabs defaultValue="spring2024" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-emerald-50 p-1 rounded-xl border border-emerald-200">
              <TabsTrigger value="spring2024" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-900 data-[state=active]:border-emerald-200 transition-all duration-200">
                Spring 2024
              </TabsTrigger>
              <TabsTrigger value="fall2023" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-900 data-[state=active]:border-emerald-200 transition-all duration-200">
                Fall 2023
              </TabsTrigger>
              <TabsTrigger value="spring2023" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-900 data-[state=active]:border-emerald-200 transition-all duration-200">
                Spring 2023
              </TabsTrigger>
            </TabsList>

            {Object.entries(reports).map(([key, report]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                <Card className="bg-white border border-emerald-200 shadow-sm hover:shadow-lg hover:shadow-emerald-200/30 transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-emerald-900 mb-3">{report.title}</CardTitle>
                        <CardDescription className="text-base text-emerald-700 leading-relaxed">{report.description}</CardDescription>
                      </div>
                      <div className="flex-shrink-0">
                        <Button 
                          onClick={() => handleDownload(report.pdfUrl)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-300/50"
                          disabled={!report.available}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8">
                    {/* Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transform hover:scale-105 transition-all duration-200">
                        <div className="text-2xl font-bold text-emerald-900 mb-1">{report.stats.events}</div>
                        <div className="text-sm text-emerald-700 font-medium">Events</div>
                      </div>
                      <div className="text-center p-6 bg-teal-50 rounded-xl border border-teal-100 hover:bg-teal-100 hover:border-teal-200 transform hover:scale-105 transition-all duration-200">
                        <div className="text-2xl font-bold text-teal-900 mb-1">{report.stats.participants}</div>
                        <div className="text-sm text-teal-700 font-medium">Participants</div>
                      </div>
                      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 hover:border-green-200 transform hover:scale-105 transition-all duration-200">
                        <div className="text-2xl font-bold text-green-900 mb-1">{report.stats.partnerships}</div>
                        <div className="text-sm text-green-700 font-medium">Partnerships</div>
                      </div>
                      <div className="text-center p-6 bg-cyan-50 rounded-xl border border-cyan-100 hover:bg-cyan-100 hover:border-cyan-200 transform hover:scale-105 transition-all duration-200">
                        <div className="text-2xl font-bold text-cyan-900 mb-1">{report.stats.growth}</div>
                        <div className="text-sm text-cyan-700 font-medium">Growth</div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-900 mb-4">Key Highlights</h4>
                      <div className="grid gap-3">
                        {report.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 hover:border-emerald-200 border border-transparent transform hover:scale-[1.02] transition-all duration-200">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-emerald-700 text-sm leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3 text-emerald-700 mb-3">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium">Report Period</span>
                      </div>
                      <p className="text-emerald-700 text-sm leading-relaxed">
                        This report covers all activities, events, and achievements during the {key.includes('spring') ? 'Spring' : 'Fall'} semester.
                        Detailed financial statements, member statistics, and future plans are included in the full PDF document.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 p-12 rounded-2xl border border-emerald-200 hover:shadow-lg hover:shadow-emerald-200/30 transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">Stay Updated</h3>
          <p className="text-emerald-700 mb-8 max-w-2xl mx-auto text-base leading-relaxed">
            New reports are published at the end of each semester. Subscribe to our newsletter 
            to be notified when the latest reports are available.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-300/50">
            Subscribe to Updates
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
