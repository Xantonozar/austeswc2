import React from 'react';
import { ROLE_HIERARCHY } from '../data/panelData';

const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const getHue = (rankLevel) => {
    // Map rank level (1-13) to a hue color family in the green/earth spectrum
    if (rankLevel >= ROLE_HIERARCHY.President) return 'bg-[#2E5940] text-white'; // Forest for top core
    if (rankLevel >= ROLE_HIERARCHY.JS) return 'bg-[#4A7C59] text-white'; // Sage for mid core
    if (rankLevel >= ROLE_HIERARCHY.HOD) return 'bg-[#6BA583] text-[#1A2B1E]'; // Light sage for HODs
    if (rankLevel >= ROLE_HIERARCHY.Executive) return 'bg-[#C8DDD0] text-[#2E5940]'; // Mist for Execs
    if (rankLevel === ROLE_HIERARCHY.BatchAmbassador) return 'bg-[#7D5A3C] text-white'; // Earth for BA
    return 'bg-[#EDE8E0] text-[#4A7C59]'; // Cream fallback
};

export default function Avatar({ name, rankLevel, imageUrl, className = "w-10 h-10 text-sm" }) {
    const colorClass = getHue(rankLevel);
    const initials = getInitials(name);

    return (
        <div className={`shrink-0 flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-white overflow-hidden ${colorClass} ${className}`}>
            {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
                initials
            )}
        </div>
    );
}
