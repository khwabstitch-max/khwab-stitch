import React, { useState, useRef } from "react";
import { Check, ZoomIn, Eye, Sparkles, RefreshCw, X, ChevronRight, UploadCloud, Trash2, Camera } from "lucide-react";
import DesignArt from "../DesignArt.jsx";

// Studio photos for Front Necklines (from Khwab Stitch Catalog)
const FRONT_NECK_PHOTOS = {
  round: "./images/neck_front/round.jpg",
  vneck: "./images/neck_front/vneck.jpg",
  boat: "./images/neck_front/boat.jpg",
  collar: "./images/neck_front/collar.jpg",
  square: "./images/neck_front/square.jpg",
  sweetheart: "./images/neck_front/sweetheart.jpg",
  high: "./images/neck_front/high.jpg",
  mandarin: "./images/neck_front/mandarin.jpg",
};

// Studio photos for Back Necklines (from Khwab Stitch Catalog)
const BACK_NECK_PHOTOS = {
  simple: "./images/neck_back/simple.jpg",
  "round-back": "./images/neck_back/round-back.jpg",
  "v-back": "./images/neck_back/v-back.jpg",
  "square-back": "./images/neck_back/square-back.jpg",
  deep: "./images/neck_back/deep.jpg",
  button: "./images/neck_back/button.jpg",
  cutout: "./images/neck_back/cutout.jpg",
  "as-photo": "./images/neck_back/as-photo.jpg",
};

// Studio photos for Sleeve Lengths (Front View & Side View from Catalog)
const SLEEVE_LENGTH_PHOTOS = {
  sleeveless: {
    front: "./images/sleeve_lengths/sleeveless_front.jpg",
    side: "./images/sleeve_lengths/sleeveless_side.jpg",
    measurements: "Length: 0 cm (0\") · Shoulder: 38 cm",
  },
  quarter: {
    front: "./images/sleeve_lengths/quarter_front.jpg",
    side: "./images/sleeve_lengths/quarter_side.jpg",
    measurements: "Length: 10 cm (4\") · Opening: 28 cm",
  },
  half: {
    front: "./images/sleeve_lengths/half_front.jpg",
    side: "./images/sleeve_lengths/half_side.jpg",
    measurements: "Length: 20 cm (7.9\") · Opening: 30 cm",
  },
  "three-quarter": {
    front: "./images/sleeve_lengths/three_quarter_front.jpg",
    side: "./images/sleeve_lengths/three_quarter_side.jpg",
    measurements: "Length: 38 cm (15\") · Opening: 24 cm",
  },
  full: {
    front: "./images/sleeve_lengths/full_front.jpg",
    side: "./images/sleeve_lengths/full_side.jpg",
    measurements: "Length: 55 cm (21.7\") · Opening: 22 cm",
  },
};

// Studio photos for Sleeve Designs (Front View & Side View from Studio Catalogs)
const SLEEVE_DESIGN_PHOTOS = {
  straight: {
    front: "./images/sleeves/straight_front.jpg",
    side: "./images/sleeves/straight_side.jpg",
  },
  puff: {
    front: "./images/sleeves/puff_front.jpg",
    side: "./images/sleeves/puff_front.jpg",
  },
  bell: {
    front: "./images/sleeves/bell_front.jpg",
    side: "./images/sleeves/bell_front.jpg",
  },
  ruffle: {
    front: "./images/sleeves/ruffle_front.jpg",
    side: "./images/sleeves/ruffle_side.jpg",
  },
  cap: {
    front: "./images/sleeves/cap_front.jpg",
    side: "./images/sleeves/cap_side.jpg",
  },
  bishop: {
    front: "./images/sleeves/bishop_front.jpg",
    side: "./images/sleeves/bishop_side.jpg",
  },
  butterfly: {
    front: "./images/sleeves/butterfly_front.jpg",
    side: "./images/sleeves/butterfly_side.jpg",
  },
  cold: {
    front: "./images/sleeves/cold_front.jpg",
    side: "./images/sleeves/cold_side.jpg",
  },
  flutter: {
    front: "./images/sleeves/flutter_front.jpg",
    side: "./images/sleeves/flutter_front.jpg",
  },
  "bell-cuff": {
    front: "./images/sleeves/bell_cuff_front.jpg",
    side: "./images/sleeves/bell_cuff_front.jpg",
  },
  pleated: {
    front: "./images/sleeves/pleated_front.jpg",
    side: "./images/sleeves/pleated_front.jpg",
  },
};

function ChoiceGroup({
  title,
  hindiTitle,
  groupType,
  value,
  options,
  onSelect,
  onOpenDetail,
  icon,
  supportsViews = false,
  activeView = "front",
  onToggleView,
  design,
}) {
  return (
    <section className="design-group mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-[#f0e7df]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)] text-[14px]">
            {icon}
          </span>
          <div>
            <h3 className="text-[17px] font-bold text-[var(--primary-dark)]">
              {title} / {hindiTitle}
            </h3>
          </div>
        </div>

        {/* View Switcher Toggle */}
        {supportsViews && (
          <div className="inline-flex items-center rounded-xl bg-[#f2eae1] p-1 border border-[#e4d8cc] text-[12px] font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onToggleView("front")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeView === "front"
                  ? "bg-white text-[var(--primary)] shadow-sm font-extrabold"
                  : "text-[var(--text-light)] hover:text-[var(--text)]"
              }`}
            >
              <span>👤 Front View / सामने से</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView("side")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeView === "side"
                  ? "bg-white text-[var(--primary)] shadow-sm font-extrabold"
                  : "text-[var(--text-light)] hover:text-[var(--text)]"
              }`}
            >
              <span>🔄 Side View / साइड से</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Design Options */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
        {options.map((option) => {
          const selected = value === option.id;

          // Determine photo based on section
          let photoSrc = null;
          if (groupType === "neckFront") {
            photoSrc = FRONT_NECK_PHOTOS[option.id];
          } else if (groupType === "neckBack") {
            if (option.id === "as-photo" && design?.backPhoto) {
              photoSrc = design.backPhoto;
            } else {
              photoSrc = BACK_NECK_PHOTOS[option.id];
            }
          } else if (groupType === "sleeveLength") {
            const lengthPhoto = SLEEVE_LENGTH_PHOTOS[option.id];
            photoSrc = activeView === "side" ? lengthPhoto?.side : lengthPhoto?.front;
          } else if (groupType === "sleeveDesign") {
            const sleeve = SLEEVE_DESIGN_PHOTOS[option.id];
            photoSrc = activeView === "side" ? (sleeve?.side || sleeve?.front) : (sleeve?.front || sleeve?.side);
          }

          const hasCustomPhoto = groupType === "neckBack" && option.id === "as-photo" && Boolean(design?.backPhoto);

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer bg-white ${
                selected
                  ? "border-[var(--primary)] ring-3 ring-[var(--primary)]/15 shadow-md transform -translate-y-0.5"
                  : "border-[#e9ddd3] hover:border-[var(--primary)]/50 hover:shadow-sm"
              }`}
            >
              {/* Card Artwork / Preview with 100% clean image (ZERO TEXT OVERLAY) */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#faf7f2] p-2 flex items-center justify-center">
                {photoSrc ? (
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                    <img
                      src={photoSrc}
                      alt={option.en}
                      className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <DesignArt
                    type={groupType}
                    id={option.id}
                    view={activeView}
                    className="transition-transform duration-300 group-hover:scale-102"
                  />
                )}

                {/* Selected Checkmark Badge */}
                {selected && (
                  <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md ring-2 ring-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}

                {/* Custom Photo Uploaded Badge */}
                {hasCustomPhoto && (
                  <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9.5px] font-bold text-white shadow-md">
                    ✓ Custom Photo
                  </span>
                )}

                {/* Preview / Zoom Button */}
                <button
                  type="button"
                  aria-label={`Preview ${option.en} larger`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetail(option, groupType);
                  }}
                  className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-stone-700 shadow-sm border border-stone-200 hover:bg-[var(--primary)] hover:text-white transition-colors backdrop-blur-xs opacity-80 hover:opacity-100"
                  title="View Larger / बड़ा देखें"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* Card Body - Content & Base Details */}
              <div className="p-3 border-t border-[#f4ece3] bg-white flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-serif text-[13.5px] font-bold text-[var(--primary-dark)] group-hover:text-[var(--primary)] transition-colors leading-tight">
                    {option.en} / {option.hiScript || option.hi}
                  </h4>
                  {/* Base description */}
                  <p className="text-[11px] text-[var(--text-light)] mt-1.5">
                    {groupType === "sleeveLength" && option.cm ? (
                      <span>Length / लंबाई: <b>{option.cm}</b></span>
                    ) : groupType === "neckBack" && option.id === "as-photo" ? (
                      hasCustomPhoto ? (
                        <span className="text-emerald-700 font-bold truncate block">
                          ✓ {design.backPhotoName || "Photo Attached"}
                        </span>
                      ) : (
                        <span className="text-[var(--primary)] font-semibold flex items-center gap-1">
                          <Camera size={12} /> Upload Photo / अपलोड करें
                        </span>
                      )
                    ) : (
                      <span>Base: Natural Cotton / शुद्ध सूती कपड़ा</span>
                    )}
                  </p>
                </div>

                <div className="mt-2.5">
                  <span
                    className={`block w-full text-center py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                      selected
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-light)]/60 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                    }`}
                  >
                    {selected ? "✓ Selected / चयनित" : "Select / चुनें"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DesignSelectionStep({
  design,
  setDesign,
  selectDesign,
  onPreview,
  neckFront,
  neckBack,
  sleeveLengthData,
  sleeveDesign,
}) {
  const [sleeveLengthView, setSleeveLengthView] = useState("front");
  const [sleeveDesignView, setSleeveDesignView] = useState("side");
  const [detailModal, setDetailModal] = useState(null);
  const backFileInputRef = useRef(null);

  const handleBackPhotoProcess = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file (JPG, PNG, WEBP) / कृपया इमेज फ़ाइल ही चुनें।");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDimension = 900;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
          const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

          setDesign((prev) => ({
            ...prev,
            neckBack: "as-photo",
            backPhoto: compressedDataUrl,
            backPhotoName: file.name,
            backPhotoSize: `${sizeKb} KB`,
          }));
        } catch (err) {
          console.error("Back photo processing error:", err);
          setDesign((prev) => ({
            ...prev,
            neckBack: "as-photo",
            backPhoto: e.target.result,
            backPhotoName: file.name,
            backPhotoSize: `${Math.round(file.size / 1024)} KB`,
          }));
        }
      };
      img.onerror = () => {
        alert("Could not load image / इमेज लोड नहीं हो सकी, कृपया दूसरी फ़ोटो आज़माएं।");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackPhoto = () => {
    setDesign((prev) => ({
      ...prev,
      backPhoto: "",
      backPhotoName: "",
      backPhotoSize: "",
    }));
  };

  const openDetail = (option, groupType) => {
    setDetailModal({ option, groupType });
  };

  return (
    <div className="space-y-6">
      {/* Main Design Section */}
      <section className="step-card rounded-[28px] border bg-white p-6 md:p-8 shadow-sm">
        {/* Step Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#f2e7e1] pb-5">
          <div className="flex items-center gap-3.5">
            <span className="step-icon">
              <Sparkles size={20} />
            </span>
            <div>
              <p className="step-eyebrow">STEP 04 · CHOOSE YOUR DESIGN / डिज़ाइन चुनें</p>
              <h2 className="font-serif text-[24px] sm:text-[27px] font-bold text-[var(--primary-dark)] leading-tight">
                Choose your design / अपना डिज़ाइन चुनें
              </h2>
              <p className="mt-0.5 text-[13px] text-[var(--text-light)]">
                Tap a style to select it, or use the preview button to view it larger / स्टाइल चुनने के लिए कार्ड पर टैप करें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#fbf5f0] px-3.5 py-1 text-[11px] font-bold text-[var(--primary)] border border-[#eedfd6]">
            <span>100% Premium Cotton / शुद्ध सूती कपड़ा</span>
          </div>
        </div>
        {/* 1. FRONT NECKLINE (STUDIO CATALOG PHOTOS) */}
        <ChoiceGroup
          title="Front neckline"
          hindiTitle="गले का अगला डिज़ाइन"
          icon="✿"
          groupType="neckFront"
          value={design.neckFront}
          options={neckFront}
          onSelect={(value) => selectDesign("neckFront", value)}
          onOpenDetail={openDetail}
          design={design}
        />

        {/* 2. BACK NECKLINE (STUDIO CATALOG PHOTOS) */}
        <ChoiceGroup
          title="Back neckline"
          hindiTitle="गले का पिछला डिज़ाइन"
          icon="✧"
          groupType="neckBack"
          value={design.neckBack}
          options={neckBack}
          onSelect={(value) => selectDesign("neckBack", value)}
          onOpenDetail={openDetail}
          design={design}
        />

        {/* CUSTOM BACK PHOTO UPLOADER (WHEN "AS PER PHOTO" IS SELECTED) */}
        {design.neckBack === "as-photo" && (
          <div className="mt-2 mb-8 rounded-2xl border-2 border-dashed border-[var(--primary)]/45 bg-[#fffbf7] p-4 sm:p-5 shadow-xs transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#eeddd0] pb-3 mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-white text-[14px] shadow-2xs">
                  <Camera size={17} />
                </span>
                <div>
                  <h4 className="font-serif text-[14px] sm:text-[15px] font-bold text-[var(--primary-dark)]">
                    Upload Back Neck Design Photo / पिछले गले का फ़ोटो अपलोड करें
                  </h4>
                  <p className="text-[12px] text-[var(--text-light)]">
                    Upload your reference photo (from Pinterest, Instagram, or phone) / अपनी पसंद का फ़ोटो चुनें
                  </p>
                </div>
              </div>

              <input
                type="file"
                ref={backFileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleBackPhotoProcess(e.target.files[0]);
                  e.target.value = "";
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => backFileInputRef.current?.click()}
                className="w-full sm:w-auto h-9 px-4 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <UploadCloud size={15} />
                <span>{design.backPhoto ? "Change Photo / फ़ोटो बदलें" : "Upload Photo / फ़ोटो चुनें"}</span>
              </button>
            </div>

            {design.backPhoto ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 rounded-xl bg-white p-3.5 border border-[#eedfd6] shadow-2xs">
                <div className="relative group shrink-0">
                  <img
                    src={design.backPhoto}
                    alt="Uploaded Back Design"
                    className="h-20 w-20 rounded-xl object-contain border border-[#ebdcd0] bg-[#faf7f2] shadow-2xs cursor-zoom-in"
                    onClick={() => onPreview && onPreview("Custom Back Design Photo / पिछला गला", design.backPhoto, design.backPhotoName)}
                  />
                  <button
                    type="button"
                    onClick={() => onPreview && onPreview("Custom Back Design Photo / पिछला गला", design.backPhoto, design.backPhotoName)}
                    className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-black/75 text-white flex items-center justify-center text-[10px] shadow-sm"
                    title="Enlarge / बड़ा देखें"
                  >
                    <Eye size={11} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> Photo Ready / फ़ोटो संलग्न है
                    </span>
                    {design.backPhotoSize && (
                      <span className="text-[11px] text-stone-500 font-medium">({design.backPhotoSize})</span>
                    )}
                  </div>
                  <p className="font-bold text-[13px] text-stone-900 truncate mt-1">
                    {design.backPhotoName || "custom-back-neck.jpg"}
                  </p>
                  <p className="text-[11.5px] text-stone-500 mt-0.5">
                    Our master tailor will stitch the back neck exactly according to this photo.
                    / मास्टर दर्जी ठीक इसी फ़ोटो के अनुसार आपका पिछला गला तैयार करेंगे।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveBackPhoto}
                  className="w-full sm:w-auto text-[12px] text-red-600 hover:text-red-700 font-bold flex items-center justify-center gap-1 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Photo / फ़ोटो हटाएं"
                >
                  <Trash2 size={14} />
                  <span>Remove / हटाएं</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => backFileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#e0d2c5] bg-white hover:bg-[#fffdfa] hover:border-[var(--primary)] transition-all cursor-pointer text-center group"
              >
                <div className="h-12 w-12 rounded-full bg-[#fcf5ef] text-[var(--primary)] flex items-center justify-center mb-2 shadow-2xs group-hover:scale-105 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <p className="text-[13.5px] font-bold text-[var(--primary-dark)]">
                  Click here to browse & upload back neck photo / पिछले गले का फ़ोटो अपलोड करने के लिए क्लिक करें
                </p>
                <p className="text-[11.5px] text-[var(--text-light)] mt-1">
                  Supports JPG, PNG, WEBP (Max 10 MB) · Automatic size optimization
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. SLEEVE LENGTH (WITH FRONT & SIDE VIEW TOGGLE + CATALOG PHOTOS) */}
        <ChoiceGroup
          title="Sleeve length"
          hindiTitle="बाज़ू की लंबाई"
          icon="↟"
          groupType="sleeveLength"
          value={design.sleeveLength}
          options={sleeveLengthData}
          onSelect={(value) => selectDesign("sleeveLength", value)}
          onOpenDetail={openDetail}
          supportsViews={true}
          activeView={sleeveLengthView}
          onToggleView={setSleeveLengthView}
        />

        {/* 4. SLEEVE DESIGN (WITH FRONT & SIDE VIEW TOGGLE + STUDIO PHOTOS) */}
        <ChoiceGroup
          title="Sleeve design"
          hindiTitle="बाज़ू का डिज़ाइन"
          icon="❋"
          groupType="sleeveDesign"
          value={design.sleeveDesign}
          options={sleeveDesign}
          onSelect={(value) => selectDesign("sleeveDesign", value)}
          onOpenDetail={openDetail}
          supportsViews={true}
          activeView={sleeveDesignView}
          onToggleView={setSleeveDesignView}
        />

        {/* Additional Fitting and Notes */}
        <div className="mt-8 pt-6 border-t border-[#f0e7df] grid gap-5 md:grid-cols-2">
          <label className="form-field">
            <span>Preferred fit / सिलाई की फ़िटिंग</span>
            <select
              value={design.fit}
              onChange={(event) => setDesign({ ...design, fit: event.target.value })}
              className="font-medium"
            >
              <option>Fitted / बॉडी से चिपकी (Tight Fit)</option>
              <option>Regular / सामान्य (Comfortable)</option>
              <option>Relaxed / थोड़ी ढीली</option>
              <option>Loose / ढीली</option>
              <option>Oversized / बहुत ढीली</option>
              <option>As per Photo / फ़ोटो जैसी</option>
              <option>Need Guidance / मास्टर जी से सलाह</option>
            </select>
          </label>

          <label className="form-field">
            <span>Extra design notes / अन्य विशेष निर्देश <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small></span>
            <input
              value={design.additionalInstructions}
              onChange={(event) => setDesign({ ...design, additionalInstructions: event.target.value })}
              placeholder="Gotta patti, lace, contrast piping, latkan / गोटा पट्टी, लेस, पाइपिंग, लटकन..."
            />
          </label>
        </div>
      </section>

      {/* DETAIL LIGHTBOX MODAL */}
      {detailModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="relative w-full max-w-[640px] overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 bg-[#faf7f2]">
              <div>
                <h3 className="font-serif text-[18px] font-bold text-[var(--primary-dark)]">
                  {detailModal.option.en} / {detailModal.option.hiScript || detailModal.option.hi}
                </h3>
                {detailModal.option.cm && (
                  <p className="text-[12px] text-[var(--secondary)] font-semibold mt-0.5">
                    Length / लंबाई: {detailModal.option.cm}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {detailModal.groupType === "neckFront" ? (
                /* FRONT NECK */
                <div>
                  <div className="mx-auto max-w-[340px] overflow-hidden rounded-2xl border border-[#e8ded2] bg-[#fbf9f6] p-3 text-center shadow-sm">
                    <div className="aspect-[4/3] w-full mb-2 overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                      <img
                        src={FRONT_NECK_PHOTOS[detailModal.option.id]}
                        alt={detailModal.option.en}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-[12px] font-bold text-stone-700">
                      Crafted on Mannequin with Handcrafted Embroidery / हाथ की बारीक कढ़ाई
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-3 text-center text-[12px] text-stone-600">
                    <b>Base:</b> Classic Kurti & Blouse Cut · <b>Neckline Style:</b> {detailModal.option.en}
                  </div>
                </div>
              ) : detailModal.groupType === "neckBack" ? (
                /* BACK NECK */
                <div>
                  <div className="mx-auto max-w-[340px] overflow-hidden rounded-2xl border border-[#e8ded2] bg-[#fbf9f6] p-3 text-center shadow-sm">
                    <div className="aspect-[3/4] w-full mb-2 overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                      <img
                        src={
                          (detailModal.option.id === "as-photo" && design?.backPhoto) ||
                          BACK_NECK_PHOTOS[detailModal.option.id]
                        }
                        alt={detailModal.option.en}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-[12px] font-bold text-stone-700">
                      Bespoke Tailored Back Design / पीठ का सुंदर और सटीक डिज़ाइन
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-3 text-center text-[12px] text-stone-600">
                    <b>Base:</b> Classic Kurti & Blouse Cut · <b>Back Style:</b> {detailModal.option.en}
                  </div>
                </div>
              ) : detailModal.groupType === "sleeveLength" ? (
                /* SLEEVE LENGTH */
                <div>
                  <p className="text-[12px] font-bold text-stone-500 mb-3 uppercase tracking-wider text-center">
                    Front & Side Studio Views on Mannequin / सामने व साइड का दृश्य
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Front Photo */}
                    <div className="rounded-2xl border border-[#e8ded2] bg-[#fbf9f6] p-3 text-center">
                      <div className="aspect-[4/5] w-full mb-2 overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                        <img
                          src={SLEEVE_LENGTH_PHOTOS[detailModal.option.id]?.front}
                          alt="Front View"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="inline-block rounded-full bg-white border border-[#ded3c6] px-3 py-1 text-[11px] font-bold text-stone-700 shadow-2xs">
                        👤 Front View / सामने से
                      </span>
                    </div>

                    {/* Side Photo */}
                    <div className="rounded-2xl border border-[#e8ded2] bg-[#fbf9f6] p-3 text-center">
                      <div className="aspect-[4/5] w-full mb-2 overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                        <img
                          src={SLEEVE_LENGTH_PHOTOS[detailModal.option.id]?.side}
                          alt="Side View"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="inline-block rounded-full bg-white border border-[#ded3c6] px-3 py-1 text-[11px] font-bold text-stone-700 shadow-2xs">
                        🔄 Side View / साइड से
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-3 text-center text-[12px] text-stone-600">
                    <b>Base:</b> Classic Kurti & Blouse Cut · <b>Sleeve Length:</b> {detailModal.option.cm}
                  </div>
                </div>
              ) : detailModal.groupType === "sleeveDesign" ? (
                /* SLEEVE DESIGN */
                <div>
                  <p className="text-[12px] font-bold text-stone-500 mb-3 uppercase tracking-wider text-center">
                    Front & Side Studio Views on Mannequin / सामने व साइड का दृश्य
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Front Photo */}
                    <div className="rounded-2xl border border-[#e8ded2] bg-[#fbf9f6] p-3 text-center">
                      <div className="aspect-[4/3] w-full mb-2 overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                        <img
                          src={SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.front || SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.side}
                          alt="Front View"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="inline-block rounded-full bg-white border border-[#ded3c6] px-3 py-1 text-[11px] font-bold text-stone-700 shadow-2xs">
                        👤 Front View / सामने से
                      </span>
                    </div>

                    {/* Side Photo */}
                    <div className="rounded-2xl border border-[#e8ded2] bg-[#fbf9f6] p-3 text-center">
                      <div className="aspect-[4/3] w-full mb-2 overflow-hidden rounded-xl bg-white border border-[#ece3d9] flex items-center justify-center">
                        <img
                          src={SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.side || SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.front}
                          alt="Side View"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="inline-block rounded-full bg-white border border-[#ded3c6] px-3 py-1 text-[11px] font-bold text-stone-700 shadow-2xs">
                        🔄 Side View / साइड से
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-3 text-center text-[12px] text-stone-600">
                    <b>Base:</b> Natural Cotton Studio Cut · <b>Sleeve Style:</b> {detailModal.option.en} / {detailModal.option.hiScript || detailModal.option.hi}
                  </div>
                </div>
              ) : null}

              {/* Action Button */}
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => {
                    selectDesign(detailModal.groupType, detailModal.option.id);
                    setDetailModal(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-[13px] font-bold text-white shadow-md hover:opacity-95 transition-all"
                >
                  <Check size={16} strokeWidth={3} /> Choose this style / यह स्टाइल चुनें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
