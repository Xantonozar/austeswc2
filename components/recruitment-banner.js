"use client";

import Link from "next/link";

export default function RecruitmentBanner() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #064e26 0%, #0a6b35 50%, #0d5c2e 100%)",
      }}
    >
      {/* Glow blobs */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}
      />

      {/* Watermark */}
      <div className="absolute bottom-0 right-10 text-[160px] opacity-[0.04] select-none pointer-events-none leading-none">
        🌿
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-14 lg:py-16 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">

        {/* Left: text */}
        <div className="flex-1 text-center sm:text-left">
          {/* Live pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            <span className="text-emerald-200 text-[11px] font-semibold uppercase tracking-widest">
              Recruitment Open
            </span>
          </div>

          <h2 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            Join the ESWC Family 🌱
          </h2>
          <p className="text-emerald-100/70 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Be part of a passionate community driving environmental change at AUST.
            Open to all departments · Fee:{" "}
            <span className="text-emerald-300 font-semibold">100 TK only</span>
          </p>

          {/* Desktop perks row */}
          <div className="hidden lg:flex items-center gap-8 mt-6">
            {["🌍 Community Impact", "🏆 Competitions", "🎓 Skill Growth", "📸 Exclusive Events"].map((perk) => (
              <span key={perk} className="text-emerald-200/80 text-sm font-medium">
                {perk}
              </span>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <Link
            href="/join"
            className="inline-flex items-center gap-3 px-10 py-4 lg:px-12 lg:py-5 rounded-2xl font-black text-emerald-900 text-base lg:text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
              boxShadow: "0 8px 32px rgba(52,211,153,0.4)",
            }}
          >
            Apply for Membership
            <span className="text-xl">→</span>
          </Link>
          <span className="text-emerald-300/50 text-xs">Takes less than 2 minutes</span>
        </div>
      </div>
    </section>
  );
}
