import React, { useRef } from "react";
import { Globe, ShieldCheck } from "lucide-react";
import { BRAND_CONFIG } from "../config/fashionCatalog.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const steps = [
  { en: "Welcome", hi: "स्वागत" },
  { en: "Details", hi: "जानकारी" },
  { en: "Outfit", hi: "परिधान" },
  { en: "Design", hi: "डिज़ाइन" },
  { en: "Measurements", hi: "नाप" },
  { en: "Delivery", hi: "डिलीवरी" },
];

export default function StepHeader({
  currentSection,
  activeMode = "customer",
  onNavigateCustomer,
  onNavigateAdmin,
  onJumpToSection,
  ordersCount = null,
}) {
  const { lang, setLang, t } = useLanguage();
  const progress = (currentSection / steps.length) * 100;
  const clickRef = useRef({ time: 0, count: 0 });

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - clickRef.current.time < 500) {
      clickRef.current.count += 1;
      if (clickRef.current.count >= 3) {
        clickRef.current = { time: 0, count: 0 };
        if (onNavigateAdmin) onNavigateAdmin();
        return;
      }
    } else {
      clickRef.current = { time: now, count: 1 };
    }
    if (onNavigateCustomer) onNavigateCustomer();
  };

  return (
    <header className="step-header" data-safe-area-sticky-top>
      <div className="step-header__inner">
        {/* BRAND LOGO */}
        <div
          className="brand-lockup cursor-pointer group flex items-center gap-2.5 sm:gap-3 select-none"
          onClick={handleLogoClick}
          title={t("Khwab Stitch — Where Fabric Becomes Art", "ख़्वाब स्टिच — हमारी कारीगरी")}
        >
          <div className="relative flex-shrink-0">
            <img
              src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
              alt="Khwab Stitch Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-[#dfc5b5] shadow-xs transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "./images/khwabstitch_logo.jpg";
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--primary)] text-[8px] text-white shadow-2xs">
              ✦
            </span>
          </div>
          <div className="min-w-0">
            <strong className="font-serif text-[17px] sm:text-[20px] font-bold text-[var(--primary-dark)] tracking-tight leading-tight block">
              {activeMode === "admin"
                ? t("Khwab Stitch Atelier", "ख़्वाब स्टिच एटेलियर")
                : t("Khwab Stitch", "ख़्वाब स्टिच")}
            </strong>
            <small className="block text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-[var(--secondary)] truncate">
              {activeMode === "admin"
                ? t("Master Tailor Order Management", "मास्टर दर्जी ऑर्डर प्रबंधन")
                : t("Where Fabric Becomes Art", "हमारी कारीगरी · ख़्वाब स्टिच")}
            </small>
          </div>
        </div>

        {/* HEADER RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* LANGUAGE TOGGLE SWITCH (TOP RIGHT) */}
          <div
            className="inline-flex items-center rounded-full bg-[#f2eae1] p-0.5 border border-[#e4d8cc] text-[11.5px] font-bold shadow-2xs"
            role="group"
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[var(--primary)] text-white shadow-xs font-extrabold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="Switch to English"
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer ${
                lang === "hi"
                  ? "bg-[var(--primary)] text-white shadow-xs font-extrabold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
          </div>

          {activeMode === "admin" && (
            <button
              type="button"
              onClick={onNavigateCustomer}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[var(--primary)] text-white text-[11.5px] sm:text-[12px] font-bold shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Globe size={13} />
              <span className="hidden sm:inline">
                {t("Customer Website", "वेबसाइट देखें")}
              </span>
              <span className="sm:hidden">{t("Website", "वेबसाइट")}</span>
            </button>
          )}
        </div>
      </div>

      {/* CUSTOMER STEP PROGRESS BAR (ONLY ON CUSTOMER PAGE) */}
      {activeMode === "customer" && (
        <div className="step-progress">
          <div className="step-progress__top">
            <span>
              <b>{t(`STEP ${currentSection}`, `चरण ${currentSection}`)}</b> {t(`OF ${steps.length}`, `कुल ${steps.length}`)}
            </span>
            <span>
              {lang === "hi" ? steps[currentSection - 1]?.hi : steps[currentSection - 1]?.en}
            </span>
          </div>
          <div
            className="step-progress__track"
            role="progressbar"
            aria-label="Order form progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={currentSection}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <nav className="step-progress__steps" aria-label="Order steps">
            {steps.map((step, index) => {
              const number = index + 1;
              const label = lang === "hi" ? step.hi : step.en;
              return (
                <button
                  type="button"
                  key={step.en}
                  onClick={() => onJumpToSection && onJumpToSection(number)}
                  className={`step-progress__step cursor-pointer text-left bg-transparent border-0 p-0 transition-opacity hover:opacity-80${
                    number === currentSection ? " is-current" : ""
                  }${number < currentSection ? " is-complete" : ""}`}
                  aria-current={number === currentSection ? "step" : undefined}
                  title={`Jump to Step ${number}: ${label}`}
                >
                  <i>{number < currentSection ? "✓" : number}</i>
                  <small>
                    <span>{label}</span>
                  </small>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
