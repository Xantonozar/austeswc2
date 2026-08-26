"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, XCircle, AlertCircle, ArrowRight, Wallet, Camera, Upload, Users, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckStatusPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [bkashTxId, setBkashTxId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [activeCompId, setActiveCompId] = useState(null);
    const [posterData, setPosterData] = useState({});
    const [presidentNumber, setPresidentNumber] = useState("01639802823");
    const [presidentName, setPresidentName] = useState("President");

    useEffect(() => {
        fetch("/api/president-bkash").then(r => r.json()).then(d => {
            if (d?.number) setPresidentNumber(d.number);
            if (d?.name) setPresidentName(d.name);
        }).catch(() => {});
    }, []);

    const getPosterState = (id) => posterData[id] || { senderNumber: "", isClubMember: false, clubMemberId: "", screenshotBase64: "", screenshotName: "", photosBase64: [], photoNames: [], paymentMethod: "bkash", trxId: "" };
    const setPosterState = (id, patch) => setPosterData(prev => ({ ...prev, [id]: { ...getPosterState(id), ...patch } }));

    const handleCheckStatus = async (e) => {
        e.preventDefault();
        if (!email) { toast.error("Please enter your email address"); return; }
        setLoading(true); setResults(null);
        try {
            const response = await fetch("/api/competition/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "check_status", email: email.toLowerCase().trim() }) });
            const data = await response.json();
            if (response.ok) setResults(data.data);
            else if (response.status === 404 && data.error === 'not_found') setResults([]);
            else toast.error(data.message || "Registration not found");
        } catch { toast.error("An error occurred. Please try again."); } finally { setLoading(false); }
    };

    const handlePaymentSubmit = async (compId) => {
        if (!bkashTxId) { toast.error(`Please enter your ${paymentMethod} Transaction ID`); return; }
        setPaymentLoading(true); setActiveCompId(compId);
        try {
            const response = await fetch("/api/competition/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: compId, bkashTxId, paymentMethod }) });
            const data = await response.json();
            if (response.ok) { toast.success("Payment submitted successfully!"); setResults(prev => prev.map(c => c._id === compId && data.data ? { ...c, ...data.data } : c)); setBkashTxId(""); }
            else toast.error(data.message || "Failed to submit payment");
        } catch { toast.error("An error occurred. Please try again."); } finally { setPaymentLoading(false); setActiveCompId(null); }
    };

    const handlePosterSubmit = async (comp) => {
        const s = getPosterState(comp._id);
        if (!s.senderNumber.trim()) { toast.error("Sender bKash/Nagad number required"); return; }
        if (!s.trxId.trim()) { toast.error("Transaction ID required"); return; }
        if (!s.screenshotBase64) { toast.error("Payment screenshot required"); return; }
        if (!s.photosBase64 || s.photosBase64.length === 0) { toast.error("At least one team photo required"); return; }
        if (s.isClubMember && !s.clubMemberId.trim()) { toast.error("Club Member ID required for discount"); return; }
        setPaymentLoading(true); setActiveCompId(comp._id);
        try {
            const payload = {
                id: comp._id,
                bkashTxId: s.trxId.trim().toUpperCase(),
                paymentMethod: 'bkash',
                paymentSenderNumber: s.senderNumber.trim(),
                paymentScreenshotBase64: s.screenshotBase64,
                teamPhotosBase64: s.photosBase64,
                isClubMember: s.isClubMember,
                clubMemberId: s.clubMemberId.trim(),
                paymentAmount: s.isClubMember ? 399 : 499,
                round2PosterTitle: comp.posterTitle
            };
            const res = await fetch("/api/competition/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (res.ok) { toast.success("Poster Round 2 submitted successfully!"); setResults(prev => prev.map(c => c._id === comp._id ? { ...c, ...data.data } : c)); }
            else toast.error(data.message || "Failed to submit");
        } catch { toast.error("Submission failed"); } finally { setPaymentLoading(false); setActiveCompId(null); }
    };

    const handleFileToBase64 = (file, cb) => {
        const reader = new FileReader();
        reader.onload = e => cb(e.target.result, file.name);
        reader.readAsDataURL(file);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "registered": return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Registration Under Review</span>;
            case "selected": return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold"><AlertCircle className="w-3.5 h-3.5" /> Selected for Round 2 (Payment Required)</span>;
            case "paid": return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Round 2 Payment Received</span>;
            case "eliminated": return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /> Not Selected</span>;
            case "rejected": return <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /> Payment Rejected</span>;
            default:
                if (status === "verified") return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Spot Confirmed!</span>;
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    const formatType = (type) => type === 'eco-pitch' ? 'ECO PITCH 180' : type === 'poster-presentation' ? 'POSTER PRESENTATION' : type.replace("-", " ").toUpperCase();

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 font-sans">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="inline-flex items-center justify-center mb-4"><span className="bg-[#1B4B43]/10 text-[#1B4B43] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">Participant Portal</span></div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#1B4B43] mb-3 px-2">Check Registration Status</h1>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto px-4">Enter the email you used during registration to view status or submit Round 2 payments.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#E8F9FF] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <form onSubmit={handleCheckStatus} className="relative z-10">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent outline-none" required /></div>
                            <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#1B4B43] hover:bg-[#133630] text-white px-8 py-3.5 rounded-xl font-semibold disabled:opacity-70 flex items-center justify-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check Status"}</button>
                        </div>
                    </form>
                </motion.div>

                <AnimatePresence mode="wait">
                    {results === null && !loading && (
                        <motion.div key="hint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-14 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-[#E8F9FF] rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-7 h-7 text-[#1B4B43]" /></div>
                            <h3 className="text-lg font-bold text-[#1B4B43] mb-1">Enter Your Email Above</h3><p className="text-gray-500 text-sm max-w-xs mx-auto">View your competition status and submit payments.</p>
                        </motion.div>
                    )}

                    {results && results.length > 0 && (
                        <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <h3 className="text-lg font-bold text-[#1B4B43] px-2">Found {results.length} Registration{results.length > 1 ? 's' : ''}</h3>
                            {results.map((comp) => (
                                <div key={comp._id} className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div className="order-2 md:order-1">
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Competition</p>
                                            <h4 className="text-lg md:text-xl font-bold text-[#1B4B43]">{formatType(comp.type)}</h4>
                                            <p className="text-xs md:text-sm text-gray-600 mt-1">Registered as: <span className="font-semibold">{comp.teamName || comp.name}</span></p>
                                            {comp.type === 'poster-presentation' && comp.posterTitle && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><FileText className="w-3 h-3" /> {comp.posterTitle} {comp.trackCategory ? `• ${comp.trackCategory}` : ''}</p>}
                                        </div>
                                        <div className="order-1 md:order-2 self-start md:self-auto">{getStatusBadge(comp.status === 'paid' && comp.paymentVerifiedRound2 ? 'verified' : comp.status)}</div>
                                    </div>

                                    {(comp.status === "selected" || comp.status === "rejected") && (
                                        <div className="mt-6">
                                            {comp.type === 'poster-presentation' ? (
                                                <div className="rounded-2xl bg-gradient-to-br from-[#F3F9F1] to-[#E8F9FF] border-2 border-[#1B4B43] p-5 md:p-6 space-y-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-3 bg-white rounded-xl shadow"><Wallet className="w-6 h-6 text-[#1B4B43]" /></div>
                                                        <div><h5 className="font-black text-[#1B4B43]">Round 2 — Grand Finale</h5><p className="text-xs text-gray-600">BDT 499/team</p></div>
                                                    </div>

                                                    <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
                                                        <p className="font-bold text-[#1B4B43] flex items-center gap-2"><Users className="w-4 h-4" /> Team Identification</p>
                                                        <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-700">
                                                            <p><span className="text-gray-500">Team:</span> <span className="font-semibold">{comp.teamName}</span></p>
                                                            <p><span className="text-gray-500">Leader:</span> <span className="font-semibold">{comp.members?.[0]?.name} • {comp.members?.[0]?.phone}</span></p>
                                                            <p className="sm:col-span-2"><span className="text-gray-500">Poster Title:</span> <span className="font-semibold">{comp.posterTitle || comp.round2PosterTitle || '-'}</span></p>
                                                        </div>
                                                    </div>

                                                    {(() => { const s = getPosterState(comp._id); const fee = 499; return (<>
                                                        <div className="bg-white px-4 py-3 rounded-xl border-2 border-[#1B4B43] flex items-center justify-center gap-2 font-black text-[#1B4B43]"><Wallet className="w-4 h-4" /> bKash Payment Only</div>

                                                        <div className="bg-white/80 backdrop-blur px-4 py-4 rounded-2xl flex flex-col gap-2 border-2 border-dashed border-[#1B4B43]/30">
                                                            <div className="flex justify-between items-center">
                                                                <div><p className="text-[10px] font-bold text-gray-500 uppercase">Send Money To (bKash) • {presidentName}</p><p className="font-mono font-black text-xl text-[#1B4B43] select-all">{presidentNumber}</p></div>
                                                                <div className="text-right"><p className="text-[10px] font-bold text-gray-500 uppercase">Amount</p><p className="font-mono font-black text-xl text-[#1B4B43]">{fee} BDT</p></div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <input value={s.senderNumber} onChange={e => setPosterState(comp._id, { senderNumber: e.target.value })} placeholder="Sender bKash Number *" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1B4B43] outline-none text-sm" />
                                                            <input value={s.trxId} onChange={e => setPosterState(comp._id, { trxId: e.target.value })} placeholder="bKash Transaction ID (TrxID) *" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1B4B43] outline-none text-sm font-mono uppercase" />
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><Upload className="w-4 h-4" /> Payment Screenshot *</p>
                                                            <label className={`flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-xl cursor-pointer ${s.screenshotBase64 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-[#1B4B43]'}`}>
                                                                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) handleFileToBase64(f, (b64, name) => setPosterState(comp._id, { screenshotBase64: b64, screenshotName: name })); }} />
                                                                {s.screenshotBase64 ? <><CheckCircle2 className="w-8 h-8 text-green-600 mb-2" /><p className="text-xs font-bold text-green-800">{s.screenshotName}</p><p className="text-[10px] text-green-600">Ready</p></> : <><Upload className="w-6 h-6 text-gray-400 mb-2" /><p className="text-xs text-gray-600">Tap to upload screenshot</p><p className="text-[10px] text-gray-400">JPG/PNG, max 10MB</p></>}
                                                            </label>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><Camera className="w-4 h-4" /> Team / Individual Photos * <span className="font-normal text-gray-500">(for FB "Meet the Finalists", 1–4 photos)</span></p>
                                                            <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:border-[#1B4B43] border-gray-300">
                                                                <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                                                                    const files = Array.from(e.target.files).slice(0, 4);
                                                                    if (files.length === 0) return;
                                                                    const promises = files.map(f => new Promise(res => handleFileToBase64(f, (b64, name) => res({ b64, name }))));
                                                                    Promise.all(promises).then(arr => setPosterState(comp._id, { photosBase64: arr.map(a => a.b64), photoNames: arr.map(a => a.name) }));
                                                                }} />
                                                                <Camera className="w-6 h-6 text-gray-400 mb-2" />
                                                                <p className="text-xs text-gray-600">Tap to upload photos</p>
                                                                <p className="text-[10px] text-gray-400">Multiple allowed • JPG/PNG</p>
                                                            </label>
                                                            {s.photoNames?.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{s.photoNames.map((n, i) => <span key={i} className="text-[10px] bg-white border px-2 py-1 rounded-full font-medium">{n}</span>)}</div>}
                                                            {s.photosBase64?.length > 0 && <div className="mt-3 grid grid-cols-4 gap-2">{s.photosBase64.map((b64, i) => <img key={i} src={b64} alt={`photo ${i}`} className="w-full h-20 object-cover rounded-lg border" />)}</div>}
                                                        </div>

                                                        <button onClick={() => handlePosterSubmit(comp)} disabled={paymentLoading && activeCompId === comp._id} className="w-full bg-[#1B4B43] text-white py-4 rounded-xl font-black hover:bg-[#133630] flex items-center justify-center gap-2 disabled:opacity-70">
                                                            {paymentLoading && activeCompId === comp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Round 2 <ArrowRight className="w-4 h-4" /></>}
                                                        </button>
                                                    </>); })()}
                                                </div>
                                            ) : (
                                                (() => {
                                                    const isRound2 = comp.paymentVerified === true || comp.status === 'selected';
                                                    const selectedPhotosCount = comp.type === 'eco-capture' && comp.photos ? comp.photos.filter(p => p.selected).length : 0;
                                                    const fee = isRound2 ? (comp.type === 'eco-pitch' ? 720 : (comp.type === 'eco-capture' ? selectedPhotosCount * 300 : 100)) : 0;
                                                    const roundLabel = isRound2 ? 'Round 2' : 'Round 1';
                                                    const selectedPhotos = comp.type === 'eco-capture' && comp.photos ? comp.photos.filter(p => p.selected) : [];
                                                    return (
                                                        <div className="p-5 md:p-6 rounded-xl bg-gradient-to-br from-[#F3F9F1] to-[#E8F9FF] border-2 border-[#1B4B43] shadow-lg">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="p-3 bg-white rounded-2xl shadow"><Wallet className="w-7 h-7 text-[#1B4B43]" /></div>
                                                                <h5 className="font-black text-[#1B4B43] text-lg">{comp.status === 'rejected' ? `Action Required: ${roundLabel} Payment Rejected` : `Action Required: ${roundLabel} Payment`}</h5>
                                                                {comp.type === 'eco-capture' && selectedPhotos.length > 0 && <div className="w-full space-y-3">{selectedPhotos.map((photo, idx) => (
                                                                    <div key={idx} className="bg-white rounded-xl p-3 flex gap-3 border"><img src={photo.url.replace('/upload/', '/upload/w_120,h_120,c_fill,q_auto,f_auto/')} alt="" className="w-20 h-20 rounded-lg object-cover" /><p className="text-xs italic line-clamp-3">"{photo.story}"</p></div>
                                                                ))}<p className="text-sm font-bold text-[#1B4B43] text-center">Fee: {selectedPhotos.length} × 300 = {fee} BDT</p></div>}
                                                                <p className="text-xs text-gray-700 text-center">{comp.status === 'rejected' ? `Re-submit ${roundLabel} payment details.` : `Complete ${fee} BDT payment via bKash/Nagad.`}</p>
                                                                {fee > 0 && (
                                                                    <><div className="grid grid-cols-2 gap-2 w-full"><button onClick={() => setPaymentMethod('bkash')} className={`py-2.5 rounded-xl border-2 font-bold ${paymentMethod === 'bkash' ? 'border-[#1B4B43] bg-white' : 'border-transparent bg-white/40'}`}>bKash</button><button onClick={() => setPaymentMethod('nagad')} className={`py-2.5 rounded-xl border-2 font-bold ${paymentMethod === 'nagad' ? 'border-[#1B4B43] bg-white' : 'border-transparent bg-white/40'}`}>Nagad</button></div>
                                                                    <div className="bg-white/80 px-4 py-4 rounded-2xl w-full flex justify-between border-2 border-dashed border-[#1B4B43]/30"><div><p className="text-[10px] font-bold text-gray-500 uppercase">Send Money To • {presidentName}</p><p className="font-mono font-black text-xl text-[#1B4B43] select-all">{presidentNumber}</p></div><div className="text-right"><p className="text-[10px] font-bold text-gray-500 uppercase">Amount</p><p className="font-mono font-black text-xl text-[#1B4B43]">{fee} BDT</p></div></div>
                                                                    <form onSubmit={e => { e.preventDefault(); handlePaymentSubmit(comp._id); }} className="w-full space-y-3">
                                                                        <input type="text" placeholder={`Enter ${paymentMethod} Transaction ID`} value={activeCompId === comp._id ? bkashTxId : ""} onChange={e => { setBkashTxId(e.target.value); setActiveCompId(comp._id); }} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#1B4B43] outline-none font-bold uppercase" required />
                                                                        <button type="submit" disabled={paymentLoading && activeCompId === comp._id} className="w-full bg-[#1B4B43] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2">{paymentLoading && activeCompId === comp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Transaction ID"}</button>
                                                                    </form></>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })()
                                            )}
                                        </div>
                                    )}

                                    {comp.status === "registered" && <div className="p-4 rounded-lg bg-blue-50 text-blue-800 text-sm mt-4">Under review. You'll be notified via email if selected.</div>}
                                    {comp.status === "eliminated" && <div className="p-4 rounded-lg bg-gray-50 text-gray-600 text-sm mt-4">Thank you for participating. Not selected this time.</div>}
                                    {comp.status === "paid" && <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-sm mt-4">Payment {comp.paymentMethodRound2 || 'bKash'} ({comp.bkashTxIdRound2}) received. Verifying shortly.</div>}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {results !== null && results.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-6 h-6 text-gray-400" /></div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Registrations Found</h3><p className="text-gray-500 text-sm">No registrations for <strong>{email}</strong></p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
