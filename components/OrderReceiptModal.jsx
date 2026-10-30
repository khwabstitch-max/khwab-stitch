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
} from "lucide-react";

// Catalog of Design Codes with Photos & Details
const DESIGN_CODE_CATALOG = {
  "K-01": {
    code: "K-01",
    name: "Classic Cotton Printed Kurti",
    hi: "क्लासिक कॉटन प्रिंटेड कुर्ती",
    outfit: "Kurti",
    image: "./images/designs/k-01.jpg",
    details: "Mandarin collar, button placket, 3/4 sleeves, straight side-slit cut",
    tag: "Studio Signature / सर्वाधिक लोकप्रिय",
  },
  "K-02": {
    code: "K-02",
    name: "Festive Embroidered Straight Kurti",
    hi: "फ़ेस्टिव एम्ब्रॉयडर्ड स्ट्रेट कुर्ती",
    outfit: "Kurti",
    image: "./images/kurti.jpg",
    details: "Round neck with V-slit, quarter sleeves, elegant side-slit hem",
    tag: "Designer Choice",
  },
  "B-01": {
    code: "B-01",
    name: "Royal Velvet Embroidered Blouse",
    hi: "रॉयल वेलवेट एम्ब्रॉयडर्ड ब्लाउज़",
    outfit: "Blouse",
    image: "./images/blouse.jpg",
    details: "Sweetheart neckline, golden zardozi embroidery, elbow sleeves, dori back",
    tag: "Bridal & Festive / लोकप्रिय",
  },
  "B-02": {
    code: "B-02",
    name: "Classic Saree Designer Choli",
    hi: "क्लासिक साड़ी डिज़ाइनर चोली",
    outfit: "Blouse",
    image: "./images/blouse.jpg",
    details: "Deep round back with tassels, fitted bust cup padding, clean finish",
    tag: "Partywear",
  },
  "SU-01": {
    code: "SU-01",
    name: "Traditional Punjabi Straight Kameez",
    hi: "पारंपरिक पंजाबी स्ट्रेट कमीज़",
    outfit: "Suit Upper",
    image: "./images/suit-upper.jpg",
    details: "Boat neck with lace border, full sleeves, side chak open slits",
    tag: "Classic Punjabi / पारंपरिक",
  },
  "SU-02": {
    code: "SU-02",
    name: "Festive Embroidered Silk Suit Upper",
    hi: "फ़ेस्टिव एम्ब्रॉयडर्ड सिल्क सूट कमीज़",
    outfit: "Suit Upper",
    image: "./images/suit-upper.jpg",
    details: "Collar neck styling, straight fitted silhouette with side borders",
    tag: "Festive Wear",
  },
};

// Outfit Types Catalog
const OUTFIT_CATALOG = {
  Blouse: {
    en: "Blouse",
    hi: "ब्लाउज़ / चोली",
    photo: "./images/blouse.jpg",
  },
  Kurti: {
    en: "Kurti",
    hi: "कुर्ती / कुर्ता",
    photo: "./images/kurti.jpg",
  },
  "Suit Upper": {
    en: "Suit Upper",
    hi: "सूट अपर / कमीज़",
    photo: "./images/suit-upper.jpg",
  },
};

// Front Necklines with Photos
const FRONT_NECK_CATALOG = {
  round: { en: "Round Neck", hi: "गोल गला", photo: "./images/neck_front/round.jpg" },
  vneck: { en: "V-Neck", hi: "वी गला", photo: "./images/neck_front/vneck.jpg" },
  boat: { en: "Boat Neck", hi: "नाव (बोट) गला", photo: "./images/neck_front/boat.jpg" },
  collar: { en: "Collar Neck", hi: "कॉलर वाला गला", photo: "./images/neck_front/collar.jpg" },
  square: { en: "Square Neck", hi: "चौकोर गला", photo: "./images/neck_front/square.jpg" },
  sweetheart: { en: "Sweetheart", hi: "स्वीटहार्ट (दिल वाला) गला", photo: "./images/neck_front/sweetheart.jpg" },
  high: { en: "High Neck", hi: "बंद / हाई नेक", photo: "./images/neck_front/high.jpg" },
  mandarin: { en: "Mandarin Collar", hi: "चाइनीज़ (मंदारिन) गला", photo: "./images/neck_front/mandarin.jpg" },
};

// Back Necklines with Photos
const BACK_NECK_CATALOG = {
  simple: { en: "Simple Back", hi: "सीधा / सामान्य बैक", photo: "./images/neck_back/simple.jpg" },
  "round-back": { en: "Round Back", hi: "गोल बैक", photo: "./images/neck_back/round-back.jpg" },
  "v-back": { en: "V-Back", hi: "वी बैक", photo: "./images/neck_back/v-back.jpg" },
  "square-back": { en: "Square Back", hi: "चौकोर बैक", photo: "./images/neck_back/square-back.jpg" },
  deep: { en: "Deep Back with Dori", hi: "गहरा बैक डोरी सहित", photo: "./images/neck_back/deep.jpg" },
  button: { en: "Keyhole with Button", hi: "बटन वाला बैक", photo: "./images/neck_back/button.jpg" },
  cutout: { en: "Cut-out Back", hi: "डिज़ाइनर कटआउट", photo: "./images/neck_back/cutout.jpg" },
  "as-photo": { en: "As per Photo", hi: "फ़ोटो जैसा बैक", photo: "./images/neck_back/as-photo.jpg" },
};

// Sleeve Lengths with Photos
const SLEEVE_LENGTH_CATALOG = {
  sleeveless: { en: "Sleeveless", hi: "बिना बाज़ू", length: "0 cm (0\")", photo: "./images/sleeve_lengths/sleeveless_front.jpg" },
  quarter: { en: "1/4 Sleeve (Quarter)", hi: "छोटी बाज़ू (चौथाई)", length: "10 cm (4\")", photo: "./images/sleeve_lengths/quarter_front.jpg" },
  half: { en: "1/2 Sleeve (Half)", hi: "आधी बाज़ू", length: "20 cm (7.9\")", photo: "./images/sleeve_lengths/half_front.jpg" },
  "three-quarter": { en: "3/4 Sleeve (Three-Quarter)", hi: "पौनी बाज़ू (3/4)", length: "38 cm (15\")", photo: "./images/sleeve_lengths/three_quarter_front.jpg" },
  full: { en: "Full Sleeve", hi: "पूरी बाज़ू", length: "55 cm (21.7\")", photo: "./images/sleeve_lengths/full_front.jpg" },
};

// Sleeve Designs with Photos
const SLEEVE_DESIGN_CATALOG = {
  straight: { en: "Straight Plain", hi: "सादी / सीधी बाज़ू", photo: "./images/sleeves/straight_front.jpg" },
  puff: { en: "Puff Sleeve", hi: "फूली (पफ) बाज़ू", photo: "./images/sleeves/puff_front.jpg" },
  bell: { en: "Bell Sleeve", hi: "घंटी (बेल) बाज़ू", photo: "./images/sleeves/bell_front.jpg" },
  ruffle: { en: "Ruffle Sleeve", hi: "झालर (रफ़ल) बाज़ू", photo: "./images/sleeves/ruffle_front.jpg" },
  cap: { en: "Cap Sleeve", hi: "कैप बाज़ू", photo: "./images/sleeves/cap_front.jpg" },
  bishop: { en: "Bishop Balloon", hi: "गुब्बारे (बिशप) बाज़ू", photo: "./images/sleeves/bishop_front.jpg" },
  butterfly: { en: "Butterfly", hi: "तितली बाज़ू", photo: "./images/sleeves/butterfly_front.jpg" },
  cold: { en: "Cold Shoulder", hi: "कंधा खुला (कट-शोल्डर)", photo: "./images/sleeves/cold_front.jpg" },
  flutter: { en: "Flutter", hi: "लहर (फ्लटर) बाज़ू", photo: "./images/sleeves/flutter_front.jpg" },
  "bell-cuff": { en: "Bell-Cuff", hi: "कफ़ वाली बाज़ू", photo: "./images/sleeves/bell_cuff_front.jpg" },
  pleated: { en: "Pleated", hi: "चुन्नट (प्लीटेड) बाज़ू", photo: "./images/sleeves/pleated_front.jpg" },
  "as-photo": { en: "As per Photo", hi: "फ़ोटो जैसी बाज़ू", photo: "./images/sleeves/as_photo_front.jpg" },
};

const MEASURE_LABELS = {
  blouseLength: "Blouse Length / ब्लाउज़ लंबाई",
  kurtiLength: "Kurti Length / कुर्ती लंबाई",
  suitLength: "Suit Length / कमीज़ लंबाई",
  bust: "Around Bust / चेस्ट (छाती)",
  underBust: "Under Bust / छाती के नीचे",
  waist: "Around Waist / कमर",
  hip: "Around Hip / हिप (कूल्हा)",
  armhole: "Armhole / कांख",
  shoulder: "Shoulder Width / कंधा",
  sleeveLength: "Sleeve Length / बाज़ू लंबाई",
  bottomOpening: "Sleeve Bottom Opening / बाज़ू मोरी",
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
    hi: fallbackHi || "",
    photo: fallbackPhoto || "",
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

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin + window.location.pathname
        : "";

    const fullHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <base href="${baseUrl}">
  <title>Khwab-Stitch-Order-${order.orderId}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: #6b2d46;
      --primary-dark: #4e1d31;
      --primary-light: #fbf0f4;
      --secondary: #9c4d68;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; background: #faf7f2; color: #2d2621; padding: 24px; margin: 0; }
    .receipt-box {
      position: relative;
      max-width: 820px;
      margin: 0 auto;
      background-color: #faf7f2;
      background-image: url("data:image/svg+xml,%3Csvg width='360' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='40' y='120' transform='rotate(-28 180 120)' fill='%236b2d46' fill-opacity='0.08' font-family='Georgia, serif' font-size='22' font-weight='bold' letter-spacing='0.16em'%3EKHWAB STITCH%3C/text%3E%3Ctext x='40' y='148' transform='rotate(-28 180 120)' fill='%239c4d68' fill-opacity='0.06' font-family='sans-serif' font-size='10' font-weight='bold' letter-spacing='0.22em'%3EBESPOKE ATELIER%3C/text%3E%3C/svg%3E");
      background-repeat: repeat;
      border-radius: 20px;
      border: 1px solid #e6dacd;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
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
  const outfitInfo = lookupItem(OUTFIT_CATALOG, order.outfit?.type, order.outfit?.type, "परिधान", "./images/kurti.jpg");
  const designCodeInfo = order.outfit?.designCode ? DESIGN_CODE_CATALOG[order.outfit.designCode] : null;

  const frontNeckInfo = lookupItem(FRONT_NECK_CATALOG, order.design?.neckFront, order.design?.neckFront, "गला", "./images/neck_front/round.jpg");
  const backNeckInfo = lookupItem(BACK_NECK_CATALOG, order.design?.neckBack, order.design?.neckBack, "बैक", "./images/neck_back/simple.jpg");
  const sleeveLengthInfo = lookupItem(SLEEVE_LENGTH_CATALOG, order.design?.sleeveLength, order.design?.sleeveLength, "बाज़ू", "./images/sleeve_lengths/full_front.jpg");
  const sleeveDesignInfo = lookupItem(SLEEVE_DESIGN_CATALOG, order.design?.sleeveDesign, order.design?.sleeveDesign, "बाज़ू स्टाइल", "./images/sleeves/straight_front.jpg");

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
          {/* ROYAL CENTERPIECE WATERMARK SEAL (CLEARLY VISIBLE IN PRINT & PDF) */}
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

          {/* ALL CONTENT POSITIONED ABOVE WATERMARK WITH TRANSLUCENT CARDS */}
          <div className="relative z-10 space-y-6">
            {/* HEADER */}
            <div className="receipt-section-block flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[#ebdcd0] bg-white/90 p-4 rounded-2xl border border-[#ebdcd0] shadow-2xs">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="./images/khwabstitch_logo.jpg"
                    alt="Khwab Stitch Logo"
                    className="h-14 w-14 rounded-full object-cover border-2 border-[#dfc5b5] shadow-xs flex-shrink-0"
                    loading="eager"
                  />
                  <div>
                    <h1 className="font-serif text-[24px] sm:text-[27px] font-bold text-[var(--primary-dark)] m-0 leading-tight">
                      Khwab Stitch
                    </h1>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)] mt-0.5">
                      Where Fabric Becomes Art · Bespoke Atelier / हमारी कारीगरी
                    </p>
                  </div>
                </div>
                <p className="text-[12px] text-stone-600 mt-2">
                  WhatsApp: <b>+91 98765 43210</b> · khwabstitch.com
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block rounded-full bg-[#fbf0f4] text-[var(--primary)] px-3 py-1 font-bold text-[12px] border border-[#f0d5df]">
                  Order Receipt / ऑर्डर रसीद
                </span>
                <div className="font-mono text-[17px] font-bold text-stone-900 mt-1.5">
                  #{order.orderId}
                </div>
                <div className="flex items-center sm:justify-end gap-1 text-[11.5px] text-stone-500 mt-0.5">
                  <Calendar size={12} />
                  <span>{new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* CUSTOMER & DELIVERY INFO GRID */}
            <div className="receipt-section-block grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/90 border border-[#ebdcd0] shadow-2xs">
              {/* Customer Details */}
              <div>
                <h3 className="font-serif text-[13px] font-bold text-[var(--primary)] uppercase tracking-wider mb-2">
                  👤 Customer Details / ग्राहक की जानकारी
                </h3>
                <p className="text-[14.5px] font-bold text-stone-900">{order.customer?.name || "Customer"}</p>
                <p className="text-[12.5px] text-stone-700 flex items-center gap-1.5 mt-1 font-semibold">
                  <Phone size={13} className="text-emerald-700" />
                  <span>+91 {order.customer?.whatsapp ? order.customer.whatsapp.replace(/\D/g, "").slice(-10) : ""}</span>
                </p>
                {order.customer?.email && (
                  <p className="text-[12.5px] text-stone-600 flex items-center gap-1.5 mt-0.5">
                    <Mail size={13} className="text-stone-400" />
                    <span>{order.customer.email}</span>
                  </p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-serif text-[13px] font-bold text-[var(--primary)] uppercase tracking-wider mb-2">
                  📍 Delivery Address / डिलीवरी का पता
                </h3>
                <p className="text-[13px] text-stone-800 leading-snug font-medium">
                  {deliveryAddress}
                </p>
                {landmark && (
                  <p className="text-[12px] text-stone-600 mt-0.5">
                    <b>Landmark:</b> {landmark}
                  </p>
                )}
                <p className="text-[12.5px] font-bold text-stone-800 mt-0.5">
                  {order.customer?.cityState || `${order.customer?.city || ""}, ${order.customer?.state || ""}`} — <b>PIN: {order.customer?.pin}</b>
                </p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-stone-50 border border-[#e2d5c8] px-2 py-0.5 text-[11px] font-bold text-stone-700">
                  <Clock size={12} />
                  <span>{order.delivery?.deliveryType || "Standard Delivery · 7-10 Days"}</span>
                </div>
              </div>
            </div>

            {/* 1. SELECTED DESIGN CODE / OUTFIT SHOWCASE (SINGLE FOCUSED CARD) */}
            <div className="receipt-section-block">
              <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] pb-1.5 border-b border-[#f0e4d8] mb-3 flex items-center justify-between">
                <span>👗 Selected Design & Outfit / चुना गया डिज़ाइन व परिधान:</span>
                <span className="text-[11px] font-bold text-[var(--primary)] bg-[#fbf0f4] px-2.5 py-0.5 rounded-full border border-[#f0d5df]">
                  Total: {order.outfit?.pieces || 1} Piece(s)
                </span>
              </h3>

              {order.outfit?.designCode ? (
                /* ACTUAL DESIGN CODE CARD (NO REDUNDANT BASE GARMENT CARD) */
                <div className="rounded-2xl border-2 border-[var(--primary)]/30 bg-[#fdf8f9]/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-2xs">
                  <div className="relative shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border-2 border-[var(--primary)]/30 bg-white">
                    <img
                      src={designCodeInfo?.image || "./images/designs/k-01.jpg"}
                      alt={designCodeInfo?.name || order.outfit.designCode}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[var(--primary)] text-white text-[11px] font-mono font-bold shadow-xs">
                      {order.outfit.designCode}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
                      × {order.outfit?.pieces || 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-[var(--primary)] text-white text-[11px] font-mono font-bold shadow-xs">
                        Design Code: {order.outfit.designCode}
                      </span>
                      {designCodeInfo?.tag && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10.5px] font-bold border border-amber-200">
                          {designCodeInfo.tag}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-[17px] sm:text-[19px] font-bold text-[var(--primary-dark)] leading-tight">
                      {designCodeInfo?.name || `Design ${order.outfit.designCode}`}
                    </h4>

                    <p className="text-[13px] font-semibold text-[var(--secondary)]">
                      {designCodeInfo?.hi || "कैटलॉग डिज़ाइन"}
                    </p>

                    {designCodeInfo?.details && (
                      <p className="text-[12px] text-stone-700 bg-white/80 p-2.5 rounded-xl border border-[#ece2d6] leading-relaxed">
                        <b>Design Features / खासियत:</b> {designCodeInfo.details}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[12px] text-stone-700">
                      <span>Outfit: <b>{order.outfit?.type} ({outfitInfo?.hi})</b></span>
                      <span>•</span>
                      <span>Quantity: <b>{order.outfit?.pieces || 1} Piece(s) / पीस</b></span>
                      {order.outfit?.refPhoto && (
                        <>
                          <span>•</span>
                          <span>Reference: <b>{order.outfit.refPhoto}</b></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* BESPOKE GARMENT CARD (WHEN NO CATALOG CODE CHOSEN) */
                <div className="rounded-2xl border-2 border-[#ebdcd0] bg-white/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-2xs">
                  <div className="relative shrink-0 w-28 h-28 rounded-xl overflow-hidden border border-stone-200 bg-white">
                    <img
                      src={order.outfit?.uploadedPhoto || outfitInfo?.photo || "./images/kurti.jpg"}
                      alt={order.outfit?.type || "Outfit"}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9.5px] font-bold">
                      × {order.outfit?.pieces || 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fbf0e0] text-[var(--secondary)] text-[11px] font-bold border border-[#ebdcd0]">
                      Custom Bespoke Garment / कस्टम सिलाई
                    </span>
                    <h4 className="font-serif text-[17px] sm:text-[19px] font-bold text-stone-900 leading-tight">
                      {order.outfit?.type || "Bespoke Outfit"}
                    </h4>
                    <p className="text-[12.5px] font-semibold text-[var(--secondary)]">
                      {outfitInfo?.hi || "सिलाई परिधान"}
                    </p>
                    <p className="text-[12px] text-stone-600">
                      Quantity: <b>{order.outfit?.pieces || 1} Piece(s) / पीस</b>
                    </p>
                    <p className="text-[11.5px] text-stone-500">
                      {order.outfit?.uploadedPhoto
                        ? "✓ Custom design photo attached below"
                        : (order.outfit?.refPhoto || "Tailored according to selected necklines & sleeves")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. STYLING BLUEPRINT (4 CARDS WITH REAL PHOTOS) */}
            <div className="receipt-section-block">
              <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] pb-1.5 border-b border-[#f0e4d8] mb-3 flex items-center justify-between">
                <span>✂️ Necklines & Sleeves Styling Blueprint / गले व बाज़ू का चुना गया स्टाइल:</span>
                <span className="text-[11px] font-semibold text-stone-500">Every Selection with Photo</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. FRONT NECK */}
                <div className="rounded-xl border border-[#ebdcd0] bg-white/90 p-2.5 flex flex-col justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                      Front Neck / आगे गला
                    </p>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                      {frontNeckInfo?.photo ? (
                        <img
                          src={frontNeckInfo.photo}
                          alt={frontNeckInfo.en || "Front Neck"}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-stone-400">
                          No photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-stone-900 leading-tight">
                      {frontNeckInfo?.en || order.design?.neckFront || "Standard"}
                    </p>
                    <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                      {frontNeckInfo?.hi || "सामान्य गला"}
                    </p>
                  </div>
                </div>

                {/* 2. BACK NECK */}
                <div className="rounded-xl border border-[#ebdcd0] bg-white/90 p-2.5 flex flex-col justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                      Back Neck / पीछे गला
                    </p>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                      {(order.design?.neckBack === "as-photo" && order.design?.backPhoto) || backNeckInfo?.photo ? (
                        <img
                          src={(order.design?.neckBack === "as-photo" && order.design?.backPhoto) || backNeckInfo.photo}
                          alt={backNeckInfo.en || "Back Neck"}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-stone-400">
                          No photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-stone-900 leading-tight">
                      {backNeckInfo?.en || order.design?.neckBack || "Standard"}
                    </p>
                    <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                      {order.design?.neckBack === "as-photo" && order.design?.backPhoto
                        ? `Custom Photo Attached / फ़ोटो अनुसार (${order.design.backPhotoName || "Design Photo"})`
                        : backNeckInfo?.hi || "सामान्य बैक"}
                    </p>
                  </div>
                </div>

                {/* 3. SLEEVE LENGTH */}
                <div className="rounded-xl border border-[#ebdcd0] bg-white/90 p-2.5 flex flex-col justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                      Sleeve Length / बाज़ू लंबाई
                    </p>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                      {sleeveLengthInfo?.photo ? (
                        <img
                          src={sleeveLengthInfo.photo}
                          alt={sleeveLengthInfo.en || "Sleeve Length"}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-stone-400">
                          No photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-stone-900 leading-tight">
                      {sleeveLengthInfo?.en || order.design?.sleeveLength || "Standard"}
                    </p>
                    <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                      {sleeveLengthInfo?.hi || "सामान्य बाज़ू"}
                    </p>
                    {sleeveLengthInfo?.length && (
                      <p className="text-[10px] text-stone-500 mt-0.5 font-mono">
                        {sleeveLengthInfo.length}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. SLEEVE DESIGN */}
                <div className="rounded-xl border border-[#ebdcd0] bg-white/90 p-2.5 flex flex-col justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                      Sleeve Style / बाज़ू स्टाइल
                    </p>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-stone-200 mb-2">
                      {(order.design?.sleeveDesign === "as-photo" && order.design?.sleevePhoto) || sleeveDesignInfo?.photo ? (
                        <img
                          src={(order.design?.sleeveDesign === "as-photo" && order.design?.sleevePhoto) || sleeveDesignInfo.photo}
                          alt={sleeveDesignInfo?.en || "Sleeve Design"}
                          className="h-full w-full object-contain"
                          loading="eager"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-stone-400">
                          No photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-stone-900 leading-tight">
                      {sleeveDesignInfo?.en || order.design?.sleeveDesign || "Straight"}
                    </p>
                    <p className="text-[11px] font-semibold text-[var(--secondary)] mt-0.5">
                      {order.design?.sleeveDesign === "as-photo" && order.design?.sleevePhoto
                        ? "✓ कस्टम फ़ोटो संलग्न"
                        : sleeveDesignInfo?.hi || "सादी बाज़ू"}
                    </p>
                  </div>
                </div>
              </div>

              {/* FIT & SPECIAL TAILOR NOTES */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/90 border border-stone-200 text-[12px] shadow-2xs">
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
              </div>
            </div>

            {/* 3. CUSTOMER REFERENCE PHOTO (IF ATTACHED) */}
            {order.outfit?.uploadedPhoto && (
              <div className="receipt-section-block p-4 rounded-2xl bg-white/90 border-2 border-[#ebdcd0] shadow-2xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e9ded4]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[var(--primary)]" />
                    <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] m-0">
                      Customer Reference Design Photo / ग्राहक द्वारा अपलोड की गई डिज़ाइन फ़ोटो
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Photo Attached / फ़ोटो संलग्न
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative max-w-[220px] w-full rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                    <img
                      src={order.outfit.uploadedPhoto}
                      alt="Customer Design Reference"
                      className="w-full h-auto max-h-[220px] object-contain mx-auto"
                      loading="eager"
                    />
                  </div>
                  <div className="flex-1 text-[12.5px] text-stone-700 space-y-1.5 text-center sm:text-left">
                    <p>
                      <b>File Name:</b> {order.outfit.uploadedPhotoName || "design-reference.jpg"}
                    </p>
                    {order.outfit.uploadedPhotoSize && (
                      <p>
                        <b>Size:</b> {order.outfit.uploadedPhotoSize}
                      </p>
                    )}
                    <p className="text-[12px] text-stone-500 italic">
                      कारीगर इस फ़ोटो के अनुसार परिधान की कटिंग, सिलाई और फिनिशिंग तैयार करेंगे।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. MEASUREMENTS SECTION (FULLY MAPPED) */}
            <div className="receipt-section-block">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#f0e4d8] mb-3">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-[var(--primary)]" />
                  <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] m-0">
                    Measurements / शारीरिक नाप ({order.measurements?.unit || "inch"})
                  </h3>
                </div>
                <span className="text-[11.5px] font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md">
                  {order.measurements?.provideMethod || "Self Measurement / खुद से नाप"}
                </span>
              </div>

              {order.measurements?.values && Object.keys(order.measurements.values).length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-[#ece2d6] bg-white/90 shadow-2xs">
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
                            className={`border-b border-[#f2eae2] ${idx % 2 === 0 ? "bg-white/80" : "bg-[#fdfbf9]/80"}`}
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
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[13px]">
                    <span>📦</span>
                    <span>Sending Stitched Sample Clothes / मैं अपने सिले हुए कपड़े नापने के लिए भेजूंगी</span>
                  </div>
                  <p className="text-[12px] mt-1 text-amber-800">
                    Customer will send their stitched sample garment for size measurement. / ग्राहक नाप के लिए अपने सिले हुए कपड़े भेजेंगी।
                  </p>
                  {order.measurements?.notes && (
                    <p className="mt-2 text-[12px] font-semibold text-stone-700 bg-white/80 p-2 rounded-lg border border-amber-200">
                      <b>Customer Note / विशेष निर्देश:</b> {order.measurements.notes}
                    </p>
                  )}
                </div>
              ) : order.measurements?.provideMethod?.includes("वीडियो कॉल") ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-[13px]">
                    <span>📹</span>
                    <span>Measurements on Video Call / वीडियो कॉल द्वारा नाप</span>
                  </div>
                  <p className="text-[12px] mt-1 text-blue-800">
                    Master tailor will contact customer shortly to take all measurements live on video call. / मास्टर दर्जी जल्दी ही वीडियो कॉल पर नाप लेंगे।
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-stone-500 italic p-3 bg-white/90 rounded-lg border border-stone-200">
                  No individual measurements recorded / कोई अलग से नाप दर्ज नहीं है।
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div className="receipt-section-block pt-4 border-t-2 border-[#ebdcd0] text-center text-[12px] text-stone-500 bg-white/80 p-4 rounded-2xl border border-[#ebdcd0]">
              <p className="font-serif font-bold text-[var(--primary)] text-[13.5px]">
                Thank you for choosing Khwab Stitch! / ख़्वाब स्टिच चुनने के लिए धन्यवाद!
              </p>
              <p className="mt-1">
                Where Fabric Becomes Art · WhatsApp Helpline: <b>+91 98765 43210</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
