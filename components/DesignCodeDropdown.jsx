import React, { useState, useRef, useEffect } from "react";
import { Check, Eye, ChevronDown, ChevronUp, Sparkles, X, Lock, AlertCircle } from "lucide-react";

import { DESIGN_CODES as CATALOG_DESIGN_CODES, OUTFITS } from "../config/fashionCatalog.js";
export { CATALOG_DESIGN_CODES };

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

  // Auto-clear invalid design code ONLY if a different incompatible outfit type is selected
  useEffect(() => {
    if (!outfit?.type || !outfit?.designCode) return;

    const code = outfit.designCode.toUpperCase();
    const currentOutfit = OUTFITS.find((o) => o.id === outfit?.type);
    const expectedPrefix = currentOutfit?.designCodePrefix || "";
    const isValid = expectedPrefix ? code.startsWith(expectedPrefix) : true;

    if (!isValid) {
      setOutfit((prev) => ({ ...prev, designCode: "" }));
    }
  }, [outfit?.type]);

  // Determine expected prefix based on selected outfit
  const currentOutfit = OUTFITS.find((o) => o.id === outfit?.type);
  const expectedPrefix = currentOutfit?.designCodePrefix || "";

  const prefixLabel = currentOutfit
    ? `${expectedPrefix}- Codes for ${currentOutfit.en} / ${currentOutfit.hi} के लिए ${expectedPrefix}- कोड`
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
    setOutfit((prev) => {
      if (prev.designCode === item.code) {
        return { ...prev, designCode: "" };
      }
      return {
        ...prev,
        designCode: item.code,
        uploadedPhoto: "",
        uploadedPhotoName: "",
        uploadedPhotoSize: "",
        refPhoto: "",
      };
    });
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

        <div className="flex items-start gap-2.5 rounded-xl border-2 border-dashed border-[#e6dcd3] bg-[#faf6f2] p-3 text-stone-600 text-[12.5px] leading-relaxed">
          <AlertCircle size={17} className="text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-stone-800">
              <b>Please select an outfit above first</b> (Blouse, Kurti, or Suit Kameez). Matching <b>(B-, K-, SU-)</b> codes will appear here based on your selection.
            </p>
            <p className="text-[12px] text-stone-600">
              <b>कृपया पहले ऊपर परिधान चुनें</b> (ब्लाउज़, कुर्ती या सूट कमीज़)। आपके चुने हुए परिधान के अनुसार ही यहाँ <b>(B-, K-, SU-)</b> कोड दिखाई देंगे।
            </p>
          </div>
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
                No catalog items found for {outfit.type} / कोई कैटलॉग डिज़ाइन कोड नहीं मिला।
              </p>
            )}
          </div>

                  </div>
      )}
    </div>
  );
}
