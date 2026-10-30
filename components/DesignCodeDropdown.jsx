import React, { useState, useRef, useEffect } from "react";
import { Check, Eye, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";

export const CATALOG_DESIGN_CODES = [
  {
    code: "K-01",
    name: "Classic Cotton Printed Kurti",
    hi: "क्लासिक कॉटन प्रिंटेड कुर्ती",
    outfit: "Kurti",
    image: "./images/designs/k-01.jpg",
    details: "Mandarin collar, button placket, 3/4 sleeves, straight side-slit cut",
    tag: "Studio Choice / लोकप्रिय",
  },
];

export default function DesignCodeDropdown({
  outfit,
  setOutfit,
  onOpenZoom,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedCatalogItem = CATALOG_DESIGN_CODES.find(
    (c) => c.code.toLowerCase() === (outfit.designCode || "").toLowerCase()
  );

  const handleSelectCode = (item) => {
    setOutfit((prev) => ({
      ...prev,
      designCode: item.code,
      type: prev.type || item.outfit,
    }));
    setIsOpen(false);
  };

  const handleClear = () => {
    setOutfit((prev) => ({ ...prev, designCode: "" }));
  };

  return (
    <div className="form-field relative" ref={dropdownRef}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-[13px] text-stone-800">
          Design code / डिज़ाइन कोड{" "}
          <small className="text-[11px] font-normal text-stone-500">
            (Studio Catalog / कैटलॉग)
          </small>
        </span>
        {outfit.designCode && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-red-600 hover:underline font-semibold flex items-center gap-0.5"
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
        ) : outfit.designCode ? (
          <div className="text-left py-1">
            <span className="font-bold text-[13px] text-[var(--primary-dark)] bg-stone-100 px-2 py-0.5 rounded">
              {outfit.designCode}
            </span>
            <span className="text-[12px] text-stone-500 ml-2">Custom Design Code</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone-400 py-1">
            <Sparkles size={15} className="text-[var(--secondary)]" />
            <span className="text-[13px]">
              Select Studio Design / कोड चुनें (e.g. K-01)...
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
                onOpenZoom(selectedCatalogItem.image);
              }}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-[var(--primary)] transition-colors"
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
            <span>Studio Design Catalog / कैटलॉग कोड</span>
            <span>Zoom & Select</span>
          </div>

          {/* CATALOG ITEMS LIST */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {CATALOG_DESIGN_CODES.map((item) => {
              const isItemActive =
                outfit.designCode?.toUpperCase() === item.code;
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
                    onClick={() => onOpenZoom(item.image)}
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
                      onClick={() => onOpenZoom(item.image)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition-colors"
                      title="Zoom / बड़ी फ़ोटो देखें"
                    >
                      <Eye size={13} />
                      <span className="hidden sm:inline">Zoom</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectCode(item)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all ${
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
            })}
          </div>

          {/* MANUAL CODE ENTRY */}
          <div className="pt-2 border-t border-stone-100">
            <span className="block text-[11px] font-bold text-stone-500 mb-1">
              Or enter your own design code / या अपना कोड लिखें:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={outfit.designCode || ""}
                onChange={(e) =>
                  setOutfit({ ...outfit, designCode: e.target.value.toUpperCase() })
                }
                placeholder="e.g. K-02, B-01..."
                className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-800 text-white text-[11.5px] font-bold"
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

