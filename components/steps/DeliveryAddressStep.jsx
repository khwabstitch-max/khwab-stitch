import React, { useState } from "react";
import {
  MapPin,
  Edit2,
  User,
  Phone,
  Mail,
  Eye,
  ZoomIn,
  Tag,
  Check,
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
  resolveFabric,
} from "../../config/fashionCatalog.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

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
  const { lang, t } = useLanguage();
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

  // Resilient resolvers
  const resolvedOutfit = resolveOutfit(outfit?.type);
  const resolvedFabric = resolveFabric(outfit?.fabricType);
  const resolvedFrontNeck = resolveFrontNeck(design?.neckFront, design?.frontPhoto, outfit?.type);
  const resolvedBackNeck = resolveBackNeck(design?.neckBack, design?.backPhoto, outfit?.type);
  const resolvedSleeveLength = resolveSleeveLength(
    design?.sleeveLength,
    design?.sleeveLengthPhoto,
    outfit?.type
  );
  const resolvedSleeveDesign = resolveSleeveDesign(design?.sleeveDesign, design?.sleevePhoto, outfit?.type);

  const frontNeckPhoto = resolvedFrontNeck.photo;
  const backNeckPhoto = resolvedBackNeck.photo;
  const sleeveLengthPhoto = resolvedSleeveLength.photo;
  const sleeveDesignPhoto = resolvedSleeveDesign.photo;

  const designCodeInfo = outfit?.designCode ? (DESIGN_CODE_MAP[outfit.designCode] || null) : null;
  const designCodePhoto = outfit?.designCode ? (DESIGN_CODE_PHOTOS[outfit.designCode] || "./images/design_codes/K-01.jpg") : null;

  // Active measurement fields
  const activeMeasurementFields = outfit?.type ? measurementConfigs[outfit.type] || [] : [];
  const filledMeasurementEntries = Object.entries(measurements?.values || {}).filter(
    ([, val]) => val && String(val).trim() !== ""
  );

  return (
    <section className="step-card rounded-[28px] border bg-white p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
      {/* SECTION 1: LOGO & ATELIER BRANDING */}
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
              {t("Where Fabric Becomes Art · Bespoke Atelier", "हमारी कारीगरी · ख़्वाब स्टिच")}
            </p>
          </div>
        </div>

        <div className="sm:text-right flex flex-col sm:items-end">
          <span className="inline-block rounded-full bg-[#fbf0f4] text-[var(--primary)] px-3 py-1 font-bold text-[12px] border border-[#f0d5df]">
            {t("Order at a glance", "आपके द्वारा चुनी गई सभी जानकारी")}
          </span>
          <span className="text-[11px] font-bold text-stone-500 mt-1">
            {t("Section 1 of 3 · Atelier Verification", "भाग 1 · विवरण का सत्यापन")}
          </span>
        </div>
      </div>

      {/* SECTION 2: CUSTOMER DETAILS & ADDRESS */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-[12px] font-bold">
              2
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              {t("Customer Details & Address", "ग्राहक विवरण व डिलीवरी पता")}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-700 hover:text-[var(--primary)] bg-white px-2.5 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>{isEditingAddress ? t("Done", "पूरा हुआ") : t("Quick Edit Address", "पता बदलें")}</span>
            </button>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(2)}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-full border border-[#ded2c4] shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 size={12} />
              <span>{t("Edit Details (Step 2)", "जानकारी बदलें (चरण 2)")}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          {/* Personal Information */}
          <div className="p-3 rounded-xl bg-white border border-[#ebdcd0] space-y-1.5">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              {t("Personal Information", "व्यक्तिगत जानकारी")}
            </p>
            <div className="flex items-center gap-2 font-bold text-[14.5px] text-stone-900">
              <User size={15} className="text-[var(--primary)] shrink-0" />
              <span>{customer?.name || t("Customer", "ग्राहक")}</span>
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
              {t("Delivery Destination", "डिलीवरी पता")}
            </p>
            {isEditingAddress ? (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-stone-300 p-2 text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  value={activeAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder={t("House/flat number, street, colony...", "मकान नंबर, गली, मोहल्ला...")}
                />
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 p-1.5 text-[12px] bg-white"
                  value={activeLandmark}
                  onChange={(e) => handleLandmarkChange(e.target.value)}
                  placeholder={t("Landmark (optional)...", "लैंडमार्क (वैकल्पिक)...")}
                />
              </div>
            ) : (
              <>
                <p className="text-[13px] font-semibold text-stone-800 leading-snug">
                  {activeAddress || t("No street address entered", "पता दर्ज नहीं किया गया")}
                </p>
                {activeLandmark && (
                  <p className="text-[12px] text-stone-600">
                    <span className="font-semibold text-stone-500">{t("Landmark:", "लैंडमार्क:")}</span> {activeLandmark}
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

      {/* SECTION 3: STITCHING DETAIL */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-5 shadow-2xs space-y-5">
        {/* SECTION 3 HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-[12px] font-bold">
              3
            </span>
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
              {t("Stitching & Garment Specifications", "सिलाई व परिधान का संपूर्ण विवरण")}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[var(--secondary)] bg-white px-2.5 py-1 rounded-full border border-[#ebdcd0]">
            {t("Bespoke Tailoring", "हस्तनिर्मित")}
          </span>
        </div>

        {/* 3A: SELECTED OUTFIT & DESIGN REFERENCE */}
        <div className="rounded-xl border border-[#ebdcd0] bg-white p-3.5 sm:p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f0e7df]">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
              {t("Selected Outfit & Design", "चुना गया परिधान व डिज़ाइन")}
            </p>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(3)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline bg-[#fbf5f0] px-2.5 py-0.5 rounded-full border border-[#eedfd6] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>{t("Edit Outfit (Step 3)", "परिधान बदलें (चरण 3)")}</span>
            </button>
          </div>

          {/* Outfit Name & Quantity Line */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-[18px] sm:text-[20px] font-bold text-stone-900">
                {lang === "hi"
                  ? (resolvedOutfit?.hi || outfit?.type || "परिधान")
                  : (resolvedOutfit?.en || outfit?.type || "Custom Outfit")}
              </span>
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f8efe7] text-[var(--secondary)] border border-[#ebdcd0]">
                {lang === "hi" ? (resolvedOutfit?.hi || outfit?.type) : (resolvedOutfit?.en || outfit?.type)}
              </span>
            </div>

            <span className="text-[12.5px] font-bold text-stone-900 bg-[#fbf5f0] px-3 py-1 rounded-full border border-[#eedfd6]">
              {t(`Quantity: ${outfit?.pieces || 1} Piece(s)`, `संख्या: ${outfit?.pieces || 1} थान / पीस`)}
            </span>
          </div>

          {/* FABRIC & MATERIAL SPECIFICATION */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#fdfbf9] border border-[#ebdcd0]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[14px]">
                {resolvedFabric?.icon || "🧵"}
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
                  {t("Fabric & Cloth Material", "कपड़ा व फ़ैब्रिक")}
                </span>
                <span className="text-[13.5px] font-bold text-stone-900">
                  {lang === "hi" ? resolvedFabric?.nameHi : resolvedFabric?.name}
                </span>
                {outfit?.fabricColor && (
                  <span className="text-[11.5px] text-stone-600 block mt-0.5">
                    <b>{t("Color / Texture:", "रंग / विवरण:")}</b> {outfit.fabricColor}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              {resolvedFabric?.tag}
            </span>
          </div>

          {/* CUSTOMER REFERENCE PHOTO */}
          {outfit?.uploadedPhoto && (
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-3 sm:p-3.5 flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
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
                        t("Customer Reference Photo", "आपकी अपलोड की गई फ़ोटो"),
                        outfit.uploadedPhoto,
                        outfit.uploadedPhotoName || "Design Reference"
                      )
                    }
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                    title={t("Zoom", "ज़ूम करें")}
                  >
                    <ZoomIn size={18} />
                  </button>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10.5px] font-bold">
                  {t("📸 Customer Reference Photo", "📸 आपकी अपलोड की गई फ़ोटो")}
                </span>
                <p className="text-[12.5px] font-bold text-stone-900 pt-0.5">
                  {outfit.uploadedPhotoName || t("Design Photo Attached", "डिज़ाइन फ़ोटो संलग्न")}
                </p>
                {outfit.uploadedPhotoSize && (
                  <p className="text-[11px] text-stone-600">
                    File Size: {outfit.uploadedPhotoSize}
                  </p>
                )}
                <p className="text-[11.5px] text-emerald-900 italic">
                  {t(
                    "Master tailors will handcraft your garment according to this photo.",
                    "कारीगर इस फ़ोटो के अनुसार परिधान का डिज़ाइन, कटिंग और सिलाई तैयार करेंगे।"
                  )}
                </p>
              </div>
            </div>
          )}

          {/* STUDIO DESIGN CODE */}
          {outfit?.designCode && (
            <div className="rounded-xl border border-[#dfd0c4] bg-[#fbf8f5] p-3 sm:p-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#ece2d6] mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--primary-dark)] text-white text-[11px] font-mono font-bold">
                    <Tag size={11} />
                    <span>{t(`Design Code: ${outfit.designCode}`, `डिज़ाइन कोड: ${outfit.designCode}`)}</span>
                  </span>
                  <span className="text-[11.5px] font-bold text-stone-600">
                    {lang === "hi" && designCodeInfo?.hi ? designCodeInfo.hi : (designCodeInfo?.name || "Studio Catalog Design")}
                  </span>
                </div>
                {designCodePhoto && openLightbox && (
                  <button
                    type="button"
                    onClick={() =>
                      openLightbox(
                        `Design Code ${outfit.designCode}`,
                        designCodePhoto,
                        t("Studio Catalog Selection", "कैटलॉग डिज़ाइन")
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>{t("View Photo", "फ़ोटो देखें")}</span>
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
                        t("Studio Catalog Selection", "कैटलॉग डिज़ाइन")
                      )
                    }
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-stone-700">
                    {designCodeInfo?.details || t("Master tailoring according to selected studio design pattern.", "चुने गए कैटलॉग पैटर्न के अनुसार सिलाई की जाएगी।")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tailor Note if any */}
          {outfit?.specialReq && (
            <p className="text-[12px] text-stone-600 italic bg-[#faf7f2] p-2 rounded-lg border border-stone-200 mt-1">
              <b>{t("Tailor Note:", "विशेष निर्देश:")}</b> "{outfit.specialReq}"
            </p>
          )}
        </div>

        {/* 3D: NECKLINE & SLEEVE STYLING BLUEPRINT */}
        <div className="rounded-xl border border-[#ebdcd0] bg-white p-3.5 sm:p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f0e7df] mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
              {t("✂️ Neckline & Sleeve Styling", "✂️ गला, बाज़ू व कटिंग")}
            </p>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(4)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline bg-[#fbf5f0] px-2.5 py-0.5 rounded-full border border-[#eedfd6] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>{t("Edit Styling (Step 4)", "डिज़ाइन बदलें (चरण 4)")}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* FRONT NECK */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  {t("Front Neck", "आगे गला")}
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
                  {lang === "hi"
                    ? (design?.neckFront === "as-photo" && design?.frontPhoto
                        ? "✓ कस्टम फ़ोटो अनुसार"
                        : resolvedFrontNeck.hiScript || resolvedFrontNeck.hi)
                    : (design?.neckFront === "as-photo"
                        ? "✓ As per Photo"
                        : resolvedFrontNeck.en)}
                </p>
              </div>
            </div>

            {/* BACK NECK */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  {t("Back Neck", "पीछे गला")}
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
                  {lang === "hi"
                    ? (design?.neckBack === "as-photo" && design?.backPhoto
                        ? "✓ कस्टम फ़ोटो अनुसार"
                        : resolvedBackNeck.hiScript || resolvedBackNeck.hi)
                    : (design?.neckBack === "as-photo"
                        ? "✓ As per Photo"
                        : resolvedBackNeck.en)}
                </p>
              </div>
            </div>

            {/* SLEEVE LENGTH */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  {t("Sleeve Length", "बाज़ू लंबाई")}
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
                  {lang === "hi"
                    ? (resolvedSleeveLength.hiScript || resolvedSleeveLength.hi)
                    : resolvedSleeveLength.en}
                </p>
                <p className="text-[10.5px] text-stone-600 mt-0.5 font-mono font-bold">
                  {t(
                    `Length: ${resolvedSleeveLength.cm || resolvedSleeveLength.length}`,
                    `लंबाई: ${resolvedSleeveLength.cm || resolvedSleeveLength.length}`
                  )}
                </p>
              </div>
            </div>

            {/* SLEEVE DESIGN */}
            <div className="rounded-xl border border-[#ebdcd0] bg-[#fdfbf9] p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  {t("Sleeve Style", "बाज़ू स्टाइल")}
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
                  {lang === "hi"
                    ? (design?.sleeveDesign === "as-photo" && design?.sleevePhoto
                        ? "✓ कस्टम फ़ोटो अनुसार"
                        : resolvedSleeveDesign.hiScript || resolvedSleeveDesign.hi)
                    : (design?.sleeveDesign === "as-photo"
                        ? "✓ As per Photo"
                        : resolvedSleeveDesign.en)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#f0e7df] flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] text-stone-600">
              {t("Fitting Preference:", "सिलाई की फ़िटिंग:")} <b className="text-stone-900">{design?.fit || "Regular"}</b>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✂️ {t("1.5-inch inner margin included", "1.5 इंच इनर मार्जिन शामिल")}
            </span>
          </div>

          {design?.additionalInstructions && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-[#fffdfa] border border-[#ebdcd0] text-[12px] text-stone-700 leading-snug">
              <b className="text-[var(--primary)]">✨ {t("Trims & Finishing Details:", "विशेष काम व निर्देश:")}</b>{" "}
              {design.additionalInstructions}
            </div>
          )}
        </div>

        {/* 3E: MEASUREMENTS */}
        <div className="rounded-xl border border-[#ebdcd0] bg-white p-3.5 sm:p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f0e7df] mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
              {t(
                `📏 Measurements (${measurements?.unit || "inch"})`,
                `📏 नाप का विवरण (${measurements?.unit === "cm" ? "सेमी" : "इंच"})`
              )}
            </p>
            <button
              type="button"
              onClick={() => onJumpToSection && onJumpToSection(5)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] hover:underline bg-[#fbf5f0] px-2.5 py-0.5 rounded-full border border-[#eedfd6] transition-colors cursor-pointer"
            >
              <Edit2 size={11} />
              <span>{t("Edit Measurements (Step 5)", "नाप बदलें (चरण 5)")}</span>
            </button>
          </div>

          <p className="text-[12.5px] font-bold text-[var(--primary-dark)] mb-2.5">
            {t("Method:", "तरीका:")}{" "}
            <span className="text-stone-700 font-semibold">
              {measurements?.provideMethod?.includes("वीडियो कॉल") || measurements?.provideMethod === "video_call"
                ? t("Video Call Assistance", "वीडियो कॉल पर मदद")
                : measurements?.provideMethod?.includes("भेजूंगी") || measurements?.provideMethod === "send_clothes"
                ? t("Sending Stitched Sample Clothes", "सिले हुए कपड़े भेजेंगे")
                : measurements?.provideMethod?.includes("local") || measurements?.provideMethod === "local_tailor"
                ? t("From local tailor", "दर्जी से नाप करवाकर")
                : t("Self measurement", "खुद से नाप लेकर")}
            </span>
          </p>

          {filledMeasurementEntries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filledMeasurementEntries.map(([k, v]) => {
                const cfg = activeMeasurementFields.find((f) => f.key === k);
                const pointLabel = cfg
                  ? (lang === "hi" ? `#${cfg.num} ${cfg.hi}` : `#${cfg.num} ${cfg.en}`)
                  : k;
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#fdfbf9] border border-[#ebdcd0] text-[12px]"
                  >
                    <span className="text-stone-600 truncate mr-2" title={pointLabel}>
                      {pointLabel}:
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
              {measurements?.provideMethod?.includes("वीडियो कॉल") || measurements?.provideMethod === "video_call"
                ? t(
                    "📹 Master tailor will contact you shortly on WhatsApp to measure over video call.",
                    "📹 मास्टर दर्जी नाप के लिए वीडियो कॉल पर संपर्क करेंगे।"
                  )
                : measurements?.provideMethod?.includes("भेजूंगी") || measurements?.provideMethod === "send_clothes"
                ? t(
                    "📦 You will send your stitched sample clothes for measurement.",
                    "📦 आप नापने के लिए अपने सिले हुए कपड़े भेजेंगी।"
                  )
                : t(
                    "No manual measurements entered. Click 'Edit Measurements' to fill or request tailor assistance.",
                    "कोई नाप दर्ज नहीं किया गया है। नाप भरने के लिए 'नाप बदलें' पर क्लिक करें।"
                  )}
            </div>
          )}

          {measurements?.notes && (
            <p className="mt-2 text-[12px] text-stone-600 italic bg-[#faf7f2] p-2 rounded-lg border border-stone-200">
              <b>{t("Special Note:", "विशेष निर्देश:")}</b> "{measurements.notes}"
            </p>
          )}
        </div>
      </div>
    </section>
  );
}