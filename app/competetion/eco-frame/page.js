"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Camera, ArrowRight, Award, CreditCard, AlertTriangle, Clock, Phone, Leaf, Heart, Building2, Image as ImageIcon, ShieldX, Mic, Star, Globe } from "lucide-react";
import Link from "next/link";

const THEMES = [
    { name: 'Echoes of Change', desc: 'Climate impacts or sustainability efforts on/around campus.' },
    { name: 'The Human Element', desc: 'Everyday social realities, community bonds, human-nature interactions.' },
    { name: 'Hidden Waste', desc: 'Consumption habits, plastic use, and waste accumulation.' },
    { name: 'Nature vs. Concrete', desc: 'Tension or balance between urban infrastructure and green space.' },
    { name: 'Shades of Hope', desc: 'Solutions, restoration, eco-friendly initiatives, optimistic action.' },
    { name: 'Open Wild', desc: 'Macro, wildlife, landscape beauty, or large-scale climate disasters.' }
];

export default function EcoFrameDetails() {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-white font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden shadow-md border border-gray-100 mb-8 bg-gray-50 flex justify-center p-3">
                    <img src="https://res.cloudinary.com/chirkut/image/upload/v1788013635/Segment_Announcement_Posts_eyslrh.svg" alt="Eco Frame Contest Poster" className="w-full max-w-[480px] h-auto object-contain rounded-2xl" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#E8F9FF] rounded-3xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
                    <div className="w-96 h-96 absolute -bottom-20 -right-20 rounded-full border-[16px] border-white/40 bg-white/20 z-0"></div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                        <Camera className="w-10 h-10 text-[#1B4B43]" />
                    </div>
                    <p className="text-sm font-bold tracking-widest text-[#1B4B43]/60 uppercase mb-2 relative z-10">Eco Champions 4.0</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1B4B43] mb-3 relative z-10">Eco Frame</h1>
                    <p className="text-[#1B4B43] font-semibold relative z-10">Environmental Photography Contest</p>
                    <p className="text-sm text-gray-600 italic max-w-2xl mx-auto relative z-10 mb-6">&quot;Capturing Nature, Inspiring Society: One frame. One truth. One planet worth saving.&quot;</p>
                    <div className="flex flex-wrap justify-center gap-3 relative z-10">
                        <span className="bg-[#1B4B43] text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg text-sm"><CreditCard className="w-4 h-4" /> 149 BDT</span>
                        <span className="bg-white text-[#1B4B43] px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow text-sm border"><Users className="w-4 h-4" /> Individual</span>
                        <span className="bg-white text-[#1B4B43] px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow text-sm border"><ImageIcon className="w-4 h-4" /> Up to 3 Photos</span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><Users className="w-5 h-5" /> General Overview & Eligibility</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Overview:</strong> A signature photography contest inviting students to capture nature and socio-environmental issues.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Eligibility:</strong> All currently enrolled AUST students, any department/year.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Participation:</strong> Strictly individual — no team or joint entries.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Submission Limit:</strong> Up to 3 photographs under one registration.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Identity Rule:</strong> Submitting under more than one account/identity is prohibited.</span></li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3"><Leaf className="w-5 h-5 text-green-600" /> Themes & Tracks</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {THEMES.map((t) => (
                                    <div key={t.name} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                        <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2"><Camera className="w-4 h-4" /> {t.name}</h3>
                                        <p className="text-xs text-emerald-800 mt-1">{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><ImageIcon className="w-5 h-5" /> Format & Exhibition</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Format:</strong> Single-round — register, pay, and upload high-resolution photos via the website form.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Evaluation:</strong> Photos published on the AUSTESWC Facebook page for public engagement scoring + simultaneous expert jury review.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Grand Finale:</strong> Top 10 finalist photos printed and exhibited on-campus, 20 & 21 September 2026.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Verification:</strong> Original RAW/unedited files may be requested to verify authenticity.</span></li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><ShieldX className="w-5 h-5 text-red-600" /> Technical Guidelines & Editing Policy</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Equipment:</strong> DSLR, DSLT, or high-resolution mobile/tablet allowed. Entries must be original.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong className="text-red-700">AI Policy:</strong> AI-generated or AI-enhanced images are 100% prohibited.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Permitted:</strong> Basic global adjustments only (color, contrast, exposure, cropping, B&W).</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Prohibited:</strong> Compositing, cloning, object removal/addition, extra filters, heavy manipulation.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Naming:</strong> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">ParticipantName_AUSTID_PhotoNumber</span> (e.g., NaimurRahman_210104001_Photo1.jpg)</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Title:</strong> a short photo title • <strong>Caption:</strong> a one-line caption.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Specs:</strong> JPEG/PNG, ≤10MB per image.</span></li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><Award className="w-5 h-5 text-amber-600" /> Judging & Scoring</h2>
                            <div className="overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#1B4B43] text-white"><tr><th className="text-left px-4 py-3">Component</th><th className="text-right px-4 py-3">Weight</th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="bg-gray-50/50"><td className="px-4 py-3 font-medium">Jury Evaluation</td><td className="px-4 py-3 text-right font-bold">70%</td></tr>
                                        <tr><td className="px-4 py-3 font-medium">Public Engagement (FB reactions)</td><td className="px-4 py-3 text-right font-bold">30%</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Jury scores composition, storytelling, theme relevance, originality & technical quality. Multiple photos are showcased in separate posts (Part 1/2/3); the 30% is the average across all.</p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><Award className="w-5 h-5 text-amber-600" /> Prize Pool & Recognition</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Champion:</strong> To Be Announced Soon</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>1st Runner-Up:</strong> To Be Announced Soon</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Top 10 Finalists:</strong> Official Certificate of Recognition + featured in the on-campus exhibition.</span></li>
                            </ul>
                        </div>

                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#B7E9FF]" /> Timeline</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-[#B7E9FF]">Opens</span><span className="font-bold">29 Aug 2026</span></div>
                                <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-[#B7E9FF]">Deadline</span><span className="font-bold">09 Sep 2026</span></div>
                                <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-[#B7E9FF]">FB Voting</span><span className="font-bold">14 Sep 2026</span></div>
                                <div className="flex justify-between"><span className="text-[#B7E9FF]">Exhibition</span><span className="font-bold">20 & 21 Sep</span></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Registration & Payment</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <p><strong>Fee:</strong> <span className="text-green-700 font-bold">BDT 149</span> (covers up to 3 photos)</p>
                                <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800">Pay via bKash → submit TrxID + Sender Number + payment screenshot (Max 5MB, JPG/PNG). Use a valid email address for confirmation.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Key Details</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between"><span>Participation</span><span className="font-bold">Individual</span></div>
                                <div className="flex justify-between"><span>Photos</span><span className="font-bold">1–3</span></div>
                                <div className="flex justify-between"><span>Format</span><span className="font-bold">JPEG/PNG • 10MB</span></div>
                                <div className="flex justify-between"><span>Fee</span><span className="font-bold">149 BDT</span></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2"><Phone className="w-5 h-5" /> Contacts</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Md Rayhan Bappy (President): <a href="tel:01639802823" className="font-bold text-[#1B4B43]">01639-802823</a></li>
                                <li>Shifat Estiak (Gen Sec): <a href="tel:01707590206" className="font-bold text-[#1B4B43]">01707-590206</a></li>
                                <li>Hasibur Rashid Tokey (VP): <a href="tel:01319508075" className="font-bold text-[#1B4B43]">01319-508075</a></li>
                                <li className="pt-2 text-xs">austeswc.org | FB: AUSTESWC</li>
                            </ul>
                        </div>

                        <Link href="/competetion/eco-frame/register" className="block w-full">
                            <button className="w-full bg-[#B7E9FF] hover:bg-[#95DFFF] text-[#1B4B43] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-md">
                                Register Now <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
