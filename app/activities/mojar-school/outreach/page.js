import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function OutreachPage() {
    return (
        <main className="min-h-screen bg-[#F9FBFA]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] bg-[#023015] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                        alt="Outreach Program"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-yeseva text-white mb-6">Community Outreach</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Brightening futures through education and interaction in rural Bangladesh.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20 max-w-4xl mx-auto px-4">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#EBF4E6]">
                    <div className="mb-10">
                        <span className="inline-block px-4 py-2 bg-[#EBF4E6] text-[#198042] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                            Event Details
                        </span>
                        <h2 className="text-4xl font-yeseva text-[#1A2B1E] mb-6">Padampur High School Outreach</h2>
                        <div className="flex flex-wrap gap-6 text-[#4A7C59] font-medium mb-8">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                September 19, 2025
                            </span>
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Ranishonkoil, Thakurgaon
                            </span>
                        </div>
                    </div>

                    <div className="prose prose-lg text-[#7A9080] max-w-none">
                        <p className="mb-6">
                            On September 19, 2025, the AUST Environmental and Social Welfare Club (AUST ESWC) embarked on a journey to Ranishonkoil, Thakurgaon, to conduct a community outreach program at Padampur High School in collaboration with Mojar School.
                        </p>

                        <h3 className="text-2xl font-yeseva text-[#1A2B1E] mt-10 mb-4">Activities & Impact</h3>
                        <ul className="list-disc pl-6 space-y-4 mb-8">
                            <li><strong>Fun Seminars:</strong> Interactive sessions focusing on career goals and personal hygiene, designed to inspire and educate.</li>
                            <li><strong>Science Projects:</strong> Live demonstrations of science experiments that captivated the students and sparked their curiosity.</li>
                            <li><strong>Interactive Games:</strong> Sports and brain games to foster teamwork and provide a day of pure joy.</li>
                            <li><strong>Gifts & Support:</strong> Distribution of educational supplies and tokens of appreciation to every child.</li>
                        </ul>

                        <p>
                            This initiative was part of our ongoing commitment to provide educational support and emotional enrichment to underprivileged children across the country.
                        </p>
                    </div>

                    <div className="mt-16 pt-10 border-t border-[#EBF4E6]">
                        <Link href="/" className="inline-flex items-center text-[#198042] font-bold hover:gap-2 transition-all">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
