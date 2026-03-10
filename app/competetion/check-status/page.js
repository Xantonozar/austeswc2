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
                body: JSON.stringify({ id: compId, bkashTxId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Payment submitted successfully!");
                // Update local state to reflect payment
                setResults((prev) =>
                    prev.map((comp) =>
                        comp._id === compId ? { ...comp, status: "paid", bkashTxId } : comp
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
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Under Review
                    </span>
                );
            case "selected":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Selected (Payment Required)
                    </span>
                );
            case "paid":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Payment Pending Verification
                    </span>
                );
            case "eliminated":
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Not Selected
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

    const formatType = (type) => type.replace("-", " ").toUpperCase();

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
                        <span className="bg-[#1B4B43]/10 text-[#1B4B43] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                            Participant Portal
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1B4B43] mb-3">
                        Check Registration Status
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
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
                                <div key={comp._id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Competition</p>
                                            <h4 className="text-xl font-bold text-[#1B4B43]">{formatType(comp.type)}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Registered as: <span className="font-semibold">{comp.teamName || comp.name}</span>
                                            </p>
                                        </div>
                                        <div>
                                            {getStatusBadge(comp.status === 'paid' && comp.paymentVerified ? 'verified' : comp.status)}
                                        </div>
                                    </div>

                                    {/* Payment Section - Only show if Selected */}
                                    {comp.status === "selected" && (
                                        <div className="mt-6 p-6 rounded-xl bg-[#F3F9F1] border border-[#D9F2D6]">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                                    <Wallet className="w-6 h-6 text-[#1B4B43]" />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-[#1B4B43] text-lg mb-2">Round 2 Payment Required</h5>
                                                    <p className="text-sm text-gray-700 mb-4">
                                                        Congratulations on making it to Round 2! To confirm your spot, please pay the {comp.type === 'eco-pitch' ? 'remaining registration fee' : 'registration fee of 100 BDT'} to the following bKash/Nagad number:
                                                    </p>

                                                    <div className="bg-white px-4 py-3 rounded-lg flex flex-col gap-2 mb-5 border border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-mono font-bold text-lg tracking-wider text-[#1B4B43]">01853259598</span>
                                                            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">bKash/Nagad</span>
                                                        </div>
                                                        <p className="text-[10px] text-yellow-700 font-bold italic">Requirement: Must put your Team/Personal name in the reference field.</p>
                                                    </div>

                                                    <form
                                                        onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(comp._id); }}
                                                        className="flex flex-col sm:flex-row gap-3"
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Transaction ID (e.g. 9JA4HR..."
                                                            value={activeCompId === comp._id ? bkashTxId : ""}
                                                            onChange={(e) => {
                                                                setBkashTxId(e.target.value);
                                                                setActiveCompId(comp._id);
                                                            }}
                                                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm uppercase"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={paymentLoading && activeCompId === comp._id}
                                                            className="bg-[#1B4B43] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#133630] transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            {paymentLoading && activeCompId === comp._id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <>Submit <ArrowRight className="w-4 h-4" /></>
                                                            )}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
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
                                            We have received your transaction ID ({comp.bkashTxId}). Our team is verifying the payment, and you will receive a final confirmation email shortly.
                                        </div>
                                    )}
                                    {comp.status === "verified" || (comp.status === "paid" && comp.paymentVerified) && (
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
