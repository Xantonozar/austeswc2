import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NutritionPage() {
    return (
        <main className="min-h-screen bg-[#F9FBFA]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] bg-[#023015] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=2070&auto=format&fit=crop"
                        alt="Nutritional Support"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-yeseva text-white mb-6">Nutritional Support</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Ensuring health and happiness through consistent nutritional care.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20 max-w-4xl mx-auto px-4">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#EBF4E6]">
                    <div className="mb-10">
                        <span className="inline-block px-4 py-2 bg-[#EBF4E6] text-[#198042] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                            Annual Initiative
                        </span>
                        <h2 className="text-4xl font-yeseva text-[#1A2B1E] mb-6">Iftar & Feeding Programs</h2>
                        <div className="flex flex-wrap gap-6 text-[#4A7C59] font-medium mb-8">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Multiple Sessions (2024-2025)
                            </span>
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Dhaka City Points
                            </span>
                        </div>
                    </div>

                    <div className="prose prose-lg text-[#7A9080] max-w-none">
                        <p className="mb-6">
                            At AUST ESWC, we believe that nutrition is the foundation of growth. Our partnership with Mojar School focuses on providing nutritious meals to street children who often don't have access to a single stable meal a day.
                        </p>

                        <h3 className="text-2xl font-yeseva text-[#1A2B1E] mt-10 mb-4">Key Programs</h3>
                        <ul className="list-disc pl-6 space-y-4 mb-8">
                            <li><strong>Ramadan Iftar:</strong> On March 29, 2024, at Uttara Point, we hosted a massive Iftar for over 200 children, bringing the spirit of Ramadan to the streets.</li>
                            <li><strong>Regular Food Drives:</strong> On June 6, 2024, and subsequent dates, we organized protein-rich meal distributions across various points in Dhaka.</li>
                            <li><strong>Health Monitoring:</strong> Occasional health check-ups alongside food distribution to ensure the holistic well-being of the children.</li>
                        </ul>

                        <p>
                            Through these continuous efforts, we aim to bridge the nutritional gap and provide these children with the energy they need to learn and thrive.
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
