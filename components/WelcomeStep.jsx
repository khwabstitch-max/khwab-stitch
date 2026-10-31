import React from "react";
import { ArrowRight, Sparkles, Scissors, Camera } from "lucide-react";
import { BRAND_CONFIG } from "../config/fashionCatalog.js";

export default function WelcomeStep({ onStart }) {
  return (
    <section className="welcome-layout max-w-[620px] mx-auto text-center py-5 sm:py-8">
      {/* ATELIER LOGO EMBLEM */}
      <div className="mb-4 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#c4994d] via-[#d69680] to-[#6b2636] opacity-60 blur-md transition-all duration-300" />
          <div className="relative h-22 w-22 sm:h-28 sm:w-28 overflow-hidden rounded-full border-4 border-[#fff7f0] bg-[#fffaf5] shadow-xl">
            <img
              src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
              alt="Khwab Stitch Logo"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "./images/khwabstitch_logo.jpg";
              }}
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

      {/* HEADINGS */}
      <div className="welcome-copy pt-1 pb-2">
        <h1 className="welcome-title text-[30px] sm:text-[38px] font-serif font-bold text-[var(--primary-dark)] leading-tight">
          Welcome to <em className="italic text-[var(--secondary)]">Khwab Stitch</em>
          <span className="block text-[17px] sm:text-[20px] font-normal text-stone-700 mt-1">
            ख़्वाब स्टिच में आपका स्वागत है!
          </span>
        </h1>

        {/* 3 HIGHLIGHT CARDS REQUESTED BY USER */}
        <div className="mt-6 mb-6 space-y-3 max-w-[540px] mx-auto text-left">
          {/* POINT 1 */}
          <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#fffcf9] border border-[#ebdcd0] shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbeae5] text-[var(--primary)] shadow-2xs">
              <Scissors size={20} />
            </div>
            <div>
              <p className="text-[13.5px] sm:text-[14px] font-bold text-stone-900 leading-snug">
                Share your details and preferences for a custom-stitched blouse, kurti, or suit
              </p>
              <p className="text-[12.5px] sm:text-[13px] text-stone-600 mt-0.5 leading-snug">
                अपने पसंदीदा ब्लाउज़, कुर्ती या सूट की कस्टम सिलाई के लिए अपनी पसंद साझा करें।
              </p>
            </div>
          </div>

          {/* POINT 2 */}
          <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#fffcf9] border border-[#ebdcd0] shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf0e0] text-[var(--secondary)] shadow-2xs">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-[13.5px] sm:text-[14px] font-bold text-stone-900 leading-snug">
                Provide accurate details and keep your design or reference photo ready
              </p>
              <p className="text-[12.5px] sm:text-[13px] text-stone-600 mt-0.5 leading-snug">
                सही जानकारी भरें और अपना चुना हुआ डिज़ाइन या रेफ़रेंस फ़ोटो तैयार रखें।
              </p>
            </div>
          </div>

          {/* POINT 3 */}
          <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#fffcf9] border border-[#ebdcd0] shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8eef2] text-[#8e2e4b] shadow-2xs">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[13.5px] sm:text-[14px] font-bold text-stone-900 leading-snug">
                Our master tailors handcraft each piece with care
              </p>
              <p className="text-[12.5px] sm:text-[13px] text-stone-600 mt-0.5 leading-snug">
                हमारे मास्टर दर्जी प्यार और हुनर से आपका परिधान तैयार करेंगे।
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY CTA BUTTON */}
        <div className="welcome-actions mt-6">
          <button
            type="button"
            className="welcome-primary h-13 px-8 text-[14px] shadow-lg hover:shadow-xl transition-all cursor-pointer"
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
