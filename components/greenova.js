import Link from 'next/link';

const Greenova = () => {
    const data = {
        title: "Greenova 2026",
        description: "Our signature environmental initiative focused on sustainability and green tech innovation. Join us to make a lasting impact on our planet through creative solutions.",
        image: "/greenova.png",
        date: "March 25, 2026",
        place: "AUST Campus",
        link: "/activities/greenova"
    };

    return (
        <section id="greenova" className="py-16 md:py-24 bg-[#F9FBFA] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 bg-[#1B4B43]/10 text-[#1B4B43] rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        National Event
                    </span>
                    <h2 className="text-4xl md:text-5xl font-yeseva text-[#1A2B1E] uppercase tracking-wider">
                        Greenova
                    </h2>
                    <div className="h-1.5 w-24 bg-[#1B4B43] mx-auto rounded-full mt-4 opacity-80"></div>
                </div>

                <div className="group relative bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-700">
                    <div className="flex flex-col lg:flex-row-reverse min-h-[auto] md:min-h-[500px]">
                        {/* Image Side - Right (reversed) */}
                        <div className="lg:w-1/2 relative min-h-[250px] md:min-h-[400px] overflow-hidden">
                            <img
                                src={data.image}
                                alt={data.title}
                                className="absolute inset-0 w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-out"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent"></div>
                        </div>

                        {/* Content Side - Left */}
                        <div className="lg:w-1/2 p-6 sm:p-8 md:p-16 flex flex-col justify-center bg-white lg:bg-transparent">
                            <div className="mb-6">
                                <h3 className="text-3xl md:text-4xl font-yeseva text-[#1A2B1E] mb-4 md:mb-6 leading-tight">
                                    {data.title}
                                </h3>
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
                                    {data.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-green-50 rounded-2xl text-[#1B4B43]">
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
                                    <div className="p-3 bg-green-50 rounded-2xl text-[#1B4B43]">
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

                            <Link href={data.link} className="inline-block group/btn self-start">
                                <div className="relative inline-flex items-center gap-3 px-8 py-3 md:px-10 md:py-4 bg-[#1B4B43] text-white rounded-full font-bold text-base md:text-lg hover:bg-[#1A2B1E] transition-all transform hover:-translate-y-1 shadow-lg shadow-green-900/20 active:scale-95">
                                    Explore Event
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

export default Greenova;
