'use client';

import { motion } from 'framer-motion';
import { Calendar, LayoutGrid } from 'lucide-react';

export default function SemesterTabs({ semesters, activeTab, onTabChange, counts = {} }) {
    const getTabStyle = (sem) => {
        if (activeTab !== sem) return '';
        if (sem === 'all') return 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20';
        if (sem.includes('Fall')) return 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20';
        if (sem.includes('Spring')) return 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20';
        return 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20';
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <button
                onClick={() => onTabChange('all')}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-2 ${
                    activeTab === 'all'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:shadow-md'
                }`}
            >
                <LayoutGrid className="w-4 h-4" />
                All Time
                {counts['all'] !== undefined && (
                    <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {counts['all']}
                    </span>
                )}
            </button>

            {semesters.map((sem, index) => (
                <motion.button
                    key={sem}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onTabChange(sem)}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-2 ${
                        activeTab === sem
                            ? getTabStyle(sem)
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:shadow-md'
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    {sem}
                    {counts[sem] !== undefined && (
                        <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${
                            activeTab === sem ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {counts[sem]}
                        </span>
                    )}
                    {activeTab === sem && (
                        <motion.div
                            layoutId="activeSemesterTab"
                            className="absolute inset-0 rounded-xl border-2 border-current"
                            style={{ zIndex: -1 }}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
}

// Utility: derive semester string from a Date
export function getSemesterFromDate(date) {
    const d = new Date(date);
    const month = d.getMonth(); // 0-indexed
    const year = d.getFullYear();

    // Academic year spans Jun 2025 - May 2026 = "2025" (Fall 2025 + Spring 2025)
    // June (5) - November (10) → Fall of that year
    // December (11) → Spring of that year
    // January (0) - May (4) → Spring of previous year
    if (month >= 5 && month <= 10) {
        return `Fall ${year - 1}`;
    } else if (month >= 11) {
        return `Spring ${year}`;
    } else {
        return `Spring ${year - 1}`;
    }
}

// Chronological sort helper
const getSortKey = (sem) => {
    const parts = sem.split(' ');
    const type = parts[0] === 'Fall' ? 1 : 0;
    const year = parseInt(parts[1]);
    return year * 10 + type;
};

// Utility: get all unique semesters from a list of items with createdAt
// Always includes current and next semester even if no data exists
export function getSemestersFromItems(items) {
    const semesterSet = new Set();

    // Always include current semester
    const now = new Date();
    semesterSet.add(getSemesterFromDate(now));

    // Always include previous semester
    const past = new Date(now);
    past.setMonth(past.getMonth() - 6);
    semesterSet.add(getSemesterFromDate(past));

    items.forEach(item => {
        if (item.createdAt) {
            semesterSet.add(getSemesterFromDate(item.createdAt));
        }
    });

    return [...semesterSet].sort((a, b) => getSortKey(b) - getSortKey(a));
}
