"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2, Search, Filter, Download, Trash2,
    CheckCircle2, XCircle, Eye, ExternalLink,
    FileText, Camera, Video, Zap, User, Users, Phone, Mail,
    ChevronRight, X, Star, ArrowLeft, GraduationCap, ChevronDown, Calendar, LayoutGrid
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import Link from "next/link";
import SemesterTabs, { getSemesterFromDate, getSemestersFromItems } from "@/components/dashboard/SemesterTabs";

const currentSemester = getSemesterFromDate(new Date());

export default function CompetitionAdmin() {
    const [competitors, setCompetitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const exportDropdownRef = useRef(null);
    const [photoSelectionLoading, setPhotoSelectionLoading] = useState(null);
    const [semesterFilter, setSemesterFilter] = useState(currentSemester);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
                setExportDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchCompetitors = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/competition?type=${filterType}`);
            const data = await res.json();
            if (data.result === 'success') {
                setCompetitors(data.data);
            } else {
                toast.error("Failed to load competitors");
            }
        } catch (err) {
            toast.error("Error connecting to server");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCompetitors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterType]);

    const handleStatusUpdate = async (id, status, paymentVerified = null, bkashTxId = undefined, paymentVerifiedRound2 = null, bkashTxIdRound2 = undefined) => {
        const loadingToast = toast.loading("Updating status...");
        try {
            const payload = { id, status };
            if (paymentVerified !== null) payload.paymentVerified = paymentVerified;
            if (bkashTxId !== undefined) payload.bkashTxId = bkashTxId;
            if (paymentVerifiedRound2 !== null) payload.paymentVerifiedRound2 = paymentVerifiedRound2;
            if (bkashTxIdRound2 !== undefined) payload.bkashTxIdRound2 = bkashTxIdRound2;

            const res = await fetch('/api/admin/competition', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.result === 'success') {
                toast.success(`Status updated to ${status}`, { id: loadingToast });
                setCompetitors(prev => prev.map(c => c._id === id ? { ...c, ...payload } : c));
                if (selectedEntry?._id === id) {
                    setSelectedEntry(prev => ({ ...prev, ...payload }));
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            toast.error("Failed to update status", { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this competitor?")) return;

        const loadingToast = toast.loading("Deleting record...");
        try {
            const res = await fetch(`/api/admin/competition?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.result === 'success') {
                toast.success("Competitor deleted", { id: loadingToast });
                setCompetitors(competitors.filter(c => c._id !== id));
                if (selectedEntry?._id === id) setSelectedEntry(null);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            toast.error("Failed to delete", { id: loadingToast });
        }
    };

    const handlePhotoSelectionToggle = async (compId, photoIndex, currentSelected) => {
        setPhotoSelectionLoading(`${compId}-${photoIndex}`);
        try {
            const res = await fetch('/api/admin/competition', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: compId, 
                    photoIndex, 
                    photoSelected: !currentSelected 
                })
            });
            const data = await res.json();

            if (data.result === 'success') {
                toast.success(`Photo ${!currentSelected ? 'selected' : 'deselected'} for Round 2`);
                // Update local state
                setCompetitors(prev => prev.map(c => {
                    if (c._id === compId) {
                        const updatedPhotos = [...c.photos];
                        updatedPhotos[photoIndex] = { ...updatedPhotos[photoIndex], selected: !currentSelected };
                        return { ...c, photos: updatedPhotos };
                    }
                    return c;
                }));
                // Update selected entry if viewing it
                if (selectedEntry?._id === compId) {
                    setSelectedEntry(prev => {
                        const updatedPhotos = [...prev.photos];
                        updatedPhotos[photoIndex] = { ...updatedPhotos[photoIndex], selected: !currentSelected };
                        return { ...prev, photos: updatedPhotos };
                    });
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            toast.error("Failed to update photo selection");
        } finally {
            setPhotoSelectionLoading(null);
        }
    };

    const handleExport = () => {
        const exportData = filteredCompetitors.map(c => ({
            "Competition": c.type.toUpperCase(),
            "Name/Team": c.name || c.teamName,
            "University": c.universityName || "N/A",
            "CA Reference": c.caReference || "N/A",
            "Email": c.email,
            "Phone": c.phone,
            "Members": c.members?.map(m => `${m.name} (${m.studentId || ''} ${m.department || ''})`).join(", ") || "N/A",
            "Track": c.trackCategory || "N/A",
            "Poster Title": c.posterTitle || c.round2PosterTitle || "N/A",
            "Status": c.status.toUpperCase(),
            "Payment Method": c.paymentMethod || "bkash",
            "Payment Verfied": c.paymentVerified ? "YES" : "NO",
            "Tx ID": c.bkashTxId || "N/A",
            "R2 Payment Method": c.paymentMethodRound2 || "bkash",
            "R2 Payment Verified": c.paymentVerifiedRound2 ? "YES" : "NO",
            "R2 Tx ID": c.bkashTxIdRound2 || "N/A",
            "R2 Sender Number": c.paymentSenderNumber || "N/A",
            "R2 Amount": c.paymentAmount || (c.type === 'poster-presentation' && c.bkashTxIdRound2 ? (c.isClubMember ? 399 : 499) : "N/A"),
            "R2 Club Member": c.isClubMember ? `YES (${c.clubMemberId})` : "NO",
            "R2 Screenshot": c.paymentScreenshotUrl || "N/A",
            "R2 Team Photos": c.teamPhotos?.map(p => p.url).join(", ") || "N/A",
            "Date": new Date(c.createdAt).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Competitors");
        XLSX.writeFile(wb, `eswc_competitors_${filterType}_${Date.now()}.xlsx`);
        setExportDropdownOpen(false);
    };

    // Complete JSON export with ALL MongoDB data - nothing missed
    const handleExportJSON = () => {
        // Group competitors by type for organized export
        const groupedData = {
            exportedAt: new Date().toISOString(),
            filterApplied: filterType,
            totalCount: filteredCompetitors.length,
            competitions: {}
        };

        // Initialize all competition types
        const types = ['eco-capture', 'eco-buzzers', 'green-story', 'eco-pitch', 'poster-presentation'];
        types.forEach(type => {
            groupedData.competitions[type] = {
                count: 0,
                entries: []
            };
        });

        // Process each competitor with complete data
        filteredCompetitors.forEach(c => {
            const completeEntry = {
                // MongoDB ID
                _id: c._id,
                
                // Competition type
                type: c.type,
                
                // Basic info (applicable to all)
                name: c.name || null,
                teamName: c.teamName || null,
                email: c.email,
                phone: c.phone || null,
                universityName: c.universityName || null,
                
                // Campus Ambassador Reference
                caReference: c.caReference || null,
                
                // Team members (for eco-buzzers, green-story, eco-pitch)
                members: c.members?.map(m => ({
                    name: m.name || null,
                    email: m.email || null,
                    phone: m.phone || null,
                    studentId: m.studentId || null,
                    universityName: m.universityName || null
                })) || [],
                
                // Eco Capture specific - photos with stories
                photos: c.type === 'eco-capture' ? (c.photos?.map(p => ({
                    url: p.url || null,
                    publicId: p.publicId || null,
                    story: p.story || null
                })) || []) : undefined,
                
                // Green Story specific - video link
                videoLink: c.type === 'green-story' ? (c.videoLink || null) : undefined,
                
                // Eco Pitch / Poster Presentation specific - PDF document
                pdfUrl: (c.type === 'eco-pitch' || c.type === 'poster-presentation') ? (c.pdfUrl || null) : undefined,
                pdfPublicId: (c.type === 'eco-pitch' || c.type === 'poster-presentation') ? (c.pdfPublicId || null) : undefined,
                trackCategory: c.trackCategory || null,
                posterTitle: c.posterTitle || null,
                round2PosterTitle: c.round2PosterTitle || null,
                confirmAi: c.confirmAi || false,
                confirmRules: c.confirmRules || false,
                
                // Status and round
                status: c.status,
                round: c.round || 1,
                
                // Round 1 Payment
                bkashTxId: c.bkashTxId || null,
                paymentMethod: c.paymentMethod || 'bkash',
                paymentVerified: c.paymentVerified || false,
                
                // Round 2 Payment
                bkashTxIdRound2: c.bkashTxIdRound2 || null,
                paymentMethodRound2: c.paymentMethodRound2 || 'bkash',
                paymentVerifiedRound2: c.paymentVerifiedRound2 || false,
                paymentSenderNumber: c.paymentSenderNumber || null,
                paymentScreenshotUrl: c.paymentScreenshotUrl || null,
                paymentScreenshotPublicId: c.paymentScreenshotPublicId || null,
                paymentAmount: c.paymentAmount || null,
                isClubMember: c.isClubMember || false,
                clubMemberId: c.clubMemberId || null,
                teamPhotos: c.teamPhotos?.map(p => ({ url: p.url, publicId: p.publicId })) || [],
                
                // Timestamps
                createdAt: c.createdAt,
                createdAtFormatted: new Date(c.createdAt).toLocaleString()
            };

            // Remove undefined fields for cleaner export
            Object.keys(completeEntry).forEach(key => {
                if (completeEntry[key] === undefined) {
                    delete completeEntry[key];
                }
            });

            groupedData.competitions[c.type].entries.push(completeEntry);
            groupedData.competitions[c.type].count++;
        });

        // Remove empty competition types if filtering by specific type
        if (filterType !== 'all') {
            Object.keys(groupedData.competitions).forEach(type => {
                if (groupedData.competitions[type].count === 0) {
                    delete groupedData.competitions[type];
                }
            });
        }

        // Create and download JSON file
        const jsonString = JSON.stringify(groupedData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `eswc_competitions_complete_${filterType}_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(`Exported ${filteredCompetitors.length} entries as JSON`);
        setExportDropdownOpen(false);
    };

    // Export single competition type with all data
    const handleExportSingleTypeJSON = (type) => {
        const typeData = filteredCompetitors.filter(c => c.type === type);
        
        if (typeData.length === 0) {
            toast.error(`No ${type} entries found`);
            return;
        }

        const typeLabels = {
            'eco-capture': 'Eco Capture',
            'eco-buzzers': 'Green Buzzers Battle',
            'green-story': 'Green Story',
            'eco-pitch': 'Eco Pitch 180',
            'poster-presentation': 'Poster Presentation'
        };

        const exportData = {
            competitionType: type,
            competitionName: typeLabels[type],
            exportedAt: new Date().toISOString(),
            totalEntries: typeData.length,
            entries: typeData.map(c => {
                const entry = {
                    _id: c._id,
                    
                    // Basic info
                    ...(type === 'eco-capture' ? {
                        // Eco Capture is individual
                        participantName: c.name,
                        email: c.email,
                        phone: c.phone,
                        universityName: c.universityName,
                        caReference: c.caReference || null,
                        photos: c.photos?.map(p => ({
                            imageUrl: p.url,
                            cloudinaryPublicId: p.publicId,
                            story: p.story
                        })) || []
                    } : {}),
                    
                    ...(type === 'eco-buzzers' ? {
                        // Eco Buzzers is team (1-2 members)
                        teamName: c.teamName,
                        teamLeaderEmail: c.email,
                        teamLeaderPhone: c.phone,
                        universityName: c.universityName,
                        caReference: c.caReference || null,
                        teamMembers: c.members?.map((m, idx) => ({
                            memberNumber: idx + 1,
                            name: m.name,
                            email: m.email,
                            phone: m.phone,
                            studentId: m.studentId,
                            universityName: m.universityName
                        })) || []
                    } : {}),
                    
                    ...(type === 'green-story' ? {
                        // Green Story is team (1-3 members) with video
                        teamName: c.teamName,
                        teamLeaderEmail: c.email,
                        teamLeaderPhone: c.phone,
                        universityName: c.universityName,
                        caReference: c.caReference || null,
                        videoSubmissionLink: c.videoLink,
                        teamMembers: c.members?.map((m, idx) => ({
                            memberNumber: idx + 1,
                            name: m.name,
                            email: m.email,
                            phone: m.phone,
                            studentId: m.studentId,
                            universityName: m.universityName
                        })) || []
                    } : {}),
                    
                    ...(type === 'eco-pitch' ? {
                        // Eco Pitch is team (1-3 members) with PDF
                        teamName: c.teamName,
                        teamLeaderEmail: c.email,
                        teamLeaderPhone: c.phone,
                        caReference: c.caReference || null,
                        abstractDocumentUrl: c.pdfUrl,
                        abstractDocumentPublicId: c.pdfPublicId,
                        teamMembers: c.members?.map((m, idx) => ({
                            memberNumber: idx + 1,
                            name: m.name,
                            email: m.email,
                            phone: m.phone,
                            studentId: m.studentId,
                            universityName: m.universityName
                        })) || []
                    } : {}),

                    ...(type === 'poster-presentation' ? {
                        teamName: c.teamName,
                        teamLeaderEmail: c.email,
                        teamLeaderPhone: c.phone,
                        caReference: c.caReference || null,
                        trackCategory: c.trackCategory || null,
                        posterTitle: c.posterTitle || null,
                        round2PosterTitle: c.round2PosterTitle || null,
                        abstractDocumentUrl: c.pdfUrl,
                        abstractDocumentPublicId: c.pdfPublicId,
                        teamMembers: c.members?.map((m, idx) => ({
                            memberNumber: idx + 1,
                            name: m.name,
                            email: m.email,
                            phone: m.phone,
                            studentId: m.studentId,
                            universityName: m.universityName,
                            department: m.department,
                            semester: m.semester
                        })) || [],
                        round2Payment: {
                            transactionId: c.bkashTxIdRound2 || null,
                            paymentMethod: c.paymentMethodRound2 || 'bkash',
                            verified: c.paymentVerifiedRound2 || false,
                            senderNumber: c.paymentSenderNumber || null,
                            screenshotUrl: c.paymentScreenshotUrl || null,
                            amount: c.paymentAmount || null,
                            isClubMember: c.isClubMember || false,
                            clubMemberId: c.clubMemberId || null,
                            teamPhotos: c.teamPhotos?.map(p => p.url) || []
                        }
                    } : {}),
                    
                    // Status & Round
                    status: c.status,
                    currentRound: c.round || 1,
                    
                    // Payment info (Round 1)
                    round1Payment: {
                        transactionId: c.bkashTxId || null,
                        paymentMethod: c.paymentMethod || 'bkash',
                        verified: c.paymentVerified || false
                    },
                    
                    ...(type !== 'poster-presentation' ? {
                    round2Payment: {
                        transactionId: c.bkashTxIdRound2 || null,
                        paymentMethod: c.paymentMethodRound2 || 'bkash',
                        verified: c.paymentVerifiedRound2 || false
                    }} : {}),
                    
                    // Timestamps
                    registeredAt: c.createdAt,
                    registeredAtFormatted: new Date(c.createdAt).toLocaleString()
                };

                return entry;
            })
        };

        // Create and download JSON file
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `eswc_${type}_complete_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(`Exported ${typeData.length} ${typeLabels[type]} entries as JSON`);
        setExportDropdownOpen(false);
    };

    const filteredCompetitors = competitors
        .filter(c => {
            // Search filter
            const query = searchQuery.toLowerCase();
            const matchName = (c.name || '').toLowerCase().includes(query);
            const matchTeam = (c.teamName || '').toLowerCase().includes(query);
            const matchEmail = (c.email || '').toLowerCase().includes(query);
            const matchPhone = (c.phone || '').toLowerCase().includes(query);
            const matchSearch = matchName || matchTeam || matchEmail || matchPhone;

            // Semester filter
            const matchSemester = semesterFilter === 'all' || getSemesterFromDate(c.createdAt) === semesterFilter;

            return matchSearch && matchSemester;
        })
        .sort((a, b) => {
            let valA, valB;
            if (sortBy === "name") {
                valA = a.name || a.teamName || "";
                valB = b.name || b.teamName || "";
            } else if (sortBy === "createdAt") {
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
            } else if (sortBy === "status") {
                valA = a.status;
                valB = b.status;
            } else if (sortBy === "type") {
                valA = a.type;
                valB = b.type;
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    // Derive available semesters from competition data
    const availableSemesters = getSemestersFromItems(competitors);

    // Count competitors per semester
    const semesterCounts = {
        'all': competitors.length,
        ...availableSemesters.reduce((acc, sem) => {
            acc[sem] = competitors.filter(c => getSemesterFromDate(c.createdAt) === sem).length;
            return acc;
        }, {})
    };

    const getStatusBadge = (status) => {
        const styles = {
            registered: "bg-slate-100 text-slate-600 border-slate-200",
            selected: "bg-blue-50 text-blue-700 border-blue-100",
            paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
            eliminated: "bg-rose-50 text-rose-700 border-rose-100",
            rejected: "bg-amber-50 text-amber-700 border-amber-100"
        };
        return <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border ${styles[status]}`}>{status}</span>;
    };

    const getCompetitionBadge = (type) => {
        const styles = {
            'eco-capture': { bg: "bg-cyan-50", text: "text-cyan-700", icon: Camera },
            'eco-buzzers': { bg: "bg-amber-50", text: "text-amber-700", icon: Zap },
            'green-story': { bg: "bg-green-50", text: "text-green-700", icon: Video },
            'eco-pitch': { bg: "bg-pink-50", text: "text-pink-700", icon: FileText },
            'poster-presentation': { bg: "bg-indigo-50", text: "text-indigo-700", icon: FileText }
        };
        const config = styles[type] || { bg: "bg-slate-50", text: "text-slate-700", icon: User };
        const Icon = config.icon;

        const labelMap = {
            'eco-capture': 'Eco Capture',
            'eco-buzzers': 'Green Buzzers Battle',
            'green-story': 'Green Story',
            'eco-pitch': 'Eco Pitch 180',
            'poster-presentation': 'Poster Presentation',
        };

        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg} ${config.text} border border-current/10`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-tight">{labelMap[type] || type.replace('-', ' ')}</span>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#F8FAFC] font-sans">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Competitions Panel</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Monitor registrations and manage competition lifecycle.</p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find participant..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold text-sm shadow-sm cursor-pointer"
                        >
                            <option value="all">All Events</option>
                            <option value="eco-capture">Eco Capture</option>
                            <option value="eco-buzzers">Green Buzzers Battle</option>
                            <option value="green-story">Green Story</option>
                            <option value="eco-pitch">Eco Pitch 180</option>
                            <option value="poster-presentation">Poster Presentation</option>
                        </select>

                        <button onClick={handleExport} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg active:scale-95" disabled={loading || filteredCompetitors.length === 0}>
                            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export XLSX</span>
                        </button>

                        {/* Export Dropdown */}
                        <div className="relative" ref={exportDropdownRef}>
                            <button 
                                onClick={() => setExportDropdownOpen(!exportDropdownOpen)} 
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg active:scale-95" 
                                disabled={loading || filteredCompetitors.length === 0}
                            >
                                <FileText className="w-4 h-4" /> 
                                <span className="hidden sm:inline">Export JSON</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {exportDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                                    <div className="p-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Export Complete JSON Data</p>
                                        
                                        {/* Export All */}
                                        <button
                                            onClick={handleExportJSON}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-emerald-50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center">
                                                <Download className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">All Competitions</p>
                                                <p className="text-[10px] text-slate-400">Export all {filteredCompetitors.length} entries</p>
                                            </div>
                                        </button>

                                        <div className="h-px bg-slate-100 my-2"></div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">By Competition Type</p>

                                        {/* Eco Capture */}
                                        <button
                                            onClick={() => handleExportSingleTypeJSON('eco-capture')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-cyan-50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                                                <Camera className="w-4 h-4 text-cyan-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Eco Capture</p>
                                                <p className="text-[10px] text-slate-400">Photos, stories, participant info</p>
                                            </div>
                                        </button>

                                        {/* Eco Buzzers */}
                                        <button
                                            onClick={() => handleExportSingleTypeJSON('eco-buzzers')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-amber-50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Green Buzzers Battle</p>
                                                <p className="text-[10px] text-slate-400">Team info, members, payments</p>
                                            </div>
                                        </button>

                                        {/* Green Story */}
                                        <button
                                            onClick={() => handleExportSingleTypeJSON('green-story')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-green-50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                                <Video className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Green Story</p>
                                                <p className="text-[10px] text-slate-400">Video links, team members</p>
                                            </div>
                                        </button>

                                        {/* Eco Pitch */}
                                        <button
                                            onClick={() => handleExportSingleTypeJSON('eco-pitch')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-pink-50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Eco Pitch 180</p>
                                                <p className="text-[10px] text-slate-400">PDF URLs, team info, universities</p>
                                            </div>
                                        </button>

                                        {/* Poster Presentation */}
                                        <button
                                            onClick={() => handleExportSingleTypeJSON('poster-presentation')}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-indigo-50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Poster Presentation</p>
                                                <p className="text-[10px] text-slate-400">Abstract PDF URLs, team info</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Semester Tabs */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            Filter by Semester
                        </h2>
                        <p className="text-slate-500 font-medium text-xs">Select a semester to view its competitions.</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 tracking-widest">
                        {filteredCompetitors.length} Entries Shown
                    </span>
                </div>
                <SemesterTabs
                    semesters={availableSemesters}
                    activeTab={semesterFilter}
                    onTabChange={setSemesterFilter}
                    counts={semesterCounts}
                />
            </section>

            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[1000px]">
                        <thead className="bg-slate-50/50 text-slate-400 uppercase font-black text-[9px] tracking-[0.2em] border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-5 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => toggleSort("type")}>
                                    <div className="flex items-center gap-2">Competition {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                                </th>
                                <th className="px-6 py-5 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => toggleSort("name")}>
                                    <div className="flex items-center gap-2">Participant {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                                </th>
                                <th className="px-6 py-5">Asset</th>
                                <th className="px-6 py-5 cursor-pointer hover:text-slate-900 transition-colors" onClick={() => toggleSort("status")}>
                                    <div className="flex items-center gap-2">Status & Payment {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                                </th>
                                <th className="px-6 py-5">Quick Actions</th>
                                <th className="px-6 py-5 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center bg-white">
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                                            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCompetitors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-slate-400 bg-white">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                <Filter className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-bold text-lg">No entries in {semesterFilter === 'all' ? 'any semester' : semesterFilter}</p>
                                            <p className="text-slate-400 text-sm">Competition entries will appear here once submitted for this semester.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCompetitors.map((comp) => (
                                    <tr key={comp._id} className="hover:bg-slate-50/80 transition-all border-l-4 border-l-transparent hover:border-l-emerald-500 group">
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            {getCompetitionBadge(comp.type)}
                                            <p className="text-[10px] font-bold text-slate-400 mt-2.5 flex items-center gap-1.5 opacity-60">
                                                <CalendarIcon /> {new Date(comp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6 font-medium">
                                            <p className="font-extrabold text-slate-900 leading-tight mb-1">{comp.teamName || comp.name}</p>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                                                    <Mail className="w-3 h-3" /> {comp.email}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3" /> {comp.phone || 'N/A'}
                                                </p>
                                                {/* Show university for eco-capture, eco-buzzers, and green-story */}
                                                {(comp.type === 'eco-capture' || comp.type === 'eco-buzzers' || comp.type === 'green-story') && comp.universityName && (
                                                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                                                        <GraduationCap className="w-3 h-3" /> {comp.universityName}
                                                    </p>
                                                )}
                                                {comp.caReference && (
                                                    <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1.5">
                                                        <Star className="w-3 h-3" /> CA: {comp.caReference}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {comp.type === 'eco-capture' && (
                                                <div className="inline-flex items-center gap-3">
                                                    <div className="flex -space-x-3 overflow-hidden cursor-pointer hover:-space-x-1 transition-all" onClick={() => setSelectedEntry(comp)}>
                                                        {comp.photos?.slice(0, 3).map((p, i) => {
                                                            const thumbUrl = p.url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');
                                                            return <img key={i} src={thumbUrl} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md" alt="Submission Thumbnail" />
                                                        })}
                                                        {comp.photos?.length > 3 && (
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-md">
                                                                +{comp.photos.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{comp.photos?.length} frames</span>
                                                </div>
                                            )}
                                            {['eco-pitch', 'green-story', 'eco-buzzers', 'poster-presentation'].includes(comp.type) && (
                                                <button
                                                    onClick={() => setSelectedEntry(comp)}
                                                    className="flex items-center gap-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 font-black px-4 py-2 rounded-xl transition-all text-[10px] uppercase tracking-wider shadow-sm active:scale-95"
                                                >
                                                    {comp.type === 'eco-pitch' || comp.type === 'poster-presentation' ? <FileText className="w-3.5 h-3.5" /> :
                                                        comp.type === 'green-story' ? <Video className="w-3.5 h-3.5" /> :
                                                            <Users className="w-3.5 h-3.5" />}
                                                    Asset
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div>{getStatusBadge(comp.status)}</div>

                                                <div className="h-10 w-px bg-slate-100 shrink-0"></div>

                                                {comp.bkashTxId ? (
                                                    <div className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl border border-slate-100 group/pay min-w-[200px]">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tx ID (R1)</span>
                                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm border ${comp.paymentMethod === 'rocket' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-pink-100 text-pink-700 border-pink-200'}`}>
                                                                    {comp.paymentMethod || 'bkash'}
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] font-mono font-black text-slate-900 uppercase tracking-tight">{comp.bkashTxId}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 ml-auto">
                                                            {comp.paymentVerified ? (
                                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500 text-white rounded-md text-[8px] font-black uppercase tracking-tighter shadow-sm">
                                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(comp._id, comp.status, true)}
                                                                        className="px-2 py-1 bg-white border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm whitespace-nowrap"
                                                                    >
                                                                        Verify
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(comp._id, 'rejected', false, null)}
                                                                        className="px-2 py-1 bg-white border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm whitespace-nowrap"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : comp.status === 'paid' ? (
                                                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[9px] text-emerald-700 font-black uppercase tracking-[0.1em]">Payment Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                        <span className="text-[9px] text-amber-700 font-black uppercase tracking-[0.1em]">Unpaid</span>
                                                    </div>
                                                )}

                                                {/* Round 2 Payment Display */}
                                                {comp.bkashTxIdRound2 && (
                                                    <div className="flex items-center gap-3 p-2 bg-pink-50/50 rounded-xl border border-pink-100 group/pay min-w-[200px]">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Tx ID (R2)</span>
                                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{comp.type === 'poster-presentation' ? (comp.paymentAmount ? `${comp.paymentAmount} TK` : comp.isClubMember ? '399 TK' : '499 TK') : comp.type === 'eco-pitch' ? '700 TK' : '100 TK'}</span>
                                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm border ${comp.paymentMethodRound2 === 'rocket' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-pink-100 text-pink-700 border-pink-200'}`}>
                                                                    {comp.paymentMethodRound2 || 'bkash'}
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] font-mono font-black text-slate-900 uppercase tracking-tight">{comp.bkashTxIdRound2}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 ml-auto">
                                                            {comp.paymentVerifiedRound2 ? (
                                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-pink-500 text-white rounded-md text-[8px] font-black uppercase tracking-tighter shadow-sm">
                                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(comp._id, comp.status, null, undefined, true)}
                                                                        className="px-2 py-1 bg-white border border-pink-200 hover:bg-pink-600 hover:text-white text-pink-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm whitespace-nowrap"
                                                                    >
                                                                        Verify
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(comp._id, 'rejected', null, undefined, false, null)}
                                                                        className="px-2 py-1 bg-white border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm whitespace-nowrap"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 transition-opacity">
                                                {comp.status === 'registered' && comp.type !== 'green-story' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(comp._id, 'selected')}
                                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-emerald-100 active:scale-95"
                                                    >
                                                        Select
                                                    </button>
                                                )}
                                                {comp.status !== 'eliminated' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(comp._id, 'eliminated')}
                                                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-red-100 active:scale-95"
                                                    >
                                                        Eliminate
                                                    </button>
                                                )}
                                                {(comp.status === 'selected' || comp.status === 'paid' || comp.status === 'eliminated') && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(comp._id, 'registered')}
                                                        className="px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-slate-100 active:scale-95"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setSelectedEntry(comp)}
                                                    className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="View Full Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comp._id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                                                    title="Remove Entry"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submission Detail Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEntry(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col bg-submission-pattern"
                        >
                            {/* Modal Header */}
                            <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-xl z-10">
                                <div className="flex items-center gap-5">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">{selectedEntry.teamName || selectedEntry.name}</h2>
                                        <div className="flex items-center gap-3">
                                            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${selectedEntry.type === 'eco-capture' ? 'bg-cyan-50 text-cyan-600' :
                                                selectedEntry.type === 'eco-buzzers' ? 'bg-amber-50 text-amber-600' :
                                                    selectedEntry.type === 'green-story' ? 'bg-green-50 text-green-600' :
                                                        'bg-pink-50 text-pink-600'
                                                }`}>
                                                {selectedEntry.type === 'eco-buzzers' ? 'Green Buzzers Battle' : selectedEntry.type.replace('-', ' ')}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Round {selectedEntry.round || 1}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedEntry(null)} className="p-3 bg-slate-50 hover:bg-slate-100 hover:rotate-90 rounded-full transition-all text-slate-400 hover:text-slate-600 border border-slate-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
                                {/* Top Meta Bar: Contact & Control */}
                                <div className="px-8 py-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                                    <div className="flex flex-wrap items-center gap-8 lg:gap-12">
                                        {/* Contact Section */}
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-50 rounded-xl">
                                                    <Mail className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email Address</span>
                                                    <span className="text-sm font-bold text-slate-700">{selectedEntry.email}</span>
                                                </div>
                                            </div>
                                            <div className="w-[1px] h-8 bg-slate-200/60 hidden sm:block"></div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-50 rounded-xl">
                                                    <Phone className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phone Number</span>
                                                    <span className="text-sm font-bold text-slate-700">{selectedEntry.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                            {/* Show university for eco-capture, eco-buzzers, and green-story */}
                                            {(selectedEntry.type === 'eco-capture' || selectedEntry.type === 'eco-buzzers' || selectedEntry.type === 'green-story') && selectedEntry.universityName && (
                                                <>
                                                    <div className="w-[1px] h-8 bg-slate-200/60 hidden sm:block"></div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-emerald-50 rounded-xl">
                                                            <GraduationCap className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">University</span>
                                                            <span className="text-sm font-bold text-slate-700">{selectedEntry.universityName}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {selectedEntry.caReference && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-50 rounded-xl">
                                                    <Star className="w-4 h-4 text-amber-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">CA Reference</span>
                                                    <span className="text-sm font-bold text-amber-700">{selectedEntry.caReference}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="w-[1px] h-10 bg-slate-200 hidden lg:block"></div>

                                        {/* Status Control */}
                                        <div className="flex items-center gap-3">
                                            {selectedEntry.status === 'registered' && selectedEntry.type !== 'green-story' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(selectedEntry._id, 'selected')}
                                                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shadow-sm bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                                                >
                                                    Select Round 2
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleStatusUpdate(selectedEntry._id, 'eliminated')}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shadow-sm ${selectedEntry.status === 'eliminated' ? 'bg-rose-600 text-white border-rose-600 shadow-rose-200' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-500 hover:text-rose-600'}`}
                                            >
                                                Eliminate
                                            </button>
                                        </div>

                                        {/* Payment verification if applicable */}
                                        {(selectedEntry.bkashTxId || selectedEntry.bkashTxIdRound2) && (
                                            <div className="flex items-center gap-6 ml-auto">
                                                {selectedEntry.bkashTxId && (
                                                    <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${selectedEntry.paymentMethod === 'rocket' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-pink-100 text-pink-700 border-pink-200'}`}>{selectedEntry.paymentMethod || 'bkash'}</span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">R1 Tx ID</span>
                                                            </div>
                                                            <span className="text-sm font-black text-slate-900 font-mono tracking-tight bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{selectedEntry.bkashTxId}</span>
                                                            {selectedEntry.paymentVerified ?
                                                                <span className="text-[8px] bg-emerald-100 text-emerald-700 font-black px-1.5 py-0.5 rounded-full uppercase mt-1">Verified</span> :
                                                                <span className="text-[8px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded-full uppercase mt-1">Pending</span>
                                                            }
                                                        </div>
                                                        {!selectedEntry.paymentVerified && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(selectedEntry._id, selectedEntry.status, true)}
                                                                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md shadow-emerald-500/20"
                                                                title="Verify Round 1 Payment"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {selectedEntry.bkashTxIdRound2 && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${selectedEntry.paymentMethodRound2 === 'rocket' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-pink-100 text-pink-700 border-pink-200'}`}>{selectedEntry.paymentMethodRound2 || 'bkash'}</span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">R2 Tx ID</span>
                                                            </div>
                                                            <span className="text-sm font-black text-slate-900 font-mono tracking-tight bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">{selectedEntry.bkashTxIdRound2}</span>
                                                            {selectedEntry.paymentVerifiedRound2 ?
                                                                <span className="text-[8px] bg-emerald-100 text-emerald-700 font-black px-1.5 py-0.5 rounded-full uppercase mt-1">Verified</span> :
                                                                <span className="text-[8px] bg-pink-100 text-pink-700 font-black px-1.5 py-0.5 rounded-full uppercase mt-1">Pending</span>
                                                            }
                                                        </div>
                                                        {!selectedEntry.paymentVerifiedRound2 && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(selectedEntry._id, selectedEntry.status, null, undefined, true)}
                                                                className="p-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all shadow-md shadow-pink-500/20"
                                                                title="Verify Round 2 Payment"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 lg:p-12">

                                    {/* Eco Capture: Full Width Cinematic Gallery */}
                                    {selectedEntry.type === 'eco-capture' && (
                                        <div className="max-w-4xl mx-auto space-y-24">
                                            {/* Selected Photos Summary */}
                                            {selectedEntry.photos?.some(p => p.selected) && (
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black">
                                                            {selectedEntry.photos.filter(p => p.selected).length}
                                                        </div>
                                                        <div>
                                                            <p className="text-emerald-800 font-bold">Photos Selected for Round 2</p>
                                                            <p className="text-emerald-600 text-sm">Fee: {selectedEntry.photos.filter(p => p.selected).length} × 300 = <span className="font-black">{selectedEntry.photos.filter(p => p.selected).length * 300} BDT</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {selectedEntry.photos?.map((p, i) => (
                                                <div key={i} className={`group flex flex-col gap-8 ${p.selected ? 'ring-4 ring-emerald-500 ring-offset-8 rounded-3xl' : ''}`}>
                                                    {/* Story on Top */}
                                                    <div className={`max-w-2xl text-left p-8 rounded-[2rem] border-l-4 shadow-sm transition-all ${p.selected ? 'bg-emerald-100 border-emerald-600' : 'bg-emerald-50/50 border-emerald-500 group-hover:bg-emerald-50'}`}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg ${p.selected ? 'bg-emerald-700 shadow-emerald-300' : 'bg-emerald-600 shadow-emerald-200'}`}>0{i + 1}</div>
                                                                <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">The Photographic Story</h4>
                                                            </div>
                                                            {/* Selection Badge */}
                                                            {p.selected && (
                                                                <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-700 text-lg leading-relaxed font-medium italic opacity-90 antialiased font-serif">
                                                            "{p.story}"
                                                        </p>
                                                    </div>

                                                    {/* Image in Premium Frame */}
                                                    <div className={`relative rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all duration-700 w-full max-w-4xl mx-auto bg-slate-100 flex items-center justify-center ${p.selected ? 'border-emerald-200' : 'border-white'}`}>
                                                        <div className="relative group cursor-zoom-in w-full flex justify-center" onClick={() => setFullscreenImage(p.url)}>
                                                            <img
                                                                src={p.url.replace('/upload/', '/upload/c_limit,w_1200,q_auto,f_auto/')}
                                                                className="max-w-full max-h-[80vh] object-contain transition-transform duration-1000 group-hover:scale-[1.02]"
                                                                alt={`Photo ${i + 1}`}
                                                                loading="lazy"
                                                            />

                                                            {/* Overlay Badges */}
                                                            <div className="absolute top-6 left-6 flex items-center gap-2">
                                                                <div className="bg-emerald-900/40 backdrop-blur-md text-emerald-50 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100/20 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                                                    Capture Frame #{i + 1}
                                                                </div>
                                                                {p.selected && (
                                                                    <div className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                                                                        ✓ R2 Selected
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                                            {/* Quick Actions */}
                                                            <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                                                {/* Photo Selection Toggle */}
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handlePhotoSelectionToggle(selectedEntry._id, i, p.selected); }}
                                                                    disabled={photoSelectionLoading === `${selectedEntry._id}-${i}`}
                                                                    className={`px-4 py-3 backdrop-blur-md rounded-full shadow-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${
                                                                        p.selected 
                                                                            ? 'bg-rose-500 text-white hover:bg-rose-600' 
                                                                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                                    } ${photoSelectionLoading === `${selectedEntry._id}-${i}` ? 'opacity-50' : ''}`}
                                                                >
                                                                    {photoSelectionLoading === `${selectedEntry._id}-${i}` ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : p.selected ? (
                                                                        <><XCircle className="w-4 h-4" /> Deselect</>
                                                                    ) : (
                                                                        <><CheckCircle2 className="w-4 h-4" /> Select for R2</>
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setFullscreenImage(p.url); }}
                                                                    className="p-3 bg-white/90 backdrop-blur-md text-emerald-900 rounded-full shadow-2xl hover:bg-emerald-600 hover:text-white transition-all"
                                                                >
                                                                    <Eye className="w-5 h-5" />
                                                                </button>
                                                                <a
                                                                    href={p.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-3 bg-white/90 backdrop-blur-md text-emerald-900 rounded-full shadow-2xl hover:bg-emerald-600 hover:text-white transition-all"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <ExternalLink className="w-5 h-5" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Other Competitions (Top-Down Cinematic Layout) */}
                                    {selectedEntry.type !== 'eco-capture' && (
                                        <div className="max-w-4xl mx-auto space-y-16">
                                            {/* 1. Team Roster on Top */}
                                            {selectedEntry.members?.length > 0 && (
                                                <section>
                                                    <div className="flex items-center gap-3 mb-6 px-2">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-200">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                        <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">Team Roster</h3>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {selectedEntry.members.map((m, i) => (
                                                            <div key={i} className="group flex flex-col gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                                                                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                                                    <span className="text-sm font-black text-slate-900">{m.name}</span>
                                                                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Member 0{i + 1}</span>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                                        <Mail className="w-3 h-3 text-emerald-500" /> {m.email}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                                        <Phone className="w-3 h-3 text-emerald-500" /> {m.phone}
                                                                    </div>
                                                                    {m.universityName && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                                           <GraduationCap className="w-3 h-3 text-emerald-500" /> {m.universityName}
                                                                        </div>
                                                                    )}
                                                                    {m.department && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                                           <GraduationCap className="w-3 h-3 text-emerald-500" /> {m.department} {m.semester ? `• ${m.semester}` : ''}
                                                                        </div>
                                                                    )}
                                                                    {m.studentId && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                                            <FileText className="w-3 h-3 text-emerald-500" /> ID: {m.studentId}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {/* 2. Submission Asset Below */}
                                            <section className="space-y-8">
                                                <div className="flex items-center gap-3 px-2">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-200">
                                                        {selectedEntry.type === 'eco-pitch' || selectedEntry.type === 'poster-presentation' ? <FileText className="w-4 h-4" /> :
                                                            selectedEntry.type === 'green-story' ? <Video className="w-4 h-4" /> :
                                                                <Zap className="w-4 h-4" />}
                                                    </div>
                                                    <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">Submission Asset</h3>
                                                </div>

                                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white bg-white">
                                                    {/* Eco Pitch / Poster Presentation Asset */}
                                                    {(selectedEntry.type === 'eco-pitch' || selectedEntry.type === 'poster-presentation') && (() => {
                                                        const rawPdfUrl = selectedEntry.pdfUrl
                                                            ? selectedEntry.pdfUrl.replace('/image/upload/', '/raw/upload/')
                                                            : null;

                                                        return (
                                                            <div className="p-8 lg:p-12 text-center">
                                                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                                                    <FileText className="w-10 h-10" />
                                                                </div>
                                                                <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                                                                    {selectedEntry.type === 'poster-presentation' ? 'Abstract Document' : 'Research Abstract Document'}
                                                                </h4>
                                                                <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto font-medium">
                                                                    {selectedEntry.type === 'poster-presentation'
                                                                        ? 'Original abstract submitted during poster presentation registration.'
                                                                        : 'Original document submitted for the 3-minute thesis presentation.'}
                                                                </p>

                                                                {!rawPdfUrl ? (
                                                                    <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 text-rose-700 text-sm font-bold flex items-center justify-center gap-2">
                                                                        <XCircle className="w-5 h-5" /> No document found.
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-8">
                                                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                                                            <a
                                                                                href={rawPdfUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                                                            >
                                                                                Open Document <ExternalLink className="w-4 h-4" />
                                                                            </a>
                                                                            <a
                                                                                href={rawPdfUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                download
                                                                                className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 rounded-2xl font-black transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                                                            >
                                                                                <Download className="w-4 h-4" /> Download
                                                                            </a>
                                                                        </div>
                                                                        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 h-[600px] hidden md:block">
                                                                            <iframe
                                                                                src={rawPdfUrl}
                                                                                className="w-full h-full border-none"
                                                                                title="Document Preview"
                                                                            ></iframe>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Green Story Asset */}
                                                    {selectedEntry.type === 'green-story' && (
                                                        <div className="p-12 text-center">
                                                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                                                <Video className="w-10 h-10" />
                                                            </div>
                                                            <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Video Advertisement</h4>
                                                            <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto font-medium">Link to the participant's video submission on Google Drive.</p>
                                                            <a
                                                                href={selectedEntry.videoLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-3 px-12 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs"
                                                            >
                                                                Watch Video on Drive <ChevronRight className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Eco Buzzers Asset */}
                                                    {selectedEntry.type === 'eco-buzzers' && (
                                                        <div className="p-12 text-center">
                                                            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
                                                                <Zap className="w-10 h-10" />
                                                            </div>
                                                            <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Green Buzzers Battle Registration</h4>
                                                            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">This team is registered for the environmental buzzer round competition.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>

                                            {selectedEntry.type === 'poster-presentation' && (
                                                <section className="space-y-6 mt-8">
                                                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-wrap gap-4 text-sm">
                                                        {selectedEntry.trackCategory && <span className="px-3 py-1.5 bg-white border border-indigo-200 rounded-xl font-bold text-indigo-800 text-xs">Track: {selectedEntry.trackCategory}</span>}
                                                        {selectedEntry.posterTitle && <span className="px-3 py-1.5 bg-white border border-indigo-200 rounded-xl font-bold text-slate-700 text-xs flex-1">Title: {selectedEntry.posterTitle}</span>}
                                                        {selectedEntry.confirmAi !== undefined && <span className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${selectedEntry.confirmAi ? 'bg-green-50 border-green-200 text-green-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>{selectedEntry.confirmAi ? '✓ AI <30% confirmed' : '✗ AI not confirmed'}</span>}
                                                    </div>

                                                    {(selectedEntry.bkashTxIdRound2 || selectedEntry.paymentSenderNumber || selectedEntry.paymentScreenshotUrl) && (
                                                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 flex items-center gap-2">Round 2 — Payment & Media</h3>
                                                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                                                {selectedEntry.bkashTxIdRound2 && <div className="bg-pink-50 border border-pink-100 rounded-xl p-3"><p className="text-[10px] font-black uppercase text-pink-500">TrxID</p><p className="font-mono font-black">{selectedEntry.bkashTxIdRound2} <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border">{selectedEntry.paymentMethodRound2}</span></p></div>}
                                                                {selectedEntry.paymentSenderNumber && <div className="bg-slate-50 border border-slate-100 rounded-xl p-3"><p className="text-[10px] font-black uppercase text-slate-400">Sender Number</p><p className="font-bold">{selectedEntry.paymentSenderNumber}</p></div>}
                                                                {selectedEntry.paymentAmount && <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3"><p className="text-[10px] font-black uppercase text-emerald-600">Amount</p><p className="font-black text-lg">{selectedEntry.paymentAmount} BDT {selectedEntry.isClubMember && <span className="text-xs font-bold text-green-700 bg-white px-2 py-0.5 rounded-full border ml-2">20% OFF</span>}</p></div>}
                                                                {selectedEntry.isClubMember && <div className="bg-amber-50 border border-amber-100 rounded-xl p-3"><p className="text-[10px] font-black uppercase text-amber-600">Club Member</p><p className="font-bold">{selectedEntry.clubMemberId || 'YES'}</p></div>}
                                                            </div>
                                                            {selectedEntry.paymentScreenshotUrl && (
                                                                <div>
                                                                    <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Payment Screenshot</p>
                                                                    <img src={selectedEntry.paymentScreenshotUrl} alt="Payment Screenshot" className="max-w-sm w-full rounded-xl border-4 border-white shadow-md cursor-pointer hover:scale-[1.02] transition" onClick={() => setFullscreenImage(selectedEntry.paymentScreenshotUrl)} />
                                                                </div>
                                                            )}
                                                            {selectedEntry.teamPhotos && selectedEntry.teamPhotos.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Team / Finalist Photos ({selectedEntry.teamPhotos.length})</p>
                                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                                        {selectedEntry.teamPhotos.map((p, i) => (
                                                                            <img key={i} src={p.url} alt={`Team photo ${i+1}`} className="w-full h-28 object-cover rounded-xl border-2 border-white shadow cursor-pointer hover:opacity-90" onClick={() => setFullscreenImage(p.url)} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </section>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Fullscreen Image Lightbox */}
            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFullscreenImage(null)}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.button
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/20"
                            onClick={() => setFullscreenImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={fullscreenImage}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            alt="Fullscreen Preview"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                .bg-submission-pattern {
                    background-image: radial-gradient(#F1F5F9 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
}

function CalendarIcon() {
    return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
    )
}
