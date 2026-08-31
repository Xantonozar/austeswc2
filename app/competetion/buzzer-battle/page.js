"use client";

import { motion } from "framer-motion";
import { Zap, Calendar, Users, FileText, ArrowRight, ExternalLink, BookOpen, Clock, Phone, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BUZZER_BATTLE_IMAGE = "https://res.cloudinary.com/chirkut/image/upload/v1788183640/6102763479962948768_121_xarflx.jpg";

export default function BuzzerBattleDetails() {
    const rulebookUrl = "https://drive.google.com/file/d/1bWe7r0FEO5JD2lxlb9zdqdqL1I14_5SY/view";

    const timeline = [
        { milestone: "Registration Opens", date: "31 August 2026" },
        { milestone: "Registration Deadline", date: "09 September 2026" },
        { milestone: "Written Prelims & Grand Finale", date: "20 September 2026" },
        { milestone: "Winners Declaration", date: "21 September 2026" }
    ];

    const contacts = [
        { name: "Md Rayhan Bappy (President)", phone: "01639802823" },
        { name: "Shifat Estiak (General Secretary)", phone: "01707590206" },
        { name: "Dewan Rayhan Rahman (Organizing Secretary)", phone: "01632729616" }
    ];

    const topics = [
        "Natural Disasters: causes, climate impacts, disaster management",
        "Waste & Resource Management: recycling, circular economy, plastic pollution, 3R policies",
        "Ecology & Biodiversity: endangered species, ecosystem balance, conservation",
        "Energy & Sustainability: renewable energy, carbon footprint, energy efficiency",
        "Climate Change & Global Accords: COP summits, Paris Agreement, GHG policies",
        "Bangladesh & Local Environment: river pollution, urban sustainability in Dhaka"
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-white font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 relative overflow-hidden rounded-3xl"
                >
                    <Image
                        src={BUZZER_BATTLE_IMAGE}
                        alt="Buzzer Battle"
                        width={1200}
                        height={400}
                        className="w-full h-auto object-cover rounded-3xl"
                        priority
                    />
                </motion.div>



                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-8">
                        {/* Overview */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-[#22C55E]" /> Overview & Eligibility
                            </h2>
                            <ul className="space-y-4 text-gray-600 leading-relaxed">
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>AUSTESWC's fast-paced environmental quiz showdown under <strong>Eco Champions 4.0</strong>.</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Open to all currently enrolled <strong>AUST students</strong>, any department or year.</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Team participation — <strong>max 3 members</strong> per team (1 leader + up to 2 optional members).</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Cross-department & cross-year teams allowed. A student can participate in only one team.</p></li>
                            </ul>
                        </div>

                        {/* Topics */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#22C55E]" /> Syllabus & Topics
                            </h2>
                            <ul className="space-y-3 text-gray-600">
                                {topics.map((t, i) => (
                                    <li key={i} className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>{t}</p></li>
                                ))}
                            </ul>
                        </div>

                        {/* Rounds */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-[#22C55E]" /> Rounds & Format
                            </h2>
                            <div className="space-y-5">
                                <div className="border border-green-100 rounded-2xl p-5">
                                    <h3 className="font-bold text-[#1B4B43] mb-2">Round 1 — Written Preliminary</h3>
                                    <p className="text-gray-600 text-sm">Paper-based MCQ: <strong>20 questions, 20 minutes</strong>. Team effort on one common paper. +1 per correct answer, no negative marking. Top-scoring teams advance.</p>
                                </div>
                                <div className="border border-green-100 rounded-2xl p-5">
                                    <h3 className="font-bold text-[#1B4B43] mb-2">Round 2 — Grand Finale (Live Buzzer Stage)</h3>
                                    <p className="text-gray-600 text-sm">Live rapid-fire with physical/digital buzzers. First to buzz answers within 5 seconds. Correct: +10, Wrong/Timeout: −5. Early buzzer allowed. Tiebreaker: 5-question sudden-death.</p>
                                </div>
                            </div>
                        </div>

                        {/* Code of Conduct */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-[#22C55E]" /> Rules & Code of Conduct
                            </h2>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Report ≥15 minutes before start; late arrival may lead to disqualification.</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p><strong>Electronic Device Ban:</strong> phones, smartwatches, calculators strictly prohibited.</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Audience interference forbidden; prompted questions are cancelled.</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Malpractice (cheating, impersonation) → immediate disqualification.</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Quizmaster & Organising Panel decisions are final and binding.</p></li>
                            </ul>
                        </div>

                        {/* Prizes */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#1B4B43] mb-6 flex items-center gap-3">
                                <Award className="w-6 h-6 text-[#22C55E]" /> Prize Pool & Recognition
                            </h2>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Champion (1st Place): TBA</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>1st Runner-Up (2nd Place): TBA</p></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" /><p>Official Certificate of Participation for all registered team members.</p></li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                        <div className="bg-[#1B4B43] rounded-3xl p-8 shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#86EFAC]" /> Event Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[#86EFAC] text-sm">Registration Fee</p>
                                    <p className="font-bold text-xl">499 BDT / team</p>
                                </div>
                                <div>
                                    <p className="text-[#86EFAC] text-sm">Team Size</p>
                                    <p className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> 1 – 3 Members</p>
                                </div>
                                <div>
                                    <p className="text-[#86EFAC] text-sm">Eligibility</p>
                                    <p className="font-bold">AUST Students Only</p>
                                </div>
                                <div>
                                    <p className="text-[#86EFAC] text-sm">Payment</p>
                                    <p className="font-bold">bKash / Nagad</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#22C55E]" /> Timelines
                            </h3>
                            <div className="space-y-3">
                                {timeline.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 font-medium">{t.milestone}</span>
                                        <span className="font-bold text-[#1B4B43] text-right ml-2">{t.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contacts */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1B4B43] mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-[#22C55E]" /> Contact
                            </h3>
                            <div className="space-y-3">
                                {contacts.map((c, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="text-gray-500">{c.name}</p>
                                        <p className="font-bold text-[#1B4B43]">{c.phone}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Website: austeswc.org | Facebook: AUSTESWC</p>
                        </div>

                        <div className="w-full space-y-3">
                            <Link
                                href="/competetion/buzzer-battle/register"
                                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                            >
                                Register Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href={rulebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-white border-2 border-[#22C55E] text-[#1B4B43] hover:bg-green-50 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-sm"
                            >
                                <FileText className="w-5 h-5" /> View Rulebook
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
