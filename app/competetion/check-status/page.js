"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, XCircle, AlertCircle, ArrowRight, Wallet } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckStatusPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [bkashTxId, setBkashTxId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [activeCompId, setActiveCompId] = useState(null);

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        setResults(null);

        try {
            const response = await fetch("/api/competition/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "check_status", email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data.data);
            } else {
                toast.error(data.message || "Registration not found");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (compId) => {
        if (!bkashTxId) {
            toast.error("Please enter your bKash Transaction ID");
            return;
        }

        setPaymentLoading(true);
        setActiveCompId(compId);

        try {
            const response = await fetch("/api/competition/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: compId, bkashTxId, paymentMethod }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Payment submitted successfully!");
                // Update local state to reflect payment using data from backend
                setResults((prev) =>
                    prev.map((comp) =>
                        comp._id === compId && data.data ? { ...comp, ...data.data } : comp
                    )
                );
                setBkashTxId("");
            } else {
                toast.error(data.message || "Failed to submit payment");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setPaymentLoading(false);
            setActiveCompId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "registered":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Registration Under Review
                    </span>
                );
            case "selected":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Selected for Round 2 (Payment Required)
                    </span>
                );
            case "paid":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Round 2 Payment Received
                    </span>
                );
            case "eliminated":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Not Selected for Next Round
                    </span>
                );
            case "rejected":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Payment Rejected
                    </span>
                );
            default:
                // Also handling 'verified' if admin manually updates it
                if (status === "verified") {
                    return (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Spot Confirmed!
                        </span>
                    );
                }
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    const formatType = (type) => type === 'eco-pitch' ? 'ECO PITCH 180' : type.replace("-", " ").toUpperCase();

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 font-sans">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <span className="bg-[#1B4B43]/10 text-[#1B4B43] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                            Participant Portal
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#1B4B43] mb-3 px-2">
                        Check Registration Status
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto px-4">
                        Enter the email address you used during registration to view your application status or submit Round 2 payments.
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden"
                >
                    {/* Decorative background element match theme */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#E8F9FF] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <form onSubmit={handleCheckStatus} className="relative z-10">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto bg-[#1B4B43] hover:bg-[#133630] text-white px-8 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check Status"}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Results Area */}
                <AnimatePresence mode="wait">
                    {results && results.length > 0 && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-lg font-bold text-[#1B4B43] px-2">
                                Found {results.length} Registration{results.length > 1 ? 's' : ''}
                            </h3>

                            {results.map((comp) => (
                                <div key={comp._id} className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div className="order-2 md:order-1">
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Competition</p>
                                            <h4 className="text-lg md:text-xl font-bold text-[#1B4B43]">{formatType(comp.type)}</h4>
                                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                                Registered as: <span className="font-semibold">{comp.teamName || comp.name}</span>
                                            </p>
                                        </div>
                                        <div className="order-1 md:order-2 self-start md:self-auto">
                                            {getStatusBadge(
                                                comp.status === 'paid' && comp.paymentVerifiedRound2
                                                    ? 'verified'
                                                    : comp.status === 'registered' && comp.paymentVerified
                                                        ? 'Registration Verified'
                                                        : comp.status
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Section - Only show if Selected or Rejected */}
                                    {(comp.status === "selected" || comp.status === "rejected") && (
                                        <div className="mt-6 p-5 md:p-6 rounded-xl bg-gradient-to-br from-[#F3F9F1] to-[#E8F9FF] border-2 border-[#1B4B43] shadow-lg relative overflow-hidden group">
                                            {/* Pulsing indicator */}
                                            <div className="absolute top-0 right-0 p-2">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4B43] opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1B4B43]"></span>
                                                </span>
                                            </div>

                                            {(() => {
                                                const isRound2 = comp.paymentVerified === true || comp.status === 'selected' || comp.status === 'paid';
                                                const fee = isRound2
                                                    ? (comp.type === 'eco-pitch' ? 700 : 100)
                                                    : (comp.type === 'eco-pitch' ? 300 : (comp.type === 'eco-capture' ? 0 : 100));

                                                const roundLabel = isRound2 ? 'Round 2' : 'Round 1';

                                                return (
                                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                                        <div className="p-3 md:p-4 bg-white rounded-2xl shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                                            <Wallet className="w-6 h-6 md:w-8 md:h-8 text-[#1B4B43]" />
                                                        </div>
                                                        <div className="flex-1 text-center md:text-left w-full">
                                                            <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                                                                <h5 className="font-black text-[#1B4B43] text-lg md:text-xl">
                                                                    {comp.status === 'rejected' ? `Action Required: ${roundLabel} Payment Rejected` : `Action Required: ${roundLabel} Payment`}
                                                                </h5>
                                                            </div>
                                                            <p className="text-xs md:text-sm text-gray-700 mb-6 font-medium leading-relaxed">
                                                                {comp.status === 'rejected'
                                                                    ? `Your previous ${roundLabel} payment verification failed. Please re-check your Transaction ID and submit the correct details below to continue.`
                                                                    : `Congratulations! To proceed to ${roundLabel}, please complete the payment of ${fee} BDT via bKash or Rocket.`}
                                                            </p>

                                                            {fee > 0 ? (
                                                                <>
                                                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setPaymentMethod('bkash')}
                                                                            className={`py-2.5 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'bkash' ? 'border-[#1B4B43] bg-white text-[#1B4B43]' : 'border-transparent bg-white/40 text-gray-500'}`}
                                                                        >
                                                                            bKash
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setPaymentMethod('rocket')}
                                                                            className={`py-2.5 rounded-xl border-2 font-bold transition-all ${paymentMethod === 'rocket' ? 'border-[#1B4B43] bg-white text-[#1B4B43]' : 'border-transparent bg-white/40 text-gray-500'}`}
                                                                        >
                                                                            Rocket
                                                                        </button>
                                                                    </div>

                                                                    <div className="bg-white/80 backdrop-blur-sm px-4 md:px-6 py-4 rounded-2xl flex flex-col gap-2 mb-6 border-2 border-dashed border-[#1B4B43]/30">
                                                                        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                                                                            <div className="flex flex-col items-center sm:items-start">
                                                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Send Money To ({paymentMethod === 'bkash' ? 'bKash' : 'Rocket'})</span>
                                                                                <span className="font-mono font-black text-xl md:text-2xl tracking-widest text-[#1B4B43]">01853259598</span>
                                                                            </div>
                                                                            <div className="flex flex-col items-center sm:items-end">
                                                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Amount</span>
                                                                                <span className="font-mono font-black text-xl md:text-2xl tracking-widest text-[#1B4B43]">{fee} BDT</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                                                                            <p className="text-[10px] md:text-[11px] text-gray-600 font-bold italic text-left">Reference: Must include your Team/Personal name.</p>
                                                                        </div>
                                                                    </div>

                                                                    <form
                                                                        onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(comp._id); }}
                                                                        className="space-y-3"
                                                                    >
                                                                        <div className="relative">
                                                                            <input
                                                                                type="text"
                                                                                placeholder={`Enter ${paymentMethod === 'bkash' ? 'bKash' : 'Rocket'} Transaction ID`}
                                                                                value={activeCompId === comp._id ? bkashTxId : ""}
                                                                                onChange={(e) => {
                                                                                    setBkashTxId(e.target.value);
                                                                                    setActiveCompId(comp._id);
                                                                                }}
                                                                                className="w-full pl-4 pr-4 py-3.5 md:py-4 rounded-xl border-2 border-gray-200 focus:border-[#1B4B43] focus:ring-4 focus:ring-[#1B4B43]/10 outline-none text-sm md:text-base font-bold uppercase tracking-wider transition-all"
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            type="submit"
                                                                            disabled={paymentLoading && activeCompId === comp._id}
                                                                            className="w-full bg-[#1B4B43] text-white py-3.5 md:py-4 rounded-xl text-sm md:text-base font-black hover:bg-[#133630] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1B4B43]/20"
                                                                        >
                                                                            {paymentLoading && activeCompId === comp._id ? (
                                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                            ) : (
                                                                                <>Submit Transaction ID</>
                                                                            )}
                                                                        </button>
                                                                    </form>
                                                                </>
                                                            ) : (
                                                                <div className="bg-white/80 p-6 rounded-2xl border border-[#1B4B43]/20 text-center">
                                                                    <p className="font-bold text-[#1B4B43]">No payment required for this round.</p>
                                                                    <p className="text-xs text-slate-500 mt-1">Please wait for further instructions.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* Status Messages */}
                                    {comp.status === "registered" && (
                                        <div className="p-4 rounded-lg bg-blue-50 text-blue-800 text-sm mt-4">
                                            Your submission is currently being reviewed by our team. We will notify you via email if you are selected for the next round.
                                        </div>
                                    )}
                                    {comp.status === "eliminated" && (
                                        <div className="p-4 rounded-lg bg-gray-50 text-gray-600 text-sm mt-4">
                                            Thank you for participating. Unfortunately, your entry was not selected for Round 2 this time. We encourage you to participate in future events!
                                        </div>
                                    )}
                                    {comp.status === "paid" && (
                                        <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-sm mt-4">
                                            We have received your {comp.paymentMethodRound2 || 'payment'} transaction ID ({comp.bkashTxIdRound2}). Our team is verifying the payment, and you will receive a final confirmation email shortly.
                                        </div>
                                    )}
                                    {(comp.status === "verified" || (comp.status === "paid" && comp.paymentVerifiedRound2)) && (
                                        <div className="p-4 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 text-sm mt-4 font-medium">
                                            Your payment has been verified! See you at the final event. Check your email for further instructions.
                                        </div>
                                    )}

                                </div>
                            ))}
                        </motion.div>
                    )}

                    {results !== null && results.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-white rounded-2xl border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Registrations Found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                We couldn't find any competition registrations associated with <strong>{email}</strong>.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
