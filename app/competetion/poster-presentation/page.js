"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, Users, Image as ImageIcon, ArrowRight, Award, CreditCard, AlertTriangle, Clock, Phone, Leaf, Heart, Building2, Ruler, Mic, ShieldX } from "lucide-react";
import Link from "next/link";

const BANNER = "https://res.cloudinary.com/chirkut/image/upload/v1787581792/poster_presentaion_2_s4tsji.png";
const rulebookUrl = "https://drive.google.com/file/d/1H8d_jGiNt5EacJlzmdujYpf_-CFQrykd/view";

export default function PosterPresentationDetails() {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-white font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden shadow-md border border-gray-100 mb-8 bg-gray-50 flex justify-center p-3">
                    <img src={BANNER} alt="Poster Presentation Banner" className="w-full max-w-[480px] h-auto object-contain rounded-2xl" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#E8F9FF] rounded-3xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
                    <div className="w-96 h-96 absolute -bottom-20 -right-20 rounded-full border-[16px] border-white/40 bg-white/20 z-0"></div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                        <ImageIcon className="w-10 h-10 text-[#1B4B43]" />
                    </div>
                    <p className="text-sm font-bold tracking-widest text-[#1B4B43]/60 uppercase mb-2 relative z-10">Eco Champions 4.0</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1B4B43] mb-3 relative z-10">Poster Presentation</h1>
                    <p className="text-[#1B4B43] font-semibold relative z-10">Sustainability for Life & Society</p>
                    <p className="text-sm text-gray-600 italic max-w-2xl mx-auto relative z-10 mb-6">&quot;Save Environment, Save People, and Save the Society.&quot;</p>
                    <div className="flex flex-wrap justify-center gap-3 relative z-10">
                        <span className="bg-[#1B4B43] text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg text-sm"><FileText className="w-4 h-4" /> Free Round 1</span>
                        <span className="bg-white text-[#1B4B43] px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow text-sm border"><Users className="w-4 h-4" /> 1–3 Members</span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><Users className="w-5 h-5" /> Overview & Team Formation</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Eligibility:</strong> All enrolled AUST students, any department/year.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Team size:</strong> 1–3 members (solo allowed); one Team Leader per team; one team per participant.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Format:</strong> Two rounds — Preliminary (Abstract) + Grand Finale (On-Campus).</span></li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3"><Leaf className="w-5 h-5 text-green-600" /> Theme Tracks</h2>
                            <div className="grid gap-4">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                    <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2"><Leaf className="w-4 h-4" /> Track 1 — Save Environment</h3>
                                    <p className="text-xs text-emerald-800 mt-1">waste / circular economy, water conservation, renewable energy & carbon reduction</p>
                                </div>
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                                    <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2"><Heart className="w-4 h-4" /> Track 2 — Save People</h3>
                                    <p className="text-xs text-rose-800 mt-1">air/soil quality, climate-resilient public health, sustainable agriculture & food security</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                    <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2"><Building2 className="w-4 h-4" /> Track 3 — Save Society</h3>
                                    <p className="text-xs text-blue-800 mt-1">smart urban planning, tech-driven climate action, community engagement</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><FileText className="w-5 h-5" /> Round 1 — Preliminary (Abstract)</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Abstract:</strong> PDF, A4, <strong>max 300 words</strong>.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>Header required:</strong> Team Name, Topic Title, all member names.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] mt-2 shrink-0" /><span><strong>File naming:</strong> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">TeamName_EcoChampions4.0_Abstract.pdf</span> • Max 10MB • PDF only.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" /><span><strong>Free registration</strong> — no fee.</span></li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><Ruler className="w-5 h-5" /> Round 2 — Grand Finale (On-Campus)</h2>
                            <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" /><span><strong>Poster:</strong> <strong>2ft × 3ft</strong> printed poster.</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" /><span className="flex items-center gap-2"><Mic className="w-4 h-4" /><strong>Live presentation:</strong> 8–10 min total (5–7 min pitch + 3 min Q&A).</span></li>
                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" /><span><strong>Bring:</strong> printed poster, AUST ID cards, optional handouts/laptop.</span></li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1B4B43] mb-4 flex items-center gap-3"><Award className="w-5 h-5 text-amber-600" /> Judging Criteria</h2>
                            <div className="overflow-hidden rounded-2xl border border-gray-100">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#1B4B43] text-white"><tr><th className="text-left px-4 py-3">Criteria</th><th className="text-right px-4 py-3">Weight</th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="bg-gray-50/50"><td className="px-4 py-3 font-medium">Visual Presentation</td><td className="px-4 py-3 text-right font-bold">30%</td></tr>
                                        <tr><td className="px-4 py-3 font-medium">Communication Skills</td><td className="px-4 py-3 text-right font-bold">30%</td></tr>
                                        <tr className="bg-gray-50/50"><td className="px-4 py-3 font-medium">Innovation & Impact</td><td className="px-4 py-3 text-right font-bold">30%</td></tr>
                                        <tr><td className="px-4 py-3 font-medium">Q&A Performance</td><td className="px-4 py-3 text-right font-bold">10%</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Prize pool TBA on Facebook; certificates for Champion & Runner-up teams.</p>
                        </div>

                        <div className="bg-red-50 rounded-3xl p-8 shadow-md border border-red-100">
                            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-3"><ShieldX className="w-5 h-5" /> Disqualification Rules</h2>
                            <ul className="space-y-2 text-sm text-red-800 leading-relaxed">
                                <li className="flex gap-3"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /><span>Wrong file naming (<span className="font-mono text-xs">TeamName_EcoChampions4.0_Abstract.pdf</span> required).</span></li>
                                <li className="flex gap-3"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /><span><strong>AI content &gt;30%</strong> or plagiarism → disqualified.</span></li>
                                <li className="flex gap-3"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /><span>Exceeding 300 words, wrong poster dimensions (2×3 ft), missing slots, or misconduct → disqualified.</span></li>
                            </ul>
                        </div>

                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#B7E9FF]" /> Timeline</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-[#B7E9FF]">Registration Opens</span><span className="font-bold">25 Aug 2026</span></div>
                                <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-[#B7E9FF]">Abstract Deadline</span><span className="font-bold">10 Sep 2026</span></div>
                                <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-[#B7E9FF]">Finalists Announced</span><span className="font-bold">12 Sep 2026</span></div>
                                <div className="flex justify-between"><span className="text-[#B7E9FF]">Grand Finale</span><span className="font-bold">20 Sep 2026</span></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Registration & Payment</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <p><strong>Round 1:</strong> <span className="text-green-700 font-bold">Free</span></p>
                                <p><strong>Round 2 only:</strong> <span className="font-bold">BDT 499 / team</span> via bKash → submit TrxID + team info</p>
                                <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800">Round 2 also requires payment screenshot + team/individual photos for FB feature.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Key Details</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between"><span>Team Size</span><span className="font-bold">1–3</span></div>
                                <div className="flex justify-between"><span>Abstract</span><span className="font-bold">A4 • 300 words • PDF</span></div>
                                <div className="flex justify-between"><span>Poster Size</span><span className="font-bold">2ft × 3ft</span></div>
                                <div className="flex justify-between"><span>Presentation</span><span className="font-bold">8–10 min</span></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2"><Phone className="w-5 h-5" /> Contacts</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Rayhan Bappy (President): <a href="tel:01639802823" className="font-bold text-[#1B4B43]">01639802823</a></li>
                                <li>Shifat Estiak (Gen Sec): <a href="tel:01707590206" className="font-bold text-[#1B4B43]">01707590206</a></li>
                                <li>Dewan Rayhan (Org Sec): <a href="tel:01632729616" className="font-bold text-[#1B4B43]">01632729616</a></li>
                                <li className="pt-2 text-xs">austeswc.org | FB: AUSTESWC</li>
                            </ul>
                        </div>

                        <Link href="/competetion/poster-presentation/register" className="block w-full">
                            <button className="w-full bg-[#B7E9FF] hover:bg-[#95DFFF] text-[#1B4B43] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-md">
                                Register Now <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <a href={rulebookUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <button className="w-full bg-white border-2 border-[#1B4B43] text-[#1B4B43] hover:bg-[#1B4B43] hover:text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm mt-3">
                                <FileText className="w-5 h-5" /> View Rulebook
                            </button>
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
