import React, { useState, useRef, useEffect } from "react";
import { Check, Eye, ChevronDown, ChevronUp, Sparkles, X, Lock, AlertCircle } from "lucide-react";

export const CATALOG_DESIGN_CODES = [
  // KURTI CODES (K-...)
  {
    code: "K-01",
    name: "Classic Cotton Printed Kurti",
    hi: "क्लासिक कॉटन प्रिंटेड कुर्ती",
    outfit: "Kurti",
    prefix: "K",
    image: "./images/designs/k-01.jpg",
    details: "Mandarin collar, button placket, 3/4 sleeves, straight side-slit cut",
    tag: "Studio Signature / सर्वाधिक लोकप्रिय",
  },
  {
    code: "K-02",
    name: "Festive Embroidered Straight Kurti",
    hi: "फ़ेस्टिव एम्ब्रॉयडर्ड स्ट्रेट कुर्ती",
    outfit: "Kurti",
    prefix: "K",
    image: "./images/kurti.jpg",
    details: "Round neck with V-slit, quarter sleeves, elegant side-slit hem",
    tag: "Designer Choice",
  },

  // BLOUSE CODES (B-...)
  {
    code: "B-01",
    name: "Royal Velvet Embroidered Blouse",
    hi: "रॉयल वेलवेट एम्ब्रॉयडर्ड ब्लाउज़",
    outfit: "Blouse",
    prefix: "B",
    image: "./images/blouse.jpg",
    details: "Sweetheart neckline, golden zardozi embroidery, elbow sleeves, dori back",
    tag: "Bridal & Festive / लोकप्रिय",
  },
  {
    code: "B-02",
    name: "Classic Saree Designer Choli",
    hi: "क्लासिक साड़ी डिज़ाइनर चोली",
    outfit: "Blouse",
    prefix: "B",
    image: "./images/blouse.jpg",
    details: "Deep round back with tassels, fitted bust cup padding, clean finish",
    tag: "Partywear",
  },

  // SUIT UPPER CODES (SU-...)
  {
    code: "SU-01",
    name: "Traditional Punjabi Straight Kameez",
    hi: "पारंपरिक पंजाबी स्ट्रेट कमीज़",
    outfit: "Suit Upper",
    prefix: "SU",
    image: "./images/suit-upper.jpg",
    details: "Boat neck with lace border, full sleeves, side chak open slits",
    tag: "Classic Punjabi / पारंपरिक",
  },
  {
    code: "SU-02",
    name: "Festive Embroidered Silk Suit Upper",
    hi: "फ़ेस्टिव एम्ब्रॉयडर्ड सिल्क सूट कमीज़",
    outfit: "Suit Upper",
    prefix: "SU",
    image: "./images/suit-upper.jpg",
    details: "Collar neck styling, straight fitted silhouette with side borders",
    tag: "Festive Wear",
  },
];

export default function DesignCodeDropdown({
  outfit,
  setOutfit,
  onOpenZoom,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Auto-clear invalid design code if outfit is unselected or changed to another type
  useEffect(() => {
    if (!outfit?.type) {
      if (outfit?.designCode) {
        setOutfit((prev) => ({ ...prev, designCode: "" }));
      }
      return;
    }

    if (outfit?.designCode) {
      const code = outfit.designCode.toUpperCase();
      let isValid = false;
      if (outfit.type === "Kurti" && code.startsWith("K")) isValid = true;
      if (outfit.type === "Blouse" && code.startsWith("B")) isValid = true;
      if (outfit.type === "Suit Upper" && code.startsWith("SU")) isValid = true;

      if (!isValid) {
        setOutfit((prev) => ({ ...prev, designCode: "" }));
      }
    }
  }, [outfit?.type]);

  // Determine expected prefix based on selected outfit
  const expectedPrefix =
    outfit?.type === "Kurti"
      ? "K"
      : outfit?.type === "Blouse"
      ? "B"
      : outfit?.type === "Suit Upper"
      ? "SU"
      : "";

  const prefixLabel =
    outfit?.type === "Kurti"
      ? "K- Codes for Kurti / कुर्ती के लिए K- कोड"
      : outfit?.type === "Blouse"
      ? "B- Codes for Blouse / ब्लाउज़ के लिए B- कोड"
      : outfit?.type === "Suit Upper"
      ? "SU- Codes for Suit Upper / सूट के लिए SU- कोड"
      : "";

  // Filter catalog items to only show codes matching the chosen outfit
  const visibleCodes = outfit?.type
    ? CATALOG_DESIGN_CODES.filter((c) => {
        if (outfit.type === "Kurti") return c.outfit === "Kurti" || c.code.startsWith("K-");
        if (outfit.type === "Blouse") return c.outfit === "Blouse" || c.code.startsWith("B-");
        if (outfit.type === "Suit Upper") return c.outfit === "Suit Upper" || c.code.startsWith("SU-");
        return false;
      })
    : [];

  const selectedCatalogItem = CATALOG_DESIGN_CODES.find(
    (c) => c.code.toLowerCase() === (outfit?.designCode || "").toLowerCase()
  );

  const handleSelectCode = (item) => {
    setOutfit((prev) => ({
      ...prev,
      designCode: item.code,
    }));
    setIsOpen(false);
  };

  const handleClear = () => {
    setOutfit((prev) => ({ ...prev, designCode: "" }));
  };

  // --------------------------------------------------------------------------
  // CASE 1: NO OUTFIT SELECTED YET -> LOCKED / DISABLED STATE
  // --------------------------------------------------------------------------
  if (!outfit?.type) {
    return (
      <div className="form-field relative">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[13px] text-stone-700 flex items-center gap-1.5">
            <Lock size={13} className="text-stone-400" />
            <span>Design code / डिज़ाइन कोड</span>
            <small className="text-[11px] font-normal text-stone-400">
              (Studio Catalog / कैटलॉग)
            </small>
          </span>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border-2 border-dashed border-[#e6dcd3] bg-[#faf6f2] p-3 text-stone-600 text-[12.5px]">
          <AlertCircle size={17} className="text-amber-700 shrink-0" />
          <span>
            <b>कृपया पहले ऊपर परिधान चुनें</b> (ब्लाउज़, कुर्ती या सूट कमीज़)। आपके चुने हुए परिधान के अनुसार ही यहाँ <b>(B-, K-, SU-)</b> कोड दिखाई देंगे।
          </span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // CASE 2: OUTFIT IS SELECTED -> SHOW FILTERED CODES
  // --------------------------------------------------------------------------
  return (
    <div className="form-field relative" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[13px] text-stone-800">
            Design code / डिज़ाइन कोड
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#f6eee8] text-[var(--primary)] border border-[#ebdcd0]">
            {prefixLabel}
          </span>
        </div>
        {outfit?.designCode && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-red-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <X size={12} />
            <span>Clear / हटाएं</span>
          </button>
        )}
      </div>

      {/* TRIGGER BUTTON */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between rounded-xl border-2 p-2.5 cursor-pointer bg-white transition-all select-none ${
          isOpen
            ? "border-[var(--primary)] ring-3 ring-[var(--primary)]/15 shadow-sm"
            : "border-[#e5d9ce] hover:border-[var(--primary)]/50"
        }`}
      >
        {selectedCatalogItem ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={selectedCatalogItem.image}
              alt={selectedCatalogItem.name}
              className="h-11 w-11 rounded-lg object-cover border border-[#e0d3c6] shadow-2xs flex-shrink-0"
            />
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold bg-[var(--primary)] text-white px-2 py-0.5 rounded text-[11px]">
                  {selectedCatalogItem.code}
                </span>
                <span className="font-bold text-[13px] text-stone-900 truncate">
                  {selectedCatalogItem.name}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {selectedCatalogItem.hi}
              </p>
            </div>
          </div>
        ) : outfit?.designCode ? (
          <div className="text-left py-1">
            <span className="font-bold text-[13px] text-[var(--primary-dark)] bg-stone-100 px-2 py-0.5 rounded">
              {outfit.designCode}
            </span>
            <span className="text-[12px] text-stone-500 ml-2">Custom Design Code</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-500 py-1">
            <Sparkles size={15} className="text-[var(--secondary)]" />
            <span className="text-[13px]">
              Select {outfit.type} Design Code ({expectedPrefix}-Codes)... / कोड चुनें
            </span>
          </div>
        )}

        {/* RIGHT ACTION: ZOOM & DROPDOWN CHEVRON */}
        <div className="flex items-center gap-1.5 flex-shrink-0 text-stone-400">
          {selectedCatalogItem && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenZoom) onOpenZoom(selectedCatalogItem.image);
              }}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-[var(--primary)] transition-colors cursor-pointer"
              title="Click to Zoom / बड़ी फ़ोटो देखें"
            >
              <Eye size={17} />
            </button>
          )}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 rounded-2xl border-2 border-[#ebdcd0] bg-white p-3 shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            <span>
              {outfit.type} Designs ({expectedPrefix}-Codes)
            </span>
            <span>Zoom & Select</span>
          </div>

          {/* CATALOG ITEMS LIST */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {visibleCodes.length > 0 ? (
              visibleCodes.map((item) => {
                const isItemActive =
                  outfit?.designCode?.toUpperCase() === item.code;
                return (
                  <div
                    key={item.code}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all ${
                      isItemActive
                        ? "bg-[#faf5f0] border-[var(--primary)] ring-1 ring-[var(--primary)]"
                        : "bg-white hover:bg-stone-50 border-stone-200"
                    }`}
                  >
                    {/* THUMBNAIL WITH ZOOM ICON */}
                    <div
                      className="relative flex-shrink-0 cursor-pointer group"
                      onClick={() => onOpenZoom && onOpenZoom(item.image)}
                      title="Click to Zoom Photo / बड़ी फ़ोटो देखने के लिए क्लिक करें"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] shadow-sm">
                        <Eye size={11} />
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[11.5px] bg-[var(--primary)] text-white px-2 py-0.5 rounded-md">
                          {item.code}
                        </span>
                        <span className="font-bold text-[13px] text-stone-900 truncate">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[11.5px] font-semibold text-[var(--secondary)] mt-0.5">
                        {item.hi}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {item.details}
                      </p>
                    </div>

                    {/* ACTION BUTTONS: ZOOM & SELECT */}
                    <div className="flex flex-col sm:flex-row items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenZoom && onOpenZoom(item.image)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition-colors cursor-pointer"
                        title="Zoom / बड़ी फ़ोटो देखें"
                      >
                        <Eye size={13} />
                        <span className="hidden sm:inline">Zoom</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectCode(item)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all cursor-pointer ${
                          isItemActive
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-xs"
                        }`}
                      >
                        {isItemActive ? (
                          <>
                            <Check size={13} strokeWidth={3} />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Select / चुनें</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-stone-500 text-[12px] py-4">
                No catalog items found for {outfit.type}.
              </p>
            )}
          </div>

          {/* MANUAL CODE ENTRY */}
          <div className="pt-2 border-t border-stone-100">
            <span className="block text-[11px] font-bold text-stone-600 mb-1">
              Or enter custom code (must start with {expectedPrefix}-):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={outfit?.designCode || ""}
                onChange={(e) => {
                  let val = e.target.value.toUpperCase();
                  setOutfit({ ...outfit, designCode: val });
                }}
                placeholder={`e.g. ${expectedPrefix}-01, ${expectedPrefix}-02...`}
                className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-[12.5px] font-mono outline-none focus:border-[var(--primary)] bg-white"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 text-white text-[11.5px] font-bold cursor-pointer"
              >
                Done / ठीक है
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
