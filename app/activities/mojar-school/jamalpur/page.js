import Link from 'next/link';

export default function JamalpurOutreach() {
    return (
        <main className="min-h-screen bg-[#F9FBFA]">

            <div className="relative h-[60vh] bg-[#023015] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://res.cloudinary.com/chirkut/image/upload/v1772103194/614811648_860159490152355_5899781724395276874_n_pcyncb.jpg"
                        alt="Jamalpur Outreach Hero"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        Mojar School Campaign
                    </span>
                    <h1 className="text-5xl md:text-7xl font-yeseva text-white mb-6 uppercase">Jamalpur Outreach</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        A Journey of Compassion: Environmental Awareness and Welfare at Nalchiya Govt. Primary School.
                    </p>
                </div>
            </div>

            <section className="py-20 max-w-6xl mx-auto px-4">
                <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10">
                            <span className="inline-block px-4 py-2 bg-green-50 text-[#198042] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                                Featured Outreach
                            </span>
                            <h2 className="text-4xl font-yeseva text-[#1A2B1E] mb-6">Nalchiya Govt. Primary School Visit</h2>
                            <div className="flex flex-wrap gap-6 text-gray-500 font-medium mb-8 border-b border-gray-100 pb-8">
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    January 14, 2026
                                </span>
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Madarganj, Jamalpur
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-lg text-gray-600 max-w-none mb-16">
                            <p className="mb-6 leading-relaxed">
                                On a beautiful winter morning of January 14, 2026, the AUST Environmental and Social Welfare Club (AUSTESWC) family embarked on a meaningful journey to Madarganj, Jamalpur. Our destination was Nalchiya Govt. Primary School, where we aimed to spread the seeds of environmental awareness and share joy with the young minds.
                            </p>
                            <p className="mb-6 leading-relaxed">
                                The program was meticulously organized by AUSTESWC members, who dedicated their time and passion to ensure every child felt included and inspired. From the moment we arrived, the warmth of the students and teachers made the long journey worthwhile.
                            </p>

                            <h3 className="text-2xl font-yeseva text-[#1A2B1E] mt-10 mb-4">A Day of Learning and Joy</h3>
                            <p className="mb-6">
                                We conducted an interactive environmental awareness talk where we discussed simple yet impactful ways to protect our earth, like reducing plastic waste and saving water. To put words into action, we held a tree plantation session beside the school field, teaching the students the importance of greenery for a sustainable future.
                            </p>
                            <ul className="list-disc pl-6 space-y-4 mb-8">
                                <li><strong>Environment Talks:</strong> Discussing conservation and the role of youth in climate action.</li>
                                <li><strong>Tree Plantation:</strong> Hands-on activity to beautify the campus and offset carbon.</li>
                                <li><strong>Gift Distribution:</strong> Hamper containing educational materials, healthy snacks, and small toys for over 30 students.</li>
                                <li><strong>Interactive Games:</strong> Bonding through laughter and friendly competition.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-20">
                        <h3 className="text-3xl font-yeseva text-[#1A2B1E] text-center mb-12 uppercase tracking-wide">Event Gallery</h3>
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {[
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103194/614811648_860159490152355_5899781724395276874_n_pcyncb.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103194/614780548_860159406819030_2656673883916750420_n_aj19z9.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103194/615045679_860160073485630_2673381445090953509_n_su0auu.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103195/615134950_860158790152425_4907840684199403478_n_py3lsg.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103195/615076383_860158593485778_4755453055279856019_n_zaygfr.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103195/615084853_860159330152371_4269126808000068324_n_h295ui.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103212/615161884_860159193485718_2389602043472215242_n_jt1hbn.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103212/615319998_860159246819046_4141748864025578402_n_zjrwxv.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103212/615219047_860159110152393_5868895222662453036_n_wrfp2t.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103212/615233358_860158520152452_6205063838380231115_n_xkf5tt.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103213/615399104_860160140152290_6928112058784114187_n_bxcwba.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103213/615373773_860158496819121_4961460390715637494_n_n5ybq8.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103214/615403793_860159583485679_6119354097464719254_n_n3mv9t.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103214/615411405_860160000152304_4141519166594499965_n_z9fufc.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103214/615420889_860158906819080_6165916231274978872_n_hsienw.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103214/615414721_860158846819086_7104401692098938726_n_v1mrjg.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103214/615458340_860159036819067_8405020421824031062_n_i8gcaq.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103214/615439051_860160110152293_2607747383764920264_n_qx9v1p.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103215/615480867_860159903485647_5191498150148107370_n_o0enuy.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103215/615592731_860159626819008_8170750417574765929_n_uqpu7w.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103215/615690131_860159450152359_4796431345451466858_n_papjbb.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103215/615762230_860159540152350_6759734376368023230_n_btgoet.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103215/615764241_860158706819100_7806241550169975943_n_s39zrx.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103215/615692072_860159836818987_4214430788683206138_n_gi4ra1.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103216/615772435_860159283485709_4878930112940380141_n_mfaluf.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103216/615815634_860158743485763_528169592750122530_n_srqquk.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103216/615802338_860158986819072_5020858732625808781_n_beam0c.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103216/615825686_860158933485744_196411146063137258_n_knuncm.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103216/615832007_860159970152307_7500171539193292564_n_xpve6m.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103217/616567234_860159943485643_1310891780215471257_n_msz6uh.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103217/616083979_860158660152438_4116894790178693209_n_ex1cau.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103217/616720546_860159796818991_7124215737472175151_n_nb1i1x.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103217/616652012_860159760152328_3604138437912828162_n_dte8pg.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103217/616133518_860159153485722_8787752243381100431_n_ihcopq.jpg",
                                "https://res.cloudinary.com/chirkut/image/upload/v1772103217/616827531_860159713485666_9166321169273788128_n_lirjgq.jpg"
                            ].map((img, idx) => (
                                <div key={idx} className="break-inside-avoid overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <img
                                        src={img}
                                        alt={`Gallery Image ${idx + 1}`}
                                        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 pt-10 border-t border-gray-100 max-w-4xl mx-auto">
                        <Link href="/" className="inline-flex items-center text-[#198042] font-bold hover:gap-2 transition-all">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
