import React, { useState, useRef } from "react";
import { Check, ZoomIn, Eye, Sparkles, RefreshCw, X, ChevronRight, UploadCloud, Trash2, Camera } from "lucide-react";
import DesignArt from "../DesignArt.jsx";

import {
  FRONT_NECK_PHOTOS,
  BACK_NECK_PHOTOS,
  SLEEVE_LENGTH_PHOTOS,
  SLEEVE_DESIGN_PHOTOS,
} from "../../config/fashionCatalog.js";

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
}) {
  return (
    <section className="design-group mb-2">
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
            photoSrc = BACK_NECK_PHOTOS[option.id];
          } else if (groupType === "sleeveLength") {
            const lengthPhoto = SLEEVE_LENGTH_PHOTOS[option.id];
            photoSrc = activeView === "side" ? lengthPhoto?.side : lengthPhoto?.front;
          } else if (groupType === "sleeveDesign") {
            const sleeve = SLEEVE_DESIGN_PHOTOS[option.id];
            photoSrc = activeView === "side" ? (sleeve?.side || sleeve?.front) : (sleeve?.front || sleeve?.side);
          }

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

              {/* Card Body - Content & Details */}
              <div className="p-3 border-t border-[#f4ece3] bg-white flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-serif text-[13.5px] font-bold text-[var(--primary-dark)] group-hover:text-[var(--primary)] transition-colors leading-tight">
                    {option.en} / {option.hiScript || option.hi}
                  </h4>
                  {groupType === "sleeveLength" && option.cm && (
                    <p className="text-[11px] text-[var(--text-light)] mt-1.5">
                      Length / लंबाई: <b>{option.cm}</b>
                    </p>
                  )}
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

// Sleek, compact "As per Photo / फोटो जैसा" component with Left title & Right upload button
function AsPerPhotoRow({
  groupType,
  titleEn,
  titleHi,
  designValue,
  photo,
  photoName,
  photoSize,
  onSelect,
  onProcessFile,
  onRemove,
  onPreview,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const isUploaded = Boolean(photo);
  const isSelected = designValue === "as-photo";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onProcessFile(file);
      setIsExpanded(true);
    }
    e.target.value = "";
  };

  return (
    <div className="mt-2.5 mb-8">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isUploaded ? (
        /* 1. UPLOADED & ATTACHED STATE (CLEAN COMPACT PREVIEW & TAILOR NOTE) */
        <div
          onClick={onSelect}
          className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            isSelected
              ? "border-[var(--primary)] bg-white ring-3 ring-[var(--primary)]/15 shadow-sm"
              : "border-[#ded1c4] bg-[#fdfbf9] hover:border-[var(--primary)]/60"
          }`}
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 border-b border-[#f0e6dc] bg-[#fcf9f5]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[13px] shadow-2xs">
                <Camera size={14} />
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-serif text-[14px] font-bold text-[var(--primary-dark)]">
                  As per Photo / फोटो जैसा
                </h4>
                <span className="inline-block rounded-md bg-[#f5ede4] px-2 py-0.5 text-[10.5px] font-bold text-[var(--primary)] border border-[#ebdcd0]">
                  {titleEn} / {titleHi}
                </span>
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                    <Check size={11} strokeWidth={3} /> Selected / चयनित
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-stone-500">
                    (Click to select / चुनने के लिए क्लिक करें)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="h-8 px-3.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <UploadCloud size={13} />
                <span>Change Photo / फ़ोटो बदलें</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="h-8 px-3 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                title="Remove Photo / फ़ोटो हटाएं"
              >
                <Trash2 size={13} />
                <span>Remove / हटाएं</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="relative group shrink-0">
              <img
                src={photo}
                alt={`Custom ${titleEn}`}
                className="h-16 w-16 sm:h-18 sm:w-18 rounded-xl object-contain border border-[#ebdcd0] bg-[#faf7f2] shadow-2xs cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview && onPreview(`Custom ${titleEn} Photo / ${titleHi}`, photo, photoName);
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview && onPreview(`Custom ${titleEn} Photo / ${titleHi}`, photo, photoName);
                }}
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
                {photoSize && (
                  <span className="text-[11px] text-stone-500 font-medium">({photoSize})</span>
                )}
              </div>
              <p className="font-bold text-[13px] text-stone-900 truncate mt-1">
                {photoName || `custom-${groupType}.jpg`}
              </p>
              <p className="text-[11.5px] text-stone-500 mt-0.5 leading-relaxed">
                Our master tailor will stitch the {titleEn.toLowerCase()} exactly according to this photo.
                / मास्टर दर्जी ठीक इसी फ़ोटो के अनुसार आपका {titleHi} तैयार करेंगे।
              </p>
            </div>

            {!isSelected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="w-full sm:w-auto h-8.5 px-4 rounded-xl bg-stone-100 hover:bg-[var(--primary)] text-stone-700 hover:text-white text-[11.5px] font-bold transition-all cursor-pointer"
              >
                Select This / यह चुनें
              </button>
            )}
          </div>
        </div>
      ) : isExpanded ? (
        /* 2. EXPANDED DROPZONE (WHEN OPENED TO BROWSE) */
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[var(--primary)]/45 bg-[#fffbf7] p-3.5 sm:p-4 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-3 border-b border-[#eeddd0] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-[12px]">
                <Camera size={14} />
              </span>
              <h4 className="font-serif text-[14px] font-bold text-[var(--primary-dark)]">
                As per Photo / फोटो जैसा
              </h4>
              <span className="inline-block rounded-md bg-[#f5ede4] px-2 py-0.5 text-[10.5px] font-bold text-[var(--primary)] border border-[#ebdcd0]">
                {titleEn} / {titleHi}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[11.5px] text-stone-500 hover:text-stone-800 font-bold px-2 py-1 rounded hover:bg-stone-100 cursor-pointer"
            >
              ✕ Close / बंद करें
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3.5 p-3.5 sm:p-4 rounded-xl border border-dashed border-[#d9c4b3] bg-white hover:bg-[#fffdfa] hover:border-[var(--primary)] transition-all cursor-pointer text-center group"
          >
            <div className="h-9 w-9 rounded-full bg-[#fcf5ef] text-[var(--primary)] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <UploadCloud size={18} />
            </div>
            <div className="text-left">
              <p className="text-[12.5px] font-bold text-[var(--primary-dark)]">
                Click here to browse & upload reference photo for {titleEn} / अपने {titleHi} का फ़ोटो चुनने के लिए क्लिक करें
              </p>
              <p className="text-[11px] text-[var(--text-light)]">
                Supports JPG, PNG, WEBP (Max 10 MB) · Automatic size optimization
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 3. SLEEK COMPACT DEFAULT ROW (LOW HEIGHT AS REQUESTED) */
        <div
          onClick={() => {
            setIsExpanded(true);
            fileInputRef.current?.click();
          }}
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 cursor-pointer ${
            isSelected
              ? "border-[var(--primary)] bg-white ring-2 ring-[var(--primary)]/15 shadow-sm"
              : "border-[#e6dad0] bg-[#fdfbf9] hover:border-[var(--primary)]/60 hover:bg-[#fffdfa] hover:shadow-2xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5">
            {/* Left: As per Photo / फोटो जैसा with section title */}
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-light)]/80 text-[var(--primary)] text-[14px] shrink-0 group-hover:scale-105 transition-transform">
                <Camera size={16} />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif text-[14px] font-bold text-[var(--primary-dark)]">
                    As per Photo / फोटो जैसा
                  </h4>
                  <span className="inline-block rounded-md bg-[#f5ede4] px-2 py-0.5 text-[10.5px] font-bold text-[var(--primary)] border border-[#ebdcd0]">
                    {titleEn} / {titleHi}
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--text-light)] mt-0.5">
                  Upload reference photo for {titleEn} / अपने {titleHi} का फ़ोटो अपलोड करें
                </p>
              </div>
            </div>

            {/* Right: Upload Photo / फ़ोटो चुनें button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                  fileInputRef.current?.click();
                }}
                className="w-full sm:w-auto h-8.5 px-4 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[11.5px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <UploadCloud size={14} />
                <span>Upload Photo / फ़ोटो चुनें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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

  // Unified image compressor & state setter for custom reference photos
  const handlePhotoProcess = (groupType, file) => {
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

          const photoField = groupType === "neckFront" ? "frontPhoto" : groupType === "neckBack" ? "backPhoto" : "sleevePhoto";
          const nameField = groupType === "neckFront" ? "frontPhotoName" : groupType === "neckBack" ? "backPhotoName" : "sleevePhotoName";
          const sizeField = groupType === "neckFront" ? "frontPhotoSize" : groupType === "neckBack" ? "backPhotoSize" : "sleevePhotoSize";

          setDesign((prev) => ({
            ...prev,
            [groupType]: "as-photo",
            [photoField]: compressedDataUrl,
            [nameField]: file.name,
            [sizeField]: `${sizeKb} KB`,
          }));
        } catch (err) {
          console.error("Photo processing error:", err);
          const photoField = groupType === "neckFront" ? "frontPhoto" : groupType === "neckBack" ? "backPhoto" : "sleevePhoto";
          const nameField = groupType === "neckFront" ? "frontPhotoName" : groupType === "neckBack" ? "backPhotoName" : "sleevePhotoName";
          const sizeField = groupType === "neckFront" ? "frontPhotoSize" : groupType === "neckBack" ? "backPhotoSize" : "sleevePhotoSize";

          setDesign((prev) => ({
            ...prev,
            [groupType]: "as-photo",
            [photoField]: e.target.result,
            [nameField]: file.name,
            [sizeField]: `${Math.round(file.size / 1024)} KB`,
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

  const handleRemovePhoto = (groupType) => {
    const photoField = groupType === "neckFront" ? "frontPhoto" : groupType === "neckBack" ? "backPhoto" : "sleevePhoto";
    const nameField = groupType === "neckFront" ? "frontPhotoName" : groupType === "neckBack" ? "backPhotoName" : "sleevePhotoName";
    const sizeField = groupType === "neckFront" ? "frontPhotoSize" : groupType === "neckBack" ? "backPhotoSize" : "sleevePhotoSize";

    setDesign((prev) => ({
      ...prev,
      [photoField]: "",
      [nameField]: "",
      [sizeField]: "",
      ...(prev[groupType] === "as-photo" ? { [groupType]: "" } : {}),
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
            <span>Bespoke Tailoring / कस्टम सिलाई</span>
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
        />
        <AsPerPhotoRow
          groupType="neckFront"
          titleEn="Front Neck"
          titleHi="अगला गला"
          designValue={design.neckFront}
          photo={design.frontPhoto}
          photoName={design.frontPhotoName}
          photoSize={design.frontPhotoSize}
          onSelect={() => selectDesign("neckFront", "as-photo")}
          onProcessFile={(file) => handlePhotoProcess("neckFront", file)}
          onRemove={() => handleRemovePhoto("neckFront")}
          onPreview={onPreview}
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
        />
        <AsPerPhotoRow
          groupType="neckBack"
          titleEn="Back Neck"
          titleHi="पिछला गला"
          designValue={design.neckBack}
          photo={design.backPhoto}
          photoName={design.backPhotoName}
          photoSize={design.backPhotoSize}
          onSelect={() => selectDesign("neckBack", "as-photo")}
          onProcessFile={(file) => handlePhotoProcess("neckBack", file)}
          onRemove={() => handleRemovePhoto("neckBack")}
          onPreview={onPreview}
        />

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
        <AsPerPhotoRow
          groupType="sleeveDesign"
          titleEn="Sleeve Design"
          titleHi="बाज़ू का डिज़ाइन"
          designValue={design.sleeveDesign}
          photo={design.sleevePhoto}
          photoName={design.sleevePhotoName}
          photoSize={design.sleevePhotoSize}
          onSelect={() => selectDesign("sleeveDesign", "as-photo")}
          onProcessFile={(file) => handlePhotoProcess("sleeveDesign", file)}
          onRemove={() => handleRemovePhoto("sleeveDesign")}
          onPreview={onPreview}
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
                    <b>Neckline Style / स्टाइल:</b> {detailModal.option.en} / {detailModal.option.hiScript || detailModal.option.hi}
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
                    <b>Back Style / पिछला स्टाइल:</b> {detailModal.option.en} / {detailModal.option.hiScript || detailModal.option.hi}
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
                    <b>Sleeve Length / लंबाई:</b> {detailModal.option.cm} · <b>Style / स्टाइल:</b> {detailModal.option.en} / {detailModal.option.hiScript || detailModal.option.hi}
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
                          src={
                            (detailModal.option.id === "as-photo" && design?.sleevePhoto) ||
                            (SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.front || SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.side)
                          }
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
                          src={
                            (detailModal.option.id === "as-photo" && design?.sleevePhoto) ||
                            (SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.side || SLEEVE_DESIGN_PHOTOS[detailModal.option.id]?.front)
                          }
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
                    <b>Sleeve Style / बाज़ू स्टाइल:</b> {detailModal.option.en} / {detailModal.option.hiScript || detailModal.option.hi}
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
