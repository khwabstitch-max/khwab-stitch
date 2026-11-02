import React, { useState } from "react";
import {
  Ruler,
  PhoneCall,
  Sparkles,
  Maximize2,
  ChevronDown,
  Clock,
} from "lucide-react";
import { MEASUREMENT_GUIDES } from "../../config/fashionCatalog.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

const methodOptions = [
  {
    id: "self_measurement",
    en: "Self measurement",
    hi: "खुद से नाप लेकर",
    tagEn: "Accurate Fit",
    tagHi: "सटीक नाप",
    type: "self",
  },
  {
    id: "local_tailor",
    en: "From local tailor",
    hi: "दर्जी से नाप करवाकर",
    tagEn: "Professional",
    tagHi: "दर्जी से",
    type: "self",
  },
  {
    id: "send_clothes",
    en: "I will send my stitched sample clothes for measurement",
    hi: "मैं अपने सिले हुए कपड़े नापने के लिए भेजूंगी",
    tagEn: "Stitched Sample Clothes",
    tagHi: "सिले कपड़े भेजूंगी",
    type: "courier",
  },
  {
    id: "video_call",
    en: "Need help on video call (Master tailor will connect shortly)",
    hi: "वीडियो कॉल पर मदद चाहिए (जल्दी ही संपर्क करेंगे)",
    tagEn: "Master Tailor Help",
    tagHi: "जल्दी संपर्क",
    type: "videocall",
  },
];

export default function MeasurementsStep({
  outfit,
  measurements,
  setMeasurements,
  measurementFields = [],
  customer,
  openLightbox,
}) {
  const { lang, t } = useLanguage();
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [guideView, setGuideView] = useState("outfit");

  const updateMeasurements = (updates) => setMeasurements({ ...measurements, ...updates });

  const currentMethod = measurements.provideMethod || "self_measurement";

  const isCourier =
    currentMethod === "send_clothes" ||
    currentMethod.includes("भेजूंगी") ||
    currentMethod.includes("भेजूँगी") ||
    currentMethod.includes("सिले") ||
    currentMethod.includes("send my clothes") ||
    currentMethod.includes("stitched sample") ||
    currentMethod.includes("sample clothes");

  const isVideoCall =
    currentMethod === "video_call" ||
    currentMethod.includes("वीडियो कॉल") ||
    currentMethod.includes("video call") ||
    currentMethod.includes("help on video");

  // Only self measurement or local tailor require manual measurement entry & sketch photo
  const isSelfMeasure = !isCourier && !isVideoCall;

  // Selected outfit label & photo guide info
  const outfitTitle = outfit.type || "Outfit";
  const isBlouse = outfit.type === "Blouse";
  const outfitGuideImg =
    MEASUREMENT_GUIDES?.[outfit.type] ||
    (outfit.type === "Blouse"
      ? "./images/measurement_guides/measurement_guide_blouse.jpg"
      : (outfit.type === "Suit Upper" || outfit.type === "Suit")
      ? "./images/measurement_guides/measurement_guide_suit.jpg"
      : "./images/measurement_guides/measurement_guide_kurti.jpg");

  const handleMethodChange = (event) => {
    const selected = event.target.value;
    updateMeasurements({ provideMethod: selected });
  };

  const handleZoomSketch = () => {
    if (openLightbox) {
      openLightbox(
        t(`${outfitTitle} Measurement Guide`, `${outfitTitle} नाप का रेखाचित्र`),
        outfitGuideImg,
        t("Follow points on the diagram to take exact sizes", "चित्र में दिए गए बिंदुओं के अनुसार सही नाप लें")
      );
    } else {
      setShowSketchModal(true);
    }
  };

  return (
    <section className="step-card rounded-[24px] sm:rounded-[28px] border bg-white p-4 sm:p-6 md:p-8 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
        <div className="flex items-center gap-3">
          <span className="step-icon">
            <Ruler size={18} />
          </span>
          <div>
            <p className="step-eyebrow">
              {t("STEP 05 · YOUR MEASUREMENTS", "चरण 05 · आपके नाप")}
            </p>
            <h2 className="text-[24px] font-bold text-[var(--primary-dark)]">
              {outfit.type
                ? t(`${outfit.type} Measurements`, `${outfit.type} का नाप`)
                : t("Your measurements", "आपके नाप")}
            </h2>
            <p className="text-[13px] text-[var(--text-light)]">
              {isSelfMeasure
                ? t(
                    `Refer to the measurement diagram to enter your exact ${outfitTitle} size`,
                    `रेखाचित्र के अनुसार अपना सटीक ${outfitTitle} नाप भरें`
                  )
                : isCourier
                ? t(
                    "You will send your stitched sample clothes for measurement",
                    "आप नाप के लिए अपने सिले हुए कपड़े भेजेंगे"
                  )
                : t(
                    "Live video call assistance with our master tailor",
                    "मास्टर दर्जी जल्दी ही आपसे वीडियो कॉल पर संपर्क करेंगे"
                  )}
            </p>
          </div>
        </div>

        {/* UNIT TOGGLE (ONLY RELEVANT FOR MANUAL SELF MEASUREMENT) */}
        {outfit.type && isSelfMeasure && (
          <div className="unit-toggle" aria-label="Measurement unit">
            {["inch", "cm"].map((unit) => (
              <button
                type="button"
                key={unit}
                aria-pressed={measurements.unit === unit}
                className={measurements.unit === unit ? "is-active" : ""}
                onClick={() => updateMeasurements({ unit })}
              >
                {unit === "inch" ? t("Inches", "इंच") : t("CM", "सेमी")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AUTHENTIC DRESSMAKER TAPE MEASURE RIBBON */}
      <div className="tape-measure-bar h-3.5 w-full rounded-full -mt-2 mb-5 shadow-xs" title="Khwab Stitch Master Tailor Measuring Ribbon" />

      {outfit.type ? (
        <>
          {/* METHOD SELECTION DROPDOWN (4 OPTIONS) */}
          <div className="mb-6 rounded-2xl border border-[#eedfd6] bg-[#fdfaf8] p-3.5 sm:p-5 shadow-xs">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="measurement-method-select"
                className="block text-[13px] font-bold text-[var(--primary-dark)]"
              >
                {t("How will you provide your measurements?", "नाप कैसे देंगे?")}
              </label>
              <span className="rounded-full bg-[#f4e8e1] px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                {t("4 Options", "4 विकल्प")}
              </span>
            </div>

            <div className="relative mt-2">
              <select
                id="measurement-method-select"
                value={
                  methodOptions.find(
                    (m) =>
                      m.id === currentMethod ||
                      m.en === currentMethod ||
                      m.hi === currentMethod ||
                      currentMethod.includes(m.id)
                  )?.id || methodOptions[0].id
                }
                onChange={handleMethodChange}
                className="w-full appearance-none rounded-xl border-2 border-[#e6d0c4] bg-white px-4 py-3.5 pr-10 text-[13.5px] font-semibold text-[var(--primary-dark)] shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-3 focus:ring-[rgba(107,38,54,0.15)] cursor-pointer"
              >
                {methodOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {lang === "hi" ? opt.hi : opt.en}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--primary)]">
                <ChevronDown size={20} />
              </div>
            </div>

            <p className="mt-2 text-[11.5px] text-[var(--text-light)]">
              {isSelfMeasure &&
                t(
                  "📏 Follow the diagram below to enter your measurements.",
                  "📏 नीचे दिए गए रेखाचित्र (Measurement Sketch) को देखकर नाप भरें।"
                )}
              {isVideoCall &&
                t(
                  "📹 Our master tailor will contact you shortly (No manual entry required).",
                  "📹 हमारे मास्टर दर्जी जल्दी ही आपसे संपर्क करेंगे (नाप भरने की ज़रूरत नहीं)।"
                )}
              {isCourier &&
                t(
                  "📦 Send your best fitting sample clothes to our atelier address.",
                  "📦 अपने सबसे अच्छी फ़िटिंग वाले पुराने कपड़े हमारे पते पर भेजें।"
                )}
            </p>
          </div>

          {/* VIEW 1: SEND CLOTHES */}
          {isCourier && (
            <div className="mb-6 space-y-4">
              <div className="rounded-2xl border border-[#eedfd6] bg-white p-5 shadow-xs">
                <label className="block text-[13px] font-bold text-[var(--primary-dark)] mb-1">
                  {t(
                    "Any special notes or fitting instructions?",
                    "कोई विशेष निर्देश?"
                  )}{" "}
                  <small className="text-[11px] font-normal text-stone-500">
                    {t("(Optional)", "(वैकल्पिक)")}
                  </small>
                </label>
                <p className="text-[11.5px] text-[var(--text-light)] mb-2.5">
                  {t(
                    "e.g., Any notes about the fabric or fitting",
                    "जैसे: कपड़े या नाप से संबंधित कोई विशेष बात"
                  )}
                </p>
                <textarea
                  rows={2}
                  value={measurements.notes || ""}
                  onChange={(e) => updateMeasurements({ notes: e.target.value })}
                  placeholder={t(
                    "Type any instructions here...",
                    "कोई विशेष निर्देश यहाँ लिखें..."
                  )}
                  className="w-full rounded-xl border border-[#eedfd6] p-3 text-[12.5px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(107,38,54,0.1)]"
                />
              </div>
            </div>
          )}

          {/* VIEW 2: VIDEO CALL ASSISTANCE */}
          {isVideoCall && (
            <div className="mb-6 space-y-4">
              <div className="overflow-hidden rounded-2xl border-2 border-[#b87333] bg-gradient-to-br from-[#fff7f0] via-[#fffdfa] to-[#fdede2] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#965342] text-white shadow-md">
                    <PhoneCall size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[17px] font-bold text-[#6b2636]">
                        {t(
                          "Master Tailor Video Assistance",
                          "वीडियो कॉल पर मास्टर दर्जी की मदद"
                        )}
                      </h3>
                      <span className="flex items-center gap-1 rounded-full bg-[#965342] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        <Clock size={11} /> {t("Quick Assistance", "जल्दी संपर्क")}
                      </span>
                    </div>

                    <p className="mt-2.5 text-[13px] leading-relaxed text-[#4a2e2b]">
                      {lang === "hi" ? (
                        <>
                          यदि आपको नाप लेने में किसी भी मदद या वीडियो कॉल की ज़रूरत है, तो हमारे वरिष्ठ मास्टर दर्जी{" "}
                          <strong>जल्दी ही आपसे संपर्क करेंगे</strong> और आपके दिए गए नंबर (
                          <span className="font-semibold text-[#6b2636]">
                            {customer?.whatsapp || customer?.phone || "दिए गए नंबर"}
                          </span>
                          ) पर वीडियो कॉल करके एक-एक नाप आसानी से लेने में आपकी पूरी मदद करेंगे।
                        </>
                      ) : (
                        <>
                          Need guidance taking measurements? Our bespoke customizer & senior master tailor will connect with you on video call via WhatsApp / Phone (
                          <span className="font-semibold text-[#6b2636]">
                            {customer?.whatsapp || customer?.phone || "your contact number"}
                          </span>
                          ) shortly to guide you through every measurement step-by-step!
                        </>
                      )}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-white/90 p-3 border border-[#eedfd6]">
                      <Sparkles size={16} className="text-amber-700" />
                      <span className="text-[12px] font-bold text-amber-900">
                        {t(
                          "Video Call Confirmed · Tailor will connect shortly to record size",
                          "वीडियो कॉल कन्फर्म · मास्टर जी जल्दी ही आपसे संपर्क करके नाप नोट कर लेंगे।"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPTIONAL PREFERRED TIME NOTE */}
              <div className="rounded-2xl border border-[#eedfd6] bg-white p-4 shadow-xs">
                <label className="block text-[12.5px] font-bold text-[var(--primary-dark)] mb-1">
                  {t(
                    "Preferred time for video call?",
                    "वीडियो कॉल के लिए आपका पसंदीदा समय?"
                  )}{" "}
                  <small className="text-[11px] font-normal text-stone-500">
                    {t("(Optional)", "(वैकल्पिक)")}
                  </small>
                </label>
                <textarea
                  rows={2}
                  value={measurements.notes || ""}
                  onChange={(e) => updateMeasurements({ notes: e.target.value })}
                  placeholder={t(
                    "e.g., Call between 3 PM to 5 PM...",
                    "जैसे: दोपहर 3 से 5 बजे के बीच कॉल करें..."
                  )}
                  className="w-full rounded-xl border border-[#eedfd6] p-3 text-[12.5px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(107,38,54,0.1)]"
                />
              </div>
            </div>
          )}

          {/* VIEW 3: SELF MEASUREMENT & LOCAL TAILOR */}
          {isSelfMeasure && (
            <>
              {/* MEASUREMENT REFERENCE SKETCH BOX */}
              <div className="mb-7 overflow-hidden rounded-2xl border-2 border-[#eedfd6] bg-[#fcf9f7] shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eedfd6] bg-gradient-to-r from-[#fbf4ee] to-[#f6e9e1] px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[12px] font-bold">
                      ✦
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold text-[var(--primary-dark)]">
                        {t(
                          `${outfitTitle} Measurement Guide`,
                          `${outfitTitle} नाप लेने का रेखाचित्र`
                        )}
                      </h3>
                      <p className="text-[11px] text-[var(--text-light)]">
                        {t(
                          "Refer to the diagram below to take exact measurements",
                          "चित्र के अनुसार आसानी से सही नाप लें"
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleZoomSketch}
                    className="flex items-center gap-1.5 rounded-full border border-[#d6beaf] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--primary-dark)] shadow-2xs hover:bg-[#faf4ef] cursor-pointer"
                  >
                    <Maximize2 size={13} /> {t("Enlarge", "बड़ा देखें")}
                  </button>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                  <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                    {/* LEFT: THE MEASUREMENT PHOTO GUIDE */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center">
                      <div className="relative group max-w-[420px] w-full rounded-2xl border border-[#eedfd6] bg-white p-2.5 shadow-xs">
                        <img
                          src={outfitGuideImg}
                          alt={`${outfitTitle} Measurement Diagram`}
                          className="mx-auto h-auto max-h-[490px] w-full object-contain cursor-zoom-in rounded-xl transition-transform hover:scale-[1.01]"
                          onClick={handleZoomSketch}
                          onError={(e) => {
                            if (!e.currentTarget.src.includes(".png")) {
                              e.currentTarget.src = outfitGuideImg.replace(".jpg", ".png");
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleZoomSketch}
                          className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1.5 text-[11px] font-bold text-white shadow-md backdrop-blur-xs transition-opacity hover:bg-black cursor-pointer"
                        >
                          <Maximize2 size={13} /> {t("Click to Enlarge", "बड़ा देखें")}
                        </button>
                      </div>
                      <p className="mt-2 text-[11.5px] font-medium text-stone-600 text-center">
                        {t(
                          "Click on image to enlarge points and lines",
                          "पॉइंट्स को साफ़ व बड़ा देखने के लिए चित्र पर क्लिक करें"
                        )}
                      </p>
                    </div>

                    {/* RIGHT: NUMBERED QUICK GUIDE */}
                    <div className="lg:col-span-6">
                      <div className="rounded-xl border border-[#eedfd6] bg-white p-4 shadow-2xs">
                        <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[var(--primary-dark)]">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f4e8e1] text-[10px] text-[var(--primary)] font-bold">
                            i
                          </span>
                          <span>
                            {t(
                              "Guide: How each point is measured",
                              "किस बिंदु को कैसे नापें"
                            )}
                          </span>
                        </h4>

                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-[11.5px]">
                          {measurementFields.map((field, idx) => {
                            const pointNum = field.num || idx + 1;
                            const fieldLabel = lang === "hi" ? (field.hi || field.en) : field.en;
                            return (
                              <div
                                key={field.key}
                                className="flex items-start gap-2.5 rounded-lg border border-[#f5ede7] bg-[#fdfaf8] p-2 transition-colors hover:border-[#dfc3b5] hover:bg-white"
                              >
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                                  {pointNum}
                                </span>
                                <div className="flex-1">
                                  <span className="font-bold text-[var(--primary-dark)]">
                                    {fieldLabel}
                                  </span>
                                  {field.help && (
                                    <span className="block text-[11px] text-[var(--text-light)]">
                                      {field.help}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 rounded-lg bg-[#faf5f0] p-2.5 text-[11px] text-[#70483c] border border-[#f0dfd5]">
                          💡{" "}
                          <strong>{t("Tip:", "सुझाव:")}</strong>{" "}
                          {t(
                            "Lay a well-fitted old garment flat on a table and measure with an inch tape.",
                            "किसी अच्छे फिटिंग वाले पुराने कपड़े को समतल मेज़ पर रखकर इंची टेप से नाप लें।"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC MEASUREMENT INPUT FIELDS */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[var(--primary-dark)]">
                  {t("Enter Measurements", "नाप दर्ज करें")}
                </h3>
                <span className="text-[12px] font-bold text-[var(--primary)]">
                  {t(
                    `Unit: ${measurements.unit === "inch" ? "Inches" : "Centimeters"}`,
                    `इकाई: ${measurements.unit === "inch" ? "इंच" : "सेमी"}`
                  )}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {measurementFields.map((field, idx) => {
                  const pointNum = field.num || idx + 1;
                  const fieldLabel = lang === "hi" ? (field.hi || field.en) : field.en;
                  return (
                    <label
                      className="form-field relative rounded-2xl border border-[#eedfd6] bg-[#fffdfb] p-3.5 transition-all focus-within:border-[var(--primary)] focus-within:bg-white focus-within:shadow-sm"
                      key={field.key}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--primary-dark)]">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                            {pointNum}
                          </span>
                          <span>{fieldLabel}</span>
                        </span>
                      </div>

                      {field.help && (
                        <p className="mb-2 text-[11px] text-[var(--text-light)]">
                          {field.help}
                        </p>
                      )}

                      <div className="measurement-input">
                        <input
                          inputMode="decimal"
                          value={measurements.values[field.key] || ""}
                          onChange={(event) =>
                            updateMeasurements({
                              values: { ...measurements.values, [field.key]: event.target.value },
                            })
                          }
                          placeholder="e.g. 36"
                        />
                        <span>{measurements.unit === "inch" ? t("in", "इंच") : t("cm", "सेमी")}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800 font-semibold">
          {t("Please choose an outfit first.", "कृपया पहले परिधान चुनें।")}
        </p>
      )}

      {/* LIGHTBOX MODAL */}
      {showSketchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          onClick={() => setShowSketchModal(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[550px] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h3 className="text-[17px] font-bold text-[var(--primary-dark)]">
                {t(
                  `${outfitTitle} Measurement Guide`,
                  `${outfitTitle} नाप का रेखाचित्र`
                )}
              </h3>
              <button
                type="button"
                onClick={() => setShowSketchModal(false)}
                className="rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center p-2">
              <img
                src={outfitGuideImg}
                alt={`${outfitTitle} Measurement Diagram`}
                className="mx-auto h-auto max-h-[75vh] w-full object-contain rounded-xl"
                onError={(e) => {
                  if (!e.currentTarget.src.includes(".png")) {
                    e.currentTarget.src = outfitGuideImg.replace(".jpg", ".png");
                  }
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowSketchModal(false)}
                className="rounded-full bg-[var(--primary)] px-6 py-2 text-[13px] font-bold text-white shadow-md cursor-pointer"
              >
                {t("Close", "बंद करें")}
              </button>
            </div>
          </div>
        </div>
      )}
    
                  {/* MASTER TAILOR 1.5-INCH SEAM MARGIN GUARANTEE */}
                  <div className="mt-5 flex items-start sm:items-center gap-3 p-3.5 rounded-xl bg-[#fff8eb] border border-[#f3d49f] text-[#7a4e10] text-[12px] shadow-2xs">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#c49233] text-white text-[13px] font-bold">
                      ✂️
                    </span>
                    <div>
                      <p className="font-bold text-[12.5px] leading-tight text-[#623b05]">
                        {t(
                          "1.5-Inch In-Seam Alteration Margin Included Inside",
                          "1.5 इंच अतिरिक्त दबाव (सीवन मार्जिन) गारंटी"
                        )}
                      </p>
                      <p className="text-[11px] text-[#7a4e10] leading-snug mt-0.5">
                        {t(
                          "Every custom garment is hand-stitched with 1.5 extra inches on both sides for effortless future adjustments.",
                          "हमारे हर सिले परिधान में दोनों तरफ 1.5 इंच अतिरिक्त कपड़ा छोड़ा जाता है जिससे आप भविष्य में कभी भी आसानी से नाप ढीला या टाइट करा सकें।"
                        )}
                      </p>
                    </div>
                  </div>

    </section>
  );
}