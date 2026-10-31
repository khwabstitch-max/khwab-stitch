import React from "react";
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  Scissors,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Tag,
  Clock,
  Ruler,
  Check,
  User,
  Camera,
} from "lucide-react";

import {
  BRAND_CONFIG,
  DESIGN_CODE_MAP as DESIGN_CODE_CATALOG,
  OUTFIT_MAP as OUTFIT_CATALOG,
  FRONT_NECK_MAP as FRONT_NECK_CATALOG,
  BACK_NECK_MAP as BACK_NECK_CATALOG,
  SLEEVE_LENGTH_MAP as SLEEVE_LENGTH_CATALOG,
  SLEEVE_DESIGN_MAP as SLEEVE_DESIGN_CATALOG,
  resolveSleeveLength,
  resolveSleeveDesign,
  resolveFrontNeck,
  resolveBackNeck,
} from "../config/fashionCatalog.js";

const MEASURE_LABELS = {
  blouseLength: "Blouse Length / ब्लाउज़ लंबाई",
  kurtiLength: "Kurti Length / कुर्ती लंबाई",
  kameezLength: "Kameez Length / कमीज़ लंबाई",
  suitLength: "Suit Length / कमीज़ लंबाई",
  bust: "Around Bust / चेस्ट (छाती)",
  underBust: "Under Bust / छाती के नीचे",
  waist: "Around Waist / कमर",
  hip: "Around Hip / हिप (कूल्हा)",
  armhole: "Armhole / कांख",
  shoulder: "Shoulder Width / कंधा",
  sleeveLength: "Sleeve Length / बाज़ू लंबाई",
  bottomOpening: "Sleeve Bottom Opening / बाज़ू मोरी",
  sleeveBottom: "Sleeve Bottom (Mori) / बाज़ू मोरी",
  sideSlit: "Side Slit / साइड चाक",
  frontNeck: "Front Neck Depth / आगे गला गहराई",
  backNeck: "Back Neck Depth / पीछे गला गहराई",
};

// Safe lookup helper
function lookupItem(catalog, key, fallbackEn = "", fallbackHi = "", fallbackPhoto = "") {
  if (!key) return null;
  const k = String(key).trim().toLowerCase();
  if (catalog[key]) return catalog[key];
  if (catalog[k]) return catalog[k];
  for (const [id, item] of Object.entries(catalog)) {
    if (
      id.toLowerCase() === k ||
      item.en?.toLowerCase() === k ||
      item.hi?.toLowerCase() === k ||
      (item.code && item.code.toLowerCase() === k)
    ) {
      return item;
    }
  }
  return {
    en: fallbackEn || key,
    hi: fallbackHi || key,
    photo: fallbackPhoto,
  };
}

export default function OrderReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const receiptEl = document.getElementById("printable-receipt");
    if (!receiptEl) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Khwab Stitch Order Receipt #${order.orderId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap');
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #faf7f2;
      color: #2b2523;
      padding: 24px;
      margin: 0;
    }
    .receipt-box {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e8ddd0;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      position: relative;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ece2d6; padding: 8px 12px; font-size: 13px; text-align: left; }
    th { background: #faf5f0; color: #6b2d46; font-weight: bold; }
    .stylish-watermark {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      pointer-events: none;
      white-space: nowrap;
      z-index: 0;
    }
    @media print {
      body { background: white !important; padding: 0 !important; margin: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      .receipt-box { border: none !important; box-shadow: none !important; padding: 12px !important; }
      img { max-height: 220px !important; object-fit: contain !important; break-inside: avoid !important; }
    }
  </style>
</head>
<body>
  <div class="receipt-box">
    ${receiptEl.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Khwab-Stitch-Receipt-${order.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const deliveryAddress =
    order.delivery?.address ||
    order.customer?.address ||
    "Not specified";
  const landmark = order.delivery?.landmark || order.customer?.landmark || "";

  // Lookups for selected outfit and styling
  const outfitInfo = lookupItem(OUTFIT_CATALOG, order.outfit?.type, order.outfit?.type, "परिधान", "./images/outfits/02_kurti.jpg");
  const designCodeInfo = order.outfit?.designCode ? DESIGN_CODE_CATALOG[order.outfit.designCode] : null;

  const frontNeckInfo = resolveFrontNeck(order.design?.neckFront, order.design?.frontPhoto, order.outfit?.type);
  const backNeckInfo = resolveBackNeck(order.design?.neckBack, order.design?.backPhoto, order.outfit?.type);
  const sleeveLengthInfo = resolveSleeveLength(
    order.design?.sleeveLength,
    order.design?.sleeveLengthPhoto || order.design?.sleevePhoto || order.outfit?.uploadedPhoto,
    order.outfit?.type
  );
  const sleeveDesignInfo = resolveSleeveDesign(order.design?.sleeveDesign, order.design?.sleevePhoto, order.outfit?.type);

  return (
    <div className="order-receipt-overlay fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm p-3 md:p-6 overflow-y-auto flex items-start justify-center">
      <div
        id="printable-receipt-container"
        className="relative w-full max-w-[840px] bg-white rounded-[28px] shadow-2xl border border-stone-200 my-4 overflow-hidden"
      >
        {/* ACTION BAR (HIDDEN IN PRINT) */}
        <div className="no-print sticky top-0 z-20 flex items-center justify-between gap-3 p-4 bg-stone-900 text-white border-b border-stone-800 rounded-t-[28px]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-bold">
              ✓
            </span>
            <span className="font-bold text-[14px]">
              Order Slip (PDF) / ऑर्डर रसीद · #{order.orderId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-[12.5px] shadow-md transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Save as PDF / प्रिंट करें</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-[12px] transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>HTML Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors cursor-pointer ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT WITH ELEGANT REPEATING & CENTER WATERMARKS */}
        <div
          id="printable-receipt"
          className="relative p-6 sm:p-8 md:p-10 text-stone-800 bg-[#faf7f2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='360' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='40' y='120' transform='rotate(-28 180 120)' fill='%236b2d46' fill-opacity='0.08' font-family='Georgia, serif' font-size='22' font-weight='bold' letter-spacing='0.16em'%3EKHWAB STITCH%3C/text%3E%3Ctext x='40' y='148' transform='rotate(-28 180 120)' fill='%239c4d68' fill-opacity='0.06' font-family='sans-serif' font-size='10' font-weight='bold' letter-spacing='0.22em'%3EBESPOKE ATELIER%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        >
          {/* ROYAL CENTERPIECE WATERMARK SEAL */}
          <div
            aria-hidden="true"
            className="stylish-watermark pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0"
            style={{ opacity: 0.11 }}
          >
            <div className="text-center transform -rotate-[30deg]">
              <div className="inline-block border-y-4 border-[var(--primary)] py-4 px-8">
                <div className="font-serif text-[65px] sm:text-[95px] font-extrabold tracking-[0.18em] text-[var(--primary)] uppercase whitespace-nowrap leading-none">
                  Khwab Stitch
                </div>
                <div className="text-[13px] sm:text-[18px] font-bold tracking-[0.35em] text-[var(--secondary)] uppercase mt-2">
                  Where Fabric Becomes Art · Bespoke Atelier
                </div>
              </div>
            </div>
          </div>

          {/* ALL CONTENT POSITIONED ABOVE WATERMARK */}
          <div className="relative z-10 space-y-6">

            {/* ================================================================= */}
            {/* SECTION 1: LOGO & ATELIER BRANDING (हमारा लोगो वाला) */}
            {/* ================================================================= */}
            <div className="receipt-section-block flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#ebdcd0] bg-white/95 p-4 sm:p-5 rounded-2xl border border-[#ebdcd0] shadow-2xs">
              <div className="flex items-center gap-3.5">
                <img
                  src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
                  alt="Khwab Stitch Logo"
                  className="h-16 w-16 rounded-full object-cover border-2 border-[var(--primary)] shadow-sm flex-shrink-0"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "./images/khwabstitch_logo.jpg";
                  }}
                />
                <div>
                  <h1 className="font-serif text-[25px] sm:text-[28px] font-bold text-[var(--primary-dark)] m-0 leading-tight">
                    Khwab Stitch
                  </h1>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)] mt-0.5">
                    Custom Stitching · Your Style · Our Stitches / हमारी कारीगरी
                  </p>
                </div>
              </div>

              <div className="sm:text-right flex flex-col sm:items-end">
                <span className="inline-block rounded-full bg-[#fbf0f4] text-[var(--primary)] px-3 py-1 font-bold text-[12px] border border-[#f0d5df]">
                  Order Slip (PDF) / ऑर्डर रसीद
                </span>
                <div className="font-mono text-[18px] font-bold text-stone-900 mt-1.5">
                  #{order.orderId}
                </div>
                <div className="flex items-center sm:justify-end gap-1.5 text-[11.5px] text-stone-500 mt-0.5">
                  <Calendar size={12} />
                  <span>{new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* SECTION 2: DETAIL ABOUT CUSTOMER & ADDRESS (ग्राहक की जानकारी) */}
            {/* ================================================================= */}
            <div className="receipt-section-block p-4 sm:p-5 rounded-2xl bg-white/95 border border-[#ebdcd0] shadow-2xs">
              <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] pb-2 border-b border-[#f0e4d8] mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User size={15} className="text-[var(--primary)]" />
                  <span>Customer Details & Address / ग्राहक विवरण व डिलीवरी पता</span>
                </span>
                <span className="text-[11px] font-bold text-[var(--secondary)] bg-[#faf4ef] px-2.5 py-0.5 rounded-full border border-[#ebdcd0]">
                  Section 2 of 3
                </span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="space-y-1">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    Personal Information / व्यक्तिगत जानकारी
                  </p>
                  <p className="text-[15px] font-bold text-stone-900">{order.customer?.name || "Customer"}</p>
                  <p className="text-[13px] text-stone-700 flex items-center gap-1.5 pt-0.5 font-semibold">
                    <Phone size={13} className="text-emerald-700" />
                    <span>+91 {order.customer?.whatsapp ? order.customer.whatsapp.replace(/\D/g, "").slice(-10) : ""}</span>
                  </p>
                  {order.customer?.email && (
                    <p className="text-[12.5px] text-stone-600 flex items-center gap-1.5">
                      <Mail size={13} className="text-stone-400" />
                      <span>{order.customer.email}</span>
                    </p>
                  )}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                      Payment Mode: <b>{order.delivery?.paymentMode || "Cash on Delivery / डिलीवरी पर भुगतान"}</b>
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    Delivery Destination / डिलीवरी पता
                  </p>
                  <p className="text-[13px] text-stone-800 leading-snug font-medium">
                    {deliveryAddress}
                  </p>
                  {landmark && (
                    <p className="text-[12px] text-stone-600">
                      <b>Landmark:</b> {landmark}
                    </p>
                  )}
                  <p className="text-[12.5px] font-bold text-stone-800">
                    {order.customer?.cityState || `${order.customer?.city || ""}, ${order.customer?.state || ""}`} — <b>PIN: {order.customer?.pin}</b>
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      <Clock size={12} />
                      <span>{order.delivery?.deliveryType || "Standard Delivery · 7-10 Days"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* SECTION 3: STITCHING DETAIL (सिलाई विवरण व स्टाइलिंग) */}
            {/* ================================================================= */}
            <div className="receipt-section-block p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-[#ebdcd0] shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0e4d8]">
                <div className="flex items-center gap-2">
                  <Scissors size={16} className="text-[var(--primary)]" />
                  <h3 className="font-serif text-[15px] font-bold text-[var(--primary-dark)] m-0">
                    Stitching & Design Specifications / सिलाई व डिज़ाइन विवरण
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[var(--primary)] bg-[#fbf0f4] px-2.5 py-0.5 rounded-full border border-[#f0d5df]">
                  Section 3 of 3
                </span>
              </div>

              {/* 1. SELECTED OUTFIT BANNER (NAME ONLY AS REQUESTED) */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#faf5f0] border border-[#ebdcd0]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[14px]">
                    👗
                  </span>
                  <div>
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      Selected Outfit / चुना गया परिधान
                    </span>
                    <span className="text-[16px] font-serif font-bold text-[var(--primary-dark)]">
                      {order.outfit?.type || "Custom Outfit"} ({outfitInfo?.hi || "सिलाई परिधान"})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white text-[var(--primary)] font-bold text-[12px] border border-[#dfc5b5] shadow-2xs">
                    Quantity: <b>{order.outfit?.pieces || 1} Piece(s) / पीस</b>
                  </span>
                </div>
              </div>

              {/* 2. DESIGN CODE (IF SELECTED BY CUSTOMER - SHOWS CODE + PHOTO) */}
              {order.outfit?.designCode && (
                <div className="rounded-xl border-2 border-[var(--primary)]/30 bg-[#fdf8f9] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-2xs">
                  <div className="relative shrink-0 w-28 h-28 rounded-lg overflow-hidden border border-[#dfc5b5] bg-white shadow-xs">
                    <img
                      src={designCodeInfo?.image || `./images/design_codes/${order.outfit.designCode}.jpg`}
                      alt={`Design Code ${order.outfit.designCode}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[var(--primary)] text-white text-[10px] font-mono font-bold">
                      {order.outfit.designCode}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-white text-[11px] font-mono font-bold">
                        Design Code: {order.outfit.designCode}
                      </span>
                      {designCodeInfo?.tag && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          {designCodeInfo.tag}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)]">
                      {designCodeInfo?.name || `Design ${order.outfit.designCode}`}
                    </h4>
                    <p className="text-[12px] font-semibold text-[var(--secondary)]">
                      {designCodeInfo?.hi || "कैटलॉग डिज़ाइन"}
                    </p>
                    {designCodeInfo?.details && (
                      <p className="text-[11.5px] text-stone-600 bg-white p-2 rounded-lg border border-[#ece2d6] leading-relaxed">
                        <b>Design Features / खासियत:</b> {designCodeInfo.details}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 3. CUSTOMER REFERENCE PHOTO (IF ATTACHED - PROMINENT DISPLAY) */}
              {order.outfit?.uploadedPhoto && (
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/50 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-2xs">
                  <div className="relative shrink-0 max-w-[160px] w-full rounded-lg overflow-hidden border border-emerald-300 bg-white shadow-xs">
                    <img
                      src={order.outfit.uploadedPhoto}
                      alt="Customer Reference Design"
                      className="w-full h-auto max-h-[160px] object-contain mx-auto"
                      loading="eager"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-bold">
                      📸 Customer Reference Photo / ग्राहक द्वारा अपलोड की गई फ़ोटो
                    </span>
                    <p className="text-[13px] font-bold text-stone-900 pt-0.5">
                      File: {order.outfit.uploadedPhotoName || "reference-photo.jpg"}
                    </p>
                    {order.outfit.uploadedPhotoSize && (
                      <p className="text-[11.5px] text-stone-600">
                        Size: {order.outfit.uploadedPhotoSize}
                      </p>
                    )}
                    <p className="text-[12px] text-emerald-900 bg-white p-2 rounded-lg border border-emerald-200 italic">
                      कारीगर इस फ़ोटो के अनुसार परिधान का डिज़ाइन, कटिंग और सिलाई तैयार करेंगे।
                    </p>
                  </div>
                </div>
              )}

              {/* REFERENCE PHOTO NOTE (IF TEXT INSTEAD OF UPLOAD) */}
              {order.outfit?.refPhoto && !order.outfit?.uploadedPhoto && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] flex items-center gap-2">
                  <span>📸</span>
                  <span><b>Reference Choice / रेफ़रेंस:</b> {order.outfit.refPhoto}</span>
                </div>
              )}

              {/* 4. STYLING SPECIFICATIONS (4 BLUEPRINT CARDS WITH REAL PHOTOS) */}
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
                  ✂️ Necklines & Sleeves Blueprint / गले व बाज़ू का चुना गया स्टाइल
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* FRONT NECK */}
                  <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                        Front Neck / आगे गला
                      </p>
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                        <img
                          src={frontNeckInfo.photo}
                          alt={frontNeckInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-stone-900 leading-tight">
                        {frontNeckInfo.en}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                        {order.design?.neckFront === "as-photo" && order.design?.frontPhoto
                          ? "✓ कस्टम फ़ोटो अनुसार"
                          : frontNeckInfo.hiScript || frontNeckInfo.hi}
                      </p>
                    </div>
                  </div>

                  {/* BACK NECK */}
                  <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                        Back Neck / पीछे गला
                      </p>
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                        <img
                          src={backNeckInfo.photo}
                          alt={backNeckInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-stone-900 leading-tight">
                        {backNeckInfo.en}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                        {order.design?.neckBack === "as-photo" && order.design?.backPhoto
                          ? "✓ कस्टम फ़ोटो अनुसार"
                          : backNeckInfo.hiScript || backNeckInfo.hi}
                      </p>
                    </div>
                  </div>

                  {/* SLEEVE LENGTH */}
                  <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                        Sleeve Length / बाज़ू लंबाई
                      </p>
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                        <img
                          src={sleeveLengthInfo.photo}
                          alt={sleeveLengthInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-stone-900 leading-tight">
                        {sleeveLengthInfo.en}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                        {sleeveLengthInfo.hiScript || sleeveLengthInfo.hi}
                      </p>
                      <p className="text-[10px] text-stone-600 mt-0.5 font-mono font-bold">
                        Length: {sleeveLengthInfo.cm || sleeveLengthInfo.length}
                      </p>
                    </div>
                  </div>

                  {/* SLEEVE DESIGN */}
                  <div className="rounded-xl border border-[#ebdcd0] bg-white p-2.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                        Sleeve Style / बाज़ू स्टाइल
                      </p>
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#faf7f2] border border-stone-200 mb-2">
                        <img
                          src={sleeveDesignInfo.photo}
                          alt={sleeveDesignInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-stone-900 leading-tight">
                        {sleeveDesignInfo.en}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                        {order.design?.sleeveDesign === "as-photo" && order.design?.sleevePhoto
                          ? "✓ कस्टम फ़ोटो अनुसार"
                          : sleeveDesignInfo.hiScript || sleeveDesignInfo.hi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fitting Preference & Tailor Notes */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-stone-200 text-[12px] shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-700">Fitting Preference / फिटिंग:</span>
                    <span className="font-bold text-[var(--primary)] bg-stone-50 px-2.5 py-0.5 rounded-md border border-stone-200">
                      {order.design?.fit || "Regular"} Fit
                    </span>
                  </div>
                  {order.design?.additionalInstructions && (
                    <div className="text-stone-600">
                      <b>Tailor Instructions / विशेष निर्देश:</b> {order.design.additionalInstructions}
                    </div>
                  )}
                  {order.outfit?.specialReq && (
                    <div className="text-stone-600">
                      <b>Special Request:</b> {order.outfit.specialReq}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. MEASUREMENTS TABLE */}
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-[#f0e4d8] mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-[var(--primary)]" />
                    <h4 className="font-serif text-[13.5px] font-bold text-[var(--primary-dark)] m-0">
                      Measurements / शारीरिक नाप ({order.measurements?.unit || "inch"})
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md">
                    {order.measurements?.provideMethod || "Self Measurement / खुद से नाप"}
                  </span>
                </div>

                {order.measurements?.values && Object.keys(order.measurements.values).length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-[#ece2d6] bg-white shadow-2xs">
                    <table className="w-full text-left text-[12.5px] border-collapse">
                      <thead>
                        <tr className="bg-[#faf5f0] text-[var(--primary-dark)] border-b border-[#ece2d6]">
                          <th className="py-2 px-3 font-bold">Measurement Parameter / नाप का भाग</th>
                          <th className="py-2 px-3 font-bold text-right">Value / माप ({order.measurements.unit?.toUpperCase() || "INCH"})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(order.measurements.values).map(([key, val], idx) => {
                          if (!val) return null;
                          const label = MEASURE_LABELS[key] || key.replace(/([A-Z])/g, " $1");
                          return (
                            <tr
                              key={key}
                              className={`border-b border-[#f2eae2] ${idx % 2 === 0 ? "bg-white" : "bg-[#fdfbf9]"}`}
                            >
                              <td className="py-2 px-3 font-medium text-stone-800">
                                {label}
                              </td>
                              <td className="py-2 px-3 text-right font-bold font-mono text-stone-900">
                                {val} {order.measurements.unit || "inch"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (order.measurements?.provideMethod?.includes("भेजूंगी") || order.measurements?.provideMethod?.includes("सिले")) ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-[13px]">
                      <span>📦</span>
                      <span>Sending Stitched Sample Clothes / मैं अपने सिले हुए कपड़े नापने के लिए भेजूंगी</span>
                    </div>
                    <p className="text-[12px] mt-1 text-amber-800">
                      Customer will send their stitched sample garment for size measurement. / ग्राहक नाप के लिए अपने सिले हुए कपड़े भेजेंगी।
                    </p>
                  </div>
                ) : order.measurements?.provideMethod?.includes("वीडियो कॉल") ? (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-[13px]">
                      <span>📹</span>
                      <span>Measurements on Video Call / वीडियो कॉल द्वारा नाप</span>
                    </div>
                    <p className="text-[12px] mt-1 text-blue-800">
                      Master tailor will contact customer to take all measurements live on video call. / मास्टर दर्जी जल्दी ही वीडियो कॉल पर नाप लेंगे।
                    </p>
                  </div>
                ) : (
                  <p className="text-[12px] text-stone-500 italic p-3 bg-white rounded-lg border border-stone-200">
                    No individual measurements recorded / कोई अलग से नाप दर्ज नहीं है।
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="receipt-section-block pt-4 border-t-2 border-[#ebdcd0] text-center text-[12px] text-stone-500 bg-white/90 p-4 rounded-2xl border border-[#ebdcd0]">
              <p className="font-serif font-bold text-[var(--primary)] text-[13.5px]">
                Thank you for choosing Khwab Stitch! / ख़्वाब स्टिच चुनने के लिए धन्यवाद!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
