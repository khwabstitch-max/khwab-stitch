import React from "react";
import { ArrowRight, Sparkles, Scissors, Camera, CheckCircle2 } from "lucide-react";
import { BRAND_CONFIG, FABRICS } from "../config/fashionCatalog.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function WelcomeStep({ onStart }) {
  const { lang, t } = useLanguage();

  const fabricTags = [
    { name: "Pure Cotton", hi: "शुद्ध कॉटन", icon: "🧵", color: "bg-amber-50 text-amber-900 border-amber-200" },
    { name: "Raw Silk", hi: "रॉ सिल्क", icon: "✨", color: "bg-yellow-50 text-yellow-900 border-yellow-200" },
    { name: "Georgette", hi: "जॉर्जेट", icon: "🌸", color: "bg-rose-50 text-rose-900 border-rose-200" },
    { name: "Chanderi", hi: "चंदेरी", icon: "🪡", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    { name: "Linen Blend", hi: "लिनन", icon: "🍃", color: "bg-teal-50 text-teal-900 border-teal-200" },
    { name: "Velvet & Brocade", hi: "मखमली", icon: "👑", color: "bg-purple-50 text-purple-900 border-purple-200" },
  ];

  return (
    <section className="welcome-layout max-w-[660px] mx-auto text-center py-5 sm:py-8">
      {/* ATELIER LOGO EMBLEM */}
      <div className="mb-4 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#c4994d] via-[#e5a84b] to-[#781d33] opacity-50 blur-lg transition-all duration-300" />
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-4 border-[#fff7f0] bg-[#fffaf5] shadow-xl">
            <img
              src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
              alt="Khwab Stitch Logo"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "./images/khwabstitch_logo.jpg";
              }}
            />
          </div>
          <span className="absolute bottom-0 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs shadow-md border-2 border-white">
            ✂️
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#c4994d]" />
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.24em] uppercase text-[var(--secondary)]">
            {t("Bespoke Atelier · Where Fabric Becomes Art", "हमारी कारीगरी · ख़्वाब स्टिच")}
          </span>
          <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#c4994d]" />
        </div>
      </div>

      {/* HEADINGS */}
      <div className="welcome-copy pt-1 pb-2">
        <h1 className="welcome-title text-[32px] sm:text-[40px] font-serif font-bold text-[var(--primary-dark)] leading-tight">
          {lang === "hi" ? (
            <>
              ख़्वाब स्टिच में आपका स्वागत है!
              <span className="block text-[17px] sm:text-[20px] font-normal text-stone-700 mt-1 font-sans">
                कस्टम सिलाई · आपकी पसंद का कपड़ा · हमारी कारीगरी
              </span>
            </>
          ) : (
            <>
              Welcome to <em className="italic text-[var(--secondary)]">Khwab Stitch</em>
              <span className="block text-[17px] sm:text-[20px] font-normal text-stone-700 mt-1 font-sans">
                Bespoke Tailoring · Handcrafted for Your Perfect Fit
              </span>
            </>
          )}
        </h1>

        {/* FABRIC SWATCHES SHOWCASE PILLS (CLOTH-RELATED VISUAL DELIGHT) */}
        <div className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-2 max-w-[560px] mx-auto">
          {fabricTags.map((fab) => (
            <span
              key={fab.name}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${fab.color}`}
            >
              <span>{fab.icon}</span>
              <span>{lang === "hi" ? fab.hi : fab.name}</span>
            </span>
          ))}
        </div>

        {/* 3 HIGHLIGHT CARDS WITH TAILOR SEAM ACCENTS */}
        <div className="mt-2 mb-6 space-y-3.5 max-w-[560px] mx-auto text-left">
          {/* POINT 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fffdfb] border-2 border-dashed border-[#dfcdbe] shadow-2xs hover:shadow-xs hover:border-[var(--primary)] transition-all">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fbeae5] text-[var(--primary)] shadow-2xs">
              <Scissors size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)] block">
                {t("1. Outfit & Cloth Choice", "1. परिधान व कपड़ा")}
              </span>
              <p className="text-[13.5px] font-bold text-stone-900 leading-snug mt-0.5">
                {t(
                  "Choose your outfit (Blouse, Kurti, Suit) and tailor with your own fabric or studio materials.",
                  "अपना परिधान चुनें और अपने खरीदे हुए कपड़े या बुटीक फ़ैब्रिक के अनुसार सिलाई कराएं।"
                )}
              </p>
            </div>
          </div>

          {/* POINT 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fffdfb] border-2 border-dashed border-[#dfcdbe] shadow-2xs hover:shadow-xs hover:border-[var(--secondary)] transition-all">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fbf0e0] text-[var(--secondary)] shadow-2xs">
              <Camera size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--secondary)] block">
                {t("2. Design & Reference Photo", "2. स्टाइलिंग व फ़ोटो रेफ़रेंस")}
              </span>
              <p className="text-[13.5px] font-bold text-stone-900 leading-snug mt-0.5">
                {t(
                  "Pick ready neckline & sleeve styles, catalog design codes, or upload photos from Pinterest / Instagram.",
                  "कैटलॉग में से गले व बाज़ू का डिज़ाइन चुनें या इंस्टाग्राम/फ़ोन से अपनी पसंद की फ़ोटो अपलोड करें।"
                )}
              </p>
            </div>
          </div>

          {/* POINT 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#fffdfb] border-2 border-dashed border-[#dfcdbe] shadow-2xs hover:shadow-xs hover:border-emerald-600 transition-all">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7f1] text-emerald-800 shadow-2xs">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                {t("3. Master Tailor Measurements", "3. सटीक नाप व कुशल सिलाई")}
              </span>
              <p className="text-[13.5px] font-bold text-stone-900 leading-snug mt-0.5">
                {t(
                  "Enter sizes yourself, send sample clothes, or get live video call assistance from senior master tailors.",
                  "खुद नाप भरें, नापने के लिए पुराने सिले कपड़े भेजें या मास्टर जी से वीडियो कॉल पर मदद लें।"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY CTA BUTTON */}
        <div className="welcome-actions mt-6">
          <button
            type="button"
            className="welcome-primary h-14 px-9 text-[14.5px] shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
            onClick={onStart}
          >
            <span>{t("Start Your Order", "ऑर्डर शुरू करें")}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-stone-600">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-700" />
            {t("100% Custom Tailored", "100% कस्टमाइज़्ड सिलाई")}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-700" />
            {t("Doorstep Delivery", "घर तक सुरक्षित डिलीवरी")}
          </span>
        </div>
      </div>
    </section>
  );
}