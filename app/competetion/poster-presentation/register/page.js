"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Users, ArrowLeft, Loader2, Plus, Trash2, FileText, Upload, CheckCircle2, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { uploadFileToCloudinary } from '@/lib/cloudinaryUpload';

export default function PosterPresentationRegister() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const departments = ['CSE', 'EEE', 'CE', 'ME', 'IPE', 'TE', 'Architecture', 'BBA', 'Other'];
    const tracks = ['Save Environment', 'Save People', 'Save Society', 'Other'];
    const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
    const semesterOptions = ['1st Semester', '2nd Semester'];

    const [form, setForm] = useState({
        teamName: '',
        trackCategory: '',
        posterTitle: '',
        caReference: '',
        pdfUrl: '',
        pdfPublicId: '',
        pdfFileName: '',
        uploadingPdf: false,
        confirmAi: false,
        confirmRules: false
    });

    const [members, setMembers] = useState([{ name: '', studentId: '', department: '', semester: '', email: '', phone: '', photo: null, uploadingPhoto: false }]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const handleMemberPhoto = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed for member photo');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            toast.error('Photo size must be less than 3MB');
            return;
        }
        const newMembers = [...members];
        newMembers[index].uploadingPhoto = true;
        setMembers(newMembers);
        try {
            const result = await uploadFileToCloudinary(file, { folder: 'eswc_competition_members', resourceType: 'auto' });
            const updated = [...members];
            updated[index].photo = { url: result.url, publicId: result.publicId };
            updated[index].uploadingPhoto = false;
            setMembers(updated);
            toast.success('Photo attached');
        } catch (err) {
            const reverted = [...members];
            reverted[index].uploadingPhoto = false;
            setMembers(reverted);
            toast.error(err.message || 'Failed to upload photo');
        }
    };

    const addMember = () => {
        if (members.length < 3) {
            setMembers([...members, { name: '', studentId: '', department: '', semester: '', email: '', phone: '', photo: null, uploadingPhoto: false }]);
        }
    };

    const getSemesterParts = (val) => {
        if (!val) return { year: '', sem: '' };
        if (val.includes('-')) { const [y, s] = val.split('-'); return { year: y.trim(), sem: s.trim() }; }
        if (val.includes('•')) { const [y, s] = val.split('•'); return { year: y.trim(), sem: s.trim() }; }
        if (yearOptions.includes(val)) return { year: val, sem: '' };
        if (semesterOptions.includes(val)) return { year: '', sem: val };
        return { year: '', sem: '' };
    };

    const handleSemesterPartChange = (index, part, value) => {
        const cur = getSemesterParts(members[index].semester);
        const nextYear = part === 'year' ? value : cur.year;
        const nextSem = part === 'sem' ? value : cur.sem;
        let nextVal = '';
        if (nextYear && nextSem) nextVal = `${nextYear}-${nextSem}`;
        else if (nextYear) nextVal = nextYear;
        else if (nextSem) nextVal = nextSem;
        handleMemberChange(index, 'semester', nextVal);
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const newMembers = [...members];
            newMembers.splice(index, 1);
            setMembers(newMembers);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed for abstract');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }
        const expectedSuffix = '_EcoChampions4.0_Abstract.pdf';
        if (!file.name.endsWith(expectedSuffix) && !file.name.toLowerCase().endsWith('.pdf')) {
            toast('Recommended naming: TeamName_EcoChampions4.0_Abstract.pdf', { icon: 'ℹ️' });
        }
        setForm(prev => ({ ...prev, uploadingPdf: true }));
        try {
            const result = await uploadFileToCloudinary(file, { folder: 'eswc_competition', resourceType: 'raw' });
            setForm(prev => ({ ...prev, pdfUrl: result.url, pdfPublicId: result.publicId, pdfFileName: file.name, uploadingPdf: false }));
            toast.success('Abstract attached successfully');
        } catch (err) {
            setForm(prev => ({ ...prev, uploadingPdf: false }));
            toast.error(err.message || 'Failed to upload abstract PDF');
        }
    };

    const validate = () => {
        if (!form.teamName.trim()) { toast.error('Team Name is required'); return false; }
        if (!form.trackCategory) { toast.error('Please select Track/Category'); return false; }
        if (!form.posterTitle.trim()) { toast.error('Poster Topic Title is required'); return false; }
        const leader = members[0];
        const leaderParts = getSemesterParts(leader.semester);
        if (!leader.name.trim() || !leader.studentId.trim() || !leader.department.trim() || !leaderParts.year || !leaderParts.sem || !leader.email.trim() || !leader.phone.trim()) {
            toast.error('Please complete all Team Leader details (Year & Semester required)');
            return false;
        }
        for (let i = 0; i < members.length; i++) {
            if (!members[i].photo || !members[i].photo.url) {
                toast.error(`Please upload a photo for Member ${i + 1}`);
                return false;
            }
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leader.email.trim())) { toast.error('Leader email is invalid'); return false; }
        for (let i = 1; i < members.length; i++) {
            const m = members[i];
            if (!m.name.trim() || !m.studentId.trim() || !m.department.trim() || !m.phone.trim()) {
                toast.error(`Please complete Member ${i + 1}: Name, Student ID, Department, Contact Number required`);
                return false;
            }
            if (m.email && m.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) { toast.error(`Member ${i + 1} email is invalid`); return false; }
        }
        if (!form.pdfUrl) { toast.error('Please upload Abstract PDF (max 10MB, 300 words)'); return false; }
        if (!form.confirmAi) { toast.error('Please confirm AI content declaration'); return false; }
        if (!form.confirmRules) { toast.error('Please agree to AUSTESWC official rules'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (form.uploadingPdf || members.some(m => m.uploadingPhoto)) {
            toast.error('Files are still uploading, please wait...');
            return;
        }
        if (!validate()) return;
        setLoading(true);
        const toastId = toast.loading('Submitting registration...');
        try {
            const payload = {
                type: 'poster-presentation',
                teamName: form.teamName.trim(),
                trackCategory: form.trackCategory,
                posterTitle: form.posterTitle.trim(),
                caReference: form.caReference.trim(),
                email: members[0].email.trim().toLowerCase(),
                phone: members[0].phone.trim(),
                pdfUrl: form.pdfUrl,
                pdfPublicId: form.pdfPublicId,
                confirmAi: form.confirmAi,
                confirmRules: form.confirmRules,
                members: members.map((m, idx) => ({
                    name: m.name.trim(),
                    studentId: m.studentId.trim(),
                    department: m.department.trim(),
                    semester: m.semester.trim() || (idx === 0 ? m.semester.trim() : ''),
                    email: m.email.trim().toLowerCase(),
                    phone: m.phone.trim(),
                    photo: m.photo ? { url: m.photo.url, publicId: m.photo.publicId } : undefined
                }))
            };
            if (JSON.stringify(payload).length > 4000000) {
                toast.error('Submission is too large — files were not uploaded to Cloudinary. Please re-select the PDF and photos, then submit again.', { id: toastId });
                setLoading(false);
                return;
            }
            const res = await fetch('/api/competition/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            let data;
            try {
                data = await res.json();
            } catch {
                const text = await res.text().catch(() => '');
                if (res.status === 413 || /request entity too large/i.test(text)) {
                    throw new Error('Submission rejected as too large. Your files may not have uploaded — please re-select the PDF and photos, then submit again.');
                }
                throw new Error('Unexpected server response. Please try again.');
            }
            if (!res.ok) throw new Error(data.message || data.error || 'Submission failed');
            toast.success('Registration Submitted Successfully!', { id: toastId });
            setTimeout(() => router.push('/congratulations/poster-presentation'), 1500);
        } catch (err) {
            toast.error(err.message || 'Something went wrong', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans">
            <Toaster position="top-center" />
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/competetion/poster-presentation" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-[#1B4B43]" />
                    </Link>
                    <h1 className="text-lg font-bold text-[#1B4B43]">Poster Registration</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="bg-[#1B4B43] text-[#E8F9FF] pt-8 pb-16 px-4 -mt-[1px] relative overflow-hidden">
                <div className="w-64 h-64 absolute -top-20 -left-20 bg-[#E8F9FF]/10 rounded-full blur-3xl"></div>
                <div className="w-64 h-64 absolute -bottom-20 -right-20 border-[8px] border-[#E8F9FF]/10 rounded-full"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[#B7E9FF]" />
                    <h2 className="text-3xl font-bold mb-2">Round 1 — Poster Registration</h2>
                    <p className="text-[#B7E9FF] text-sm opacity-90">AUST students only • Free • Abstract: A4 PDF, max 300 words, header with Team/Title/Members</p>
                </div>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-gray-100">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-[#E8F9FF] rounded-lg"><Users className="w-5 h-5 text-[#1B4B43]" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Basic Team Details</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Name <span className="text-red-500">*</span></label>
                            <input name="teamName" value={form.teamName} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Eco Innovators" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Track / Category <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select name="trackCategory" value={form.trackCategory} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all appearance-none pr-10">
                                    <option value="">Select Track</option>
                                    {tracks.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Poster Topic Title <span className="text-red-500">*</span></label>
                            <input name="posterTitle" value={form.posterTitle} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="e.g. Plastic to Power: Recycling Innovations" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" /> Reference <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                            </label>
                            <input name="caReference" value={form.caReference} onChange={handleFormChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B4B43] outline-none transition-all" placeholder="Name of person who referred you" />
                        </div>
                    </div>

                    {members.length < 3 && (
                        <button type="button" onClick={addMember} className="w-full py-4 border-2 border-dashed border-[#1B4B43]/20 rounded-2xl flex items-center justify-center gap-2 text-[#1B4B43] font-bold hover:border-[#1B4B43] hover:bg-[#E8F9FF]/20 transition-all active:scale-[0.98]">
                            <Plus className="w-5 h-5" /> Add Team Member
                        </button>
                    )}

                    <hr className="border-gray-100" />

                    <div className="space-y-4">
                        <h3 className="font-bold text-[#1B4B43] text-lg">Team Members</h3>
                        {members.map((member, idx) => (
                            <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 relative hover:border-[#B7E9FF] transition-colors shadow-sm">
                                {members.length > 1 && (
                                    <button type="button" onClick={() => removeMember(idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <h4 className="text-xs font-bold text-[#1B4B43]/60 uppercase tracking-wider mb-3">Member {idx + 1} {idx === 0 ? '(Leader — mandatory)' : '(Optional)'}</h4>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="relative">
                                        {member.uploadingPhoto ? (
                                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-[#1B4B43] animate-spin" />
                                            </div>
                                        ) : member.photo?.url ? (
                                            <img src={member.photo.url} alt="member" className="w-16 h-16 rounded-full object-cover border-2 border-[#1B4B43]/20" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <label className="absolute -bottom-1 -right-1 bg-[#1B4B43] text-white rounded-full p-1.5 cursor-pointer hover:bg-[#12332D] transition-colors">
                                            <Upload className="w-3 h-3" />
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMemberPhoto(idx, e)} />
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-700">Member Photo <span className="text-red-500">*</span></p>
                                        <p className="text-xs text-gray-400">Image only • Max 3MB</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <input value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm" placeholder={`Full Name ${idx === 0 ? '*' : ''}`} />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input value={member.studentId} onChange={(e) => handleMemberChange(idx, 'studentId', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm" placeholder={`Student ID ${idx === 0 ? '*' : '*'}`} />
                                        <div className="relative">
                                            <select value={member.department} onChange={(e) => handleMemberChange(idx, 'department', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm appearance-none pr-10">
                                                <option value="">Department *</option>
                                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <select value={getSemesterParts(member.semester).year} onChange={(e) => handleSemesterPartChange(idx, 'year', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm appearance-none pr-8">
                                                <option value="">{idx === 0 ? 'Year *' : 'Year'}</option>
                                                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <select value={getSemesterParts(member.semester).sem} onChange={(e) => handleSemesterPartChange(idx, 'sem', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm appearance-none pr-8">
                                                <option value="">{idx === 0 ? 'Semester *' : 'Semester'}</option>
                                                {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="email" value={member.email} onChange={(e) => handleMemberChange(idx, 'email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm" placeholder={idx === 0 ? 'Active Email *' : 'Email (optional)'} />
                                        <input value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#1B4B43] outline-none text-sm shadow-sm" placeholder="Contact Number *" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-gray-500 ml-1">Team size 1–3. Leader requires Student ID, Dept+Semester, Email, Phone. Members require Name, ID, Dept, Phone.</p>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><FileText className="w-5 h-5 text-gray-600" /></div>
                            <h3 className="font-bold text-[#1B4B43] text-lg">Abstract PDF Upload</h3>
                        </div>
                        <div onClick={() => fileInputRef.current?.click()} className={`w-full py-8 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${form.pdfUrl ? 'border-[#1B4B43] bg-[#E8F9FF]' : 'border-gray-300 hover:border-[#1B4B43] bg-white'}`}>
                            {form.uploadingPdf ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
                                        <Loader2 className="w-5 h-5 text-[#1B4B43] animate-spin" />
                                    </div>
                                    <p className="font-medium text-gray-700">Uploading abstract PDF...</p>
                                    <p className="text-xs text-gray-400 mt-1">Please wait, do not close this page</p>
                                </>
                            ) : form.pdfUrl ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#1B4B43] flex items-center justify-center mb-3 text-white shadow-md">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <p className="font-bold text-[#1B4B43] text-sm break-all">{form.pdfFileName}</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Ready for submission</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="font-medium text-gray-700">Tap to upload abstract PDF</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF only • Max 10MB • Max 300 words</p>
                                </>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} />
                        <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border">A4 PDF • Header: Team Name, Topic Title, all member names • Naming: <span className="font-mono font-bold">TeamName_EcoChampions4.0_Abstract.pdf</span></p>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="pt-2 space-y-3">
                        <div className="bg-[#E8F9FF] rounded-2xl p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-[#1B4B43] shrink-0" />
                            <p className="text-sm font-semibold text-[#1B4B43]">Free Registration — no payment required for Round 1</p>
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <input type="checkbox" name="confirmAi" checked={form.confirmAi} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">I confirm the submission is original, &lt;30% AI-generated content. <span className="text-red-500">*</span></span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <input type="checkbox" name="confirmRules" checked={form.confirmRules} onChange={handleFormChange} className="mt-1 w-4 h-4 rounded text-[#1B4B43] focus:ring-[#1B4B43] border-gray-300" />
                            <span className="text-sm text-gray-600 font-medium">I agree to abide by AUSTESWC&apos;s official rules. <span className="text-red-500">*</span></span>
                        </label>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                            <p className="font-bold">Round 2 (for qualifying teams):</p>
                            <p>BDT 499 per team • bKash/Nagad TrxID + screenshot • Team/individual photos for Facebook feature</p>
                        </div>
                        <button type="submit" disabled={loading || form.uploadingPdf || members.some(m => m.uploadingPhoto)} className="w-full bg-[#1B4B43] hover:bg-[#12332D] text-[#B7E9FF] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (form.uploadingPdf || members.some(m => m.uploadingPhoto) ? 'Uploading files...' : 'Submit Registration')}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
