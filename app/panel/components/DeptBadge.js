import React from 'react';
import { DEPARTMENTS } from '../data/panelData';

export default function DeptBadge({ department }) {
    if (!department) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1E3A28]/10 text-[#2E5940] border border-[#2E5940]/20">
                Global Scope
            </span>
        );
    }

    const deptObj = DEPARTMENTS.find(d => d.id === department);
    const colorClass = deptObj ? deptObj.color : 'bg-gray-100 text-gray-800';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border border-black/5 ${colorClass}`}>
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
            {department}
        </span>
    );
}
