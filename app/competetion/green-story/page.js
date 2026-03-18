import React from 'react';
import { FileText, Camera, Calendar, Award, ExternalLink } from 'lucide-react';

const EcoCaptureDetails = () => {
  // Updated Rulebook Link
  const rulebookUrl = "https://drive.google.com/file/d/1s0nv4CJTC55Pgw5t1F0LSb05u6ONdZzK/view?usp=sharing";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-50 border border-slate-200 shadow-xl rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-green-800 tracking-tight flex items-center gap-3">
            <Camera className="text-green-600" size={36} /> Eco Capture
          </h1>
          <p className="text-slate-500 mt-2 font-medium">National Photography Contest & Exhibition</p>
        </div>
        <div className="text-right">
          <span className="px-4 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full uppercase tracking-wider">
            Phase 1 Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <FileText size={20} className="text-blue-500" /> Contest Rules
          </h2>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex gap-2"><span>•</span> Submit exactly 5 photos centered on environmental action.</li>
            <li className="flex gap-2"><span>•</span> Each entry must include a short narrative or story.</li>
            <li className="flex gap-2"><span>•</span> High-resolution JPG/PNG formats only.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Award size={20} className="text-yellow-500" /> Registration & Fees
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Round 1 (Submission)</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-slate-600 border-t pt-2">
              <span>Round 2 (Selection)</span>
              <span className="font-bold text-slate-800">300 BDT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-red-500" /> Important Dates
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-400 text-xs uppercase font-bold">Registration Deadline</p>
            <p className="text-slate-900 font-semibold text-lg">April 15, 2026</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-400 text-xs uppercase font-bold">Final Exhibition</p>
            <p className="text-slate-900 font-semibold text-lg">May 05, 2026</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <a 
          href={rulebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-200/50"
        >
          <FileText size={20} /> Download Official Rulebook
        </a>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
          Register Now <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export default EcoCaptureDetails;
