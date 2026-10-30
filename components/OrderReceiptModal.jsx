import React from "react";
import { Printer, Download, X, CheckCircle2, Scissors, MapPin, Phone, Mail, Calendar, Sparkles } from "lucide-react";

export default function OrderReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const receiptEl = document.getElementById("printable-receipt");
    if (!receiptEl) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>Khwab-Stitch-Order-${order.orderId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #faf7f2; color: #2d2621; padding: 24px; margin: 0; }
    .receipt-box { max-width: 780px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid #e6dacd; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    h1, h2, h3 { color: #6b2d46; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ece2d6; padding: 8px 12px; font-size: 13px; text-align: left; }
    th { background: #faf5f0; color: #6b2d46; font-weight: bold; }
    .badge { display: inline-block; background: #f7eef2; color: #6b2d46; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 12px; border: 1px solid #ebd4de; }
    .photo-box { margin-top: 16px; border: 1px solid #ece2d6; border-radius: 12px; padding: 12px; background: #faf7f2; text-align: center; }
    .photo-box img { max-width: 100%; max-height: 420px; border-radius: 8px; object-contain; }
    @media print { body { background: white; padding: 0; } .receipt-box { border: none; box-shadow: none; padding: 0; } }
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

  return (
    <div className="order-receipt-overlay fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm p-3 md:p-6 overflow-y-auto flex items-start justify-center">
      <div
        id="printable-receipt-container"
        className="relative w-full max-w-[820px] bg-white rounded-[28px] shadow-2xl border border-stone-200 my-4"
      >
        {/* ACTION BAR (HIDDEN IN PRINT) */}
        <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 p-4 bg-stone-900 text-white border-b border-stone-800 rounded-t-[28px]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-bold">
              ✓
            </span>
            <span className="font-bold text-[14px]">
              Order Receipt / ऑर्डर रसीद · #{order.orderId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-[12px] shadow transition-colors"
            >
              <Printer size={14} />
              Save as PDF / प्रिंट करें
            </button>
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold text-[12px] transition-colors"
            >
              <Download size={13} />
              Download Slip / फ़ाइल
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-receipt" className="p-6 md:p-10 text-stone-800 bg-white">
          {/* HEADER */}
          <div className="receipt-section-block flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[#ebdcd0]">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="./images/khwabstitch_logo.jpg"
                  alt="Khwab Stitch Logo"
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#dfc5b5] shadow-xs flex-shrink-0"
                />
                <div>
                  <h1 className="font-serif text-[24px] sm:text-[26px] font-bold text-[var(--primary-dark)] m-0 leading-tight">
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
              <div className="font-mono text-[16px] font-bold text-stone-900 mt-1.5">
                #{order.orderId}
              </div>
              <div className="flex items-center sm:justify-end gap-1 text-[11.5px] text-stone-500 mt-0.5">
                <Calendar size={12} />
                <span>{new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* CUSTOMER & DELIVERY INFO GRID */}
          <div className="receipt-section-block grid sm:grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0]">
            {/* Customer Details */}
            <div>
              <h3 className="font-serif text-[13px] font-bold text-[var(--primary)] uppercase tracking-wider mb-2">
                👤 Customer Details / ग्राहक की जानकारी
              </h3>
              <p className="text-[14px] font-bold text-stone-900">{order.customer?.name}</p>
              <p className="text-[12.5px] text-stone-700 flex items-center gap-1.5 mt-1">
                <Phone size={13} className="text-stone-500" />
                <span>{order.customer?.whatsapp}</span>
              </p>
              {order.customer?.email && (
                <p className="text-[12.5px] text-stone-700 flex items-center gap-1.5 mt-0.5">
                  <Mail size={13} className="text-stone-500" />
                  <span>{order.customer?.email}</span>
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="font-serif text-[13px] font-bold text-[var(--primary)] uppercase tracking-wider mb-2">
                📍 Delivery Address / डिलीवरी का पता
              </h3>
              <p className="text-[13px] text-stone-800 leading-snug">
                {deliveryAddress}
              </p>
              {landmark && (
                <p className="text-[12px] text-stone-600 mt-0.5">
                  <b>Landmark:</b> {landmark}
                </p>
              )}
              <p className="text-[12.5px] font-medium text-stone-800 mt-0.5">
                {order.customer?.cityState} — <b>PIN: {order.customer?.pin}</b>
              </p>
              <div className="mt-2 inline-block rounded-md bg-white border border-[#e2d5c8] px-2 py-0.5 text-[11px] font-bold text-stone-700">
                🚀 {order.delivery?.deliveryType || "Standard Delivery"}
              </div>
            </div>
          </div>

          {/* OUTFIT & DESIGN CHOICES */}
          <div className="receipt-section-block mt-6">
            <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] pb-1.5 border-b border-[#f0e4d8] mb-3">
              👗 Outfit & Selected Styling / परिधान व डिज़ाइन
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#ece2d6]">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">Outfit / परिधान</span>
                <p className="text-[14px] font-bold text-stone-900 mt-0.5">{order.outfit?.type}</p>
                <p className="text-[12px] text-stone-600">Quantity / पीस: <b>{order.outfit?.pieces || 1}</b></p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#ece2d6]">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">Necklines / गले का डिज़ाइन</span>
                <p className="text-[12.5px] font-bold text-stone-900 mt-0.5">
                  Front: {order.design?.neckFront || "Standard"}
                </p>
                <p className="text-[12.5px] font-medium text-stone-700">
                  Back: {order.design?.neckBack || "Standard"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#ece2d6]">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">Sleeves & Fit / बाज़ू व फिट</span>
                <p className="text-[12.5px] font-bold text-stone-900 mt-0.5">
                  Length: {order.design?.sleeveLength || "Standard"}
                </p>
                <p className="text-[12.5px] text-stone-700">
                  Style: {order.design?.sleeveDesign || "Plain Straight"} · Fit: <b>{order.design?.fit || "Fitted"}</b>
                </p>
              </div>
            </div>

            {order.design?.additionalInstructions && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[12px]">
                <span className="font-bold text-stone-700">Extra Notes / विशेष निर्देश: </span>
                <span className="text-stone-600">{order.design.additionalInstructions}</span>
              </div>
            )}
          </div>

          {/* USER UPLOADED DESIGN REFERENCE PHOTO (ATTACHED PROPERLY) */}
          {order.outfit?.uploadedPhoto && (
            <div className="receipt-section-block mt-6 p-4 rounded-2xl bg-[#faf7f2] border-2 border-[#ebdcd0]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e9ded4]">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--primary)]" />
                  <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] m-0">
                    Customer Reference Design Photo / ग्राहक द्वारा अपलोड की गई डिज़ाइन फ़ोटो
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Photo Attached / फ़ोटो संलग्न
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative max-w-[280px] w-full rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                  <img
                    src={order.outfit.uploadedPhoto}
                    alt="Customer Design Reference"
                    className="w-full h-auto max-h-[260px] object-contain mx-auto"
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

          {/* MEASUREMENTS SECTION */}
          <div className="receipt-section-block mt-6">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#f0e4d8] mb-3">
              <h3 className="font-serif text-[14px] font-bold text-[var(--primary-dark)] m-0">
                📐 Measurements / शारीरिक नाप
              </h3>
              <span className="text-[12px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                Method: {order.measurements?.provideMethod || "Standard"}
              </span>
            </div>

            {order.measurements?.values && Object.keys(order.measurements.values).length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#ece2d6]">
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
                      return (
                        <tr
                          key={key}
                          className={`border-b border-[#f2eae2] ${idx % 2 === 0 ? "bg-white" : "bg-[#fdfbf9]"}`}
                        >
                          <td className="py-2 px-3 font-medium capitalize text-stone-800">
                            {key.replace(/([A-Z])/g, " $1")}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-stone-900">
                            {val} {order.measurements.unit || "inch"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : order.measurements?.provideMethod?.includes("भेजूंगी") ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-[13px]">
                  <span>📦</span>
                  <span>Sending Clothes / मैं अपने कपड़े भेजूंगी</span>
                </div>
                <p className="text-[12px] mt-1 text-amber-800">
                  Customer will send clothes directly for stitching. / ग्राहक सिलाई के लिए अपने कपड़े भेजेंगे।
                </p>
                {order.measurements?.notes && (
                  <p className="mt-2 text-[12px] font-semibold text-stone-700 bg-white/80 p-2 rounded-lg border border-amber-200">
                    <b>Customer Note / विशेष निर्देश:</b> {order.measurements.notes}
                  </p>
                )}
              </div>
            ) : order.measurements?.provideMethod?.includes("वीडियो कॉल") ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900">
                <div className="flex items-center gap-2 font-bold text-[13px]">
                  <span>📹</span>
                  <span>Measurements on Video Call / वीडियो कॉल द्वारा नाप</span>
                </div>
                <p className="text-[12px] mt-1 text-blue-800">
                  Master tailor will call the customer on WhatsApp within 1 hour to take all measurements live.
                  / मास्टर दर्जी 1 घंटे में ग्राहक के वॉट्सऐप पर वीडियो कॉल करके नाप दर्ज करेंगे।
                </p>
                {order.measurements?.notes && (
                  <p className="mt-2 text-[12px] font-semibold text-stone-700 bg-white/80 p-2 rounded-lg border border-blue-200">
                    <b>Customer Note / विशेष निर्देश:</b> {order.measurements.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[12px] text-stone-500 italic p-3 bg-stone-50 rounded-lg">
                No individual measurements recorded / कोई अलग से नाप दर्ज नहीं है।
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="receipt-section-block mt-8 pt-4 border-t-2 border-[#ebdcd0] text-center text-[12px] text-stone-500">
            <p className="font-serif font-bold text-[var(--primary)] text-[13px]">
              Thank you for choosing Khwab Stitch! / ख़्वाब स्टिच चुनने के लिए धन्यवाद!
            </p>
            <p className="mt-1">
              Handcrafted with 100% natural fabrics · सिलाई और डिलीवरी संबंधी जानकारी के लिए WhatsApp: +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

