import { useState, useRef } from "react";
import { Check, Wand2, UploadCloud, Camera, Trash2, RefreshCw, Eye, X, Sparkles, Layers } from "lucide-react";

import DesignCodeDropdown from "../DesignCodeDropdown.jsx";



export default function OutfitSelectionStep({
  outfitTypes,
  outfit,
  setOutfit,
  selectOutfit,
  design,
  setDesign,
  selectionError,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [compressing, setCompressing] = useState(false);

  // Compress and convert image file to high-efficiency dataURL
  const handleFileProcess = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file (JPG, PNG, WEBP) / कृपया इमेज फ़ाइल ही चुनें।");
      return;
    }

    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDimension = 800;
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

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.72);
          const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

          // Auto-select uploaded photo & clear design code for clean exclusivity
          setOutfit((prev) => ({
            ...prev,
            refPhoto: "Upload Design Photo",
            uploadedPhoto: compressedDataUrl,
            uploadedPhotoName: file.name,
            uploadedPhotoSize: `${sizeKb} KB`,
            designCode: "",
          }));

          if (setDesign) {
            setDesign((prev) => ({
              ...prev,
              frontPhoto: compressedDataUrl,
              frontPhotoName: file.name,
              frontPhotoSize: `${sizeKb} KB`,
              backPhoto: compressedDataUrl,
              backPhotoName: file.name,
              backPhotoSize: `${sizeKb} KB`,
              sleevePhoto: compressedDataUrl,
              sleevePhotoName: file.name,
              sleevePhotoSize: `${sizeKb} KB`,
              sleeveLengthPhoto: compressedDataUrl,
              sleeveLengthPhotoName: file.name,
              sleeveLengthPhotoSize: `${sizeKb} KB`,
              neckFront: "as-photo",
              neckBack: "as-photo",
              sleeveDesign: "as-photo",
              sleeveLength: "as-photo",
            }));
          }
        } catch (err) {
          console.error("Image processing error:", err);
          setOutfit((prev) => ({
            ...prev,
            refPhoto: "Upload Design Photo",
            uploadedPhoto: e.target.result,
            uploadedPhotoName: file.name,
            uploadedPhotoSize: `${Math.round(file.size / 1024)} KB`,
            designCode: "",
          }));

          if (setDesign) {
            const rawSize = `${Math.round(file.size / 1024)} KB`;
            setDesign((prev) => ({
              ...prev,
              frontPhoto: e.target.result,
              frontPhotoName: file.name,
              frontPhotoSize: rawSize,
              backPhoto: e.target.result,
              backPhotoName: file.name,
              backPhotoSize: rawSize,
              sleevePhoto: e.target.result,
              sleevePhotoName: file.name,
              sleevePhotoSize: rawSize,
              sleeveLengthPhoto: e.target.result,
              sleeveLengthPhotoName: file.name,
              sleeveLengthPhotoSize: rawSize,
              neckFront: "as-photo",
              neckBack: "as-photo",
              sleeveDesign: "as-photo",
              sleeveLength: "as-photo",
            }));
          }
        } finally {
          setCompressing(false);
        }
      };
      img.onerror = () => {
        setCompressing(false);
        alert("Could not load image / इमेज लोड नहीं हो सकी, कृपया दूसरी फ़ोटो आज़माएं।");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFileProcess(file);
    event.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileProcess(file);
  };

  const removePhoto = () => {
    setOutfit((prev) => ({
      ...prev,
      uploadedPhoto: "",
      uploadedPhotoName: "",
      uploadedPhotoSize: "",
      refPhoto: "",
    }));
    if (setDesign) {
      setDesign((prev) => ({
        ...prev,
        frontPhoto: "",
        frontPhotoName: "",
        frontPhotoSize: "",
        backPhoto: "",
        backPhotoName: "",
        backPhotoSize: "",
        sleevePhoto: "",
        sleevePhotoName: "",
        sleevePhotoSize: "",
        sleeveLengthPhoto: "",
        sleeveLengthPhotoName: "",
        sleeveLengthPhotoSize: "",
        neckFront: prev.neckFront === "as-photo" ? "" : prev.neckFront,
        neckBack: prev.neckBack === "as-photo" ? "" : prev.neckBack,
        sleeveDesign: prev.sleeveDesign === "as-photo" ? "" : prev.sleeveDesign,
        sleeveLength: prev.sleeveLength === "as-photo" ? "" : prev.sleeveLength,
      }));
    }
  };

  return (
    <section className="step-card rounded-[28px] border bg-white p-6 md:p-8 space-y-7">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER: What shall we stitch? / क्या सिलवाना चाहते हैं? */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center gap-3">
        <span className="step-icon">
          <Wand2 size={18} />
        </span>
        <div>
          <p className="step-eyebrow">STEP 03 · YOUR OUTFIT / आपका परिधान</p>
          <h2 className="text-[25px] font-semibold text-[var(--primary-dark)]">
            What shall we stitch? / क्या सिलवाना चाहते हैं?
          </h2>
          <p className="text-[13px] text-[var(--text-light)]">
            Choose an outfit to see the right design and measurement options / सही डिज़ाइन और नाप के विकल्प देखने के लिए परिधान चुनें।
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. OUTFIT CARDS (3 OPTIONS: Blouse, Kurti, Suit Upper) */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {outfitTypes.map((item) => {
          const selected = outfit.type === item.id;
          return (
            <button
              type="button"
              key={item.id}
              aria-pressed={selected}
              onClick={() => {
                selectOutfit(item.id);
              }}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 bg-white cursor-pointer ${
                selected
                  ? "border-[var(--primary)] ring-4 ring-[var(--primary)]/15 shadow-lg transform -translate-y-1"
                  : "border-[#e9ddd3] hover:border-[var(--primary)]/50 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-[#f7efdf]">
                <img
                  src={item.image}
                  alt={item.en}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Badge */}
                {item.badge && (
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur-sm ${
                      item.popular
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white/95 text-[var(--text)] border border-[var(--border)]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Selection Checkmark */}
                <span
                  className={`absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full transition-all shadow-md ${
                    selected
                      ? "bg-[var(--primary)] text-white ring-2 ring-white"
                      : "bg-white/80 text-transparent border border-gray-300"
                  }`}
                >
                  <Check size={15} strokeWidth={3} />
                </span>
              </div>

              {/* Content Details */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="font-serif text-[16px] font-bold text-[var(--primary-dark)] group-hover:text-[var(--primary)] transition-colors">
                    {item.en} / {item.hi}
                  </h3>
                  <p className="mt-1 text-[12px] text-[var(--text-light)] leading-snug">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f2e9e2]">
                  <span
                    className={`flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-[12px] font-bold transition-all ${
                      selected
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "bg-[var(--primary-light)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check size={14} strokeWidth={3} /> Selected / चयनित
                      </>
                    ) : (
                      "Select Outfit / चुनें"
                    )}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectionError && (
        <p role="alert" className="mt-2 text-[13px] text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
          {selectionError}
        </p>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. DESIGN SELECTION: STUDIO DESIGNS OR CUSTOM PHOTO */}
      {/* ---------------------------------------------------- */}
      <div className="rounded-2xl border-2 border-[#e8ded2] bg-[#fdfbf9] p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#ece2d6]">
          <div>
            <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <Sparkles size={17} className="text-[var(--primary)]" />
              <span>Design Selection / डिज़ाइन का चयन</span>
            </h3>
            <p className="text-[12px] text-stone-500 mt-0.5">
              Choose from our studio catalog designs OR upload your own reference photo / हमारी डिज़ाइन में से चुनें या अपनी पसंद का फ़ोटो भेजें।
            </p>
          </div>
          {outfit?.type && (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] border border-[#ebdcd0]">
              For: {outfit.type}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
          {/* OPTION A: Studio Design Codes */}
          <div className="space-y-2 rounded-xl bg-white p-4 border border-[#ebdcd0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px] text-stone-800">
                Option 1: Choose from Catalog / कैटलॉग डिज़ाइन
              </span>
              {outfit?.designCode && (
                <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-0.5 rounded-full border border-[#ebdcd0]">
                  ✓ Selected: {outfit.designCode}
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-stone-500 leading-snug">
              Ready designer styles crafted for {outfit?.type || "this outfit"}.
            </p>
            <div className="pt-1">
              <DesignCodeDropdown outfit={outfit} setOutfit={setOutfit} onOpenZoom={(img) => setModalImage(img)} />
            </div>
          </div>

          {/* OPTION B: Upload Your Own Design Photo */}
          <div className="space-y-2 rounded-xl bg-white p-4 border border-[#ebdcd0] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px] text-stone-800">
                Option 2: Have your own design? / क्या आपके पास डिज़ाइन है?
              </span>
              {outfit?.uploadedPhoto && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Check size={11} strokeWidth={3} /> Selected / चयनित
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-stone-500 leading-snug">
              Upload photo from Pinterest, Instagram, or phone / अपनी पसंद का फ़ोटो अपलोड करें।
            </p>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />

            {outfit.uploadedPhoto ? (
              /* Uploaded Preview with Active Selected State & Click-to-Deselect */
              <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/40 p-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setModalImage(outfit.uploadedPhoto)}
                    className="group/thumb relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-emerald-300 bg-white shadow-2xs"
                    title="Click to view full size / बड़ी देखने के लिए क्लिक करें"
                  >
                    <img
                      src={outfit.uploadedPhoto}
                      alt="Uploaded reference"
                      className="h-full w-full object-cover transition-transform group-hover/thumb:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                      <Eye size={16} className="text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[10.5px] font-bold text-white">
                      <Check size={11} strokeWidth={3} /> Selected Photo / चयनित
                    </span>
                    <p className="mt-0.5 font-bold text-[13px] text-stone-900 truncate">
                      {outfit.uploadedPhotoName || "Custom Design Photo"}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {outfit.uploadedPhotoSize || "Image attached"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-[11px] font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Deselect / हटाएँ"
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Upload Button / Dropzone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragging
                    ? "border-[var(--primary)] bg-[var(--primary-light)]/40"
                    : "border-[#e0d3c6] bg-[#faf6f2] hover:border-[var(--primary)] hover:bg-[#fbf2ea]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xs text-[var(--primary)]">
                    {compressing ? <RefreshCw size={18} className="animate-spin" /> : <Camera size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[13px] text-[var(--primary-dark)]">
                      {compressing ? "Processing... / फ़ोटो तैयार हो रही है..." : "Upload Photo / फ़ोटो अपलोड करें"}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Click to choose or take a photo (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. NUMBER OF PIECES / कपड़ों की संख्या */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#faf6f2] border border-[#ebdcd0]">
        <label className="form-field m-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[13.5px] text-stone-800 flex items-center gap-1.5">
              <Layers size={15} className="text-[var(--primary)]" />
              <span>Number of pieces / कपड़ों की संख्या</span>
            </span>
            <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[var(--primary)] border border-[#ebdcd0]">
              Total: {outfit.pieces || 1} Piece(s) / पीस
            </span>
          </div>
          <select
            value={outfit.pieces || "1"}
            onChange={(event) => setOutfit({ ...outfit, pieces: event.target.value })}
            className="bg-white font-medium"
          >
            {["1", "2", "3", "4", "5+"].map((piece) => (
              <option key={piece} value={piece}>
                {piece} Piece{piece !== "1" ? "s" : ""} / {piece} कपड़ा
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 6. SPECIAL REQUESTS (OPTIONAL) */}
      {/* ---------------------------------------------------- */}
      <label className="form-field">
        <span className="font-bold text-[13px] text-stone-800">
          Special requests / कोई विशेष निर्देश <small className="text-[11px] font-normal text-stone-500">(Optional / वैकल्पिक)</small>
        </span>
        <textarea
          value={outfit.specialReq || ""}
          onChange={(event) => setOutfit({ ...outfit, specialReq: event.target.value })}
          placeholder="Latkan, piping, border, deep gala, or finishing details / लटकन, पाइपिंग, बॉर्डर, या कोई विशेष काम..."
          rows={3}
        />
      </label>

      {/* ---------------------------------------------------- */}
      {/* FULL PHOTO LIGHTBOX MODAL */}
      {/* ---------------------------------------------------- */}
      {modalImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3 bg-stone-50">
              <span className="font-bold text-[14px] text-[var(--text)]">Design Reference Photo / डिज़ाइन रेफ़रेंस फ़ोटो</span>
              <button
                type="button"
                onClick={() => setModalImage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-stone-950 p-2 flex items-center justify-center">
              <img
                src={modalImage}
                alt="Design Reference full view"
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
