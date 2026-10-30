import React from "react";
import { ArrowRight, Sparkles, Scissors, ShieldCheck } from "lucide-react";

export default function WelcomeStep({ onStart }) {
  return (
    <section className="welcome-layout max-w-[620px] mx-auto text-center py-6 sm:py-10">
      {/* ATELIER LOGO EMBLEM */}
      <div className="mb-4 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#c4994d] via-[#d69680] to-[#6b2636] opacity-60 blur-md transition-all duration-300" />
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-[#fff7f0] bg-[#fffaf5] shadow-xl">
            <img
              src="./images/khwabstitch_logo.jpg"
              alt="Khwab Stitch Logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="h-px w-6 sm:w-10 bg-[#dfc7b8]" />
          <span className="text-[10px] sm:text-[11.5px] font-bold tracking-[0.22em] uppercase text-[var(--secondary)]">
            Where Fabric Becomes Art
          </span>
          <span className="h-px w-6 sm:w-10 bg-[#dfc7b8]" />
        </div>
      </div>

      {/* CONCISE HEADINGS & TAGLINE */}
      <div className="welcome-copy pt-1 pb-2">
        <h1 className="welcome-title text-[32px] sm:text-[42px] font-serif font-bold text-[var(--primary-dark)] leading-tight">
          Welcome to <em className="italic text-[var(--secondary)]">Khwab Stitch</em>
          <span className="block text-[18px] sm:text-[22px] font-normal text-stone-700 mt-1">
            ख़्वाब स्टिच में आपका स्वागत है!
          </span>
        </h1>

        <p className="mt-3 text-[13.5px] sm:text-[15px] text-stone-600 max-w-[480px] mx-auto leading-relaxed">
          Custom-tailored Blouses, Kurtis & Suits handcrafted for the perfect fit /
          आपकी पसंद और सटीक नाप के अनुसार ख़ूबसूरत बुटीक सिलाई।
        </p>

        {/* 3 QUICK FEATURE PILLS */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold text-stone-700">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf5f0] border border-[#ebdcd0]">
            <Scissors size={12} className="text-[var(--primary)]" />
            <span>Custom Styling / मनपसंद डिज़ाइन</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf5f0] border border-[#ebdcd0]">
            <Sparkles size={12} className="text-[var(--primary)]" />
            <span>Perfect Fit / सटीक नाप</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf5f0] border border-[#ebdcd0]">
            <ShieldCheck size={12} className="text-[var(--primary)]" />
            <span>Doorstep Delivery / होम डिलीवरी</span>
          </span>
        </div>

        {/* PRIMARY CTA BUTTON */}
        <div className="welcome-actions mt-7">
          <button
            type="button"
            className="welcome-primary h-13 px-8 text-[14px] shadow-lg hover:shadow-xl transition-all"
            onClick={onStart}
          >
            <span>Start Your Order / ऑर्डर शुरू करें</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
