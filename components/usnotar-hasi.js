import Link from 'next/link';

const UsnotarHasi = () => {
    const data = {
        title: "Usnotar Hasi (Smile of Warmth)",
        description: "Our annual winter charity campaign aimed at providing warmth and relief to underprivileged communities facing the harsh winter. In 2026, we distributed essential supplies to 85 individuals in Jamalpur.",
        image: "https://res.cloudinary.com/chirkut/image/upload/v1772112202/615767995_863805759787728_965306133818918610_n_g3dwvu.jpg",
        date: "January 13, 2026",
        place: "Madarganj Upazila, Jamalpur",
        link: "/activities/usnotar-hasi"
    };

    return (
        <section id="usnotar-hasi" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-[#198042]/10 text-[#198042] rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        Winter Welfare Initiative
                    </span>
                    <h2 className="text-4xl md:text-5xl font-yeseva text-[#1A2B1E] uppercase tracking-wider">
                        Usnotar Hasi
                    </h2>
                    <div className="h-1.5 w-24 bg-[#198042] mx-auto rounded-full mt-4 opacity-80"></div>
                </div>

                <div className="group relative bg-[#F9FBFA] rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-700">
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Image Side - Left */}
                        <div className="lg:w-1/2 relative min-h-[400px] overflow-hidden">
                            <img
                                src={data.image}
                                alt={data.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                        </div>

                        {/* Content Side - Right */}
                        <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white lg:bg-transparent">
                            <div className="mb-6">
                                <h3 className="text-3xl md:text-4xl font-yeseva text-[#1A2B1E] mb-6 leading-tight">
                                    {data.title}
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    {data.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-green-50 rounded-2xl text-[#198042]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Date</p>
                                        <p className="text-gray-900 font-semibold">{data.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-green-50 rounded-2xl text-[#198042]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                        <p className="text-gray-900 font-semibold">{data.place}</p>
                                    </div>
                                </div>
                            </div>

                            <Link href={data.link} className="inline-block group/btn">
                                <div className="relative inline-flex items-center gap-3 px-10 py-4 bg-[#198042] text-white rounded-full font-bold text-lg hover:bg-[#1A2B1E] transition-all transform hover:-translate-y-1 shadow-lg shadow-green-900/20 active:scale-95">
                                    View Full Report
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UsnotarHasi;
