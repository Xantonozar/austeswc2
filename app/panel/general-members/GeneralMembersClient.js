"use client";

import { useState } from 'react';
import { Search, Filter, ShieldCheck, Mail, Phone, CalendarDays, ExternalLink } from 'lucide-react';

export default function GeneralMembersClient({ members = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');

    const departments = [...new Set(members.map(m => m.department))].sort();

    const filteredMembers = members.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = filterDept === 'All' || m.department === filterDept;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">

            <header className="border-b border-[#D6E4D8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-yeseva text-[#1A2B1E] flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-[#4A7C59]" /> General Members
                    </h1>
                    <p className="text-[#7A9080] font-medium tracking-wide mt-2">
                        Directory of all registered club members ({members.length} total)
                    </p>
                </div>
            </header>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or Student ID..."
                        className="w-full bg-white border border-[#D6E4D8] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] shadow-[0_2px_12px_rgba(46,89,64,0.04)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative shrink-0">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A9080] w-5 h-5 pointer-events-none" />
                    <select
                        className="bg-white border border-[#D6E4D8] rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] text-[#1A2B1E] font-medium shadow-[0_2px_12px_rgba(46,89,64,0.04)] appearance-none"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBF4E6] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-[#D6E4D8]">
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Member</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Student ID</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Department</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Year/Sem</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest">Contact Info</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest text-center">Payment</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-[#7A9080] uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMembers.map(member => (
                                <tr key={member._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-sm">
                                                {member.imageUrl ? (
                                                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#EBF4E6] text-[#2E5940] flex items-center justify-center font-bold text-sm uppercase">
                                                        {member.name.substring(0, 2)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-[#1A2B1E] group-hover:text-[#4A7C59] transition-colors">
                                                {member.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap font-medium text-[#4A7C59] tabular-nums">
                                        {member.studentId}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <span className="px-2.5 py-1 rounded-md bg-[#EBF4E6] text-[#2E5940] text-xs font-bold border border-[#D6E4D8]/50 shadow-sm">
                                            {member.department}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-[#1A2B1E] font-medium">
                                        {member.yearSemester}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex flex-col text-[11px] leading-tight">
                                            <span className="text-[#1A2B1E] font-medium flex items-center gap-1">
                                                <Mail className="w-3 h-3 text-[#7A9080]" /> {member.email}
                                            </span>
                                            <span className="text-[#7A9080] mt-1 flex items-center gap-1">
                                                <Phone className="w-3 h-3 text-[#7A9080]" /> {member.phone}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.paymentMethod === 'Online'
                                                ? 'bg-[#EBF4E6] text-[#2E7D32] border border-[#C8E6C9]'
                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                            {member.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-right">
                                        <button className="p-2 hover:bg-[#EBF4E6] rounded-xl text-[#7A9080] hover:text-[#4A7C59] transition-all active:scale-90" title="View Details">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredMembers.length === 0 && (
                <div className="py-20 text-center text-[#7A9080]">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No members found matching your search.</p>
                </div>
            )}

        </div>
    );
}
