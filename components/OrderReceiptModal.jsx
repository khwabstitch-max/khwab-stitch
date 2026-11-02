import React, { useState } from "react";
import {
  Printer,
  Download,
  X,
  Scissors,
  Phone,
  Mail,
  Calendar,
  Clock,
  Ruler,
  User,
  Check,
  MapPin,
  Sparkles,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Instagram,
} from "lucide-react";

import {
  BRAND_CONFIG,
  DESIGN_CODE_MAP as DESIGN_CODE_CATALOG,
  OUTFIT_MAP as OUTFIT_CATALOG,
  resolveSleeveLength,
  resolveSleeveDesign,
  resolveFrontNeck,
  resolveBackNeck,
  resolveFabric,
} from "../config/fashionCatalog.js";

const MEASURE_LABELS = {
  blouseLength: { en: "Blouse Length", hi: "ब्लाउज़ लंबाई" },
  kurtiLength: { en: "Kurti Length", hi: "कुर्ती लंबाई" },
  kameezLength: { en: "Kameez / Suit Length", hi: "कमीज़ लंबाई" },
  suitLength: { en: "Suit Length", hi: "सूट लंबाई" },
  bust: { en: "Around Bust (Chest)", hi: "चेस्ट (छाती का नाप)" },
  underBust: { en: "Under Bust", hi: "छाती के नीचे का नाप" },
  waist: { en: "Around Waist", hi: "कमर का नाप" },
  hip: { en: "Around Hip", hi: "हिप (कूल्हे का नाप)" },
  armhole: { en: "Armhole Round", hi: "कांख (आर्महोल का घेरा)" },
  shoulder: { en: "Shoulder Width", hi: "कंधे की चौड़ाई" },
  sleeveLength: { en: "Sleeve Length", hi: "बाज़ू की लंबाई" },
  bottomOpening: { en: "Sleeve Bottom Opening (Mori)", hi: "बाज़ू मोरी" },
  sleeveBottom: { en: "Sleeve Bottom (Mori)", hi: "बाज़ू मोरी" },
  sideSlit: { en: "Side Slit / Chak Opening", hi: "साइड चाक (कट)" },
  frontNeck: { en: "Front Neck Depth", hi: "आगे गला गहराई" },
  backNeck: { en: "Back Neck Depth", hi: "पीछे गला गहराई" },
  bustPoint: { en: "Bust Apex / Dart Point", hi: "बस्ट पॉइंट (टक्स बिंदु)" },
  crossBack: { en: "Cross Back Width", hi: "पीछे कंधे का फैलाव" },
  bottomLength: { en: "Bottom / Pant Length", hi: "सलवार/पैंट लंबाई" },
  thigh: { en: "Thigh Round", hi: "जांघ का घेरा" },
  knee: { en: "Knee Round", hi: "घुटने का घेरा" },
  calf: { en: "Calf Round", hi: "पिंडली का घेरा" },
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

  // Dynamic language state (defaults to order submission language, toggleable)
  const [receiptLang, setReceiptLang] = useState(order.language || "en");
  const tr = (en, hi) => (receiptLang === "hi" ? (hi || en) : (en || hi));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const receiptEl = document.getElementById("printable-receipt");
    if (!receiptEl) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="${receiptLang}">
<head>
  <meta charset="UTF-8">
  <title>Khwab Stitch Order Receipt #${order.orderId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
    * { box-sizing: border-box; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #faf7f2;
      color: #201b19;
      font-size: 14.5px;
      line-height: 1.5;
      padding: 24px;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    .receipt-box {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #ecdcd0;
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 16px 40px rgba(90, 32, 45, 0.08);
      position: relative;
    }
    h1, h2, h3, h4 { font-family: 'Playfair Display', Georgia, serif; color: #5a1426; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1.5px solid #dfcdbf; padding: 10px 14px; font-size: 14px; text-align: left; }
    th { background: #fbf2ec; color: #5a1426; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    @media print {
      body { background: white !important; padding: 0 !important; margin: 0 !important; font-size: 13.5px !important; }
      .no-print { display: none !important; }
      .receipt-box { border: none !important; box-shadow: none !important; padding: 10px !important; max-width: 100% !important; }
      img { max-height: 190px !important; object-fit: contain !important; break-inside: avoid !important; }
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
    tr("Not specified", "दर्ज नहीं किया गया");
  const landmark = order.delivery?.landmark || order.customer?.landmark || "";

  // Lookups for selected outfit and styling
  const fabricInfo = resolveFabric(order.outfit?.fabricType);
  const outfitInfo = lookupItem(OUTFIT_CATALOG, order.outfit?.type, order.outfit?.type, "परिधान", "./images/outfits/02_kurti.jpg");
  const designCodeInfo = order.outfit?.designCode ? DESIGN_CODE_CATALOG[order.outfit.designCode] : null;

  const frontNeckInfo = resolveFrontNeck(order.design?.neckFront, order.design?.frontPhoto, order.outfit?.type);
  const backNeckInfo = resolveBackNeck(order.design?.neckBack, order.design?.backPhoto, order.outfit?.type);
  const sleeveLengthInfo = resolveSleeveLength(
    order.design?.sleeveLength,
    order.design?.sleeveLengthPhoto,
    order.outfit?.type
  );
  const sleeveDesignInfo = resolveSleeveDesign(order.design?.sleeveDesign, order.design?.sleevePhoto, order.outfit?.type);

  return (
    <div className="order-receipt-overlay fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-y-auto flex items-start justify-center">
      <div
        id="printable-receipt-container"
        className="relative w-full max-w-[880px] bg-white rounded-[22px] sm:rounded-[28px] shadow-2xl border border-stone-200 my-2 sm:my-4 overflow-hidden"
      >
        {/* ACTION BAR (HIDDEN IN PRINT) */}
        <div className="no-print sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-4 bg-stone-900 text-white border-b border-stone-800 rounded-t-[20px] sm:rounded-t-[28px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-bold shrink-0">
              ✓
            </span>
            <span className="font-bold text-[13.5px] sm:text-[15px] truncate">
              {tr(`Order Slip (PDF) · #${order.orderId}`, `ऑर्डर रसीद · #${order.orderId}`)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Inside Modal */}
            <div
              className="inline-flex items-center rounded-full bg-stone-800 p-0.5 border border-stone-700 text-[11px] font-bold"
              role="group"
              aria-label="Receipt Language"
            >
              <button
                type="button"
                onClick={() => setReceiptLang("en")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  receiptLang === "en"
                    ? "bg-[var(--primary)] text-white shadow-xs font-extrabold"
                    : "text-stone-300 hover:text-white"
                }`}
                title="View receipt in English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setReceiptLang("hi")}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  receiptLang === "hi"
                    ? "bg-[var(--primary)] text-white shadow-xs font-extrabold"
                    : "text-stone-300 hover:text-white"
                }`}
                title="रसीद हिंदी में देखें"
              >
                हिंदी
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-[12px] sm:text-[13px] shadow-md transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>{tr("Save as PDF", "प्रिंट / सेव PDF")}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-[11.5px] sm:text-[12px] transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">{tr("HTML Slip", "HTML रसीद")}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors cursor-pointer ml-1 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div
          id="printable-receipt"
          className="relative p-5 sm:p-8 md:p-10 text-stone-900 bg-[#ffffff]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='360' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='40' y='120' transform='rotate(-28 180 120)' fill='%236b2d46' fill-opacity='0.04' font-family='Georgia, serif' font-size='22' font-weight='bold' letter-spacing='0.16em'%3EKHWAB STITCH%3C/text%3E%3Ctext x='40' y='148' transform='rotate(-28 180 120)' fill='%239c4d68' fill-opacity='0.03' font-family='sans-serif' font-size='10' font-weight='bold' letter-spacing='0.22em'%3EBESPOKE ATELIER%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        >
          {/* ROYAL CENTERPIECE WATERMARK SEAL */}
          <div
            aria-hidden="true"
            className="stylish-watermark pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0"
            style={{ opacity: 0.05 }}
          >
            <div className="text-center transform -rotate-[28deg]">
              <div className="inline-block border-y-4 border-[var(--primary)] py-5 px-10">
                <div className="font-serif text-[75px] sm:text-[105px] font-extrabold tracking-[0.18em] text-[var(--primary)] uppercase whitespace-nowrap leading-none">
                  Khwab Stitch
                </div>
                <div className="text-[15px] sm:text-[20px] font-bold tracking-[0.35em] text-[var(--secondary)] uppercase mt-2">
                  {tr("Where Fabric Becomes Art · Bespoke Atelier", "हमारी कारीगरी · ख़्वाब स्टिच")}
                </div>
              </div>
            </div>
          </div>

          {/* ALL CONTENT POSITIONED ABOVE WATERMARK */}
          <div className="relative z-10 space-y-6">
            {/* SECTION 1: LOGO & ATELIER BRANDING */}
            <div className="receipt-section-block flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#ecdcd0] bg-[#faf6f2] p-4 sm:p-6 rounded-2xl border-2 border-[#ebdcd0] shadow-2xs">
              <div className="flex items-center gap-4">
                <img
                  src={BRAND_CONFIG?.logo || "./images/brand/logo.jpg"}
                  alt="Khwab Stitch Logo"
                  className="h-18 w-18 sm:h-20 sm:w-20 rounded-full object-cover border-3 border-[var(--primary)] shadow-md flex-shrink-0"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "./images/khwabstitch_logo.jpg";
                  }}
                />
                <div>
                  <h1 className="font-serif text-[28px] sm:text-[32px] font-extrabold text-[var(--primary-dark)] m-0 leading-tight">
                    Khwab Stitch
                  </h1>
                  <p className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-widest text-[var(--secondary)] mt-1">
                    {tr("Where Fabric Becomes Art · Bespoke Atelier", "हमारी कारीगरी · ख़्वाब स्टिच")}
                  </p>
                  <p className="text-[12.5px] text-stone-600 mt-1 font-medium">
                    {tr("Bespoke Custom Tailoring & Designer Studio", "कस्टम सिलाई व डिज़ाइनर बुटीक")}
                  </p>
                </div>
              </div>

              <div className="sm:text-right flex flex-col sm:items-end">
                <span className="inline-block rounded-full bg-[var(--primary)] text-white px-3.5 py-1 font-extrabold text-[12.5px] shadow-2xs">
                  {tr("OFFICIAL ORDER SLIP", "अधिकृत ऑर्डर रसीद")}
                </span>
                <div className="font-mono text-[22px] sm:text-[24px] font-extrabold text-stone-950 mt-1.5 tracking-tight">
                  #{order.orderId}
                </div>
                <div className="flex items-center sm:justify-end gap-1.5 text-[12.5px] font-semibold text-stone-700 mt-1">
                  <Calendar size={13} className="text-[var(--primary)]" />
                  <span>{new Date(order.createdAt || Date.now()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[11px] font-extrabold">
                    <ShieldCheck size={12} />
                    <span>{tr("VERIFIED ATELIER ORDER", "सत्यापित ऑर्डर")}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: CUSTOMER PROFILE & DELIVERY ADDRESS */}
            <div className="receipt-section-block p-4 sm:p-6 rounded-2xl bg-[#faf6f2] border-2 border-[#ebdcd0] shadow-2xs">
              <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-[var(--primary-dark)] pb-2.5 border-b border-[#ebdcd0] mb-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User size={18} className="text-[var(--primary)]" />
                  <span>{tr("Customer Profile & Delivery Address", "ग्राहक विवरण व डिलीवरी पता")}</span>
                </span>
                <span className="text-[12px] font-bold text-[var(--secondary)] bg-white px-3 py-0.5 rounded-full border border-[#ebdcd0]">
                  {tr("Section 1 of 2", "भाग 1")}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Personal Information */}
                <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#ebdcd0]">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-stone-500">
                    {tr("Personal Information", "व्यक्तिगत जानकारी")}
                  </p>
                  <p className="text-[17px] sm:text-[18px] font-serif font-bold text-stone-950">
                    {order.customer?.name || tr("Customer", "ग्राहक")}
                  </p>
                  <p className="text-[15px] font-mono text-stone-950 flex items-center gap-2 font-bold pt-1">
                    <Phone size={15} className="text-emerald-700 shrink-0" />
                    <span>+91 {order.customer?.whatsapp ? order.customer.whatsapp.replace(/\D/g, "").slice(-10) : ""}</span>
                    <span className="text-[11px] font-sans font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      WhatsApp
                    </span>
                  </p>
                  {order.customer?.email && (
                    <p className="text-[13.5px] text-stone-700 flex items-center gap-2 pt-0.5">
                      <Mail size={14} className="text-stone-400 shrink-0" />
                      <span>{order.customer.email}</span>
                    </p>
                  )}
                  
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#ebdcd0]">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-stone-500">
                    {tr("Delivery Destination", "डिलीवरी पता")}
                  </p>
                  <p className="text-[14.5px] text-stone-900 leading-snug font-semibold">
                    {deliveryAddress}
                  </p>
                  {landmark && (
                    <p className="text-[13px] text-stone-700">
                      <b className="text-stone-900">{tr("Landmark:", "लैंडमार्क:")}</b> {landmark}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[14px] font-bold text-stone-900">
                      {order.customer?.cityState || `${order.customer?.city || ""}, ${order.customer?.state || ""}`}
                    </span>
                    <span className="font-mono text-[13px] font-extrabold bg-[#fbf0f4] text-[var(--primary)] px-2.5 py-0.5 rounded-md border border-[#f0d5df]">
                      PIN: {order.customer?.pin}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-[12px] font-bold text-emerald-900">
                      <Clock size={13} />
                      <span>{tr("Standard Delivery · 7–10 Days", "मानक डिलीवरी · 7-10 दिन")}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: STITCHING DETAIL */}
            <div className="receipt-section-block p-4 sm:p-6 rounded-2xl bg-white border-2 border-[#ebdcd0] shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#ecdcd0]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[13px] font-bold">
                    <Scissors size={15} />
                  </span>
                  <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[var(--primary-dark)] m-0">
                    {tr("Stitching & Garment Specifications", "सिलाई व परिधान का संपूर्ण विवरण")}
                  </h3>
                </div>
                <span className="text-[12px] font-bold text-[var(--primary)] bg-[#fbf0f4] px-3 py-0.5 rounded-full border border-[#f0d5df]">
                  {tr("Section 2 of 2", "भाग 2")}
                </span>
              </div>

              {/* 1. SELECTED OUTFIT BANNER */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#faf5f0] border-2 border-[#ebdcd0]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white text-[18px] shadow-2xs">
                    👗
                  </span>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      {tr("Selected Outfit", "चुना गया परिधान")}
                    </span>
                    <span className="text-[20px] sm:text-[22px] font-serif font-extrabold text-[var(--primary-dark)]">
                      {receiptLang === "hi"
                        ? (outfitInfo?.hi || order.outfit?.type || "कस्टम परिधान")
                        : (outfitInfo?.en || order.outfit?.type || "Custom Outfit")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-[var(--primary)] font-extrabold text-[13.5px] border border-[#dfc5b5] shadow-2xs">
                    {tr(`Quantity: ${order.outfit?.pieces || 1} Piece(s)`, `संख्या: ${order.outfit?.pieces || 1} थान / पीस`)}
                  </span>
                </div>
              </div>

              {/* FABRIC & MATERIAL SPECIFICATION */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#fdfbf9] border border-[#ebdcd0]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[15px] font-bold shrink-0">
                    {fabricInfo?.icon || "🧵"}
                  </span>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      {tr("Fabric & Cloth Material", "कपड़ा व फ़ैब्रिक")}
                    </span>
                    <span className="text-[15px] font-bold text-stone-950">
                      {receiptLang === "hi" ? fabricInfo?.nameHi : fabricInfo?.name}
                    </span>
                    {order.outfit?.fabricColor && (
                      <span className="text-[13px] text-stone-700 block mt-0.5">
                        <b className="text-stone-900">{tr("Color / Texture Details:", "रंग व विवरण:")}</b> {order.outfit.fabricColor}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11.5px] font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-950 border border-amber-300">
                  {fabricInfo?.tag}
                </span>
              </div>

              {/* 2. DESIGN CODE (IF SELECTED) */}
              {order.outfit?.designCode && (
                <div className="rounded-xl border-2 border-[var(--primary)]/30 bg-[#fdf8f9] p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-2xs">
                  <div className="relative shrink-0 w-28 h-28 rounded-xl overflow-hidden border-2 border-[#dfc5b5] bg-white shadow-xs">
                    <img
                      src={designCodeInfo?.image || `./images/design_codes/${order.outfit.designCode}.jpg`}
                      alt={`Design Code ${order.outfit.designCode}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute top-1 left-1 px-2 py-0.5 rounded bg-[var(--primary)] text-white text-[11px] font-mono font-bold">
                      {order.outfit.designCode}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-[var(--primary)] text-white text-[12px] font-mono font-bold">
                        {tr(`Design Code: ${order.outfit.designCode}`, `डिज़ाइन कोड: ${order.outfit.designCode}`)}
                      </span>
                    </div>
                    <h4 className="font-serif text-[17px] font-bold text-[var(--primary-dark)]">
                      {receiptLang === "hi" && designCodeInfo?.hi
                        ? designCodeInfo.hi
                        : (designCodeInfo?.name || `Design ${order.outfit.designCode}`)}
                    </h4>
                    {designCodeInfo?.details && (
                      <p className="text-[13px] text-stone-700 bg-white p-2.5 rounded-lg border border-[#ece2d6] leading-relaxed">
                        <b className="text-stone-900">{tr("Design Details:", "डिज़ाइन विवरण:")}</b> {designCodeInfo.details}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 3. CUSTOMER REFERENCE PHOTO (IF ATTACHED) */}
              {order.outfit?.uploadedPhoto && (
                <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50/50 p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-2xs">
                  <div className="relative shrink-0 max-w-[180px] w-full rounded-xl overflow-hidden border-2 border-emerald-300 bg-white shadow-xs">
                    <img
                      src={order.outfit.uploadedPhoto}
                      alt="Customer Reference Design"
                      className="w-full h-auto max-h-[180px] object-contain mx-auto"
                      loading="eager"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-700 text-white text-[12px] font-bold">
                      {tr("📸 Customer Reference Photo", "📸 ग्राहक द्वारा अपलोड की गई डिज़ाइन फ़ोटो")}
                    </span>
                    <p className="text-[14.5px] font-bold text-stone-950 pt-1">
                      {order.outfit.uploadedPhotoName || tr("Reference Photo Attached", "डिज़ाइन फ़ोटो संलग्न")}
                    </p>
                    {order.outfit.uploadedPhotoSize && (
                      <p className="text-[12.5px] font-medium text-stone-600">
                        File Size: {order.outfit.uploadedPhotoSize}
                      </p>
                    )}
                    <p className="text-[13px] text-emerald-950 bg-white p-2.5 rounded-lg border border-emerald-200 italic leading-relaxed">
                      {tr(
                        "Master tailors will handcraft your garment according to this photo.",
                        "कारीगर इस फ़ोटो के अनुसार परिधान का डिज़ाइन, कटिंग और सिलाई तैयार करेंगे।"
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* 4. STYLING SPECIFICATIONS BLUEPRINT */}
              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-wider text-stone-600 mb-3">
                  {tr("✂️ Necklines & Sleeves Blueprint", "✂️ गले व बाज़ू का चुना गया स्टाइल")}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {/* FRONT NECK */}
                  <div className="rounded-xl border-2 border-[#ebdcd0] bg-[#faf7f2] p-3 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">
                        {tr("Front Neck", "आगे गला")}
                      </p>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-stone-200 mb-2">
                        <img
                          src={frontNeckInfo.photo}
                          alt={frontNeckInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-stone-950 leading-tight">
                        {receiptLang === "hi"
                          ? (order.design?.neckFront === "as-photo" && order.design?.frontPhoto
                              ? "✓ कस्टम फ़ोटो अनुसार"
                              : frontNeckInfo.hiScript || frontNeckInfo.hi)
                          : (order.design?.neckFront === "as-photo"
                              ? "✓ As per Photo"
                              : frontNeckInfo.en)}
                      </p>
                    </div>
                  </div>

                  {/* BACK NECK */}
                  <div className="rounded-xl border-2 border-[#ebdcd0] bg-[#faf7f2] p-3 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">
                        {tr("Back Neck", "पीछे गला")}
                      </p>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-stone-200 mb-2">
                        <img
                          src={backNeckInfo.photo}
                          alt={backNeckInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-stone-950 leading-tight">
                        {receiptLang === "hi"
                          ? (order.design?.neckBack === "as-photo" && order.design?.backPhoto
                              ? "✓ कस्टम फ़ोटो अनुसार"
                              : backNeckInfo.hiScript || backNeckInfo.hi)
                          : (order.design?.neckBack === "as-photo"
                              ? "✓ As per Photo"
                              : backNeckInfo.en)}
                      </p>
                    </div>
                  </div>

                  {/* SLEEVE LENGTH */}
                  <div className="rounded-xl border-2 border-[#ebdcd0] bg-[#faf7f2] p-3 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">
                        {tr("Sleeve Length", "बाज़ू लंबाई")}
                      </p>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-stone-200 mb-2">
                        <img
                          src={sleeveLengthInfo.photo}
                          alt={sleeveLengthInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-stone-950 leading-tight">
                        {receiptLang === "hi"
                          ? (sleeveLengthInfo.hiScript || sleeveLengthInfo.hi)
                          : sleeveLengthInfo.en}
                      </p>
                      <p className="text-[12px] text-stone-700 mt-0.5 font-mono font-bold">
                        {tr(
                          `Length: ${sleeveLengthInfo.cm || sleeveLengthInfo.length}`,
                          `लंबाई: ${sleeveLengthInfo.cm || sleeveLengthInfo.length}`
                        )}
                      </p>
                    </div>
                  </div>

                  {/* SLEEVE DESIGN */}
                  <div className="rounded-xl border-2 border-[#ebdcd0] bg-[#faf7f2] p-3 flex flex-col justify-between shadow-2xs">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">
                        {tr("Sleeve Style", "बाज़ू स्टाइल")}
                      </p>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-stone-200 mb-2">
                        <img
                          src={sleeveDesignInfo.photo}
                          alt={sleeveDesignInfo.en}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-stone-950 leading-tight">
                        {receiptLang === "hi"
                          ? (order.design?.sleeveDesign === "as-photo" && order.design?.sleevePhoto
                              ? "✓ कस्टम फ़ोटो अनुसार"
                              : sleeveDesignInfo.hiScript || sleeveDesignInfo.hi)
                          : (order.design?.sleeveDesign === "as-photo"
                              ? "✓ As per Photo"
                              : sleeveDesignInfo.en)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fitting Preference & Tailor Notes */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#faf6f2] border border-stone-300 text-[13px] text-stone-800 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-800">{tr("Fitting Preference:", "सिलाई की फ़िटिंग:")}</span>
                      <span className="font-extrabold text-[var(--primary)] bg-white px-3 py-0.5 rounded-md border border-stone-200">
                        {order.design?.fit || "Regular"}
                      </span>
                    </div>
                    <span className="text-[11.5px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✂️ {tr("1.5-inch inner margin included", "1.5 इंच इनर मार्जिन शामिल")}
                    </span>
                  </div>

                  {order.design?.additionalInstructions && (
                    <div className="pt-1 text-[13px] leading-snug">
                      <b className="text-[var(--primary)]">✨ {tr("Tailor Embellishments & Trims:", "विशेष काम व निर्देश:")}</b>{" "}
                      {order.design.additionalInstructions}
                    </div>
                  )}

                  {order.outfit?.specialReq && (
                    <div className="pt-1 text-[13px] leading-snug">
                      <b className="text-[var(--primary)]">📝 {tr("Special Tailoring Request:", "विशेष सिलाई निर्देश:")}</b>{" "}
                      {order.outfit.specialReq}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. MEASUREMENTS TABLE */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd0] mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler size={18} className="text-[var(--primary)]" />
                    <h4 className="font-serif text-[15px] sm:text-[16px] font-bold text-[var(--primary-dark)] m-0">
                      {tr(
                        `Master Tailor Measurements Chart (${order.measurements?.unit || "inch"})`,
                        `मास्टर दर्जी नाप चार्ट (${order.measurements?.unit === "cm" ? "सेमी" : "इंच"})`
                      )}
                    </h4>
                  </div>
                  <span className="text-[12px] font-extrabold text-stone-800 bg-[#f7ede5] px-3 py-1 rounded-md border border-[#e2d0c2]">
                    {order.measurements?.provideMethod?.includes("वीडियो") || order.measurements?.provideMethod === "video_call"
                      ? tr("Video Call Assistance", "वीडियो कॉल पर मदद")
                      : order.measurements?.provideMethod?.includes("भेजूंगी") || order.measurements?.provideMethod === "send_clothes"
                      ? tr("Sending Sample Clothes", "सिले कपड़े भेजेंगे")
                      : tr("Self Measurement", "खुद से नाप")}
                  </span>
                </div>

                {order.measurements?.values && Object.keys(order.measurements.values).length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border-2 border-[#dfcdbf] bg-white shadow-2xs">
                    <table className="w-full text-left text-[14px] border-collapse">
                      <thead>
                        <tr className="bg-[#f7ede5] text-[var(--primary-dark)] border-b-2 border-[#dfcdbf]">
                          <th className="py-2.5 px-4 font-extrabold w-12 text-center">#</th>
                          <th className="py-2.5 px-4 font-extrabold">{tr("Measurement Parameter / Body Point", "नाप का भाग")}</th>
                          <th className="py-2.5 px-4 font-extrabold text-right">
                            {tr(
                              `Tailor Size (${order.measurements.unit?.toUpperCase() || "INCH"})`,
                              `नाप (${order.measurements.unit === "cm" ? "सेमी" : "इंच"})`
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(order.measurements.values).map(([key, val], idx) => {
                          if (!val) return null;
                          const labelObj = MEASURE_LABELS[key];
                          const label = labelObj ? tr(labelObj.en, labelObj.hi) : key.replace(/([A-Z])/g, " $1");
                          return (
                            <tr
                              key={key}
                              className={`border-b border-[#f0e4d8] ${idx % 2 === 0 ? "bg-white" : "bg-[#fdfaf7]"}`}
                            >
                              <td className="py-2 px-4 text-center text-[12px] font-bold text-stone-400">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-4 font-bold text-stone-900 text-[14px]">
                                {label}
                              </td>
                              <td className="py-2 px-4 text-right font-extrabold font-mono text-[16.5px] text-[var(--primary)]">
                                {val} <span className="text-[12px] font-sans font-bold text-stone-600">{order.measurements.unit === "cm" ? tr("cm", "सेमी") : tr("in", "इंच")}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (order.measurements?.provideMethod?.includes("भेजूंगी") || order.measurements?.provideMethod?.includes("सिले") || order.measurements?.provideMethod === "send_clothes") ? (
                  <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-2xs">
                    <div className="flex items-center gap-2.5 font-bold text-[14.5px]">
                      <span className="text-[20px]">📦</span>
                      <span>{tr("Sending Stitched Sample Clothes for Measurement", "सिले हुए कपड़े नापने के लिए भेजे जाएंगे")}</span>
                    </div>
                    <p className="text-[13px] mt-1.5 text-amber-900 leading-relaxed font-medium">
                      {tr(
                        "Customer will courier their best-fitting stitched sample clothes to our atelier address. Master tailors will record sizes directly from the physical sample.",
                        "ग्राहक नाप के लिए अपने सबसे अच्छी फ़िटिंग वाले सिले कपड़े हमारे पते पर भेजेंगे। कारीगर कपड़े से सीधे नाप नोट करेंगे।"
                      )}
                    </p>
                  </div>
                ) : (order.measurements?.provideMethod?.includes("वीडियो कॉल") || order.measurements?.provideMethod === "video_call") ? (
                  <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300 text-blue-950 shadow-2xs">
                    <div className="flex items-center gap-2.5 font-bold text-[14.5px]">
                      <span className="text-[20px]">📹</span>
                      <span>{tr("Video Call Measurement Assistance Confirmed", "वीडियो कॉल पर नाप सहायता कन्फर्म")}</span>
                    </div>
                    <p className="text-[13px] mt-1.5 text-blue-900 leading-relaxed font-medium">
                      {tr(
                        `Our senior master tailor will connect directly via WhatsApp video call (+91 ${order.customer?.whatsapp || ""}) to assist with step-by-step measurements.`,
                        `वरिष्ठ मास्टर दर्जी ग्राहक के वॉट्सऐप नंबर (+91 ${order.customer?.whatsapp || ""}) पर वीडियो कॉल करके पूरा नाप दर्ज करेंगे।`
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-[13px] text-stone-500 italic p-3.5 bg-white rounded-lg border border-stone-200">
                    {tr("No individual numerical measurements recorded", "कोई अलग से नाप दर्ज नहीं है।")}
                  </p>
                )}

                {order.measurements?.notes && (
                  <p className="mt-2.5 text-[12.5px] text-stone-700 italic bg-[#fdfaf8] p-2.5 rounded-lg border border-[#ebdcd0]">
                    <b>{tr("Measurement Note:", "नाप संबंधी निर्देश:")}</b> "{order.measurements.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* ATELIER FOOTER */}
            <div className="receipt-section-block pt-4 border-t-2 border-[#ebdcd0] text-center bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcd0]">
              <p className="font-serif font-bold text-[var(--primary)] text-[16px] sm:text-[17px]">
                {tr(
                  "Thank you for choosing Khwab Stitch! Where Fabric Becomes Art.",
                  "ख़्वाब स्टिच चुनने के लिए धन्यवाद! हमारी कारीगरी · आपकी पसंद"
                )}
              </p>
              <p className="text-[13px] sm:text-[13.5px] font-bold text-stone-800 mt-2">
                {tr(
                  "For anything contact us on WhatsApp, or Instagram:",
                  "किसी भी जानकारी या सहायता के लिए हमें वॉट्सऐप या इंस्टाग्राम पर संपर्क करें:"
                )}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-2.5 text-[12.5px] sm:text-[13px] font-bold">
                <a
                  href={`https://wa.me/91${(BRAND_CONFIG?.helpline || "9876543210").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-900 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <Phone size={14} className="text-emerald-700" />
                  <span>WhatsApp: {BRAND_CONFIG?.helpline || "+91 98765 43210"}</span>
                </a>
                <a
                  href={`https://instagram.com/${(BRAND_CONFIG?.instagram || "khwabstitch").replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-pink-900 bg-pink-50 px-3.5 py-1.5 rounded-full border border-pink-300 hover:bg-pink-100 transition-colors"
                >
                  <Instagram size={14} className="text-pink-700" />
                  <span>Instagram: {BRAND_CONFIG?.instagram || "@khwabstitch"}</span>
                </a>
                {BRAND_CONFIG?.website && (
                  <span className="inline-flex items-center gap-1.5 text-stone-700 bg-stone-50 px-3.5 py-1.5 rounded-full border border-stone-200">
                    <span>{BRAND_CONFIG.website}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
