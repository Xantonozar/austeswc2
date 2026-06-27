import Link from 'next/link';

export default function GreenovaPage() {
    const galleryImages = [
        "/greenova.png",
        // Add more images here when available
    ];

    return (
        <main className="min-h-screen bg-[#F9FBFA]">

            <div className="relative h-[50vh] md:h-[65vh] bg-[#0B251F] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src={galleryImages[0]}
                        alt="Greenova Hero"
                        className="w-full h-full object-contain scale-110"
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        National Event 2026
                    </span>
                    <h1 className="text-4xl md:text-8xl font-yeseva text-white mb-4 md:mb-6 uppercase">Greenova</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
                        Innovate for Impact
                    </p>
                </div>
            </div>

            <section className="py-12 md:py-24 max-w-6xl mx-auto px-4">
                <div className="bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12">
                            <span className="inline-block px-4 py-2 bg-green-50 text-[#1B4B43] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                                Organized by AUSTESWC
                            </span>
                            <h2 className="text-3xl md:text-5xl font-yeseva text-[#1A2B1E] mb-6 md:mb-8 leading-tight">GreeNova 2026 — Innovate for Impact</h2>
                            <div className="flex flex-wrap gap-4 md:gap-8 text-gray-500 font-medium mb-8 md:mb-10 border-b border-gray-100 pb-8 md:pb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    5 April 2026
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    Ahsanullah University of Science and Technology
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-xl text-gray-600 max-w-none mb-16 space-y-8">
                            <p className="leading-relaxed">
                                When the AUST Environmental and Social Welfare Club envisioned GreeNova, the goal was simple but ambitious: to build something bigger than a competition. The result was GreeNova 2026 — <em>Innovate for Impact</em> — a national platform that brought together the brightest young minds from universities across Bangladesh to think, create, and act for a greener future.
                            </p>
                            <p className="leading-relaxed">
                                Held on <strong>5 April 2026</strong> at the campus of Ahsanullah University of Science and Technology, GreeNova was unlike anything the university had hosted before. It wasn't a single event — it was an ecosystem of ideas, energy, and environmental purpose, unfolding across multiple distinctive segments in a single day.
                            </p>

                            <h3 className="text-2xl md:text-3xl font-yeseva text-[#1A2B1E] mt-8 md:mt-12 mb-4 md:mb-6">A Platform, Not Just a Competition</h3>
                            <p className="leading-relaxed">
                                At its heart, GreeNova was designed to give students more than one way to contribute. Whether through knowledge, creativity, innovation, or performance, every participant had a role to play. The event featured five core segments, each serving a unique purpose in the wider mission of environmental awareness and action.
                            </p>

                            <div className="bg-[#F9FBFA] p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-green-100/50 my-8 md:my-12 space-y-6 md:space-y-8">
                                <h3 className="text-2xl md:text-3xl font-yeseva text-[#1A2B1E] mb-4 md:mb-6">The Segments</h3>
                                
                                <div>
                                    <h4 className="text-2xl font-bold text-[#1B4B43] flex items-center gap-2 mb-3">
                                        <span>🎤</span> Seminar
                                    </h4>
                                    <p className="text-lg">The GreeNova Seminar set the intellectual tone for the day. Featuring guest speakers, academics, and industry professionals, it explored the most pressing environmental challenges facing Bangladesh and the world — from climate change and resource scarcity to sustainable industry practices. Attendees left not just informed, but inspired.</p>
                                </div>
                                
                                <div>
                                    <h4 className="text-2xl font-bold text-[#1B4B43] flex items-center gap-2 mb-3">
                                        <span>💡</span> Eco Pitch
                                    </h4>
                                    <p className="text-lg">Eco Pitch gave student innovators a stage to present their big ideas. Participants submitted abstracts and pitched their sustainable solutions to a panel of judges, making a case for why their concept could make a real difference. It was part research showcase, part entrepreneurial challenge — and entirely focused on turning environmental thinking into actionable proposals.</p>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1B4B43] flex items-center gap-2 mb-3">
                                        <span>📸</span> Eco Capture
                                    </h4>
                                    <p className="text-lg">A picture speaks a thousand words — and Eco Capture proved it. This photography segment challenged participants to document environmental realities through their lenses, capturing moments that reflect both the beauty of nature and the urgency of protecting it. It was a reminder that storytelling through imagery can be just as powerful as any policy paper or pitch deck.</p>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1B4B43] flex items-center gap-2 mb-3">
                                        <span>🔔</span> Green Buzzer Battle
                                    </h4>
                                    <p className="text-lg">The Green Buzzer Battle brought the energy. A fast-paced, high-stakes quiz competition on environmental topics, it tested participants' knowledge of ecology, sustainability, climate science, and green innovation. Teams buzzed in, competed fiercely, and showed that being environmentally literate can be just as thrilling as any sport.</p>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-bold text-[#1B4B43] flex items-center gap-2 mb-3">
                                        <span>🌿</span> Eco Fair
                                    </h4>
                                    <p className="text-lg">The Eco Fair was the heartbeat of GreeNova — a vibrant open marketplace where stalls offered eco-friendly products and saplings at remarkably low prices, making sustainability accessible to everyone on campus. It wasn't just an exhibition — it was an invitation. An invitation to take something home, plant it, nurture it, and carry the spirit of GreeNova beyond the event itself. Perhaps the most tangible reminder of what this platform stands for: that going green doesn't have to be expensive, and that small acts — like buying a sapling — can grow into something much larger.</p>
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-yeseva text-[#1A2B1E] mt-8 md:mt-12 mb-4 md:mb-6">More Than an Event</h3>
                            <p className="leading-relaxed">
                                GreeNova 2026 was a statement. It demonstrated that young people in Bangladesh are not waiting for someone else to solve the planet's problems — they are ready to lead the charge themselves. AUSTESWC, guided by its motto <em>"Save Environment, Save People and Save the Society,"</em> created a space where passion meets purpose, and where innovation is celebrated at every level.
                            </p>
                            <p className="leading-relaxed">
                                The conversations started at GreeNova don't end when the day does. They carry forward into labs, classrooms, communities, and careers — because that is exactly what this platform was built for.
                            </p>

                            <p className="text-xs md:text-sm italic text-gray-400 mt-8 md:mt-12 text-center">
                                GreeNova is organized by the AUST Environmental and Social Welfare Club (AUSTESWC), Ahsanullah University of Science and Technology, Dhaka, Bangladesh.
                            </p>

                            <h3 className="text-2xl md:text-3xl font-yeseva text-[#1A2B1E] mt-12 md:mt-16 mb-6 text-center">Event Gallery</h3>
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className="break-inside-avoid overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                        <img
                                            src={img}
                                            alt={`Greenova Gallery ${idx + 1}`}
                                            className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#1A2B1E] text-white p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-center mt-12 md:mt-20">
                            <h3 className="text-2xl md:text-3xl font-yeseva mb-4">Be Part of the Solution</h3>
                            <p className="text-white/80 max-w-xl mx-auto mb-8 text-base md:text-lg">
                                Support our initiatives and join us in creating a sustainable future. Every small action counts towards a greener tomorrow.
                            </p>
                            <Link href="/" className="inline-flex items-center gap-2 group text-white font-bold hover:text-green-400 transition-colors">
                                <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
