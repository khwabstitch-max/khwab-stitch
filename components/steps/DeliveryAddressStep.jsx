import React, { useState } from "react";
import { MapPin, CheckCircle2, Edit2, ShieldCheck } from "lucide-react";

export default function DeliveryAddressStep({
  customer,
  setCustomer,
  delivery,
  setDelivery,
  outfit,
  design,
  measurements,
}) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Sync customer address to delivery if delivery address is empty
  const activeAddress = delivery.address || customer.address || "";
  const activeLandmark = delivery.landmark || customer.landmark || "";

  const handleAddressChange = (value) => {
    setDelivery((prev) => ({ ...prev, address: value }));
    setCustomer((prev) => ({ ...prev, address: value }));
  };

  const handleLandmarkChange = (value) => {
    setDelivery((prev) => ({ ...prev, landmark: value }));
    setCustomer((prev) => ({ ...prev, landmark: value }));
  };

  return (
    <section className="step-card rounded-[28px] border bg-white p-6 md:p-8 shadow-sm">
      {/* SECTION HEADER */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
        <div className="flex items-center gap-3.5">
          <span className="step-icon">
            <MapPin size={20} />
          </span>
          <div>
            <p className="step-eyebrow">STEP 06 · DELIVERY & SUMMARY / डिलीवरी व सारांश</p>
            <h2 className="font-serif text-[24px] sm:text-[27px] font-bold text-[var(--primary-dark)] leading-tight">
              Confirm delivery & review order / डिलीवरी कन्फर्म करें और ऑर्डर देखें
            </h2>
            <p className="text-[13px] text-[var(--text-light)] mt-0.5">
              Review your delivery address and order details before confirming / अपना डिलीवरी पता और ऑर्डर विवरण जांचें
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6eee8] px-3 py-1 text-[11px] font-bold text-[var(--primary)] border border-[#ebdcd0]">
          <ShieldCheck size={14} />
          <span>Doorstep Delivery / सुरक्षित डिलीवरी</span>
        </div>
      </div>

      {/* CONFIRMED DELIVERY ADDRESS CARD */}
      <div className="rounded-2xl border-2 border-[#e6dacd] bg-[#fdfbf9] p-5 shadow-xs mb-7">
        <div className="flex items-center justify-between pb-3 border-b border-[#ece2d6]">
          <div className="flex items-center gap-2 text-[var(--primary-dark)] font-bold text-[14px]">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Full delivery address / पूरा डिलीवरी पता</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
            className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[var(--primary)] hover:underline bg-white px-3 py-1 rounded-lg border border-[#ded2c4] shadow-2xs transition-colors"
          >
            <Edit2 size={12} />
            {isEditingAddress ? "Done / पूरा हुआ" : "Edit / पता बदलें"}
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
                  {customer.cityState} — PIN: {customer.pin}
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-[13.5px] leading-relaxed text-stone-800">
            <div className="flex items-center gap-2 font-bold text-[14.5px] text-[var(--primary-dark)]">
              <span>{customer.name || "Customer / ग्राहक"}</span>
              <span className="font-semibold text-stone-500 text-[12px]">📱 {customer.whatsapp}</span>
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
              {customer.cityState} — <b>PIN: {customer.pin}</b>
            </p>
          </div>
        )}
      </div>

      {/* ORDER SUMMARY */}
      <div className="order-summary rounded-2xl border-2 border-[#e8ded2] bg-[#fcf9f7] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#ece2d6]">
          <h3 className="font-serif text-[16px] font-bold text-[var(--primary-dark)] m-0">
            Order Review at a glance / आपके ऑर्डर का विवरण
          </h3>
          <span className="text-[11px] font-bold text-[var(--primary)] bg-white px-2.5 py-1 rounded-full border border-[#ebdcd0]">
            Khwab Stitch Atelier
          </span>
        </div>

        <div className="space-y-2.5 text-[13px]">
          <div className="flex justify-between border-b border-[#ece2d6] pb-2">
            <span className="text-[var(--text-light)]">Selected Outfit / परिधान:</span>
            <b className="text-[var(--primary-dark)]">
              {outfit.type || "Not selected / चुना नहीं गया"} × {outfit.pieces || 1}
            </b>
          </div>

          {outfit.uploadedPhoto ? (
            <div className="flex justify-between border-b border-[#ece2d6] pb-2 items-center">
              <span className="text-[var(--text-light)]">Design Reference / रेफ़रेंस फ़ोटो:</span>
              <b className="flex items-center gap-2 text-emerald-800">
                <img
                  src={outfit.uploadedPhoto}
                  className="h-8 w-8 rounded-lg object-cover border border-[#d6c7bc] shadow-2xs"
                  alt="Reference thumbnail"
                />
                <span>Attached / फ़ोटो संलग्न ({outfit.uploadedPhotoName || "Design Photo"})</span>
              </b>
            </div>
          ) : (
            <div className="flex justify-between border-b border-[#ece2d6] pb-2">
              <span className="text-[var(--text-light)]">Design Reference / रेफ़रेंस:</span>
              <b className="text-stone-700">{outfit.refPhoto || "As per design selection / डिज़ाइन के अनुसार"}</b>
            </div>
          )}

          <div className="flex justify-between border-b border-[#ece2d6] pb-2">
            <span className="text-[var(--text-light)]">Selected Styling / डिज़ाइन:</span>
            <b className="text-stone-800">
              {[design.neckFront, design.neckBack, design.sleeveLength, design.sleeveDesign].filter(Boolean).length}{" "}
              styling choices chosen / विकल्प चुने गए
            </b>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--text-light)]">Measurement Method / नाप का तरीक़ा:</span>
            <b className="text-[var(--primary-dark)]">
              {measurements.provideMethod?.includes("भेजूंगी")
                ? "Sending Clothes / अपने कपड़े भेजूंगी"
                : measurements.provideMethod?.includes("वीडियो कॉल")
                ? "Video Call / वीडियो कॉल सहायता"
                : `Self Measurement / खुद से नाप (${Object.values(measurements.values || {}).filter(Boolean).length} filled)`}
            </b>
          </div>
        </div>
      </div>
    </section>
  );
}
