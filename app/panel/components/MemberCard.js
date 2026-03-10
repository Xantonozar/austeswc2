"use client";

import React from 'react';
import Avatar from './Avatar';
import DeptBadge from './DeptBadge';
import { canViewScore } from '../data/permissions';
import { useDashboard } from './PanelDashboardProvider';

export default function MemberCard({ member }) {
    const { currentUser } = useDashboard();

    // Permission Check
    const showsScore = canViewScore(currentUser, member);

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(46,89,64,0.08)] border border-[#EBF4E6] p-5 flex flex-col items-center hover:shadow-[0_8px_24px_rgba(46,89,64,0.12)] transition-shadow duration-300 group relative overflow-hidden">

            {/* Decorative top border color line based on score */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6BA583] to-[#4A7C59] opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <Avatar name={member.name} rankLevel={member.rankLevel} imageUrl={member.imageUrl} className="w-16 h-16 text-xl mb-3 shadow-md" />

            <h3 className="font-yeseva text-lg text-[#1A2B1E] truncate w-full text-center tracking-wide">
                {member.name}
            </h3>

            <div className="text-sm font-medium text-[#7A9080] mb-2">{member.designation}</div>
            <DeptBadge department={member.department} />

            <div className="mt-4 pt-3 w-full border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Score</span>
                <span className={`font-bold ${showsScore ? 'text-[#2E5940]' : 'text-gray-300'}`}>
                    {showsScore ? member.score : '——'}
                </span>
            </div>
        </div>
    );
}
