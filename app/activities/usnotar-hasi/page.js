import Link from 'next/link';

export default function UsnotarHasiPage() {
    const galleryImages = [
        "https://res.cloudinary.com/chirkut/image/upload/v1772112202/615767995_863805759787728_965306133818918610_n_g3dwvu.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112202/615814778_863806573120980_2780769151551914831_n_np7npn.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112203/615769519_863806503120987_2099988912114150256_n_mp1q7b.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112203/615872932_863805283121109_8222750674054953109_n_inwig5.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112203/615747775_863805956454375_709764646737326796_n_rylbuv.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112204/615923177_863805373121100_6067647970880950536_n_aqfalu.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112204/615956462_863805823121055_6269499369489123150_n_xkvemj.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112205/616042072_863806809787623_3551033588232439130_n_k9k595.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112205/616093091_863806303121007_7922366199096872185_n_mcpd5t.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112206/616113450_863806236454347_7674588357347293289_n_usj5gr.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112210/616160993_863805316454439_8150870471302502711_n_l5hhmc.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112211/616546983_863806779787626_5604201877711331884_n_jrnvzk.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112211/616373162_863805446454426_8864882887899435041_n_yhk9l4.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112211/616577529_863805129787791_8920860932005397976_n_kny936.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112211/616638683_863805243121113_5221653584605506858_n_idleht.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112212/616652492_863806023121035_8092005539512699851_n_1_cyzthm.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112213/616652492_863806023121035_8092005539512699851_n_gbgx33.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112213/616652492_863806729787631_5645680123067560693_n_fweqsr.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112213/616765139_863805586454412_7920324799634613895_n_acsrxn.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112214/616845283_863806423120995_7687998354204920745_n_ikqe6q.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112214/616845780_863806356454335_2821806699633766282_n_bky6ua.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112217/616848906_863806166454354_356739895799674232_n_zbm3ne.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112219/617199308_863805263121111_3706363170973772834_n_flvilf.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112219/617391823_863805169787787_7824632173808346722_n_zjf8br.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112219/617221210_863805423121095_3118160926586918982_n_q2pazz.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112220/617539118_863806106454360_3953209556764364319_n_l173ye.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112221/618074052_863805339787770_8340435138686026243_n_norbi0.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112223/618640898_863806629787641_7113953117574758000_n_em2ba0.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112223/618616522_863805656454405_482110208645498687_n_jackjj.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112223/618794845_863806389787665_1757110150073972594_n_gcicdg.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112223/618796362_863805546454416_1121468614835910557_n_fevqvd.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112230/615678959_863805726454398_4094594926516240747_n_dbefb4.jpg",
        "https://res.cloudinary.com/chirkut/image/upload/v1772112253/616072448_863806456454325_6489285161576678863_n_j6a5zc.jpg"
    ];

    return (
        <main className="min-h-screen bg-[#F9FBFA]">

            <div className="relative h-[65vh] bg-[#023015] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src={galleryImages[0]}
                        alt="Usnotar Hasi Hero"
                        className="w-full h-full object-cover scale-110"
                        loading="lazy"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                        Welfare Campaign 2026
                    </span>
                    <h1 className="text-5xl md:text-8xl font-yeseva text-white mb-6 uppercase">Usnotar Hasi</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
                        Smile of Warmth: Spreading hope and comfort in the cold depths of winter.
                    </p>
                </div>
            </div>

            <section className="py-24 max-w-6xl mx-auto px-4">
                <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12">
                            <span className="inline-block px-4 py-2 bg-green-50 text-[#198042] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                                First Day Distribution
                            </span>
                            <h2 className="text-5xl font-yeseva text-[#1A2B1E] mb-8">Campaign Highlights - Jamalpur</h2>
                            <div className="flex flex-wrap gap-8 text-gray-500 font-medium mb-10 border-b border-gray-100 pb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    January 13, 2026
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    Madarganj Upazila, Jamalpur
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-xl text-gray-600 max-w-none mb-16 space-y-8">
                            <p className="leading-relaxed">
                                The "Usnotar Hasi" (Smile of Warmth) campaign is a flagship winter initiative of the AUST Environmental and Social Welfare Club (AUSTESWC). On January 13, 2026, our team visited Madarganj, Jamalpur, for the first day of our nationwide distribution drive.
                            </p>
                            <p className="leading-relaxed">
                                Winter in northern Bangladesh can be unforgiving, especially for underprivileged communities. Our mission was not just to provide physical warmth, but to bring smiles and show that the AUSTESWC community stands with them.
                            </p>

                            <div className="bg-[#F9FBFA] p-10 rounded-[2.5rem] border border-green-100/50 my-12">
                                <h3 className="text-3xl font-yeseva text-[#1A2B1E] mb-6">Distribution Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                        <p className="text-4xl font-yeseva text-[#198042] mb-1">85+</p>
                                        <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">Individuals Served</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                        <p className="text-4xl font-yeseva text-[#198042] mb-1">100%</p>
                                        <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">Club-Led Initiative</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-3xl font-yeseva text-[#1A2B1E] mt-12 mb-6 text-center">Event Gallery</h3>
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className="break-inside-avoid overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                        <img
                                            src={img}
                                            alt={`Usnotar Hasi Gallery ${idx + 1}`}
                                            className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#1A2B1E] text-white p-12 rounded-[2.5rem] text-center mt-20">
                            <h3 className="text-3xl font-yeseva mb-4">Support Our Cause</h3>
                            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                                Your donations and support fuel our ability to reach more people every winter. Join AUSTESWC in our journey of compassion.
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
