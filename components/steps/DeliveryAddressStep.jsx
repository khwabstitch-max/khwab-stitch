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
  Tag,
  Clock,
  Check,
  Camera,
} from "lucide-react";

import {
  BRAND_CONFIG,
  FRONT_NECK_PHOTOS,
  BACK_NECK_PHOTOS,
  SLEEVE_LENGTH_PHOTOS,
  SLEEVE_DESIGN_PHOTOS,
  OUTFIT_PHOTOS,
  DESIGN_CODE_PHOTOS,
  DESIGN_CODE_MAP,
  resolveOutfit,
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
  const resolvedOutfit = resolveOutfit(outfit?.type);
  const resolvedFrontNeck = resolveFrontNeck(design?.neckFront, design?.frontPhoto, outfit?.type);
  const resolvedBackNeck = resolveBackNeck(design?.neckBack, design?.backPhoto, outfit?.type);
  const resolvedSleeveLength = resolveSleeveLength(design?.sleeveLength, outfit?.type);
  const resolvedSleeveDesign = resolveSleeveDesign(design?.sleeveDesign, design?.sleevePhoto, outfit?.type);

  const frontNeckPhoto = resolvedFrontNeck.photo;
  const backNeckPhoto = resolvedBackNeck.photo;
  const sleeveLengthPhoto = resolvedSleeveLength.photo;
  const sleeveDesignPhoto = resolvedSleeveDesign.photo;
  const outfitPhoto = outfit?.uploadedPhoto || OUTFIT_PHOTOS[outfit?.type] || "./images/outfits/02_kurti.jpg";

  const designCodeInfo = outfit?.designCode ? (DESIGN_CODE_MAP[outfit.designCode] || null) : null;
  const designCodePhoto = outfit?.designCode ? (DESIGN_CODE_PHOTOS[outfit.designCode] || "./images/design_codes/K-01.jpg") : null;

  // Active measurement fields
  const activeMeasurementFields = outfit?.type ? measurementConfigs[outfit.type] || [] : [];
  const filledMeasurementEntries = Object.entries(measurements?.values || {}).filter(
    ([, val]) => val && String(val).trim() !== ""
  );

  return (
    <section className="step-card rounded-[28px] border bg-white p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
      {/* ================================================================= */}
      {/* SECTION 1: LOGO & ATELIER BRANDING (हमारा लोगो वाला) */}
      {/* ================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#ebdcd0] bg-[#fdfbf9] p-4 sm:p-5 rounded-2xl border border-[#ebdcd0] shadow-2xs">
        <div className="flex items-center gap-3.5">
          <img
            src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
            alt="Khwab Stitch Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-[var(--primary)] shadow-sm flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = "./images/khwabstitch_logo.jpg";
            }}
          />
          <div>
            <h1 className="font-serif text-[24px] sm:text-[27px] font-bold text-[var(--primary-dark)] m-0 leading-tight">
              {BRAND_CONFIG?.name || "Khwab Stitch"}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)] mt-0.5">
              {BRAND_CONFIG?.tagline || "Custom Stitching · Your Style · Our Stitches / हमारी कारीगरी"}
            </p>
          </div>
        </div>

        <div className="sm:text-right flex flex-col sm:items-end">
          <span className="inline-block rounded-full bg-[#fbf0f4] text-[var(--primary)] px-3 py-1 font-bold text-[12px] border border-[#f0d5df]">
            Order at a glance / आपके द्वारा चुनी गई सभी जानकारी
          </span>
          <span className="text-[11px] font-bold text-stone-500 mt-1">
            Section 1 of 3 · Atelier Verification
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 2: DETAIL ABOUT CUSTOMER & ADDRESS (ग्राहक की जानकारी व पता) */}
      {/* ================================================================= */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-[12px] font-bold">
              2
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              Customer Details & Address / ग्राहक विवरण व डिलीवरी पता
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-700 hover:text-[var(--primary)] bg-white px-2.5 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>{isEditingAddress ? "Done / पूरा हुआ" : "Quick Edit Address / पता बदलें"}</span>
            </button>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(2)}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 size={12} />
              <span>Edit Details / जानकारी बदलें (Step 2)</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          {/* Personal Information */}
          <div className="p-3 rounded-xl bg-white border border-[#ebdcd0] space-y-1.5">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              Personal Information / व्यक्तिगत जानकारी
            </p>
            <div className="flex items-center gap-2 font-bold text-[14.5px] text-stone-900">
              <User size={15} className="text-[var(--primary)] shrink-0" />
              <span>{customer?.name || "Customer / ग्राहक"}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-stone-700">
              <Phone size={14} className="text-emerald-700 shrink-0" />
              <span>+91 {customer?.whatsapp ? customer.whatsapp.replace(/\D/g, "").slice(-10) : ""}</span>
            </div>
            {customer?.email && (
              <div className="flex items-center gap-2 text-[12px] text-stone-600">
                <Mail size={13} className="text-stone-400 shrink-0" />
                <span>{customer.email}</span>
              </div>
            )}
          </div>

          {/* Delivery Destination Address */}
          <div className="p-3 rounded-xl bg-white border border-[#ebdcd0] space-y-1.5">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              Delivery Destination / डिलीवरी पता
            </p>
            {isEditingAddress ? (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  value={activeAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="House/flat number, street, colony..."
                />
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 p-1.5 text-[12px] bg-white"
                  value={activeLandmark}
                  onChange={(e) => handleLandmarkChange(e.target.value)}
                  placeholder="Landmark (optional)..."
                />
              </div>
            ) : (
              <>
                <p className="text-[13px] font-semibold text-stone-800 leading-snug">
                  {activeAddress || "No street address entered"}
                </p>
                {activeLandmark && (
                  <p className="text-[12px] text-stone-600">
                    <span className="font-semibold text-stone-500">Landmark:</span> {activeLandmark}
                  </p>
                )}
                <p className="text-[12.5px] font-semibold text-stone-700 pt-0.5">
                  {customer?.cityState} — <b>PIN: {customer?.pin}</b>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 3: STITCHING DETAIL (सिलाई व परिधान का संपूर्ण विवरण) */}
      {/* ================================================================= */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs space-y-5">
        {/* SECTION 3 HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-[12px] font-bold">
              3
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              Stitching & Garment Specifications / सिलाई व परिधान का संपूर्ण विवरण
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[var(--secondary)] bg-white px-2.5 py-1 rounded-full border border-[#ebdcd0]">
            Bespoke Tailoring / हस्तनिर्मित
          </span>
        </div>

        {/* 3A: SELECTED OUTFIT & QUANTITY */}
        <div className="rounded-xl border border-[#ebdcd0] bg-white p-3.5 sm:p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f0e7df] mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
              Selected Outfit & Quantity / चुना गया परिधान व संख्या
            </p>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(3)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline bg-[#fbf5f0] px-2.5 py-0.5 rounded-full border border-[#eedfd6] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>Edit Outfit / परिधान बदलें (Step 3)</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="relative group shrink-0">
              <img
                src={outfitPhoto}
                alt={outfit?.type || "Outfit"}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover border border-[#e4d6c8] shadow-2xs bg-white"
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
                  className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  title="Zoom / ज़ूम करें"
                >
                  <ZoomIn size={18} />
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-[18px] sm:text-[20px] font-bold text-stone-900">
                  {outfit?.type || "Not selected / चुना नहीं गया"}
                </span>
                <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f8efe7] text-[var(--secondary)] border border-[#ebdcd0]">
                  {resolvedOutfit?.hi || (outfit?.type === "Blouse" ? "ब्लाउज़" : outfit?.type === "Kurti" ? "कुर्ती" : "सूट")}
                </span>
              </div>
              <p className="text-[13px] text-stone-700">
                Quantity / संख्या: <b className="text-stone-900">{outfit?.pieces || 1} Piece(s) / थान</b>
              </p>
              {outfit?.specialReq && (
                <p className="text-[12px] text-stone-600 italic bg-[#faf7f2] p-2 rounded-lg border border-stone-200 mt-1">
                  <b>Tailor Note / विशेष निर्देश:</b> "{outfit.specialReq}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3B: DESIGN CODE IF CHOSEN */}
        {outfit?.designCode && (
          <div className="rounded-xl border border-[#dfd0c4] bg-[#fbf8f5] p-3.5 sm:p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ece2d6] mb-2.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--primary-dark)] text-white text-[11px] font-mono font-bold">
                  <Tag size={11} />
                  <span>Design Code: {outfit.designCode}</span>
                </span>
                <span className="text-[11.5px] font-bold text-stone-600">
                  {designCodeInfo?.name || "Studio Catalog Design"}
                </span>
              </div>
              {designCodePhoto && openLightbox && (
                <button
                  type="button"
                  onClick={() =>
                    openLightbox(
                      `Design Code ${outfit.designCode}`,
                      designCodePhoto,
                      "Studio Catalog Selection / कैटलॉग डिज़ाइन"
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline"
                >
                  <Eye size={12} />
                  <span>View Photo / फ़ोटो देखें</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {designCodePhoto && (
                <img
                  src={designCodePhoto}
                  alt={outfit.designCode}
                  className="h-14 w-14 rounded-lg object-cover border border-[#dfd0c4] cursor-pointer"
                  onClick={() =>
                    openLightbox &&
                    openLightbox(
                      `Design Code ${outfit.designCode}`,
                      designCodePhoto,
                      "Studio Catalog Selection / कैटलॉग डिज़ाइन"
                    )
                  }
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-stone-700">
                  {designCodeInfo?.details || "Master tailoring according to selected studio design pattern."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3C: CUSTOMER REFERENCE PHOTO (IF ATTACHED) */}
        {outfit?.uploadedPhoto && (
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="relative group shrink-0 max-w-[130px] w-full rounded-lg overflow-hidden border border-emerald-300 bg-white">
              <img
                src={outfit.uploadedPhoto}
                alt="Reference photo"
                className="w-full h-auto max-h-[130px] object-contain mx-auto"
              />
              {openLightbox && (
                <button
                  type="button"
                  onClick={() =>
                    openLightbox(
                      "Customer Reference Photo",
                      outfit.uploadedPhoto,
                      outfit.uploadedPhotoName || "Design Reference"
                    )
                  }
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  title="Zoom / ज़ूम करें"
                >
                  <ZoomIn size={18} />
                </button>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10.5px] font-bold">
                📸 Customer Reference Photo / आपकी अपलोड की गई फ़ोटो
              </span>
              <p className="text-[12.5px] font-bold text-stone-900 pt-0.5">
                {outfit.uploadedPhotoName || "Design Photo Attached"}
              </p>
              {outfit.uploadedPhotoSize && (
                <p className="text-[11px] text-stone-600">
                  File Size: {outfit.uploadedPhotoSize}
                </p>
              )}
              <p className="text-[11.5px] text-emerald-900 italic">
                कारीगर इस फ़ोटो के अनुसार परिधान का डिज़ाइन, कटिंग और सिलाई तैयार करेंगे।
              </p>
            </div>
          </div>
        )}

        {outfit?.refPhoto && !outfit?.uploadedPhoto && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] flex items-center gap-2">
            <span>📸</span>
            <span><b>Reference Choice / रेफ़रेंस विकल्प:</b> {outfit.refPhoto}</span>
          </div>
        )}

        {/* 3D: NECKLINE & SLEEVE STYLING BLUEPRINT (4 CARDS WITH PHOTOS) */}
        <div className="rounded-xl border border-[#ebdcd0] bg-white p-3.5 sm:p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f0e7df] mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
              ✂️ Neckline & Sleeve Styling / गला, बाज़ू व कटिंग
            </p>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(4)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline bg-[#fbf5f0] px-2.5 py-0.5 rounded-full border border-[#eedfd6] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>Edit Styling / डिज़ाइन बदलें (Step 4)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* FRONT NECK */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  Front Neck / आगे गला
                </p>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                  <img
                    src={frontNeckPhoto}
                    alt={resolvedFrontNeck.en}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold text-stone-900 leading-tight">
                  {resolvedFrontNeck.en}
                </p>
                <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                  {design?.neckFront === "as-photo" && design?.frontPhoto
                    ? "✓ कस्टम फ़ोटो अनुसार"
                    : resolvedFrontNeck.hiScript || resolvedFrontNeck.hi}
                </p>
              </div>
            </div>

            {/* BACK NECK */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  Back Neck / पीछे गला
                </p>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                  <img
                    src={backNeckPhoto}
                    alt={resolvedBackNeck.en}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold text-stone-900 leading-tight">
                  {resolvedBackNeck.en}
                </p>
                <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                  {design?.neckBack === "as-photo" && design?.backPhoto
                    ? "✓ कस्टम फ़ोटो अनुसार"
                    : resolvedBackNeck.hiScript || resolvedBackNeck.hi}
                </p>
              </div>
            </div>

            {/* SLEEVE LENGTH */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  Sleeve Length / बाज़ू लंबाई
                </p>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                  <img
                    src={sleeveLengthPhoto}
                    alt={resolvedSleeveLength.en}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold text-stone-900 leading-tight">
                  {resolvedSleeveLength.en}
                </p>
                <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                  {resolvedSleeveLength.hiScript || resolvedSleeveLength.hi}
                </p>
                <p className="text-[10.5px] text-stone-600 mt-0.5 font-mono font-bold">
                  Length: {resolvedSleeveLength.cm || resolvedSleeveLength.length}
                </p>
              </div>
            </div>

            {/* SLEEVE DESIGN */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  Sleeve Style / बाज़ू स्टाइल
                </p>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                  <img
                    src={sleeveDesignPhoto}
                    alt={resolvedSleeveDesign.en}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold text-stone-900 leading-tight">
                  {resolvedSleeveDesign.en}
                </p>
                <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                  {design?.sleeveDesign === "as-photo" && design?.sleevePhoto
                    ? "✓ कस्टम फ़ोटो अनुसार"
                    : resolvedSleeveDesign.hiScript || resolvedSleeveDesign.hi}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#f0e7df] flex items-center justify-between">
            <span className="text-[12px] text-stone-600">
              Fitting Preference / फिटिंग: <b className="text-stone-900">{design?.fit || "Regular Fit"}</b>
            </span>
          </div>
        </div>

        {/* 3E: MEASUREMENTS */}
        <div className="rounded-xl border border-[#ebdcd0] bg-white p-3.5 sm:p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f0e7df] mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
              📏 Measurements / नाप का विवरण ({measurements?.unit || "inch"})
            </p>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(5)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline bg-[#fbf5f0] px-2.5 py-0.5 rounded-full border border-[#eedfd6] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>Edit Measurements / नाप बदलें (Step 5)</span>
            </button>
          </div>

          <p className="text-[12.5px] font-bold text-[var(--primary-dark)] mb-2.5">
            Method / तरीका: <span className="text-stone-700 font-semibold">{measurements?.provideMethod || "Self measurement"}</span>
          </p>

          {filledMeasurementEntries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filledMeasurementEntries.map(([k, v]) => {
                const cfg = activeMeasurementFields.find((f) => f.key === k);
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#fdfbf9] border border-[#ebdcd0] text-[12px]"
                  >
                    <span className="text-stone-600 truncate mr-2" title={cfg?.en || k}>
                      {cfg ? `#${cfg.num} ${cfg.hi || cfg.en}` : k}:
                    </span>
                    <b className="font-mono text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
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

          {measurements?.notes && (
            <p className="mt-2 text-[12px] text-stone-600 italic bg-[#faf7f2] p-2 rounded-lg border border-stone-200">
              <b>Special Note / निर्देश:</b> "{measurements.notes}"
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
