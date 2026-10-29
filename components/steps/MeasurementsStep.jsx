import React, { useState } from "react";
import {
  Ruler,
  Truck,
  PhoneCall,
  Sparkles,
  Maximize2,
  ChevronDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileEdit,
} from "lucide-react";
import BlouseMeasurementSketch from "../BlouseMeasurementSketch.jsx";

const methodOptions = [
  {
    id: "self_measurement",
    label: "Self measurement / खुद से नाप लेकर",
    tag: "Accurate Fit / सटीक नाप",
    type: "self",
  },
  {
    id: "local_tailor",
    label: "From local tailor / दर्जी से नाप करवाकर",
    tag: "Professional / दर्जी से",
    type: "self",
  },
  {
    id: "send_clothes",
    label: "I will send my clothes / मैं अपने कपड़े भेजूंगी",
    tag: "Send Clothes / कपड़े भेजूंगी",
    type: "courier",
  },
  {
    id: "video_call",
    label: "Need help on video call / वीडियो कॉल पर मदद चाहिए (1 घंटे में कॉल)",
    tag: "Master Tailor Help / 1 घंटे में कॉल",
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
  const [showSketchModal, setShowSketchModal] = useState(false);

  const updateMeasurements = (updates) => setMeasurements({ ...measurements, ...updates });

  const currentMethod = measurements.provideMethod || methodOptions[0].label;

  const isCourier =
    currentMethod.includes("भेजूंगी") ||
    currentMethod.includes("send my clothes") ||
    currentMethod.includes("sample clothes");

  const isVideoCall =
    currentMethod.includes("वीडियो कॉल") ||
    currentMethod.includes("video call") ||
    currentMethod.includes("help on video");

  // Only self measurement or local tailor require manual measurement entry & sketch photo
  const isSelfMeasure = !isCourier && !isVideoCall;

  // Selected outfit label & sketch info
  const outfitTitle = outfit.type || "Outfit";
  const isBlouse = outfit.type === "Blouse";
  const kurtiSketchImg = "/images/measurement_guide_kurti.png";

  const handleMethodChange = (event) => {
    const selected = event.target.value;
    updateMeasurements({ provideMethod: selected });
  };

  const handleZoomSketch = () => {
    if (openLightbox && !isBlouse) {
      openLightbox(
        `${outfitTitle} Measurement Guide / नाप का रेखाचित्र`,
        kurtiSketchImg,
        "Follow points 1 to 10 on diagram / चित्र में 1 से 10 तक के बिंदुओं के अनुसार नाप लें"
      );
    } else {
      setShowSketchModal(true);
    }
  };

  return (
    <section className="step-card rounded-[28px] border bg-white p-6 md:p-8 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
        <div className="flex items-center gap-3">
          <span className="step-icon">
            <Ruler size={18} />
          </span>
          <div>
            <p className="step-eyebrow">STEP 05 · YOUR MEASUREMENTS / आपके नाप</p>
            <h2 className="text-[24px] font-bold text-[var(--primary-dark)]">
              {outfit.type
                ? `${outfit.type} Measurements / ${outfit.type} का नाप`
                : "Your measurements / आपके नाप"}
            </h2>
            <p className="text-[13px] text-[var(--text-light)]">
              {isSelfMeasure
                ? `Refer to the measurement diagram to enter your exact ${outfitTitle} size / रेखाचित्र के अनुसार नाप भरें`
                : isCourier
                ? `You will send clothes for stitching / आप सिलाई के लिए अपने कपड़े भेजेंगे`
                : `Live video call assistance with our master tailor / 1 घंटे में वीडियो कॉल पर मास्टर दर्जी की मदद`}
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
                {unit === "inch" ? "Inches / इंच" : "CM / सेमी"}
              </button>
            ))}
          </div>
        )}
      </div>

      {outfit.type ? (
        <>
          {/* METHOD SELECTION DROPDOWN (4 OPTIONS) */}
          <div className="mb-6 rounded-2xl border border-[#eedfd6] bg-[#fdfaf8] p-5 shadow-xs">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="measurement-method-select"
                className="block text-[13px] font-bold text-[var(--primary-dark)]"
              >
                How will you provide your measurements? / नाप कैसे देंगे?
              </label>
              <span className="rounded-full bg-[#f4e8e1] px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                4 Options / 4 विकल्प
              </span>
            </div>

            <div className="relative mt-2">
              <select
                id="measurement-method-select"
                value={currentMethod}
                onChange={handleMethodChange}
                className="w-full appearance-none rounded-xl border-2 border-[#e6d0c4] bg-white px-4 py-3.5 pr-10 text-[13.5px] font-semibold text-[var(--primary-dark)] shadow-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-3 focus:ring-[rgba(107,38,54,0.15)]"
              >
                {methodOptions.map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--primary)]">
                <ChevronDown size={20} />
              </div>
            </div>

            <p className="mt-2 text-[11.5px] text-[var(--text-light)]">
              {isSelfMeasure && "📏 नीचे दिए गए रेखाचित्र (Measurement Sketch) को देखकर नाप भरें।"}
              {isVideoCall && "📹 1 घंटे के अंदर हमारे मास्टर दर्जी का वीडियो कॉल आएगा (नाप भरने की ज़रूरत नहीं)।"}
            </p>
          </div>

          {/* VIEW 1: SEND CLOTHES (Option 3: मैं अपने कपड़े भेजूंगी) */}
          {/* NO MEASUREMENT PHOTO, NO MEASUREMENT INPUT FIELDS, NO PICKUP NOTICE */}
          {isCourier && (
            <div className="mb-6 space-y-4">
              {/* OPTIONAL SPECIAL INSTRUCTIONS BOX FOR SENDING CLOTHES */}
              <div className="rounded-2xl border border-[#eedfd6] bg-white p-5 shadow-xs">
                <label className="block text-[13px] font-bold text-[var(--primary-dark)] mb-1">
                  Any special notes or fitting instructions? / कोई विशेष निर्देश? (Optional)
                </label>
                <p className="text-[11.5px] text-[var(--text-light)] mb-2.5">
                  e.g., Any notes about the fabric or fitting / जैसे: कपड़े या नाप से संबंधित कोई विशेष बात
                </p>
                <textarea
                  rows={2}
                  value={measurements.notes || ""}
                  onChange={(e) => updateMeasurements({ notes: e.target.value })}
                  placeholder="Type any instructions here... / कोई विशेष निर्देश यहाँ लिखें..."
                  className="w-full rounded-xl border border-[#eedfd6] p-3 text-[12.5px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(107,38,54,0.1)]"
                />
              </div>
            </div>
          )}

          {/* VIEW 2: VIDEO CALL ASSISTANCE (Option 4: वीडियो कॉल पर मदद चाहिए) */}
          {/* NO MEASUREMENT PHOTO, NO MEASUREMENT INPUT FIELDS */}
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
                        Master Tailor Video Assistance within 1 Hour / 1 घंटे में वीडियो कॉल सहायता
                      </h3>
                      <span className="flex items-center gap-1 rounded-full bg-[#965342] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        <Clock size={11} /> 1 Hour Guarantee
                      </span>
                    </div>

                    <p className="mt-2.5 text-[13px] leading-relaxed text-[#4a2e2b]">
                      <strong>English:</strong> Need guidance taking measurements? Our bespoke customizer & senior
                      master tailor will connect with you on video call via WhatsApp / Phone (
                      <span className="font-semibold text-[#6b2636]">
                        {customer?.whatsapp || customer?.phone || "your contact number"}
                      </span>
                      ) within <strong>1 hour</strong> of submitting your order to guide you through every measurement
                      step-by-step!
                    </p>

                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#5c3732]">
                      <strong>हिंदी:</strong> यदि आपको नाप लेने में किसी भी मदद या वीडियो कॉल की ज़रूरत है, तो ऑर्डर
                      सबमिट होने के <strong>1 घंटे के भीतर</strong> हमारे वरिष्ठ मास्टर कस्टमाइज़र आपके दिए गए नंबर (
                      <span className="font-semibold text-[#6b2636]">
                        {customer?.whatsapp || customer?.phone || "दिए गए नंबर"}
                      </span>
                      ) पर वीडियो कॉल करेंगे और स्क्रीन पर एक-एक नाप आसानी से लेने में आपकी पूरी मदद करेंगे।
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-white/90 p-3 border border-[#eedfd6]">
                      <Sparkles size={16} className="text-amber-700" />
                      <span className="text-[12px] font-bold text-amber-900">
                        1-Hour Video Call Confirmed · मास्टर जी सीधे आपके वॉट्सऐप पर कॉल करके नाप नोट कर लेंगे।
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPTIONAL PREFERRED TIME NOTE FOR VIDEO CALL */}
              <div className="rounded-2xl border border-[#eedfd6] bg-white p-4 shadow-xs">
                <label className="block text-[12.5px] font-bold text-[var(--primary-dark)] mb-1">
                  Preferred time for video call? / वीडियो कॉल के लिए आपका पसंदीदा समय? (Optional)
                </label>
                <textarea
                  rows={2}
                  value={measurements.notes || ""}
                  onChange={(e) => updateMeasurements({ notes: e.target.value })}
                  placeholder="e.g., Call between 3 PM to 5 PM / जैसे: दोपहर 3 से 5 बजे के बीच कॉल करें..."
                  className="w-full rounded-xl border border-[#eedfd6] p-3 text-[12.5px] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(107,38,54,0.1)]"
                />
              </div>
            </div>
          )}

          {/* VIEW 3: SELF MEASUREMENT & LOCAL TAILOR (Option 1 & Option 2) */}
          {/* SHOWS MEASUREMENT SKETCH PHOTO AND MEASUREMENT INPUT BOXES */}
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
                        {outfitTitle} Measurement Guide / {outfitTitle} नाप लेने का रेखाचित्र
                      </h3>
                      <p className="text-[11px] text-[var(--text-light)]">
                        Refer to the diagram below to take exact measurements / चित्र के अनुसार आसानी से सही नाप लें
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleZoomSketch}
                    className="flex items-center gap-1.5 rounded-full border border-[#d6beaf] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--primary-dark)] shadow-2xs hover:bg-[#faf4ef]"
                  >
                    <Maximize2 size={13} /> Enlarge / बड़ा देखें
                  </button>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                    {/* LEFT: THE SKETCH IMAGE / SVG */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center">
                      {isBlouse ? (
                        <BlouseMeasurementSketch />
                      ) : (
                        <div className="relative group max-w-[420px] w-full rounded-2xl border border-[#eedfd6] bg-white p-3 shadow-xs">
                          <img
                            src={kurtiSketchImg}
                            alt={`${outfitTitle} Measurement Diagram`}
                            className="mx-auto h-auto max-h-[460px] w-full object-contain cursor-zoom-in"
                            onClick={handleZoomSketch}
                          />
                          <button
                            type="button"
                            onClick={handleZoomSketch}
                            className="absolute bottom-5 right-5 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-bold text-white shadow-md backdrop-blur-xs transition-opacity hover:bg-black"
                          >
                            <Maximize2 size={13} /> Click to Enlarge / बड़ा देखें
                          </button>
                        </div>
                      )}
                    </div>

                    {/* RIGHT: NUMBERED QUICK GUIDE / REFERENCE POINTS */}
                    <div className="lg:col-span-6">
                      <div className="rounded-xl border border-[#eedfd6] bg-white p-4 shadow-2xs">
                        <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[var(--primary-dark)]">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f4e8e1] text-[10px] text-[var(--primary)] font-bold">
                            i
                          </span>
                          <span>Guide: How each point is measured / किस बिंदु को कैसे नापें</span>
                        </h4>

                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 text-[11.5px]">
                          {measurementFields.map((field, idx) => {
                            const pointNum = field.num || idx + 1;
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
                                    {field.en} / {field.hi}
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
                          💡 <strong>सुझाव / Tip:</strong> किसी अच्छे फिटिंग वाले पुराने कपड़े को समतल मेज़ पर रखकर
                          इंची टेप से नाप लें।
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC MEASUREMENT INPUT FIELDS */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[var(--primary-dark)]">
                  Enter Measurements / नाप दर्ज करें
                </h3>
                <span className="text-[12px] font-bold text-[var(--primary)]">
                  Unit: {measurements.unit === "inch" ? "Inches (इंच)" : "Centimeters (सेमी)"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {measurementFields.map((field, idx) => {
                  const pointNum = field.num || idx + 1;
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
                          <span>
                            {field.en} / {field.hi}
                          </span>
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
                        <span>{measurements.unit === "inch" ? "in / इंच" : "cm / सेमी"}</span>
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
          Please choose an outfit first / कृपया पहले परिधान चुनें।
        </p>
      )}

      {/* LIGHTBOX MODAL FOR BLOUSE / ENLARGED SKETCH */}
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
                {outfitTitle} Measurement Guide / नाप का रेखाचित्र
              </h3>
              <button
                type="button"
                onClick={() => setShowSketchModal(false)}
                className="rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center p-2">
              {isBlouse ? (
                <BlouseMeasurementSketch />
              ) : (
                <img
                  src={kurtiSketchImg}
                  alt={`${outfitTitle} Measurement Diagram`}
                  className="mx-auto h-auto max-h-[70vh] w-full object-contain"
                />
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowSketchModal(false)}
                className="rounded-full bg-[var(--primary)] px-6 py-2 text-[13px] font-bold text-white shadow-md"
              >
                Close / बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
