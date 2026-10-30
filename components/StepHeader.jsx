import React, { useRef } from "react";
import { Globe, ShieldCheck } from "lucide-react";

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
  ordersCount = null,
}) {
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
          title="Khwab Stitch — Where Fabric Becomes Art"
        >
          <div className="relative flex-shrink-0">
            <img
              src="./images/khwabstitch_logo.jpg"
              alt="Khwab Stitch Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-[#dfc5b5] shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--primary)] text-[8px] text-white shadow-2xs">
              ✦
            </span>
          </div>
          <div className="min-w-0">
            <strong className="font-serif text-[17px] sm:text-[20px] font-bold text-[var(--primary-dark)] tracking-tight leading-tight block">
              {activeMode === "admin" ? "Khwab Stitch Atelier" : "Khwab Stitch"}
            </strong>
            <small className="block text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-[var(--secondary)] truncate">
              {activeMode === "admin"
                ? "Master Tailor Order Management"
                : "Where Fabric Becomes Art · ख़्वाब स्टिच"}
            </small>
          </div>
        </div>

        {/* HEADER RIGHT ACTIONS */}
        {activeMode === "admin" && (
          /* IN ADMIN MODE: SWITCH TO CUSTOMER SITE BUTTON */
          <button
            type="button"
            onClick={onNavigateCustomer}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[var(--primary)] text-white text-[11.5px] sm:text-[12px] font-bold shadow-xs hover:opacity-95 transition-opacity"
          >
            <Globe size={13} />
            <span className="hidden sm:inline">Customer Website / वेबसाइट देखें</span>
            <span className="sm:hidden">वेबसाइट</span>
          </button>
        )}
      </div>

      {/* CUSTOMER STEP PROGRESS BAR (ONLY ON CUSTOMER PAGE) */}
      {activeMode === "customer" && (
        <div className="step-progress">
          <div className="step-progress__top">
            <span>
              <b>STEP {currentSection}</b> OF {steps.length} / चरण {currentSection} कुल {steps.length}
            </span>
            <span>
              {steps[currentSection - 1]?.en} / {steps[currentSection - 1]?.hi}
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
              return (
                <span
                  key={step.en}
                  className={`step-progress__step${
                    number === currentSection ? " is-current" : ""
                  }${number < currentSection ? " is-complete" : ""}`}
                  aria-current={number === currentSection ? "step" : undefined}
                >
                  <i>{number < currentSection ? "✓" : number}</i>
                  <small>
                    <span>
                      {step.en} / {step.hi}
                    </span>
                  </small>
                </span>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
