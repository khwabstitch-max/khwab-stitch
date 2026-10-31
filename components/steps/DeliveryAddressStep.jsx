import React, { useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Edit2,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Sparkles,
  Scissors,
  Ruler,
  Eye,
  ZoomIn,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Tag,
  FileText,
  Clock,
  Check,
} from "lucide-react";

import {
  FRONT_NECK_PHOTOS,
  BACK_NECK_PHOTOS,
  SLEEVE_LENGTH_PHOTOS,
  SLEEVE_DESIGN_PHOTOS,
  OUTFIT_PHOTOS,
  resolveSleeveLength,
  resolveSleeveDesign,
  resolveFrontNeck,
  resolveBackNeck,
} from "../../config/fashionCatalog.js";

export default function DeliveryAddressStep({
  customer,
  setCustomer,
  delivery,
  setDelivery,
  outfit,
  setOutfit,
  design,
  setDesign,
  measurements,
  setMeasurements,
  onJumpToSection,
  outfitTypes = [],
  neckFront = [],
  neckBack = [],
  sleeveLengthData = [],
  sleeveDesign = [],
  measurementConfigs = {},
  openLightbox,
}) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Sync customer address to delivery if empty
  const activeAddress = delivery?.address || customer?.address || "";
  const activeLandmark = delivery?.landmark || customer?.landmark || "";

  const handleAddressChange = (value) => {
    setDelivery((prev) => ({ ...prev, address: value }));
    setCustomer((prev) => ({ ...prev, address: value }));
  };

  const handleLandmarkChange = (value) => {
    setDelivery((prev) => ({ ...prev, landmark: value }));
    setCustomer((prev) => ({ ...prev, landmark: value }));
  };


  // Resilient resolvers ensuring photo, name, and length are ALWAYS 100% synced & never blank
  const resolvedFrontNeck = resolveFrontNeck(design?.neckFront, design?.frontPhoto, outfit?.type);
  const resolvedBackNeck = resolveBackNeck(design?.neckBack, design?.backPhoto, outfit?.type);
  const resolvedSleeveLength = resolveSleeveLength(design?.sleeveLength, outfit?.type);
  const resolvedSleeveDesign = resolveSleeveDesign(design?.sleeveDesign, design?.sleevePhoto, outfit?.type);

  const frontNeckPhoto = resolvedFrontNeck.photo;
  const backNeckPhoto = resolvedBackNeck.photo;
  const sleeveLengthPhoto = resolvedSleeveLength.photo;
  const sleeveDesignPhoto = resolvedSleeveDesign.photo;
  const outfitPhoto = outfit?.uploadedPhoto || OUTFIT_PHOTOS[outfit?.type] || "./images/outfits/02_kurti.jpg";

  // Active measurement fields
  const activeMeasurementFields = outfit?.type ? measurementConfigs[outfit.type] || [] : [];
  const filledMeasurementEntries = Object.entries(measurements?.values || {}).filter(
    ([, val]) => val && String(val).trim() !== ""
  );

  return (
    <section className="step-card rounded-[28px] border bg-white p-5 sm:p-7 md:p-8 shadow-sm space-y-7">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
        <div className="flex items-center gap-3.5">
          <span className="step-icon">
            <MapPin size={20} />
          </span>
          <div>
            <p className="step-eyebrow">STEP 06 · ORDER AT A GLANCE & DELIVERY / संपूर्ण सारांश व डिलीवरी</p>
            <h2 className="font-serif text-[23px] sm:text-[27px] font-bold text-[var(--primary-dark)] leading-tight">
              Order at a glance / आपके द्वारा चुनी गई सभी जानकारी
            </h2>
            <p className="text-[13px] text-[var(--text-light)] mt-0.5">
              Review every detail with preview photos. Click 'Edit' on any section to adjust / सब कुछ फ़ोटो के साथ देखें, किसी भी भाग को बदलने के लिए Edit दबाएँ।
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. OUTFIT & DESIGN CODE CARD (WITH PREVIEW PHOTO) */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fbeae5] text-[var(--primary)] text-[12px] font-bold">
              1
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              Outfit & Design Code / परिधान व कोड
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onJumpToSection && onJumpToSection(3)}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
            <span>Edit Outfit / परिधान बदलें (Step 3)</span>
          </button>
        </div>

        <div className="mt-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* OUTFIT PHOTO PREVIEW WITH LIGHTBOX ZOOM */}
          <div className="relative group shrink-0">
            <img
              src={outfitPhoto}
              alt={outfit?.type || "Outfit"}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-[#e4d6c8] shadow-sm bg-white"
            />
            {openLightbox && (
              <button
                type="button"
                onClick={() =>
                  openLightbox(
                    outfit?.type || "Outfit Preview",
                    outfitPhoto,
                    `${outfit?.type} · Khwab Stitch Atelier`
                  )
                }
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                title="Click to zoom image / फ़ोटो ज़ूम करें"
              >
                <ZoomIn size={20} />
              </button>
            )}
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[var(--primary)] text-white text-[10px] font-extrabold shadow-2xs">
              × {outfit?.pieces || 1}
            </span>
          </div>

          {/* OUTFIT DETAILS */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-[18px] sm:text-[20px] font-bold text-stone-900">
                {outfit?.type || "Not selected / चुना नहीं गया"}
              </span>
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f8efe7] text-[var(--secondary)] border border-[#ebdcd0]">
                {outfit?.type === "Blouse"
                  ? "ब्लाउज़ / चोली"
                  : outfit?.type === "Kurti"
                  ? "कुर्ती / कुर्ता"
                  : "सूट अपर / कमीज़"}
              </span>
            </div>

            <p className="text-[12.5px] text-stone-600">
              Quantity / संख्या: <b className="text-stone-900">{outfit?.pieces || 1} Piece(s)</b>
            </p>

            {/* DESIGN CODE DISPLAY IF SELECTED */}
            {outfit?.designCode && (
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#f0e7df] text-[var(--primary-dark)] text-[12px] font-mono font-bold border border-[#dfd0c4]">
                  <Tag size={12} />
                  <span>Design Code: {outfit.designCode}</span>
                </span>
                {outfit.designCode && (
                  <button
                    type="button"
                    onClick={() =>
                      openLightbox &&
                      openLightbox(
                        `Design Code ${outfit.designCode}`,
                        DESIGN_CODE_PHOTOS[outfit.designCode] || "./images/design_codes/K-01.jpg",
                        "Studio Catalog Selection / कैटलॉग डिज़ाइन"
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline"
                  >
                    <Eye size={12} />
                    <span>View {outfit.designCode} Photo / फ़ोटो देखें</span>
                  </button>
                )}
              </div>
            )}

            {/* UPLOADED PHOTO NOTICE */}
            {outfit?.uploadedPhoto && (
              <p className="text-[12px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Your custom reference photo attached ({outfit.uploadedPhotoName || "Design Photo"})</span>
              </p>
            )}

            {outfit?.refPhoto && !outfit?.uploadedPhoto && (
              <p className="text-[12px] text-stone-700 font-semibold flex items-center gap-1.5 pt-0.5">
                <span>Reference / रेफ़रेंस: <b>{outfit.refPhoto}</b></span>
              </p>
            )}

            {outfit?.specialReq && (
              <p className="text-[12px] text-stone-600 italic bg-white p-2 rounded-lg border border-stone-200 mt-1">
                Note: "{outfit.specialReq}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. STYLING & DESIGN CHOICES (WITH 4 PREVIEW PHOTOS) */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fbf0e0] text-[var(--secondary)] text-[12px] font-bold">
              2
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              Neckline & Sleeve Styling / गला, बाज़ू व कटिंग
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onJumpToSection && onJumpToSection(4)}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
            <span>Edit Styling / डिज़ाइन बदलें (Step 4)</span>
          </button>
        </div>

        {/* 4 STYLING CARDS WITH REAL PHOTOS */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* FRONT NECK */}
          <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                Front Neck / आगे गला
              </p>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                {frontNeckPhoto ? (
                  <img
                    src={frontNeckPhoto}
                    alt={selectedFrontNeck?.en || "Front Neck"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[11px] text-stone-400">
                    No photo
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-stone-900 leading-tight">
                {design?.neckFront === "as-photo"
                  ? "As per Photo / फोटो जैसा"
                  : selectedFrontNeck
                  ? `${selectedFrontNeck.en} / ${selectedFrontNeck.hiScript || selectedFrontNeck.hi}`
                  : design?.neckFront || "Standard / सामान्य"}
              </p>
              {design?.neckFront === "as-photo" && design?.frontPhoto && (
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5 truncate">
                  ✓ Photo Attached / फ़ोटो संलग्न है
                </p>
              )}
            </div>
          </div>

          {/* BACK NECK */}
          <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                Back Neck / पीछे गला
              </p>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                {backNeckPhoto ? (
                  <img
                    src={backNeckPhoto}
                    alt={selectedBackNeck?.en || "Back Neck"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[11px] text-stone-400">
                    No photo
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-stone-900 leading-tight">
                {design?.neckBack === "as-photo"
                  ? "As per Photo / फोटो जैसा"
                  : selectedBackNeck
                  ? `${selectedBackNeck.en} / ${selectedBackNeck.hiScript || selectedBackNeck.hi}`
                  : design?.neckBack || "Standard / सामान्य"}
              </p>
              {design?.neckBack === "as-photo" && design?.backPhoto && (
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5 truncate">
                  ✓ Photo Attached / फ़ोटो संलग्न है
                </p>
              )}
            </div>
          </div>

          {/* SLEEVE LENGTH */}
          <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                Sleeve Length / बाज़ू लंबाई
              </p>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                <img
                  src={sleeveLengthPhoto}
                  alt={resolvedSleeveLength.en}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-stone-900 leading-tight">
                {resolvedSleeveLength.en} / {resolvedSleeveLength.hiScript || resolvedSleeveLength.hi}
              </p>
              <p className="text-[11px] text-[var(--secondary)] mt-0.5 font-semibold">
                Length: {resolvedSleeveLength.cm || resolvedSleeveLength.length}
              </p>
            </div>
          </div>

          {/* SLEEVE DESIGN */}
          <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                Sleeve Style / बाज़ू प्रकार
              </p>
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                {sleeveDesignPhoto ? (
                  <img
                    src={sleeveDesignPhoto}
                    alt={selectedSleeveDesign?.en || "Sleeve Design"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[11px] text-stone-400">
                    Straight Plain
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-[12.5px] font-bold text-stone-900 leading-tight">
                {design?.sleeveDesign === "as-photo"
                  ? "As per Photo / फोटो जैसा"
                  : selectedSleeveDesign
                  ? `${selectedSleeveDesign.en} / ${selectedSleeveDesign.hiScript || selectedSleeveDesign.hi}`
                  : design?.sleeveDesign || "Straight / सीधी"}
              </p>
              {design?.sleeveDesign === "as-photo" && design?.sleevePhoto && (
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5 truncate">
                  ✓ Photo Attached / फ़ोटो संलग्न है
                </p>
              )}
            </div>
          </div>
        </div>

        {/* FIT & EXTRA INSTRUCTIONS */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-[#ece2d6] text-[12px]">
          <span className="font-semibold text-stone-600">Fitting Preference / फ़िटिंग:</span>
          <span className="font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
            {design?.fit || "Regular"} Fit
          </span>
          {design?.additionalInstructions && (
            <span className="text-stone-500 italic ml-2">
              Note: "{design.additionalInstructions}"
            </span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MEASUREMENTS SUMMARY CARD */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#f8eef2] text-[#8e2e4b] text-[12px] font-bold">
              3
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              Measurements / नाप का विवरण ({measurements?.unit || "inch"})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onJumpToSection && onJumpToSection(5)}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
            <span>Edit Measurements / नाप बदलें (Step 5)</span>
          </button>
        </div>

        <div className="mt-3.5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-stone-600 font-semibold">Method / तरीक़ा:</span>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[var(--primary-dark)] border border-[#ded2c4]">
              {measurements?.provideMethod || "Self Measurement / खुद से नाप"}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
              Unit: {measurements?.unit === "cm" ? "Centimeters (cm)" : "Inches (in)"}
            </span>
          </div>

          {/* MEASUREMENT VALUES GRID */}
          {filledMeasurementEntries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
              {filledMeasurementEntries.map(([k, v]) => {
                const cfg = activeMeasurementFields.find((f) => f.key === k);
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#ebdcd0] text-[12px]"
                  >
                    <span className="text-stone-600 truncate mr-2" title={cfg?.en || k}>
                      {cfg ? `#${cfg.num} ${cfg.hi || cfg.en}` : k}:
                    </span>
                    <b className="font-mono text-stone-900 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                      {v} {measurements?.unit || "in"}
                    </b>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12.5px]">
              {measurements?.provideMethod?.includes("वीडियो कॉल")
                ? "📹 Master tailor will contact you shortly on WhatsApp to measure over video call / मास्टर दर्जी नाप के लिए वीडियो कॉल पर संपर्क करेंगे।"
                : measurements?.provideMethod?.includes("भेजूंगी") || measurements?.provideMethod?.includes("सिले")
                ? "📦 You will send your stitched sample clothes for measurement / आप नापने के लिए अपने सिले हुए कपड़े भेजेंगी।"
                : "No manual measurements entered. Click 'Edit Measurements' to fill or request tailor assistance."}
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. CUSTOMER CONTACT DETAILS */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#f0e7df] text-stone-800 text-[12px] font-bold">
              4
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              Customer Information / ग्राहक का विवरण
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onJumpToSection && onJumpToSection(2)}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
            <span>Edit Details / जानकारी बदलें (Step 2)</span>
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#ebdcd0]">
            <User size={16} className="text-[var(--primary)] shrink-0" />
            <div>
              <p className="text-[10.5px] font-bold text-stone-500 uppercase">Customer Name / नाम</p>
              <p className="font-bold text-stone-900">{customer?.name || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#ebdcd0]">
            <Phone size={16} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10.5px] font-bold text-stone-500 uppercase">WhatsApp Number / फ़ोन</p>
              <p className="font-bold text-stone-900">
                {customer?.whatsapp ? `+91 ${customer.whatsapp.replace(/\D/g, "").slice(-10)}` : "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#ebdcd0]">
            <Mail size={16} className="text-stone-400 shrink-0" />
            <div>
              <p className="text-[10.5px] font-bold text-stone-500 uppercase">Email / ईमेल</p>
              <p className="font-semibold text-stone-800">{customer?.email || "Optional · Not entered"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#ebdcd0]">
            <MapPin size={16} className="text-[var(--primary)] shrink-0" />
            <div>
              <p className="text-[10.5px] font-bold text-stone-500 uppercase">City, State & PIN</p>
              <p className="font-semibold text-stone-800">
                {customer?.cityState ? `${customer.cityState} · PIN: ${customer.pin}` : "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. CONFIRMED DELIVERY ADDRESS & TIMELINE */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl border-2 border-[#e6dacd] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2 text-[var(--primary-dark)] font-bold text-[14px]">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Full Delivery Address / पुष्टि किया गया डिलीवरी पता</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
            className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-lg border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
            {isEditingAddress ? "Done / पूरा हुआ" : "Edit Address / पता बदलें"}
          </button>
        </div>

        {isEditingAddress ? (
          <div className="mt-4 space-y-3">
            <label className="block text-[12px] font-bold text-stone-700">
              Address / मकान नंबर, गली, मोहल्ला:
              <textarea
                rows={2}
                className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                value={activeAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="House number, street, colony..."
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-[12px] font-bold text-stone-700">
                Landmark / पास का लैंडमार्क:
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={activeLandmark}
                  onChange={(e) => handleLandmarkChange(e.target.value)}
                  placeholder="Near temple, school..."
                />
              </label>
              <label className="block text-[12px] font-bold text-stone-700">
                City, State & PIN / शहर, राज्य व पिन:
                <div className="mt-1 p-2 bg-stone-100 rounded-xl text-[12.5px] text-stone-700 border border-stone-200">
                  {customer?.cityState} — PIN: {customer?.pin}
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-[13.5px] leading-relaxed text-stone-800">
            <div className="flex items-center gap-2 font-bold text-[14.5px] text-[var(--primary-dark)]">
              <span>{customer?.name || "Customer / ग्राहक"}</span>
              <span className="font-semibold text-stone-500 text-[12px]">📱 {customer?.whatsapp}</span>
            </div>
            <p className="mt-1.5 text-stone-800 font-medium leading-relaxed">
              {activeAddress || "No address provided / पता नहीं भरा गया"}
            </p>
            {activeLandmark && (
              <p className="text-[12.5px] text-stone-600 mt-0.5">
                <span className="font-semibold text-stone-500">Landmark / लैंडमार्क:</span> {activeLandmark}
              </p>
            )}
            <p className="text-[13px] text-stone-700 mt-1 font-semibold">
              {customer?.cityState} — <b>PIN: {customer?.pin}</b>
            </p>
            <div className="mt-3 flex items-center gap-2 text-[12px] font-bold text-[var(--secondary)] bg-white p-2 rounded-xl border border-stone-200 w-fit">
              <Clock size={14} />
              <span>Standard Handcrafted Tailoring · 7–10 Days Doorstep Delivery</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
