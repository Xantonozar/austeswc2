import Link from 'next/link';

export default function ThakurgaonOutreach() {
    return (
        <main className="min-h-screen bg-[#F9FBFA]">

            <div className="relative h-[60vh] bg-[#023015] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://res.cloudinary.com/chirkut/image/upload/v1772103213/615395054_860158470152457_8608973001880448478_n_dbnhez.jpg"
                        alt="Thakurgaon Outreach Hero"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        Mojar School Campaign
                    </span>
                    <h1 className="text-5xl md:text-7xl font-yeseva text-white mb-6 uppercase">Thakurgaon Outreach</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Engaging minds and fostering hope in North Bengal.
                    </p>
                </div>
            </div>

            <section className="py-20 max-w-4xl mx-auto px-4">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                    <div className="mb-10">
                        <span className="inline-block px-4 py-2 bg-green-50 text-[#198042] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                            Social Welfare
                        </span>
                        <h2 className="text-4xl font-yeseva text-[#1A2B1E] mb-6">Padampur High School Visit</h2>
                        <div className="flex flex-wrap gap-6 text-gray-500 font-medium mb-8">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                August 13, 2025
                            </span>
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Ranishonkoil, Thakurgaon
                            </span>
                        </div>
                    </div>

                    <div className="prose prose-lg text-gray-600 max-w-none">
                        <p className="mb-6">
                            AUSTESWC members traveled to North Bengal to conduct an extensive outreach program at Padampur High School, focusing on educational empowerment and environmental responsibility.
                        </p>

                        <h3 className="text-2xl font-yeseva text-[#1A2B1E] mt-10 mb-4">Highlights</h3>
                        <p className="mb-6 leading-relaxed">
                            This campaign focused on bridging the gap between urban and rural education. We organized interactive workshops that allowed students to explore environmental concepts through hands-on experiments.
                        </p>
                        <ul className="list-disc pl-6 space-y-4 mb-8">
                            <li><strong>Environmental Sessions:</strong> Teaching students about local biodiversity and sustainability.</li>
                            <li><strong>Interactive Learning:</strong> Group activities designed to boost confidence and analytical thinking.</li>
                            <li><strong>Welfare Support:</strong> Distributed educational kits and health supplies.</li>
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
