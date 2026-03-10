import Link from 'next/link';

export default function CumillaOutreach() {
    return (
        <main className="min-h-screen bg-[#F9FBFA]">

            <div className="relative h-[60vh] bg-[#023015] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
                        alt="Cumilla Outreach Hero"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        Mojar School Campaign
                    </span>
                    <h1 className="text-5xl md:text-7xl font-yeseva text-white mb-6 uppercase">Cumilla Outreach</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Spreading knowledge and environmental awareness in the east.
                    </p>
                </div>
            </div>

            <section className="py-20 max-w-4xl mx-auto px-4">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                    <div className="mb-10">
                        <span className="inline-block px-4 py-2 bg-green-50 text-[#198042] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                            Nationwide Journey
                        </span>
                        <h2 className="text-4xl font-yeseva text-[#1A2B1E] mb-6">Little Moon High School Visit</h2>
                        <div className="flex flex-wrap gap-6 text-gray-500 font-medium mb-8">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                January 8, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Cumilla
                            </span>
                        </div>
                    </div>

                    <div className="prose prose-lg text-gray-600 max-w-none">
                        <p className="mb-6">
                            As part of AUSTESWC's mission to reach every corner of Bangladesh, our team visited Cumilla to engage with the bright minds at Little Moon High School.
                        </p>

                        <h3 className="text-2xl font-yeseva text-[#1A2B1E] mt-10 mb-4">Activities</h3>
                        <p className="mb-6 leading-relaxed">
                            The "Mojar School Campaign" in Cumilla focused on small, achievable steps for environmental preservation. We engaged with over 50 students in a vibrant atmosphere of learning and mutual respect.
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8">
                            <li><strong>Educational Workshops:</strong> Focused on waste management and recycling practices.</li>
                            <li><strong>Material Distribution:</strong> Provided notebooks, pens, and eco-friendly bags to students.</li>
                            <li><strong>Interactive Session:</strong> A Q&A session where students shared their visions for a cleaner environment.</li>
                        </ul>
                    </div>

                    <div className="mt-16 pt-10 border-t border-gray-100">
                        <Link href="/" className="inline-flex items-center text-[#198042] font-bold hover:gap-2 transition-all">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
