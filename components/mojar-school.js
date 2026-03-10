import Link from 'next/link';
import Image from 'next/image';

const MojarSchool = () => {
    const cards = [
        {
            title: "Mojar School Outreach",
            description: "AUSTESWC presented an interactive environmental awareness talk and tree plantation session beside the school field.",
            image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop",
            date: "January 14, 2026",
            place: "Nalchiya Govt. Primary School, Jamalpur",
            link: "/activities/mojar-school/jamalpur"
        },
        {
            title: "Mojar School Outreach",
            description: "AUSTESWC members conducted environmental awareness sessions and engaged students in various fun-filled educational segments.",
            image: "https://res.cloudinary.com/chirkut/image/upload/v1772103213/615395054_860158470152457_8608973001880448478_n_dbnhez.jpg",
            date: "August 13, 2025",
            place: "Padampur High School, Thakurgaon",
            link: "/activities/mojar-school/thakurgaon"
        },
        {
            title: "Mojar School Outreach",
            description: "Environmental education and distribution of educational materials to students as part of our nationwide journey.",
            image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
            date: "January 8, 2026",
            place: "Little Moon High School, Cumilla",
            link: "/activities/mojar-school/cumilla"
        }
    ];

    return (
        <section id="mojar-school" className="py-20 bg-[#E5E7EB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-yeseva text-[#1A2B1E] uppercase tracking-wider mb-4">
                        Mojar School Campaign
                    </h2>
                    <div className="h-1.5 w-24 bg-[#198042] mx-auto rounded-full opacity-80"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full border border-gray-100">
                            {/* Image Section */}
                            <div className="relative h-60 w-full">
                                <img
                                    src={card.image}
                                    className="w-full h-full object-cover"
                                    alt={card.title}
                                />
                            </div>

                            {/* Info Section */}
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-[#1A2B1E] mb-2 leading-tight">
                                    {card.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                                    {card.description}
                                </p>

                                <div className="mt-auto space-y-2">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        {card.date}
                                    </div>
                                    {card.place && (
                                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            {card.place}
                                        </div>
                                    )}
                                </div>

                                <Link href={card.link} className="mt-8">
                                    <div className="w-full py-2.5 border-2 border-[#198042] text-[#198042] rounded-full font-bold text-center hover:bg-[#198042] hover:text-white transition-all text-sm">
                                        View Details
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MojarSchool;
